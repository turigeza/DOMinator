import {
    Plugin,
    EditorState,
    TextSelection,
    NodeSelection
}
from "prosemirror-state"
import {
    EditorView
} from "prosemirror-view"
import {
    Schema,
    DOMParser,
    DOMSerializer
} from "prosemirror-model"
import {
    addListNodes
} from "prosemirror-schema-list"
import {
    keymap
} from "prosemirror-keymap"
import {
    history
} from "prosemirror-history"
import {
    dropCursor
} from "prosemirror-dropcursor"
import {
    gapCursor
} from "prosemirror-gapcursor"

import {
    baseKeymap
} from "./prosemirrorcommands"
import {
    buildKeymap
} from "./DOMinatorKeymap"
import {
    buildInputRules
} from "./DOMinatrorInputrules"
import {
    schema
} from "./DOMinatorSchema"
import DOMinatorMenu from "./DOMinatorMenu"

import {
    paddingClasses,
    marginClasses
} from "./DOMinatorPaddingsAndMargins"

// node views
import CustomHtmlView from "./NodeViews/CustomHtmlView"
import PhotographCaptionView from "./NodeViews/PhotographCaptionView"
import ImageView from "./NodeViews/ImageView"
import CarouselView from "./NodeViews/CarouselView"

// actions
import {
    insertDownloads,
    changeAttributeOnNode,
    insertBlock
} from "./DOMinatorActions"

import CodeMirror from "codemirror"
// import xml from "codemirror/mode/xml/xml"
// import javascript from "codemirror/mode/javascript/javascript"
// import css from "codemirror/mode/css/css"
import htmlmixed from "codemirror/mode/htmlmixed/htmlmixed"
import formatting from "codemirror-formatting"

