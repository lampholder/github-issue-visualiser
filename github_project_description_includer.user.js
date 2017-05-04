// ==UserScript==
// @name        Github project details includer.
// @include     /^https:\/\/github.com\/.+\/.+\/projects\/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant       GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    //TODO: Make the project URL generic
    //TODO: Make the brute-force linkifier at the end do a proper job.

    GM_xmlhttpRequest({
        method:     'GET',
        url:        'https://github.com/vector-im/riot-web/projects',
        onload:     function(response) {
                        var projectsDoc = $(response.responseText);
                        var projectsResults = projectsDoc.find('div#projects-results');

                        var projects = $.map(projectsResults.children('div').toArray(), function(project) {
                            var project_name = $.trim($(project).find('h4').text());
                            var description = $.trim($($(project).children('div')[2]).text());
                            var link = $($(project).find('h4')[0]).find('a')[0].href;
                            return {'name': project_name, 'description': description, 'link': link};
                        });

                        //console.log(['projects', projects]);
                        var this_project = projects.filter(function(project) {
                            return project.link == window.location.href;
                        })[0];

                        $('div.project-header').append('<div><a href="' + this_project.description + '">' + this_project.description + '</a></div>');

                    }
    });
})();
