// import {
//     normalizePaddingMargin
// } from "./../DOMinatorActions"

import DOMinatorMenuButton from "./../DOMinatorMenuButton"
import DOMinatorMenuDropdown from "./../DOMinatorMenuDropdown"
import DOMinatorSubMenu from "./../DOMinatorSubMenu"
import {
    convertBlock,
    toggleList,
    toggleWrap

} from "./../DOMinatorActions"

export default function(menu) {

    return new DOMinatorSubMenu({
        key: 'paragraph',
        items: [
            new DOMinatorMenuButton ({
                key: 'paragraph',
                icon: 'paragraph',
                action: () => { convertBlock('paragraph', {}, menu); }
            }),
            new DOMinatorMenuDropdown ({
                key: 'heading',
                icon: 'header',
                items: [
                    new DOMinatorMenuButton ({
                        key: 'heading 1',
                        label: 'H1',
                        action: () => {
                            convertBlock('heading', { level: 1 }, menu);
                        }
                    }),
                    new DOMinatorMenuButton ({
                        key: 'heading 2',
                        label: 'H2',
                        action: () => {
                            convertBlock('heading', { level: 2 }, menu);
                        }
                    }),
                    new DOMinatorMenuButton ({
                        key: 'heading 3',
                        label: 'H3',
                        action: () => {
                            convertBlock('heading', { level: 3 }, menu);
                        }
                    }),
                    new DOMinatorMenuButton ({
                        key: 'heading 4',
                        label: 'H4',
                        action: () => {
                            convertBlock('heading', { level: 4 }, menu);
                        }
                    }),
                    new DOMinatorMenuButton ({
                        key: 'heading 5',
                        label: 'H5',
                        action: () => {
                            convertBlock('heading', { level: 5 }, menu);
                        }
                    }),
                    new DOMinatorMenuButton ({
                        key: 'heading 6',
                        label: 'H6',
                        action: () => {
                            convertBlock('heading', { level: 6 }, menu);
                        }
                    }),
                ]
            }),
            new DOMinatorMenuDropdown ({
                key: 'alignment',
                icon: 'align-left',
                items: [
                    new DOMinatorMenuButton ({
                        key: 'align left',
                        icon: 'align-left',
                        action: () => {

                        }
                    }),
                    new DOMinatorMenuButton ({
                        key: 'align center',
                        icon: 'align-center',
                        action: () => {

                        }
                    }),
                    new DOMinatorMenuButton ({
                        key: 'align right',
                        icon: 'align-right',
                        action: () => {

                        }
                    }),
                ]
            }),
            new DOMinatorMenuButton ({
                key: 'unordered list',
                icon: 'list-ul',
                action: () => {
                    toggleList('bullet_list' , menu);
                }
            }),
            new DOMinatorMenuButton ({
                key: 'ordered list',
                icon: 'list-ol',
                action: () => {
                    toggleList('ordered_list' , menu);
                }
            }),
            new DOMinatorMenuButton ({
                key: 'indent',
                icon: 'indent',
                action: () => {
                    toggleWrap('blockquote' , menu);
                }
            }),
            // new DOMinatorMenuButton ({
            //     key: 'outdent',
            //     icon: 'outdent',
            //     action: () => {
            //         toggleWrap('blockquote' , menu);
            //     }
            // }),
            new DOMinatorMenuButton ({
                key: 'photo',
                icon: 'camera-retro',
                action: (button) => {
                    menu.dominator.options.photo(menu, menu.dominator);
                }
            }),
            new DOMinatorMenuButton ({
                key: 'video',
                icon: 'film',
                action: (button) => {
                    menu.dominator.options.photo(menu, menu.dominator);
                }
            }),
            new DOMinatorMenuButton ({
                key: 'carousel',
                icon: 'carousel',
                iconType: 'dics',
                action: (button) => {
                    menu.dominator.options.photo(menu, menu.dominator);
                }
            }),
            new DOMinatorMenuDropdown ({
                key: 'cards',
                icon: 'card',
                iconType: 'dics',
                items: [
                    new DOMinatorMenuButton ({
                        key: 'big card',
                        icon: 'card',
                        iconType: 'dics'
                    }),
                    new DOMinatorMenuButton ({
                        key: 'small card',
                        icon: 'smallcard',
                        iconType: 'dics'
                    })
                ]
            }),
            new DOMinatorMenuDropdown ({
                key: 'layouts',
                icon: 'columns12',
                iconType: 'dics',
                items: [
                    new DOMinatorMenuButton ({
                        key: 'column 1 third - 2 third',
                        icon: 'columns12',
                        iconType: 'dics'
                    }),
                    new DOMinatorMenuButton ({
                        key: 'column 2 third - 1 third',
                        icon: 'columns21',
                        iconType: 'dics'
                    }),
                    new DOMinatorMenuButton ({
                        key: '4 columns',
                        icon: 'fourcolumns',
                        iconType: 'dics'
                    }),
                    new DOMinatorMenuButton ({
                        key: '3 columns',
                        icon: 'threecolumns',
                        iconType: 'dics'
                    }),
                    new DOMinatorMenuButton ({
                        key: '2 columns',
                        icon: 'twocolumns',
                        iconType: 'dics'
                    })
                ]
            }),
            new DOMinatorMenuButton ({
                key: 'download',
                icon: 'download',
                action: () => {

                }
            }),
            new DOMinatorMenuButton ({
                key: 'element id',
                icon: 'hashtag',
                action: () => {

                }
            }),
            new DOMinatorMenuButton ({
                key: 'custom html',
                icon: 'code',
                action: (button) => {
                    menu.dominator.options.photo(menu, menu.dominator);
                }
            }),
            new DOMinatorMenuButton ({
                key: 'padding and margin',
                icon: 'paddingmargin',
                iconType: 'dics',
                action: (button) => {
                    menu.activateSubmenu('paddingmargin');
                },
                update(button, menu,){
                    if(!menu.activeBlock || (menu.activeBlock && typeof menu.activeBlock.type.attrs.class === 'undefined')){
                        button.disable();
                    }else{
                        button.enable();
                    }
                }
            }),

            // new DOMinatorMenuButton ({
            //     key: 'padding',
            //     icon: 'padding',
            //     iconType: 'dics',
            //     action: (button) => {
            //         menu.dominator.options.photo(menu, menu.dominator);
            //     }
            // }),
            // new DOMinatorMenuButton ({
            //     key: 'margin',
            //     icon: 'margin',
            //     iconType: 'dics',
            //     action: (button) => {
            //         menu.dominator.options.photo(menu, menu.dominator);
            //     }
            // }),
        ],
    });
}
