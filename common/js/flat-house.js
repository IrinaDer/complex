var houseFloors = '';
//приховує всі виділення поверхів
function markFloors() {
    houseFloors = $(document).find('.house-img g[id *= floors] *');
    houseFloors.each(function(el, i) {
        var floorClass = $(this).attr('class');
        $(this).attr('class', floorClass + ' floor-hide');
    });
}


//лейбл з адресою будинку
function addHouseLbl () {
    var houseChords = $('.house-img')[0].getBBox();
    var address = $('#data-house').data('house');

    var houseGroups = $('.house-img g[id *= floors]'),
        top = houseGroups[0].getBBox().y,
        right = houseGroups[0].getBBox().x + houseGroups[0].getBBox().width;

    houseGroups.each(function() {

        var item = $(this)[0];
       // console.log($(this)[0].getBBox());
        if(item.getBBox().y < top)
            top = item.getBBox().y;

        var thatRight = item.getBBox().x + item.getBBox().width;
        if(thatRight > right)
            right = thatRight;

    });


    top = top * 100 / houseChords.height;
    top = top < 10 ? 2 : top;

    right = 100 - (right * 100 / houseChords.width);

    var houseLbl = '<div class="house-label"' +
        'style="top:'+ top +'%;' +
        'right: '+ right +'%;">' +
        '<span class="house-label__txt">'+ address +'</span>' +
        '<i class="house-label__ico fa fa-clock-o"></i>' +
        '</div>';
    $('.flats__body-inner').append(houseLbl);
}



$(document).on('mouseover', '.house-img g[id *= floors] *', function() {

    $(this).attr('class', $(this).attr('class').split(' ').shift());

    var houseChords = $('.house-img')[0].getBBox();

    var floor = {
        floorChords: new CalcChords($(this)[0].getBBox()),
        number: $(this).attr('id').split('--f-')[1],
        color: $(this).css('fill')
    };

    var label = '';
    label += '<div class="floor-label" ';
    label += 'style="background: ' + floor.color + ';';
    label += 'top:' + floor.floorChords.calculate('y', houseChords.height) + '%;';
    label += 'left:' + floor.floorChords.calculate('x', houseChords.width) + '%;"';
    label += '>Этаж' + floor.number + '</div>';

    $('.flats__body-inner').append(label);

});
$(document).on('mouseout', '.house-img g[id *= floors] *', function() {
    var floorClass = $(this).attr('class').split(' ')[0];
    $(this).attr('class', floorClass + ' floor-hide');
    $(document).find('.floor-label').addClass('label-hide');
});

$(document).on('click', '.house-img g[id *= floors] *', function() {
    var floorNumber = $(this).attr('id').split('--f-').pop();
    var href = $('.data-div[data-floor='+ floorNumber +']').attr('data-link');

    location.href = href;
});







