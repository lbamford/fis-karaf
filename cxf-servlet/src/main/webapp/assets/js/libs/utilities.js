//utilities_setupAjax();

function utilities_setupAjax() {

    $.ajaxSetup({
        cache: true,
        error: function (options) {
            if (options.responseText.indexOf("Login :") > -1) {
                window.location = '/login';
                return false;
            }
            if (typeof error == 'function') {
                error.apply(this, arguments);
            }
        }
    });
}

function utitilities_datatable_addrows(obj, all_columns) {
    var tHeight = $(window).height() - 250;
    var tableHeight = tHeight * .65;
    var maxRows = tableHeight / $(obj).find("td").height();
    maxRows = Math.round(maxRows);
    var numRows = maxRows;
    var columns = utilities_visibleColumns(all_columns);
    fcmcAddRows(obj, columns, numRows);

}


/**
 * Datatable specific function for ensuring minimum number of rows and therefore table size. Use in conjunction with:
 *
 * "bScrollCollapse": false,
 * "sScrollY": 'Npx',
 *
 * Add in fnDrawCallback:
 * fcmcAddRows(this, 5, 15);
 */

function fcmcAddRows(obj, numberColumns, targetRows) {
    var tableRows = obj.find('tbody tr'); // grab the existing data rows
    var numberNeeded = targetRows - tableRows.length; // how many blank rows are needed to fill up to targetRows
    var lastRow = tableRows.last(); // cache the last data row
    var lastRowCells = lastRow.children('td'); // how many visible columns are there?
    var cellString;
    var highlightColumn;
    var rowClass;

    // The first row to be added actually ends up being the last row of the table.
    // Check to see if it should be odd or even.
    if (targetRows % 2) {
        rowClass = "odd";
    } else {
        rowClass = "even"; //
    }

    // We only sort on 1 column, so let's find it based on its classname
    lastRowCells.each(function (index) {
        if ($(this).hasClass('sorting_1')) {
            highlightColumn = index;
        }
    });

    /* Iterate through the number of blank rows needed, building a string that will
     * be used for the HTML of each row. Another iterator inside creates the desired
     * number of columns, adding the sorting class to the appropriate TD.
     */
    for (i = 0; i < numberNeeded; i++) {
        cellString = "";
        for (j = 0; j < numberColumns; j++) {
            if (j == highlightColumn) {
                cellString += '<td class="sorting_1">&nbsp;</td>';
            } else {
                cellString += '<td>&nbsp;</td>';
            }
        }

        // Add the TR and its contents to the DOM, then toggle the even/odd class
        // in preparation for the next.
        lastRow.after('<tr class="' + rowClass + '">' + cellString + '</tr>');
        rowClass = (rowClass == "even") ? "odd" : "even";
    }
}

function utilities_visibleColumns(object) {
    var length = 0;
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            if (object[key].bVisible) {
                ++length;
            }
        }
    }
    return length;
}


function utilities_processing(show) {
    //instead of opening a dialog just show a div
    if (show) {
        $('#processing').css('height', $(window).height() + 'px');
        $('#processing').css('width', $(window).width() + 'px');
        $('#processing').css('cursor', 'wait');
        $('#processing').show();
    }
    else {
        $('#processing').hide();
        $('#processing').css('cursor', 'default');
    }
}

function utilities_keepAlive() {
    var HEARTBEAT_PERIOD = (60 * 1) * 10000; //10 mins
    window.onload = function () {
        heartbeatTimer = setInterval(utilities_keepAliveRequest, HEARTBEAT_PERIOD);
    }
}

function utilities_keepAliveRequest() {
    $.ajax({
        "type": "POST",
        "url": "/"
    });
}

function utilities_applyScreenCSS(styleSheetURL) {

    if ((screen.width <= 1500)) {
        $('head').append('<link rel="stylesheet" href="' + styleSheetURL + '" type="text/css" />');
    } else {
        //$('head').append('<link rel="stylesheet" href="' + styleSheetURL + '" type="text/css" />');
    }
}

function utilities_islowRes() {
    if ((screen.width <= 1024) && (screen.height <= 768)) {
        return true;
    } else {
        return false;
    }
}
/**
 * Returns the version of Internet Explorer or false, indicating another browser
 */
function utilities_isIE() {
    var rv = false;
    if (navigator.appName == 'Microsoft Internet Explorer')
    {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    return rv;
}

/**
 * Returns true if valid for local storage
 */
function utilities_allowLocalStorage() {
    var rv = false;
    if (navigator.appName == 'Microsoft Internet Explorer')
    {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }

    //if false not IE
    if (!rv) {
        rv = true;
    }
    //if > 7 then IE 8 or above
    else if (rv > 7) {
        rv = true;
    }
    //else IE 7 or less
    else {
        rv = false;
    }
    return rv;
}

// Function to convert bytes into a readable user friendly string
//
// Parameters:
// (I) bytes
// (I) precision
//
// Returns:
//   A user friendly string
function utilities_bytesToSize(bytes, precision)
{
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    var posttxt = 0;
    if (bytes == 0)
        return 'n/a';
    while (bytes >= 1024) {
        posttxt++;
        bytes = bytes / 1024;
    }
    return parseInt(bytes).toFixed(precision) + " " + sizes[posttxt];
}

// Function to return the count of elements in a javascript
// object.
//
// Parameters: Object
// returns: int - count of elements in object
function utilities_countProperties(obj) {
    var count = 0;
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            ++count;
    }
    return count;
}

