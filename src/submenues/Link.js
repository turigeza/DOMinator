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
    toggleClassOnMark
} from "./../DOMinatorActions"

export default function(menu) {

    const items = [
        new DOMinatorMenuLabel({
            label: 'Link'
        }),
        new DOMinatorMenuSeparator (),
        new DOMinatorMenuInput ({
            update: (input) => {
                input.setValue(menu.activeMark.attrs.href);
            },
            key: 'href',
            action: (val) => {
                changeAttributeOnMark('href', val, menu);
            }
        }),
        new DOMinatorMenuButton ({
            key: 'unlink',
            icon: 'chain-broken',
            action: () => {
                clearFormatting(menu);
            }
        }),
        new DOMinatorMenuButton ({
            update: (button) => {
                if(menu.activeMark.attrs.target === '_blank'){
                    button.activate();
                }else{
                    button.deactivate();
                }
            },
            key: 'link_external',
            icon: 'external-link',
            action: (state, dispatch, view)=>{
                // attribute, value, menu, mark
                toggleAttributeOnMark('target', '_blank', menu, menu.activeMark);
            }
        }),
        new DOMinatorMenuButton ({
            update: (button) => {
                updateLinkStyleButton('button button-default', button, menu);
            },
            key: 'link_style_default',
            icon: 'paint-brush',
            action: ()=>{
                toggleClassOnMark(menu, menu.activeMark, 'button button-default', linkClasses);
            }
        }),
        new DOMinatorMenuButton ({
            update: (button) => {
                updateLinkStyleButton('button button-primary', button, menu);
            },
            key: 'link_style_primary',
            icon: 'paint-brush',
            action: ()=>{
                toggleClassOnMark(menu, menu.activeMark, 'button button-primary', linkClasses);
            }
        }),
        new DOMinatorMenuButton ({
            update: (button) => {
                updateLinkStyleButton('button button-warning', button, menu);
            },
            key: 'link_style_warning',
            icon: 'paint-brush',
            action: ()=>{
                toggleClassOnMark(menu, menu.activeMark, 'button button-warning', linkClasses);
            }
        }),
        new DOMinatorMenuButton ({
            update: (button) => {
                updateLinkStyleButton('button button-danger', button, menu);
            },
            key: 'link_style_danger',
            icon: 'paint-brush',
            action: ()=>{
                toggleClassOnMark(menu, menu.activeMark, 'button button-danger', linkClasses);
            }
        }),
        new DOMinatorMenuButton ({
            update: (button) => {
                updateLinkStyleButton('button button-success', button, menu);
            },
            key: 'link_style_success',
            icon: 'paint-brush',
            action: ()=>{
                toggleClassOnMark(menu, menu.activeMark, 'button button-success', linkClasses);
            }
        }),
        new DOMinatorMenuButton ({
            update: (button) => {
                updateLinkStyleButton('button button-info', button, menu);
            },
            key: 'link_style_info',
            icon: 'paint-brush',
            action: ()=>{
                toggleClassOnMark(menu, menu.activeMark, 'button button-info', linkClasses);
            }
        }),
    ];

    if( typeof menu.dominator.options.menu.link ===  'function'){
        menu.dominator.options.menu.link(items, menu);
    }

    return new DOMinatorSubMenu({
        key: 'link',
        items: items
    });
}
