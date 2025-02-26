// components/CryptoDetail.jsx
import { useState } from 'react';

const CryptoDetail = ({ crypto, onAddToPortfolio }) => {
  const [amount, setAmount] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount && !isNaN(amount) && Number(amount) > 0) {
      onAddToPortfolio(crypto, amount);
      setAmount('');
    }
  };
  
  if (!crypto) return null;
  
  return (
    <div className="crypto-detail">
      <div className="crypto-header">
        <div className="crypto-image">
          <img src={crypto.image} alt={crypto.name} />
        </div>
        <div className="crypto-title">
          <h2>{crypto.name} <span>({crypto.symbol.toUpperCase()})</span></h2>
          <div className="crypto-rank">Rank #{crypto.market_cap_rank}</div>
        </div>
      </div>
      
      <div className="crypto-stats">
        <div className="stat">
          <span className="stat-label">Price</span>
          <span className="stat-value">${crypto.current_price.toLocaleString()}</span>
        </div>
        <div className="stat">
          <span className="stat-label">24h Change</span>
          <span className={`stat-value ${crypto.price_change_percentage_24h > 0 ? 'positive' : 'negative'}`}>
            {crypto.price_change_percentage_24h.toFixed(2)}%
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Market Cap</span>
          <span className="stat-value">${crypto.market_cap.toLocaleString()}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Volume (24h)</span>
          <span className="stat-value">${crypto.total_volume.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="add-to-portfolio">
        <h3>Add to Portfolio</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              min="0"
              step="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
            />
          </div>
          <div className="form-group">
            <span className="value-preview">
              {amount && !isNaN(amount) && Number(amount) > 0 
                ? `Value: $${(Number(amount) * crypto.current_price).toLocaleString()}`
                : ''}
            </span>
          </div>
          <button type="submit" className="add-button">Add to Portfolio</button>
        </form>
      </div>
    </div>
  );
};

export default CryptoDetail;