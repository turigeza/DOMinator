import DOMinatorMenuButton from "./../DOMinatorMenuButton"
import DOMinatorMenuDropdown from "./../DOMinatorMenuDropdown"
import DOMinatorMenuSeparator from "./../DOMinatorMenuSeparator"

import DOMinatorSubMenu from "./../DOMinatorSubMenu"
import {
    toggleMark,
    clearFormatting
} from "./../DOMinatorActions"

export default function(menu) {
    return new DOMinatorSubMenu({
        key: 'right',
        items: [
            new DOMinatorMenuSeparator (),
            new DOMinatorMenuButton ({
                key: 'undo',
                icon: 'undo',
            }),
            new DOMinatorMenuButton ({
                key: 'redo',
                icon: 'repeat',
            }),
            new DOMinatorMenuDropdown ({
                key: 'menu',
                icon: 'ellipsis-v',
                dropdownCaret: false,
                items: [
                    new DOMinatorMenuButton ({
                        key: 'page settings',
                        icon: 'cog',
                        label: 'Page Settings',
                        action: (button) => {
                            menu.dominator.options.pageSettings(menu, menu.dominator);
                        }
                    }),
                    new DOMinatorMenuButton ({
                        key: 'revisions',
                        icon: 'clock-o',
                        label: 'Show Revisions',
                        action: () => {
                            menu.dominator.options.showRevisions(menu, menu.dominator);
                        }
                    }),
                    new DOMinatorMenuButton ({
                        key: 'shedule',
                        icon: 'calendar',
                        label: 'Shedule',
                        action: () => {
                            menu.dominator.options.shedule(menu, menu.dominator);
                        }
                    }),
                    new DOMinatorMenuButton ({
                        key: 'new page',
                        icon: 'file-o',
                        label: 'New Page',
                        action: () => {
                            menu.dominator.options.newPage(menu, menu.dominator);
                        }
                    }),
                    new DOMinatorMenuButton ({
                        key: 'go live',
                        icon: 'check',
                        label: 'Go Live',
                        action: () => {
                            menu.dominator.options.goLive(menu, menu.dominator);
                        }
                    }),
                    new DOMinatorMenuButton ({
                        key: 'exit editor',
                        icon: 'close',
                        label: 'Exit',
                        action: () => {
                            menu.dominator.options.exit(menu, menu.dominator);
                        }
                    }),
                ]
            })

        ]
    });
}
