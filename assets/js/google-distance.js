// Replace with your actual API key
const API_KEY = 'AIzaSyD97nieksSgfEetrVjhJruiiAQufeRrK2Y';

// // Example coordinates (New York to Los Angeles)
// const origin = '40.7128,-74.0060';      // New York coordinates
// const destination = '34.0522,-118.2437'; // Los Angeles coordinates

const deliveryFee = document.getElementById('deliveryFee');

async function caculateDistance(origin, destination) {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${API_KEY}`;
    await fetch(url)
        .then(response => response.json())
        .then(data => {
            const distance = data.rows[0].elements[0].distance.text;
            const duration = data.rows[0].elements[0].duration.text;
            const distanceValue = parseFloat(distance.replace(' km', '').replace(',', ''));
            console.log(`Distance: ${distance}`);
            console.log(`Duration: ${duration}`);
            displayDeliveryFee(distanceValue)
        })
        .catch(error => console.error('Error:', error));
}

function displayDeliveryFee(distance) {
    const baseFare = 5; // Base fare in your currency
    const perKmRate = 2; // Rate per km in your currency
    const fee = baseFare + (perKmRate * distance);
    deliveryFee.innerText = `Delivery Fee: $${fee.toFixed(2)}`;
}