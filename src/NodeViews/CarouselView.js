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
        // I don't get this bit but
        if(node.type.name !== 'carousel'){
            return false;
        }

        if(this.view.$d_listeners && typeof this.view.$d_listeners.beforeCarouselUpdate === 'function'){
            return this.view.$d_listeners.beforeCarouselUpdate(this.dom, node);
        }

        return false;
    }

    ignoreMutation() {
        return true;
    }

    // stopEvent(event){
    //     return false;
    // }

    destroy() {
        this.dom.remove();
    }

}
