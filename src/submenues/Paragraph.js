import {
    alignSelection
} from "./../DOMinatorActions"

import DOMinatorMenuButton from "./../DOMinatorMenuButton"
import DOMinatorMenuDropdown from "./../DOMinatorMenuDropdown"
import DOMinatorSubMenu from "./../DOMinatorSubMenu"
import DOMinatorMenuLabel from "./../DOMinatorMenuLabel"
import DOMinatorMenuSeparator from "./../DOMinatorMenuSeparator"
import {
    convertBlock,
    toggleList,
    toggleWrap

} from "./../DOMinatorActions"

export default function(menu) {

    return new DOMinatorSubMenu({
        key: 'paragraph',
        items: [
            new DOMinatorMenuLabel({
                label: 'Paragraph'
            }),
            new DOMinatorMenuSeparator (),
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
                    const selection = menu.view.state.selection;
                    // menu.dominator.options.photo(menu, menu.dominator);
                    /*
                    <div class="tg_subwidget tg_subwidget_photograph width-66 pull-left">
                        <img src="https://i.picsum.photos/id/519/600/400.jpg?grayscale"
                        alt="Some alt tag which is not the same as the caption."
                        data-photograph_id="12035" data-photograph_medium="https://i.picsum.photos/id/519/600/400.jpg?grayscale" data-photograph_large="https://i.picsum.photos/id/519/1200/800.jpg?grayscale" draggable="false"><div class="tg_subwidget_photograph_text"><span class="photograph_title">Picsum Photos random images</span> <span class="copyright">©</span>picsum.photos</div></div>
                    */
                    // const photographAttrs = {
                    //     alt: 'Placeholder',
                    //     src: 'https://picsum.photos/600/900?grayscale',
                    //
                    // };
                    // photograph_caption
                    // const image = view.state.schema.nodes.image.create({
                    //     src: 'https://i.picsum.photos/id/177/600/400.jpg?grayscale'
                    //     alt: 'Placeholder'
                    //     'data-photograph_medium': 'https://i.picsum.photos/id/177/600/400.jpg?grayscale',
                    //     'data-photograph_large': 'https://i.picsum.photos/id/177/600/400.jpg?grayscale'
                    // });

                    // caption
                    const captionText = menu.view.state.schema.text('Image from picsum.photos');
                    const photographCaption = menu.view.state.schema.nodes.photograph_caption.create({}, captionText);

                    // image
                    const image = menu.view.state.schema.nodes.image.create({
                        src: 'https://picsum.photos/600/400?grayscale',
                        alt: 'A placeholder image from picsum.photos',
                        // 'data-photograph_medium': 'https://i.picsum.photos/id/177/600/400.jpg?grayscale',
                        // 'data-photograph_large': 'https://i.picsum.photos/id/177/600/400.jpg?grayscale'
                    });

                    const photograph = menu.view.state.schema.nodes.photograph.create({}, [ image, photographCaption ]);


                    // console.log(photograph);
                    // console.log(selection.from);
                    // menu.view.state.tr.replaceWith( selection.from, selection.from, photograph );
                    // menu.view.state.tr.replaceWith( 0, 0, photograph );

                    const tr = menu.view.state.tr.insert( selection.from, photograph );
                    menu.view.dispatch(tr);
                    // if(selection.constructor.name === 'TextSelection'){
                    //     pos = selection.$head.before()-2;
                    // }else if(selection.constructor.name === 'NodeSelection'){
                    //     pos = selection.from;
                    // }
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
                    }),
                    new DOMinatorMenuButton ({
                        key: '1 column',
                        icon: 'onecolumn',
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
                key: 'paddings',
                icon: 'padding',
                iconType: 'dics',
                action: (button) => {
                    menu.activateSubmenu('paddings');
                },
                update(button, menu,){
                    if(!menu.activeBlock || (menu.activeBlock && typeof menu.activeBlock.type.attrs.class === 'undefined')){
                        button.disable();
                        button.deactivate();
                    }else{
                        button.enable();
                        button.deactivate();
                        if(menu.activeBlock.attrs.class && menu.activeBlock.attrs.class.includes('d-p')){
                            button.activate();
                            return true;
                        }else{
                            return false;
                        }

                    }
                }
            }),
            new DOMinatorMenuButton ({
                key: 'margins',
                icon: 'margin',
                iconType: 'dics',
                action: (button) => {
                    menu.activateSubmenu('margins');
                },
                update(button, menu,){
                    if(!menu.activeBlock || (menu.activeBlock && typeof menu.activeBlock.type.attrs.class === 'undefined')){
                        button.disable();
                        button.deactivate();
                    }else{
                        button.enable();
                        button.deactivate();
                        if(menu.activeBlock.attrs.class && menu.activeBlock.attrs.class.includes('d-m')){
                            button.activate();
                            return true;
                        }else{
                            return false;
                        }

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
