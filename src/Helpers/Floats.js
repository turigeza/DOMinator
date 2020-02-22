import {
    changeAttributeOnNode
} from "./../DOMinatorActions"
import DOMinatorMenuDropdown from "./../DOMinatorMenuDropdown"
import DOMinatorMenuButton from "./../DOMinatorMenuButton"

import getPosition from "./../Helpers/getPosition"
import getNode from "./../Helpers/getNode"

function floatButtonActivate(floatKey, menu, btn){
    const className = menu.dominator.options.floatClasses[floatKey];
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

function floatBlock(floatKey, menu){
    const selection = menu.view.state.selection;
    const floatClasses = menu.dominator.options.floatClasses;

    let pos = getPosition(selection);

    let node = menu.view.state.doc.nodeAt(pos);
    let classes = node.attrs.class;

    let removed = '';
    Object.keys(floatClasses).forEach(key => {
        if(classes.includes(floatClasses[key])){
            removed = floatClasses[key];
        }
        classes = classes.replace(floatClasses[key], '').trim();
    });

    if(removed !== floatClasses[floatKey] ){
        classes += ' ' + floatClasses[floatKey];
        classes = classes.trim();
    }

    changeAttributeOnNode(menu, 'class', classes);
}

export default function(menu) {
    const floats = new DOMinatorMenuDropdown ({
        key: 'alignment',
        icon: 'floatimage-left',
        iconType: 'dics',
        items: [
            new DOMinatorMenuButton ({
                key: 'float_left_of_text',
                icon: 'floatimage-left',
                iconType: 'dics',
                update: (button) => {
                    return floatButtonActivate('left', menu, button);
                },
                action: (button) => {
                    floatBlock('left', menu);
                }
            }),
            new DOMinatorMenuButton ({
                key: 'align_center_and_clear_both_side',
                icon: 'floatimage-none',
                iconType: 'dics',
                update: (button) => {
                    return floatButtonActivate('center', menu, button);
                },
                action: () => {
                    floatBlock('center', menu);
                }
            }),
            new DOMinatorMenuButton ({
                key: 'float_right_of_text',
                icon: 'floatimage-right',
                iconType: 'dics',
                update: (button) => {
                    return floatButtonActivate('right', menu, button);
                },
                action: () => {
                    floatBlock('right', menu);
                }
            })
        ]
    });

    return floats;
}
