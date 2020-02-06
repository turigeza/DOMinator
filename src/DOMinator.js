// import {
//     Selection,
//     ,
//     NodeSelection,
//     AllSelection
// } from "prosemirror-state"
import {
    Plugin,
    EditorState,
    TextSelection,
    NodeSelection
}
from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {Schema, DOMParser} from "prosemirror-model"
import {addListNodes} from "prosemirror-schema-list"
import {keymap} from "prosemirror-keymap"
import {history} from "prosemirror-history"
import {dropCursor} from "prosemirror-dropcursor"
import {gapCursor} from "prosemirror-gapcursor"

import {baseKeymap} from "./prosemirrorcommands"
import {buildKeymap} from "./DOMinatorKeymap"
import {buildInputRules} from "./DOMinatrorInputrules"
import {schema} from "./DOMinatorSchema"
import DOMinatorMenu from "./DOMinatorMenu"

import {paddingClasses, marginClasses} from "./DOMinatorPaddingsAndMargins"

// node views
import CustomHtmlView from "./NodeViews/CustomHtmlView"
import PhotographCaptionView from "./NodeViews/PhotographCaptionView"
import ImageView from "./NodeViews/ImageView"
import CarouselView from "./NodeViews/CarouselView"

// actions
import {
    insertDownloads,
    changeAttributeOnNode

} from "./DOMinatorActions"

