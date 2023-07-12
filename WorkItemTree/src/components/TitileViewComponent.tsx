import React, { memo } from 'react'

const TitileViewComponent = ({ node }: { node: any }) => {
  return (
    <span className="ant-tree-node-content-wrapper">
      {/* <span className="ant-tree-node-content-icon" style={{ paddingRight: '5px' }}>
        <img src={node?.imgUrl} alt="icon" style={iconStyle} />
      </span> */}
      <span className="ant-tree-title" style={titleStyle}>
        {node.title}
      </span>
    </span>
  );
}

const iconStyle = {
  display: 'inline-block',
  verticalAlign: 'middle',
  marginRight: '10px',
  width: '25px',
  height: '25px',
};

const titleStyle = {
  display: 'inline-block',
  verticalAlign: 'middle',
  paddingRight: '5px',
};

export default memo(TitileViewComponent);
