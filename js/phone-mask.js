
var curVal = '+7 (___) ___-____';

var caretPosition = {
    get : function (ctrl) {
            // IE < 9 Support
            if (document.selection) {
                ctrl.focus();
                var range = document.selection.createRange();
                var rangelen = range.text.length;
                range.moveStart ('character', -ctrl.value.length);
                var start = range.text.length - rangelen;
                return {'start': start, 'end': start + rangelen };
            }
            // IE >=9 and other browsers
            else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
                return {'start': ctrl.selectionStart, 'end': ctrl.selectionEnd };
            } else {
                return {'start': 0, 'end': 0};
            }
        },
    set :function (ctrl, start, end) {
            // IE >= 9 and other browsers
            if(ctrl.setSelectionRange)
            {
                ctrl.focus();
                ctrl.setSelectionRange(start, end);
            }
            // IE < 9
            else if (ctrl.createTextRange) {
                var range = ctrl.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', start);
                range.select();
            }
        }
};

var timer;

var user = detect.parse(navigator.userAgent);
var deviceType = user.device.type;

function phoneMask($element){

    $element.val('');

    $element.on('click', function(){

        if (!$(this).val()) {

            $(this).val(curVal);

            caretPositionTimer(this, 4, 4);
        }
    });

    $element.on('input', function(){

        var val = $(this).val();

        var curPos = caretPosition.get(this).start;

        var simbol;

        if (val.length > curVal.length) {

            simbol = val.slice(curPos - 1, curPos);

            if(simbol.match('^[0-9]$')) {
        
                switch (curPos){

                    case 1:
                    case 2:
                    case 3:
                    case 4:
    
                        val = curVal.slice(0, 4) + simbol + curVal.slice(5, curVal.length);
    
                        $(this).val(val);
    
                        caretPosition.set(this, 5, 5);
    
                        curVal = val;
    
                        break;
    
                    case 8:
    
                            val = curVal.slice(0, curPos + 1) + simbol + curVal.slice(curPos + 2, curVal.length);
    
                            $(this).val(val);
        
                            caretPosition.set(this, curPos + 2, curPos + 2);
        
                            curVal = val;
    
                        break;
    
                    case 9:
                    case 13:
    
                            val = curVal.slice(0, curPos) + simbol + curVal.slice(curPos + 1, curVal.length);
    
                            $(this).val(val);
        
                            caretPosition.set(this, curPos + 1, curPos + 1);
        
                            curVal = val;
    
                        break;
    
                    case (val.length):
    
                        $(this).val(curVal);
    
                        break;
    
                    default:               
    
                        val = curVal.slice(0, curPos - 1) + simbol + curVal.slice(curPos, curVal.length);
    
                        $(this).val(val);
    
                        caretPosition.set(this, curPos, curPos);
    
                        curVal = val;
                }
            }
            else {

                $(this).val(curVal);
                
                switch (curPos){
                
                    case 1:
                    case 2:
                    case 3:
                    case 4:

                        caretPosition.set(this, 4, 4);

                        break;

                    default:

                        caretPosition.set(this, curPos - 1, curPos - 1);
                }
            }
        }
        else {

            switch (curPos){

                case 0:
                case 1:
                case 2:
                case 3:

                    $(this).val(curVal);

                    if (curPos === 0) {

                        curPos = curPos + 4;
                    }
                    
                    if (curPos === 1) {

                        curPos = curPos + 3;
                    }

                    if (curPos === 2) {

                        curPos = curPos + 2;
                    }
                    
                    if (curPos === 3) {

                        curPos = curPos + 1;
                    }

                    if (deviceType !== 'Desktop' || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    
                        caretPositionTimer(this, curPos, curPos);
                    }
                    else {

                        caretPosition.set(this, curPos, curPos);
                    }

                    break;

                case 8:

                    val = curVal.slice(0, curPos - 2) + '_' + curVal.slice(curPos - 1, curVal.length);

                    $(this).val(val);

                    if (deviceType !== 'Desktop' || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    
                        caretPositionTimer(this, curPos - 2, curPos - 2);
                    }
                    else {

                        caretPosition.set(this, curPos - 2, curPos - 2);
                    }

                    curVal = val;

                    break;

                case 7:
                case 12:

                    val = curVal.slice(0, curPos - 1) + '_' + curVal.slice(curPos, curVal.length);

                    $(this).val(val);

                    if (deviceType !== 'Desktop' || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    
                        caretPositionTimer(this, curPos - 1, curPos - 1);
                    }
                    else {

                        caretPosition.set(this, curPos - 1, curPos - 1);
                    }

                    curVal = val;

                    break;

                default:               

                    val = curVal.slice(0, curPos) + '_' + curVal.slice(curPos + 1, curVal.length);

                    $(this).val(val);

                    if (deviceType !== 'Desktop' || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    
                        caretPositionTimer(this, curPos, curPos);
                    }
                    else {

                        caretPosition.set(this, curPos, curPos);
                    }

                    curVal = val;
            }
        }
    });
}

function caretPositionTimer(el, start, end){

    clearTimeout(timer);

    timer = setTimeout(function(){

        caretPosition.set(el, start, end);
    }, 10);
}
    