export default class DOMinatorMenuLabel {
    // dom

    constructor(options) {
        this.options = options;
        this.dom = document.createElement("div");
        this.text = document.createTextNode(options.label);
        this.dom.appendChild(this.text);
        this.dom.className = "DOMinatorMenuLabel";
        if(this.options.className){
            this.dom.className += this.options.className;
        }
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