window.DOMinator = class DOMinator {
    // options
    // editorSchema
    // view -view editors
    // onButton
    // CodeEditorWindow
    // codemirror
    // menu
    // codemirror - instance for the code editing bit
    // domNode
    // dom
    // onChangedTimeout = null; // for the debounce of the onChange
    constructor(options) {

        // init options
        const defaults = {
            source: null,
            target: null,
            listeners: {}, //

            // DOMinator hands over the ui which don't want to take care of. These are callback functions.
            pageSettings: this.implementMessage('pageSettings'), // the ui which takes care of managing the page related information url, folder, tags, keyword, template etc
            // showRevisions: this.implementMessage('showRevisions'), this is beter managed outside of the editor
            schedule: this.implementMessage('schedule'), // the ui for saving and sheduling this revision
            newPage: this.implementMessage('newPage'), // the ui for screating a new page
            goLive: this.implementMessage('goLive'), // the ui for going live and saving a revision
            pageThumbnail: this.implementMessage('pageThumbnail'),

            photograph: this.implementMessage('photograph'), // the ui for going live and saving a revision
            downloads: this.implementMessage('downloads'),
            custom_html: this.implementMessage('custom_html'),

            // carousel related
            carousel: this.implementMessage('carousel'),
            carouselAddSlide: this.implementMessage('carouselAddSlide'),
            carouselRemoveSlide: this.implementMessage('carouselRemoveSlide'),
            carouselMoveSlideLeft: this.implementMessage('carouselMoveSlideLeft'),
            carouselMoveSlideRight: this.implementMessage('carouselMoveSlideRight'),
            carouselToggleSetting: this.implementMessage('carouselToggleSetting'),
            carouselUpdateButton: () => {},
            carouselGet: () => {},
            carouselSet: this.implementMessage('carouselSet'),

            // custom html related
            // customHtmlSave: ()=>{},
            customHtmlFormat: () => {},

            paddingClasses: paddingClasses,
            marginClasses: marginClasses,
            textAlignClasses: {
                left: 'text-left',
                right: 'text-right',
                center: 'text-center',
                // justify: 'text-justify',
            },
            linkClasses: {
                primary: 'd-button-primary',
                success: 'd-button-success',
                warning: 'd-button-warning',
                default: 'd-button-default',
                danger: 'd-button-danger',
                info: 'd-button-info'
            },
            floatClasses: {
                left: 'pull-left',
                right: 'pull-right',
                center: 'horizontal-margin-auto',
            },
            blockSizeClasses: {
                'auto': 'width-auto',
                '25': 'width-25',
                '33': 'width-33',
                '50': 'width-50',
                '66': 'width-66',
                '75': 'width-75',
                '100': 'width-100',
            },
            scrollMargin: 150,
            saveTimout: 500,
            menu: {}
        };

        this.options = {
            ...defaults,
            ...options
        };

        if (!this.options.source) {
            throw 'Options must contain a source dom element. For example dom: document.getElementById("content").';
        }
        if (!this.options.target) {
            throw 'Options must contain a target dom element. For example dom: document.getElementById("content").';
        }

        // init editorSchema
        let nodes = addListNodes(schema.spec.nodes, "paragraph block*", "block");
        nodes = addListNodes(nodes, "paragraph block*", "block");

        this.editorSchema = new Schema({
            nodes: nodes,
            marks: schema.spec.marks
        })

        this.initCodeEditingWindow();
        this.initOnButton();

        if (typeof this.options.afterConstruct === 'function') {
            this.options.afterConstruct(this);
        }
    }

    isOn(){
        return this.view ? true : false;
    }

    toggle() {
        if (this.isOn()) {
            this.off();
        }else{
            this.on();
        }
    }

    async off() {

        if (typeof this.options.beforeOff === 'function') {
            try {
                await this.options.beforeOff(this);
            } catch(e) {
                console.warn('this.options.beforeOff was rejeted');
                return false;
            }
        }

        const html = this.getHTML();

        this.onButton.classList.remove('active');
        document.body.classList.remove("dominatorMenuActive");
        this.codeEditingWindowClose();
        this.view.$d_listeners = null;
        this.view.destroy();
        this.onButton.visibility = 'visible';

        this.view = null;
        this.menu = null;

        this.options.target.style.display = 'none';
        this.options.source.style.display = 'block';

        this.options.source.innerHTML = html;
        clearTimeout(this.onChangedTimeout);
        if ( typeof this.options.afterOff === 'function' ) {
            this.options.afterOff(this);
        }
    }

    changed(){
        // timeout for save
        clearTimeout(this.onChangedTimeout);

        this.onChangedTimeout = setTimeout(() => {
            if(typeof this.options.onChange === 'function'){
                this.options.onChange(this);
            }
        }, this.options.saveTimout);
    }

    async on() {

        if (this.view) {
            return false;
        }

        if (typeof this.options.beforeOn === 'function') {
            try {
                await this.options.beforeOn(this);
            } catch(e) {
                console.warn('this.options.beforeOn was rejeted');
                return false;
            }
        }

        this.onButton.classList.add('active');
        document.body.classList.add("dominatorMenuActive");

        var that = this;
        this.onButton.visibility = 'hidden';

        // init view
        this.view = new EditorView(this.options.target, {
            state: EditorState.create({
                doc: DOMParser.fromSchema(this.editorSchema).parse(this.options.source),
                plugins: [
                    buildInputRules(this.editorSchema),
                    new Plugin({
                        key: 'DOMinatorMenu',
                        view(editorView) {
                            let menuView = new DOMinatorMenu(that, editorView);
                            document.body.prepend(menuView.dom);
                            that.menu = menuView;
                            return menuView;
                        },
                        props: {
                            handleKeyDown: (view, event) => {
                                that.changed();
                                if (event.which === 13 && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
                                    const selection = view.state.selection;

                                    if (selection.empty && selection.$cursor) {
                                        const $cursor = selection.$cursor;
                                        const depth = selection.$cursor.depth;
                                        const parent = $cursor.parent.type.name;
                                        const grandparentNode = $cursor.node(depth - 1); // selection.$cursor.depth > 0 ? selection.$cursor.node(depth-1) : null;
                                        const grandparent = grandparentNode ? grandparentNode.type.name : '';


                                        // create a new paragraph after the photograph
                                        if (parent === "photograph_caption") {
                                            const pos = $cursor.end() + 2;
                                            const p = this.editorSchema.nodes.paragraph.createAndFill();

                                            view.dispatch(view.state.tr.insert(pos, p));
                                            view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, pos + 1)).scrollIntoView());
                                            return true;

                                            // break out of layout
                                        } else if (grandparent.includes('cl_') && !$cursor.nodeAfter && !$cursor.nodeBefore) {
                                            const pos = $cursor.end() + 3;
                                            if ($cursor.after(depth - 2) !== pos) {
                                                return false;
                                            }

                                            const p = this.editorSchema.nodes.paragraph.createAndFill();

                                            let transaction;
                                            view.dispatch(view.state.tr.insert(pos, p));

                                            transaction = view.state.tr;
                                            transaction.setMeta("addToHistory", false);
                                            view.dispatch(transaction.setSelection(TextSelection.create(view.state.doc, pos)).scrollIntoView());

                                            // view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, pos-5, pos-2)).scrollIntoView());
                                            transaction = view.state.tr;
                                            transaction.setMeta("addToHistory", false);
                                            view.dispatch(transaction.delete(pos - 5, pos - 2));
                                            return true;
                                        } else if (parent === 'download_link' && !$cursor.nodeBefore && !$cursor.nodeAfter) {
                                            const before = $cursor.before();
                                            const after = $cursor.after();

                                            if ($cursor.after(depth - 2) !== after + 2) {
                                                return false;
                                            }

                                            const p = this.editorSchema.nodes.paragraph.createAndFill();

                                            let transaction;
                                            view.dispatch(view.state.tr.insert(after + 1, p));

                                            transaction = view.state.tr;
                                            transaction.setMeta("addToHistory", false);
                                            view.dispatch(transaction.setSelection(TextSelection.create(view.state.doc, after + 2)).scrollIntoView());

                                            transaction = view.state.tr;
                                            transaction.setMeta("addToHistory", false);
                                            view.dispatch(transaction.delete(before, after));
                                            return true;
                                        } else {

                                        }
                                    }
                                }

                                return false;
                            },
                            attributes: {
                                class: "DOMinator"
                            },
                            scrollMargin: that.options.scrollMargin
                        }
                    }),
                    keymap(buildKeymap(this.editorSchema, this.options.mapKeys)),
                    keymap(baseKeymap),
                    dropCursor(),
                    gapCursor(),
                    history()
                ]
            }),
            nodeViews: {
                custom_html(node, view, getPos) {
                    view.$d_listeners = that.options.listeners;
                    return new CustomHtmlView(node, view, getPos)
                },
                photograph_caption(node, view, getPos) {
                    view.$d_listeners = that.options.listeners;
                    return new PhotographCaptionView(node, view, getPos)
                },
                carousel(node, view, getPos) {
                    view.$d_listeners = that.options.listeners;
                    return new CarouselView(node, view, getPos)
                },
                image(node, view, getPos) {
                    view.$d_listeners = that.options.listeners;
                    return new ImageView(node, view, getPos)
                },
            },
            // listen to transactions
            // dispatchTransaction: (transaction) => {
            //     console.log(transaction);
            //     let newState = this.view.state.apply(transaction)
            //     this.view.updateState(newState)
            // }
        });

        this.view.$d_listeners = this.options.listeners;

        this.options.target.style.display = 'block';
        this.options.source.style.display = 'none';
        if (typeof this.options.afterOn === 'function') {
            this.options.afterOn(this);
        }

        return true;
    }

    initOnButton() {
        this.onButton = document.getElementById('DOMinatorOnButton');
        if (!this.onButton) {
            this.onButton = document.createElement('button');
            this.onButton.setAttribute('id', 'DOMinatorOnButton');
            this.onButton.setAttribute('tabindex', '0');
            this.onButton.setAttribute("title", 'Edit this page.');
            const icon = document.createElement("i");
            icon.className = 'fa fa-pencil'
            icon.setAttribute('aria-hidden', 'true');
            this.onButton.appendChild(icon);

            // this.CodeEditorWindow.style.visibility = 'hidden';
            document.body.appendChild(this.onButton);
            this.onButton.addEventListener('click', async () => {
                if (this.view) {
                    const rs = await this.off();
                    if(rs){
                        this.onButton.classList.remove('active');
                    }
                } else {
                    const rs = await this.on();
                    if(rs){
                        this.onButton.classList.add('active');
                    }
                }

            });
        }
    }

    initCodeEditingWindow() {
        this.CodeEditorWindow = document.getElementById("DOMinatorCodeEditor");
        if (!this.CodeEditorWindow) {
            this.CodeEditorWindow = document.createElement('div');
            this.CodeEditorWindow.setAttribute('id', 'DOMinatorCodeEditor');
            this.CodeEditorWindow.style.visibility = 'hidden';

            document.body.appendChild(this.CodeEditorWindow);
            this.codemirror = new CodeMirror(this.CodeEditorWindow, {
                value: ``,
                mode: "text/html",
                // theme: 'base16-dark',
                lineNumbers: true,
                // extraKeys: this.codeMirrorKeymap()
            });

            let timeout = null;
            this.codemirror.on('change', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.codeEditingWindowSave();
                }, 500);
            })
        }
    }

    codeEditingWindowOpen() {
        if (!this.menu.activeBlock || this.menu.activeBlock.type.name !== "custom_html") {
            return;
        }

        this.codemirror.setValue(this.menu.activeBlock.attrs.html);
        this.CodeEditorWindow.style.visibility = "visible";
    }

    codeEditingWindowFormat() {
        CodeMirror.commands["selectAll"](this.codemirror);
        this.codemirror.autoFormatRange(this.codemirror.getCursor(true), this.codemirror.getCursor(false));
    }

    codeEditingWindowSave() {
        const html = this.codemirror.getValue();
        changeAttributeOnNode(this.menu, 'html', html);
    }

    codeEditingWindowClose() {
        if (this.CodeEditorWindow) {
            this.CodeEditorWindow.style.visibility = "hidden";
        }
    }

    // comes from TIPTAP https://tiptap.scrumpy.io/
    getHTML() {
        const div = document.createElement('div')
        const fragment = DOMSerializer
            .fromSchema(this.editorSchema)
            .serializeFragment(this.view.state.doc.content)

        div.appendChild(fragment)

        return div.innerHTML
    }

    // comes from TIPTAP https://tiptap.scrumpy.io/
    getJSON() {
        return this.view.state.doc.toJSON()
    }

    insertDownloads(items) {
        // [ { href: '/', title: 'I am the title.' } ]
        return insertDownloads(this.menu, items);
    }

    insertPhotograph(photo) {
        if (!photo['medium']) {
            throw 'The medium size for an image is mandatory!';
        }

        const view = this.menu.view;
        const selection = view.state.selection;
        const state = view.state;
        const pos = selection.from;

        // caption
        const captionText = state.schema.text(photo.caption || 'Caption');
        const photographCaption = state.schema.nodes.photograph_caption.create({}, captionText);

        const dom = view.domAtPos(pos);
        const width = dom.node.offsetWidth;

        let src = photo['medium'];
        if (width > 650 && photo['large']) {
            src = photo['large'];
        }

        // image
        const imageAttrs = {
            'data-photograph_id': photo['id'] || null,
            'data-photograph_medium': photo['medium'],
            'data-photograph_large': photo['large'] || photo['medium'],
            src: src,
            alt: photo['alt'] || ''
        };

        const image = state.schema.nodes.image.create(imageAttrs);

        const photograph = state.schema.nodes.photograph.create(photo, [image, photographCaption]);
        insertBlock(this.menu, photograph);
    }

    selectNode(pos) {
        const newSelection = NodeSelection.create(this.menu.view.state.doc, pos);
        this.menu.view.dispatch(this.menu.view.state.tr.setSelection(newSelection)); //.scrollIntoView()
    }

    insertCarousel(html) {
        const view = this.menu.view;
        const selection = view.state.selection;
        const state = view.state;
        const pos = selection.from;

        const carousel = state.schema.nodes.carousel.create({
            html: html
        });
        insertBlock(this.menu, carousel);
        //
        // let tr = state.tr.insert(pos + 1, carousel);
        // view.dispatch(tr);
        //
        // tr = view.state.tr;
        // tr.setMeta("addToHistory", false);
        // const newSelection = NodeSelection.create(view.state.doc, pos + 1);
        // view.dispatch(tr.setSelection(newSelection));
    }

    insertHtml(html) {
        const view = this.menu.view;
        const selection = view.state.selection;
        const state = view.state;
        const pos = selection.from;

        const htmlBlock = state.schema.nodes.custom_html.create({
            html: html
        });

        insertBlock(this.menu, htmlBlock);
    }

    updateCarousel(html) {
        changeAttributeOnNode(this.menu, 'html', html);
    }

    implementMessage(key) {
        return () => {
            console.warn(`"${key} is not implemented"`);
        }
    }
}
