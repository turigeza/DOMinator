import DOMinatorMenuButton from "./../DOMinatorMenuButton"
import DOMinatorMenuInput from "./../DOMinatorMenuInput"
import DOMinatorSubMenu from "./../DOMinatorSubMenu"
import DOMinatorMenuLabel from "./../DOMinatorMenuLabel"
import DOMinatorMenuSeparator from "./../DOMinatorMenuSeparator"

import Sizes from "./../Helpers/Sizes"
import Floats from "./../Helpers/Floats"
import {
    toggleClassOnNode
} from "./../DOMinatorActions"

export default function(menu) {

    if( menu.dominator.options.menu.card ===  false){
        return null;
    }

    let items = [
        new DOMinatorMenuLabel({
            label: 'Card'
        }),
        new DOMinatorMenuSeparator (),
        new DOMinatorMenuButton ({
            key: 'shadow',
            icon: 'window-restore',
            action: (button) => {
                toggleClassOnNode(menu, 'd-card-raised');
            },
            update(button){
                if(menu.activeBlock.attrs.class && menu.activeBlock.attrs.class.includes('d-card-raised')){
                    button.activate();
                }else{
                    button.deactivate();
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
    ];

    if( typeof menu.dominator.options.menu.card ===  'function'){
        menu.dominator.options.menu.card(items, menu);
    }

    return new DOMinatorSubMenu({
        key: 'card',
        items: items
    });
}
