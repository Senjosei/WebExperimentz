$(function(){
    alert('Hello');

    var mapProp = {
        zoom: 10,
        center: new google.maps.LatLng(0,0)
    };

    var map;

    var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(0,0),
                    title:"Test!"
                });

    function geo_success(position) {
        marker.setPosition(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
        console.log('test');
    }

    function geo_error() {
        alert("Sorry, no position available.");
    }

    var geo_options = {
        enableHighAccuracy: true, 
        maximumAge        : 30000, 
        timeout           : 27000
    };

    var wpid

    navigator.geolocation.getCurrentPosition(function(position) {
        mapProp.center = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
        wpid = navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
        marker.setMap(map);
    });



    function MainViewModel(){
        var self = this;
        self.name = '';
        self.id = '';
        self.test = function(){
            alert('name = ' + self.name + ' id = ' + self.id);
            return true;
        };
        self.entries = [
            {no: 1, name: 'sdasdsa', lat: '-12312312', long: '123123123', note: 'notenotenote', image: 'sdasdsdasd'},
            {no: 2, name: 'sdasdsa', lat: '-12312312', long: '123123123', note: 'notenotenote', image: 'sdasdsdasd'},
            {no: 3, name: 'sdasdsa', lat: '-12312312', long: '123123123', note: 'notenotenote', image: 'sdasdsdasd'},
            {no: 4, name: 'sdasdsa', lat: '-12312312', long: '123123123', note: 'notenotenote', image: 'sdasdsdasd'},
            {no: 5, name: 'sdasdsa', lat: '-12312312', long: '123123123', note: 'notenotenote', image: 'sdasdsdasd'},
            {no: 6, name: 'sdasdsa', lat: '-12312312', long: '123123123', note: 'notenotenote', image: 'sdasdsdasd'},
            {no: 7, name: 'sdasdsa', lat: '-12312312', long: '123123123', note: 'notenotenote', image: 'sdasdsdasd'},
            {no: 8, name: 'sdasdsa', lat: '-12312312', long: '123123123', note: 'notenotenote', image: 'sdasdsdasd'},
            {no: 9, name: 'sdasdsa', lat: '-12312312', long: '123123123', note: 'notenotenote', image: 'sdasdsdasd'},
        ];
        self.goEntry = function(){
            alert(this.no + ' ' + this.name + ' ' + this.lat + ' ' + this.long + ' ' + this.note + ' ' );
        };

        ko.track(this);
    }
    tmp = new MainViewModel();
    ko.applyBindings(tmp);
});