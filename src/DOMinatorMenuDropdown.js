export default class DOMinatorMenuDropdown {
    // view
    // dom
    // items

    constructor(options) {
        this.options = options;
        this.items = options.items;
        this.dom = document.createElement("div");
        this.dom.className = "DOMinatorDropDown DOMinatorDropDown-"+this.options.key;

        this.items.forEach(item=>{
            this.dom.appendChild( item.getDom() );
            item.setParent(this);
        });
    }

    update(view, menu){
        this.view = view;
        this.items.forEach(item=>{
            if(typeof item.update === 'function'){
                item.update(view, menu);
            }
        });
    }

    destroy() {

    }
}
