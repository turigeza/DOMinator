import DOMinatorMenuButton from "./../DOMinatorMenuButton"
import DOMinatorMenuInput from "./../DOMinatorMenuInput"
import DOMinatorSubMenu from "./../DOMinatorSubMenu"
import DOMinatorMenuLabel from "./../DOMinatorMenuLabel"
import DOMinatorMenuSeparator from "./../DOMinatorMenuSeparator"

export default function(menu) {
    if( menu.dominator.options.menu.carousel_link ===  false){
        return null;
    }
    const items =  [
        new DOMinatorMenuLabel({
            label: 'Carousel Link'
        }),
        new DOMinatorMenuSeparator (),
        new DOMinatorMenuButton ({
            key: 'unlink',
            icon: 'chain-broken',
            action: () => {
                menu.dominator.options.carouselSet(menu.dominator, 'href', '');
            }
        }),
        new DOMinatorMenuButton ({
            update: (button) => {
                menu.dominator.options.carouselUpdateButton(menu.dominator, button);
            },
            key: 'link_external',
            icon: 'external-link',
            action: ()=>{
                menu.dominator.options.carouselSet(menu.dominator, 'target');
            }
        }),
        new DOMinatorMenuInput ({
            label: 'Link: ',
            update: (input) => {
                input.setValue(menu.dominator.options.carouselGet(menu.dominator, 'href'));
            },
            key: 'href',
            action: (val) => {
                menu.dominator.options.carouselSet(menu.dominator, 'href', val);
            }
        }),
        new DOMinatorMenuInput ({
            label: 'Link Title: ',
            update: (input) => {
                input.setValue(menu.dominator.options.carouselGet(menu.dominator, 'link_title'));
            },
            key: 'link_title',
            action: (val) => {
                menu.dominator.options.carouselSet(menu.dominator, 'link_title', val);
            }
        }),
    ];

    if( typeof menu.dominator.options.menu.carousel_link ===  'function'){
        menu.dominator.options.menu.carousel_link(items, menu);
    }

    return new DOMinatorSubMenu({
        key: 'carousel_link',
        items: items,
    });
}
