import DOMinatorMenuButton from "./../DOMinatorMenuButton"
import DOMinatorMenuInput from "./../DOMinatorMenuInput"
import DOMinatorSubMenu from "./../DOMinatorSubMenu"
import DOMinatorMenuLabel from "./../DOMinatorMenuLabel"
import DOMinatorMenuSeparator from "./../DOMinatorMenuSeparator"

export default function(menu) {

    if( menu.dominator.options.menu.carousel ===  false){
        return null;
    }

    function updateButton(button){
        menu.dominator.options.carouselUpdateButton(menu.dominator, button);
    }

    let items = [
        new DOMinatorMenuLabel({
            label: 'Carousel'
        }),
        new DOMinatorMenuSeparator (),
        new DOMinatorMenuButton ({
            key: 'add_a_slide',
            icon: 'plus',
            action: (DOMinator) => {
                menu.dominator.options.carouselAddSlide(menu.dominator);
            },
            update: updateButton
        }),
        new DOMinatorMenuButton ({
            key: 'remove_current_slide',
            icon: 'minus',
            action: () => {
                menu.dominator.options.carouselRemoveSlide(menu.dominator);
            },
            update: updateButton
        }),
        new DOMinatorMenuButton ({
            key: 'move_slide_left',
            icon: 'chevron-left',
            action: () => {
                menu.dominator.options.carouselMoveSlideLeft(menu.dominator);
            },
            update: updateButton
        }),
        new DOMinatorMenuButton ({
            key: 'move_slide_right',
            icon: 'chevron-right',
            action: () => {
                menu.dominator.options.carouselMoveSlideRight(menu.dominator);
            },
            update: updateButton
        }),
        new DOMinatorMenuButton ({
            key: 'auto_play',
            icon: 'play',
            action: () => {
                menu.dominator.options.carouselToggleSetting(menu.dominator, 'autoPlay');
            },
            update: updateButton
        }),
        new DOMinatorMenuButton ({
            key: 'toggle_full_screen_button',
            icon: 'expand',
            action: () => {
                menu.dominator.options.carouselToggleSetting(menu.dominator, 'fullscreen');
            },
            update: updateButton
        }),
        new DOMinatorMenuButton ({
            key: 'link_slide',
            icon: 'link',
            action: () => {
                menu.activateSubmenu('carousel_link');
            },
            update: updateButton
        }),
        new DOMinatorMenuInput ({
            label: 'Title',
            update: (input) => {
                input.setValue(menu.dominator.options.carouselGet(menu.dominator, 'title'));
            },
            key: 'title',
            action: (val) => {
                menu.dominator.options.carouselSet(menu.dominator, 'title', val);
            }
        }),
        new DOMinatorMenuInput ({
            label: 'Description',
            update: (input) => {
                input.setValue(menu.dominator.options.carouselGet(menu.dominator, 'description'));
            },
            key: 'description',
            action: (val) => {
                menu.dominator.options.carouselSet(menu.dominator, 'description', val);
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
