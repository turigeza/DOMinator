import DOMinatorMenuButton from "./DOMinatorMenuButton"
export default class DOMinatorMenuDropdown {
    // menu
    // dom
    // items
    // dropdown
    // dropdownButton - object
    // dropdownCaret - the small triangle on the right indicating the dropdown
    // activeItems = array of the active menu items
    // originalDropdownIcon
    constructor(options) {
        const settings = {
            autoclose: true
        };

        this.options = { ...settings, ...options };

        this.items = options.items;
        this.dom = document.createElement("div");
        this.dom.className = "DOMinatorDropDown DOMinatorDropDown-"+this.options.key;

        this.dropdownButton = new DOMinatorMenuButton ({
            key: this.options.key,
            icon: this.options.icon,
            iconType: this.options.iconType,
            classes: ' DOMinatorDropDownMainButton',
            action: () => {
                let defaultAction = true;
                if(typeof this.options.update === 'function'){
                    defaultAction = this.options.update(this);
                }

                // default is to open and close the menu and perhaps show the active selected item
                if(defaultAction){
                    this.toggleMenu();
                }
            },
            update: (menu)=>{
                if (typeof this.options.update === 'function'){
                    this.options.update(this);
                }else if(this.options.update === 'appendToDropDownLabel'){

                }else{
                    if(this.activeItems && this.activeItems.length > 0){
                        this.dropdownButton.activate();
                        if(this.activeItems.length === 1){
                            const i = this.activeItems[0].getIcon();
                            this.dropdownButton.swapIcon(i);
                        }
                    }else{
                        this.dropdownButton.deactivate();
                        this.dropdownButton.reinstateIcon();
                    }
                }
            }
        }),

        this.dropdownButton.dom.addEventListener('blur', event=>{
            this.close();
        });

        this.dom.appendChild(this.dropdownButton.getDom());

        // drop down icon
        if(this.options.dropdownCaret !== false ){
            if(typeof this.options.dropdownCaret === 'undefined'){
                this.dropdownCaret = document.createElement("i");
                this.dropdownCaret.className = "fa fa-caret-down DOMinatorDropDownCaret";
            }else{
                this.dropdownCaret = this.options.dropdownCaret;
            }
            this.dropdownButton.dom.appendChild(this.dropdownCaret);
            this.dropdownButton.dom.classList.add('DOMinatorButtonWithCaret');
        }


        this.dropdown = document.createElement("div");
        this.dropdown.className = "DOMinatorDropDownContainer";
        this.dropdown.style.display = "none"

        if(this.options.label){
            let text = document.createTextNode(this.options.label);
            this.dom.appendChild(text);
        }

        this.dom.appendChild(this.dropdown);
        this.items.forEach(item=>{
            this.dropdown.appendChild( item.getDom() );
            item.setParent(this);
        });

        // add an event listener to the document so we can let dropdowns know that they ar unfocused
        this.mousedown = (event)=>{
            if(!this.dom.contains(event.target) && this.options.autoclose){
                this.close();
            }
        };

        document.body.addEventListener('mousedown', this.mousedown);
    }

    toggleMenu(){
        if(this.dropdown.style.display === 'none'){
            this.open();
        }else{
            this.close();
        }
    }

    open(){
        this.dropdown.style.display = '';
    }

    close(){
        this.dropdown.style.display = 'none';
    }

    setParent(){

    }

    update(menu){
        this.menu = menu;
        this.activeItems = [];
        this.items.forEach(item => {
            const rs = item.update(menu);
            if(rs){
                this.activeItems.push(item)
            }
        });
        this.dropdownButton.update(menu);
    }

    getDom(){
        return this.dom;
    }

    destroy() {
        document.body.removeEventListener('mousedown', this.mousedown);
        this.dom.remove();
    }
}
