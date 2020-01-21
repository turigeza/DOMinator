import {Plugin} from "prosemirror-state"
import {baseKeymap, setBlockType, wrapIn} from "./prosemirrorcommands"

import {schema} from "./DOMinatorSchemaBasic"

import DOMinatorMenuButton from "./DOMinatorMenuButton"
import DOMinatorMenuDropdown from "./DOMinatorMenuDropdown"
import DOMinatorMenuInput from "./DOMinatorMenuInput"
import DOMinatorSubMenu from "./DOMinatorSubMenu"
import DOMinatorMenuSeparator from "./DOMinatorMenuSeparator"
import DOMinatorMenuLabel from "./DOMinatorMenuLabel"

// submenues
import smPaddingMargin from "./submenues/PaddingMargin"
import smParagraph from "./submenues/Paragraph"
import smInline from "./submenues/Inline"
import smLink from "./submenues/Link"
import smHeading from "./submenues/Heading"
import smRightMenu from "./submenues/RightMenu"

import {
    Selection,
    TextSelection,
    NodeSelection,
    AllSelection
} from "prosemirror-state"

import {
    updateLinkStyleButton,
    toggleClassOnMark,
    changeAttributeOnMark,
    toggleAttributeOnMark,
    clearFormatting,
    toggleMark,
    convertBlock,
    toggleList,
    toggleWrap

} from "./DOMinatorActions"

export default class DOMinatorMenu {

    // items - menu items
    // view - pose mirror view
    // dom - menu div
    // leftdom - menu div
    // rightdom - menu div
    // mousedown - true : false helps us debounce selection change
    // dominator
    // editorSchema
    // leftMenuDom
    // rightMenuDom
    // submenus
    // activeMark - update sets this to match the menu showing
    // activeBlock - current parent or selected parent
    // activeSubmenuKey
    // stayOnMenu

    constructor(dominator, view) {
        this.dominator = dominator;

        this.view = view;
        this.editorSchema = dominator.editorSchema;

        this.initMenu();

        this.update();
        document.body.classList.add("dominatorMenuActive");

        // this.dom.addEventListener("mousedown", e => {
        //     e.preventDefault()
        //     this.view.focus()
        //     // this.items.forEach(({command, dom}) => {
        //     //     if (dom.contains(e.target)){
        //     //         command(this.view.state, this.view.dispatch, this.view);
        //     //     }
        //     // })
        // })

        this.view.dom.addEventListener("mousedown", e => {
            this.mousedown = true;
        });

        this.view.dom.addEventListener("mouseup", e => {
            this.mousedown = false;
            this.update(this.view);
        });
    }

    update(view, lastState) {

        if(this.mousedown){
            return;
        }

        this.activeMark = null;
        this.activeBlock = null;

        // make all submenues invisible
        // Object.keys(this.submenus).forEach(key=>{
        //     this.submenus[key].hide();
        // });

        let activeSubmenuKey = '';

        if(view){
            const selection = view.state.selection;
            if(selection.constructor.name === 'TextSelection'){
                // watch out because text selection responds to none editable custom html selection as well ::: this has now been solved sort of
                if(selection.empty){
                    let marks = selection.$cursor.marks();
                    if(marks.length > 0){
                        for (var i = 0; i < marks.length; i++) {
                            let mark = marks[i];
                            if(this.submenus[mark.type.name]){
                                activeSubmenuKey = mark.type.name;
                                this.activeMark = mark;
                                break;
                            }
                        }
                    }else{
                        activeSubmenuKey = selection.$head.parent.type.name;
                    }
                }else{
                    // there is a selection show inline menu
                    activeSubmenuKey = 'inline';
                }

                this.activeBlock = selection.$head.parent;
            }else if (selection.constructor.name === 'NodeSelection'){
                if(this.submenus[selection.node.type.name]){
                    activeSubmenuKey = selection.node.type.name;
                }

                this.activeBlock = selection.node;
            }
        }

        if( !activeSubmenuKey ){
            activeSubmenuKey = "paragraph";
        }

        // skip an update allows us to stay on the submenu selected skipping a step
        if(this.stayOnMenu && this.activeSubmenuKey){
            this.stayOnMenu = false;
            this.submenus[this.activeSubmenuKey].update(this);
            console.log('false');
        }else{
            this.activeSubmenuKey = activeSubmenuKey;
            this.activateSubmenu(this.activeSubmenuKey);
        }

        //  activeSubmenuKey = "paddingmargin";
        this.rightMenu.update(this);
    }

    activateSubmenu(key){
        if(!this.submenus[key]){
            console.error(this.submenus);
            throw 'Submenu does no texist with a key' + key;
        }

        Object.keys(this.submenus).forEach(key=>{
            this.submenus[key].hide();
        });

        // this also calls the update method on each element
        this.submenus[key].show(this);
    }

    initMenu(){
        const linkClasses = ['button button-default', 'button button-primary', 'button button-warning', 'button button-danger', 'button button-success', 'button button-info', ]
        this.submenus = {
            inline: smInline(this),
            link: smLink(this),
            paragraph: smParagraph(this),
            heading: smHeading(this),
            paddingmargin: smPaddingMargin(this),
            custom_html: new DOMinatorSubMenu({
                key: 'custom_html',
                items: [
                    new DOMinatorMenuButton ({
                        key: 'magic',
                        icon: 'magic',
                        action: ()=>{

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
                        action: ()=>{

                        }
                    }),
                ],
            }),
        }

        this.dom = document.createElement("div");
        this.leftdom = document.createElement("div");
        this.rightdom = document.createElement("div");
        this.dom.className = "DOMinatorMenu";
        this.leftdom.className = "DOMinatorMenuLeft";
        this.rightdom.className = "DOMinatorMenuRight";

        Object.keys(this.submenus).forEach(key=>{
            this.leftdom.appendChild( this.submenus[key].getDom() );
        });

        this.rightMenu = smRightMenu(this)

        this.rightdom.appendChild(this.rightMenu.getDom());

        this.dom.appendChild(this.leftdom);
        this.dom.appendChild(this.rightdom);
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
        this.view.dom.removeEventListener("mouseup");
        this.view.dom.removeEventListener("mousedown");
        this.dom.remove();
    }
}
