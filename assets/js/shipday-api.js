
export const fetchCarriers = async () => {
    const url = 'https://api.shipday.com/carriers';
    const headers = {
        'Authorization': 'Basic wLUBnzrJHr.vqKT1iBdmTr1gedfKe8w',
        'Content-Type': 'application/json'
    };

    try {
        const response = await fetch(url, { method: 'GET', headers: headers });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching carriers:', error);
        throw error;
    }
}

export const insertOrders = async (orders) => {
    const headers = {
        'Authorization': 'Basic wLUBnzrJHr.vqKT1iBdmTr1gedfKe8w',
        'Content-Type': 'application/json'
    };
    try {
        const response = await fetch('https://api.shipday.com/orders', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(orders)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error inserting orders:', error);
        throw error;
    }
}