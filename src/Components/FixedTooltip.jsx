import React from 'react';
import './Tooltip.css'; 

const FixedTooltip = ({ data }) => {
  if (!data) return null;

  return (
    <div 
      style={{
        position: 'absolute',
        right: '1%',  
        bottom: '6%', 
        backgroundColor: '#0808c4',
        padding: '5px 10px',  
        color: '#fff',
        fontSize: '14px',
        fontWeight: 'bold',
        borderRadius: '5px',
        lineHeight: '0.01',  
        zIndex: 10,
      }}
    >
      <p>{data.value}</p>
    </div>
  );
};

export default FixedTooltip;
