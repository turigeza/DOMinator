$( document ).ready(function(){
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
        menu: {
            paragraph: (items) => {
                items.splice(14,1);
                items.splice(11,1);
                items.splice(9,1);
            }
        }
    });

    if( $('.carousel-cell').length !== 0){

        $('.carousel_wrapper').each(function(){

            var $this = $(this);
            var text = $this.find('.flickity_json').text();
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
                    //lazyLoad: 2,
                }
            }

            settings.draggable = true;
            $this.find('.flickity-carousel').flickity(settings);
        });

        $('.flickity-carousel').on( 'staticClick.flickity', function() {
            var $this = $(this);
            var $dead_link = $this.find('.carousel-cell.is-selected .carousel_link');
            var $fullscreen = $this.closest('.carousel_wrapper').find('.toggle-fullscreen:visible');
            if($dead_link[0]){
                $dead_link[0].click();
            }else if($fullscreen.length === 1){
                $fullscreen.trigger('click');
            }
        });

        function exit_fullscreen(){
            //$(document).fullScreen(false);
            $('#background_fade').fadeOut();
            $('.flickity-fullscreen').removeClass('flickity-fullscreen');
            $('.flickity-carousel').flickity('reloadCells').flickity('resize');
        }

        function enter_fullscreen($carousel){
            var $wrapper = $carousel.closest('.carousel_wrapper');
            $wrapper.toggleClass('flickity-fullscreen');

            $carousel.flickity('reloadCells');
            $carousel.flickity('resize');

            if($wrapper.hasClass('flickity-fullscreen')){
                //$(document).fullScreen(true);
                $('#background_fade').fadeIn();
            }
        }

        $(document).on('click', '.toggle-fullscreen', function(){
            var $carousel = $(this).prev('.flickity-carousel');
            if($carousel.closest('.carousel_wrapper').hasClass('flickity-fullscreen')){
                exit_fullscreen();
            }else{
                enter_fullscreen($carousel);
            }

        });

        // escape key
        $(document).on('keyup', function(e){
            if (e.keyCode == 27) { // escape key maps to keycode `27`
                if($('.carousel_wrapper.flickity-fullscreen').length > 0){
                    exit_fullscreen();
                    setTimeout(function(){

                    }, 300);
                }
            }
        });

        $('body').append('<div id="background_fade" style="display: none;"></div>');

    }
});
