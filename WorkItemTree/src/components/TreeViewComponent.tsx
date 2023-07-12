import { MenuProps, Spin, notification } from 'antd';
import Tree, { TreeProps } from "antd/es/tree";
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import TitileViewComponent from './TitileViewComponent';
import { addObjectToTree, findAndChange, getNode } from '../utils/tree.action.utils';
import { Key } from 'antd/es/table/interface';
import { retrieveTreeDataRequest } from '../apis/data.retrieve.apis';
import { LogicalNames } from '../constants';
import cloneDeep from 'lodash.clonedeep';
import { saveTreeDataRequest } from '../apis/data.save.apis';
import { DownOutlined } from '@ant-design/icons';

import { res_one, res_two, res_three } from '../samples/data.sample';
import DropDownComponent from './DropDownComponent';
import { items } from '../constants/items';
import { openSidePane } from '../utils/pane.open.utils';


const  TreeViewComponent = ({imageUrl}: {imageUrl: any}) => {
  const {DirectoryTree} = Tree;
  const dropdownRef = useRef<any>(null);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
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

  let parentValue: any = null;
  let parentValueDrop: any = null;

  const onLoadHandler = async(node: any) => {
    if (
      !(node.a_attr.LogicalName === LogicalNames.SURVEY) &&
      node.hasChildren
    ) {
      // const res_two = await retrieveTreeDataRequest(node);
      console.log('res two ===> ', res_two, imageUrl);
      
      node.children = res_two;
      if (
        res_two.length === 0 ||
        node.level + 1 === res_two[0].level
      )
        addObjectToTree(treeData[0], node.key, res_two);
        setTreeData((prevTreeData: any) => {
          // const updatedTreeData = [...prevTreeData]
          const updatedTreeData = cloneDeep(treeData);
          // Find the parent node in the tree data array
          const parentNode = updatedTreeData.find(
            (n) => n?.key === node.key
          );
          if (parentNode) {
            // Update the parent node with the new child nodes
            parentNode.children = res_two;
            Object.assign(parentNode.children, res_two);
          }
          return updatedTreeData;
        });
    }
    return node;
  }

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
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split("-");
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const entityLogicalName = (info as any).dragNode.a_attr.LogicalName;
    const expandedKeysArray = [...expandedKeys]; 

    findParent(treeData[0], info.dragNode?.key, {});
    findParentDrop(treeData[0], dropKey, {});
    // if (
    //   parentValue.key === parentValueDrop.key
    // ) {
    setIsLoading(true);
    // need to change according to data required
    const response: any = await saveTreeDataRequest(
      entityLogicalName,
      info.dragNode?.key,
      {gyde_sequence: info?.node?.sequence}
    );
    
    if (response.error) {
      setIsLoading(false);
      parentValue = null;
      parentValueDrop = null;
      notification.error({
        message: "Error",
        description: "Drop allow only same lavel..!",
      });
    } else {
      // if (parentValue?.a_attr?.LogicalName === LogicalNames?.SURVEY) {
      if (parentValue?.level === 1) {
        setTreeData([]);
        setExpandedKeys([]);
        setTimeout(async() => {
          const res = await retrieveTreeDataRequest();
          setTreeData(res);
        }, 1000)
      } else {
        const index = expandedKeysArray.indexOf(parentValue.key)
        if (index > -1) { // only splice array when item is found
          expandedKeysArray.splice(index, 1); // 2nd parameter means remove one item only
        }
        for (let x = 0; x < parentValue.children.length; x++) {
          const indexChildren = expandedKeysArray.indexOf(parentValue.key)
          if (indexChildren > -1) { // only splice array when item is found
            expandedKeysArray.splice(indexChildren, 1); // 2nd parameter means remove one item only
          }
        }

        setExpandedKeys([...expandedKeysArray])
        
        addObjectToTree(treeData[0], parentValue.key, []);
        const nodeData = await retrieveTreeDataRequest(parentValue);
        console.log("treeData pppp ", nodeData, parentValue, parentValue?.key);
        addObjectToTree(treeData[0], parentValue?.key, nodeData);
        setTreeData(treeData);
        onLoadHandler(parentValue);
        for (let x = 0; x < parentValue.children.length; x++) {
          onLoadHandler(parentValue.children[x])
        }
      }
      setIsLoading(false);
      parentValue = null;
      parentValueDrop = null;
    }
    // }
    parentValue = null;
    parentValueDrop = null;
  };

  const onRightClick = (info: { event: React.MouseEvent; node: any }) => {
    info.event.preventDefault();
    setDropdownVisible(false);
    console.log('right =======> ', info?.node, info?.node?.isVisible, info?.node?.haveNextlevel);
    setDropdownVisible(true);
    setDropdownX(info.event.clientX);
    setDropdownY(info.event.clientY);
    // changeItemName(info?.node);
    setRightClickedRecord({ ...rightClickedRecord, ...info.node });
  };

  const onClickNode = (selectedKeys: any, e: any) => {
    const { node } = e;
    const info = { expanded: true, node: {} };
    setDropdownVisible(false);
    // handleExpand(selectedKeys, info)
    // openSidePane(node.a_attr.LogicalName, node.id, node); /////// this
  };

  const handleExpand = (
    expandedKeys: Key[],
    info: { expanded: boolean; node: any }
  ) => {
    const { node, expanded } = info;
    console.log('expand ====> ', expandedKeys);
    
    setExpandedKeys(expandedKeys);
  };

  const retrieveWorkItemData = useCallback(async(info?: any) => {
    // const response = await retrieveTreeDataRequest(info);
    // console.log('res data ===> ', response);
    // setTreeData(response);
    setTreeData(res_one);
    res_one.map((data: any) => {
      if (data.checked)
        setCheckedKeys([...checkedKeys, data.key])
    })
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
    retrieveWorkItemData()
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

  // get logical name for current entity
  const findEntityDetails = useCallback(async() => {
    const currentLogicalName = await window.parent.Xrm.Page.ui._formContext.contextToken.entityTypeName;
    console.log('current logical name ====> ', currentLogicalName);
    const result = await window.parent.Xrm.Page.ui.formContext.data.entity.getId();
    // const str = '{AC3FE85C-90E5-ED11-A7C7-000D3A338DD2}';
    const removedBrackets = result.replace(/[{}]/g, '');
    console.log('entity id -=======> ', removedBrackets, result);
  }, []);

  // useEffect(() => {
  //   findEntityDetails();
  // }, []);

  console.log("mmm==> ", dropdownVisible);
  

  return (
    <div className="custom-container" id="custom-container" ref={dropdownRef}>
      <p>Tree Component</p>
      {treeData && treeData.length > 0 ? (
        <div id="treeElement">
          <Spin spinning={isLoading}>
            <DirectoryTree
              className="draggable-tree"
              // checkable
              // checkedKeys={checkedKeys}
              // onCheck={onCheck}
              defaultExpandedKeys={expandedKeys}
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
              loadData={onLoadHandler}
              titleRender={(node: any) => {
                return (
                  <TitileViewComponent node={node}/>
                );
              }}
            />
          </Spin>
          {dropdownVisible && (
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
          )}
        </div>
      ) : (
        <div>
          <Spin size='small' />
        </div>
      )}
    </div>
  )
}

export default memo(TreeViewComponent);
