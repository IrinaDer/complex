

var callableFunctions = {
    '.flats__content' : function () {
        callback();
    },
    'svg.flat-sector__map-min-svg-img': function () {
        var sections = new Section('.flat-sector__map-min-svg-img');
        addSvgToSlider(sections.createSectionHtml());
    },
    '.flat': function () {
        highlightSelectedFlat();
    },
    '.house-img': function () {
        markFloors();
        addHouseLbl();
    },
    '.plan-block__img': function () {
        createComerceObj();
    }
};


var svg = {

    obj: {
        selector: '._svg'
    },
    run: function(data, successCallback) {
        var selector = data.selector ? data.selector : svg.obj.selector;

        // var hoverOn = typeof(arguments[0].hoverOn)=='boolean' ? arguments[0].hoverOn:this.obj.hoverOn;
        // var hoverColor = arguments[0].hoverColor?arguments[0].hoverColor:this.obj.hoverColor;
        var count = $(document).find(selector).length;
        $(document).find(selector).each(function() {

            var $img = $(this);
            var imgID = $img.attr('id');
            var imgClass = $img.attr('class');
            var imgURL = $img.attr('src');
            var imgTitle = $img.attr('title') ? $img.attr('title') : false;
            var imgStyle = $img.attr('style') ? $img.attr('style') : false;
            var dataWidth = $img.attr('data-width') == 1 ? $img.attr('data-width') : '0';
            var imgWidth = false;
            if (dataWidth == '1') {
                imgWidth = $img.width();
            }
            $.get(imgURL, function(data) {
                // Get the SVG tag, ignore the rest
                var $svg = jQuery(data).find('svg');

                // Add replaced image's ID to the new SVG
                if (typeof imgID !== 'undefined') {
                    $svg = $svg.attr('id', imgID);
                }
                // Add replaced image's classes to the new SVG
                if (typeof imgClass !== 'undefined') {
                    $svg = $svg.attr('class', imgClass + ' replaced-svg');
                }
                if (imgTitle) {
                    $svg.find('title').html(imgTitle)
                }
                if (imgWidth) {
                    imgStyle = imgStyle ? imgStyle : '';
                    imgStyle = imgStyle + '; width:' + imgWidth + 'px';
                }
                if (imgStyle) {
                    $svg.attr('style', imgStyle)
                }

                // Remove any invalid XML tags as per http://validator.w3.org
                $svg = $svg.removeAttr('xmlns:a');

                // Replace image with new SVG
                $img.replaceWith($svg);
                // console.log($svg);
                count = count - 1;
                if (!count) {

                    for (var selector in callableFunctions) {
                        if ($(selector).length)  {
                            callableFunctions[selector]();
                        }
                    }

                    if (successCallback !== undefined) {
                        successCallback();
                    }

                }
            }, 'xml');

        })
    }
};
/**/
svg.run({
    selector: '._svg'
});
$(document).ready(function() {
    $(document).on('click', '._js-menu', function() {
        var sidebar = $(this).closest('._js-sidebar');
        if (sidebar.hasClass('_js-css-sidebar-close')) {
            sidebar.removeClass('_js-css-sidebar-close').addClass('_js-css-sidebar-open')
        } else {
            sidebar.removeClass('_js-css-sidebar-open').addClass('_js-css-sidebar-close')
        }
    });

    $('._js-sidebar').mCustomScrollbar({
        scrollbarPosition: "outside"
    });


    /*
        $("body").on({
            mouseenter: function () {
                var floor = $(this);
                floor.css("opacity","0.5");

                const regex = /fl--str-(\w+)--h-(\d+)--f-(\d+)/g;
                const str = floor.attr('id');
                var m = regex.exec(str);

                $('#info').show().css({
                    top: floor.position().top + "px",
                    left: floor.position().left + "px"
                }).html('Этаж '+ m[3]);

            },
            mouseleave: function () {
                $(this).css("opacity","0");
                $('#info').hide()
            }
        }, "polygon");*/
});
(function() {
    function stopVideo() {
        var mainVideo = document.getElementById('mainVideo');
        if (mainVideo) {
            if ($(window).innerWidth() < 768) {
                if (mainVideo.autoplay) {
                    mainVideo.load();
                    mainVideo.autoplay = false;
                }
            } else {
                if (mainVideo.autoplay == false) {
                    mainVideo.load();
                    mainVideo.autoplay = true;
                }
            }
        }
    }
    $(window).on('resize', function() {
        stopVideo();
    })
    $(document).ready(function() {
        stopVideo();
    })

})();
(function() {
    $('.document__tab').click(function() {
        $('.document__tab').removeClass('document__tab-active');
        $(this).addClass('document__tab-active');
        var tab = $(this).data('href');
        $('.document__tab-container').removeClass('active-tab-container');
        $(tab).addClass('active-tab-container');
    })
})();
(function() {
    $('.logging-pagination__item').click(function() {
        $('.logging-pagination__item').removeClass('logging-pagination__item-active');
        $(this).addClass('logging-pagination__item-active');
    })
})();




