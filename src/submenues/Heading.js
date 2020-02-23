import DOMinatorMenuButton from "./../DOMinatorMenuButton"
import DOMinatorSubMenu from "./../DOMinatorSubMenu"
import DOMinatorMenuLabel from "./../DOMinatorMenuLabel"
import DOMinatorMenuSeparator from "./../DOMinatorMenuSeparator"
import DOMinatorMenuDropdown from "./../DOMinatorMenuDropdown"
import {
    convertBlock,
    alignSelection,
    updateAlignmentButton
} from "./../DOMinatorActions"

function activateHeaderButton(level, menu, button){
    if(menu.activeBlock && menu.activeBlock.attrs.level === level){
        button.activate();
    }else{
        button.deactivate();
    }
}

export default function(menu) {
    const items = [
        new DOMinatorMenuLabel({
            label: 'Heading'
        }),
        new DOMinatorMenuSeparator (),
        new DOMinatorMenuButton ({
            key: 'paragraph',
            icon: 'paragraph',
            action: () => { convertBlock('paragraph', {}, menu); }
        }),
        new DOMinatorMenuButton ({
            key: 'heading_1',
            label: 'H1',
            update: (button) => {
                return activateHeaderButton(1, menu, button);
            },
            action: () => {
                convertBlock('heading', { level: 1 }, menu);
            }
        }),
        new DOMinatorMenuButton ({
            key: 'heading_2',
            label: 'H2',
            update: (button) => {
                return activateHeaderButton(2, menu, button);
            },
            action: () => {
                convertBlock('heading', { level: 2 }, menu);
            }
        }),
        new DOMinatorMenuButton ({
            key: 'heading_3',
            label: 'H3',
            update: (button) => {
                return activateHeaderButton(3, menu, button);
            },
            action: () => {
                convertBlock('heading', { level: 3 }, menu);
            }
        }),
        new DOMinatorMenuButton ({
            key: 'heading_4',
            label: 'H4',
            update: (button) => {
                return activateHeaderButton(4, menu, button);
            },
            action: () => {
                convertBlock('heading', { level: 4 }, menu);
            }
        }),
        new DOMinatorMenuButton ({
            key: 'heading_5',
            label: 'H5',
            update: (button) => {
                return activateHeaderButton(5, menu, button);
            },
            action: () => {
                convertBlock('heading', { level: 5 }, menu);
            }
        }),
        new DOMinatorMenuButton ({
            key: 'heading_6',
            label: 'H6',
            update: (button) => {
                return activateHeaderButton(6, menu, button);
            },
            action: () => {
                convertBlock('heading', { level: 6 }, menu);
            }
        }),
        new DOMinatorMenuDropdown ({
            key: 'alignment',
            icon: 'align-left',
            items: [
                new DOMinatorMenuButton ({
                    key: 'align_left',
                    icon: 'align-left',
                    update(button){
                        return updateAlignmentButton(button, menu, 'left');
                    },
                    action: (button) => {
                        alignSelection(menu.view, button.isActive() ? '':'left', menu.dominator.options.textAlignClasses);
                    }
                }),
                new DOMinatorMenuButton ({
                    key: 'align_center',
                    icon: 'align-center',
                    update(button){
                        return updateAlignmentButton(button, menu, 'center');
                    },
                    action: (button) => {
                        alignSelection(menu.view, button.isActive() ? '':'center', menu.dominator.options.textAlignClasses);
                    }
                }),
                new DOMinatorMenuButton ({
                    key: 'align_right',
                    icon: 'align-right',
                    update(button){
                        return updateAlignmentButton(button, menu, 'right');
                    },
                    action: (button) => {
                        alignSelection(menu.view, button.isActive() ? '':'right', menu.dominator.options.textAlignClasses);
                    }
                }),
                new DOMinatorMenuButton ({
                    key: 'clear_alignment',
                    icon: 'clearalignment',
                    iconType: 'dics',
                    action: () => {
                        alignSelection(menu.view, null, menu.dominator.options.textAlignClasses);
                    }
                }),
            ]
        }),
        new DOMinatorMenuButton ({
            key: 'margins',
            icon: 'margin',
            iconType: 'dics',
            action: (button) => {
                menu.activateSubmenu('margins');
            },
            update(button, menu,){
                if(!menu.activeBlock || (menu.activeBlock && typeof menu.activeBlock.type.attrs.class === 'undefined')){
                    button.disable();
                    button.deactivate();
                }else{
                    button.enable();
                    button.deactivate();
                    if(menu.activeBlock.attrs.class && menu.activeBlock.attrs.class.includes('d-m')){
                        button.activate();
                        return true;
                    }else{
                        return false;
                    }

                }
            }
        }),
        new DOMinatorMenuButton ({
            key: 'paddings',
            icon: 'padding',
            iconType: 'dics',
            action: (button) => {
                menu.activateSubmenu('paddings');
            },
            update(button, menu,){
                if(!menu.activeBlock || (menu.activeBlock && typeof menu.activeBlock.type.attrs.class === 'undefined')){
                    button.disable();
                    button.deactivate();
                }else{
                    button.enable();
                    button.deactivate();
                    if(menu.activeBlock.attrs.class && menu.activeBlock.attrs.class.includes('d-p')){
                        button.activate();
                        return true;
                    }else{
                        return false;
                    }

                }
            }
        }),
    ];
    if( typeof menu.dominator.options.menu.heading ===  'function'){
        menu.dominator.options.menu.heading(items, menu);
    }
    return new DOMinatorSubMenu({
        key: 'heading',
        items: items
    });
}
