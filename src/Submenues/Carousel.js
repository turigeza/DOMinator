import DOMinatorMenuButton from "./../DOMinatorMenuButton"
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

function see(){

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
            key: 'add a slide',
            icon: 'plus',
            action: (DOMinator) => {
                menu.dominator.options.carouselAddSlide(menu.dominator);
            }
        }),
        new DOMinatorMenuButton ({
            key: 'remove current slide',
            icon: 'minus',
            action: () => {
                menu.dominator.options.carouselRemoveSlide(menu.dominator);
            }
        }),
        new DOMinatorMenuButton ({
            key: 'move slide left',
            icon: 'chevron-left',
            action: () => {
                menu.dominator.options.carouselMoveSlideLeft(menu.dominator);
            }
        }),
        new DOMinatorMenuButton ({
            key: 'move slide right',
            icon: 'chevron-right',
            action: () => {
                menu.dominator.options.carouselMoveSlideRight(menu.dominator);
            }
        }),
        new DOMinatorMenuButton ({
            key: 'auto play',
            icon: 'play',
            action: () => {
                menu.dominator.options.carouselToggleSetting(menu.dominator, 'autoPlay');
            }
        }),
        new DOMinatorMenuButton ({
            key: 'toggle full screen option',
            icon: 'expand',
            action: () => {
                menu.dominator.options.carouselToggleSetting(menu.dominator, 'fullscreen');
            }
        }),
        new DOMinatorMenuButton ({
            key: 'link slide',
            icon: 'link',
            action: () => {
                menu.activateSubmenu('carousel_link');
            }
        }),
        new DOMinatorMenuInput ({
            label: 'Title',
            update: (input) => {

            },
            key: 'href',
            action: (val) => {

            }
        }),
        new DOMinatorMenuInput ({
            label: 'Description',
            update: (input) => {

            },
            key: 'href',
            action: (val) => {

            }
        }),
        new DOMinatorMenuInput ({
            label: 'Link',
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
