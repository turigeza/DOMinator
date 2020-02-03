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

    initCarousels();

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
        $('.carousel_wrapper').each(function(){

            var $this = $(this);

            var flickity = $this.find('.flickity-carousel').data('flickity')

            if(flickity){
                flickity.destroy();
            }

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
                    fullscreen: true
                    //lazyLoad: 2,
                }
            }

            settings.draggable = true;
            $this.find('.flickity-carousel').flickity(settings);
        });
    }
});
