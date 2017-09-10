function CalcChords(selector) {

    var $this = this;

    $this.x = selector.x;
    $this.y = selector.y;
    $this.width = selector.width;
    $this.height = selector.height;

    $this.calculate = function (property, param, sectionQty, sectionPos, commonSvgWidth ) {

       if(property == 'x' && sectionQty) {

           //commonSvgWidth/sectionQty - ширина секції
           //(sectionQty-sectionPos) - кількість секцій окрім даної
            console.log('property' + '-' + $this[property]);
            console.log('commonSvgWidth' + '-' + commonSvgWidth);
            console.log('sectionQty' + '-' + sectionQty);
            console.log('sectionPos', sectionPos);

           return (($this[property] - (commonSvgWidth/sectionQty * (sectionQty-sectionPos))) * 100 / param);


       } else {
           return $this[property] * 100 / param;
       }

    }

}