function utility_isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


var utilities = {
    /*
     * callBack is an object {'namespace': 'xyz', 'callback':'abc'}
     */
    executeCallback: function (callBack, data) {
        if (typeof callBack !== 'undefined' && typeof callBack.callback !== 'undefined') {
            if (typeof callBack.namespace !== 'undefined') {
                window[callBack.namespace][callBack.callback](data);
            } else {
                window[callBack.callback](data);
            }
            return true;
        }
        return false;
    },
    fileUpload: function (el, maxSize, submitField, successCallback) {
        $('.upload-message .remove').click(function () {
            utilities.uploadReset(submitField);
        });
        el.fileupload({
            dataType: 'json',
            add: function (e, data) {

                utilities_processing(true);
                var valid = true;
                var re = /^.+\.((csv|pdf|doc|docx|txt))$/i;
                $.each(data.files, function (index, file) {

                    //Check the file type
                    if (!re.test(file.name)) {
                        file.error = "File type not supported";
                        utilities.uploadError(file);
                        valid = false;
                    }
                    //Check the size
                    if (file.size > maxSize) {
                        file.error = "File is too big";
                        utilities.uploadError(file);
                        valid = false;
                    }
                    //Clear the upload message if all ok
                    if (valid) {
                        $('#upload-message').html('');
                    }
                });
                if (valid) {
                    data.submit();
                } else {
                    utilities_processing(false);
                }
            },
            done: function (e, data) {
                $.each(data.result.files, function (index, file) {
                    if (file.error) {
                        utilities.uploadError(file);
                    } else {
                        utilities.uploadSuccess(file, submitField);
                        if (false == utilities.executeCallback(successCallback, data)) {
                            //No callback was specified so do the default
                            var uploadContainer = $('input[name="' + submitField + '"]').parents('#fileupload-container');
                            $('input[name="' + submitField + '"]').val(data.result.files[0]['id']);
                            //$('input.js-file-upload-id').val(data.result.files[0]['id']);
                            uploadContainer.find('input[type="file"]').addClass('hidden');
                            uploadContainer.find('.upload-message').append('<br/><a class="remove" href="#">remove</a></span>');
                            uploadContainer.find('.upload-message .remove').click(function () {
                                utilities.uploadReset(submitField);
                            });
                        }
                    }
                });
                utilities_processing(false);
            },
            progressall: function (e, data) {

            },
            error: function () {
                utilities.uploadError();
                $('#upload-message').html('<p>An error occured while uploading the file.</p>');
                valid = false;
                utilities_processing(false);
            }
        });
    },
    uploadReset: function (submitField) {
        var uploadContainer = $('input[name="' + submitField + '"]').parents('#fileupload-container');
        uploadContainer.find('.upload-message').html("");
        uploadContainer.find('.upload-message').hide();
        uploadContainer.find('input[type="file"]').removeClass('hidden');
        uploadContainer.find('.help-block').removeClass('hidden');
        $('input[name="' + submitField + '"]').val('');
    },
    uploadError: function (file, submitField) {
        var uploadContainer = $('input[name="' + submitField + '"]').parents('#fileupload-container');
        if (file) {
            uploadContainer.find('.upload-message').html('<p>Unable to upload "' + file.name + '" <u>' + file.error + '.</u> </p>');
        }
        uploadContainer.find('.upload-message').removeClass("upload-message-ok");
        uploadContainer.find('.upload-message').addClass("upload-message-fail");
        uploadContainer.find('.upload-message').show();
    },
    uploadSuccess: function (file, submitField) {
        var uploadContainer = $('input[name="' + submitField + '"]').parents('#fileupload-container');
        uploadContainer.find('.upload-message').text('Import file "' + file.name + '" uploaded');
        uploadContainer.find('.upload-message').removeClass("upload-message-fail");
        uploadContainer.find('.upload-message').addClass("upload-message-ok");
        uploadContainer.find('.upload-message').show();
        uploadContainer.find('.help-block').addClass('hidden');
    }
};

function utilities_guid(guidLength) {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
    }
    if (guidLength == 3) {
        return  s4() + s4() + s4();
    } else {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
    }
}

function utilities_number_format(number, decimals, dec_point, thousands_sep) {

    number = (number + '')
            .replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + (Math.round(n * k) / k)
                        .toFixed(prec);
            };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
            .split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '')
            .length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1)
                .join('0');
    }
    return s.join(dec);
}