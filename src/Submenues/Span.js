import DOMinatorMenuButton from "./../DOMinatorMenuButton"
import DOMinatorMenuInput from "./../DOMinatorMenuInput"
import DOMinatorSubMenu from "./../DOMinatorSubMenu"
import DOMinatorMenuLabel from "./../DOMinatorMenuLabel"
import DOMinatorMenuSeparator from "./../DOMinatorMenuSeparator"
import {
    toggleClassOnNode
} from "./../DOMinatorActions"
export default function(menu) {

    if( menu.dominator.options.menu.span ===  false){
        return null;
    }

    let items = [
        new DOMinatorMenuLabel({
            label: 'Inline Style'
        }),
        new DOMinatorMenuSeparator (),
        new DOMinatorMenuLabel({
            label: ' - n/a - '
        }),
    ];

    if( typeof menu.dominator.options.menu.span ===  'function'){
        menu.dominator.options.menu.span(items, menu);
    }

    return new DOMinatorSubMenu({
        key: 'span',
        items: items
    });
}
