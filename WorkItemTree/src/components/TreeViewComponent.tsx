import {Button, Spin, notification } from 'antd';
import Tree, { TreeProps } from "antd/es/tree";
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import TitileViewComponent from './TitileViewComponent';
import { Key } from 'antd/es/table/interface';
import { loadResourceString, retrieveTreeDataRequest } from '../apis/data.retrieve.apis';
import { DropDownItems, LogicalNames, formText, paneValues } from '../constants';
import { copyWorkItemRequest, updateTreeDataRequest } from '../apis/data.save.apis';
import { DownOutlined } from '@ant-design/icons';
import {sampleDBData} from '../samples/data.sample';
import DropDownComponent from './DropDownComponent';
import { items } from '../constants/items';
import { openSidePane } from '../utils/pane.open.utils';
import { languageConstantsForCountry } from "../constants/languageConstants";
import AddToWITemp from './AddToWITemp';
import { getAllWorkItemList } from '../apis/reuseWiApis.apis';



declare global {
  interface Window {
    Xrm: any;
  }
}
const  TreeViewComponent = ({imageUrl}: {imageUrl: string}) => {
  const {DirectoryTree} = Tree;
  const dropdownRef = useRef<any>(null);
  const rightClickRef = useRef<any>(null)
  const [loadedData, setLoadedData] = useState<any>({});
  const [treeData, setTreeData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]); // "e3b4d193-4b21-ee11-9cbc-6045bdd0ef22"
  const [previousExpandedKeys, setPreviousExpandedKeys] = useState<any[]>([]);
  const [rightClickedRecord, setRightClickedRecord] = useState<any>();
  const [copiedRecord, setCopiedRecord] = useState<Object>({});
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [dropdownX, setDropdownX] = useState<number>(0);
  const [dropdownY, setDropdownY] = useState<number>(0);
  const [type, setType] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [openAddToWiTempForm, setOpenAddToWiTempForm] = useState<boolean>(false);
  const [isWITempModalOpen, setIsWITempModalOpen] = useState(false);
  const [workItemTemplateList, setWorkItemTemplateList] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(
    []
    // treeData.flatMap((node: any) => node?.key?.toString())
  );
  const [currentLogicalName, setCurrentLogicalName] = useState<string>("");
  const [currentTabExpand,setCurrentTabExpand] =useState<boolean>(false);
  // const [noData, setNoData] = useState<string>("No Data Found");
  // const [copySuccess, setCopySuccess] = useState<string>("Record copied successfully");
  // const [copyFailed, setCopyFailed] = useState<string>("Record copied Failed");
  // const [errorText, setErrorText] = useState<string>("Error");
  // const [successText, setSuccessText] = useState<string>("Success");
  // const [failedToChangeSequence, setFailedToChangeSequence] = useState<string>("Failed to change sequence..!");
  const [languageConstants, setLanguageConstants] = useState<any>(
    languageConstantsForCountry.en
  );

  const [textObject, setTextObject] = useState<object>({
    saveErrorMessage: "",
    saveSuccessMessage: "",
  })
  const [shiftPressed, setShiftPressed] = useState<boolean>(false);
  const [isDisable, setIsDisable] = useState<boolean>(false);

  const currentLogicalNameData = useRef(null);
  const currentSurveyTemplate = useRef(null)
  const currentInternalId = useRef(null)
  const currentWorkItemTemplateId = useRef(null);

  const [currentState, setCurrentState] = useState<boolean>(false);

  let parentValue: any = null;
  let parentValueDrop: any = null;

  // const loadResourceString = async () => {

  //   const url = await window.parent.Xrm.Utility.getGlobalContext().getClientUrl();
  //   const language = await window.parent.Xrm.Utility.getGlobalContext().userSettings.languageId;
  //   console.log('language ====> ', language);
  //   const webResourceUrl = `${url}/WebResources/gyde_localizedstrings.${language}.resx`;

  //   try {
  //     const response = await fetch(`${webResourceUrl}`);
  //     const data = await response.text();
  //     const filterKeys = ['noData', 'copySuccess', 'copyFailed', 'errorText', 'successText', "failedToChangeSequence"]; // Replace with the key you want to filter
  //     filterKeys.map((filterKey: string, index: number) => {
  //       const parser = new DOMParser();
  //       // Parse the XML string
  //       const xmlDoc = parser.parseFromString(data, "text/xml");
  //       // Find the specific data element with the given key
  //       const dataNode: any = xmlDoc.querySelector(`data[name="${filterKey}"]`);
  //       // Extract the value from the data element
  //       const value: any = dataNode?.querySelector("value").textContent;

  //       if (index === 0 && value) {
  //         setNoData(value)
  //       }
  //       if (index === 1 && value) {
  //         setCopySuccess(value)
  //       }
  //       if (index === 2 && value) {
  //         setCopyFailed(value)
  //       }
  //       if (index === 3 && value) {
  //         setErrorText(value)
  //       }
  //       if (index === 4 && value) {
  //         setSuccessText(value)
  //       }
  //       if (index === 5 && value) {
  //         setFailedToChangeSequence(value)
  //       }
  //       console.log('data ====> ',  index, value);
  //     });
  //     // this.setState({ data });
  //   } catch (error) {
  //     console.error('Error loading data:', error);
  //   }
  // }
 useEffect(()=> {
  console.log("UserEffectTrigger");
  
   getCurrentTab();
   _getAllWorkItemList();
 },[])
  const getCurrentTab = ()=> {
    let currentTab;
    window?.parent?.Xrm.Page.ui.formContext.ui.tabs.get().forEach((tab:any)=>{
      console.log("tab Current",tab)
  console.log(tab?.getDisplayState())
     if (tab.getDisplayState() === "expanded" && tab?._controlName === "reuseWI") {
         currentTab = tab.getLabel()
         setCurrentTabExpand(true)
     }

  })
  }

  
  
  const messageHandler = async () => {
    try {
      const languageConstantsFromResourceTable = await loadResourceString();
      if (languageConstantsFromResourceTable?.data && languageConstants?.length) {
        console.log("languageConstantsFromResTable 2", languageConstantsFromResourceTable);
        const refactorResourceTable = languageConstantsFromResourceTable?.data.reduce((result: any, currentObject: any) => {
          return Object.assign(result, currentObject);
        }, {});
        if (Object.keys(refactorResourceTable).length) {
          const originalConstants = languageConstants[0];
          const updatedValues = refactorResourceTable[0];
          for (const key in updatedValues) {
            if (key in updatedValues && key in originalConstants) {
              originalConstants[key] = updatedValues[key];
            }
          }
          setLanguageConstants(originalConstants);
        }
      }
    } catch (error) {
      console.log('error ====>', error);
    }
  }
  const retriveTemplateHandler = async () => {
    try {
      const currentLocation = await window.parent.Xrm.Page.ui._formContext.contextToken.entityTypeName;
      console.log('currentLocation==> ', currentLocation);
      
      let surveyTemplate = ''
      if (currentLocation === LogicalNames?.SURVEY) {
        surveyTemplate = await window.parent.Xrm.Page.data.entity
          .getId()
          .replace("{", "")
          .replace("}", "");
        console.log('1 ==> ', surveyTemplate);
        
      } else if (currentLocation == LogicalNames?.WORKITEM) {
        surveyTemplate = await window.parent.Xrm.Page.data.entity
          .getId()
          .replace("{", "")
          .replace("}", "")
        console.log('2 ==> ', surveyTemplate);
      } else {
        surveyTemplate = await window.parent.Xrm.Page.getAttribute("gyde_surveytemplate")?.getValue()[0]?.id?.replace("{", "")
          .replace("}", "");
        console.log('3 ==> ', surveyTemplate);
      }
      
      console.log('id ===> ', surveyTemplate);
      
      window.parent.Xrm.WebApi.retrieveRecord(currentLocation === LogicalNames?.WORKITEM ? LogicalNames?.WORKITEM : LogicalNames?.SURVEY, surveyTemplate, "?$select=statuscode").then(
        function success(result: any) {
            console.log("result status ====>", result.statuscode, (currentLogicalName === LogicalNames?.SURVEY && (result.statuscode == 528670003 || result.statuscode == 528670005 || result.statuscode == 2)), (currentLogicalName === LogicalNames?.WORKITEM && (result.statuscode == 528670001 || result.statuscode == 528670002 || result.statuscode == 2)), ((currentLogicalName !== LogicalNames?.WORKITEM && currentLogicalName !== LogicalNames?.SURVEY) && (result.statuscode == 528670003 || result.statuscode == 528670005 || result.statuscode == 2)), (
              (currentLocation === LogicalNames?.SURVEY && (result.statuscode == 528670003 || result.statuscode == 528670005 || result.statuscode == 2)) 
              ||
              (currentLocation === LogicalNames?.WORKITEM && (result.statuscode == 528670001 || result.statuscode == 528670002 || result.statuscode == 2))
              ||
              ((currentLocation !== LogicalNames?.WORKITEM && currentLocation !== LogicalNames?.SURVEY) && (result.statuscode == 528670003 || result.statuscode == 528670005 || result.statuscode == 2))
            ) );
            if (
              (currentLocation === LogicalNames?.SURVEY && (result.statuscode == 528670003 || result.statuscode == 528670005 || result.statuscode == 2)) 
              ||
              (currentLocation === LogicalNames?.WORKITEM && (result.statuscode == 528670001 || result.statuscode == 528670002 || result.statuscode == 2))
              ||
              ((currentLocation !== LogicalNames?.WORKITEM && currentLocation !== LogicalNames?.SURVEY) && (result.statuscode == 528670003 || result.statuscode == 528670005 || result.statuscode == 2))
            ) {
              setIsDisable(true)
            } else {
              setIsDisable(false);
            }
            // perform operations on record retrieval
        },
        function (error: any) {
            console.log("error message ====> ", error.message);
            setIsDisable(false);
            // handle error conditions
        }
      );
    } catch (error: any) {
      console.log("error22 message ====> ", error);
      setIsDisable(false);
    }
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
    const dropKey = info?.node?.key;
    const dragKey = info?.dragNode?.key;
    const dropPos = info?.node?.pos?.split("-");
    const dropPosition =
      info?.dropPosition - Number(dropPos[dropPos.length - 1]);

    // const isReparenting = !(parentValue.key === parentValueDrop.key)    
    const isReparenting = !(shiftPressed && (info?.node.parentSequanceId && info?.dragNode.parentSequanceId) && (info?.node.parentSequanceId === info?.dragNode.parentSequanceId));    

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
        message: languageConstants?.WorkItemTree_WorkItemTreer_ErrorText,
        description: languageConstants?.WorkItemTree_FailedToChangeSequence,
      });
    } else {
      // setTreeData([]);
      // setPreviousExpandedKeys(expandedKeys)
      // setExpandedKeys([]);
      setTimeout(async() => {
        await retrieveWorkItemData(false);
        // setExpandedKeys(previousExpandedKeys);
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
    setRightClickedRecord({ ...info.node });
    rightClickRef.current = info.node
    setDropdownVisible(false);
    
    setDropdownX(info.event.clientX);
    setDropdownY(info.event.clientY);
    // changeItemName(info?.node);
    // setRightClickedRecord({ ...info.node });
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
    setDropdownVisible(false);
    setCurrentState(false);
    // if (!expandedKeys.includes(expandedKey)) {
    //   setExpandedKeys([...expandedKeys, expandedKey]);
    // }
    setExpandedKeys(expandedKeySet);
  };

  const expandCurrentLocationNodesByKey = (state?: boolean) => {
    setIsLoading(true);
    setPreviousExpandedKeys(expandedKeys);
    setExpandedKeys([]);
    const data = treeData;
    setTreeData([]);
    setTimeout(() => {

      setExpandedKeys(state ? previousExpandedKeys : loadedData?.currentNodeWorkitems)
      setTreeData(data);
      setCurrentState(!state);
      // setExpandedKeys([
      //   "e3b4d193-4b21-ee11-9cbc-6045bdd0ef22",
      //   "e3b4d193-4b21-ee11-9cbc-6045bdd0ef24412",
      //   "e3b4d193-4b21-ee11-9cbc-6045bdd0ef241242",
      // ])
      setIsLoading(false);
    }, 100);
  };

  const retrieveWorkItemData = useCallback(async(info?: boolean) => {
    console.log('iiiiiiijjjjjj ====> ', info);
    
    setIsLoading(true);
    const response: any = await retrieveTreeDataRequest({}, info, currentLogicalNameData, currentSurveyTemplate, currentInternalId, currentWorkItemTemplateId);
    console.log('res data ===> ', response);
    setLoadedData(response)
    setTreeData(response?.workItems);
    // loadResourceString();
    messageHandler();
    setIsLoading(false);
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
    console.log("check",info, "info?.checkedNodes",info?.checkedNodes ,"checkedKeys",checkedKeys);
    
    // setCheckedKeys(Array.isArray(checkedKeys) ? checkedKeys : checkedKeys.checked);
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
    // console.log('Checked Values:', checkedValues);
    // console.log('Not Checked Values:', notCheckedValues);
  };

  const onClick = ({key, rightClickedRecordData}: {key: string, rightClickedRecordData: any}) => {
    const rightClickedRecordDetails = rightClickRef.current
    // const {key} = prop;
    switch (key) {
      
      
      case "1": {
        // Copy functionality invoked...
        setDropdownVisible(false);
        copyWorkItemRequest(rightClickedRecordDetails, retrieveWorkItemData, languageConstants?.WorkItemTree_CopySuccess, languageConstants?.WorkItemTreer_CopyFailed, languageConstants?.WorkItemTree_SuccessText, languageConstants?.WorkItemTreer_ErrorText);
        // openSidePane(loadedData.logicalName, rightClickedRecordDetails.key, rightClickedRecordDetails, true);
        setIsModalOpen(true);
        setCopiedRecord({ ...rightClickedRecordDetails });
        rightClickRef.current = null;
        // openSidePane(loadedData.logicalName, rightClickedRecord.key, rightClickedRecord, true);
        break;
      }
      default:
        break;
    }
    // setTreeData([...treeData]);
  };

  useEffect(() => {
    retrieveWorkItemData(true);
    const currentLogicalName = window.parent.Xrm.Page.ui._formContext.contextToken.entityTypeName;
    setCurrentLogicalName(currentLogicalName);
    retriveTemplateHandler();
    // const data = sampleDBData.workItems;
    // setTreeData(data);
    // setLoadedData(sampleDBData);
  }, []);

  const handleClickOutside = (event: any) => {
    // console.log('evenfe ==. ', event, dropdownRef.current, event.target instanceof Node, dropdownRef.current.contains(event.target as HTMLDivElement), dropdownRef.current && !(event.target instanceof Node && dropdownRef.current.contains(event.target as HTMLDivElement)));
    
    if (dropdownRef.current && !(event.target instanceof Node && dropdownRef.current.contains(event.target as HTMLDivElement))) {
      // console.log('lllllllllll', event.toElement, event.toElement?.textContent);
      if (event.toElement?.textContent === DropDownItems?.COPY) {
        onClick({key: "1", rightClickedRecordData: rightClickedRecord});
      } else if (event.toElement?.textContent === paneValues.COPY) {
        console.log('copy of side pane');
      } else if (
        event.toElement?.textContent === paneValues.SAVE || 
        event.toElement?.textContent === paneValues.SAVEANDCLOSE || 
        event.toElement?.textContent === paneValues.DEACTIVATE || 
        event.toElement?.textContent === paneValues.DELETE
      ) {
        setTimeout(() => {
          retrieveWorkItemData(false);
        }, 3000)
        // retrieveWorkItemData(false);
      } else {
        rightClickRef.current = null;
      }
      
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const _getAllWorkItemList = async () => {
    const allWiList: any = await getAllWorkItemList();
    console.log("ALLLLLL", allWiList);

    if(allWiList?.data?.length)
      setWorkItemTemplateList(allWiList?.data);
  }

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'Shift') {
        setShiftPressed(true);
      }
    };

    const handleKeyUp = (event: any) => {
      if (event.key === 'Shift') {
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

  const handleAddToWorkItemTemplatePopup = () => {

  }
  return (
    <div className="custom-container tree-container" id="custom-container" ref={dropdownRef}>
      <Spin spinning={isLoading}>
        {treeData && treeData.length > 0 ? (
          <div>
            {(currentLogicalName !== LogicalNames.WORKITEM && currentLogicalName !== LogicalNames.SURVEY) && (
              <div className="btn-location-wrap">
                <button className={`btn-data ${currentState ? '' : 'active'}`} onClick={() => expandCurrentLocationNodesByKey(currentState)}>
                  {/* {currentState ? formText.ALLBUTTON : formText.CURRENTLOCATIONBUTTON} */}
                  {formText.ALLBUTTON}
                </button>
               <button className={`btn-data right ${currentState ? 'active' : ''}`} onClick={() => expandCurrentLocationNodesByKey(currentState)}>
                 {formText.CURRENTLOCATIONBUTTON}
                </button>
             </div>
            )}
            <div id="treeElement">
              
                <DirectoryTree
                  className="draggable-tree"
                   checkable = {currentTabExpand ? true:false}
                   checkStrictly={true}
                  // checkedKeys={checkedKeys}
                  onCheck={onCheck}
                  // defaultExpandedKeys={expandedKeys}
                  expandedKeys={expandedKeys}
                  draggable={!isDisable}
                  // draggable
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
                      <TitileViewComponent node={node} imageUrl={imageUrl}/>
                    );
                  }}
                />
              
              {dropdownVisible && !isDisable && (
                <div>
                <DropDownComponent
                  items={items}
                  dropdownVisible={dropdownVisible}
                  hideDropDown={hideDropDown}
                  dropdownY={dropdownY}
                  dropdownX={dropdownX}
                  handleClick={onClick}
                />
              </div>
              )}
            </div>
            
          </div>
          
        ) : (
          <div>
            <p>{languageConstants?.WorkItemTree_NoData}</p>
          </div>
        )}
      </Spin>
      <div style={{textAlign: "right"}}>
                <Button type="primary" onClick={() => setIsWITempModalOpen(true)}>Add To Work Item Template</Button>
      </div>
      {
        isWITempModalOpen ?
          <AddToWITemp
            setIsWITempModalOpen={setIsWITempModalOpen}
            isWITempModalOpen={isWITempModalOpen}
            workItemTemplateList={workItemTemplateList}
          /> :
          <>
          </>
      }
    </div>
  )
}

export default memo(TreeViewComponent);