window.DOMinator = class DOMinator {
    // editorSchema
    // view -view editors
    // menuItems
    constructor(options) {

        const implementMessage = () => alert('It is up to you to implement this.');

        // init options
        const defaults = {
            container: '',
            listeners: {}, //

            // DOMinator hands over the ui which don't want to take care of. These are callback functions.
            pageSettings: implementMessage,     // the ui which takes care of managing the page related information url, folder, tags, keyword, template etc
            showRevisions: implementMessage,    // the ui for selecting revisions saving them naming them making them live shedule delete them etc
            shedule: implementMessage,          // the ui for saving and sheduling this revision
            newPage: implementMessage,          // the ui for screating a new page
            goLive: implementMessage,           // the ui for going live and saving a revision
            exit: implementMessage,             // the ui for going live and saving a revision
            photograph: implementMessage,             // the ui for going live and saving a revision
            downloads: implementMessage,
            carouselAddSlide: implementMessage,
            carouselRemoveSlide: implementMessage,
            carouselMoveSlideLeft: implementMessage,
            carouselMoveSlideRight: implementMessage,
            carouselToggleSetting: implementMessage,
            paddingClasses: paddingClasses,
            marginClasses: marginClasses,
            textAlignClasses: {
                left: 'text-left',
                right: 'text-right',
                center: 'text-center',
                // justify: 'text-justify',
            },
            photoFloatClasses: {
                left: 'pull-left',
                right: 'pull-right',
                center: 'horizontal-margin-auto',
            },
            photoSizeClasses: {
               '25': 'width-25',
               '33': 'width-33',
               '50': 'width-50',
               '66': 'width-66',
               '75': 'width-75',
               '100': 'width-100',
           },
           menu: {}
        };

        this.options = {
            ...defaults,
            ...options
        };

        if (!this.options.container) {
            throw 'Container selector is empty!';
        }

        // init editorSchema
        let nodes = addListNodes(schema.spec.nodes, "paragraph block*", "block");
        nodes = addListNodes(nodes, "paragraph block*", "block");

        this.editorSchema = new Schema({
            nodes: nodes,
            marks: schema.spec.marks
        })

        var that = this;

        // init view
        this.view = new EditorView(document.querySelector("#editor"), {

            state: EditorState.create({
                doc: DOMParser.fromSchema(this.editorSchema).parse(document.querySelector("#content")),
                // plugins: exampleSetup({schema: this.editorSchema}),
                plugins: [
                    buildInputRules(this.editorSchema),
                    new Plugin({
                        key: 'DOMinatorMenu',
                        view(editorView) {
                            let menuView = new DOMinatorMenu(that, editorView);
                            editorView.dom.parentNode.insertBefore(menuView.dom, editorView.dom);
                            that.menu = menuView;
                            return menuView;
                        },
                        props: {
                            handleKeyDown: (view, event)=>{
                                if(event.which === 13 && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey){
                                    const selection = view.state.selection;

                                    if(selection.empty && selection.$cursor){
                                        const $cursor = selection.$cursor;
                                        const depth = selection.$cursor.depth;
                                        const parent = $cursor.parent.type.name;
                                        const grandparentNode = $cursor.node(depth-1); // selection.$cursor.depth > 0 ? selection.$cursor.node(depth-1) : null;
                                        const grandparent = grandparentNode ? grandparentNode.type.name : '';


                                        // create a new paragraph after the photograph
                                        if(parent === "photograph_caption"){
                                            const pos = $cursor.end()+2;
                                            const p = this.editorSchema.nodes.paragraph.createAndFill();

                                            view.dispatch(view.state.tr.insert( pos, p ));
                                            view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, pos+1)).scrollIntoView());
                                            return true;

                                        // break out of layout
                                        }else if(grandparent.includes('cl_') && !$cursor.nodeAfter && !$cursor.nodeBefore  ){
                                            const pos = $cursor.end()+3;
                                            if($cursor.after(depth-2) !== pos){
                                                return false;
                                            }

                                            const p = this.editorSchema.nodes.paragraph.createAndFill();

                                            let transaction;
                                            view.dispatch(view.state.tr.insert( pos, p ));

                                            transaction = view.state.tr;
                                            transaction.setMeta("addToHistory", false);
                                            view.dispatch(transaction.setSelection(TextSelection.create(view.state.doc, pos)).scrollIntoView());

                                            // view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, pos-5, pos-2)).scrollIntoView());
                                            transaction = view.state.tr;
                                            transaction.setMeta("addToHistory", false);
                                            view.dispatch(transaction.delete( pos-5, pos-2));
                                            return true;
                                        }else if(parent === 'download_link' && !$cursor.nodeBefore && !$cursor.nodeAfter){
                                            const before = $cursor.before();
                                            const after = $cursor.after();

                                            if($cursor.after(depth-2) !== after+2){
                                                return false;
                                            }

                                            const p = this.editorSchema.nodes.paragraph.createAndFill();

                                            let transaction;
                                            view.dispatch(view.state.tr.insert( after + 1, p ));

                                            transaction = view.state.tr;
                                            transaction.setMeta("addToHistory", false);
                                            view.dispatch(transaction.setSelection(TextSelection.create(view.state.doc, after + 2)).scrollIntoView());

                                            transaction = view.state.tr;
                                            transaction.setMeta("addToHistory", false);
                                            view.dispatch(transaction.delete( before, after));
                                            return true;
                                        }else{
                                            console.log('4');
                                        }
                                    }
                                }

                                return false;
                            }
                        }
                    }),
                    keymap(buildKeymap(this.editorSchema, this.options.mapKeys)),
                    keymap(baseKeymap),
                    dropCursor(),
                    gapCursor(),
                    history(),
                    new Plugin({
                        props: {
                            attributes: {
                                class: "ProseMirror-example-setup-style"
                            },

                        }
                    }),
                ]

            }),
            nodeViews: {
                custom_html(node, view, getPos) { return new CustomHtmlView(node, view, getPos) },
                photograph_caption(node, view, getPos) { return new PhotographCaptionView(node, view, getPos) },
                carousel(node, view, getPos) { return new CarouselView(node, view, getPos) },
                image(node, view, getPos) { return new ImageView(node, view, getPos) },
            },
            // listen to transactions
            // dispatchTransaction: (transaction) => {
            //     console.log(transaction);
            //     let newState = this.view.state.apply(transaction)
            //     this.view.updateState(newState)
            // }
        });
        this.view.$d_listeners = this.options.listeners;


    }

    // comes from TIPTAP https://tiptap.scrumpy.io/
    getHTML() {
        const div = document.createElement('div')
        const fragment = DOMSerializer
        .fromSchema(this.schema)
        .serializeFragment(this.state.doc.content)

        div.appendChild(fragment)

        return div.innerHTML
    }

    // comes from TIPTAP https://tiptap.scrumpy.io/
    getJSON() {
        return this.state.doc.toJSON()
    }

    insertDownloads(items){
        // [ { href: '/', title: 'I am the title.' } ]
        return insertDownloads(this.menu, items);
    }

    insertPhotograph(photo){
        if(!photo['medium']){
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
        if(width > 650 && photo['large']){
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
        let tr = state.tr.insert(pos+1, photograph);
        view.dispatch(tr);

        tr = view.state.tr;
        tr.setMeta("addToHistory", false);
        const newSelection = NodeSelection.create(view.state.doc, pos+1);
        view.dispatch(tr.setSelection(newSelection));

    }

    selectNode(pos){
        const newSelection = NodeSelection.create(this.menu.view.state.doc, pos);
        this.menu.view.dispatch(this.menu.view.state.tr.setSelection(newSelection));
    }

    updateCarousel(html, version){
        console.log('updateCarousel');
        console.log(version);
        changeAttributeOnNode(this.menu, { html: html, 'data-version': version });
    }
}
