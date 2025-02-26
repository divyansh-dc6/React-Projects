import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import axios from 'axios';
import './App.css';
import CryptoList from './components/CryptoList';
import Portfolio from './components/Portfolio';
import CryptoDetail from './components/CryptoDetail';
import Header from './components/Header';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [cryptoData, setCryptoData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [portfolio, setPortfolio] = useState(() => {
    const saved = localStorage.getItem('portfolio');
    return saved ? JSON.parse(saved) : [];
  });
  const [timeRange, setTimeRange] = useState('24h');
  const [chartData, setChartData] = useState([]);

  // Fetch crypto list
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/coins/markets', {
            params: {
              vs_currency: 'usd',
              order: 'market_cap_desc',
              per_page: 20,
              page: 1,
              sparkline: false
            }
          }
        );
        setCryptoData(response.data);
        if (!selectedCrypto && response.data.length > 0) {
          setSelectedCrypto(response.data[0]);
        }
      } catch (err) {
        setError('Failed to fetch cryptocurrency data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, []);

  // Fetch chart data for selected crypto
  useEffect(() => {
    const fetchChartData = async () => {
      if (!selectedCrypto) return;
      
      try {
        const days = timeRange === '24h' ? 1 : 
                     timeRange === '7d' ? 7 : 
                     timeRange === '30d' ? 30 : 90;
                     
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${selectedCrypto.id}/market_chart`, {
            params: {
              vs_currency: 'usd',
              days: days
            }
          }
        );
        
        // Format data for the chart
        const formattedData = response.data.prices.map(price => ({
          time: new Date(price[0]).toLocaleString(),
          price: price[1]
        }));
        
        setChartData(formattedData);
      } catch (err) {
        console.error('Error fetching chart data:', err);
      }
    };

    fetchChartData();
  }, [selectedCrypto, timeRange]);

  // Save portfolio to localStorage
  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  const handleSelectCrypto = (crypto) => {
    setSelectedCrypto(crypto);
  };

  const addToPortfolio = (crypto, amount) => {
    // Check if already in portfolio
    const existingIndex = portfolio.findIndex(item => item.id === crypto.id);
    
    if (existingIndex >= 0) {
      // Update existing entry
      const updatedPortfolio = [...portfolio];
      updatedPortfolio[existingIndex] = {
        ...updatedPortfolio[existingIndex],
        amount: Number(updatedPortfolio[existingIndex].amount) + Number(amount)
      };
      setPortfolio(updatedPortfolio);
    } else {
      // Add new entry
      setPortfolio([...portfolio, {
        id: crypto.id,
        name: crypto.name,
        symbol: crypto.symbol,
        current_price: crypto.current_price,
        amount: Number(amount),
        image: crypto.image
      }]);
    }
  };

  const removeFromPortfolio = (cryptoId) => {
    setPortfolio(portfolio.filter(item => item.id !== cryptoId));
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {isLoading ? (
        <div className="loading">Loading cryptocurrency data...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="dashboard-container">
          <div className="sidebar">
            <CryptoList 
              cryptoData={cryptoData} 
              onSelectCrypto={handleSelectCrypto} 
              selectedCrypto={selectedCrypto}
            />
          </div>
          
          <main className="main-content">
            {selectedCrypto && (
              <CryptoDetail 
                crypto={selectedCrypto} 
                onAddToPortfolio={addToPortfolio}
              />
            )}
            
            <div className="chart-container">
              <div className="chart-header">
                <h2>{selectedCrypto?.name} Price Chart</h2>
                <div className="time-filters">
                  <button 
                    className={timeRange === '24h' ? 'active' : ''} 
                    onClick={() => setTimeRange('24h')}
                  >
                    24h
                  </button>
                  <button 
                    className={timeRange === '7d' ? 'active' : ''} 
                    onClick={() => setTimeRange('7d')}
                  >
                    7d
                  </button>
                  <button 
                    className={timeRange === '30d' ? 'active' : ''} 
                    onClick={() => setTimeRange('30d')}
                  >
                    30d
                  </button>
                  <button 
                    className={timeRange === '90d' ? 'active' : ''} 
                    onClick={() => setTimeRange('90d')}
                  >
                    90d
                  </button>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return timeRange === '24h' 
                        ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : date.toLocaleDateString();
                    }}
                  />
                  <YAxis 
                    domain={['auto', 'auto']}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${value.toFixed(2)}`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
                    labelFormatter={(label) => `Time: ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    name={`${selectedCrypto?.name} Price (USD)`}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </main>
          
          <div className="portfolio-container">
            <Portfolio 
              portfolio={portfolio} 
              cryptoData={cryptoData} 
              onRemove={removeFromPortfolio} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;