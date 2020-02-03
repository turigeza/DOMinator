import {
    normalizePaddingMargin
} from "./../DOMinatorActions"

import DOMinatorMenuButton from "./../DOMinatorMenuButton"
import DOMinatorMenuDropdown from "./../DOMinatorMenuDropdown"

export function generateSizeButtons(paddingOrMargin, menu, classKey, classes){
    const sizes = [
        ['xxs', 'extra-extra small'],
        ['xs', 'extra small'],
        ['s', 'small'],
        ['m', 'medium'],
        ['l', 'large'],
        ['xl', 'extra large'],
        ['xxl', 'extra-extra large'],
    ];

    let items = [];
    sizes.forEach((size) => {
        items.push(
            new DOMinatorMenuButton({
                _class: classes[size[0]],
                key: size[1],
                label: size[0].toUpperCase(),
                action: () => {
                    menu.stayOnMenu = true;
                    normalizePaddingMargin(menu, paddingOrMargin, classKey, size[0]);
                },
                update(button, menu){
                    button.deactivate();
                    if(!menu.activeBlock) {
                        return false;
                    }

                    if(!menu.activeBlock.attrs.class){
                        return false;
                    }

                    if(menu.activeBlock.attrs.class.includes(button.options._class)){
                        button.activate();
                        return true;
                    }
                    return false;
                }
            })
        );
    });

    items.push(
        new DOMinatorMenuButton({
            key: 'clear',
            icon: 'eraser',
            action: () => {
                menu.stayOnMenu = true;
                normalizePaddingMargin(menu, paddingOrMargin, classKey);
            }
        })
    );
    return items;
}

export function generateDropdowns(paddingOrMargin, menu){

    const classes = paddingOrMargin === 'padding' ? menu.dominator.options.paddingClasses : menu.dominator.options.marginClasses;
    const dropdowns = [
        [paddingOrMargin + ' all', 'allsides', 'all'],
        [paddingOrMargin + ' top and bottom', 'ysides', 'y'],
        [paddingOrMargin + ' left and right', 'xsides', 'x'],
        [paddingOrMargin + ' top', 'topside', 'top'],
        [paddingOrMargin + ' left', 'leftside', 'left'],
        [paddingOrMargin + ' bottom', 'bottomside', 'bottom'],
        [paddingOrMargin + ' right', 'rightside', 'right'],
    ];

    let items = [];

    dropdowns.forEach((dropdown) => {
        items.push(
            new DOMinatorMenuDropdown({
                key: dropdown[0],
                icon: dropdown[1],
                iconType: 'dics',
                items: generateSizeButtons(paddingOrMargin, menu, dropdown[2], classes[dropdown[2]])
            })
        );
    });

    return items;
}
