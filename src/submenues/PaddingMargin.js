import {
    normalizePaddingMargin
} from "./../DOMinatorActions"
import {
    generateDropdowns
} from "./../Helpers/PaddingMarginHelper"

import DOMinatorMenuButton from "./../DOMinatorMenuButton"
import DOMinatorSubMenu from "./../DOMinatorSubMenu"
import DOMinatorMenuLabel from "./../DOMinatorMenuLabel"


export function paddings(menu) {
    const items = [
        new DOMinatorMenuLabel({
            label: 'Paddings: '
        }),
        ...generateDropdowns('padding', menu),
        new DOMinatorMenuButton({
            key: 'clear all paddings',
            icon: 'clearpadding',
            iconType: 'dics',
            action: () => {
                menu.stayOnMenu = true;
                normalizePaddingMargin(menu, 'padding');
            }
        })
    ];

    if( typeof menu.dominator.options.menu.paddings ===  'function'){
        menu.dominator.options.menu.paddings(items, menu);
    }

    return new DOMinatorSubMenu({
        key: 'paddings',
        items: items
    });

}

export function margins(menu) {
    const items = [
        new DOMinatorMenuLabel({
            label: 'Margins: '
        }),
        ...generateDropdowns('margin', menu),
        new DOMinatorMenuButton({
            key: 'clear all margins',
            icon: 'clearmargin',
            iconType: 'dics',
            action: () => {
                menu.stayOnMenu = true;
                normalizePaddingMargin(menu, 'margin');
            }
        }),
    ];

    if( typeof menu.dominator.options.menu.margins ===  'function'){
        menu.dominator.options.menu.margins(items, menu);
    }

    return new DOMinatorSubMenu({
        key: 'margins',
        items: items
    });

}
