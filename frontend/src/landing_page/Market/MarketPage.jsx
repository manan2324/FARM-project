import React, { useState, useEffect, useRef, useMemo } from 'react'

// --- SVG Icon Components ---
const FilterIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="22 3 2 3 10 12.46V19l4 2v-8.54L22 3z"></polygon></svg>;
const ChartIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;
const AlertTriangleIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;

const MarketPage = () => {
  const [allData, setAllData] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [filters, setFilters] = useState({ state: '', district: '', market: '', commodity: '' });
  const [chartData, setChartData] = useState(null);

  const chartContainer = useRef(null);
  const chartInstance = useRef(null);

  const API_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001b3707aa6e15c44b5555864b24c481312&format=json&limit=1000";

  // --- Data Fetching and Script Loading ---
  useEffect(() => {
    // Load Chart.js script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.async = true;
    script.onload = () => {
      // Fetch data only after Chart.js is loaded
      const fetchData = async () => {
        setStatus('loading');
        try {
          const response = await fetch(API_URL);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          setAllData(data.records);
          setStatus('success');
        } catch (error) {
          console.error("Failed to fetch market data:", error);
          setStatus('error');
        }
      };
      fetchData();
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  // --- Dynamic Filter Options ---
  const filterOptions = useMemo(() => {
    const states = [...new Set(allData.map(item => item.state))].sort();
    const districts = filters.state ? [...new Set(allData.filter(item => item.state === filters.state).map(item => item.district))].sort() : [];
    const markets = filters.district ? [...new Set(allData.filter(item => item.district === filters.district).map(item => item.market))].sort() : [];
    const commodities = filters.market ? [...new Set(allData.filter(item => item.market === filters.market).map(item => item.commodity))].sort() : [];
    return { states, districts, markets, commodities };
  }, [allData, filters.state, filters.district, filters.market]);

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    // Reset dependent filters
    if (filterName === 'state') {
      newFilters.district = '';
      newFilters.market = '';
      newFilters.commodity = '';
    } else if (filterName === 'district') {
      newFilters.market = '';
      newFilters.commodity = '';
    } else if (filterName === 'market') {
      newFilters.commodity = '';
    }
    setFilters(newFilters);
    setChartData(null); // Clear chart when a filter changes
  };

  // --- Chart Data Processing ---
  useEffect(() => {
    if (filters.state && filters.district && filters.market && filters.commodity) {
      const filteredRecords = allData
        .filter(rec =>
          rec.state === filters.state &&
          rec.district === filters.district &&
          rec.market === filters.market &&
          rec.commodity === filters.commodity
        )
        .sort((a, b) => new Date(a.arrival_date) - new Date(b.arrival_date));

      setChartData({
        labels: filteredRecords.map(rec => new Date(rec.arrival_date).toLocaleDateString('en-IN')),
        prices: filteredRecords.map(rec => rec.modal_price)
      });
    }
  }, [filters, allData]);

  // --- Chart Rendering ---
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    if (chartContainer.current && chartData && window.Chart) {
      const ctx = chartContainer.current.getContext('2d');
      chartInstance.current = new window.Chart(ctx, {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [{
            label: `Modal Price (₹ per Quintal) for ${filters.commodity}`,
            data: chartData.prices,
            borderColor: 'rgb(79, 70, 229)',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgb(79, 70, 229)',
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => `Price: ₹${context.parsed.y}`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              title: { display: true, text: 'Modal Price (₹)' }
            },
            x: {
              title: { display: true, text: 'Date' }
            }
          }
        }
      });
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData, filters.commodity]);

  // --- Reusable UI Components ---
  const StyledSelect = ({ label, value, onChange, options, disabled = false }) => (
    <div className="w-full">
      <label className="block text-sm font-bold text-slate-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="block w-full rounded-xl border-2 border-slate-300 py-3 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none bg-no-repeat bg-right-4 bg-[url('data:image/svg+xml,%3csvg%2...')] disabled:bg-slate-100 disabled:cursor-not-allowed"
      >
        <option value="">Select {label}</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

  return (
    <div className="bg-slate-100 font-sans flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Crop Market Prices</h1>
          <p className="mt-2 text-slate-500">Analyze price trends from markets across India.</p>
        </header>

        {status === 'loading' && <div className="text-center p-10 font-semibold text-slate-600">Loading market data...</div>}
        {status === 'error' && (
          <div className="text-center p-10 text-red-600">
            <AlertTriangleIcon className="w-12 h-12 mx-auto" />
            <h2 className="mt-2 font-bold text-lg">Failed to Load Data</h2>
            <p className="text-sm">Could not fetch data from the server. Please try again later.</p>
          </div>
        )}

        {status === 'success' && (
          <>
            {/* Filters Section */}
            <section className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 mb-8">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <FilterIcon className="w-6 h-6 text-indigo-600" />
                Select Your Market
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <StyledSelect label="State" value={filters.state} onChange={val => handleFilterChange('state', val)} options={filterOptions.states} />
                <StyledSelect label="District" value={filters.district} onChange={val => handleFilterChange('district', val)} options={filterOptions.districts} disabled={!filters.state} />
                <StyledSelect label="Market" value={filters.market} onChange={val => handleFilterChange('market', val)} options={filterOptions.markets} disabled={!filters.district} />
                <StyledSelect label="Commodity" value={filters.commodity} onChange={val => handleFilterChange('commodity', val)} options={filterOptions.commodities} disabled={!filters.market} />
              </div>
            </section>

            {/* Chart Section */}
            <section className="min-h-[400px] flex items-center justify-center">
              {chartData ? (
                <canvas ref={chartContainer}></canvas>
              ) : (
                <div className="text-center text-slate-500">
                  <ChartIcon className="w-16 h-16 mx-auto text-slate-400" />
                  <p className="mt-4 font-semibold">Your chart will appear here.</p>
                  <p>Please complete all selections above to view the price trend.</p>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default MarketPage
