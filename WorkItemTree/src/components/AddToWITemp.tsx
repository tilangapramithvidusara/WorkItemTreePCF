import {
  Button,
  Checkbox,
  Dropdown,
  Form,
  Input,
  MenuProps,
  Modal,
  Select,
  Spin,
} from "antd";
import React, { memo, useEffect, useState } from "react";
import {
  getSurveyListByWorkItemId,
  getWorkItemsListByWorkItemTemplateId,
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
}: any) => {
  const [form] = Form.useForm();
  const [workItemList, setWorkItemList] = useState([]);
  const [surveyList, setSurveylist] = useState([]);
  const [partnerNodes, setPartnetNodes] = useState(false);

  const [loadedApiData, setLoadedApiData] = useState(false);

  const onLookupChange = (value: string) => {
    console.log("ONLOOKUP");
  };

  const onFinish = (values: any) => {
    console.log(values);
  };

  const handleOk = () => {};

  const handleCancel = () => {
    setIsWITempModalOpen(false);
  };

  const onWorkItemTemplateChange = async (input: any) => {
    console.log("On Selected WI", input);
    setLoadedApiData(false);
    try {
        await getSurveyTemplateListByWorkItemId(input);
        await _getSurveyListByWorkItemId(input);
        setLoadedApiData(true);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const _getSurveyListByWorkItemId = async (workItemId: any) => {
    try {
        const surveyList = await getSurveyListByWorkItemId(workItemId);
        if(!surveyList?.error) setSurveylist(surveyList?.data);      
    } catch (error) {
      console.error("Error fetching survey templates", error);
    }
  };

  const getSurveyTemplateListByWorkItemId = async (workItemId: string) => {
    try {
      const getSurveyTemplateList = await getWorkItemsListByWorkItemTemplateId(
        workItemId
      );
        if(!getSurveyTemplateList?.error) setWorkItemList(getSurveyTemplateList?.data);
    } catch (error) {
      console.error("Error fetching survey templates", error);
    }
  };

  const onSurveyTemplateChange = async (selectedTemplate: any) => {
    console.log("selectedTemplate", selectedTemplate);
    // await getSurveyListByWorkItemId(selectedTemplate)
  };

  const onParentSurveyWIChange = (parentWI: any) => {
    console.log("onParentSurveyWIChange", parentWI);
  };

  const onSurveyTemplateTypeChange = (surveyTempType: any) => {
    console.log("onSurveyTemplateTypeChange", surveyTempType);
  };
  return (
    <div>
      <Modal
        title="Add To Work Item Template"
        open={isWITempModalOpen}
        onOk={handleOk}
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
              allowClear
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
              allowClear
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

          <Form.Item
            name="Parent Survey Work Item"
            label="Parent Survey Work Item:"
            rules={[{ required: false }]}
          >
            <Select
              placeholder="Select Item"
              onChange={onParentSurveyWIChange}
              style={{ width: "250px" }}
              allowClear
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
          </Form.Item>

          <Form.Item
            name="Survey Template Item Type"
            label="Survey Template Item Type:"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select Type"
              onChange={onSurveyTemplateTypeChange}
              allowClear
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
              allowClear
            >
              {/* <Option value="male">male</Option>
              <Option value="female">female</Option>
              <Option value="other">other</Option> */}
            </Select>
          </Form.Item>

          <div>
            <Checkbox onChange={(e) => setPartnetNodes(e?.target?.checked)}>
              Copy partner notes
            </Checkbox>
          </div>
        </Form>
        <div></div>
      </Modal>
    </div>
  );
};

export default memo(AddToWITemp);
