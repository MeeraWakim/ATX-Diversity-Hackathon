/**
 * Created by daisyg on 9/12/15.
 */

var docCookies = {
    getItem: function (sKey) {
        if (!sKey) {
            return null;
        }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false;
        }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
        if (!this.hasItem(sKey)) {
            return false;
        }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    },
    hasItem: function (sKey) {
        if (!sKey) {
            return false;
        }
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: function () {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
            aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
        }
        return aKeys;
    }
};

var hour = "00:00 PM";
var minute = "";
var ampm = "";

function hideAll() {
    $("#hour-box").addClass("hide");
    $("#minute-box").addClass("hide");
    $("#am-pm-box").addClass("hide");
}

function updateHour(hour) {
    $("#sleep-time").html(hour + ":00 PM");
}
function updateMinute(minute) {
    $("#sleep-time").html(hour + ":" + minute + " PM");
}
function updateAmPM(ampm) {
    $("#sleep-time").html(hour + ":" + minute + " " + ampm);
}

function showHour() {
    $("#hour-box").toggleClass("hide");
}
function showMinutes() {
    $("#minute-box").toggleClass("hide");
}

function showAmPm() {
    $("#am-pm-box").toggleClass("hide");
}

function stopBlinking() {
    $("#sleep-time").removeClass("blink");
}

function updateWhen() {
    var when = docCookies.getItem("when");
    if (when != null) {
        $("#when-time").html(when.split(" ")[0]);
        $("#when-ampm").html(when.split(" ")[1]);
        $("#sleep-time").html(when);
    }
}


var isTimeToSleep = function() {
    var intervalID = setInterval(function() {
        var now = new Date();
        var hour = now.getHours();
        var min = now.getMinutes();

        var whenH = parseInt(docCookies.getItem("when").split(":")[0], 10);
        var whenM = parseInt((docCookies.getItem("when").split(":")[1]).split(" ")[0], 10);
        var whenAmPm = docCookies.getItem("when").split(" ")[1];

        if (whenAmPm == "PM") {
            whenH = whenH + 12;
        }
        if (whenH == 24) {
            whenH = 0;
        }

        if (hour == whenH && min == whenM) {
            window.clearInterval(intervalID);
            var audio = $("#bed-time-audio")[0]
            audio.play();
            audio.controls = true;
            setTimeout(isTimeToSleep, 1000 * 60 * 5);
        }
    }, 1000);
}

$("#goto-dashboard").on("click", function (event) {
    var when = $("#sleep-time").html();
    console.log(when);
    document.cookie = "when=" + when;
});

$("#hour-select").on('change', function (event) {
    event.preventDefault();
    hour = $(this).val();
    updateHour(hour);
    hideAll();
    showMinutes();
});

$("#minute-select").on('change', function (event) {
    event.preventDefault();
    minute = $(this).val();
    updateMinute(minute);
    hideAll();
    showAmPm();
});

$("#am-pm-select").on('change', function (event) {
    event.preventDefault();
    ampm = $(this).val();
    updateAmPM(ampm);
    hideAll();
    stopBlinking();
});

$("#hour").on('click', function (event) {
    hideAll();
    showHour();
});

$("#minute").on('click', function (event) {
    hideAll();
    showMinutes();
});

$("#ampm").on('click', function (event) {
    hideAll();
    showAmPm();
});

updateWhen();
isTimeToSleep();
