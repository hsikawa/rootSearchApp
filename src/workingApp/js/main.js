var routes=[];
var routeNum=0;
var swiper;
var map;
var mapRender;


window.onload=function(){
    swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        slidesPerView: 1,
        paginationClickable: true,
        spaceBetween: 30,
        observer: true
    });

}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
	    zoom: 15
    });

    mapRender = new google.maps.DirectionsRenderer({ // ルート描画オブジェクト
        map: map, // 描画先の地図
	    preserveViewport: true, // 描画後に中心点をずらさない});
    });
    if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(function(position) {

	        var pos = new google.maps.LatLng({
		        lat: position.coords.latitude,
		        lng: position.coords.longitude
	        });
	        map.setCenter(pos);
	        var marker = new google.maps.Marker({
		        position: pos,
		        title: '現在地'
	        });
	        marker.setMap(map);
	        var lan = 500;
	        

	        var mapDirection= new google.maps.DirectionsService(); // ルート検索オブジェクト
	       
            
            for (var k = 0; k < 4; k++){
                var request = {
		            origin: pos, // 出発地
		            destination: pos, // 目的地
		            waypoints: [],
		            travelMode: google.maps.DirectionsTravelMode.WALKING, // 交通手段(歩行。DRIVINGの場合は車)
	            };
                var n = 1;
		        for (var i = 0; i <= 180; i += 45){
		            var latlng = google.maps.geometry.spherical.computeOffset(pos, lan * n, i + k * 90);
		            request.waypoints.push({location:latlng});
		            
	            }
	            // ルート検索
	            mapDirection.route(request, function(result, status){
		            // OKの場合ルート描画
		            if (status == google.maps.DirectionsStatus.OK) {
                        addSwaiper(SetDistance(result), result)
		            }
		            console.log(result);
	            });
            }
            
	    }, function() {
	        handleLocationError(true, infoWindow, map.getCenter());
	    });
    } else {
	    // Browser doesn't support Geolocation
	    handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
}

function SetDistance(routeData) { 
    var distance = GetDistanceKm(routeData.routes[0].legs); 
    if (distance > 100) { 
        distance = distance.toFixed(0); 
    } 
    else if (distance > 10) { 
        distance = distance.toFixed(1); 
    } 
    console.log(distance);
    return distance;
} 
 
function GetDistanceKm(legs) { 
    var journey = 0; 
    for (var i in legs) {
        journey += legs[i].distance.value; 
    } 
    return journey / 1000; 
}

function addSwaiper(Distance, route) {
    var routeName = 'route' + routeNum;
    routeNum++;
    routes[routeName] = route;
    $('#routes').append('<div id=' + routeName +  ' class="swiper-slide">' + routeName +' <br> distance: ' + Distance +' </div>');
    $('#'+routeName).click(function(){
        routeRender(routeName);
    });
    
}

function routeRender(num){
    mapRender.setDirections(routes[num]);
}
