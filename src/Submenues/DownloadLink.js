import DOMinatorMenuButton from "./../DOMinatorMenuButton"
// import DOMinatorMenuDropdown from "./../DOMinatorMenuDropdown"
import DOMinatorMenuInput from "./../DOMinatorMenuInput"
import DOMinatorSubMenu from "./../DOMinatorSubMenu"
import DOMinatorMenuLabel from "./../DOMinatorMenuLabel"
import DOMinatorMenuSeparator from "./../DOMinatorMenuSeparator"
import {
    clearFormatting,
    changeAttributeOnMark,
    toggleAttributeOnMark,
    updateLinkStyleButton,
    toggleClassOnMark,
    changeAttributeOnNode,
    insertDownloads
} from "./../DOMinatorActions"

export default function(menu) {
    if( menu.dominator.options.menu.download_link ===  false){
        return null;
    }
    const items =  [
        new DOMinatorMenuLabel({
            label: 'Download'
        }),
        new DOMinatorMenuSeparator (),
        new DOMinatorMenuButton ({
            key: 'download',
            icon: 'download',
            action: (button) => {
                menu.dominator.options.downloads(menu.dominator);
            }
        }),
        new DOMinatorMenuInput ({
            label: 'Link: ',
            update: (input) => {
                input.setValue(menu.activeBlock.attrs.href);
            },
            key: 'href',
            action: (val) => {
                changeAttributeOnNode(menu, 'href', val);
            }
        }),
        new DOMinatorMenuInput ({
            label: 'Title: ',
            update: (input) => {
                input.setValue(menu.activeBlock.attrs.title);
            },
            key: 'href',
            action: (val) => {
                changeAttributeOnNode(menu, 'title', val);
            }
        }),
    ];

    if( typeof menu.dominator.options.menu.download_link ===  'function'){
        menu.dominator.options.menu.download_link(items, menu);
    }

    return new DOMinatorSubMenu({
        key: 'download_link',
        items: items,
    });
}
