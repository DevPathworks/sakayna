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