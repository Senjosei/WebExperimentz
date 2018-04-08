window.onload = function(){

    const text = document.querySelector('#text');
    const main = document.querySelector('#main');
    const video = document.querySelector('video');
    const capture = document.querySelector('#capture');
    const map = document.getElementById("map");
    const tmp = document.getElementById("tmp");

    const canvas = document.createElement('canvas');
    const constraints = {
        audio: false,
        video: {
            facingMode: "environment"
        }
    };
      
    
    function handleSuccess(stream) {
        video.srcObject = stream;
    }
    
    function handleError(error) {
        console.error('Reeeejected!', error);
    }
    
    navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).
    catch(handleError);

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
        GoogleMap.fitBounds(MapCircle.getBounds(),0);
    },function error(){
        console.log("ERROR")
    },{
        enableHighAccuracy: true, 
        maximumAge        : 30000, 
        timeout           : 27000
    });

    capture.addEventListener("click",function(){
        capture.classList.add('hide');
        tmp.classList.remove('hide');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        // Other browsers will fall back to image/png
        tmp.src = canvas.toDataURL('image/webp');

        domtoimage.toPng(main,{

        })
        .then(function(dataUrl){
            var link = document.createElement('a');
            link.download = 'image.png';
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            capture.classList.remove('hide');
            tmp.classList.add('hide');
        })
        // html2canvas(document.body).then(function(canvas) {
        //     document.body.appendChild(canvas);
        // });
    });

}