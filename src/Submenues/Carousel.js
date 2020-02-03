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
    menu.view.dispatch(menu.view.state.tr.setNodeMarkup(pos, null, { ...img.attrs, alt: alt }));
}

function floatButtonActivate(floatKey, menu, btn){
    const className = menu.dominator.options.photoFloatClasses[floatKey];
    const node = getNode(menu);

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

    if(node.attrs.class && node.attrs.class.includes(className)){
        btn.activate();
        return true;
    }else{
        btn.deactivate();
        return false;
    }
}

// closest('.carousel_wrapper').find('.flickity_json').text(JSON.stringify(json));
// function get_carousel(){
//     return priv.tooltips.carousel.$attached_to.find('.flickity-carousel').flickity();
// }
// var $carousel = get_carousel();
// var text = $carousel.closest('.carousel_wrapper').find('.flickity_json').text();
// carousel.closest('.carousel_wrapper').find('.toggle-fullscreen').hide();

function see(menu){
    let selection = menu.view.state.selection;
    let pos = selection.from+2;
    let node = menu.view.state.doc.nodeAt(pos);
    let dom = menu.view.domAtPos(pos);
    console.log(pos);
    console.log(dom.node);
    console.dir(dom.node);

}

export default function(menu) {

    if( menu.dominator.options.menu.carousel ===  false){
        return null;
    }

    let items = [
        new DOMinatorMenuLabel({
            label: 'Carousel'
        }),
        new DOMinatorMenuSeparator (),
        new DOMinatorMenuButton ({
            key: 'paragraph',
            icon: 'paragraph',
            action: () => {
                see(menu);
            }
        }),
        new DOMinatorMenuInput ({
            update: (input) => {

            },
            key: 'href',
            action: (val) => {

            }
        }),
    ];

    if( typeof menu.dominator.options.menu.carousel ===  'function'){
        menu.dominator.options.menu.carousel(items, menu);
    }

    return new DOMinatorSubMenu({
        key: 'carousel',
        items: items
    });
}
//
// var $remove = $('<button class="btn btn-default btn" title="Remove this carousel cell"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button>');
// $remove.on('click', function(event){
//     var $carousel = get_carousel();
//     var flickity = $carousel.data('flickity');
//     if(flickity.cells.length === 1){
//         editable_toast('editor_last_carousel_el');
//         return;
//     }
//     $carousel.flickity( 'remove',  flickity.selectedElement);
//     $carousel.flickity('reloadCells').flickity('resize');
// });
//
// var $move_left = $('<button class="btn btn-default btn" title="Move cell to left"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></button>');
// $move_left.on('click', function(event){
//     var $carousel = get_carousel();
//     var flickity = $carousel.data('flickity');
//     var selected_el = flickity.selectedElement;
//     var selected_index = flickity.selectedIndex;
//
//     if(selected_index > 0){
//         var new_index =  flickity.selectedIndex-1;
//     }else{
//         var new_index = flickity.cells.length-1;
//     }
//
//     $carousel.flickity( 'remove',  flickity.selectedElement);
//     $carousel.flickity( 'insert',  selected_el, new_index);
//     $carousel.flickity( 'selectCell', new_index, false, true);
//
// });