if ($('#map').length) {
    ymaps.ready(initMap);
    var myMap,
        myPlacemark;

    function initMap() {

        var map = $('#map'),
            lbl = document.querySelector('#map + .map__lbl').outerHTML;
        myMap = new ymaps.Map(map.attr('id'), {
            center: [map.attr('data-coordX'), map.attr('data-coordY')],
            zoom: 15
        });

        myPlacemark = new ymaps.Placemark([55.76, 37.64], {
            balloonContent: lbl
        });
        myMap.geoObjects.add(myPlacemark);


        myMap.controls.add(
            new ymaps.control.ZoomControl()
        );
        myMap.controls.add('mapTools');




    }
}


function getFlatSvg() {
    var floorId = $('.flatData').data('section');
    var floorSvg = '<img src="./assets/img/floor/' + floorId + '.svg" class="flat__floor-img ._svg"/>';
    $('.flat__floor-img-box').html(floorSvg);
    svg.run({
        selector: '.flat__floor-img'
    })
}
$(document).ready(function() {
    if ($('.flat').length) {
        getFlatSvg()
    }
});



function highlightSelectedFlat() {
    var flatId = $('.flatData').data('flat');
    $('#' + flatId).attr('class', 'st2 selectedFlat');
    console.log(flatId);
}

function goToFlat() {
    location.href = "flat.html"
}



function callback() {

    var complex = [];
    var houses = $(document).find('#houses--rc-yaroslavsky > *');
    var houseInfo = $(document).find('.house')
    houses.each(function(index, el) {
        houseId = $(el).attr('id');
    })
    houses.click(function() {
        var selectedHouse = $(this).attr('id')
        window.location.href = "flatHouse.html?" + "houseId=" + selectedHouse;
    });

    var flatsBodyTop = $('.flats__body').offset().top;
    var flatsBodyLeft = $('.flats__body').offset().left;

    houseInfo.each(function(index, el) {
        var houseDivStreet = $(el).attr('data-street');
        var houseDivCorps = $(el).attr('data-corps');
        var houseDivNumber = $(el).attr('data-number');
        var houseDivId = $(el).attr('data-id');
        var selectHouse = $(document).find('#' + houseDivId);
        var houseStatus = $(el).attr('data-status');
        selectHouse.attr('class', 'cls-1 ' + houseStatus);
        $(el).find('.house_text').html('Ул. ' + houseDivStreet + ' ' + houseDivCorps + ', дом ' + houseDivNumber);
        $(el).css({ 'top': selectHouse.position().top - flatsBodyTop - 30, 'left': selectHouse.position().left - flatsBodyLeft });

    });

    houses.hover(function() {
            var id = $(this).attr('id');
            $(".house[data-id='" + id + "']").css('opacity', '1');
        },
        function() {
            var id = $(this).attr('id');
            $(".house[data-id='" + id + "']").css('opacity', '0');
        });

}

