import {Plugin, EditorState} from "prosemirror-state"
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
import {schema} from "./DOMinatorSchemaBasic"
import schemaDominator from "./DOMinatorSchemaExtended"
import DOMinatorMenu from "./DOMinatorMenu"

import {paddingClasses, marginClasses} from "./DOMinatorPaddingsAndMargins"

// node views
import CustomHtmlView from "./NodeViews/CustomHtmlView"
import PhotographCaptionView from "./NodeViews/PhotographCaptionView"
import ImageView from "./NodeViews/ImageView"

window.DOMinator = class DOMinator {
    // editorSchema
    // view -view editors
    // menuItems

    constructor(options) {
        const implementMessage = () => alert('It is up to you to implement this.');

        // init options
        const defaults = {
            container: '',

            // DOMinator hands over the ui which don't want to take care of. These are callback functions.
            pageSettings: implementMessage,     // the ui which takes care of managing the page related information url, folder, tags, keyword, template etc
            showRevisions: implementMessage,    // the ui for selecting revisions saving them naming them making them live shedule delete them etc
            shedule: implementMessage,          // the ui for saving and sheduling this revision
            newPage: implementMessage,          // the ui for screating a new page
            goLive: implementMessage,           // the ui for going live and saving a revision
            exit: implementMessage,             // the ui for going live and saving a revision
            photo: implementMessage,             // the ui for going live and saving a revision

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
           }


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
        nodes = this.addNodes(nodes, schemaDominator);

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
                    keymap(buildKeymap(this.editorSchema, this.options.mapKeys)),
                    keymap(baseKeymap),
                    dropCursor(),
                    gapCursor(),
                    history(),
                    new Plugin({
                        key: 'DOMinatorMenu',
                        view(editorView) {
                            let menuView = new DOMinatorMenu(that, editorView);
                            editorView.dom.parentNode.insertBefore(menuView.dom, editorView.dom);
                            return menuView;
                        }
                    }),
                    new Plugin({
                        props: {
                            attributes: {
                                class: "ProseMirror-example-setup-style"
                            }
                        }
                    })
                ]

            }),
            nodeViews: {
                custom_html(node, view, getPos) { return new CustomHtmlView(node, view, getPos) },
                photograph_caption(node, view, getPos) { return new PhotographCaptionView(node, view, getPos) },
                image(node, view, getPos) { return new ImageView(node, view, getPos) },
            },
            // listen to transactions
            // dispatchTransaction: (transaction) => {
            //     console.log(transaction.meta);
            //     // console.log("Document size went from", transaction.before.content.size,
            //     // "to", transaction.doc.content.size)
            //     let newState = this.view.state.apply(transaction)
            //     this.view.updateState(newState)
            // }
        })
    }

    addNodes(nodes, newNodes){
        Object.keys(newNodes).forEach(key => {
            nodes = nodes.addToEnd(key, newNodes[key]);
        });
        return nodes;
    }
}
