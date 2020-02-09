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
    const options = menu.dominator.options;
    const linkClasses = Object.keys(options.linkClasses).map(function(key) {
        return options.linkClasses[key];
    });

    const items = [
        new DOMinatorMenuLabel({
            label: 'Link'
        }),
        new DOMinatorMenuSeparator (),
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
                updateLinkStyleButton(options.linkClasses['default'], button, menu);
            },
            key: 'link_style_default',
            icon: 'paint-brush',
            action: ()=>{
                toggleClassOnMark(menu, menu.activeMark, options.linkClasses['default'], linkClasses);
            }
        }),
        new DOMinatorMenuButton ({
            update: (button) => {
                updateLinkStyleButton(options.linkClasses['primary'], button, menu);
            },
            key: 'link_style_primary',
            icon: 'paint-brush',
            action: ()=>{
                toggleClassOnMark(menu, menu.activeMark, options.linkClasses['primary'], linkClasses);
            }
        }),
        new DOMinatorMenuButton ({
            update: (button) => {
                updateLinkStyleButton(options.linkClasses['warning'], button, menu);
            },
            key: 'link_style_warning',
            icon: 'paint-brush',
            action: ()=>{
                toggleClassOnMark(menu, menu.activeMark, options.linkClasses['warning'], linkClasses);
            }
        }),
        new DOMinatorMenuButton ({
            update: (button) => {
                updateLinkStyleButton(options.linkClasses['danger'], button, menu);
            },
            key: 'link_style_danger',
            icon: 'paint-brush',
            action: ()=>{
                toggleClassOnMark(menu, menu.activeMark, options.linkClasses['danger'], linkClasses);
            }
        }),
        new DOMinatorMenuButton ({
            update: (button) => {
                updateLinkStyleButton(options.linkClasses['success'], button, menu);
            },
            key: 'link_style_success',
            icon: 'paint-brush',
            action: ()=>{
                toggleClassOnMark(menu, menu.activeMark, options.linkClasses['success'], linkClasses);
            }
        }),
        new DOMinatorMenuButton ({
            update: (button) => {
                updateLinkStyleButton(options.linkClasses['info'], button, menu);
            },
            key: 'link_style_info',
            icon: 'paint-brush',
            action: ()=>{
                toggleClassOnMark(menu, menu.activeMark, options.linkClasses['info'], linkClasses);
            }
        }),
        new DOMinatorMenuInput ({
            label: 'Link',
            update: (input) => {
                input.setValue(menu.activeMark.attrs.href);
            },
            key: 'href',
            action: (val) => {
                if(val === ''){
                    clearFormatting(menu);
                }else{
                    changeAttributeOnMark('href', val, menu);
                }
            }
        }),
        new DOMinatorMenuInput ({
            label: 'Title',
            update: (input) => {
                input.setValue(menu.activeMark.attrs.title);
            },
            key: 'href',
            action: (val) => {
                changeAttributeOnMark('title', val, menu);
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
