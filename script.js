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
