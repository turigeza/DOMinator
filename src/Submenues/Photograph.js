import DOMinatorMenuButton from "./../DOMinatorMenuButton"
// import DOMinatorMenuDropdown from "./../DOMinatorMenuDropdown"
import DOMinatorMenuInput from "./../DOMinatorMenuInput"
import DOMinatorSubMenu from "./../DOMinatorSubMenu"
import DOMinatorMenuLabel from "./../DOMinatorMenuLabel"
import DOMinatorMenuSeparator from "./../DOMinatorMenuSeparator"
import DOMinatorMenuDropdown from "./../DOMinatorMenuDropdown"
import {
    NodeSelection
} from "prosemirror-state"
import {
    clearFormatting,
    changeAttributeOnMark,
    toggleAttributeOnMark,
    updateLinkStyleButton,
    toggleClassOnMark
} from "./../DOMinatorActions"

function getPosition(selection){
    let pos;
    // the selction must be in the photo text area
    if(selection.constructor.name === 'TextSelection'){
        pos = selection.$head.before()-2;
    }else if(selection.constructor.name === 'NodeSelection'){
        pos = selection.from;
    }

    return pos;
}

function changeSize(sizeKey, menu){
    const selection = menu.view.state.selection;
    // console.log(menu.activeBlock);
    // console.log(selection);
    // console.log(selection.$head.before())
    // console.log(pos);
    // console.log(menu.view.state.doc.nodeAt(from-2));
    // console.log(menu.view.state.doc.nodeAt(from-1));
    // console.log(menu.view.state.doc.nodeAt(from));
    // // console.log(menu.view.state.doc);
    // console.log('from');
    // console.log(from);
    // console.log('to');
    // console.log(to);

    // 'thumbnail_size' => 250,
    // 'medium_size' => 665,
    // 'large_size' => 1200,
    // 'minimum_photo_size' => 1200,

    let pos = getPosition(selection);

    const photoSizeClasses = menu.dominator.options.photoSizeClasses;
    let node = menu.view.state.doc.nodeAt(pos);
    let classes = node.attrs.class;

    Object.keys(photoSizeClasses).forEach(key => {
        classes = classes.replace(photoSizeClasses[key], '').trim();
    });

    classes += ' ' + photoSizeClasses[sizeKey];
    classes = classes.trim();

    let attrs = { ...node.attrs, 'class': classes };

    menu.view.dispatch(menu.view.state.tr.setNodeMarkup(pos, null, attrs).scrollIntoView());

    const dom = menu.view.domAtPos(pos+2);
    const img = dom.node.children.item(0);
    const imageNode = menu.view.state.doc.nodeAt(pos+1);

    let newSrc;
    if(img.offsetWidth < 650 && img.dataset['photograph_medium'] && img.dataset['photograph_medium'] !== imageNode.attrs['src']){
        newSrc = img.dataset['photograph_medium'];
    }else if(img.offsetWidth >= 650 && img.dataset['photograph_large'] && img.dataset['photograph_large'] !== imageNode.attrs['src']){
        newSrc = img.dataset['photograph_large'];
    }

    let tr;

    if(newSrc){
        tr = menu.view.state.tr;
        tr.setMeta("addToHistory", false);
        menu.view.dispatch(menu.view.state.tr.setNodeMarkup(pos+1, null, { ...imageNode.attrs, src: newSrc }));
    }

    tr = menu.view.state.tr;
    tr.setMeta("addToHistory", false);
    const newSelection = NodeSelection.create(menu.view.state.doc, pos);
    menu.view.dispatch(tr.setSelection(newSelection));
}

function imageFloat(floatKey, menu){
    const selection = menu.view.state.selection;
    const floatClasses = menu.dominator.options.photoFloatClasses;

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

    let attrs = { ...node.attrs, 'class': classes };

    menu.view.dispatch(menu.view.state.tr.setNodeMarkup(pos, null, attrs).scrollIntoView());

    let tr = menu.view.state.tr;
    tr.setMeta("addToHistory", false);
    const newSelection = NodeSelection.create(menu.view.state.doc, pos);
    menu.view.dispatch(tr.setSelection(newSelection));
}

function getNode(menu){
    let pos = getPosition(menu.view.state.selection);
    let node = menu.view.state.doc.nodeAt(pos);
    return node;
}

function getImage(menu){
    let pos = getPosition(menu.view.state.selection);
    pos += 1;
    return { img: menu.view.state.doc.nodeAt(pos), pos: pos};
}

function setAlt(menu, alt){
    const { img, pos } = getImage(menu);
    if(!img){ return; }
    menu.view.dispatch(menu.view.state.tr.setNodeMarkup(pos, null, { ...img.attrs, alt: alt }));
}

function floatButtonActivate(floatKey, menu, btn){
    const className = menu.dominator.options.photoFloatClasses[floatKey];
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

function sizeButtonActivate(sizeKey, menu, btn){
    const className = menu.dominator.options.photoSizeClasses[sizeKey];
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
    const items = [
        new DOMinatorMenuLabel({
            label: 'Photograph'
        }),
        new DOMinatorMenuSeparator (),

        new DOMinatorMenuDropdown ({
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
            ]
        }),
        new DOMinatorMenuDropdown ({
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
                        imageFloat('left', menu);
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
                        imageFloat('center', menu);
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
                        imageFloat('right', menu);
                    }
                })
            ]
        }),
        new DOMinatorMenuLabel({
            label: 'Alt tag:'
        }),
        new DOMinatorMenuInput ({
            update: (input) => {
                const {img} = getImage(menu);
                if(!img){ return true; }
                const alt = img.attrs.alt || '';
                input.setValue(alt);
            },
            key: 'href',
            action: (val) => {
                setAlt(menu, val);
            }
        }),
    ];

    if( typeof menu.dominator.options.menu.photograph ===  'function'){
        menu.dominator.options.menu.photograph(items, menu);
    }

    return new DOMinatorSubMenu({
        key: 'photograph',
        items: items
    });
}
