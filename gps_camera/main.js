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

        /* Binary search for dpi */
        function findFirstPositive(b, a, i, c) {
            c=(d,e)=>e>=d?(a=d+(e-d)/2,0<b(a)&&(a==d||0>=b(a-1))?a:0>=b(a)?c(a+1,e):c(d,a-1)):-1
            for (i = 1; 0 >= b(i);) i *= 2
            return c(i / 2, i)|0
        }
        
        /* 240 on my device */
        var deviceDpi = findFirstPositive(x => matchMedia(`(max-resolution: ${x}dpi)`).matches)
        
        /* 2.5 on my device */
        var pixelRatio = window.devicePixelRatio || 1
        
        /* 96 on my device */
        var canvasDpi = deviceDpi / pixelRatio

        var scaleFactor = deviceDpi / canvasDpi;

        canvas.width = video.videoWidth*scaleFactor;
        canvas.height = video.videoHeight*scaleFactor;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        // ctx.scale(scaleFactor,scaleFactor);
        // Other browsers will fall back to image/png
        tmp.src = canvas.toDataURL('image/png');

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
