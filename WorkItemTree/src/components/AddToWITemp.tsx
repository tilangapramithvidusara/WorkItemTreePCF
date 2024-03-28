import {
  Button,
  Checkbox,
  Dropdown,
  Form,
  Input,
  MenuProps,
  Modal,
  notification,
  Radio,
  Select,
  Spin,
  Switch,
} from "antd";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  getAllWorkItemType,
  getSurveyListByWorkItemId,
  getTemplatebyType,
  getWorkItemsListByWorkItemTemplateId,
  migrateWotkItemdata,
} from "../apis/reuseWiApis.apis";
import { alphabeticalKey, businessProcessKey, defaultKey, idKey, workItemKey } from "../constants/filterKeys";

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const AddToWITemp = ({
  setIsWITempModalOpen,
  isWITempModalOpen,
  workItemTemplateList,
  workItemTreeList,
  reUseazUrl
}: any) => {
  const [form] = Form.useForm();
  const [workItemList, setWorkItemList] = useState([]);
  const [subWorkItemList, setSubWorkItemList] = useState([]);
  const [surveyList, setSurveylist] = useState([]);
  const [partnerNodes, setPartnetNodes] = useState(false);

  const [loadedApiData, setLoadedApiData] = useState(false);
  const [workitemTemplate, setWorkitemTemplate] = useState("");
  const [surveyTemplate, setSurveyTemplate] = useState("");
  const [parentSurveyWorkItem, setParentSurveyWorkItem] = useState("");
  const [surveyTemplateItemType, setSurveyTemplateItemType] = useState("");
  const [onLookupItem, setOnLookupItem] = useState("");
  const [templateBytype, setTemplateBytype] = useState([]);
  const [sortAlphabetically, setSortAlphabetically] = useState(false);
  const [sortOption, setSortOption] = useState("alphabetical");
  const [allWorkItemType, setAllWorkItemType] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);

  const [doRequest, setDoRequest] = useState(false)

  const handleChangeSort = (checked: boolean) => {
    setSortAlphabetically(!sortAlphabetically);
  };

  const onLookupChange = (value: string) => {
    setOnLookupItem(value);
    // console.log("ONLOOKUP");
  };

  const onFinish = (values: any) => {
    console.log(values);
  };
  // const customDescription = (
  //   <div>
  //     Survey work items are being updated in the background. An async process will run where the Survey Work Items selected will be associated to the new work item template through the work item template sequence entity. This means that new Work Item template sequence records will be created joining the work item template specified to the survey work items selected and new relationships will be created off the survey work item record to the Chapter, Section or Question specified.
  //     <br />
  //     <br />
  //     <span style={{ color: 'blue', fontWeight: 'bold' }}>Go to workitem template</span>
  //   </div>
  // );
  const handleSaveWorkItem = () => {
    try {
      var userSettings =
        window.parent.Xrm.Utility.getGlobalContext().userSettings;

      var currentuserid = userSettings.userId;
      let inputString = currentuserid;
      let userid = inputString.replace(/[{}]/g, "");

      // console.log(userid);

      if(workItemTreeList?.length){
        const payload = {
          userId: userid,
          workItemteplateId: workitemTemplate,
          surveyTemplateId: surveyTemplate,
          parentSurveyWorkItemId: parentSurveyWorkItem,
          surveyTemplateItemType: surveyTemplateItemType,
          relatedSurveyItemLookup: onLookupItem,
          copyPartnerNotes: partnerNodes,
          data: workItemTreeList,
        };
        console.log("payload", payload);
  
        migrateWotkItemdata(reUseazUrl,payload);
        //  notification.success({ message:'Survey work items updating is in progress',description:customDescription})
        setIsWITempModalOpen(false);
      }else{
        notification.error({ message:'Select the work item'})
      }
     
    } catch (e) {
      console.log("err", e);
    }
  };

  const handleCancel = () => {
    setIsWITempModalOpen(false);
  };

  const onWorkItemTemplateChange = async (input: any) => {
    console.log("On Selected WI", input);

    setLoadedApiData(false);
    try {
      form.resetFields(['Survey Template']);
      form.resetFields(['Related Survey Item Lookup']);
      form.resetFields(['Survey Template Item Type']);
      form.resetFields(['Parent Survey Work Item']);
      setSurveyTemplate('')
      setOnLookupItem('')
      await getSurveyTemplateListByWorkItemTemplateId(input);
      await _getSurveyListByWorkItemId(input);
      setLoadedApiData(true);
      setWorkitemTemplate(input);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const _getSurveyListByWorkItemId = async (workItemId: any) => {
    try {
      const surveyList = await getSurveyListByWorkItemId(workItemId);
      if (!surveyList?.error) setSurveylist(surveyList?.data);
    } catch (error) {
      console.error("Error fetching survey templates 1", error);
    }
  };

  const getSurveyTemplateListByWorkItemTemplateId = async (workItemTemplateId: string) => {
    try {
      const getWorkItemList = await getWorkItemsListByWorkItemTemplateId(
        workItemTemplateId
      );
      // console.log('p ===> ', getWorkItemList);
      
      if (!getWorkItemList?.error) {
        let workItemListValues: any = getWorkItemList?.data;
        const values = await workItemListValues.sort((a: {gyde_name: string}, b: {gyde_name: string}) => (a.gyde_name).localeCompare(b.gyde_name))
        console.log("d ==> ", (workItemListValues[0] as any)?.gyde_name, (values[0]  as any)?.gyde_name);
      
        setSubWorkItemList(values);
        setWorkItemList(values)
        // setWorkItemList(getWorkItemList?.data);
        // setSubWorkItemList(getWorkItemList?.data);
      }
    } catch (error) {
      console.error("Error fetching survey templates 2", error);
    }
  };

  const onSurveyTemplateChange = async (selectedTemplate: any) => {
    setSurveyTemplate(selectedTemplate);
    form.resetFields(['Related Survey Item Lookup']);
      setOnLookupItem('')
    console.log("selectedTemplate", selectedTemplate);
    // await getSurveyListByWorkItemId(selectedTemplate)
  };

  const onParentSurveyWIChange = (parentWI: any) => {
    setParentSurveyWorkItem(parentWI);
    console.log("onParentSurveyWIChange", parentWI);
  };

  const onSurveyTemplateTypeChange = async (surveyTempType: any) => {
    try {
      setSurveyTemplateItemType(surveyTempType);
      setOnLookupItem('')
      form.resetFields(['Related Survey Item Lookup']);
      const workItemTemplateByType = await getTemplatebyType(
        surveyTemplate,
        surveyTempType
      );
      console.log("workItemTemplateByType", workItemTemplateByType);
      if (!workItemTemplateByType?.error) {
        let workItemListValues: any = workItemTemplateByType?.data;
        const values = await workItemListValues.sort((a: {gyde_name: string}, b: {gyde_name: string}) => (a.gyde_name).localeCompare(b.gyde_name))
        console.log("valuess -- ==> ", (workItemListValues[0] as any)?.gyde_name, (values[0]  as any)?.gyde_name);
        setTemplateBytype(values);
        // setTemplateBytype(workItemTemplateByType?.data);
      }
        
      console.log("onSurveyTemplateTypeChange", surveyTempType);
    } catch (error) {
      console.error("Error fetching survey templates types", error);
    }
  };

  const sortingWIList = async(workItemListSub: any, sortingOption: string) => {
    // sortAlphabeticallySub: boolean, 
    setLoadedApiData(false)
    // if (sortAlphabeticallySub) {
    //   setDoRequest(true)
    //   let workItemListValues: any = workItemListSub;
    //   const values = await workItemListValues.sort((a: {gyde_name: string}, b: {gyde_name: string}) => (a.gyde_name).localeCompare(b.gyde_name))
    //   console.log("d ==> ", (workItemListValues[0] as any)?.gyde_name, (values[0]  as any)?.gyde_name);
      
    //   setSubWorkItemList(values);
    // } else {
    //   if (doRequest) {
    //     await getSurveyTemplateListByWorkItemTemplateId(workitemTemplate);
    //     setDoRequest(false)
    //   }
    // }

    if (sortingOption === defaultKey) {
      if (doRequest) {
        await getSurveyTemplateListByWorkItemTemplateId(workitemTemplate);
        setDoRequest(false)
      }
    } else if (sortingOption === alphabeticalKey) {
      setDoRequest(true)
      let workItemListValues: any = workItemListSub;
      setSubWorkItemList(workItemListSub);
      // const values = await workItemListValues.sort((a: {gyde_name: string}, b: {gyde_name: string}) => (a.gyde_name).localeCompare(b.gyde_name))
      // console.log("d ==> ", (workItemListValues[0] as any)?.gyde_name, (values[0]  as any)?.gyde_name);
      
      // setSubWorkItemList(values);
    } else if (sortOption === 'id') {
      setDoRequest(true)
      let workItemListValues: any = workItemListSub;
      const values = await workItemListValues.sort((a: any, b: any) => {
        const valueA =
        (a[businessProcessKey] === "" || !a[businessProcessKey]) ? Infinity : parseInt(a[businessProcessKey]);
        const valueB =
          (b[businessProcessKey] === "" || !b[businessProcessKey]) ? Infinity : parseInt(b[businessProcessKey]);

        return valueA - valueB;
      });
      //        //  (a?.['workitem.gyde_apcqbusinessprocessid'])?.localeCompare(b?.['workitem.gyde_apcqbusinessprocessid'])

      console.log("d ==> ", (workItemListValues[0] as any)?.['workitem.gyde_apcqbusinessprocessid'], (values[0]  as any)?.['workitem.gyde_apcqbusinessprocessid']);
      
      setSubWorkItemList(values);
    } else if (sortOption === workItemKey) {
      if (selectedValues.length > 0) 
        onChangeWorkItemFilterHandler(selectedValues);
      else
        setSubWorkItemList(workItemListSub);
      // workItemListSub
    }
    setLoadedApiData(true)
  }

  const onChangeWorkItemFilterHandler = (valueItems: any) => {
    // console.log('ssss ==> ', valueItems);
    setLoadedApiData(true);
    let workItemListValues: any = workItemList;
    const filteredArray = workItemListValues.filter((item: any) => valueItems.includes(item?.['workitem.gyde_workitemtype@OData.Community.Display.V1.FormattedValue']));
    // console.log('filteredArray ==> ', filteredArray);
    
    setSubWorkItemList(filteredArray);
    setSelectedValues(valueItems);
    // do filter
    // let workItemListValues: any = workItemList;
    // const filteredArray = workItemListValues?.filter((item: any) => {
    //   // Check if any property of the item meets the filter condition
    //   return item?.['workitem.gyde_workitemtype@OData.Community.Display.V1.FormattedValue'] == valueItem
    //   // return Object.values(item).some(value => {
    //   //   // Replace 'filterCondition' with your actual filter condition
    //   //   return value.includes(filterCondition); // Example: Check if the value includes the filter condition
    //   // });
    // });
    // setSubWorkItemList(filteredArray);
    
  }

  const handleSortChange = (event: any) => {
    sortingWIList(workItemList, event?.target?.value);
    setSortOption(event?.target?.value);
  }

  const retrieveAllWorkItemType = useCallback(async() => {
    const response = await getAllWorkItemType();
    setAllWorkItemType(response?.data || []);
  }, []);



  useEffect(() => {
    retrieveAllWorkItemType();
  }, [])

  // useEffect(() => {
  //   sortingWIList(sortAlphabetically, workItemList, sortOption);
  // }, [sortAlphabetically, workItemList, sortOption])
  console.log('workItemList ==> ', subWorkItemList?.length > 0 ? (subWorkItemList[0] as any)?.gyde_name : '');
  
  return (
    <div>
      <Modal
        title="Add To Work Item Template"
        open={isWITempModalOpen}
        // onOk={handleOk}
        footer={null}
        onCancel={handleCancel}
      >
        <Form
          {...layout}
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          style={{ width: "600px", margin: "auto" }}
        >
          <Form.Item
            name="wiTemp"
            label=" Work Item Template:"
            rules={[{ required: true }]}
            style={{ marginTop: "20px" }}
          >
            <Select
              placeholder="Select Template"
              onChange={onWorkItemTemplateChange}
              style={{ width: "250px" }}
            >
              {workItemTemplateList &&
                workItemTemplateList?.map((workItemList: any) => {
                  return (
                    <Option value={workItemList?.gyde_workitemtemplateid}>
                      {workItemList?.gyde_name}
                    </Option>
                  );
                })}
            </Select>
          </Form.Item>

          <Form.Item
            name="Survey Template"
            label="Survey Template:"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select Template"
              onChange={onSurveyTemplateChange}
              style={{ width: "250px" }}
              disabled={workitemTemplate ? false : true}
              
            >
              {loadedApiData ? (
                <>
                  {surveyList &&
                    surveyList?.map((survey: any) => {
                      return (
                        <Option value={survey?.gyde_surveytemplateid}>
                          {survey?.gyde_name}
                        </Option>
                      );
                    })}
                </>
              ) : (
                <Spin />
              )}
            </Select>
          </Form.Item>

          {/**<Form.Item
            name="Parent Survey Work Item"
            label="Parent Survey Work Item:"
            rules={[{ required: false }]}
          >
            <Select
              placeholder="Select Item"
              onChange={onParentSurveyWIChange}
              style={{ width: "250px" }}
              disabled={workitemTemplate ? false : true}
              
            >
              {loadedApiData ? (
                <>
                  {workItemList &&
                    workItemList?.map((survey: any) => {
                      return (
                        <Option value={survey?.gyde_workitemid}>
                          {survey?.gyde_name}
                        </Option>
                      );
                    })}
                </>
              ) : (
                <Spin />
              )}
            </Select>
              </Form.Item>*/}
          
          <Radio.Group disabled={workItemList?.length > 0 ? false : true} onChange={handleSortChange} value={sortOption}>
              {/* <Radio value="default">Default</Radio> */}
              <Radio value={alphabeticalKey}>Sort Alphabetically</Radio>
              <Radio value={idKey}>Order by Business Process Id</Radio>
              <Radio value={workItemKey}></Radio> 
              {/* Filter by Work Item Type */}
            </Radio.Group>
            {sortOption === workItemKey && (
              <Select
                mode='multiple'
                placeholder="Select Work Item Type"
                onChange={onChangeWorkItemFilterHandler}
                disabled={allWorkItemType?.length > 0 ? false : true}
                value={selectedValues}
                style={{ width: "250px" }}
              >
                {allWorkItemType?.map((itemValue: any) => {
                  return (
                    <Option key={`${itemValue?.gyde_workitemtypeid}-types`} value={itemValue?.gyde_name}>{itemValue?.gyde_name}</Option>
                  )
                })}
                {/* <Option value="chapter">Chapter</Option>
                <Option value="section">Section</Option>
                <Option value="question">Question</Option> */}
              </Select>
            )}
          <Form.Item
            name="Parent Survey Work Item"
            label="Parent Survey Work Item:"
            rules={[{ required: false }]}
          >
            {/* <span style={{ marginRight: '8px' }}>Original</span>
              <Switch
                disabled={workItemList?.length > 0 ? false : true}
                checked={sortAlphabetically}
                onChange={() => setSortAlphabetically(!sortAlphabetically)} 
              />
            <span style={{ marginLeft: '8px' }}>Sort Alphabetically</span> */}
            
            <Select
              placeholder="Select Item"
              style={{ width: "250px" }}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option: any) =>
                option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
              }
              disabled={workItemList?.length > 0 ? false : true}
            >
              {loadedApiData ? (<>
                {(subWorkItemList?.length > 0) && (
                  <>
                    {subWorkItemList.map((survey: any) => (
                      <Option key={survey?.gyde_workitemid} value={survey?.gyde_workitemid}>
                        {survey?.gyde_name}
                      </Option>
                    ))}
                  </>
                )}
              </>) : <Spin />}
              
            </Select>
          </Form.Item>

          <Form.Item
            name="Survey Template Item Type"
            label="Survey Template Item Type:"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select Type"
              onChange={onSurveyTemplateTypeChange}
              disabled={workitemTemplate && surveyTemplate ? false : true}
              style={{ width: "250px" }}
            >
              <Option value="chapter">Chapter</Option>
              <Option value="section">Section</Option>
              <Option value="question">Question</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="Related Survey Item Lookup"
            label="Related Survey Item Lookup:"
            rules={[{ required: true }]}
          >
            <Select
              optionFilterProp="children"
              filterOption={(input, option: any) =>
                option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
              }
              showSearch
              placeholder="Select Item"
              onChange={onLookupChange}
              style={{ width: "250px" }}
              disabled={surveyTemplate && surveyTemplateItemType ? false : true}
              
            >
              {templateBytype &&
                templateBytype?.map((workItemList: any) => {
                  return (
                    <Option
                      value={
                        surveyTemplateItemType === "chapter"
                          ? workItemList?.gyde_surveytemplatechapterid
                          : surveyTemplateItemType === "section"
                          ? workItemList?.gyde_surveytemplatechaptersectionid
                          : surveyTemplateItemType === "question"
                          ? workItemList?.gyde_surveytemplatechaptersectionquestionid
                          : ""
                      }
                    >
                      {workItemList?.gyde_name}
                    </Option>
                  );
                })}
            </Select>
          </Form.Item>

          <div>
            <Checkbox onChange={(e) => setPartnetNodes(e?.target?.checked)}>
              Copy Partner Notes
            </Checkbox>
          </div>
        </Form>
        <div className="wi-template-div-btn">
          <Button
            className="wi-template-csl-btn"
            type="primary"
            ghost
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            className="wi-template-save-btn"
            onClick={handleSaveWorkItem}
            disabled= {workitemTemplate && surveyTemplate && onLookupItem ? false : true}
          >
            Save
          </Button>
        </div>
        <div></div>
      </Modal>
    </div>
  );
};

export default memo(AddToWITemp);
