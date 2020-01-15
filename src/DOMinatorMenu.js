import {Plugin} from "prosemirror-state"
import {baseKeymap, toggleMark, setBlockType, wrapIn, clearFormatting} from "./DOMinatorCommands"
import {schema} from "./DOMinatorSchemaBasic"

import DOMinatorMenuButton from "./DOMinatorMenuButton"
import DOMinatorMenuDropdown from "./DOMinatorMenuDropdown"
import DOMinatorMenuInput from "./DOMinatorMenuInput"
import DOMinatorSubMenu from "./DOMinatorSubMenu"
import {
    Selection,
    TextSelection,
    NodeSelection,
    AllSelection
} from "prosemirror-state"

import { getMarkRange } from "./DOMinatorUtilities"
export default class DOMinatorMenu {

    // items - menu items
    // editorView -
    // dom - menu div
    // mousedown - true : false helps us debounce selection change
    // dominator
    // editorSchema
    // leftMenuDom
    // rightMenuDom
    // submenus
    // activeMark - update sets this to match the menu showing

    constructor(dominator, editorView) {
        this.dominator = dominator;

        this.editorView = editorView;
        this.editorSchema = dominator.editorSchema;

        this.initMenu();

        this.update();
        document.body.classList.add("dominatorMenuActive");

        // this.dom.addEventListener("mousedown", e => {
        //     e.preventDefault()
        //     this.editorView.focus()
        //     // this.items.forEach(({command, dom}) => {
        //     //     if (dom.contains(e.target)){
        //     //         command(this.editorView.state, this.editorView.dispatch, this.editorView);
        //     //     }
        //     // })
        // })

        this.editorView.dom.addEventListener("mousedown", e => {
            this.mousedown = true;
        });

        this.editorView.dom.addEventListener("mouseup", e => {
            this.mousedown = false;
            this.update(this.editorView);
        });
    }

    update(view, lastState) {
        this.activeMark = null;
        if(this.mousedown){
            return;
        }

        if(view){
            const selection = view.state.selection;

            // make all submenues invisible
            Object.keys(this.submenus).forEach(key=>{
                this.submenus[key].hide();
            });

            if(selection.constructor.name === 'TextSelection'){
                // watch out because text selection responds to none editable custom html selection as well ::: this has now been solved sort of
                console.log('Text Selection');

                if(selection.empty){
                    let marks = selection.$cursor.marks();
                    if(marks.length > 0){
                        for (var i = 0; i < marks.length; i++) {
                            let mark = marks[i];
                            if(this.submenus[mark.type.name]){
                                this.submenus[mark.type.name].show(view);
                                this.activeMark = mark;
                                break;
                            }
                        }
                    }else{
                        const blockName = selection.$head.parent.type.name
                        if(this.submenus[selection.$head.parent.type.name]){
                            this.submenus[selection.$head.parent.type.name].show(view);
                        }
                    }
                }else{
                    // there is a selection show inline menu
                    this.submenus.inline.show(view);
                }
            }else if (selection.constructor.name === 'NodeSelection'){
                if(this.submenus[selection.node.type.name]){
                    this.submenus[selection.node.type.name].show(view);
                }
            }
        }
    }

