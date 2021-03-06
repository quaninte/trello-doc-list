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
        names.push({
            name: $(this).text(),
            checked: $(this).parents('.list-wrapper').is(':visible')
        });
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

function addTextListBlock() {
    // Add text list block if not existed yet
    var $textList = $('.text-list');
    if ($textList.length == 0) {
        $('body').append('<div class="text-list"><button class="close">Close</button><div class="content"></div></div>');

        $('.text-list .close').click(function() {
            $('.text-list').hide();
        });
    }
    $textList.show();
}

function showTextList(type) {
    addTextListBlock();

    // Build cards list object
    // Get assignees & insert into doc list
    var assignees = [], i;
    if (type == 'text') {
        assignees.push('all');
    } else {
        // Get all assignees from visible tasks
        $('.list-card:not(.hide) .member-avatar').each(function() {
            // Insert if assignees not existed
            var name = $(this).attr('title');
            if (assignees.indexOf(name) == -1) {
                assignees.push(name);
            }
        });
    }

    // Write assignees to doc list content
    var $textListContent = $('.text-list .content');
    $textListContent.html('');

    var $assigneeContainer = $('<ol class="assignee"></ol>');
    $textListContent.append($assigneeContainer);
    for (i in assignees) {
        $assigneeContainer.append('<li class="assignee-item" data-key="' + assignees[i] + '"><span>' + assignees[i] + '</span> <ol class="column"></ol></li>');
    }

    // Traverse visible columns
    var $columns = $('.list-wrapper:visible');
    $columns.each(function() {
        var columnName = $('.list-header-name-assist', this).text(),
            $column = $(this);

        // Add column to assignee
        var $columnUl = $('<li class="column-item" data-key="' + columnName + '"><span>' + columnName + '</span><ol class="card"></ol></li>');

        console.log('Adding ' + columnName);
        $('.assignee-item .column').append($columnUl);

        // Traverse visible tasks
        $('.list-card:not(.hide)', $column).each(function() {
            // Get card name
            var $card = $(this);
            var $cardName = $('.list-card-title', $card).clone();

            $('span', $cardName).remove();
            var cardName = $cardName.text();

            // Get all assignees of this card
            var $assignees = $('.member img', $card), cardAssignees = [];

            if (type == 'text') {
                cardAssignees.push('all');
            } else {
                $assignees.each(function() {
                    var assigneeName = $(this).attr('title');
                    cardAssignees.push(assigneeName);
                });
            }

            for (i in cardAssignees) {
                // Add task to assignee and column
                $('.card', '.assignee-item[data-key="' + cardAssignees[i] + '"] .column-item[data-key="' + columnName + '"]').append('<li>' + cardName + '</li>');
            }

        });
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

            case 'show-text-list':
                showTextList(request.type);
                break;

            default:
                console.log('Do nothing');
                break;
        }
    });