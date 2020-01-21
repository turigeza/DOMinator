export default class DOMinatorMenuButton {
    // dom
    // options
    // menu

    constructor(options) {
        this.options = options;
        this.dom = document.createElement("button")
        this.dom.setAttribute('tabindex', '0');
        this.dom.className = "DOMinatorMenuButton DOMinatorMenuButton-"+this.options.key;
        if(options.classes){
            this.dom.className += options.classes
        }

        // title
        const title = this.options.title || this.options.key.charAt(0).toUpperCase() + this.options.key.slice(1)
        this.dom.setAttribute("title", title);

        //document.createTextNode("Hello World");
        if(this.options.icon){
            if(!this.options.iconType){
                let icon = document.createElement("i");
                icon.className = 'fa fa-'+this.options.icon
                icon.setAttribute('aria-hidden', 'true');
                this.dom.appendChild(icon);
            }else if(this.options.iconType === 'dics'){
                // the default icons boundled with dominator
                let icon = document.createElement("span");
                icon.className = 'dics dominator-icon-'+this.options.icon
                icon.setAttribute('aria-hidden', 'true');
                this.dom.appendChild(icon);
            }
        }

        if(this.options.label){
            let label = document.createElement('span');
            label.className = 'DOMinatorMenuButtonLabel';
            let text = document.createTextNode(this.options.label);
            label.appendChild(text);
            this.dom.appendChild(label);
        }

        if(this.options.icon && this.options.label){
            this.dom.className = this.dom.className +' labelAndIcon'
        }

        this.dom.addEventListener('mousedown', event=>this.clicked(event))
    }

    clicked(event){
        if(this.dom.classList.contains('button-disabled')){
            return;
        }

        if(this.options.action){
            event.preventDefault();
            this.options.action(this);
            this.menu.view.focus();
        }
    }

    update(menu){
        this.menu = menu;
        if(typeof this.options.update === 'function'){
            return this.options.update(this, menu);
        }
    }

    enable(){
        this.dom.disabled = false;
        this.dom.classList.remove('button-disabled');
    }

    disable(){
        this.dom.disabled = true;
        this.dom.classList.add('button-disabled');
    }

    activate(){
        this.enable();
        this.dom.classList.add('button-active');
    }

    deactivate(){
        this.dom.classList.remove('button-active');
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
