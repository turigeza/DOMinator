import {
    normalizePaddingMargin
} from "./../DOMinatorActions"

import DOMinatorMenuButton from "./../DOMinatorMenuButton"
import DOMinatorMenuDropdown from "./../DOMinatorMenuDropdown"

export function generateSizeButtons(paddingOrMargin, menu, classKey, classes){
    const sizes = [
        ['xxs', 'extra_extra_small'],
        ['xs', 'extra_small'],
        ['s', 'small'],
        ['m', 'medium'],
        ['l', 'large'],
        ['xl', 'extra_large'],
        ['xxl', 'extra_extra_large'],
        ['none', 'none'],
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
        [paddingOrMargin + '_all', 'allsides', 'all'],
        [paddingOrMargin + '_top_and_bottom', 'ysides', 'y'],
        [paddingOrMargin + '_left_and_right', 'xsides', 'x'],
        [paddingOrMargin + '_top', 'topside', 'top'],
        [paddingOrMargin + '_left', 'leftside', 'left'],
        [paddingOrMargin + '_bottom', 'bottomside', 'bottom'],
        [paddingOrMargin + '_right', 'rightside', 'right'],
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