$('.flats__title-item').click(function() {

    //reset
    var houses = $('.houses-img g *');

    houses.each(function() {
        var houseClass = $(this).attr('class');
        var activeClassPos = houseClass.indexOf("active");

       if(activeClassPos != -1) {
           $(this).attr('class', houseClass.substring(0, activeClassPos));
       }

    });

    $('.house').css('opacity', '0');


    //mark
    var status = $(this).data('type');
    var house = $(document).find('.' + status);

    $('.house[data-status='+ status +']').css('opacity', '1');
    house.attr('class', house.attr('class') + ' active');


});


$(document).ready(function() {


    $(".gallery__carousel").slick({
        lazyLoad: 'ondemand',
        slidesToShow: 5,
        slidesToScroll: 1,

        prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-left fa-4x" aria-hidden="true"></i></button>',
        nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right fa-4x" aria-hidden="true"></i></button>',
        responsive: [{
                breakpoint: 1700,
                settings: {
                    slidesToShow: 4
                }
            },
            {
                breakpoint: 1700,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 1150,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 768,
                arrows: false,
                settings: {
                    slidesToShow: 1
                }
            },

        ]
    });


    $(".flat__carousel").slick({
        prevArrow: '<button type="button" class="slick-prev">' +
            '<img class="slick-prev__ico" src="assets/img/arrow-left-ligth-box.svg"/>' +
            '</button>',
        nextArrow: '<button type="button" class="slick-next">' +
            '<img class="slick-next__ico" src="assets/img/arrow-right-ligth-box.svg"/>' +
            '</button>',

    });
    $('.pulse').click(function() {
        $(this).hide();
        $(this).next('.pulse__form').fadeIn();
    })
    $('.pulse__close,.pulse__submit').click(function() {
        $(this).parents('.pulse__form').hide();
        $(this).parents('.pulse__form').prev('.pulse').fadeIn();
    })


});




$('#message-form').submit(function(e) {
    e.preventDefault();
    var response = '<p class="message__response-title">Спасибо!</p>' +
        '<p class="message__response-text">Ваша заявка принята.</p>';
    $(this).find('.message__cnt').addClass('message__response');
    $(this).find('.message__cnt').html(response);
});


if ($('#about-map').length) {

    var myMap
    var myPlacemark;
    var route;
    var routesCollection;

    ymaps.ready(initAboutMap);

    function addRoute() {
        var start = $(".active-route").data('start');
        var end = $(".active-route").data('end');
        var routes = ymaps.route([start, end]).then(function(router) {
                route && myMap.geoObjects.remove(route);
                route = router;
                var points = route.getWayPoints();
                points.get(0).options.set('preset', 'twirl#redStretchyIcon');
                points.get(1).options.set('preset', 'twirl#0091EAStretchyIcon');
                points.get(0).properties.set('iconContent', 'А');
                points.get(1).properties.set('iconContent', 'Б');
                route.getPaths().options.set({
                    strokeColor: '#BA68C8',
                    opacity: 0.9,
                    preset: 'twirl#nightStretchyIcon'

                });

                myMap.geoObjects.add(route);

                route.events.add('click', function (e) {
                    var way = route.getPaths().get(0);
                    var segments = way.getSegments();

                    var center = segments[Math.round(way.getSegments().length/2)];
                    var center1 = Math.floor(center.getCoordinates().length/2);

                    myMap.setCenter(center.getCoordinates()[center1]);
                    myMap.setZoom(9);
                })
            },
            function(error) {
                alert("Возникла ошибка: " + error.message);
            });
        myMap.geoObjects.add(route);


    }

    function initAboutMap() {
        myMap = new ymaps.Map("about-map", {
            center: [55.76, 37.64],
            zoom: 15
        });
        myMap.controls.add(
            new ymaps.control.ZoomControl()
        );
        myMap.controls.add('mapTools');
        addRoute();
    }
    $('.location-block__route').click(function() {
        $('.location-block__route').removeClass('active-route');
        $(this).addClass('active-route');
        addRoute();
    })


}

