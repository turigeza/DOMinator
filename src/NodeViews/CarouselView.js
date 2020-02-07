export default class CarouselView {

    constructor(node, view, getPos) {
        this.node = node
        this.view = view
        this.getPos = getPos

        this.dom = document.createElement('div');
        this.dom.innerHTML = node.attrs.html;

        this.dom.setAttribute("class", node.attrs.class);

        // this where we need to reapply the carousel but not always
        if(view.$d_listeners && typeof view.$d_listeners.afterCarouselConstruct === 'function'){
            view.$d_listeners.afterCarouselConstruct(this.dom, node, view, getPos);
        }
    }

    update(node, decorations) {
        console.log(node.type);
        if(this.view.$d_listeners && typeof this.view.$d_listeners.beforeCarouselUpdate === 'function'){
            return this.view.$d_listeners.beforeCarouselUpdate(this.dom, node);
        }
        return true;
    }

    ignoreMutation() {
        return true;
    }

    destroy() {
        this.dom.remove();
        console.log('destroy --- CarouselHtmlView');
    }

}
