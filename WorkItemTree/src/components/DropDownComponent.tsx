import { Dropdown, MenuProps } from 'antd'
import React, { memo } from 'react'

const DropDownComponent = (
    {
      items, 
      handleClick, 
      dropdownVisible, hideDropDown, dropdownY, dropdownX}: 
    {items: any, 
      handleClick: any, 
      dropdownVisible: any, hideDropDown: any, dropdownY: any, dropdownX: any}) => 
  {
    
  return (
    <div>
      <Dropdown
        menu={{ 
          items, 
        }}
        open={dropdownVisible}
        onOpenChange={hideDropDown}
        trigger={["click"]}
      >
        <div
          style={{
            position: "absolute",
            top: dropdownY,
            left: dropdownX,
            marginTop:"-250px",
            marginLeft:"-70px",
          }}
        ></div>
      </Dropdown>
    </div>
  )
}

export default memo(DropDownComponent);
