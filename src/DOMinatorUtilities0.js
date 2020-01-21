export function getMarkRange(ResolvedPos, mark) {

    // console.log('ResolvedPos.parentOffset');
    // console.log(ResolvedPos.parentOffset);
    //
    // console.log('ResolvedPos.textOffset');
    // console.log(ResolvedPos.textOffset);
    //
    // console.log('ResolvedPos.start()');
    // console.log(ResolvedPos.start());
    //
    // console.log('ResolvedPos.end()');
    // console.log(ResolvedPos.end());
    //
    // console.log('ResolvedPos.before()');
    // console.log(ResolvedPos.before());
    //
    // console.log('ResolvedPos.after()');
    // console.log(ResolvedPos.after());

    // ResolvedPos.parent.childAfter(ResolvedPos.parentOffset)


    let parent = ResolvedPos.parent;
    let index = ResolvedPos.index();

    // ResolvedPos is at the end of parent there are nodes with this index
    if (parent.content.content.length === index){
        return false;
    }

    const child = parent.content.content[index];

    let from = ResolvedPos.start() + ResolvedPos.parentOffset - ResolvedPos.textOffset;
    let to = from + child.nodeSize;

    // look ahead
    for (let i = index + 1; i < parent.content.content.length; i++) {
        let temp = parent.content.content[i];
        if(mark.isInSet(temp.marks)){
            to += temp.nodeSize;
        }else{
            break;
        }
    }

    // look back
    for (let i = index - 1; i >= 0 ; i--) {
        let temp = parent.content.content[i];
        if(mark.isInSet(temp.marks)){
            from -= temp.nodeSize;
        }else{
            break;
        }
    }

    return { from, to };
}







// UNUSED FOR NOW
function getSelectionStart() {
   var node = document.getSelection().anchorNode;
   return (node.nodeType == 3 ? node.parentNode : node);
}
function getMarks(ResolvedPos){

    let parent = ResolvedPos.parent;
    let index = ResolvedPos.index();
    // console.log('index');
    // console.log(index);
    // console.log(ResolvedPos);

    // In an empty parent, return the empty array
    if (parent.content.size == 0) {
        return [];
    }

    // ResolvedPos is at the end of parent there are nodes with this index
    if (parent.content.content.length === index){
        return [];
    }

    // look ahead
    const child = parent.content.content[index];
    // console.log('child');
    // console.log(child);
    // let marks = [...child.marks];
    // console.log(marks);

    child.marks.forEach( mark =>{
        delete(mark._startIndex);
        delete(mark._endIndex);
        delete(mark._order);
    });

    let ended = 0; // how many mark has found its end
    for (let i = index + 1; i < parent.content.content.length; i++) {
        let temp = parent.content.content[i];
        child.marks.forEach( mark =>{
            if(!mark._endIndex && !mark.isInSet(temp.marks)){
                mark._endIndex = i-1;
                ended++;
            }
        });

        if(temp.marks.length === 0 || ended === child.marks.length){
            break;
        }
    }

    let started = 0; // how many mark has found its start
    for (let i = index - 1; i >= 0 ; i--) {
        let temp = parent.content.content[i];
        child.marks.forEach( mark =>{
            if(!mark._startIndex && !mark.isInSet(temp.marks)){
                mark._startIndex = i+1;
                started++;
            }
        });

        if(temp.marks.length === 0 || started === child.marks.length){
            break;
        }
    }

    child.marks.forEach( mark =>{
        console.log(mark);
        if(!mark._startIndex){
            mark._startIndex = index;
        }
        if(!mark._endIndex){
            mark._endIndex = index;
        }
        mark._order = mark._endIndex - mark._startIndex;
    });

    console.log(child.marks);
    // look behind
    // parent.content.content

    // console.log(parent);
    // console.log(parent.child(index));
    // return parent.child(index).marks;
    // console.log(parent.content.content);
    // console.log(parent.content.content.length);

    return;
    // When inside a text node, just return the text node's marks
    // if (Position.textOffset) {
    //     console.log('this is it');
    //     console.log(parent.child(index));
    //     return parent.child(index).marks;
    // }else{
    //     console.log('Position.textOffset');
    //     console.log(Position.textOffset);
    // }
    //
    // let main = parent.maybeChild(index - 1);
    // let other = parent.maybeChild(index);
    //
    // // If the `after` flag is true of there is no node before, make
    // // the node after this position the main reference.
    // if (!main) {
    //     let tmp = main;
    //     main = other;
    //     other = tmp
    // }
    //
    // // Use all marks in the main node, except those that have
    // // `inclusive` set to false and are not present in the other node.
    // let marks = main.marks
    // for (var i = 0; i < marks.length; i++){
    //     if (marks[i].type.spec.inclusive === false && (!other || !marks[i].isInSet(other.marks))){
    //         marks = marks[i--].removeFromSet(marks)
    //     }
    // }
    //
    // return marks

}
