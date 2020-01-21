export default class DOMinatorMenuSeparator {
    // dom

    constructor(options) {
        this.options = options;
        this.dom = document.createElement("div");
        this.dom.className = "DOMinatorMenuSeparator";
    }

    update(){
        // just a dummy
    }

    destroy() {
        this.dom.remove();
    }

    getDom(){
        return this.dom;
    }

    setParent(){
        // just a dummy
    }
}
