// Replace with your actual API key
const API_KEY = 'AIzaSyD97nieksSgfEetrVjhJruiiAQufeRrK2Y';

// // Example coordinates (New York to Los Angeles)
// const origin = '40.7128,-74.0060';      // New York coordinates
// const destination = '34.0522,-118.2437'; // Los Angeles coordinates

const deliveryFee = document.getElementById('deliveryFee');

export async function caculateDistance(originlat,originlang, pickupAddress, destlat, destlang, deliveryAddress) {


    const origin1 = { lat: originlat, lng: originlang };
    const origin2 = pickupAddress;
    const destinationA = deliveryAddress;
    const destinationB = { lat: destlat, lng: destlang };

    let mps = {
        origins: [origin1,origin2],
        destinations: [destinationA,destinationB],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        durationInTraffic: true,
        avoidHighways: false,
        avoidTolls: false
    };

    var service = new google.maps.DistanceMatrixService();

    return await service.getDistanceMatrix(mps);
}

function displayDeliveryFee(distance) {
    const baseFare = 5; // Base fare in your currency
    const perKmRate = 2; // Rate per km in your currency
    const fee = baseFare + (perKmRate * distance);
    deliveryFee.innerText = `Delivery Fee: $${fee}`;
}