import React from 'react';
import './Tooltip.css'; 

const Tooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{`${payload[0].value}`}</p>
            </div>
        );
    }

    return null;
};

export default Tooltip;
