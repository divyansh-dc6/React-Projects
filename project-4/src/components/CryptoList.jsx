// components/CryptoList.jsx
const CryptoList = ({ cryptoData, onSelectCrypto, selectedCrypto }) => {
    return (
      <div className="crypto-list">
        <h2>Top Cryptocurrencies</h2>
        <div className="list-header">
          <span className="coin-name">Name</span>
          <span className="coin-price">Price</span>
          <span className="coin-change">24h %</span>
        </div>
        <ul>
          {cryptoData.map(crypto => (
            <li 
              key={crypto.id} 
              className={selectedCrypto?.id === crypto.id ? 'selected' : ''}
              onClick={() => onSelectCrypto(crypto)}
            >
              <div className="coin-info">
                <img src={crypto.image} alt={crypto.name} />
                <span className="coin-name">{crypto.name} <small>({crypto.symbol.toUpperCase()})</small></span>
              </div>
              <span className="coin-price">${crypto.current_price.toLocaleString()}</span>
              <span className={`coin-change ${crypto.price_change_percentage_24h > 0 ? 'positive' : 'negative'}`}>
                {crypto.price_change_percentage_24h.toFixed(2)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default CryptoList;