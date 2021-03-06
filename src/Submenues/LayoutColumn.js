import {
    normalizePaddingMargin
} from "./../DOMinatorActions"
import {
    generateDropdowns
} from "./../Helpers/PaddingMarginHelper"

import DOMinatorMenuButton from "./../DOMinatorMenuButton"
import DOMinatorSubMenu from "./../DOMinatorSubMenu"
import DOMinatorMenuLabel from "./../DOMinatorMenuLabel"
import DOMinatorMenuSeparator from "./../DOMinatorMenuSeparator"

export default function(menu) {
    if( menu.dominator.options.menu.layout ===  false){
        return null;
    }

    const items = [
        new DOMinatorMenuLabel({
            label: 'Layout Column: '
        }),
        new DOMinatorMenuSeparator (),
        ...generateDropdowns('padding', menu),
        new DOMinatorMenuButton({
            key: 'clear_all_paddings',
            icon: 'clearpadding',
            iconType: 'dics',
            action: () => {
                menu.stayOnMenu = true;
                normalizePaddingMargin(menu, 'padding');
            }
        })
    ];

    if( typeof menu.dominator.options.menu.heading ===  'function'){
        menu.dominator.options.menu.layout(items, menu);
    }

    return new DOMinatorSubMenu({
        key: 'layout_column',
        items: items
    });
}
