import { caculateDistance } from './google-distance.js';
import { getSheetData } from './google-sheet.js';
import { initAutocomplete, setActiveModal, clearModalContents } from './google-places.js';

let UserName = "";
let PhoneNumber = "";
let Email = "";
let PickUp = document.getElementById("pickup");
let PickUpAddress = "";
let DeliveryAddress = "";
let Other = "";
let PickUpNumber = "";
let DeliveryFee = 0;

let pickupLatitude = '';
let pickupLongitude = '';
let deliveryLatitude = '';
let deliveryLongitude = '';

document.getElementById("name").addEventListener("input", function () {
    UserName = this.value;
});

document.getElementById("phone").addEventListener("input", function () {
    PhoneNumber = this.value;
});

document.getElementById("email").addEventListener("input", function () {
    Email = this.value;
});

document.getElementById("pickupaddress").addEventListener("input", function () {
    PickUpAddress = this.value;
    this.disabled = false; // Ensure the field is enabled
});

document.getElementById("deliveryaddress").addEventListener("input", function () {
    DeliveryAddress = this.value;
    this.disabled = false; // Ensure the field is enabled
});

document.getElementById("other").addEventListener("input", function () {
    Other = this.value;
});

document.getElementById("pickupnumber").addEventListener("input", function () {
    PickUpNumber = this.value;
});

function generateOrderNumber() {
    let orderNumber = '';
    for (let i = 0; i < 7; i++) {
        orderNumber += Math.floor(Math.random() * 10);
    }
    return orderNumber;
}

let GorderNumber = generateOrderNumber();

// let pickupAddress = "";
// let deliveryAddress = "";

function updateAddress(inputId, latLng) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, async (results, status) => {
        if (status === 'OK' && results[0]) {
            document.getElementById(inputId).value = results[0].formatted_address;
            if (inputId === 'pickupaddress') {
                pickupLatitude = latLng.lat();
                pickupLongitude = latLng.lng();
                PickUpAddress = results[0].formatted_address;
            } else if (inputId === 'deliveryaddress') {
                deliveryLatitude = latLng.lat();
                deliveryLongitude = latLng.lng();
                DeliveryAddress = results[0].formatted_address;
            }

            console.log(`pickup-lat:  ${pickupLatitude}`);
            console.log(`pickup-lng:  ${pickupLongitude}`);
            console.log(`delv-lat:  ${deliveryLatitude}`);
            console.log(`delv-lng:  ${deliveryLongitude}`);

            if (pickupLatitude && pickupLongitude && deliveryLatitude && deliveryLongitude) {
                caculateDistance(pickupLatitude, pickupLongitude, PickUpAddress, deliveryLatitude, deliveryLongitude, DeliveryAddress).then(async (response) => {
                    if (response.rows && response.rows[0] && response.rows[0].elements && response.rows[0].elements[0]) {
                        const distance = response.rows[0].elements[0].distance.value / 1000; // Convert meters to kilometers
                        console.log(`Distance: ${distance} km`);

                        // Fetch the fare rates from Google Sheets
                        const { baseFare, kmRate, otherCharges } = await getSheetData();

                        // Calculate the delivery fee
                        const deliveryFee = parseFloat(baseFare) + (parseFloat(kmRate) * distance) + parseFloat(otherCharges);
                        console.log(`Delivery Fee: ${deliveryFee}`);

                        // Display the delivery fee
                        displayDeliveryFee(deliveryFee);
                        
                    } else {
                        console.error('Invalid response format', response);
                    }
                });
            }
        } else {
            alert('Geocoder failed: ' + status);
        }
    });
}

function displayDeliveryFee(fee) {
    DeliveryFee = fee;
    document.getElementById('deliveryFee').innerText = `Delivery Fee: Php ${fee.toFixed(2)}`;
}

