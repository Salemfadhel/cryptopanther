async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            alert(`Connected: ${accounts[0]}`);
        } catch (error) {
            console.error("Error connecting wallet:", error);
            alert("Failed to connect wallet.");
        }
    } else {
        alert("Please install MetaMask or another Ethereum wallet.");
    }
}

// Function to fetch live price data
async function fetchPrice() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=your-token-id&vs_currencies=usdt');
        const data = await response.json();
        const price = data['your-token-id'].usdt; // Replace 'your-token-id' with your actual token ID
        document.getElementById('current-price').innerText = price;

        // Update to amount when from amount is changed
        document.getElementById('from-amount').addEventListener('input', function() {
            const amount = parseFloat(this.value) || 0;
            const toAmount = (amount * price).toFixed(2); // Calculate USDT amount
            document.getElementById('to-amount').value = toAmount;
        });

    } catch (error) {
        console.error("Error fetching price data:", error);
        document.getElementById('current-price').innerText = "Error";
    }
}

// Fetch price on load
window.onload = fetchPrice;
