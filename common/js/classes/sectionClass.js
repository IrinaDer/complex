//create section's svg
function Section(svgSelector) {
    // var $this = this;
    // //загальне svg
    // $this.svgCommon = $(document).find('.' + svgClass);
    // $this.sectionFlats = $this.svgCommon.find('g[id*="rooms"] > *');
    // $this.sectionPorch = $this.svgCommon.find('g[id*="porch"] > *');
    // $this.sectionPorch = $this.svgCommon.find('g[id*="porch"] > *');
    //загальне svg
    this.svgCommon = $(document).find(svgSelector);
    //всі квартири
    this.getSectionsFlats = function() {
        return this.svgCommon.find('g[id*="rooms"] > *');
    };
    this.getSectionsPorch = function() {
        return this.svgCommon.find('g[id*="porch"] > *');
    };

    //всі секції
    this.getSectionsSpace = function() {
        return this.svgCommon.find('g[id*="sections"] > *');
    };

    //кількість секцій
    this.getSectionQnt = function() {
        return this.getSectionsSpace().length;
    };


    //формування html секцій
    this.createSectionHtml = function(flats) {
        var sections = [];

        var self = this;
        var sectionsSpaces = this.getSectionsSpace();


        //створення масиву квартир всього поверху
        var sectionsFlats = this.getSectionsFlats();

        var flats = [];
        sectionsFlats.each(function() {
            //flats.unshift($(this).clone());
           flats.push($(this).clone());  //flat-floor
        });

        // кількість квартир в секції
        var sectionFlatsCount = flats.length / this.getSectionQnt();




        sectionsSpaces.each(function() {

            var sectionData = {
                space: self.setSectionSpace($(this).clone()), // html
                flats: self.setSectionFlats(flats, sectionFlatsCount), //html
                porch: self.getSectionsPorch().length ? self.setSectionPorch($(this).attr('id').split('sect-')[1]) : '' //html
            };


            var svgCommonParams = self.svgCommon[0].getAttribute('viewBox').split(' ');
            var width = (svgCommonParams[2] / self.getSectionQnt()).toFixed(2);
            var height = svgCommonParams[3];

            var porch = '';
            if(sectionData.porch != '') {
                porch = '<g id="big--section-'+ self.SectionSpaceNumber +'--porch--' + self.svgCommon.attr('id') + '">' +
                    sectionData.porch +
                    '</g>'
            }

            var section  = '<svg id="big--section-'+ self.SectionSpaceNumber +'--' + self.svgCommon.attr('id') + '"' +
                'viewBox="0 0 ' + width + ' ' + height + '">' +
                '<g id="big--section-'+ self.SectionSpaceNumber +'--sections--' + self.svgCommon.attr('id') + '">' +
                sectionData.space +
                '</g>' +
                porch +
                '<g id="big--section-'+ self.SectionSpaceNumber +'--rooms--' + self.svgCommon.attr('id') + '">' +
                sectionData.flats +
                '</g>'
            '</svg>';

            sections.unshift(section)


        });

        return sections;

    };

    // робота з ел. площі кожної секції
    // пересування елементу секції до початку svg
    this.setSectionSpace = function(that) {
        this.SectionSpaceNumber = that.attr('id').split('sect-')[1];

        var firstSpace = this.getSectionsSpace();

        // можуть бути різні теги в space різнич секцій
        if (that.attr('points')) {
            that.attr('points', firstSpace.attr('points'));
        } else if (that.attr('x')) {
            that.attr('x', firstSpace.attr('x'))
        }

        that.attr('id', 'big--' + that.attr('id'));


        return that[0].outerHTML;
    };

    // робота з квартирами кожної секції
    //пересування квартир до початку секції
    this.setSectionFlats = function(flats, sectionFlatsCount) {

        //формування масиву  квартир одної секції


        var sectionFlats = [];
        for (var i = 0; i < sectionFlatsCount; i++) {
           // sectionFlats.unshift(flats.pop());
            sectionFlats.push(flats.shift());
        }
        //console.log(this.getSectionsFlats()[0]);

        var flatsHtml = '';
        for(var j = 0; j < sectionFlats.length; j++ ) {
            if (sectionFlats[j].attr('points')) {
                sectionFlats[j].attr('points', $(this.getSectionsFlats()[j]).attr('points'));
            } else if (sectionFlats[j].attr('x')) {
                sectionFlats[j].attr('x', $(this.getSectionsFlats()[j]).attr('x'));
            }

            sectionFlats[j].attr('id', 'big--' + sectionFlats[j].attr('id'));

          //  console.log(sectionFlats[j]);
            flatsHtml += sectionFlats[j][0].outerHTML;
        }

        //console.log(flatsHtml);
        return flatsHtml;


    };
    this.setSectionPorch = function(number) {
        var porches = this.getSectionsPorch();
        //console.log('porches', porches);


        var porch = '';
        porches.each(function() {
            if($(this).attr('id').indexOf('porch-' + number) != -1)
            //number[0], бо неправильне id секції
                porch = $(this).clone();

        });


        porch.attr('id', 'big--' + porch.attr('id'));
        // можуть бути різні теги в space різнич секцій
        if (porch.attr('points')) {
            porch.attr('points', porches.attr('points'));
        } else if (porch.attr('x')) {
            porch.attr('x', porches.attr('x'))
        }

        return porch[0].outerHTML;

    };
}



