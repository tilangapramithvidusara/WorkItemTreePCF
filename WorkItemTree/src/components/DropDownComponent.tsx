import { Dropdown } from 'antd'
import React, { memo } from 'react'

const DropDownComponent = (
    {items, onClick, dropdownVisible, hideDropDown, dropdownY, dropdownX}: 
    {items: any, onClick: any, dropdownVisible: any, hideDropDown: any, dropdownY: any, dropdownX: any}) => 
  {
    console.log(",,,,,,mmmmm");
    
  return (
    <div>
      <Dropdown
        menu={{ items, onClick }}
        open={dropdownVisible}
        // onOpenChange={hideDropDown}
        trigger={["click"]}
      >
        <div
          style={{
            position: "absolute",
            top: dropdownY,
            left: dropdownX,
            // marginTop:"-250px",
            // marginLeft:"-70px"
          }}
        ></div>
      </Dropdown>
    </div>
  )
}

export default memo(DropDownComponent);
