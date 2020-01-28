import DOMinatorMenuButton from "./../DOMinatorMenuButton"
import DOMinatorSubMenu from "./../DOMinatorSubMenu"
import DOMinatorMenuLabel from "./../DOMinatorMenuLabel"
import DOMinatorMenuSeparator from "./../DOMinatorMenuSeparator"
import {
    convertBlock
} from "./../DOMinatorActions"

function activateHeaderButton(level, menu, button){
    if(menu.activeBlock && menu.activeBlock.attrs.level === level){
        button.activate();
    }else{
        button.deactivate();
    }
}

export default function(menu) {

    return new DOMinatorSubMenu({
        key: 'heading',
        items: [
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
                key: 'heading 1',
                label: 'H1',
                update: (button) => {
                    return activateHeaderButton(1, menu, button);
                },
                action: () => {
                    convertBlock('heading', { level: 1 }, menu);
                }
            }),
            new DOMinatorMenuButton ({
                key: 'heading 2',
                label: 'H2',
                update: (button) => {
                    return activateHeaderButton(2, menu, button);
                },
                action: () => {
                    convertBlock('heading', { level: 2 }, menu);
                }
            }),
            new DOMinatorMenuButton ({
                key: 'heading 3',
                label: 'H3',
                update: (button) => {
                    return activateHeaderButton(3, menu, button);
                },
                action: () => {
                    convertBlock('heading', { level: 3 }, menu);
                }
            }),
            new DOMinatorMenuButton ({
                key: 'heading 4',
                label: 'H4',
                update: (button) => {
                    return activateHeaderButton(4, menu, button);
                },
                action: () => {
                    convertBlock('heading', { level: 4 }, menu);
                }
            }),
            new DOMinatorMenuButton ({
                key: 'heading 5',
                label: 'H5',
                update: (button) => {
                    return activateHeaderButton(5, menu, button);
                },
                action: () => {
                    convertBlock('heading', { level: 5 }, menu);
                }
            }),
            new DOMinatorMenuButton ({
                key: 'heading 6',
                label: 'H6',
                update: (button) => {
                    return activateHeaderButton(6, menu, button);
                },
                action: () => {
                    convertBlock('heading', { level: 6 }, menu);
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
        ],
    });
}
