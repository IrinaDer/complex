/* ------------------------------- */
//create section svg
/* ------------------------------- */

function addSvgToSlider(sectionsSVG) {

    var self = this;
    self.sectionCarousel = $('.flat-sector__slider');

    if ($(document).find('.flat-sector__map-big ').length) {
        self.sectionCarousel.slick('unslick');
        self.sectionCarousel.html('');
    }

    $.each(sectionsSVG, function(i, el) {
        self.sectionCarousel.prepend('<div class="flat-sector__map-big">' + el + '</div>');
        //з першої секції
        //self.sectionCarousel.append('<div class="flat-sector__map-big">' + el + '</div>');

        if (i == sectionsSVG.length - 1) {
            self.createSectionSlider()
        }
    });
}

function createSectionSlider() {
    this.sectionCarousel.slick({
        infinite: false,
        prevArrow: '<button type="button" class="flat-sector__nav flat-sector__nav_type_left button-reset">' +
        '<i class="fa fa-angle-left fa-4x" aria-hidden="true"></i>' +
        '</button>',
        nextArrow: '<button type="button" class="flat-sector__nav flat-sector__nav_type_right button-reset">' +
        '<i class="fa fa-angle-right fa-4x" aria-hidden="true"></i>' +
        '</button>'
    });

    setTimeout(function() {
        $(".flat-sector__preloader").css('display', 'none');
    }, 400);
    flatSlider.goBackActiveFlat();

}

/* ------------------------------- */
//flat slider
/* ------------------------------- */
$('.flat-sector__slider').on('init afterChange', function (event, slick) {
    flatSlider.markActiveSection();
    flatSlider.flatsFloor();
    if (!$('#control').attr('data-flat')) {
        $($('.flat-sector__number')[0]).addClass('active-flat__item');
    }
});

$('.flat-sector__slider').on('beforeChange', function (event, slick) {
    $('.flat-sector__number').remove();
});


