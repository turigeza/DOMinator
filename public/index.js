$( document ).ready(function(){

    // if the photo caption text marked as not to display you should empty it
    $('.tg_subwidget_photograph_text[style="display: none;"]').empty();

    // remove spans which are hidden in photo text
    $('.tg_subwidget_photograph_text span[style="display: none;"]').remove();

    // remove spansformating on the photograph captions
    $('.tg_subwidget_photograph_text span').each(function() {
        $(this).replaceWith(this.childNodes);
    });

    // remove toggle fullscreen buttons we don't need them anymore
    $('.toggle-fullscreen').remove();

    // mark blocklink links with class d-block-link
    $('.tg_subwidget_blocklink a .tg_sub_editable>*').unwrap();
    $('.tg_subwidget_blocklink a').addClass('d-block-link').unwrap();

    var editor = new DOMinator({
        container: '#editor',
        downloads: (DOMinator) => {
            DOMinator.insertDownloads([
                { href: '/', title: 'I am the title.',  target: null },
                { href: '/', title: 'An other download.',  target: null },
                { href: '/', title: 'How about this thing here?',  target: null },
            ]);
        },
        photograph: (DOMinator) => {
            DOMinator.insertPhotograph({
                alt: 'Just a placeholder from picsum.photos',
                caption: 'A placeholder from picsum.photos',
                // medium: 'https://i.picsum.photos/id/816/600/400.jpg?grayscale',
                medium: 'https://picsum.photos/600/400?grayscale',
                large: 'https://picsum.photos/1200/800?grayscale'
            });
        },

        // carousel
        carouselAddSlide: (DOMinator) => {
            const images = [
                'https://i.picsum.photos/id/985/1200/800.jpg?grayscale',
                'https://i.picsum.photos/id/986/1200/800.jpg?grayscale',
                'https://i.picsum.photos/id/987/1200/800.jpg?grayscale',
                'https://i.picsum.photos/id/988/1200/800.jpg?grayscale',
                'https://i.picsum.photos/id/989/1200/800.jpg?grayscale',
                'https://i.picsum.photos/id/990/1200/800.jpg?grayscale',
            ];

            const src = images[Math.floor(Math.random() * images.length)];

            // DOMinator.carouselAddSlide(slide);
            const $slide = $(`<div class="carousel-cell">
                <img src="${src}">
                <div class="tg_sub_editable carousel_text">
                    <h3>I have added this image</h3>
                    <p>Description on the image</p>
                </div>
            </div>`);

            const { flickity, $flickity, $widget } = getCarousel();

            flickity.insert($slide, flickity.selectedIndex+1);
            flickity.selectCell( flickity.selectedIndex+1, false, true);
            let version = Number($widget.attr('data-version'));
            let id = Date.now() + Math.floor(Math.random()*10);
            // console.log( Math.floor(Math.random() * 100000000 ) );

            version += 1;

            const $clone = $widget.clone(false);
            const $carousel = $clone.find('.flickity-carousel');
            $carousel.removeClass('flickity-enabled').removeClass('is-draggable').removeAttr('tabindex'); ///.removeAttr('index');
            $carousel.find('.carousel-cell').unwrap().unwrap().removeAttr('style').removeAttr('aria-hidden').removeClass('is-selected');
            $carousel.find('.tg_sub_editable').removeClass('tg_sub_editable');
            $carousel.find('.flickity-button').remove();
            $carousel.find('.flickity-page-dots').remove();

            const html = $clone.html();
            $widget.attr('data-version', version);
            DOMinator.updateCarousel(html, version);

            $slide.find('img').one("load", () => {
                flickity.reloadCells();
                flickity.resize();
            });
        },
        carouselRemoveSlide: (DOMinator) => {
            const flickity = getCarousel();

            if(flickity.cells.length === 1){
                alert('You can not remove the last element.');
               // editable_toast('editor_last_carousel_el');
               return;
           }

           flickity.remove(flickity.selectedElement);

           flickity.reloadCells();
           flickity.resize();
        },
        carouselMoveSlideLeft: (DOMinator) => {
            const flickity = getCarousel();
            const selectedElement = flickity.selectedElement;
            const selectedIndex = flickity.selectedIndex;
            let newIndex = 0;
            if(selectedIndex > 0){
                newIndex =  selectedIndex-1;
            }else{
                newIndex = flickity.cells.length-1;
            }

            flickity.remove(flickity.selectedElement);
            flickity.insert(selectedElement, newIndex);
            flickity.selectCell(newIndex, false, true);
        },
        carouselMoveSlideRight: (DOMinator) => {
            const flickity = getCarousel();
            const selectedElement = flickity.selectedElement;
            const selectedIndex = flickity.selectedIndex;
            let newIndex = 0;
            if(selectedIndex < flickity.cells.length-1){
                newIndex = flickity.selectedIndex+1;
            }else{
                newIndex = 0;
            }

            flickity.remove(flickity.selectedElement);
            flickity.insert(selectedElement, newIndex);
            flickity.selectCell(newIndex, false, true);

        },
        carouselToggleSetting: (key) => {
            const flickity = getCarousel();
            const jsonString = $('.tg_subwidget_carousel.ProseMirror-selectednode .flickity_json').text() || '{}';
            let settings = JSON.parse(jsonString);
            if(settings[key]){
                settings[key] = false;
            }else{
                settings[key] = true;
            }

            $('.tg_subwidget_carousel.ProseMirror-selectednode .flickity_json').text(JSON.stringify(settings));
            destroyCarousels();
            initCarousels();
            // flickity.destroy();
            // $('.tg_subwidget_carousel.ProseMirror-selectednode .flickity-carousel').flickity(settings);
        },
        menu: {
            paragraph: (items) => {
                items.splice(14,1);
                items.splice(11,1);
                items.splice(9,1);
            }
        },
        listeners: {
            afterCarouselConstruct: (dom) => {
                setTimeout(()=>{
                    initCarousels();
                }, 10);
            }
        }
    });

    editor.selectNode(10);
    initCarousels();

    function getCarousel(){
        const $flickity = $('.tg_subwidget_carousel.ProseMirror-selectednode .flickity-carousel');
        const flickity = $flickity.data('flickity');
        const $widget = $('.tg_subwidget_carousel.ProseMirror-selectednode');

        return { flickity, $flickity, $widget };
    }
    function destroyCarousels (){
        $('.carousel_wrapper').each(function(){

            var $this = $(this);
            var flickity = $this.find('.flickity-carousel').data('flickity')

            if(flickity){
                flickity.destroy();
            }
        });
    }

    function initCarousels (){
        $('.tg_subwidget_carousel').each(function(){
            var $this = $(this);
            var flickity = $this.find('.flickity-carousel').data('flickity')
            if(flickity){
                flickity.destroy();
            }
            initCarousel($this);
        });
    }

    function initCarousel ($dom){
        var text = $dom.find('.flickity_json').text();
        var settings = null;

        try{
            var settings = JSON.parse(text);
        }catch(err){

        }

        if(!settings){
            settings = {
                wrapAround: true,
                parallax: true,
                adaptiveHeight: true,
                imagesLoaded: true,
                fullscreen: true
                //lazyLoad: 2,
            }
        }

        settings.draggable = true;
        const $carousel = $dom.find('.flickity-carousel');
        $carousel.flickity(settings);

        const existingIndex = $carousel.attr('index') || 0;
        const flickity = $carousel.data('flickity');

        flickity.select(existingIndex, false, true);

        // this so we can reinstate the index after reinitialiseing the cartousel
        $carousel.on( 'change.flickity', function( event, index ) {
            $carousel.attr('index', index);
        });
    }
});

