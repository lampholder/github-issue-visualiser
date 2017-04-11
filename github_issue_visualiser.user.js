// ==UserScript==
// @name        Github linked issue state visualiser.
// @include     https://github.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant       GM_xmlhttpRequest
// ==/UserScript==

linkedIssues = $.find("a.issue-link");

$.each(linkedIssues, function(index, issue) {
    GM_xmlhttpRequest({
        method:     'GET',
        url:        issue.href,
        onload:     function(response) {
                        var respDoc     = $(response.responseText);
                        var targetElems = respDoc.find ("div.state");
                        var classList = $(targetElems[0]).attr('class').split(/\s+/);
                        var state = "UNKNOWN";
                        var bgcolor = "darkgray";
                        var fgcolor = "lightgray";
                        var bordercolor = "black";
                        if ($.inArray("state-open", classList) !== -1) {
                            state = "&#10008;";
                            fgcolor = "#cc0000";
                        }
                        else if ($.inArray("state-closed", classList) !== -1) {
                            state = "&#10004;";
                            fgcolor = "#339933";
                        }
                        $(issue).after($("<span style='" +
                                         "font-weight: bold; color: " + fgcolor + "; margin-left: 6px; " + 
                                         "'>" + state + "</span>"));
                    }
    });
});
