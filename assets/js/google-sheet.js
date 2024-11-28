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
        displayData(data.values);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('output').innerHTML = 'Error fetching data';
    }
}

function displayData(data) {
    const output = document.getElementById('output');
    if (data && data.length > 0) {
        const html = data.map(row => row.join(', ')).join('<br>');
        output.innerHTML = html;
    } else {
        output.innerHTML = 'No data found.';
    }
}