// var $edit = $('<button class="btn btn-default btn" title="Open in new window"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button>');
// $edit.on('click', function(event){
//     tg_window_manager.open('tg_editor_carousel');
// });
//
// priv.$carousel_link_new_window = $('<button class="btn btn-default btn" title="Open link in a new window"><i class="fa fa-external-link" aria-hidden="true"></i></button>');
// priv.$carousel_link_new_window.on('click', function(event){
//     priv.$carousel_link_new_window.toggleClass('btn-default btn-success');
//     update_link();
// });
//
// priv.$carousel_link_input = $('<input type="text" placeholder="The url this slide linkings to ..." class="form-control input">');
// priv.$carousel_link_input.on('keyup', function (e) {
//     if (e.keyCode == 13) {
//         update_link();
//     }
// });
//
// priv.$carousel_link_input.on('blur', function (e) {
//     update_link();
// });
//
// function update_link(){
//     var $carousel = get_carousel();
//     //var flickity = $carousel.data('flickity');
//
//     $link = $carousel.find('.carousel-cell.is-selected .carousel_link');
//     if($link.length === 0 && $carousel.length > 0){
//         var $link = $('<a class="carousel_link" href="#"></a>');
//         $carousel.find('.carousel-cell.is-selected').append($link);
//     }
//
//     $link.attr('href',priv.$carousel_link_input.val());
//     if(priv.$carousel_link_new_window.hasClass('btn-success')){
//         $link.attr('target', '_blank');
//     }else{
//         $link.removeAttr('target');
//     }
// }
//
// var $add = $('<button class="btn btn-default btn" title="Add a new carousel cell"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>');
// $add.on('click', function(event){
//
//     priv.init_window_photograph();
//     var $carousel = get_carousel();
//     var flickity = $carousel.data('flickity');
//     var win = tg_window_manager.get('tg_photograph');
//
//     win.on_select = function(data){
//         var uri = data.photograph_large;
//         if(!uri || uri === "0"){
//             uri = data.photograph_medium;
//         }
//         if(!uri || uri === "0"){
//             editable_toast('editor_photo_not_large_enough');
//             return;
//         }
//
//         var $selected = priv.$selected;
//
//         var id = generate_uuid();
//         var copyright = data.photograph_copyright ? '<p>&copy;'+data.photograph_copyright+'</p>' : '';
//         var text = '<div class="tg_sub_editable carousel_text" data-sub_editable_id="'+id+'"> \
//             <h3>'+data.photograph_title+'</h3>'
//             +copyright+
//         '</div>';
//         var link = '<a class="carousel_link" href="#"></a>';
//         var $cell = $('<div class="carousel-cell"><img src="'+uri+'" alt="'+data.photograph_title+'">'+text+link+'</div>');
//
//         pub.disable_editor($selected);
//         $carousel.flickity( 'insert', $cell,  flickity.selectedIndex+1);
//         $carousel.flickity( 'selectCell', flickity.selectedIndex+1, false, true);
//         pub.enable_editor($selected);
//
//         setTimeout(function(){
//             $carousel.flickity('reloadCells').flickity('resize');
//             setTimeout(function(){
//                 $carousel.flickity('reloadCells').flickity('resize');
//             },500);
//         },500);
//
//     };
//
//     win.open();
// });
//
// var $remove = $('<button class="btn btn-default btn" title="Remove this carousel cell"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button>');
// $remove.on('click', function(event){
//     var $carousel = get_carousel();
//     var flickity = $carousel.data('flickity');
//     if(flickity.cells.length === 1){
//         editable_toast('editor_last_carousel_el');
//         return;
//     }
//     $carousel.flickity( 'remove',  flickity.selectedElement);
//     $carousel.flickity('reloadCells').flickity('resize');
// });
//
// var $move_left = $('<button class="btn btn-default btn" title="Move cell to left"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></button>');
// $move_left.on('click', function(event){
//     var $carousel = get_carousel();
//     var flickity = $carousel.data('flickity');
//     var selected_el = flickity.selectedElement;
//     var selected_index = flickity.selectedIndex;
//
//     if(selected_index > 0){
//         var new_index =  flickity.selectedIndex-1;
//     }else{
//         var new_index = flickity.cells.length-1;
//     }
//
//     $carousel.flickity( 'remove',  flickity.selectedElement);
//     $carousel.flickity( 'insert',  selected_el, new_index);
//     $carousel.flickity( 'selectCell', new_index, false, true);
//
// });
//
// var $move_right = $('<button class="btn btn-default btn" title="Move cell to right"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button>');
// $move_right.on('click', function(event){
//     var $carousel = get_carousel();
//     var flickity = $carousel.data('flickity');
//     var selected_el = flickity.selectedElement;
//     var selected_index = flickity.selectedIndex;
//
//     if(selected_index < flickity.cells.length-1){
//         var new_index =  flickity.selectedIndex+1;
//     }else{
//         var new_index = 0;
//     }
//
//     $carousel.flickity( 'remove',  flickity.selectedElement);
//     $carousel.flickity( 'insert',  selected_el, new_index);
//     $carousel.flickity( 'selectCell', new_index, false, true);
// });
//
// var $options = $('<button class="btn btn-default btn" title="Carousel options"><span class="glyphicon glyphicon-cog" aria-hidden="true"></span></button>');
// $options.on('click', function(event){
//     //tg_window_manager.open('tg_editor_carousel');
//     priv.tooltips.carousel.close();
//     priv.tooltips.caoursel_settings.open();
// });
//
// priv.tooltips.carousel = new tg_tooltip({
//     content: [priv.$carousel_link_input, priv.$carousel_link_new_window, $add,$remove, $move_left, $move_right, $options],
//     classes: 'tg_editor_control',
//     close_on_leave: false,
//     on_open: function(pub, priv){
//         $.when(pub.has_been_attached).then(function(){
//
//         })
//     }
// });
//
// var $o_fullscreen = $('<button class="btn btn-default btn" title="Enable fullscreen" data-key="fullscreen"><i class="fa fa-arrows-alt" aria-hidden="true"></i></button>');
// $o_fullscreen.on('click', function(event){
//     var $carousel = get_carousel();
//     if($(this).hasClass('btn-success')){
//         $carousel.closest('.carousel_wrapper').find('.toggle-fullscreen').hide();
//     }else{
//         $carousel.closest('.carousel_wrapper').find('.toggle-fullscreen').show();
//     }
//     save_options($(this));
// });
//
// var $o_autoplay = $('<button class="btn btn-default btn" title="Autoplay On/Off" data-key="autoPlay"><i class="fa fa-play" aria-hidden="true"></i></button>');
// $o_autoplay.on('click', function(event){
//     save_options($(this));
// });
//
// priv.tooltips.caoursel_settings = new tg_tooltip({
//     content: [$o_fullscreen, $o_autoplay],
//     classes: 'tg_editor_control',
//     close_on_leave: false,
//     on_open: function(pub, priv){
//         var $carousel = get_carousel();
//         var text = $carousel.closest('.carousel_wrapper').find('.flickity_json').text();
//         var json = '';
//         try{
//             json = JSON.parse(text);
//         }catch(err){
//
//         }
//
//         if(!json){
//             editable_toast('editor_carousel_missing_settings');
//             return;
//         }
//
//         pub.$tooltip.find('.btn').each(function (i, el){
//             var key = $(el).data('key');
//             if(json[key]){
//                 $(el).addClass('btn-success').removeClass('btn-default');
//             }else{
//                 $(el).addClass('btn-default').removeClass('btn-success');
//             }
//         });
//
//     }
// });
//
// function save_options($el){
//     var $carousel = get_carousel();
//     var text = $carousel.closest('.carousel_wrapper').find('.flickity_json').text();
//     var json = '';
//     try{
//         json = JSON.parse(text);
//     }catch(err){
//
//     }
//
//     if(!json){
//         new tg_toast('Settings object was missing.', 'd');
//         return;
//     }
//
//     $el.toggleClass('btn-default btn-success');
//
//     priv.tooltips.caoursel_settings.$tooltip.find('.btn').each(function (i, el){
//         var key = $(el).data('key');
//         var val = $(el).hasClass('btn-success') ? true : false;
//         json[key] = val;
//     });
//
//     $carousel.closest('.carousel_wrapper').find('.flickity_json').text(JSON.stringify(json));
// }
//
// function get_carousel(){
//     return priv.tooltips.carousel.$attached_to.find('.flickity-carousel').flickity();
// }
