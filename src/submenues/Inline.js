import DOMinatorMenuButton from "./../DOMinatorMenuButton"
import DOMinatorMenuDropdown from "./../DOMinatorMenuDropdown"
import DOMinatorSubMenu from "./../DOMinatorSubMenu"
import DOMinatorMenuLabel from "./../DOMinatorMenuLabel"
import DOMinatorMenuSeparator from "./../DOMinatorMenuSeparator"
import {
    toggleMark,
    clearFormatting,
    alignSelection
} from "./../DOMinatorActions"

export default function(menu) {
    return new DOMinatorSubMenu({
        key: 'inline',
        items: [
            new DOMinatorMenuLabel({
                label: 'Selection'
            }),
            new DOMinatorMenuSeparator (),
            new DOMinatorMenuButton ({
                key: 'bold',
                icon: 'bold',
                action: () => {
                    toggleMark(menu, menu.editorSchema.marks.b);
                }
            }),
            new DOMinatorMenuButton ({
                key: 'italic',
                icon: 'italic',
                action: () => {
                    toggleMark(menu, menu.editorSchema.marks.i);
                }
            }),
            new DOMinatorMenuButton ({
                key: 'underline',
                icon: 'underline',
                action: () => {
                    toggleMark(menu, menu.editorSchema.marks.u);
                }
            }),
            new DOMinatorMenuButton ({
                key: 'link',
                icon: 'link',
                action: () => {
                    toggleMark(menu, menu.editorSchema.marks.link);
                }
            }),
            new DOMinatorMenuButton ({
                key: 'strikethrough',
                icon: 'strikethrough',
                action: () => {
                    toggleMark(menu, menu.editorSchema.marks.del);
                }
            }),
            new DOMinatorMenuButton ({
                key: 'subscript',
                icon: 'subscript',
                action: () => {
                    toggleMark(menu, menu.editorSchema.marks.sub);
                }
            }),
            new DOMinatorMenuButton ({
                key: 'superscript',
                icon: 'superscript',
                action: () => {
                    toggleMark(menu, menu.editorSchema.marks.sup);
                }
            }),
            // new DOMinatorMenuButton ({
            //     key: 'pencil',
            //     icon: 'pencil',
            //     action: () => {
            //         toggleMark(menu, menu.editorSchema.marks.del);
            //     }
            // }),
            new DOMinatorMenuDropdown ({
                key: 'alignment',
                icon: 'align-left',
                items: [
                    new DOMinatorMenuButton ({
                        key: 'align left',
                        icon: 'align-left',
                        action: (button) => {
                            alignSelection(menu.view, 'left', menu.dominator.options.textAlignClasses);
                        }
                    }),
                    new DOMinatorMenuButton ({
                        key: 'align center',
                        icon: 'align-center',
                        action: () => {
                            alignSelection(menu.view, 'center', menu.dominator.options.textAlignClasses);
                        }
                    }),
                    new DOMinatorMenuButton ({
                        key: 'align right',
                        icon: 'align-right',
                        action: () => {
                            alignSelection(menu.view, 'right', menu.dominator.options.textAlignClasses);
                        }
                    }),
                ]
            }),
            new DOMinatorMenuButton ({
                key: 'remove_formatting',
                icon: 'eraser',
                action: () => {
                    clearFormatting(menu);
                }
            }),
        ]
    });
}
