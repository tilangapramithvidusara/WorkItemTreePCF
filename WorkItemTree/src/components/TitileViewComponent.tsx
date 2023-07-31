import React, { memo } from 'react'

const TitileViewComponent = ({ node }: { node: any }) => {  
  return (
    <span className="ant-tree-node-content-wrapper">
      {node?.icon && (
        <span className="ant-tree-node-content-icon" style={{ paddingRight: '5px' }}>
        <img src={`data:image/png;base64,${node?.icon}`} alt="icon" style={iconStyle} />
      </span>
      )}
      
      <span className="ant-tree-title" style={node?.relatedtocurrentItem ? titleStyleCurrent : titleStyle}>
        {node.title}
      </span>
    </span>
  );
}

const iconStyle = {
  display: 'inline-block',
  verticalAlign: 'middle',
  marginRight: '10px',
  width: '20px',
  height: '20px',
};

const titleStyle = {
  display: 'inline-block',
  verticalAlign: 'middle',
  paddingRight: '5px',
};

const titleStyleCurrent = {
  display: 'inline-block',
  verticalAlign: 'middle',
  paddingRight: '5px',
  backgroundColor: "#ccccff",
  borderRadius: "5px",
}

export default memo(TitileViewComponent);
