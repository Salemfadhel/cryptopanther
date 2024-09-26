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
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=usd-coin,matic-network,chr&vs_currencies=usdt');
        const data = await response.json();
        
        const usdtPrice = data['usd-coin'].usdt; // USDT
        const maticPrice = data['matic-network'].usdt; // MATIC (used for POL as well)
        const chrPrice = data['chr'].usdt; // CHR
        
        // Update price display
        document.getElementById('current-price').innerText = `USDT: ${usdtPrice}, MATIC: ${maticPrice}, CHR: ${chrPrice}`;

        // Update to amount when from amount is changed
        document.getElementById('from-amount').addEventListener('input', function() {
            const amount = parseFloat(this.value) || 0;
            const fromToken = document.getElementById('from-token').value;
            let toAmount;

            if (fromToken === 'usdt') {
                toAmount = (amount * usdtPrice).toFixed(2);
            } else if (fromToken === 'pol' || fromToken === 'matic') {
                toAmount = (amount * maticPrice).toFixed(2);
            } else if (fromToken === 'chr') {
                toAmount = (amount * chrPrice).toFixed(2);
            }

            document.getElementById('to-amount').value = toAmount;
        });

    } catch (error) {
        console.error("Error fetching price data:", error);
        document.getElementById('current-price').innerText = "Error";
    }
}

// Prevent same token selection in From and To
document.getElementById('from-token').addEventListener('change', function() {
    const fromValue = this.value;
    const toTokenSelect = document.getElementById('to-token');

    // Remove selected value from To token
    for (let i = 0; i < toTokenSelect.options.length; i++) {
        if (toTokenSelect.options[i].value === fromValue) {
            toTokenSelect.options[i].disabled = true;
        } else {
            toTokenSelect.options[i].disabled = false;
        }
    }
});

document.getElementById('to-token').addEventListener('change', function() {
    const toValue = this.value;
    const fromTokenSelect = document.getElementById('from-token');

    // Remove selected value from From token
    for (let i = 0; i < fromTokenSelect.options.length; i++) {
        if (fromTokenSelect.options[i].value === toValue) {
            fromTokenSelect.options[i].disabled = true;
        } else {
            fromTokenSelect.options[i].disabled = false;
        }
    }
});

// Fetch price on load
window.onload = fetchPrice;
