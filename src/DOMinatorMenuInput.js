export default class DOMinatorMenuInput {

    // dom - the dom element for this submenu
    // options
    // menu
    // val
    // parent
    constructor(options) {
        this.options = options;
        this.dom = document.createElement("input")
        this.dom.className = "DOMinatorMenuInput DOMinatorMenuInput-"+this.options.key;
        this.dom.setAttribute('placeholder', options.placeholder || 'More tea Vicar ... ?');
        this.dom.addEventListener('focus', ()=>{
            this.val = this.dom.value;
        });

        this.dom.addEventListener('blur', ()=>{
            if(this.val !== this.dom.value){
                this.val = this.dom.value;
                this.changed();
            }
        });
    }

    setValue(val){
        this.dom.value = val;
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
