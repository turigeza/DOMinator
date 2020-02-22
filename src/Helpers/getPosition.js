export default function getPosition(selection){
    let pos;

    // the selction must be in the photo text area
    if(selection.constructor.name === 'TextSelection'){
        pos = selection.$head.before()-2;
    }else if(selection.constructor.name === 'NodeSelection'){
        pos = selection.from;
    }

    return pos;
}
