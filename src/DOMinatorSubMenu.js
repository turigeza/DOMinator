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
        this.items.forEach(item=>{
            item.update(menu);
        });
    }

    hide(){
        this.dom.style.display = "none";
    }

    show(menu){
        this.dom.style.display = "";
        if(menu){
            this.update(menu);
        }
    }

    getDom(){
        return this.dom;
    }

    destroy() {
        this.dom.remove();
    }
}
