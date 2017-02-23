var columns = [];

function buildColumnsList() {
    var columnsList = $('#columns-list'), i;

    columnsList.html('');
    for (i in columns) {
        columnsList.append('<li><label><input type="checkbox" name="col[]" checked="checked" value="' + columns[i] +'">' + columns[i] +'</label></li>');
    }

    // Bind checkbox change
    $('input[name="col[]"]').change(function() {
        var enabledColumns = [];
        $('input[name="col[]"]:checked').each(function() {
            enabledColumns.push($(this).val());
        });

        // Send message to update show columns
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'show-columns',
                columns: enabledColumns
            });
        });
    });
}

$(function () {
    // Enable vertical show
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        console.log('Eend message to enable doc list');
        chrome.tabs.sendMessage(tabs[0].id, {action: 'enable-doc-list'}, function (response) {
            columns = response.columns;

            buildColumnsList();
        });
    });

    // Bind get text list
    $('.get-text-list').click(function() {
        var type = $(this).data('type');
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            console.log('Eend message to enable text list');
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'show-text-list',
                type: type
            });
        });
    });
});