// ==UserScript==
// @name        Github linked issue state visualiser.
// @include     https://github.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant       GM_xmlhttpRequest
// ==/UserScript==

linkedIssues = $.find("a.issue-link");

$.each(linkedIssues, function(_, issue) {
    GM_xmlhttpRequest({
        method:     'GET',
        url:        issue.href,
        onload:     function(response) {
                        var respDoc = $(response.responseText);
                        var targetElems = respDoc.find("div.state");
                        var classList = $(targetElems[0]).attr('class').split(/\s+/);
                        var state = "UNKNOWN";
                        var bgcolor = "darkgray";
                        var fgcolor = "lightgray";
                        var bordercolor = "black";
                        if ($.inArray("state-open", classList) !== -1) {
                            state = "&#10007;";
                            fgcolor = "#cc0000";
                        }
                        else if ($.inArray("state-closed", classList) !== -1) {
                            state = "&#10003;";
                            fgcolor = "#339933";
                        }
                        var forms = respDoc.find("form");
                        var matchingForms = $.grep(forms, function(form) {
                            return /Projects/.test($.trim(form.innerText));
                        });
                        var projects = $(matchingForms[0]);
                        var statuses = $.map(projects.find('p').toArray(), function(project_status) {
                            var components = $.trim(project_status.innerText).split('\n');
                            var status = components[0].substring(0, components[0].lastIndexOf(' '));
                            var project = $.trim(components[1]);
                            return {'project': project, 'status': status};
                        });
                        if (statuses.length === 0) {
                            var state_element = $("<span style='" +
                                                  "font-weight: bold; color: " + fgcolor + "; margin-left: 6px; " +
                                                  "'>" + state + "</span>");
                            $(issue).after(state_element);
                        }
                        var colours = {
                                       'NEEDS SPEC': {'border': '#E57373', 'background': '#FFCDD2', 'text': '#880E4F'},
                                       'NEEDS UX DESIGN': {'border': '#BA68C8', 'background': '#E1BEE7', 'text': '#4A148C'},
                                       'READY TO START': {'border': '#FFF176', 'background': '#FFF9C4', 'text': '#F57F17'},
                                       'IN PROGRESS': {'border': '#64B5F6', 'background': '#BBDEFB', 'text': '#0D47A1'},
                                       'DONE': {'border': '#81C784', 'background': '#C8E6C9', 'text': '#1B5E20'}
                                      };
                        $.each(statuses, function(_, project_status) {
                            var status = project_status.status.toUpperCase();
                            var background = 'white';
                            var border = 'black';
                            var text = 'black';
                            if (status in colours) {
                                background = colours[status].background;
                                border = colours[status].border;
                                text = colours[status].text;
                            }
                            $(issue).after($("<span style='border: 1px solid " + border + "; border-radius: 4px; white-space: nowrap; " +
                                             "margin-left: 6px; background-color: " + background + "; color: " + text + "; " +
                                             "font-size: 12px; font-weight: bold; " +
                                             "padding-left: 4px; padding-right: 4px;' title='" + project_status.project + "'>" +
                                             status + "</span>"));
                        });
                    }
    });
});
