import {
    alignSelection,
    updateAlignmentButton,
    toggleClassOnNode
} from "./../DOMinatorActions"

import DOMinatorMenuButton from "./../DOMinatorMenuButton"
import DOMinatorMenuDropdown from "./../DOMinatorMenuDropdown"
import DOMinatorSubMenu from "./../DOMinatorSubMenu"
import DOMinatorMenuLabel from "./../DOMinatorMenuLabel"
import DOMinatorMenuSeparator from "./../DOMinatorMenuSeparator"
import {
    convertBlock,
    toggleList,
    toggleWrap,
    insertLayout
} from "./../DOMinatorActions"

export default function(menu) {

    const items = [
        // label
        new DOMinatorMenuLabel({
            label: 'Paragraph'
        }),
        new DOMinatorMenuSeparator(),
        // paragraph
        new DOMinatorMenuButton({
            key: 'paragraph',
            icon: 'paragraph',
            update: (button) => {
                if (menu.activeBlock && menu.activeBlock.type.name === 'paragraph') {
                    button.activate();
                } else {
                    button.deactivate();
                }
            },
            action: () => {
                convertBlock('paragraph', {}, menu);
            }
        }),
        // heading
        new DOMinatorMenuDropdown({
            key: 'heading',
            icon: 'header',
            items: [
                new DOMinatorMenuButton({
                    key: 'heading 1',
                    label: 'H1',
                    action: () => {
                        convertBlock('heading', {
                            level: 1
                        }, menu);
                    }
                }),
                new DOMinatorMenuButton({
                    key: 'heading 2',
                    label: 'H2',
                    action: () => {
                        convertBlock('heading', {
                            level: 2
                        }, menu);
                    }
                }),
                new DOMinatorMenuButton({
                    key: 'heading 3',
                    label: 'H3',
                    action: () => {
                        convertBlock('heading', {
                            level: 3
                        }, menu);
                    }
                }),
                new DOMinatorMenuButton({
                    key: 'heading 4',
                    label: 'H4',
                    action: () => {
                        convertBlock('heading', {
                            level: 4
                        }, menu);
                    }
                }),
                new DOMinatorMenuButton({
                    key: 'heading 5',
                    label: 'H5',
                    action: () => {
                        convertBlock('heading', {
                            level: 5
                        }, menu);
                    }
                }),
                new DOMinatorMenuButton({
                    key: 'heading 6',
                    label: 'H6',
                    action: () => {
                        convertBlock('heading', {
                            level: 6
                        }, menu);
                    }
                }),
            ]
        }),
        // alignment
        new DOMinatorMenuDropdown({
            key: 'alignment',
            icon: 'align-left',
            items: [
                new DOMinatorMenuButton({
                    key: 'align left',
                    icon: 'align-left',
                    update(button) {
                        return updateAlignmentButton(button, menu, 'left');
                    },
                    action: (button) => {
                        alignSelection(menu.view, button.isActive() ? '' : 'left', menu.dominator.options.textAlignClasses);
                    }
                }),
                new DOMinatorMenuButton({
                    key: 'align center',
                    icon: 'align-center',
                    update(button) {
                        return updateAlignmentButton(button, menu, 'center');
                    },
                    action: (button) => {
                        alignSelection(menu.view, button.isActive() ? '' : 'center', menu.dominator.options.textAlignClasses);
                    }
                }),
                new DOMinatorMenuButton({
                    key: 'align right',
                    icon: 'align-right',
                    update(button) {
                        return updateAlignmentButton(button, menu, 'right');
                    },
                    action: (button) => {
                        alignSelection(menu.view, button.isActive() ? '' : 'right', menu.dominator.options.textAlignClasses);
                    }
                }),
                new DOMinatorMenuButton({
                    key: 'clear alignment',
                    icon: 'clearalignment',
                    iconType: 'dics',
                    action: () => {
                        alignSelection(menu.view, null, menu.dominator.options.textAlignClasses);
                    }
                }),
            ]
        }),
        // ul
        new DOMinatorMenuButton({
            key: 'unordered list',
            icon: 'list-ul',
            action: () => {
                toggleList('bullet_list', menu);
            }
        }),
        // ol
        new DOMinatorMenuButton({
            key: 'ordered list',
            icon: 'list-ol',
            action: () => {
                toggleList('ordered_list', menu);
            }
        }),
        // indent
        new DOMinatorMenuButton({
            key: 'indent',
            icon: 'indent',
            action: () => {
                toggleWrap('blockquote', menu);
            }
        }),
        // photo
        new DOMinatorMenuButton({
            key: 'photo',
            icon: 'camera-retro',
            action: (button) => {
                menu.dominator.options.photograph(menu.dominator);
            }
        }),
        // video
        new DOMinatorMenuButton({
            key: 'video',
            icon: 'film',
            action: (button) => {
                menu.dominator.options.video(menu.dominator);
            }
        }),
        // carousel
        new DOMinatorMenuButton({
            key: 'carousel',
            icon: 'carousel',
            iconType: 'dics',
            action: (button) => {
                menu.dominator.options.carousel(menu.dominator);
            }
        }),
        // cards
        new DOMinatorMenuDropdown({
            key: 'cards',
            icon: 'card',
            iconType: 'dics',
            items: [
                new DOMinatorMenuButton({
                    key: 'big card',
                    icon: 'card',
                    iconType: 'dics'
                }),
                new DOMinatorMenuButton({
                    key: 'small card',
                    icon: 'smallcard',
                    iconType: 'dics'
                })
            ]
        }),
        // layouts
        new DOMinatorMenuDropdown({
            key: 'layouts',
            icon: 'columns12',
            iconType: 'dics',
            items: [
                new DOMinatorMenuButton({
                    key: 'column 1 third - 2 third',
                    icon: 'columns12',
                    iconType: 'dics',
                    action: (button) => {
                        insertLayout(menu, 'layout_48');
                    }
                }),
                new DOMinatorMenuButton({
                    key: 'column 2 third - 1 third',
                    icon: 'columns21',
                    iconType: 'dics',
                    action: (button) => {
                        insertLayout(menu, 'layout_84');
                    }
                }),
                new DOMinatorMenuButton({
                    key: '4 columns',
                    icon: 'fourcolumns',
                    iconType: 'dics',
                    action: (button) => {
                        insertLayout(menu, 'layout_3333');
                    }
                }),
                new DOMinatorMenuButton({
                    key: '3 columns',
                    icon: 'threecolumns',
                    iconType: 'dics',
                    action: (button) => {
                        insertLayout(menu, 'layout_444');
                    }
                }),
                new DOMinatorMenuButton({
                    key: '2 columns',
                    icon: 'twocolumns',
                    iconType: 'dics',
                    action: (button) => {
                        insertLayout(menu, 'layout_66');
                    }
                }),
                new DOMinatorMenuButton({
                    key: '1 column',
                    icon: 'onecolumn',
                    iconType: 'dics',
                    action: (button) => {
                        insertLayout(menu, 'layout_12');
                    }
                })
            ]
        }),
        // download
        new DOMinatorMenuButton({
            key: 'download',
            icon: 'download',
            action: () => {
                menu.dominator.options.downloads(menu.dominator);
            }
        }),
        // element id
        new DOMinatorMenuButton({
            key: 'element id',
            icon: 'hashtag',
            action: () => {

            }
        }),
        // custom html
        new DOMinatorMenuButton({
            key: 'custom html',
            icon: 'code',
            action: (button) => {
                menu.dominator.options.photo(menu, menu.dominator);
            }
        }),
        // paddings
        new DOMinatorMenuButton({
            key: 'paddings',
            icon: 'padding',
            iconType: 'dics',
            action: (button) => {
                menu.activateSubmenu('paddings');
            },
            update(button, menu, ) {
                const block = menu.activeBlock;
                if (block && block.type.spec.canTakePadding) {
                    button.enable();
                    if (block.attrs.class && block.attrs.class.includes('d-p')) {
                        button.activate();
                    } else {
                        button.deactivate();
                    }
                } else {
                    button.disable();
                    button.deactivate();
                }
            }
        }),
        // margins
        new DOMinatorMenuButton({
            key: 'margins',
            icon: 'margin',
            iconType: 'dics',
            action: (button) => {
                menu.activateSubmenu('margins');
            },
            update(button, menu, ) {
                const block = menu.activeBlock;
                if (block && block.type.spec.canTakeMargin) {
                    button.enable();
                    if (block.attrs.class && block.attrs.class.includes('d-m')) {
                        button.activate();
                    } else {
                        button.deactivate();
                    }
                } else {
                    button.disable();
                    button.deactivate();
                }
            }
        }),
    ];

    if( typeof menu.dominator.options.menu.paragraph ===  'function'){
        menu.dominator.options.menu.paragraph(items);
    }

    return new DOMinatorSubMenu({
        key: 'paragraph',
        items: items
    });
}
