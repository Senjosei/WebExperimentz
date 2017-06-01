$(function(){
    //TODO add var infront
    App = {
        Init: function(){
            var main = this
            $(document).on("pagebeforeshow","#add",function(){ // When entering pagetwo
                // alert("pageadd is about to be shown");
            });
            $(document).on("pageshow","#add",function(){ // When entering pageadd
                if(main.Maps.Map == undefined ){
                    main.Maps.SetupOnce(main);
                } else {
                    main.Maps.Resume(main);
                }
            });
            $(document).on("pagebeforehide","#add",function(){ // When leaving pagetwo
                main.Maps.Stop();
            });
            $(document).on("pagehide","#add",function(){ // When leaving pagetwo
                // alert("pageadd is now hidden");
            });
            main.MVVM = new (function(main){ // MVVM Init Constructor
                var self = this;

                self.username = '';
                self.id = '';

                self.locationName = '';
                self.curlat = 0;
                self.curlong = 0;
                self.curacc = 0;
                self.locationPict = '';

                self.tempEntry = {
                    name: 'None',
                    lat: 0,
                    long: 0,
                    image: ''
                };

                self.sendEmail = '';

                self.entries = [];
                self.goEntry = function(line){
                    self.tempEntry = line;
                    window.location.href = '#viewEntry';
                    console.log(line);
                    // alert(this.no + ' ' + this.name + ' ' + this.lat + ' ' + this.long + ' ' + this.note + ' ' );
                };

                self.getStaticMap = function(){
                    return "https://maps.googleapis.com/maps/api/staticmap?center=" + self.tempEntry.lat + "," + self.tempEntry.long + "&zoom=19&size=400x400&markers=color:red%7C" + self.tempEntry.lat + "," + self.tempEntry.long + "&sensor=false";
                };

                self.getPict = function(){
                    $('#add_pict').click();
                    $('#add_pict').change(function(){
                        var reader = new FileReader();
                        reader.readAsDataURL(this.files[0]);
                        reader.onload = function(){
                            $('#location_pict').attr('src', reader.result);
                            self.locationPict = reader.result;
                        }
                    });
                };

                self.sendEntries = function(){
                    console.log('here');
                    var head = "?subject=Data Entry ID: '" + self.id + "' Name: '" + self.username + "'&body="; 
                    var body = "Name,Latitute,Longditude,Image\n";
                    for (var i = 0; i < self.entries.length; i++){
                        body += self.entries[i].name + ',';
                        body += self.entries[i].lat + ',';
                        body += self.entries[i].long + ',';
                        body += self.entries[i].image + '\n';
                    }
                    window.location.href = 'mailto:' + self.sendEmail + head + encodeURIComponent(body);
                };

                self.addEntry = function(){
                    self.entries.unshift({
                        name: self.locationName,
                        lat: self.curlat,
                        long: self.curlong,
                        note: 'none',
                        image: self.locationPict
                    });
                    return true;
                };
                ko.track(this);
            })(main);
        },
        MVVM: {}, //Initialized in Init()
        Maps: {
            WPID: {},
            geo_options: {
                enableHighAccuracy: true, 
                maximumAge        : 30000, 
                timeout           : 27000
            },
            geo_error: function(){
                alert("Sorry, no position available.");
            },
            MarkerLat: 0,
            MarkerLong: 0,
            MarkerAcc: 0,
            MapProp: {
                zoom: 19,
                center: new google.maps.LatLng(0,0),
                streetViewControl: false
            },
            MapMarker: new google.maps.Marker({
                position: new google.maps.LatLng(0,0),
                title:"Test!"
            }),
            MapCircle: new google.maps.Circle({
                center: new google.maps.LatLng(0,0),
                strokeColor: '#2196F3',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#2196F3',
                fillOpacity: 0.35,
                radius: 0
            }),
            SetupOnce: function(main){ //TODO Refactor
                var self = this;
                if(self.Map != undefined ){return true}
                navigator.geolocation.getCurrentPosition(function(position) {
                    self.MapProp.center = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                    self.Map = new google.maps.Map(document.getElementById("googleMap"),self.MapProp);
                    self.WPID = navigator.geolocation.watchPosition(function(){ //TODO move this
                        if((main.MVVM.curlat != position.coords.latitude) || (main.MVVM.curlong != position.coords.longitude)){
                            console.log('ming');
                            self.Map.panTo(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
                        }
                        self.MapMarker.setPosition(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
                        self.MapCircle.setCenter(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
                        self.MapCircle.setRadius(position.coords.accuracy);
                        self.MarkerLat = position.coords.latitude;
                        self.MarkerLong = position.coords.longitude;
                        self.MarkerAcc = position.coords.accuracy;
                        main.MVVM.curlat = self.MarkerLat;
                        main.MVVM.curlong = self.MarkerLong;
                        main.MVVM.curacc = self.MarkerAcc;
                        //TODO stop watch position if accurate enuf
                    }, self.geo_error, self.geo_options);
                    self.MapMarker.setMap(self.Map);
                    self.MapCircle.setMap(self.Map);
                }, self.geo_error);       
            },
            Resume: function(main){ //TODO Refactor
                var self = this;
                self.WPID = navigator.geolocation.watchPosition(function(position){ //TODO move this
                    if((main.MVVM.curlat != position.coords.latitude) || (main.MVVM.curlong != position.coords.longitude)){
                        console.log('ming');
                        self.Map.panTo(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
                    }
                    self.MapMarker.setPosition(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
                    self.MapCircle.setCenter(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
                    self.MapCircle.setRadius(position.coords.accuracy);
                    self.MarkerLat = position.coords.latitude;
                    self.MarkerLong = position.coords.longitude;
                    self.MarkerAcc = position.coords.accuracy;
                    main.MVVM.curlat = self.MarkerLat;
                    main.MVVM.curlong = self.MarkerLong;
                    main.MVVM.curacc = self.MarkerAcc;
                    //TODO stop watch position if accurate enuf
                }, self.geo_error, self.geo_options);
            },
            Stop: function(){
                navigator.geolocation.clearWatch(this.WPID);
            }
        },
        Functions:{

        }
    };
    App.Init();
    App.MVVM.inited = true;
    ko.applyBindings(App.MVVM);    
});