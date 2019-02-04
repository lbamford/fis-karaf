var baseApp = {};

$(document).ready(function () {
    baseApp.op_setDataTable();
});


baseApp.op_setDataTable = function () {

    var tHeight = $(window).height() - 250;
    if (tHeight < 200) {
        tHeight = 200;
    }
    
    var responsiveHelper = undefined;
    var breakpointDefinition = {
        tablet: 1024,
        phone: 480
    };
    
    baseApp.aTable = $('#service-table');
    baseApp.aTable.dataTable({
        'bFilter': true,
        'bDestroy': true,
        'bServerSide': false,
        'bStateSave': false,
        'bProcessing': true,
        'bAutoWidth': false,
        'iDisplayLength': 50,
        'sDom': 'C<"data-table-top-control"<"toolbar"><"pull-right"f>r<"clearfix">>t<"data-table-bottom-control"<"pull-left"i><"pull-right"p><"clearfix">>',
        'sScrollY': tHeight + 'px',
        'sScrollX': '100%',
        'bScrollCollapse': false,
        'oLanguage': {
            'sZeroRecords': 'No services found',
            'sEmptyTable': 'No services ',
            'sInfo': 'Showing (_START_ to _END_) of _TOTAL_ services ',
            'sInfoFiltered': ''
        },
        
        'fnPreDrawCallback': function () {
            $("table").find('th').each(function () {
                if ($(this).hasClass("always")) {
                    $(this).attr("data-hide", "always");
                }
                if ($(this).hasClass("phone tablet")) {
                    $(this).attr("data-hide", "phone,tablet");
                }
                if ($(this).hasClass("expand")) {
                    $(this).attr("data-class", "expand");
                }
            });

            // Initialize the responsive datatables helper once.
            if (!responsiveHelper) {
                responsiveHelper = new ResponsiveDatatablesHelper(baseApp.aTable, breakpointDefinition, {
                    hideEmptyColumnsInRowDetail: true,
                    showRowDetail: rowDetailCallBack
                });
            }

        },
        'fnRowCallback': function (nRow) {
            responsiveHelper.createExpandIcon(nRow);
        },
        'fnDrawCallback': function (oSettings) {
            responsiveHelper.respond();

            $(this).find('tr').on('click', function () {
                $(this).siblings().removeClass('success selected');
                $(this).addClass('success selected');
            });
        },
        'fnInitComplete': function (oSettings) {
        },
        searchHighlight: true
    });
    
    function rowDetailCallBack(obj) {
        
    }
};





