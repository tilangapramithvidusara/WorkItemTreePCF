import React, { memo } from 'react'

const TitileViewComponent = ({ node, imageUrl }: { node: any, imageUrl: string }) => {  
  return (
    <span className="ant-tree-node-content-wrapper">
      <span className="ant-tree-node-content-icon" style={{ paddingRight: '5px' }}>
        <img src={node?.icon ? `data:image/png;base64,${node?.icon}` : imageUrl} alt="icon" style={iconStyle} />
      </span>
      
      <span className="ant-tree-title" style={node?.relatedtocurrentItem ? titleStyleCurrent : titleStyle}>
        {node?.title}
      </span>
    </span>
  );
}

const iconStyle = {
  display: 'inline-block',
  verticalAlign: 'middle',
  marginRight: '5px',
  width: '18px',
};

const titleStyle = {
  display: 'inline-block',
  verticalAlign: 'middle',
  paddingRight: '5px',
};

const titleStyleCurrent = {
  display: 'inline-block',
  verticalAlign: 'middle',
  padding: '2px 10px',
  backgroundColor: "#d8e6fb",
  borderRadius: "2px",
}

export default memo(TitileViewComponent);
