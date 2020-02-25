import {
    insertBlock
} from "./../DOMinatorActions"
export default function insertCard(menu, large) {

    const view = menu.view;
    const selection = view.state.selection;
    const state = view.state;
    const pos = selection.from;

    // caption
    const captionText = state.schema.text('Card Title');
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
    const masonary_card_header = state.schema.nodes.masonary_card_header.create({}, [photograph]);

    const paragraph = state.schema.nodes.paragraph.create({}, state.schema.text('The content of the card a aample image from picsum.photos.'));

    const masonary_card_content = state.schema.nodes.masonary_card_content.create({}, [paragraph]);
    const attr = large ? { 'class': 'tg_card tg_card_large' } : { 'class': 'tg_card tg_card_small' }
    const card = state.schema.nodes.masonary_card.create(attr, [
        masonary_card_header,
        masonary_card_content,
    ]);

    insertBlock(menu, card);
}
