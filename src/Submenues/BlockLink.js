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
    insertDownloads,
    toggleClassOnNode
} from "./../DOMinatorActions"

export default function(menu) {
    if( menu.dominator.options.menu.download_link ===  false){
        return null;
    }
    const items =  [
        new DOMinatorMenuLabel({
            label: 'Block Link'
        }),
        new DOMinatorMenuSeparator (),
        new DOMinatorMenuButton ({
            key: 'shadow',
            icon: 'window-restore',
            action: (button) => {
                toggleClassOnNode(menu, 'd-block-link-flat');
            },
            update(button){
                if(menu.activeBlock.attrs.class && menu.activeBlock.attrs.class.includes('d-block-link-flat')){
                    button.deactivate();
                }else{
                    button.activate();
                }
            }
        }),
        new DOMinatorMenuButton ({
            key: 'outline',
            icon: 'square-o',
            action: (button) => {
                toggleClassOnNode(menu, 'd-block-link-no-outline');
            },
            update(button){
                if(menu.activeBlock.attrs.class && menu.activeBlock.attrs.class.includes('d-block-link-no-outline')){
                    button.deactivate();
                }else{
                    button.activate();
                }
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
        key: 'download link',
        items: items,
    });
}
