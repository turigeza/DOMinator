import {
    TextSelection,
    NodeSelection
} from "prosemirror-state"

export default class CarouselView {

    constructor(node, view, getPos) {
        this.node = node
        this.view = view
        this.getPos = getPos

        this.dom = document.createElement('div');
        this.dom.innerHTML = node.attrs.html;

        if(node.attrs.class){
            this.dom.setAttribute("class", node.attrs.class);
        }
        console.log('constructor');
        // this where we need to reapply the carousel but not always
        if(view.$d_listeners && typeof view.$d_listeners.afterCarouselConstruct === 'function'){
            view.$d_listeners.afterCarouselConstruct(this.dom, node, view, getPos);
        }
    }

    update(node, decorations) {
        console.log(node);
        console.log('UPDATE --- CarouselHtmlView');
        return true;
    }

    filterTransaction(tr){
        console.log(tr);
    }

    ignoreMutation() {
        return true;
    }

    // Called when the node view is removed from the editor or the whole editor is destroyed.
    destroy() {
        this.dom.remove();
        console.log('destroy --- CarouselHtmlView');
    }

}
