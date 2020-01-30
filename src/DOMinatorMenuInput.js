export default class DOMinatorMenuInput {

    // dom - the dom element for everything
    // options
    // menu
    // val
    // parent
    // input
    // label

    constructor(options) {
        this.options = options;

        this.dom = document.createElement("label");
        this.dom.className = "DOMinatorMenuInput DOMinatorMenuInput-"+this.options.key;

        if(this.options.label){
            const span = document.createElement("span");
            span.appendChild(document.createTextNode(this.options.label))
            this.dom.append(span);
        }

        this.input = document.createElement("input")

        this.input.setAttribute('placeholder', options.placeholder || 'More tea Vicar ... ?');
        this.input.addEventListener('focus', ()=>{
            this.val = this.input.value;
        });

        this.input.addEventListener('blur', ()=>{
            if(this.val !== this.input.value){
                this.val = this.input.value;
                this.changed();
            }
        });
        this.dom.appendChild(this.input);
    }

    setValue(val){
        this.input.value = val;
        this.val = val;
    }

    changed(){
        if(this.options.action){
            event.preventDefault();
            this.menu.view.focus();
            this.options.action(this.val, this);
        }
    }

    update(menu){
        this.menu = menu
        if(typeof this.options.update === 'function'){
            this.options.update(this, menu);
        }
    }

    setParent(parent){
        this.parent = parent;
    }

    getDom(){
        return this.dom;
    }

    destroy() {
        this.dom.remove();
    }
}
