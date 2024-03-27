import {
  Button,
  Checkbox,
  Dropdown,
  Form,
  Input,
  MenuProps,
  Modal,
  notification,
  Select,
  Spin,
  Switch,
} from "antd";
import React, { memo, useEffect, useState } from "react";
import {
  getSurveyListByWorkItemId,
  getTemplatebyType,
  getWorkItemsListByWorkItemTemplateId,
  migrateWotkItemdata,
} from "../apis/reuseWiApis.apis";

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

  const [doRequest, setDoRequest] = useState(false)

  const handleChangeSort = (checked: boolean) => {
    setSortAlphabetically(!sortAlphabetically);
  };

  const onLookupChange = (value: string) => {
    setOnLookupItem(value);
    console.log("ONLOOKUP");
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

      console.log(userid);

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
      await getSurveyTemplateListByWorkItemId(input);
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

  const getSurveyTemplateListByWorkItemId = async (workItemId: string) => {
    try {
      const getSurveyTemplateList = await getWorkItemsListByWorkItemTemplateId(
        workItemId
      );
      console.log('p ===> ', getSurveyTemplateList);
      
      if (!getSurveyTemplateList?.error) {
        setWorkItemList(getSurveyTemplateList?.data);
        setSubWorkItemList(getSurveyTemplateList?.data);
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

  const sortingWIList = async(sortAlphabeticallySub: boolean, workItemListSub: any[]) => {
    setLoadedApiData(false)
    if (sortAlphabeticallySub) {
      setDoRequest(true)
      let workItemListValues: any = workItemListSub;
      const values = await workItemListValues.sort((a: {gyde_name: string}, b: {gyde_name: string}) => (a.gyde_name).localeCompare(b.gyde_name))
      console.log("d ==> ", (workItemListValues[0] as any)?.gyde_name, (values[0]  as any)?.gyde_name);
      
      setSubWorkItemList(values);
    } else {
      if (doRequest) {
        await getSurveyTemplateListByWorkItemId(workitemTemplate);
        setDoRequest(false)
      }
    }
    setLoadedApiData(true)
  }

  useEffect(() => {
    sortingWIList(sortAlphabetically, workItemList);
  }, [sortAlphabetically, workItemList])
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
          <Form.Item
            name="Parent Survey Work Item"
            label="Parent Survey Work Item:"
            rules={[{ required: false }]}
          >
            <span style={{ marginRight: '8px' }}>Original Order</span>
            <Switch checked={sortAlphabetically} onChange={() => setSortAlphabetically(!sortAlphabetically)} />
            <span style={{ marginLeft: '8px' }}>Sort Alphabetically</span>
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
