// components/Portfolio.jsx
const Portfolio = ({ portfolio, cryptoData, onRemove }) => {
    // Calculate total portfolio value
    const getTotalValue = () => {
      return portfolio.reduce((total, item) => {
        // Find current price from cryptoData
        const currentCrypto = cryptoData.find(crypto => crypto.id === item.id);
        const currentPrice = currentCrypto ? currentCrypto.current_price : item.current_price;
        
        return total + (Number(item.amount) * currentPrice);
      }, 0);
    };
    
    // Calculate profit/loss for a portfolio item
    const getProfitLoss = (item) => {
      const currentCrypto = cryptoData.find(crypto => crypto.id === item.id);
      const currentPrice = currentCrypto ? currentCrypto.current_price : item.current_price;
      const initialValue = Number(item.amount) * item.current_price;
      const currentValue = Number(item.amount) * currentPrice;
      
      return {
        value: currentValue - initialValue,
        percentage: initialValue > 0 ? ((currentValue - initialValue) / initialValue) * 100 : 0
      };
    };
    
    return (
      <div className="portfolio">
        <h2>Your Portfolio</h2>
        {portfolio.length === 0 ? (
          <div className="empty-portfolio">
            <p>Your portfolio is empty. Add cryptocurrencies to start tracking.</p>
          </div>
        ) : (
          <>
            <div className="portfolio-summary">
              <div className="summary-item">
                <span>Total Value</span>
                <span className="value">${getTotalValue().toLocaleString()}</span>
              </div>
              <div className="summary-item">
                <span>Assets</span>
                <span className="value">{portfolio.length}</span>
              </div>
            </div>
            
            <div className="portfolio-list">
              <div className="list-header">
                <span className="coin">Coin</span>
                <span className="holdings">Holdings</span>
                <span className="value">Value</span>
                <span className="profit-loss">Profit/Loss</span>
                <span className="actions">Actions</span>
              </div>
              
              <ul>
                {portfolio.map(item => {
                  const currentCrypto = cryptoData.find(crypto => crypto.id === item.id);
                  const currentPrice = currentCrypto ? currentCrypto.current_price : item.current_price;
                  const currentValue = Number(item.amount) * currentPrice;
                  const profitLoss = getProfitLoss(item);
                  
                  return (
                    <li key={item.id}>
                      <div className="coin">
                        <img src={item.image} alt={item.name} />
                        <div>
                          <div>{item.name}</div>
                          <div className="symbol">{item.symbol.toUpperCase()}</div>
                        </div>
                      </div>
                      <div className="holdings">
                        <div>{Number(item.amount).toLocaleString()}</div>
                        <div className="price">${currentPrice.toLocaleString()}</div>
                      </div>
                      <div className="value">${currentValue.toLocaleString()}</div>
                      <div className={`profit-loss ${profitLoss.value >= 0 ? 'positive' : 'negative'}`}>
                        <div>${Math.abs(profitLoss.value).toLocaleString()}</div>
                        <div>{profitLoss.value >= 0 ? '+' : '-'}{Math.abs(profitLoss.percentage).toFixed(2)}%</div>
                      </div>
                      <div className="actions">
                        <button className="remove-button" onClick={() => onRemove(item.id)}>
                          Remove
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}
      </div>
    );
  };
  
  export default Portfolio;