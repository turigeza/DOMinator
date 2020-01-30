import {Plugin} from "prosemirror-state"
import {baseKeymap, setBlockType, wrapIn} from "./prosemirrorcommands"

import {schema} from "./DOMinatorSchema"

import DOMinatorMenuButton from "./DOMinatorMenuButton"
import DOMinatorMenuDropdown from "./DOMinatorMenuDropdown"
import DOMinatorMenuInput from "./DOMinatorMenuInput"
import DOMinatorSubMenu from "./DOMinatorSubMenu"
import DOMinatorMenuSeparator from "./DOMinatorMenuSeparator"
import DOMinatorMenuLabel from "./DOMinatorMenuLabel"

// Submenues
import { paddings as _Paddings, margins as _Margins} from "./Submenues/PaddingMargin"
import _Paragraph from "./Submenues/Paragraph"
import _Inline from "./Submenues/Inline"
import _Link from "./Submenues/Link"
import _Heading from "./Submenues/Heading"
import _Photograph from "./Submenues/Photograph"
import _Carousel from "./Submenues/Carousel"
import _DownloadLink from "./Submenues/DownloadLink"

import smRightMenu from "./Submenues/RightMenu"


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

        let activeSubmenuKey = '';

        if(view){

            // console.log('view');
            // console.log(view.state);
            // console.log('lastState');
            // console.log(lastState);

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
                        if(selection.$head.parent.type.spec.menu){
                            activeSubmenuKey = selection.$head.parent.type.spec.menu;
                        }else{
                            activeSubmenuKey = selection.$head.parent.type.name;
                        }
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
            }else if(selection.constructor.name === 'AllSelection'){
                activeSubmenuKey = 'inline';
            }else{
                console.error('Uknown selection !');
            }
        }

        if( !activeSubmenuKey || activeSubmenuKey === 'doc'){
            activeSubmenuKey = "paragraph";
        }

        // skip an update allows us to stay on the submenu selected skipping a step
        if(this.stayOnMenu && this.activeSubmenuKey){
            this.stayOnMenu = false;
            this.submenus[this.activeSubmenuKey].update(this);
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
            throw 'Submenu does no texist with a key: ' + key;
            return;
        }

        Object.keys(this.submenus).forEach(key=>{
            this.submenus[key].hide();
        });

        // this also calls the update method on each element
        this.submenus[key].show(this);
        this.activeSubmenuKey = key;
    }

    initMenu(){

        this.submenus = {
            inline: _Inline(this),
            link: _Link(this),
            paragraph: _Paragraph(this),
            heading: _Heading(this),
            paddings: _Paddings(this),
            margins: _Margins(this),
            photograph: _Photograph(this),
            carousel: _Carousel(this),
            download_link: _DownloadLink(this),
            download_title: new DOMinatorSubMenu({
                key: 'download link',
                items: [
                    new DOMinatorMenuLabel({
                        label: 'Downloads Title'
                    }),
                    new DOMinatorMenuSeparator (),
                    new DOMinatorMenuLabel({
                        label: ' - n/a - '
                    }),
                ]
            }),
            downloads: new DOMinatorSubMenu({
                key: 'downloads',
                items: [
                    new DOMinatorMenuLabel({
                        label: 'Downloads'
                    }),
                    new DOMinatorMenuSeparator (),
                    new DOMinatorMenuLabel({
                        label: ' - n/a -'
                    }),
                ]
            }),
            custom_html: new DOMinatorSubMenu({
                key: 'custom_html',
                items: [
                    new DOMinatorMenuLabel({
                        label: 'Custom HTML'
                    }),
                    new DOMinatorMenuSeparator (),
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
                    new DOMinatorMenuLabel({
                        label: 'Style'
                    }),
                    new DOMinatorMenuSeparator (),
                    new DOMinatorMenuButton ({
                        key: 'magic',
                        icon: 'magic',
                        action: ()=>{

                        }
                    }),
                ],
            }),
        }

        // if(typeof this.dominator.options.submenus === 'function'){
        //     this.submenus = this.dominator.options.submenus(submenus);
        // }else{
        //     this.submenus = submenus;
        // }

        // this.submenus = { submenues, ...this.dominator.options.menus };
        this.dom = document.createElement("div");
        this.leftdom = document.createElement("div");
        this.rightdom = document.createElement("div");
        this.dom.className = "DOMinatorMenu";
        this.leftdom.className = "DOMinatorMenuLeft";
        this.rightdom.className = "DOMinatorMenuRight";

        Object.keys(this.submenus).forEach(key=>{
            const m = this.submenus[key];
            if(m){
                this.leftdom.appendChild( m.getDom() );
            }
        });

        this.rightMenu = smRightMenu(this);
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
