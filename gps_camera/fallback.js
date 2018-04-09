window.onload = function(){
    var capturing = false;

    const text = document.querySelector('#text');
    const main = document.querySelector('#main');
    const capture = document.querySelector('#capture');
    const map = document.getElementById("map");
    const tmp = document.getElementById("tmp");
    const pict = document.getElementById("pict");

    MapProp = {
        zoom: 18,
        center: new google.maps.LatLng(0,0),
        streetViewControl: false,
        disableDefaultUI: true
    };
    MapMarker = new google.maps.Marker({
        position: new google.maps.LatLng(0,0),
        title:"Test!"
    });
    MapCircle = new google.maps.Circle({
        center: new google.maps.LatLng(0,0),
        strokeColor: '#2196F3',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#2196F3',
        fillOpacity: 0.35,
        radius: 0
    });
    GoogleMap = new google.maps.Map(map,MapProp);
    MapMarker.setMap(GoogleMap);
    MapCircle.setMap(GoogleMap);

    navigator.geolocation.watchPosition(function(position){
        if(capturing)return true;
        text.textContent = 
        "Latitude  = "+position.coords.latitude+"\n"+
        "Longitude = "+position.coords.longitude+"\n"+
        "Accuracy  = "+position.coords.accuracy+" Meters"+"\n"+
        "Date&Time = "+new Date(position.timestamp).toString();
        console.log(position);
        var center = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        GoogleMap.panTo(center);
        MapMarker.setPosition(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
        MapCircle.setCenter(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
        MapCircle.setRadius(position.coords.accuracy);
    },function error(){
        console.log("ERROR")
    },{
        enableHighAccuracy: true, 
        maximumAge        : 30000, 
        timeout           : 27000
    });

    pict.addEventListener("click", function(){
        document.getElementById("add_pict").click()
        document.getElementById("add_pict").onchange = function(){
            var reader = new FileReader();
            reader.readAsDataURL(this.files[0]);
            reader.onload = function(){
                tmp.src = reader.result
            }
            tmp.classList.remove('hide');
        }
    })

    capture.addEventListener("click",function(){
        capturing = true;
        capture.classList.add('hide');
        pict.classList.add('hide');
        domtoimage.toPng(main,{

        })
        .then(function(dataUrl){
            alert(dataUrl);
            var link = document.createElement('a');
            link.download = 'image.png';
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            capture.classList.remove('hide');
            pict.classList.remove('hide');
            capturing = true;
        })
        .catch(function(error){
            alert(error.toString());
        })
        // html2canvas(document.body).then(function(canvas) {
        //     document.body.appendChild(canvas);
        // });
    });

}
