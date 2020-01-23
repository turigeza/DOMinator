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
import DOMinatorCustomHtmlView from "./DOMinatorCustomHtmlView"

window.DOMinator = class DOMinator {
    // editorSchema
    // editorView
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
        this.editorView = new EditorView(document.querySelector("#editor"), {

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
                custom_html(node, view, getPos) { return new DOMinatorCustomHtmlView(node, view, getPos) }
            }
        })
    }

    addNodes(nodes, newNodes){
        Object.keys(newNodes).forEach(key => {
            nodes = nodes.addToEnd(key, newNodes[key]);
            // console.log('adding-'+key);
        });
        return nodes;
    }



}




// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.

// 1) Put 'view' on window object just for easy inspection/debugging
// 2) '#editor' is the ID of the DOM element that will host the DOM.
// window.view = new EditorView(document.querySelector("#editor"), {
//
//     state: EditorState.create({
//
//         // Here the document state is read from the DOM, the HTML markup on
//         // the simple file, public/index.html page that contains the editor;
//         // '#content' is the ID of the DOM element that has your pre-prepared content
//         // to be injected into the editor.  The only reason this is done in this
//         // demo project is to prevent you from starting with a blank editor.
//         doc: DOMParser.fromSchema(mySchema).parse(document.querySelector("#content")),
//
//         // Instantiate all the plugins to make a very basic editor
//         plugins: exampleSetup({schema: mySchema})
//
//     })//,
//
//     // The rest is commented out as you have a basic editor.
//     // This section uses a sort of 'wiretap' into ProseMirror's event flow to
//     // let you see inside the basic editor model.
//
//     //dispatchTransaction( transaction ) {
//         // console.log("Document size went from", transaction.before.content.size,
//         //            "to", transaction.doc.content.size)
//
//         // console.log( 'State', JSON.stringify( this.state.toJSON(), null, 4 ))
//
//         // let newState = window.view.state.apply(transaction)
//         //window.view.updateState(newState)
//     //}
// })
