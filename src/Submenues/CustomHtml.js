import DOMinatorMenuButton from "./../DOMinatorMenuButton"
import DOMinatorMenuInput from "./../DOMinatorMenuInput"
import DOMinatorSubMenu from "./../DOMinatorSubMenu"
import DOMinatorMenuLabel from "./../DOMinatorMenuLabel"
import DOMinatorMenuSeparator from "./../DOMinatorMenuSeparator"
import {
    toggleClassOnNode
} from "./../DOMinatorActions"
export default function(menu) {

    if( menu.dominator.options.menu.custom_html ===  false){
        return null;
    }

    let isOpen = false;
    let items = [
        new DOMinatorMenuLabel({
            label: 'Custom Html'
        }),
        new DOMinatorMenuSeparator (),
        new DOMinatorMenuButton ({
            key: 'edit',
            icon: 'pencil',
            action: (button) => {
                if(button.isActive()){
                    menu.dominator.codeEditingWindowClose();
                    isOpen = false;
                    toggleButtons();
                }else{
                    menu.dominator.codeEditingWindowOpen();
                    isOpen = true;
                    toggleButtons();
                }
            },
            update: ()=>{
                toggleButtons()
            }
        }),
        new DOMinatorMenuButton ({
            key: 'format',
            icon: 'magic',
            label: 'Fromat Code',
            action: (button) => {
                menu.dominator.codeEditingWindowFormat();
            },
        }),
    ];

    function toggleButtons(){
        items.forEach(button => {
            if(button.options && button.options.key !== 'edit' && typeof button.enable === 'function'){
                if(isOpen){
                    button.enable();
                }else{
                    button.disable();
                }
            }else if(button.options && button.options.key === 'edit'){
                if(isOpen){
                    button.activate();
                }else{
                    button.deactivate();
                }
            }
        });
    }

    if( typeof menu.dominator.options.menu.custom_html ===  'function'){
        menu.dominator.options.menu.custom_html(items, menu);
    }

    return new DOMinatorSubMenu({
        key: 'custom_html',
        items: items,
        afterHide: ()=>{
            menu.dominator.codeEditingWindowClose();
            isOpen = false;
            toggleButtons();
        }
    });
}
