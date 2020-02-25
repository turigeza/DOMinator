import {
    alignSelection,
    updateAlignmentButton,
} from "./../DOMinatorActions"

import DOMinatorMenuButton from "./../DOMinatorMenuButton"
import DOMinatorMenuDropdown from "./../DOMinatorMenuDropdown"
import DOMinatorSubMenu from "./../DOMinatorSubMenu"
import DOMinatorMenuLabel from "./../DOMinatorMenuLabel"
import DOMinatorMenuSeparator from "./../DOMinatorMenuSeparator"
import insertCard from "./../Helpers/insertCard"
import {
    convertBlock,
    toggleList,
    toggleWrap,
    insertLayout,
    insertBlock
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
                    key: 'heading_1',
                    label: 'H1',
                    action: () => {
                        convertBlock('heading', {
                            level: 1
                        }, menu);
                    }
                }),
                new DOMinatorMenuButton({
                    key: 'heading_2',
                    label: 'H2',
                    action: () => {
                        convertBlock('heading', {
                            level: 2
                        }, menu);
                    }
                }),
                new DOMinatorMenuButton({
                    key: 'heading_3',
                    label: 'H3',
                    action: () => {
                        convertBlock('heading', {
                            level: 3
                        }, menu);
                    }
                }),
                new DOMinatorMenuButton({
                    key: 'heading_4',
                    label: 'H4',
                    action: () => {
                        convertBlock('heading', {
                            level: 4
                        }, menu);
                    }
                }),
                new DOMinatorMenuButton({
                    key: 'heading_5',
                    label: 'H5',
                    action: () => {
                        convertBlock('heading', {
                            level: 5
                        }, menu);
                    }
                }),
                new DOMinatorMenuButton({
                    key: 'heading_6',
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
                    key: 'align_left',
                    icon: 'align-left',
                    update(button) {
                        return updateAlignmentButton(button, menu, 'left');
                    },
                    action: (button) => {
                        alignSelection(menu.view, button.isActive() ? '' : 'left', menu.dominator.options.textAlignClasses);
                    }
                }),
                new DOMinatorMenuButton({
                    key: 'align_center',
                    icon: 'align-center',
                    update(button) {
                        return updateAlignmentButton(button, menu, 'center');
                    },
                    action: (button) => {
                        alignSelection(menu.view, button.isActive() ? '' : 'center', menu.dominator.options.textAlignClasses);
                    }
                }),
                new DOMinatorMenuButton({
                    key: 'align_right',
                    icon: 'align-right',
                    update(button) {
                        return updateAlignmentButton(button, menu, 'right');
                    },
                    action: (button) => {
                        alignSelection(menu.view, button.isActive() ? '' : 'right', menu.dominator.options.textAlignClasses);
                    }
                }),
                new DOMinatorMenuButton({
                    key: 'clear_alignment',
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
            key: 'unordered_list',
            icon: 'list-ul',
            action: () => {
                toggleList('bullet_list', menu);
            }
        }),
        // ol
        new DOMinatorMenuButton({
            key: 'ordered_list',
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
        // card
        new DOMinatorMenuButton({
            key: 'card',
            icon: 'card',
            iconType: 'dics',
            action: () => {

                const view = menu.view;
                const selection = view.state.selection;
                const state = view.state;
                const pos = selection.from;

                // caption
                const captionText = state.schema.text('Sample image from picsum.photos');
                const photographCaption = state.schema.nodes.photograph_caption.create({}, captionText);

                const dom = view.domAtPos(pos);

                // image
                const imageAttrs = {
                    'src': 'https://picsum.photos/900/600?grayscale',
                    'data-photograph_id': null,
                    'data-photograph_medium': 'https://picsum.photos/900/600?grayscale',
                    'data-photograph_large': 'https://picsum.photos/900/600?grayscale',
                };

                const image = state.schema.nodes.image.create(imageAttrs);

                const photograph = state.schema.nodes.photograph.create({}, [image, photographCaption]);

                const card = state.schema.nodes.card.create({},[
                    photograph,
                    state.schema.nodes.heading.create({level: 3 }, state.schema.text('Card Title')),
                    state.schema.nodes.paragraph.create({}, state.schema.text('Nulla in sollicitudin ligula. Quisque sit amet porta dolor. Nunc lobortis nisi magna, sed ultricies velit ultricies a. Ut a sapien et ipsum pulvinar blandit.'))
                ]);

                insertBlock(menu, card);
            }
        }),
        // masonary_cards
        new DOMinatorMenuDropdown({
            key: 'masonary_cards',
            icon: 'card',
            iconType: 'dics',
            items: [
                new DOMinatorMenuButton({
                    key: 'small_card',
                    icon: 'smallcard',
                    iconType: 'dics',
                    action: (button) => {
                        insertCard(menu);
                    }
                }),
                new DOMinatorMenuButton({
                    key: 'large_card',
                    icon: 'card',
                    iconType: 'dics',
                    action: (button) => {
                        insertCard(menu, 'large');
                    }
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
                    key: 'column_1_third_and_2_third',
                    icon: 'columns12',
                    iconType: 'dics',
                    action: (button) => {
                        insertLayout(menu, 'layout_48');
                    }
                }),
                new DOMinatorMenuButton({
                    key: 'column_2_third_and_1_third',
                    icon: 'columns21',
                    iconType: 'dics',
                    action: (button) => {
                        insertLayout(menu, 'layout_84');
                    }
                }),
                new DOMinatorMenuButton({
                    key: '4_columns',
                    icon: 'fourcolumns',
                    iconType: 'dics',
                    action: (button) => {
                        insertLayout(menu, 'layout_3333');
                    }
                }),
                new DOMinatorMenuButton({
                    key: '3_columns',
                    icon: 'threecolumns',
                    iconType: 'dics',
                    action: (button) => {
                        insertLayout(menu, 'layout_444');
                    }
                }),
                new DOMinatorMenuButton({
                    key: '2_columns',
                    icon: 'twocolumns',
                    iconType: 'dics',
                    action: (button) => {
                        insertLayout(menu, 'layout_66');
                    }
                }),
                new DOMinatorMenuButton({
                    key: '1_column',
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
            key: 'element_id',
            icon: 'hashtag',
            action: () => {

            }
        }),
        // horizontal_rule
        new DOMinatorMenuButton({
            key: 'horizontal_rule',
            icon: 'minus',
            action: (button) => {
                const hr = menu.view.state.schema.nodes.horizontal_rule.create({});
                insertBlock(menu, hr);
            }
        }),
        // blocklink
        new DOMinatorMenuButton({
            key: 'blocklink',
            icon: 'link',
            action: (button) => {
                const blocklink = menu.view.state.schema.nodes.blocklink.create({},
                    menu.view.state.schema.nodes.paragraph.create({},
                        menu.view.state.schema.text(`This is a block link. All of the content here will link to a page. You can put text and other content here like an image. But please don't put other links in here.`)
                    )
                );
                insertBlock(menu, blocklink);
            }
        }),
        // custom html
        new DOMinatorMenuButton({
            key: 'custom_html',
            icon: 'code',
            action: (button) => {
                menu.dominator.options.custom_html(menu.dominator);
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

    ];

    if( typeof menu.dominator.options.menu.paragraph ===  'function'){
        menu.dominator.options.menu.paragraph(items);
    }

    return new DOMinatorSubMenu({
        key: 'paragraph',
        items: items
    });
}
