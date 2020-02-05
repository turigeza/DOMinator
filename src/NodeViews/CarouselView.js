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

        // this where we need to reapply the carousel but not always
        if(view.$d_listeners && typeof view.$d_listeners.afterCarouselConstruct === 'function'){
            view.$d_listeners.afterCarouselConstruct(this.dom, node, view, getPos);
        }
    }

    update(node, decorations) {
        console.log('UPDATE --- CarouselHtmlView');
    }

    ignoreMutation(m) {
        if(m.type === 'attributes' && m.attributeName === 'letmethrough'){
            return false;
        }
        return true;
        // Called when a DOM mutation or a selection change happens within the view. When the change is a selection change,
        // the record will have a type property of "selection" (which doesn't occur for native mutation records).
        // Return false if the editor should re-read the selection or re-parse the range around the mutation, true if it can safely be ignored.
    }

    // Called when the node view is removed from the editor or the whole editor is destroyed.
    destroy() {
        this.dom.remove();
        console.log('destroy --- CarouselHtmlView');
    }

}
