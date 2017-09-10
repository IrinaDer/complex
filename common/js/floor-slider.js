/* ------------------------------- */
//floor slider
/* ------------------------------- */
$(document).ready(function() {
    $(".floor-slider").slick({
        centerMode: true,
        slidesToShow: 3,
        vertical: true,
        prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-up fa-4x" aria-hidden="true"></i></button>',
        nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-down fa-4x" aria-hidden="true"></i></button>',
        infinite: true
    });
});


$('.floor-slider').on('init afterChange', function(event, slick) {
    $(".flat-sector__preloader").css('display', 'flex');

    createFloor();

});


function createFloor() {
    var svgCommon = $('.floor-slider  .slick-active.slick-center').attr('data-floorSVG');
    var svgImg = '<img src="' + svgCommon + '" class="_svg flat-sector__map-min-svg-img"/>';

    $('.flat-sector__map-min-svg').html(svgImg);

    svg.run({
        selector: '.flat-sector__map-min-svg-img'
    });

}


$('.floor-slider').on('beforeChange', function(event, slick) {
    $('.flat-sector__number').remove();
});




function goToSelectedFloor() {

    if(getURLVar('flat') && getURLVar('floor')) {
        $('body').append('<div id="selected-flat" data-flat="'+getURLVar('flat')+'" data-floor="'+ getURLVar('floor') +'"></div>');
        window.history.pushState(null, null, "?");
    }

    try {
        var div = $(document).find('#selected-flat');
        var floor = div.data('floor');
        var flat = div.data('flat');

        if(floor && flat) {
            var sliderFloor = $('.floor-slider');

            $.each(sliderFloor[0].slick.$slides, function(i, slide) {
                if ($(slide).find('.floor-number').text() == floor && !$(slide).hasClass('slick-cloned')) {
                    sliderFloor.slick('slickGoTo', i);
                }
            });
        }
    } catch (error) {
        setTimeout(goToSelectedFloor, 100);
        return;
    }
}






goToSelectedFloor();

