var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

var PavlovMachine = function() {
    var count = 0;
    var currentState = this.getFirstState();

    this.getFirstState = function() {
        var alreadyConfigured = false;
        if (alreadyConfigured) {
            return new ConfigureTimeState();
        } else {
            return new DashboardState();
        }
    }

    this.change = function (state) {};

    this.start = function () {
        currentState.go();
    };
}

var ConfigureTimeState = function() {
    this.templateID = "configure-time";

    this.go = function() {

    }
}

BedTime = function() {
    this.hour = "00";
    this.minutes = "00";
    this.amPm = "AM";

    this.setHour = function(hour) {
        this.hour = hour;
    }
    this.setMinutes = function(minutes) {
        this.minutes = minutes;
    }
    this.setAmPm = function(amPm) {
        this.amPm = amPm;
    }
    this.when = function() {
        return this.hour + ":" + this.minutes + " " + this.amPm;
    }
}
