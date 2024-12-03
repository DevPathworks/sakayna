let activeModal = '';

let pickupName = '';
let pickupAddress = '';
let pickupLatitude = '';
let pickupLongitude = '';

let deliveryName = '';
let deliveryAddress = '';
let deliveryLatitude = '';
let deliveryLongitude = '';

const pickupSelectedPlaceDiv = document.getElementById('pickupSelectedPlace');
const deliveirySelectedPlaceDiv = document.getElementById('deliverySelectedPlace');

const pickUpinput = document.getElementById('pickupSearchInput');    
const deliveryinput = document.getElementById('deliverySearchInput');  

export const setActiveModal = function (modal) {
    activeModal = modal;
}

export const initAutocomplete = function (updateMapAndMarker) {
    let input = activeModal === 'pickupMapModal' ? pickUpinput : deliveryinput;

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
        const placeDetails = {
            name: place.name,
            address: place.formatted_address,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng()
        };
        setPlaceDetails(placeDetails);
        // Display selected place details
        // const placeDetails = {
        //     name: place.name,
        //     address: place.formatted_address,
        //     latitude: place.geometry.location.lat(),
        //     longitude: place.geometry.location.lng()
        // };

        // if (activeModal === 'pickupMapModal') {
        //     pickupName = placeDetails.name;
        //     pickupAddress = placeDetails.address;
        //     pickupLatitude = placeDetails.latitude;
        //     pickupLongitude = placeDetails.longitude;

        //     // Show selected place details
        //     pickupSelectedPlaceDiv.innerHTML = `
        //     <div class="selected__place__container">
        //         <h4>Selected Place:</h4>
        //         <p><strong>Name:</strong> ${pickupName}</p>
        //         <p><strong>Address:</strong> ${pickupAddress}</p>
        //         <p><strong>Coordinates:</strong> ${pickupLatitude}, ${pickupLongitude}</p>
        //         <div>
        //             <button type="button" class="btn btn-primary" data-bs-dismiss="modal" style="width:100%;font-size:20px;">Confirm</button>
        //         </div>
        //     </div>
        //     `;
        //     pickupSelectedPlaceDiv.style.display = 'block';
        // }

        // if (activeModal === 'deliveryMapModal') {
        //     deliveryName = placeDetails.name;
        //     deliveryAddress = placeDetails.address;
        //     deliveryLatitude = placeDetails.latitude;
        //     deliveryLongitude = placeDetails.longitude;

        //     // Show selected place details
        //     deliveirySelectedPlaceDiv.innerHTML = `
        //     <div class="selected__place__container">
        //         <h4>Selected Place:</h4>
        //         <p><strong>Name:</strong> ${deliveryName}</p>
        //         <p><strong>Address:</strong> ${deliveryAddress}</p>
        //         <p><strong>Coordinates:</strong> ${deliveryLatitude}, ${deliveryLongitude}</p>
        //         <div>
        //             <button type="button" class="btn btn-primary" data-bs-dismiss="modal" style="width:100%;font-size:20px;">Confirm</button>
        //         </div>
        //     </div>
        //     `;
        //     deliveirySelectedPlaceDiv.style.display = 'block';
        // }    
        

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

export const setPlaceDetails = function (placeDetails) {
     // Display selected place details
    if (activeModal === 'pickupMapModal') {
        pickupName = placeDetails.name;
        pickupAddress = placeDetails.address;
        pickupLatitude = placeDetails.latitude;
        pickupLongitude = placeDetails.longitude;

        // Show selected place details
        pickupSelectedPlaceDiv.innerHTML = `
        <div class="selected__place__container">
            <h4>Selected Place:</h4>
            <p><strong>Name:</strong> ${pickupName}</p>
            <p><strong>Address:</strong> ${pickupAddress}</p>
            <p><strong>Coordinates:</strong> ${pickupLatitude}, ${pickupLongitude}</p>
            <div>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" style="width:100%;font-size:20px;">Confirm</button>
            </div>
        </div>
        `;
        pickupSelectedPlaceDiv.style.display = 'block';
    }

    if (activeModal === 'deliveryMapModal') {
        deliveryName = placeDetails.name;
        deliveryAddress = placeDetails.address;
        deliveryLatitude = placeDetails.latitude;
        deliveryLongitude = placeDetails.longitude;

        // Show selected place details
        deliveirySelectedPlaceDiv.innerHTML = `
        <div class="selected__place__container">
            <h4>Selected Place:</h4>
            <p><strong>Name:</strong> ${deliveryName}</p>
            <p><strong>Address:</strong> ${deliveryAddress}</p>
            <p><strong>Coordinates:</strong> ${deliveryLatitude}, ${deliveryLongitude}</p>
            <div>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" style="width:100%;font-size:20px;">Confirm</button>
            </div>
        </div>
        `;
        deliveirySelectedPlaceDiv.style.display = 'block';
    }
}

export const getPlaceDetails = function (placeId) {
    return new Promise((resolve, reject) => {
        const service = new google.maps.places.PlacesService(document.createElement('div'));
        service.getDetails({ placeId: placeId }, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                resolve(place);
            } else {
                reject(status);
            }
        });
    });
}