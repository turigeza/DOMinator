import DOMinatorMenuButton from "./../DOMinatorMenuButton"
import DOMinatorMenuInput from "./../DOMinatorMenuInput"
import DOMinatorSubMenu from "./../DOMinatorSubMenu"
import DOMinatorMenuLabel from "./../DOMinatorMenuLabel"
import DOMinatorMenuSeparator from "./../DOMinatorMenuSeparator"
import {
    changeAttributeOnNode,
    // toggleAttributeOnMark,
    toggleClassOnNode
} from "./../DOMinatorActions"

import Sizes from "./../Helpers/Sizes"
import Floats from "./../Helpers/Floats"

export default function(menu) {
    if( menu.dominator.options.menu.block_link ===  false){
        return null;
    }
    const items =  [
        new DOMinatorMenuLabel({
            label: 'Block Link'
        }),
        new DOMinatorMenuSeparator (),
        new DOMinatorMenuButton ({
            update: (button) => {
                if(menu.activeBlock.attrs.target == "_blank"){
                    button.activate();
                }else{
                    button.deactivate();
                }
            },
            key: 'link_external',
            icon: 'external-link',
            action: (state, dispatch, view)=>{
                // attribute, value, menu, mark                
                if(menu.activeBlock.attrs.target == "_blank"){
                    changeAttributeOnNode(menu, 'target', null);
                }else{
                    changeAttributeOnNode(menu, 'target', '_blank');
                }
            }
        }),
        new DOMinatorMenuButton ({
            key: 'shadow',
            icon: 'window-restore',
            action: (button) => {
                toggleClassOnNode(menu, 'd-block-link-flat');
            },
            update(button){
                if(menu.activeBlock.attrs.class && menu.activeBlock.attrs.class.includes('d-block-link-flat')){
                    button.deactivate();
                }else{
                    button.activate();
                }
            }
        }),
        new DOMinatorMenuButton ({
            key: 'outline',
            icon: 'square-o',
            iconClass: 'fa-regular fa-square',
            action: (button) => {
                toggleClassOnNode(menu, 'd-block-link-no-outline');
            },
            update(button){
                if(menu.activeBlock.attrs.class && menu.activeBlock.attrs.class.includes('d-block-link-no-outline')){
                    button.deactivate();
                }else{
                    button.activate();
                }
            }
        }),
        Sizes(menu),
        Floats(menu),
        // margins
        new DOMinatorMenuButton({
            key: 'margins',
            icon: 'margin',
            iconType: 'dics',
            action: (button) => {
                menu.activateSubmenu('margins');
            },
            update(button, menu, ) {
                const block = menu.activeBlock;
                if (block && block.type.spec.canTakeMargin) {
                    button.enable();
                    if (block.attrs.class && block.attrs.class.includes('d-m')) {
                        button.activate();
                    } else {
                        button.deactivate();
                    }
                } else {
                    button.disable();
                    button.deactivate();
                }
            }
        }),
        new DOMinatorMenuInput ({
            label: 'Link: ',
            update: (input) => {
                input.setValue(menu.activeBlock.attrs.href);
            },
            key: 'href',
            action: (val) => {
                changeAttributeOnNode(menu, 'href', val);
            }
        }),
        new DOMinatorMenuInput ({
            label: 'Title: ',
            update: (input) => {
                input.setValue(menu.activeBlock.attrs.title);
            },
            key: 'title',
            action: (val) => {
                changeAttributeOnNode(menu, 'title', val);
            }
        }),
    ];

    if( typeof menu.dominator.options.menu.block_link ===  'function'){
        menu.dominator.options.menu.block_link(items, menu);
    }

    return new DOMinatorSubMenu({
        key: 'block_link',
        items: items,
    });
}