    initMenu(){
        this.submenus = {
            inline: new DOMinatorSubMenu({
                key: 'inline',
                items: [
                    new DOMinatorMenuButton ({
                        key: 'bold',
                        icon: 'bold',
                        command: toggleMark(this.editorSchema.marks.b)
                    }),
                    new DOMinatorMenuButton ({
                        key: 'italic',
                        icon: 'italic',
                        command: toggleMark(this.editorSchema.marks.i)
                    }),
                    new DOMinatorMenuButton ({
                        key: 'underline',
                        icon: 'underline',
                        command: toggleMark(this.editorSchema.marks.u)
                    }),
                    new DOMinatorMenuButton ({
                        key: 'link',
                        icon: 'link',
                        command: toggleMark(this.editorSchema.marks.link)
                    }),
                    new DOMinatorMenuButton ({
                        key: 'strikethrough',
                        icon: 'strikethrough',
                        command: toggleMark(this.editorSchema.marks.del)
                    }),
                    new DOMinatorMenuButton ({
                        key: 'subscript',
                        icon: 'subscript',
                        command: toggleMark(this.editorSchema.marks.sub)
                    }),
                    new DOMinatorMenuButton ({
                        key: 'superscript',
                        icon: 'superscript',
                        command: toggleMark(this.editorSchema.marks.sup)
                    }),
                    new DOMinatorMenuButton ({
                        key: 'pencil',
                        icon: 'pencil',
                        command: toggleMark(this.editorSchema.marks.span)
                    }),
                    new DOMinatorMenuButton ({
                        key: 'remove_formatting',
                        icon: 'eraser',
                        command: clearFormatting(this.editorSchema.marks)
                    }),
                ]
            }),
            link: new DOMinatorSubMenu({
                key: 'link',
                items: [
                    new DOMinatorMenuInput ({
                        key: 'href',
                        command: (val, view) => {
                            let { from, to } = getMarkRange(view.state.selection.$cursor, this.activeMark);

                            console.log( this.activeMark );
                            console.log(from);
                            console.log(to);

                            const attr = { ...{}, ...this.activeMark.type.instance.attrs, href: val };

                            // const hasMark = doc.rangeHasMark(from, to, type)
                            //
                            // if (hasMark) {
                            //   tr.removeMark(from, to, type)
                            // }

                            view.dispatch(view.state.tr.addMark(from, to, this.activeMark.type.create(attr)))
                            console.log(val);
                        }
                    }),
                    new DOMinatorMenuButton ({
                        key: 'unlink',
                        icon: 'chain-broken',
                        command: toggleMark(this.editorSchema.marks.strong)
                    }),
                    new DOMinatorMenuButton ({
                        key: 'link_external',
                        icon: 'external-link',
                        command: toggleMark(this.editorSchema.marks.strong)
                    }),
                    new DOMinatorMenuButton ({
                        key: 'link_style_default',
                        icon: 'paint-brush',
                        command: toggleMark(this.editorSchema.marks.strong)
                    }),
                    new DOMinatorMenuButton ({
                        key: 'link_style_primary',
                        icon: 'paint-brush',
                        command: toggleMark(this.editorSchema.marks.strong)
                    }),
                    new DOMinatorMenuButton ({
                        key: 'link_style_warning',
                        icon: 'paint-brush',
                        command: toggleMark(this.editorSchema.marks.strong)
                    }),
                    new DOMinatorMenuButton ({
                        key: 'link_style_danger',
                        icon: 'paint-brush',
                        command: toggleMark(this.editorSchema.marks.strong)
                    }),
                    new DOMinatorMenuButton ({
                        key: 'link_style_success',
                        icon: 'paint-brush',
                        command: toggleMark(this.editorSchema.marks.strong)
                    }),
                    new DOMinatorMenuButton ({
                        key: 'link_style_info',
                        icon: 'paint-brush',
                        command: (val, view)=>{
                            console.log(view);
                            let { from, to } = getMarkRange(view.state.selection.$cursor, this.activeMark);

                            console.log( this.activeMark );
                            console.log(from);
                            console.log(to);
                            const attr = { ...{}, ...this.activeMark.typeinstance.attrs, href: 'Na most akkor.' };
                            attr.
                            view.dispatch(view.state.tr.addMark(from, to, this.activeMark.type.create(attr)))

                            // const selection = TextSelection.create( state.doc, starts, ends);
                            // view.dispatch(state.tr.setSelection(selection));

                            //let range = getMarkRange(state.selection.$cursor, this.activeMark.type);
                            //console.log(range);

                        }
                    }),
                ]
            }),
            paragraph: new DOMinatorSubMenu({
                key: 'paragraph',
                items: [
                    new DOMinatorMenuButton ({
                        key: 'outdent',
                        icon: 'outdent',
                        command: toggleMark(this.editorSchema.marks.strong)
                    }),
                    new DOMinatorMenuButton ({
                        key: 'indent',
                        icon: 'indent',
                        command: toggleMark(this.editorSchema.marks.strong)
                    }),
                    new DOMinatorMenuButton ({
                        key: 'list_ul',
                        icon: 'list-ul',
                        command: toggleMark(this.editorSchema.marks.strong)
                    }),
                    new DOMinatorMenuButton ({
                        key: 'list_ol',
                        icon: 'list-ol',
                        command: toggleMark(this.editorSchema.marks.strong)
                    }),
                    new DOMinatorMenuButton ({
                        key: 'paragraph',
                        icon: 'paragraph',
                        command: toggleMark(this.editorSchema.marks.strong)
                    }),
                    new DOMinatorMenuButton ({
                        key: 'undo',
                        icon: 'undo',
                        command: toggleMark(this.editorSchema.marks.strong)
                    }),
                    new DOMinatorMenuButton ({
                        key: 'redo',
                        icon: 'repeat',
                        command: toggleMark(this.editorSchema.marks.strong)
                    }),
                    new DOMinatorMenuButton ({
                        key: 'layouts',
                        icon: 'columns',
                        command: toggleMark(this.editorSchema.marks.strong)
                    }),
                ],
            }),
            heading: new DOMinatorSubMenu({
                key: 'heading',
                items: [
                    new DOMinatorMenuButton ({
                        key: 'outdent',
                        icon: 'outdent',
                        command: toggleMark(this.editorSchema.marks.strong),
                    }),
                    new DOMinatorMenuButton ({
                        key: 'indent',
                        icon: 'indent',
                        command: toggleMark(this.editorSchema.marks.strong),
                    }),
                    new DOMinatorMenuButton ({
                        key: 'list_ul',
                        icon: 'list-ul',
                        command: toggleMark(this.editorSchema.marks.strong)
                    }),
                    new DOMinatorMenuButton ({
                        key: 'list_ol',
                        icon: 'list-ol',
                        command: toggleMark(this.editorSchema.marks.strong)
                    }),
                    new DOMinatorMenuButton ({
                        key: 'paragraph',
                        icon: 'paragraph',
                        command: toggleMark(this.editorSchema.marks.strong)
                    }),
                    new DOMinatorMenuButton ({
                        key: 'undo',
                        icon: 'undo',
                        command: toggleMark(this.editorSchema.marks.strong)
                    }),
                    new DOMinatorMenuButton ({
                        key: 'redo',
                        icon: 'repeat',
                        command: toggleMark(this.editorSchema.marks.strong)
                    }),
                    new DOMinatorMenuButton ({
                        key: 'layouts',
                        icon: 'columns',
                        command: toggleMark(this.editorSchema.marks.strong)
                    }),
                ],
            }),
            custom_html: new DOMinatorSubMenu({
                key: 'custom_html',
                items: [
                    new DOMinatorMenuButton ({
                        key: 'magic',
                        icon: 'magic',
                        command: (state, dispatch, view)=>{
                            dispatch(
                                state.tr.setBlockType(
                                    state.selection.from,
                                    state.selection.to,
                                    state.selection.node.type,
                                    { className: 'SomethingNew' }
                                )
                            );
                            // https://prosemirror.net/docs/ref/#transform.Transform.setBlockType

                            console.log(state.selection.node);
                            console.log(state.selection);


                        }
                    }),
                ],
            }),
            span: new DOMinatorSubMenu({
                key: 'span',
                items: [
                    new DOMinatorMenuButton ({
                        key: 'magic',
                        icon: 'magic',
                        command: (state, dispatch, view)=>{

                            // let { starts, ends } = getMarkRange(state.selection.$cursor, this.activeMark);
                            let range = getMarkRange(state.selection.$cursor, this.activeMark.type);
                            console.log(range);

                            // console.log(starts);
                            // console.log(ends);
                            // console.log(selection);
                            // dispatch(
                            //     state.tr.setBlockType(
                            //         state.selection.from,
                            //         state.selection.to,
                            //         state.selection.node.type,
                            //         { className: 'SomethingNew' }
                            //     )
                            // );



                        }
                    }),
                ],
            }),
        }

        this.dom = document.createElement("div")
        this.dom.className = "DOMinatorMenu"

        Object.keys(this.submenus).forEach(key=>{
            this.dom.appendChild( this.submenus[key].getDom() );
        });
    }

    // Create an icon for a heading at the given level
    heading(level) {
        return {
            command: setBlockType(this.editorSchema.nodes.heading, {
                level
            }),
            dom: this.icon("H" + level, "heading")
        }
    }

    destroy() {
        this.editorView.dom.removeEventListener("mouseup");
        this.editorView.dom.removeEventListener("mousedown");
        this.dom.remove();
    }
}
