let activeModal = '';

let pickupName = '';
let pickupAddress = '';
let pickupLatitude = '';
let pickupLongitude = '';

let deliveryName = '';
let deliveryAddress = '';
let deliveryLatitude = '';
let deliveryLongitude = '';

export const setActiveModal = function (modal) {
    activeModal = modal;
}

export const initAutocomplete = function (updateMapAndMarker) {
    const pickUpinput = document.getElementById('pickupSearchInput');    
    const deliveryinput = document.getElementById('deliverySearchInput');    

    let input = activeModal === 'pickupMapModal' ? pickUpinput : deliveryinput;

    const pickupSelectedPlaceDiv = document.getElementById('pickupSelectedPlace');
    const deliveirySelectedPlaceDiv = document.getElementById('deliverySelectedPlace');

    // Create the autocomplete object
    const autocomplete = new google.maps.places.Autocomplete(input, {
        types: ['establishment', 'geocode'],
        fields: ['place_id', 'geometry', 'formatted_address', 'name']
    });

    // Listen for place selection
    autocomplete.addListener('place_changed', function() {
        const place = autocomplete.getPlace();
        
        if (!place.geometry) {
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        // Display selected place details
        const placeDetails = {
            name: place.name,
            address: place.formatted_address,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng()
        };

      
        

        const pickUpMapId = document.getElementById('pickupMap');
        const deliveryMapId = document.getElementById('deliveryMap');        

        let pickupLat = '';
        let pickupLng = '';
        let deliveryLat = '';
        let deliveryLng = '';

        if (activeModal === 'pickupMapModal') {
            pickupLat = placeDetails.latitude;
            pickupLng = placeDetails.longitude;
        }

        if (activeModal === 'deliveryMapModal') {
            deliveryLat = placeDetails.latitude;
            deliveryLng = placeDetails.longitude;
        }

        let pickupMap = new google.maps.Map(pickUpMapId, {
            center: { lat: pickupLat, lng: pickupLng }, // Tagum City
            zoom: 15,
        });
    
        let pickupMarker = new google.maps.Marker({
            map: pickupMap,
            draggable: true,
            position: { lat: pickupLat, lng: pickupLng },
        });

        let deliveryMap = new google.maps.Map(deliveryMapId, {
            center: { lat: deliveryLat, lng: deliveryLng }, // Tagum City
            zoom: 15,
        });
    
        let deliveryMarker = new google.maps.Marker({
            map: deliveryMap,
            draggable: true,
            position: { lat: deliveryLat, lng: deliveryLat },
        });

        // Determine which map and marker to update
        const map = activeModal === 'pickupMapModal' ? pickupMap : deliveryMap;
        const marker = activeModal === 'pickupMapModal' ? pickupMarker : deliveryMarker;

        const inputId = activeModal === 'pickupMapModal' ? 'pickupaddress' : 'deliveryaddress';

        // Update map and marker
        updateMapAndMarker(map, marker, place, inputId);
    });
}

export const clearModalContents = function () {
    const pickupSelectedPlaceDiv = document.getElementById('pickupSelectedPlace');
    const deliverySelectedPlaceDiv = document.getElementById('deliverySelectedPlace');
    const pickupSearchInput = document.getElementById('pickupSearchInput');
    const deliverySearchInput = document.getElementById('deliverySearchInput');

    if (pickupSelectedPlaceDiv) {
        pickupSelectedPlaceDiv.innerHTML = '';
    }

    if (deliverySelectedPlaceDiv) {
        deliverySelectedPlaceDiv.innerHTML = '';
    }

    if (pickupSearchInput) {
        pickupSearchInput.value = '';
    }

    if (deliverySearchInput) {
        deliverySearchInput.value = '';
    }
}
