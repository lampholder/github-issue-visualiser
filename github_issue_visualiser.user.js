// ==UserScript==
// @name        Github linked issue state visualiser.
// @include     https://github.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant       GM_xmlhttpRequest
// ==/UserScript==

var colours = {
    'NEEDS SPEC': {'border': '#E57373', 'background': '#FFCDD2', 'text': '#880E4F'},
    'NEEDS UX DESIGN': {'border': '#BA68C8', 'background': '#E1BEE7', 'text': '#4A148C'},
    'READY TO START': {'border': '#FFF176', 'background': '#FFF9C4', 'text': '#F57F17'},
    'IN DEVELOPMENT': {'border': '#64B5F6', 'background': '#BBDEFB', 'text': '#0D47A1'},
    'DONE': {'border': '#81C784', 'background': '#C8E6C9', 'text': '#1B5E20'}
};

linkedIssues = $.find("a.issue-link");

$.each(linkedIssues, function(_, issue) {
    GM_xmlhttpRequest({
        method:     'GET',
        url:        issue.href,
        onload:     function(response) {
                        var respDoc = $(response.responseText);
                        var targetElems = respDoc.find("div.State");
                        var type_match = /https?:\/\/github.com\/.+?\/.+?\/(.+?)\/[0-9]+/.exec(issue.href)[1];
                        switch(type_match) {
                            case 'pull':
                                type = 'PR';
                                break;
                            case 'issues':
                                type = 'issue';
                                break;
                        }
                        var state = $.trim($(targetElems[0]).text());
                        if (type == "issue") {
                            switch(state) {
                                case 'Open':
                                    state_text = "&#10007;";
                                    fgcolor = "#cc0000";
                                    tooltip = "This issue is open :(";
                                    break;
                                case 'Closed':
                                    state_text = "&#10003;";
                                    fgcolor = "#339933";
                                    tooltip = "This issue is closed!";
                                    break;
                                default:
                                    state_text = "(" + state + ")";
                                    fgcolor = "black";
                                    tooltip = "Unparsed issue status :S";
                                    break;
                            }
                            state_element = $("<span style='" +
                                                  "font-weight: bold; color: " + fgcolor + "; margin-left: 6px; " +
                                                  "' title='" + tooltip + "'>" + state_text + "</span>");
                        }
                        else if (type == "PR") {
                            switch(state) {
                                case 'Open':
                                    state_text = "&#8230;";
                                    fgcolor = "#339933";
                                    tooltip = "This PR is open!";
                                    break;
                                case 'Closed':
                                    state_text = "&#10007;&#10007;";
                                    fgcolor = "#cc0000";
                                    tooltip = "This PR was closed :(";
                                    break;
                                case 'Merged':
                                    state_text = "&#10003;";
                                    fgcolor = "#6f42c1;";
                                    tooltip = "This PR was merged :D";
                                    break;
                                default:
                                    state_text = "(" + state + ")";
                                    fgcolor = "black";
                                    tooltip = "Unparsed PR status :S";
                                    break;
                            }
                            state_element = $("<span style='" +
                                                  "font-weight: bold; color: " + fgcolor + "; margin-left: 6px; " +
                                                  "' title='" + tooltip + "'>" + state_text + "</span>");
                        }
                        var forms = respDoc.find("form");
                        var matchingForms = $.grep(forms, function(form) {
                            return /Projects/.test($.trim(form.innerText));
                        });
                        var projects = $(matchingForms[0]);
                        var statuses = $.map(projects.find('p').toArray(), function(project_status) {
                            var project_status_text = $.trim(project_status.innerText);
                            var project = $(project_status).find('a').text();
                            var status_in = $.trim(project_status_text.substr(0, project_status_text.lastIndexOf(project)));
                            var status = status_in.substr(0, status_in.length - 3);
                            return {'project': project, 'status': status};
                        });
                        if (statuses.length === 0) {
                            $(issue).after(state_element);
                        }

                        $.each(statuses, function(_, project_status) {
                            var status = project_status.status.toUpperCase();
                            console.log("[" + status + "]");
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

