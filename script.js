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
let usdtPrice = 0;
let maticPrice = 0; // Use for POL as well
let chrPrice = 0;

async function fetchPrice() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=usd-coin,matic-network,chr&vs_currencies=usdt');
        const data = await response.json();
        
        usdtPrice = data['usd-coin'].usdt; // USDT
        maticPrice = data['matic-network'].usdt; // MATIC (POL)
        chrPrice = data['chr'].usdt; // CHR
        
        document.getElementById('current-price').innerText = `USDT: ${usdtPrice}, MATIC: ${maticPrice}, CHR: ${chrPrice}`;

        // Update to amount when from amount is changed
        updateToAmount();
    } catch (error) {
        console.error("Error fetching price data:", error);
        document.getElementById('current-price').innerText = "Error";
    }
}

// Function to update to amount based on from amount and selected tokens
function updateToAmount() {
    const fromAmount = parseFloat(document.getElementById('from-amount').value) || 0;
    const fromToken = document.getElementById('from-token').value;
    let toAmount;

    if (fromToken === 'usdt') {
        toAmount = (fromAmount * usdtPrice).toFixed(2);
    } else if (fromToken === 'pol' || fromToken === 'matic') {
        toAmount = (fromAmount * maticPrice).toFixed(2);
    } else if (fromToken === 'chr') {
        toAmount = (fromAmount * chrPrice).toFixed(2);
    }

    document.getElementById('to-amount').value = toAmount;
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

    updateToAmount(); // Update the amount when token changes
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

    updateToAmount(); // Update the amount when token changes
});

// Update to amount when from amount is changed
document.getElementById('from-amount').addEventListener('input', updateToAmount);

// Fetch price on load
window.onload = fetchPrice;
