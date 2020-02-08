$( document ).ready(function(){

    function cleanUpHtml(){
        // if the photo caption text marked as not to display you should empty it
        $('.tg_subwidget_photograph_text[style="display: none;"]').empty();

        // remove spans which are hidden in photo text
        $('.tg_subwidget_photograph_text span[style="display: none;"]').remove();

        // remove spansformating on the photograph captions
        $('.tg_subwidget_photograph_text span').each(function() {
            $(this).replaceWith(this.childNodes);
        });

        $('.tg_subwidget_photograph').addClass('d-photograph').removeClass('tg_subwidget_photograph');
        $('.tg_subwidget_photograph_text').addClass('d-photograph-text').removeClass('tg_subwidget_photograph_text');

        // remove toggle fullscreen buttons we don't need them anymore
        $('.toggle-fullscreen').remove();

        // mark blocklink links with class d-block-link
        $('.tg_subwidget_blocklink a .tg_sub_editable>*').unwrap();
        $('.tg_subwidget_blocklink a').addClass('d-block-link').unwrap();

        // change tg_subwidget_carousel to d-carousel
        $('.tg_subwidget_carousel').addClass('d-carousel').removeClass('tg_subwidget_carousel');

        $('.tg_widget').removeClass('tg_widget');
        $('.tg_editable').removeClass('tg_editable');

        $('.tg_subwidget_download').addClass('d-download').removeClass('tg_subwidget_download');
        $('.tg_subwidget_download_title').addClass('d-download-title').removeClass('tg_subwidget_download_title');


        $('.ce-element').removeClass('ce-element');
        $('.ce-element--type-download').removeClass('ce-element--type-download');

        $('.tg_sub_editable').removeClass('tg_sub_editable');
        $('.tg_subwidget').removeClass('tg_subwidget');
    }

    cleanUpHtml();

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
        carousel: (DOMinator) => {
            const html = `<div class="carousel_wrapper">
                <div class="flickity-carousel">
                    <div class="carousel-cell" style="" aria-hidden="true">
                        <img src="https://i.picsum.photos/id/955/900/600.jpg?grayscale" alt="Branklyn">
                        <div class="tg_sub_editable carousel_text" data-sub_editable_id="first_content">
                            <h3>Title of image</h3>
                            <p>Description on the image</p>
                        </div>
                        <a class="carousel_link" href=""></a>
                    </div>
                </div>
                <div class="flickity_json">{"wrapAround":true,"fullscreen":true,"parallax":true,"adaptiveHeight":true,"imagesLoaded":true,"draggable":false}</div>
                <a class="flickity_link" href="#"></a>
            </div>`;
            DOMinator.insertCarousel(html);
        },
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

            DOMinator.updateCarousel(getHtmlFromCarousel($widget));

            $slide.find('img').one("load", () => {
                flickity.reloadCells();
                flickity.resize();
            });
        },
        carouselRemoveSlide: (DOMinator) => {
            const { flickity, $flickity, $widget } = getCarousel();

            if(flickity.cells.length === 1){
                alert('You can not remove the last element.');
               // editable_toast('editor_last_carousel_el');
               return;
           }

           flickity.remove(flickity.selectedElement);
           flickity.reloadCells();
           flickity.resize();
           DOMinator.updateCarousel(getHtmlFromCarousel($widget));
        },
        carouselMoveSlideLeft: (DOMinator) => {
            const { flickity, $flickity, $widget } = getCarousel();
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
            DOMinator.updateCarousel(getHtmlFromCarousel($widget));
        },
        carouselMoveSlideRight: (DOMinator) => {
            const { flickity, $flickity, $widget } = getCarousel();
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
            DOMinator.updateCarousel(getHtmlFromCarousel($widget));
        },
        carouselToggleSetting: (DOMinator, key) => {
            const { flickity, $flickity, $widget } = getCarousel();
            const jsonString = $('.d-carousel.ProseMirror-selectednode .flickity_json').text() || '{}';
            let settings = JSON.parse(jsonString);
            if(settings[key]){
                settings[key] = false;
            }else{
                settings[key] = true;
            }

            $('.d-carousel.ProseMirror-selectednode .flickity_json').text(JSON.stringify(settings));
            DOMinator.updateCarousel(getHtmlFromCarousel($widget));
            destroyCarousels();
            initCarousels();
        },
        carouselUpdateButton: (DOMinator, button) => {
            const { flickity, $flickity, $widget } = getCarousel();
            const jsonString = $('.d-carousel.ProseMirror-selectednode .flickity_json').text() || '{}';
            let settings = JSON.parse(jsonString);
            const key = button.options.key;
            const $link = $flickity.find('.is-selected .carousel_link');

            if(key === 'add_a_slide'){
                button.enable();
            }else if(key === 'remove_current_slide'){
                if($flickity.find('.carousel-cell').length > 1){
                    button.enable();
                }else{
                    button.disable();
                }
            }else if(key === 'move_slide_left'){
                if($flickity.find('.carousel-cell').length > 1){
                    button.enable();
                }else{
                    button.disable();
                }
            }else if(key === 'move_slide_right'){
                if($flickity.find('.carousel-cell').length > 1){
                    button.enable();
                }else{
                    button.disable();
                }
            }else if(key === 'auto_play'){
                if(settings.autoPlay){
                    button.activate();
                }else{
                    button.deactivate();
                }
            }else if(key === 'toggle_full_screen_button'){
                if(settings.fullscreen){
                    button.activate();
                }else{
                    button.deactivate();
                }
            }else if(key === 'link_slide'){
                if($link.length > 0 && $link.attr('href') !== ''){
                    button.activate();
                }else{
                    button.deactivate();
                }
            }else if(key === 'link_external'){
                if($link.length > 0 && $link.attr('target') === '_blank'){
                    button.activate();
                }else{
                    button.deactivate();
                }
            }
        },
        carouselGet: (DOMinator, key) => {
            const $selected = $('.d-carousel.ProseMirror-selectednode .is-selected');
            if(key === 'title'){
                return $selected.find('.carousel_text h3').text();
            }else if(key === 'description'){
                return $selected.find('.carousel_text p').text();
            }else if(key === 'href'){
                return $selected.find('.carousel_link').attr('href') || '';
            }else if(key === 'link_title'){
                return $selected.find('.carousel_link').attr('title') || '';
            }
        },
        carouselSet: (DOMinator, key, value) => {
            const { flickity, $flickity, $widget } = getCarousel();
            var $selected = $flickity.find('.is-selected');

            function getLink(){
                let $link = $selected.find('.carousel_link')
                if($link.length === 0){
                    const title = $selected.find('.carousel_text h3').text() || '';
                    $link = $(`<a class="carousel_link" href="" title="${title}"></a>`);
                    $selected.find('.carousel_text').after($link)
                }
                return $link;
            }

            if(key === 'title'){
                $selected.find('.carousel_text h3').text(value);
                $selected.find('.carousel_link').attr('title', value);
            }else if(key === 'description'){
                $selected.find('.carousel_text p').text(value);
            }else if(key === 'href'){
                if(value){
                    DOMinator.menu.stayOnMenu = true;
                    const $link = getLink();
                    $selected.find('.carousel_link').attr('href', value);
                }else{
                    $selected.find('.carousel_link').remove();
                }
            }else if(key === 'link_title'){
                DOMinator.menu.stayOnMenu = true;
                const $link = getLink();
                $selected.find('.carousel_link').attr('title', value);
            }else if(key === 'target'){
                DOMinator.menu.stayOnMenu = true;
                const $link = getLink();
                if($link.attr('target') === '_blank'){
                    $link.removeAttr('target')
                }else{
                    $link.attr('target', '_blank');
                }
            }
            DOMinator.updateCarousel(getHtmlFromCarousel($widget));
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
            },
            beforeCarouselUpdate: (dom, node) => {
                const htmlInDom = getHtmlFromCarousel($(dom));
                const htmlOnNode = node.attrs.html;

                if(htmlInDom !== htmlOnNode){
                    setTimeout(()=>{
                        initCarousels();
                    }, 10);
                    return false;
                }
                return true;
            },
        }
    });

    setTimeout(()=>{
        editor.selectNode(10);
    }, 500);

    initCarousels();

    function getHtmlFromCarousel($widget){
        const $clone = $widget.clone(false);
        const $carousel = $clone.find('.flickity-carousel');
        $carousel.removeClass('flickity-enabled').removeClass('is-draggable').removeAttr('tabindex'); ///.removeAttr('index');
        $carousel.find('.carousel-cell').unwrap().unwrap().removeAttr('style').removeAttr('aria-hidden').removeClass('is-selected');
        $carousel.find('.tg_sub_editable').removeClass('tg_sub_editable');
        $carousel.find('.flickity-button').remove();
        $carousel.find('.flickity-page-dots').remove();
        return $clone.html();
    }

    function getCarousel(){
        const $flickity = $('.d-carousel.ProseMirror-selectednode .flickity-carousel');
        const flickity = $flickity.data('flickity');
        const $widget = $('.d-carousel.ProseMirror-selectednode');

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
        $('.d-carousel').each(function(){
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