function CreateOrder() {
    const headers = {
        'Authorization': 'Basic wLUBnzrJHr.vqKT1iBdmTr1gedfKe8w',
        'Content-Type': 'application/json'
    };

    const data = {
        orderNumber: GorderNumber,
        customerName: UserName,
        customerAddress: DeliveryAddress,
        customerEmail: Email ? Email : "example@gmail.com",
        customerPhoneNumber: `${PhoneNumber}`,
        restaurantName: PickUp.value,
        restaurantAddress: PickUpAddress,
        restaurantPhoneNumber: PickUpNumber,
        pickupLatitude: pickupLatitude,
        pickupLongitude: pickupLongitude,
        deliveryInstruction: Other,
        deliveryLatitude: deliveryLatitude,
        deliveryLongitude: deliveryLongitude,
        deliveryFee: DeliveryFee
    };

    console.log(data);

    fetch('https://api.shipday.com/orders', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(responseData => {
            console.log('Success:', responseData);
            document.getElementById("order-no").innerText = GorderNumber;
            var myModal = new bootstrap.Modal(document.getElementById('exampleModalCenter'), {
                keyboard: false
            });
            myModal.show();
            document.getElementById("deliveryForm").reset();
            GorderNumber = generateOrderNumber(); // Generate a new order number for the next order
            UserName = "";
            PhoneNumber = "";
            Email = "";
            PickUpAddress = "";
            DeliveryAddress = "";
            Other = "";
            PickUpNumber = "";
            clearModalContents();
            document.getElementById('deliveryFee').innerText = `Delivery Fee: (Php: 0.00)`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

document.getElementById("submit").addEventListener("click", function (event) {
    console.log(pickupLatitude);
    console.log(pickupLongitude);
    console.log(deliveryLatitude);
    console.log(deliveryLongitude);

    event.preventDefault(); // Prevent the default form submission
    if (
        document.getElementById("name").value === "" ||
        document.getElementById("phone").value === "" ||
        document.getElementById("pickupaddress").value === "" ||
        document.getElementById("deliveryaddress").value === ""
    ) {
        alert("Please fill all required fields");
    } else {
        CreateOrder();
    }
});

// Google Maps integration
let pickupMap, deliveryMap;
let pickupMarker, deliveryMarker;

function updateMapAndMarker(map, marker, place, inputId) {
    if (!place.geometry) {
        window.alert("No details available for input: '" + place.name + "'");
        return;
    }

    // Update map center and marker position
    map.setCenter(place.geometry.location);
    marker.setPosition(place.geometry.location);

    // // Update address input field
    // const inputId = map === pickupMap ? 'pickupaddress' : 'deliveryaddress';
    updateAddress(inputId, place.geometry.location);
}

window.initMap = function () {
    initAutocomplete(updateMapAndMarker);
    // Initialize Pickup Map
    pickupMap = new google.maps.Map(document.getElementById('pickupMap'), {
        center: { lat: 7.4472, lng: 125.8094 }, // Tagum City
        zoom: 12,
    });

    pickupMarker = new google.maps.Marker({
        map: pickupMap,
        draggable: true,
        position: { lat: 7.4472, lng: 125.8094 },
    });

    google.maps.event.addListener(pickupMap, 'click', (event) => {
        pickupMarker.setPosition(event.latLng);
        updateAddress('pickupaddress', event.latLng);
    });

    // Initialize Delivery Map
    deliveryMap = new google.maps.Map(document.getElementById('deliveryMap'), {
        center: { lat: 7.4472, lng: 125.8094 }, // Tagum City
        zoom: 12,
    });

    deliveryMarker = new google.maps.Marker({
        map: deliveryMap,
        draggable: true,
        position: { lat: 7.4472, lng: 125.8094 },
    });

    google.maps.event.addListener(deliveryMap, 'click', (event) => {
        deliveryMarker.setPosition(event.latLng);
        updateAddress('deliveryaddress', event.latLng);
    });
}

function locateUser(map, marker) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map.setCenter(userLocation);
                marker.setPosition(userLocation);
            },
            () => {
                alert("Failed to retrieve your location. Please check your browser permissions.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function resetMap() {
     // Initialize Pickup Map
     pickupMap = new google.maps.Map(document.getElementById('pickupMap'), {
        center: { lat: 7.4472, lng: 125.8094 }, // Tagum City
        zoom: 12,
    });

    pickupMarker = new google.maps.Marker({
        map: pickupMap,
        draggable: true,
        position: { lat: 7.4472, lng: 125.8094 },
    });

    google.maps.event.addListener(pickupMap, 'click', (event) => {
        pickupMarker.setPosition(event.latLng);
        updateAddress('pickupaddress', event.latLng);
    });

    // Initialize Delivery Map
    deliveryMap = new google.maps.Map(document.getElementById('deliveryMap'), {
        center: { lat: 7.4472, lng: 125.8094 }, // Tagum City
        zoom: 12,
    });

    deliveryMarker = new google.maps.Marker({
        map: deliveryMap,
        draggable: true,
        position: { lat: 7.4472, lng: 125.8094 },
    });

    google.maps.event.addListener(deliveryMap, 'click', (event) => {
        deliveryMarker.setPosition(event.latLng);
        updateAddress('deliveryaddress', event.latLng);
    });

}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('viewPickupMap').addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('pickupMapModal'));
        modal.show();
        setTimeout(() => {
            google.maps.event.trigger(pickupMap, 'resize');
            initAutocomplete(updateMapAndMarker);
        }, 300);
    });

    document.getElementById('viewDeliveryMap').addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('deliveryMapModal'));
        modal.show();
        setTimeout(() => {
            google.maps.event.trigger(deliveryMap, 'resize');
            initAutocomplete(updateMapAndMarker);
        }, 300);
    });

    document.getElementById('pickupLocateMe').addEventListener('click', () => {
        locateUser(pickupMap, pickupMarker);
        initAutocomplete(updateMapAndMarker);
    });

    document.getElementById('deliveryLocateMe').addEventListener('click', () => {
        locateUser(deliveryMap, deliveryMarker);
        initAutocomplete(updateMapAndMarker);
    });

    const pickupModal = document.getElementById('pickupMapModal');
    const deliveryModal = document.getElementById('deliveryMapModal');

    // Event listener for Pickup Modal
    pickupModal.addEventListener('show.bs.modal', function() {
        console.log("Pickup modal opened");
        setActiveModal('pickupMapModal');
    });

    pickupModal.addEventListener('hide.bs.modal', function() {
        console.log("Pickup modal closed");
        setActiveModal('');        
        resetMap(); // Reset the map when the modal is closed
    });

    // Event listener for Delivery Modal
    deliveryModal.addEventListener('show.bs.modal', function() {
        console.log("Delivery modal opened");
        setActiveModal('deliveryMapModal');
    });

    deliveryModal.addEventListener('hide.bs.modal', function() {
        console.log("Delivery modal closed");
        setActiveModal('');        
        resetMap(); // Reset the map when the modal is closed
    });
});