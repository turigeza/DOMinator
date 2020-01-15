export default class DOMinatorMenuButton {
    // dom
    // options
    // view

    constructor(options) {
        this.options = options;
        this.dom = document.createElement("button")
        this.dom.className = "DOMinatorMenuButton DOMinatorMenuButton-"+this.options.key;
        //document.createTextNode("Hello World");
        if(this.options.icon){
            if(typeof this.options.icon === 'string'){
                let icon = document.createElement("i");
                icon.className = 'fa fa-'+this.options.icon
                icon.setAttribute('aria-hidden', 'true');
                this.dom.appendChild(icon);
            }
        }

        this.dom.addEventListener('mousedown', event=>this.clicked(event))
    }

    clicked(event){
        event.preventDefault();
        this.view.focus();
        this.options.command(this.view.state, this.view.dispatch, this.view);
    }

    update(view){
        this.view = view;
        if(typeof this.options.update === 'function'){
            this.options.update(view);
        }
    }

    destroy() {

    }

    getDom(){
        return this.dom;
    }

    setParent(parent){
        this.parent = parent;
    }
}
