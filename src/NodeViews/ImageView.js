import {
    TextSelection,
    NodeSelection
} from "prosemirror-state"

export default class ImageView {

    constructor(node, view, getPos) {

        this.node = node
        this.view = view
        this.getPos = getPos

        this.dom = this.contentDOM = document.createElement('img');

        Object.keys(node.attrs).forEach(key => {
            if(node.attrs[key] !== null){
                this.dom.setAttribute(key, node.attrs[key]);
            }
        });
    }
    
    destroy() {
        this.dom.remove();
    }

}
