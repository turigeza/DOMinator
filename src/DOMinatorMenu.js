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
import _Span from "./Submenues/Span"
import _Link from "./Submenues/Link"
import _Heading from "./Submenues/Heading"
import _Photograph from "./Submenues/Photograph"
import _Carousel from "./Submenues/Carousel"
import _CarouselLink from "./Submenues/CarouselLink"
import _Card from "./Submenues/Card"
import _DownloadLink from "./Submenues/DownloadLink"
import _BlockLink from "./Submenues/BlockLink"
import _Layout from "./Submenues/Layout"
import _LayoutColumn from "./Submenues/LayoutColumn"
import _CustomHtml from "./Submenues/CustomHtml"

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

    // dominator
    // view - pose mirror view
    // editorSchema
    // mousedown - true : false helps us debounce selection change
    // dom - menu div

    // dominator

    // leftdom
    // rightMenu
    // rightdom

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
                if(selection.node.type.spec.menu){
                    activeSubmenuKey = selection.node.type.spec.menu;
                }else{
                    activeSubmenuKey = selection.node.type.name;
                }

                this.activeBlock = selection.node;
            }else if(selection.constructor.name === 'AllSelection'){
                activeSubmenuKey = 'inline';
            }else if(selection.constructor.name === 'GapCursor'){
                activeSubmenuKey = "paragraph";
            }else{
                console.error('Uknown selection !');
            }
        }

        if( !activeSubmenuKey ){
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
            key = '_default';
        }

        Object.keys(this.submenus).forEach(k=>{
            if(k !== key){
                this.submenus[k].hide();
            }
        });

        // this also calls the update method on each element
        this.submenus[key].show(this);
        this.activeSubmenuKey = key;
    }

    initMenu(){

        this.submenus = {
            _default: new DOMinatorSubMenu({
                key: '_default',
                beforeUpdate: (sm)=>{
                    let label = 'Editor';
                    if(this.activeBlock){
                        label = this.activeBlock.type.name.replace(/_/g, ' ');
                    }
                    sm.items[0].change(label);
                },
                items: [
                    new DOMinatorMenuLabel({
                        label: '_default'
                    }),
                    new DOMinatorMenuSeparator (),
                    new DOMinatorMenuLabel({
                        label: ' - n/a - '
                    }),
                ]
            }),
            inline: _Inline(this),
            link: _Link(this),
            paragraph: _Paragraph(this),
            heading: _Heading(this),
            paddings: _Paddings(this),
            margins: _Margins(this),
            photograph: _Photograph(this),
            carousel: _Carousel(this),
            card: _Card(this),
            carousel_link: _CarouselLink(this),
            layout: _Layout(this),
            layoutcolumn: _LayoutColumn(this),

            download_link: _DownloadLink(this),
            blocklink: _BlockLink(this),
            span:  _Span(this),
            custom_html: _CustomHtml(this),
        }

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

    destroy() {
        Object.keys(this.submenus).forEach(key=>{
            this.submenus[key].destroy();
        });
        this.rightMenu.destroy();
        this.dom.remove();

        this.dominator = null;
        this.view = null;
        this.editorSchema = null;
        this.dom = null;
        this.dominator = null;

        this.leftdom.remove();
        this.leftdom = null;
        this.rightMenu = null;
        this.rightdom.remove();
        this.rightdom = null;
        this.submenus = null;
        this.activeMark = null;
        this.activeBlock = null;
    }
}
