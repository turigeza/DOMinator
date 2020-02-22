import {
    changeAttributeOnNode
} from "./../DOMinatorActions"
import DOMinatorMenuDropdown from "./../DOMinatorMenuDropdown"
import DOMinatorMenuButton from "./../DOMinatorMenuButton"

import getPosition from "./../Helpers/getPosition"
import getNode from "./../Helpers/getNode"

function changeSize(sizeKey, menu){
    const selection = menu.view.state.selection;
    let pos = getPosition(selection);

    const blockSizeClasses = menu.dominator.options.blockSizeClasses;
    let node = menu.view.state.doc.nodeAt(pos);
    let classes = node.attrs.class;

    Object.keys(blockSizeClasses).forEach(key => {
        classes = classes.replace(blockSizeClasses[key], '').trim();
    });

    classes += ' ' + blockSizeClasses[sizeKey];
    classes = classes.trim();

    changeAttributeOnNode(menu, 'class', classes);
}

function sizeButtonActivate(sizeKey, menu, btn){
    const className = menu.dominator.options.blockSizeClasses[sizeKey];
    const node = getNode(menu);
    if(!node) { return; }
    if(node.attrs.class && node.attrs.class.includes(className)){
        btn.activate();
        return true;
    }else{
        btn.deactivate();
        return false;
    }
}

export default function(menu) {
    const sizes = new DOMinatorMenuDropdown ({
        key: 'change_image_size',
        icon: 'expand',
        items: [
            new DOMinatorMenuButton ({
                key: 'full_size',
                label: '100%',
                update: (button) => {
                    return sizeButtonActivate('100', menu, button);
                },
                action: () => {
                    changeSize('100', menu);
                }
            }),
            new DOMinatorMenuButton ({
                key: '75_percent',
                label: '75%',
                update: (button) => {
                    return sizeButtonActivate('75', menu, button);
                },
                action: () => {
                    changeSize('75', menu);
                }
            }),
            new DOMinatorMenuButton ({
                key: '66_percent',
                label: '66%',
                update: (button) => {
                    return sizeButtonActivate('66', menu, button);
                },
                action: () => {
                    changeSize('66', menu);
                }
            }),
            new DOMinatorMenuButton ({
                key: '50_percent',
                label: '50%',
                update: (button) => {
                    return sizeButtonActivate('50', menu, button);
                },
                action: () => {
                    changeSize('50', menu);
                }
            }),
            new DOMinatorMenuButton ({
                key: '33_percent',
                label: '33%',
                update: (button) => {
                    return sizeButtonActivate('33', menu, button);
                },
                action: () => {
                    changeSize('33', menu);
                }
            }),
            new DOMinatorMenuButton ({
                key: '25_percent',
                label: '25%',
                update: (button) => {
                    return sizeButtonActivate('25', menu, button);
                },
                action: () => {
                    changeSize('25', menu);
                }
            }),
            new DOMinatorMenuButton ({
                key: 'auto',
                label: 'AUTO',
                update: (button) => {
                    return sizeButtonActivate('auto', menu, button);
                },
                action: () => {
                    changeSize('auto', menu);
                }
            }),
        ]
    });

    return sizes;
}
