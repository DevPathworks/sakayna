let activeModal = '';

export const setActiveModal = function (modal) {
    activeModal = modal;
}

export const initAutocomplete = function (updateMapAndMarker) {
    const pickUpinput = document.getElementById('pickupSearchInput');    
    const deliveryinput = document.getElementById('deliverySearchInput');    

    let input = activeModal === 'pickupMapModal' ? pickUpinput : deliveryinput;

    const selectedPlaceDiv = document.getElementById('selectedPlace');

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

        if(activeModal === 'pickupMapModal') {
            console.log("pickup-modal working");
        }

        if(activeModal === 'deliveryMapModal') {
            console.log("delivery-modal working");
        }

        // Display selected place details
        const placeDetails = {
            name: place.name,
            address: place.formatted_address,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng()
        };

        // Show selected place details
        selectedPlaceDiv.innerHTML = `
        <div class="selected__place__container">
            <h3>Selected Place:</h3>
            <p><strong>Name:</strong> ${placeDetails.name}</p>
            <p><strong>Address:</strong> ${placeDetails.address}</p>
            <p><strong>Coordinates:</strong> ${placeDetails.latitude}, ${placeDetails.longitude}</p>
            <div>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" style="width:100%;font-size:20px;">Confirm</button>
            </div>
        </div>
        `;
        selectedPlaceDiv.style.display = 'block';

        const pickUpMapId = document.getElementById('pickupMap');
        const deliveryMapId = document.getElementById('deliveryMap');        

        let pickupMap = new google.maps.Map(pickUpMapId, {
            center: { lat: placeDetails.latitude, lng: placeDetails.longitude }, // Tagum City
            zoom: 15,
        });
    
        let pickupMarker = new google.maps.Marker({
            map: pickupMap,
            draggable: true,
            position: { lat: placeDetails.latitude, lng: placeDetails.longitude },
        });

        let deliveryMap = new google.maps.Map(deliveryMapId, {
            center: { lat: placeDetails.latitude, lng: placeDetails.longitude }, // Tagum City
            zoom: 15,
        });
    
        let deliveryMarker = new google.maps.Marker({
            map: deliveryMap,
            draggable: true,
            position: { lat: placeDetails.latitude, lng: placeDetails.longitude },
        });

        // Determine which map and marker to update
        const map = activeModal === 'pickupMapModal' ? pickupMap : deliveryMap;
        const marker = activeModal === 'pickupMapModal' ? pickupMarker : deliveryMarker;

        const inputId = activeModal === 'pickupMapModal' ? 'pickupaddress' : 'deliveryaddress';

        // Update map and marker
        updateMapAndMarker(map, marker, place, inputId);
    });
}

