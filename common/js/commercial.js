var comerceObj = {};

function createComerceObj() {
    if ($.isEmptyObject(comerceObj)) {

        var svg = $('.plan-block__img');

        svg.each(function() {
            var sections = $(this).find('g[id *= sections] *'),
                sectionsFlats = $(this).find('g[id *= rooms] *'),
                sectionsPorch = $(this).find('g[id *= porch] *');

            var flats = [];
            sectionsFlats.each(function () {
                flats.push($(this));
            });

            var sectionFlatNumber = flats.length / sections.length;

            //формування масиву секцій поверху
            var section = [];
            for (var i = 0; i < sections.length; i++) {
                //масив елементів секції
                sectionData = [
                    sections.eq(i),
                    sectionsPorch.eq(i)
                ];
                for (var j = 0; j < sectionFlatNumber; j++) {
                    sectionData.push(flats.shift());
                }
                section.push(sectionData);
            }

            comerceObj[$(this).attr('id')] = section;

        });
    }

    //console.log(comerceObj);

}

function findActiveIndex(id, parentId) {

    var activeIndex = '';

    $.each(comerceObj[parentId], function (i, section) {
        $.each(section, function (index, el) {
            if (el.attr('id') == id) {
                activeIndex = i;
            }
        });
    });

    return activeIndex;
}



function markActiveEl(activeIndex, parentId) {

    var sectionNumber = '';

    $.each(comerceObj[parentId][activeIndex], function (i, el) {
        if (el.attr('id').indexOf('--sect-') != -1) {
            sectionNumber = el.attr('id').split('--sect-')[1];
        }
        el.attr('data-active', 'active');
    });

    return sectionNumber;

}


//hover
$(document).on('mouseover', '.plan-block__img g *', function () {

    var id = $(this).attr('id');
    var parent = $(this).closest('.plan-block__img');
    var activeIndex = findActiveIndex(id, parent.attr('id'));
    var sectionNumber = markActiveEl(activeIndex, parent.attr('id'));

    if(comerceObj[parent.attr('id')].length > 1) {
        var svgCoord = parent[0].getBBox(),
            coord = new CalcChords(parent.find('[id *= --sect-' + sectionNumber + ']')[0].getBBox());


        var box = '<div class="section-box"' +
            'style="top: ' + coord.calculate('y', svgCoord.height) + '%;' +
            'left: ' + coord.calculate('x',svgCoord.width) + '%;' +
            'width: ' + coord.calculate('width',svgCoord.width) + '%;' +
            'height: ' + coord.calculate('height', svgCoord.height) + '%;">' +
            '<div class="section-box__lbl">' +
            '<span>Секция</span> ' + sectionNumber + '</div>' +
            '</div>';

        $(this).closest('.plan-block__img-box').append(box);

    }

});


$(document).on('mouseout', '.plan-block__img g *', function () {
    $('.plan-block__img [data-active = active]').attr('data-active', '');
    $(document).find('.section-box').animate({'opacity': '0'}, 300, function () {
        $(this).remove();
    });
});


$(document).on('click', '.plan-block__img g *', function () {
    var parentId = $(this).closest('.plan-block__img').attr('id');
    var sections  =  new Section('#' + parentId);
    console.log('sections', sections.createSectionHtml());
    sections = sections.createSectionHtml();


    var activeIndex = findActiveIndex($(this).attr('id'), parentId);
    //console.log('activeIndex', activeIndex);
    console.log("$(this).attr('id')", $(this).attr('id'));
    var sectionId = '';
    $.each(comerceObj[parentId][activeIndex], function(i, el) {
        if(el.attr('id').indexOf('--sect-') != -1 ) {
            sectionId = el.attr('id');
        }

    });

    $.each(sections, function(i, section ) {
       // console.log();
        console.log('section.indexOf(sectionId)', section.indexOf(sectionId));
       if(section.indexOf(sectionId) != -1) {
           //console.log('i', i);
           $('.comerce-modal__img-box').html(sections[i]);
       }
    });





    markRooms(parentId);

    $.fancybox.open({src: '#comerce-modal', type: 'inline'});
});

function markRooms(sectionSvgId) {

    var sectionSvg = $(document).find('.comerce-modal__img-box svg[id *= '+ sectionSvgId +']');
    var rooms = sectionSvg.find(' g[id *= rooms] *');



    rooms.each(function (i, el) {

        var id = $(this).attr('id');
        var paramDiv = $('.comerce-room-data[data-svg-room-id=' + id.substr(5) + ']');

        var status = paramDiv.attr('data-comerce-room-status');
        var statusTxt = paramDiv.attr('data-comerce-room-status-text');
        var square = paramDiv.attr('data-comerce-room-square');
        var enterprise = paramDiv.attr('data-comerce-room-enterprise');
        enterprise = enterprise ? enterprise : '';

        $(this).attr('class', status);

        var svgCoord = sectionSvg[0].getAttribute('viewBox').split(' '),
            cloneInCommonSvg = $('.plan-block__img-box #' + $(this).attr('id').substr(5)),
            coord = new CalcChords(cloneInCommonSvg[0].getBBox());

            console.log('room', $(this));
            console.log('cloneInCommonSvg', cloneInCommonSvg[0].getBBox());


        var ico = '';
        if (status == 'free')
            ico = 'free-status.svg';
        else if (status == 'sold')
            ico = 'sold-status.svg';
        else if (status == 'for-rent')
            ico = 'for-rent-status.svg';


        var sectionQty = $('#' + sectionSvgId + ' g[id *= sections] *').length;
        var commonSvgWidth = $('#' + sectionSvgId)[0].getAttribute('viewBox').split(' ')[2];
        var sectionPos = sectionSvg.find('[id *= sections] *')[0].getAttribute('id').split('--sect-').pop();

        var x = '';
        if(sectionQty > 1) {
            x = coord.calculate('x',svgCoord[2], sectionQty, sectionPos, commonSvgWidth);
        } else {
            x = coord.calculate('x',svgCoord[2]);
        }


        var box = '<div class="room-box ' + status + '-status"' +
            'style="top: ' + coord.calculate('y',svgCoord[3]) + '%;' +
            'left: ' + x + '%;">' +
            '<div class="room-box__square">' + square + '</div>' +
            '<div class="room-box__lbl">' +
            '<p class="room-box__enterprise">' + enterprise + '</p>' +
            '<div class="room-box__ico-circle">' +
            '<img class="room-box__ico" src="assets/img/' + ico + '" />' +
            '</div>' +
            '<p class="room-box__status">' + statusTxt + '</p>' +
            '</div>' +
            '</div>';
        $('.comerce-modal__img-box').append(box);

        var sectionNumber = sectionSvg.find('[id *= --sect-]').attr('id').split('--sect-').pop();
        $('.comerce-modal__sector-name span').text(' ' + sectionNumber);


    });
}





