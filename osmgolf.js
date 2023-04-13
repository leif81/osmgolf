/* jshint browser: true, devel: true */
/* global async, Map, Set */
'use strict';

// Override these by passing in an object with any of these key/value pairs into the initOsmGolf function (e.g. from osmgolf.html page).
var osmGolfOptions = {
    domElement: "#osmgolf",
    service: "https://overpass-api.de/api/interpreter?data=\[out:json\];",
    checkForUpdates: false
};

function initOsmGolf(options) {
    osmGolfOptions = Object.assign(osmGolfOptions, options); // Merge custom options into defaults.
    loadParams();
    var app = createOsmGolf()
    document.querySelector(osmGolfOptions.domElement).appendChild(app);
    getNearestGolfCourse();
    console.log("osmgolf loaded!");
}

function createOsmGolf() {
    var osmgolf = document.createElement("div");
    return osmgolf;
}

function getCurrentLocation() {
    // TODO - in future request users current location from web browser Geolocation API. https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API 
    return {lat: 44.2450803, lon: -76.4488947 }; // This position is at Garrison Golf Course south of the pro shop.
}

function getNearestGolfCourse() {
    var myLocation = getCurrentLocation();
    var request = osmGolfOptions.service + "way(around:100.0," + myLocation.lat + "," + myLocation.lon + ")\[leisure=golf_course\];out%20tags;";
    
    httpGet(request, function(response) {
        response.elements.forEach(element => {
            var courseName = document.createTextNode("The nearest golf course is " + element.tags.name + ".");
            document.querySelector(osmGolfOptions.domElement).appendChild(courseName);
        });
    });
}

function getNearestHole() {
    // TODO
}

function getDistanceToPin() {
    //TODO
}

// Load optional configuration parameters from the browser client URL.
// Any parameters found will override the statically configured options in osmGolfOptions.
function loadParams() {

    var autorefresh = getURLParameter("autorefresh");
    if (autorefresh !== null) {
        osmGolfOptions.autoRefresh = isTrue(autorefresh);
    }
}

function httpGet(url, successCallback, errorCallback) {
	if (url.indexOf("?") == -1) {
	    url += "?";
	} else {
	    url += "&";
	}

    fetch(url).then(function(response) {
            return response.json()
        }).then(function(data) {
            return successCallback(data)
        }).catch(function(error) {
            console.error('Error:', error);
        });
}

function getURLParameter(parameter) {
    return decodeURIComponent((new RegExp('[?|&]' + parameter + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
}

function scheduleCheckForUpdates() {
    window.setTimeout(function() {
        loadCheckForUpdates();
    }, 600000);
}

function isTrue(string) {
    return (string === 'true');
}

// Register event handlers

// Background checking for updates to visible cards
document.addEventListener("visibilitychange", function() {
    if (document.hidden) {
        osmGolfOptions.checkForUpdates = false;
    } else {
        osmGolfOptions.checkForUpdates = true;
        //loadCheckForUpdates();
    }
});
