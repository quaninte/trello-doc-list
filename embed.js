// Flag so css only inserted once
var enabled = false;

function switchToVertical() {
    (function (w) {
        var $list = $('.list'),
            $listWrapper = $('.list-wrapper');

        $('.js-list').width(w);
        $list.width(w);
        $('.list-area').width($list.length * (w + 12));
        $listWrapper.css({'height': 'auto'});
        $listWrapper.css({'display': 'block'});
        $listWrapper.css({'margin': '0 5px 5px 10px'});
        $('.js-member-droppable').css({'max-width': '100%'});
        $('body').addClass('layout-horiz-scroll');
    })('99.3%');
    $('head').append('<style type="text/css">#board{overflow-y:auto;}.list-card-cover{max-width:246px;}.list-card{max-width:100%;}{</style>');
}

function hideExtraSections() {
    $('head').append('<style type="text/css">' +
        '.list-card-labels {' +
        'margin: 2px 0;' +
        'overflow: auto;' +
        'position: absolute;' +
        'right: 0;' +
        '}' +
        '.card-label.mod-card-front {' +
        'width: 8px' +
        '}' +
        '.list {' +
        'background: 0;' +
        '}' +
        'body {' +
        'background: 0 !important;' +
        '}' +
        '.list-card {' +
        'border: 0 !important;' +
        '}' +
        '.list-card {' +
        'border: 0 !important;' +
        'padding: 0;' +
        'margin: 0;' +
        '}' +
        '.list-card-title {' +
        'margin: 0 !important;' +
        '}' +
        '.list-card-details {' +
        'padding: 0 0 0 15px !important;' +
        '}' +
        '.board-header-btn-text {' +
        'color: black;' +
        '}' +
        '.list-header {' +
        'padding: 0 !important;' +
        '}' +
        '.list-header-num-cards, .badges, .list-card-members, .open-card-composer, .list-header-extras-menu, .list-card-cover, .list-wrapper.mod-add, .list-card-cover {display: none !important;}' +
        '.list-cards {' +
        'overflow-y: hidden !important;' +
        '}' +
        '</style>');
}

// Get column names
function getColumnNames() {
    var names = [];
    $('.list-header-name-assist').each(function() {
        names.push($(this).text());
    });

    return names;
}

// Show columns in columns list and hide the rest
function showColumns(columns) {
    $('.list-header-name-assist').each(function() {
        // If column found
        var $column = $(this).parents('.list-wrapper');
        if (columns.indexOf($(this).text()) != -1) {
            // Show column
            $column.show();
        } else {
            // Hide column
            $column.hide();
        }
    });
}

// Listen for actions
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log('Received message', request);

        switch (request.action) {
            case 'enable-doc-list':
                // Flag so css only inserted once
                if (!enabled) {
                    enabled = true;
                    switchToVertical();
                    hideExtraSections();
                }

                sendResponse({columns: getColumnNames()});
                break;

            case 'show-columns':
                showColumns(request.columns);
                break;

            default:
                console.log('Do nothing');
                break;
        }
    });