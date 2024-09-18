import React, { useState, useMemo, useEffect } from 'react';
import { ArrowsAltOutlined, PlusCircleOutlined, ShrinkOutlined } from '@ant-design/icons';
import './Graph.css';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import CustomTooltip from '../Components/Tooltip'; 

// Function to generate random data for the chart
const generateData = (numDays) => {
    const data = [];
    for (let i = 1; i <= numDays; i++) {
        const value = (Math.random() * 100000).toFixed(2); 
        data.push({
            name: `Day ${i}`, 
            value: parseFloat(value), 
        });
    }
    return data;
};

const Graph = () => {
    const [activeTab, setActiveTab] = useState('chart');
    const [timeFrame, setTimeFrame] = useState('1w'); 
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [tooltipIndex, setTooltipIndex] = useState(null);

    const getNumDays = (timeFrame) => {
        switch (timeFrame) {
            case '1d':
                return 1;
            case '3d':
                return 3;
            case '1w':
                return 7;
            case '1m':
                return 30;
            case '6m':
                return 183;
            case '1y':
                return 365;
            case 'max':
                return 730;
            default:
                return 7;
        }
    };

    // Memoize data generation to avoid regenerating data on state changes other than timeFrame
    const data = useMemo(() => generateData(getNumDays(timeFrame)), [timeFrame]);

    const lastDataPoint = data[data.length - 1];
    const secondLastDataPoint = data[data.length - 2];

    const lastValue = lastDataPoint ? lastDataPoint.value : 0;
    const secondLastValue = secondLastDataPoint ? secondLastDataPoint.value : 0;

    const percentageChange = secondLastValue !== 0
        ? ((lastValue - secondLastValue) / secondLastValue * 100).toFixed(2)
        : '0.00';
    const subtitleClass = lastValue - secondLastValue >= 0 ? 'positive' : 'negative';

    useEffect(() => {
        setTooltipIndex(data.length - 1);
    }, [data]);

    const renderContent = () => {
        if (isFullscreen) {
            return (
                <div className="fullscreen-chart-container">
                    <div className="timeframe-container">
                        <div className="Fullscreen">
                            <button onClick={() => setIsFullscreen(!isFullscreen)}>
                                <ShrinkOutlined className="icon-spacing" />
                                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                            </button>
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
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid stroke="none" />
                            <XAxis dataKey="name" tick={false} />
                            <YAxis tick={false} />
                            <Tooltip
                                content={<CustomTooltip />}
                                active={true}
                                payload={data[tooltipIndex] ? [{ value: data[tooltipIndex].value }] : []}
                                label={data[tooltipIndex]?.name || ''}
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
            );
        } else if (activeTab === 'chart') {
            return (
                <div className="chart-content">
                    <div className="timeframe-container">
                        <div className="Fullscreen">
                            <button onClick={() => setIsFullscreen(!isFullscreen)}>
                                <ArrowsAltOutlined className="icon-spacing" />
                                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                            </button>
                            <button>
                                <PlusCircleOutlined className="icon-spacing" />Compare
                            </button>
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
                        <ResponsiveContainer width="100%" height={380}>
                            <AreaChart
                                data={data}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid stroke="none" />
                                <XAxis dataKey="name" tick={false} />
                                <YAxis tick={false} />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    active={true}
                                    payload={data[tooltipIndex] ? [{ value: data[tooltipIndex].value }] : []}
                                    label={data[tooltipIndex]?.name || ''}
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
        } else if (activeTab === 'summary') {
            return <p>This is the Summary panel.</p>;
        } else if (activeTab === 'statistics') {
            return <p>This is the Statistics panel.</p>;
        } else if (activeTab === 'analysis') {
            return <p>This is the Analysis panel.</p>;
        } else if (activeTab === 'settings') {
            return <p>This is the Settings panel.</p>;
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
                    <span
                        onClick={() => setActiveTab('summary')}
                        className={activeTab === 'summary' ? 'active' : ''}
                    >
                        Summary
                    </span>
                    <span
                        onClick={() => setActiveTab('chart')}
                        className={activeTab === 'chart' ? 'active' : ''}
                    >
                        Chart
                    </span>
                    <span
                        onClick={() => setActiveTab('statistics')}
                        className={activeTab === 'statistics' ? 'active' : ''}
                    >
                        Statistics
                    </span>
                    <span
                        onClick={() => setActiveTab('analysis')}
                        className={activeTab === 'analysis' ? 'active' : ''}
                    >
                        Analysis
                    </span>
                    <span
                        onClick={() => setActiveTab('settings')}
                        className={activeTab === 'settings' ? 'active' : ''}
                    >
                        Settings
                    </span>
                </div>
            )}

            {renderContent()}
        </div>
    );
};

export default Graph;
