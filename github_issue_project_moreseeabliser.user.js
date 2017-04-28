// ==UserScript==
// @name        Github project status moreseeabliser.
// @include     /^https:\/\/github.com\/.+\/.+\/issues\/*/
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant       GM_xmlhttpRequest
// ==/UserScript==


(function() {
    'use strict';

    var colours = {
        'NEEDS SPEC': {'border': '#E57373', 'background': '#FFCDD2', 'text': '#880E4F'},
        'NEEDS UX DESIGN': {'border': '#BA68C8', 'background': '#E1BEE7', 'text': '#4A148C'},
        'READY TO START': {'border': '#FFF176', 'background': '#FFF9C4', 'text': '#F57F17'},
        'IN DEVELOPMENT': {'border': '#64B5F6', 'background': '#BBDEFB', 'text': '#0D47A1'},
        'DONE': {'border': '#81C784', 'background': '#C8E6C9', 'text': '#1B5E20'}
    };

    var forms = $.find("form");
    var matchingForms = $.grep(forms, function(form) {
        return /Projects/.test($.trim(form.innerText));
    });
    var projects = $(matchingForms[0]);

    var statuses = $.map(projects.find('p').toArray(), function(project_status) {
        var project_status_text = $.trim(project_status.innerText);
        var project = $(project_status).find('a').text();
        var link = $(project_status).find('a').href;
        var status_in = $.trim(project_status_text.substr(0, project_status_text.lastIndexOf(project)));
        var status = status_in.substr(0, status_in.length - 3);
        return {'project': project, 'status': status, 'link': link};
    });

    if (statuses.length == 1) {
        var status = statuses[0].status;
        var project = statuses[0].project;
        var link = statuses[0].link;
        var lookup_status = status.toUpperCase();
        var bgcolour = 'darkgray';
        var fgcolour = 'white';
        if (lookup_status in colours) {
            bgcolour = colours[lookup_status].background;
            fgcolour = colours[lookup_status].text;
        }
        var status_element = $('div#show_issue').find('div.TableObject-item')[0];
        $(status_element).after($("<div title='" + project + "' class='TableObject-item'><div class='State' style='background-color: " + bgcolour + "; color: " + fgcolour + "'>" + statuses[0].status + "</div></div>"));

        $('span.js-issue-title').before($('<span><a href="' + link + '">' + project + '</a>:</span>'));
    }

})();

