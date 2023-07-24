import { MenuProps, Spin, notification } from 'antd';
import Tree, { TreeProps } from "antd/es/tree";
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import TitileViewComponent from './TitileViewComponent';
import { addObjectToTree, findAndChange, getNode } from '../utils/tree.action.utils';
import { Key } from 'antd/es/table/interface';
import { retrieveTreeDataRequest } from '../apis/data.retrieve.apis';
import { LogicalNames } from '../constants';
import cloneDeep from 'lodash.clonedeep';
import { saveTreeDataRequest, updateTreeDataRequest } from '../apis/data.save.apis';
import { DownOutlined } from '@ant-design/icons';
// import dataImg from "../../images/dots.png";
import { res_one, res_two, res_three, sampleDBData } from '../samples/data.sample';
import DropDownComponent from './DropDownComponent';
import { items } from '../constants/items';
import { openSidePane } from '../utils/pane.open.utils';


const  TreeViewComponent = () => {
  const {DirectoryTree} = Tree;
  const dropdownRef = useRef<any>(null);
  const [loadedData, setLoadedData] = useState<any>({});
  const [treeData, setTreeData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]); // "e3b4d193-4b21-ee11-9cbc-6045bdd0ef22"
  const [rightClickedRecord, setRightClickedRecord] = useState<any>();
  const [copiedRecord, setCopiedRecord] = useState<Object>({});
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [dropdownX, setDropdownX] = useState<number>(0);
  const [dropdownY, setDropdownY] = useState<number>(0);
  const [type, setType] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(
    []
    // treeData.flatMap((node: any) => node?.key?.toString())
  );
  const [currentLogicalName, setCurrentLogicalName] = useState<string>("");
  const [noData, setNoData] = useState<string>("No Data Found");
  const [textObject, setTextObject] = useState<object>({
    saveErrorMessage: "",
    saveSuccessMessage: "",
  })
  const [shiftPressed, setShiftPressed] = useState<boolean>(false);

  let parentValue: any = null;
  let parentValueDrop: any = null;

  const findParent = (tree: any, key: any, parent: any) => {
    if (tree.key === key) {
      parentValue = parent;
    } else if (tree.children) {
      tree.children.forEach((child: any) => findParent(child, key, tree));
    }
  };
  const findParentDrop = (tree: any, key: any, parent: any) => {
    if (tree.key === key) {
      parentValueDrop = parent;
    } else if (tree.children) {
      tree.children.forEach((child: any) => findParentDrop(child, key, tree));
    }
  };

  const onDrop: TreeProps["onDrop"] = async (info: any) => {
    const dropKey = info?.node?.key;
    const dragKey = info?.dragNode?.key;
    const dropPos = info?.node?.pos?.split("-");
    const dropPosition =
      info?.dropPosition - Number(dropPos[dropPos.length - 1]);

    // const isReparenting = !(parentValue.key === parentValueDrop.key)
    console.log("wswsws =====> ", shiftPressed, (info?.node.parentSequanceId && info?.dragNode.parentSequanceId), (info?.node.parentSequanceId === info?.dragNode.parentSequanceId));
    
    const isReparenting = !(shiftPressed && (info?.node.parentSequanceId && info?.dragNode.parentSequanceId) && (info?.node.parentSequanceId === info?.dragNode.parentSequanceId));
    console.log("qaqaqaq======> ", isReparenting);
    

    if (!isReparenting) {
      findParent(treeData[0], info?.dragNode?.key, {});
      findParentDrop(treeData[0], dropKey, {});
    }
    setIsLoading(true);

    const response: any = await updateTreeDataRequest(isReparenting, info.dragNode, isReparenting ? info.node : parentValueDrop, info.node?.workItemsequance?.sequance);
    
    if (response.error) {
      setIsLoading(false);
      parentValue = null;
      parentValueDrop = null;
      notification.error({
        message: "Error",
        description: "Failed to change sequence..!",
      });
    } else {
      setTreeData([]);
      setExpandedKeys([]);
      setTimeout(async() => {
        await retrieveWorkItemData();
        setIsLoading(false);
      }, 100);
      // setIsLoading(false);
      parentValue = null;
      parentValueDrop = null;
    }
    // }
    parentValue = null;
    parentValueDrop = null;
  };

  const onRightClick = (info: { event: React.MouseEvent; node: any }) => {
    // info.event.preventDefault();
    setDropdownVisible(false);
    console.log('right =======> ', info?.node);
    
    setDropdownX(info.event.clientX);
    setDropdownY(info.event.clientY);
    // changeItemName(info?.node);
    setRightClickedRecord({ ...rightClickedRecord, ...info.node });
    setTimeout(() => {
      setDropdownVisible(true);
    }, 0);
  };

  const onClickNode = (selectedKeys: any, e: any) => {
    const { node } = e;
    const info = { expanded: true, node: {} };
    setDropdownVisible(false);
    // handleExpand(selectedKeys, info)
    openSidePane(loadedData.logicalName, node.key, node); /////// this
  };

  const handleExpand = (
    expandedKeySet: Key[],
    info: { expanded: boolean; node: any }
  ) => {
    const { node, expanded } = info;
    console.log('expand ====> ', expandedKeySet, expandedKeys);
    setDropdownVisible(false);
    // if (!expandedKeys.includes(expandedKey)) {
    //   setExpandedKeys([...expandedKeys, expandedKey]);
    // }
    setExpandedKeys(expandedKeySet);
  };

  const expandCurrentLocationNodesByKey = (key?: React.Key) => {
    setIsLoading(true);
    setExpandedKeys([]);
    const data = treeData;
    setTreeData([]);
    setTimeout(() => {
      setExpandedKeys(loadedData?.currentNodeWorkitems)
      setTreeData(data);
      // setExpandedKeys([
      //   "e3b4d193-4b21-ee11-9cbc-6045bdd0ef22",
      //   "e3b4d193-4b21-ee11-9cbc-6045bdd0ef24412",
      //   "e3b4d193-4b21-ee11-9cbc-6045bdd0ef241242",
      // ])
      setIsLoading(false);
    }, 100);
  };

  const retrieveWorkItemData = useCallback(async(info?: any) => {
    const response: any = await retrieveTreeDataRequest(info);
    console.log('res data ===> ', response);
    setLoadedData(response)
    setTreeData(response?.workItems);
    // setTreeData(res_one);
    // res_one.map((data: any) => {
    //   if (data.checked)
    //     setCheckedKeys([...checkedKeys, data.key])
    // })
  }, [treeData]);
  
  // save update
  const saveWorkItemData = useCallback(async(info) => {

  }, []);

  const onCheck = (checkedKeys: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] }, info: any) => {
    setCheckedKeys(Array.isArray(checkedKeys) ? checkedKeys : checkedKeys.checked);
  };

  const hideDropDown = () => {    
    setDropdownVisible(false);
  };

  const getCheckedValues = () => {
    const checkedValues: any[] = [];
    const notCheckedValues: any[] = [];

    const traverseTree = (nodes: any[]) => {
      for (const node of nodes) {
        if (checkedKeys.includes(node.key.toString())) {
          checkedValues.push(node);
        } else {
          notCheckedValues.push(node);
        }

        if (node.children) {
          traverseTree(node.children);
        }
      }
    };

    traverseTree(treeData);
    console.log('Checked Values:', checkedValues);
    console.log('Not Checked Values:', notCheckedValues);
  };

  const onClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "1": {
        // Copy functionality invoked...
        setDropdownVisible(false);
        setIsModalOpen(true);
        setCopiedRecord({ ...rightClickedRecord });
        break;
      }
      default:
        break;
    }
    setTreeData([...treeData]);
  };

  useEffect(() => {
    // retrieveWorkItemData();
    // const currentLogicalName = window.parent.Xrm.Page.ui._formContext.contextToken.entityTypeName;
    // setCurrentLogicalName(currentLogicalName);
    const data = sampleDBData.workItems;
    setTreeData(data);
    setLoadedData(sampleDBData);
  }, []);

  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !(event.target instanceof Node && dropdownRef.current.contains(event.target as HTMLDivElement))) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      console.log("press ====> ",  event.key, event);
      
      if (event.key === 'Shift') {
        console.log('yes===');
        
        setShiftPressed(true);
      }
    };

    const handleKeyUp = (event: any) => {
      console.log("unpress ====> ",  event.key, event);
      if (event.key === 'Shift') {
        console.log('no===');
        setShiftPressed(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  console.log("mmm==> ", treeData, expandedKeys);
  

  return (
    <div className="custom-container" id="custom-container" ref={dropdownRef}>
      {treeData && treeData.length > 0 ? (
        <div>
          {currentLogicalName !== LogicalNames.WORKITEM && (
            <div className="btn-location-wrap">
              <button className='btn-data' onClick={() => expandCurrentLocationNodesByKey()}>
              {/* <img src="{dataImg}" className='icon' alt="icon"/> */}
                Current Location Data</button>
            </div>
          )}
          <div id="treeElement">
            <Spin spinning={isLoading}>
              <DirectoryTree
                className="draggable-tree"
                // checkable
                // checkedKeys={checkedKeys}
                // onCheck={onCheck}
                // defaultExpandedKeys={expandedKeys}
                expandedKeys={expandedKeys}
                draggable
                blockNode
                onDrop={onDrop}
                treeData={treeData}
                selectable={true}
                style={{ paddingRight: '10px' }}
                onRightClick={onRightClick}
                onExpand={handleExpand}
                showLine={true}
                showIcon={false}//
                onSelect={(selectedKeys, e) => onClickNode(selectedKeys, e)}
                switcherIcon={<DownOutlined />}
                // loadData={onLoadHandler}
                titleRender={(node: any) => {
                  return (
                    <TitileViewComponent node={node}/>
                  );
                }}
              />
            </Spin>
            <div>
              <DropDownComponent
                items={items}
                dropdownVisible={dropdownVisible}
                hideDropDown={hideDropDown}
                dropdownY={dropdownY}
                dropdownX={dropdownX}
                onClick={onClick}
              />
            </div>
          </div>
        </div>
        
       ) : (
        <div>
          <p>{noData}</p>
        </div>
      )}
    </div>
  )
}

export default memo(TreeViewComponent);