var flatSlider = {
    markActiveSection: function () {
        var allFlats = document.querySelectorAll('[id *= rooms] *');


        for (var j = 0; j < allFlats.length; j++) {
            var flatC = allFlats[j].classList[0];
            allFlats[j].setAttribute('class', flatC);
        }

        var section = document.querySelector('.flat-sector__slider .slick-active');
        var flats = section.querySelectorAll('[id *= rooms] *');

        var flatsId = [];
        for (var i = 0; i < flats.length; i++) {
            var flatId = flats[i].getAttribute('id').substr(5);
            var flat = document.getElementById(flatId);

            var flatClass = flat.getAttribute('class');

            flat.setAttribute('class', flatClass + ' active-flat');
        }

        var sectionNumber = section.querySelector('[id *= sections--] > * ').getAttribute('id');
        sectionNumber = sectionNumber.split('sect-')[1];
        $('.flat-sector__map-section-number').text(sectionNumber);
    },
    flatsFloor: function () {
        var flats = $('.flat-sector__map-big.slick-current').find('.st2');
        var sectionCoord = $('.flat-sector__map-big.slick-current svg')[0].getBBox();
        var sectionWidth = sectionCoord.width;
        var sectionHeight = sectionCoord.height;

        var minSvg = $('.flat-sector__map-min-svg-img').attr('id');

        houseNumber = minSvg.substring(minSvg.indexOf('--h-') + 4, minSvg.indexOf('--f-'));

        $('.flat-sector__house-number').html('Дом ' + houseNumber);

        $.each(flats, function (index, el) {
            flatId = $(el).attr('id');
            flatNumber = flatId.substring(flatId.indexOf('--r-') + 4);
            flatSquare = flatId.substring(flatId.indexOf('--h-') + 4, flatId.indexOf('--f-')) + index;
            flatRooms = flatId.substring(flatId.indexOf('--f-') + 4, flatId.indexOf('--r-')) + index;

            topNumber = $('.flat-sector__map-big.slick-current').find('#' + flatId).offset().top;
            leftNumber = $('.flat-sector__map-big.slick-current').find('#' + flatId).offset().left;

            // flatWidth = $('.flat-sector__map-big.slick-current').find('#' + flatId)[0].getBBox().width - 22;
            // flatHeight = $('.flat-sector__map-big.slick-current').find('#' + flatId)[0].getBBox().height / 2;
            //
            // leftMap = $('.flat-sector__body').offset().left;
            //
            // topMap = $('.flat-sector__body').offset().top;


            var flatCoord = el.getBBox(),
                flatX = (flatCoord.x + ( flatCoord.width / 2)) * 100 / sectionWidth,
                flatY = (flatCoord.y + ( flatCoord.height / 2)) * 100 / sectionHeight;


            // if (index == 0) {
            //     $('.flat-sector__body').append('<div class="flat-sector__number" data-id=' + flatId + ' data-number=' + flatNumber + ' data-rooms=' + flatRooms + ' data-square=' + flatSquare + '>' + flatNumber + '</div>');
            // } else {
            //     $('.flat-sector__body').append('<div class="flat-sector__number" data-id=' + flatId + ' data-number=' + flatNumber + ' data-rooms=' + flatRooms + ' data-square=' + flatSquare + '>' + flatNumber + '</div>');
            // }
            // $('.flat-sector__body').append('<div class="flat-sector__number" data-id=' + flatId + ' data-number=' + flatNumber + ' data-rooms=' + flatRooms + ' data-square=' + flatSquare + '>' + flatNumber + '</div>');
            // $('.flat-sector__number[data-id=' + flatId + ']').css({ 'top': topNumber - topMap + flatHeight, 'left': leftNumber - leftMap + flatWidth });

            if (index == 0) {

                $('.flat-sector__body').append('<div class="flat-sector__number active-flatItem" data-id=' + flatId + ' data-number=' + flatNumber + ' data-rooms=' + flatRooms + ' data-square=' + flatSquare + '>' + flatNumber + '</div>');
                $(el).attr('class', 'st2 active-flat');

            } else {
                $('.flat-sector__body').append('<div class="flat-sector__number" data-id=' + flatId + ' data-number=' + flatNumber + ' data-rooms=' + flatRooms + ' data-square=' + flatSquare + '>' + flatNumber + '</div>');
            }

            $('.flat-sector__number[data-id=' + flatId + ']').css({
                'top': flatY + '%',
                'left': flatX + '%'
            });

        });

        //позначення активної квартири при поверненні з її сторінки

        var div = $(document).find('#selected-flat');

        var flatNumber = div.data('flat');
        var selectedFlat = $(document).find('.flat-sector__map-big.slick-current *[id *= --r-' + flatNumber + ']');
        if (flatNumber && selectedFlat.length) {

            $(document).find('.flat-sector__number').removeClass('active-flatItem');
            var firstFlat = $(document).find(".flat-sector__slider .active-flat");
            var firstFlatClass = (firstFlat.attr('class') + '').split(' ')[0];
            $(document).find(".flat-sector__slider .active-flat").attr('class', firstFlatClass);


            var selectedFlatClass = (selectedFlat.attr('class') + '').split(" ");
            selectedFlat.attr('class', selectedFlatClass + ' active-flat');
            $(document).find('.flat-sector__number[data-number *= ' + flatNumber + ']')
                .addClass('active-flatItem');

        }
        //goBackActiveFlat()
        flatSlider.getFlatData();


        flats.hover(function () {
            var id = $(this).attr('id');
            flats.attr('class', 'st2');
            $(this).attr('class', 'st2 active-flat');
            $('.flat-sector__number').removeClass('active-flatItem');
            $('.flat-sector__number[data-id=' + id + ']').addClass('active-flatItem');
            flatSlider.getFlatData()
        });
        flats.click(function () {
            goToFlat();
        });
        $('.flat-sector__number').click(function () {
            goToFlat();
        });

    },
    getFlatData: function () {

        var activeId = $('.flat-sector__number.active-flatItem').data('id');
        var countRooms = $('.flat-info[data-flatId=' + activeId + ']').data('room');
        var squareRoom = $('.flat-info[data-flatId=' + activeId + ']').data('square');
        var roomNumber = $('.flat-info[data-flatId=' + activeId + ']').data('number')

        $('.flat-info__rooms').html(countRooms + '-x комнатная');
        $('.flat-info__square').html(squareRoom + ' м <sup>2</sup>');
        $('.flat-sector__flat-number-text').html('№' + roomNumber);
    },


    goBackActiveFlat: function () {
        var div = $(document).find('#selected-flat');
        var floor = div.data('floor');
        var flat = div.data('flat');

        if (floor && flat) {

            var slider = $('.flat-sector__slider');
            var activeFlat = flat;

            slider.find('.st2').attr('class', 'st2');

            $.each(slider[0].slick.$slides, function (i, slide) {

                if ($(slide).find('[id *= --r-'+ activeFlat +']').length) {
                    slider.slick('slickGoTo', i);
                }
            });

        }
    }
};



/* ------------------------------- */
//main svg
/* ------------------------------- */

$(document).on('click', '.flat-sector__map-min-svg-img g *', function () {
    var id = $(this).attr('id');
    var slider = $('.flat-sector__slider');

    var slideIndex = '';

    $.each(slider[0].slick.$slides, function (i, slide) {
        if ($(slide).find('#big--' + id).length)
            slideIndex = i
    });

    slider.slick('slickGoTo', slideIndex);
});