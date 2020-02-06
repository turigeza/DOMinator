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

        this.dom.setAttribute("class", node.attrs.class);
        this.dom.setAttribute('data-version', node.attrs['data-version']);
        console.log('constructor');
        console.log(node.attrs['data-version']);


        // this where we need to reapply the carousel but not always
        if(view.$d_listeners && typeof view.$d_listeners.afterCarouselConstruct === 'function'){
            view.$d_listeners.afterCarouselConstruct(this.dom, node, view, getPos);
        }
    }

    update(node, decorations) {
        console.log('UPDATE --- CarouselHtmlView');
        
        console.log("this.dom.getAttribute('data-version')" + this.dom.getAttribute('data-version'));
        console.log("this.node.attrs['data-version']" + this.node.attrs['data-version']);
        console.log("node.attrs['data-version']" + node.attrs['data-version']);
        return true;
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
