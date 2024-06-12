// Fetch and populate the top 100 cryptocurrencies
function populateCryptocurrencies() {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=1')
        .then(response => response.json())
        .then(data => {
            const cryptoSelect = document.getElementById('cryptoSelect');
            data.forEach(coin => {
                const option = document.createElement('option');
                option.value = coin.id;
                option.text = `${coin.name} (${coin.symbol.toUpperCase()})`;
                cryptoSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching cryptocurrency data:', error));
}

// Populate the cryptocurrencies when the script runs
populateCryptocurrencies();

document.getElementById('cryptoForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const cryptoSelect = document.getElementById('cryptoSelect').value;
    const initialInvestment = parseFloat(document.getElementById('initialInvestment').value);
    const initialPrice = parseFloat(document.getElementById('initialPrice').value);

    if (initialInvestment <= 0 || isNaN(initialInvestment)) {
        alert("Initial Investment must be a positive number.");
        return;
    }

    if (initialPrice <= 0 || isNaN(initialPrice)) {
        alert("Initial Price per Coin must be a positive number.");
        return;
    }

    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoSelect}&vs_currencies=usd`)
        .then(response => response.json())
        .then(data => {
            const currentPrice = data[cryptoSelect].usd;
            const coinsPurchased = initialInvestment / initialPrice;
            const currentValue = coinsPurchased * currentPrice;
            const roi = ((currentValue - initialInvestment) / initialInvestment) * 100;

            const roiClass = roi >= 0 ? 'roi-positive' : 'roi-negative';
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = `
                <p>Current Price: $${currentPrice.toFixed(2)}</p>
                <p>Coins Purchased: ${coinsPurchased.toFixed(4)}</p>
                <p>Current Value: $${currentValue.toFixed(2)}</p>
                <p>Return on Investment: <span class="${roiClass}">${roi.toFixed(2)}%</span></p>
            `;
            resultDiv.style.display="block";
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            var resultDiv = document.getElementById('result');
            resultDiv.innerHTML = `<p>Error fetching current price. Please try again later.</p>`;
        });
});