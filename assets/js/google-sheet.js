// Your API-KEY credentials
const API_KEY = 'AIzaSyBpEyV1Hg8da9U3FEJl-Mfv6iBCrC2ABzo';

// The spreadsheet ID from your Google Sheet URL
// Example: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
const SPREADSHEET_ID = '18q6xlLE6AZzekTi0jBKGcNPwFcyNfTrc7L2sp5LU6bs';

// The range of cells to fetch (e.g., 'Sheet1!A1:D5')
const RANGE = 'Sheet1!A1:D5';

//googlesheet api
const googleSheetEndpoint = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

async function fetchSheetData() {
    try {
        const response = await fetch(googleSheetEndpoint,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.values;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('output').innerHTML = 'Error fetching data';
    }
}

export async function getSheetData() {
    // Extract values from the sheet
    let result = await fetchSheetData();
    let baseFare = 0;
    let kmRate = 0;
    let otherCharges = 0;

    if (result) {
        const baseFareRow = result.find(row => row[0] === 'base_fare');
        const kmRateRow = result.find(row => row[0] === 'km_rate');
        const otherChargesRow = result.find(row => row[0] === 'other_charges');

        if (baseFareRow && baseFareRow[1]) {
            baseFare = baseFareRow[1];
            console.log(`Base Fare: ${baseFare}`);
        } else {
            console.error('Base fare not found in the data');
        }

        if (kmRateRow && kmRateRow[1]) {
            kmRate = kmRateRow[1];
            console.log(`KM Rate: ${kmRate}`);
        } else {
            console.error('KM rate not found in the data');
        }

        if (otherChargesRow && otherChargesRow[1]) {
            otherCharges = otherChargesRow[1];
            console.log(`Other Charges: ${otherCharges}`);
        } else {
            console.error('Other charges not found in the data');
        }
    }

    return { baseFare, kmRate, otherCharges };
}