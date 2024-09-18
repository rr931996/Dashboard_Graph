import React, { useState, useEffect, useMemo } from 'react';
import { ArrowsAltOutlined, PlusCircleOutlined, ShrinkOutlined } from '@ant-design/icons';
import './Graph.css';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CustomTooltip from '../Components/Tooltip';

const fetchData = async () => {
  try {
    const response = await fetch('https://mocki.io/v1/aeb979f3-f1a4-4995-9442-de35ce0c6612');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Fetching data failed:', error);
    return [];
  }
};

const Summary = () => <p>This is the Summary panel.</p>;
const Statistics = () => <p>This is the Statistics panel.</p>;
const Analysis = () => <p>This is the Analysis panel.</p>;
const Settings = () => <p>This is the Settings panel.</p>;

const Graph = () => {
  const [activeTab, setActiveTab] = useState('chart');
  const [timeFrame, setTimeFrame] = useState('1w');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [data, setData] = useState([]);
  const [tooltipIndex, setTooltipIndex] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const getData = async () => {
      setLoading(true); 
      const fetchedData = await fetchData();
      setData(fetchedData);
      const timeoutId = setTimeout(() => {
        setLoading(false); 
      }, 1000);
      
      return () => clearTimeout(timeoutId); 
    };
    getData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      setTooltipIndex(data.length - 1);
    }
  }, [data]);

  const getNumDays = (timeFrame) => {
    const timeFrames = {
      '1d': 1, '3d': 3, '1w': 7, '1m': 30,
      '6m': 183, '1y': 365, 'max': 730,
    };
    return timeFrames[timeFrame] || 7;
  };

  const filteredData = useMemo(() => {
    const numDays = getNumDays(timeFrame);
    return data.slice(-numDays);
  }, [data, timeFrame]);

  const lastDataPoint = filteredData[filteredData.length - 1];
  const secondLastDataPoint = filteredData[filteredData.length - 2];
  const lastValue = lastDataPoint ? lastDataPoint.value : 0;
  const secondLastValue = secondLastDataPoint ? secondLastDataPoint.value : 0;
  const percentageChange = secondLastValue !== 0 ? ((lastValue - secondLastValue) / secondLastValue * 100).toFixed(2) : '0.00';
  const subtitleClass = lastValue - secondLastValue >= 0 ? 'positive' : 'negative';

  const renderContent = () => {
    if (loading) {
      return <h1 className="loader">Loading...</h1>; 
    }

    switch (activeTab) {
      case 'summary':
        return <Summary />;
      case 'statistics':
        return <Statistics />;
      case 'analysis':
        return <Analysis />;
      case 'settings':
        return <Settings />;
      case 'chart':
      default:
        return (
          <div className={`chart-content ${isFullscreen ? 'fullscreen' : ''}`}>
            <div className="timeframe-container">
              <div className="Fullscreen">
                <button onClick={() => setIsFullscreen(!isFullscreen)}>
                  {isFullscreen ? <ShrinkOutlined className="icon-spacing" /> : <ArrowsAltOutlined className="icon-spacing" />}
                  {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </button>
                {!isFullscreen && (
                  <button>
                    <PlusCircleOutlined className="icon-spacing" />Compare
                  </button>
                )}
              </div>
              <div className="timeframe">
                {['1d', '3d', '1w', '1m', '6m', '1y', 'max'].map((frame) => (
                  <button
                    key={frame}
                    onClick={() => setTimeFrame(frame)}
                    className={timeFrame === frame ? 'active' : ''}
                  >
                    {frame}
                  </button>
                ))}
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={isFullscreen ? '100%' : 380}>
                <AreaChart
                  data={filteredData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid stroke="none" />
                  <XAxis dataKey="name" tick={false} />
                  <YAxis tick={false} />
                  <Tooltip
                    content={<CustomTooltip />}
                    active={true}
                    payload={filteredData[tooltipIndex] ? [{ value: filteredData[tooltipIndex].value }] : []}
                    label={filteredData[tooltipIndex]?.name || ''}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="rgba(136, 132, 216, 0.5)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`container ${isFullscreen ? 'fullscreen' : ''}`}>
      <h1 className="title">
        {lastValue.toLocaleString()} <span className="currency-box">USD</span>
      </h1>
      <p className={`subtitle ${subtitleClass}`}>
        {lastValue - secondLastValue >= 0 ? `+${(lastValue - secondLastValue).toLocaleString()}` : (lastValue - secondLastValue).toLocaleString()} ({percentageChange >= 0 ? `+${percentageChange}%` : `${percentageChange}%`})
      </p>

      {!isFullscreen && (
        <div className="navigation">
          <span onClick={() => setActiveTab('summary')} className={activeTab === 'summary' ? 'active' : ''}>Summary</span>
          <span onClick={() => setActiveTab('chart')} className={activeTab === 'chart' ? 'active' : ''}>Chart</span>
          <span onClick={() => setActiveTab('statistics')} className={activeTab === 'statistics' ? 'active' : ''}>Statistics</span>
          <span onClick={() => setActiveTab('analysis')} className={activeTab === 'analysis' ? 'active' : ''}>Analysis</span>
          <span onClick={() => setActiveTab('settings')} className={activeTab === 'settings' ? 'active' : ''}>Settings</span>
        </div>
      )}

      {renderContent()}
    </div>
  );
};

export default Graph;
