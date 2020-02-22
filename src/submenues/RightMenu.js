import DOMinatorMenuButton from "./../DOMinatorMenuButton"
import DOMinatorMenuDropdown from "./../DOMinatorMenuDropdown"
import DOMinatorMenuSeparator from "./../DOMinatorMenuSeparator"

import DOMinatorSubMenu from "./../DOMinatorSubMenu"
import {
    toggleMark,
    clearFormatting
} from "./../DOMinatorActions"

import {undo, redo} from "prosemirror-history"
export default function(menu) {

    const mainDropDown = new DOMinatorMenuDropdown ({
        key: 'menu',
        icon: 'ellipsis-v',
        dropdownCaret: false,
        items: [
            new DOMinatorMenuButton ({
                key: 'page_settings',
                icon: 'cog',
                label: 'Page Settings',
                action: (button) => {
                    const rs = menu.dominator.options.pageSettings(menu, menu.dominator);
                    if(rs !== false){
                        closeMainDropDown();
                    }
                }
            }),
            new DOMinatorMenuButton ({
                key: 'thumbnail',
                icon: 'picture-o',
                label: 'Page Thumbnail',
                action: () => {
                    const rs = menu.dominator.options.pageThumbnail(menu, menu.dominator);
                    if(rs !== false){
                        closeMainDropDown();
                    }
                }
            }),
            new DOMinatorMenuButton ({
                key: 'shedule',
                icon: 'calendar',
                label: 'Shedule',
                action: () => {
                    const rs = menu.dominator.options.schedule(menu, menu.dominator);
                    if(rs !== false){
                        closeMainDropDown();
                    }
                }
            }),
            new DOMinatorMenuButton ({
                key: 'new_page',
                icon: 'file-o',
                label: 'New Page',
                action: () => {
                    const rs = menu.dominator.options.newPage(menu, menu.dominator);
                    if(rs !== false){
                        closeMainDropDown();
                    }
                }
            }),
            new DOMinatorMenuButton ({
                key: 'go_live',
                icon: 'check',
                label: 'Go Live',
                action: () => {
                    const rs = menu.dominator.options.goLive(menu, menu.dominator);
                    if(rs !== false){
                        closeMainDropDown();
                    }
                }
            }),
            new DOMinatorMenuButton ({
                key: 'exit_editor',
                icon: 'close',
                label: 'Exit',
                action: () => {
                    // for some reason it needs a bit of timeout : ) like me
                    setTimeout(()=>{
                        menu.dominator.off();
                    }, 10);
                }
            }),
        ]
    });
    const items = [
        new DOMinatorMenuSeparator (),
        new DOMinatorMenuButton ({
            key: 'undo',
            icon: 'undo',
            action: (button)=> {
                undo(menu.view.state, menu.view.dispatch);
            },
            update: (button) => {
                undo(menu.view.state) ? button.enable() : button.disable();
            }
        }),
        new DOMinatorMenuButton ({
            key: 'redo',
            icon: 'repeat',
            action: (button)=> {
                redo(menu.view.state, menu.view.dispatch);
            },
            update: (button) => {
                redo(menu.view.state) ? button.enable() : button.disable();
            }
        }),
        mainDropDown
    ];

    function closeMainDropDown(){
        mainDropDown.close();
    }

    if( typeof menu.dominator.options.menu.right ===  'function'){
        menu.dominator.options.menu.right(items, menu);
    }

    return new DOMinatorSubMenu({
        key: 'right',
        items: items
    });
}
