export default class DOMinatorMenuInput {

    // dom - the dom element for this submenu
    // options
    // view
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

    changed(){
        if(this.options.command){
            event.preventDefault();
            this.view.focus();
            this.options.command(this.val, this.view);
        }
    }

    update(view, menu){
        this.view = view
        if(typeof this.options.update === 'function'){
            this.options.update(view, menu);
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
