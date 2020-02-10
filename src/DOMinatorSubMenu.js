export default class DOMinatorSubMenu {

    // items - the menu items
    // dom - the dom element for this submenu
    // options
    // menu - the menu

    constructor(options) {
        this.options = options;

        this.items = options.items;
        this.dom = document.createElement("div");
        this.dom.className = "DOMinatorSubMenu DOMinatorSubMenu-"+this.options.key;

        this.items.forEach(item=>{
            this.dom.appendChild( item.getDom() );
            item.setParent(this);
        });
    }

    update(menu){
        this.menu = menu;
        if(typeof this.options.beforeUpdate === 'function'){
            this.options.beforeUpdate(this);
        }
        this.items.forEach(item=>{
            item.update(menu);
        });
        if(typeof this.options.afterUpdate === 'function'){
            this.options.afterUpdate(this);
        }
    }

    hide(){
        this.dom.style.display = "none";
        if(typeof this.options.afterHide === 'function'){
            this.options.afterHide(this);
        }
    }

    show(menu){
        this.dom.style.display = "";
        if(menu){
            this.update(menu);
        }
        if(typeof this.options.afterShow === 'function'){
            this.options.afterShow(this);
        }
    }

    getDom(){
        return this.dom;
    }

    destroy() {
        this.items.forEach(item => item.destroy());
        this.dom.remove();
        this.menu = null;
        this.options = null;
    }
}
