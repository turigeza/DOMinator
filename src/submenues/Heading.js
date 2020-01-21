import DOMinatorMenuButton from "./../DOMinatorMenuButton"
import DOMinatorSubMenu from "./../DOMinatorSubMenu"
import {
    convertBlock
} from "./../DOMinatorActions"

export default function(menu) {

    return new DOMinatorSubMenu({
        key: 'heading',
        items: [
            new DOMinatorMenuButton ({
                key: 'paragraph',
                icon: 'paragraph',
                action: () => { convertBlock('paragraph', {}, menu); }
            }),
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
        ],
    });
}
