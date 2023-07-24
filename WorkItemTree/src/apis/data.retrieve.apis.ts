import * as React  from "react";

import { arrayFormater } from "../utils/data.formatter.utils";
import { LogicalNames } from "../constants";

// retrive work items tree data
export const retrieveTreeDataRequest = async (node?: any): Promise<any[]> => {
  console.log("retrive tree data 'node' ====> ", node);
  try {
    var req: any = {};
    var parameterTypes: any = {
      surveytemplateid: {
        typeName: "Edm.String",
        structuralProperty: 1,
      },
      relatedsurveyitemid: {
        typeName: "Edm.String",
        structuralProperty: 1,
      },
      workitemtemplateid: {
        typeName: "Edm.String",
        structuralProperty: 1,
      },
    };

    const currentLogicalName = await window.parent.Xrm.Page.ui._formContext.contextToken.entityTypeName;
    const currentEntity = await window.parent.Xrm.Page.ui.formContext.data.entity.getId();
    const currentEntityId = currentEntity.replace(/[{}]/g, '');
    let surveyTemplate = null;
    let workItemTemplateId = null;
    let internalId = null;
 
    if (currentLogicalName === LogicalNames?.SURVEY) {
      console.log('surevey=====>>>>>>>>');
      
      surveyTemplate = await window.parent.Xrm.Page.data.entity
        .getId()
        .replace("{", "")
        .replace("}", "");
        internalId = await window.parent.Xrm.Page.getAttribute(LogicalNames?.INTERNAL).getValue()
    } else if (currentLogicalName === LogicalNames?.WORKITEM) {
      workItemTemplateId  = await window.parent.Xrm.Page.data.entity
        .getId()
        .replace("{", "")
        .replace("}", ""); 
      console.log('run correct if', workItemTemplateId);
      
    } else {
      console.log("elelelelelel");
      
      surveyTemplate = await 
        window.parent.Xrm.Page.getAttribute(LogicalNames?.SURVEY).getValue()[0]?.id?.replace("{", "").replace("}", "");
      internalId = await window.parent.Xrm.Page.getAttribute(LogicalNames?.INTERNAL).getValue()
    }

    req.surveytemplateid = surveyTemplate;
    req.relatedsurveyitemid = internalId;
    req.workitemtemplateid = workItemTemplateId;

    console.log("form ids ================+> ", currentEntityId, surveyTemplate, internalId, currentLogicalName, workItemTemplateId, req);
    

    req.getMetadata = function () {
      return {
        boundParameter: null,
        parameterTypes,
        operationType: 1, // This is a function. Use '0' for actions and '2' for CRUD
        operationName: LogicalNames?.OPERATION, // need to change according to work items
      };
    };

    const result = await window.parent.Xrm.WebApi.online
      .execute(req)
      .then(function (response: any) {
        if (response.ok) {
          return response.json();
        }
      })
      .then(function (responseBody: any) {
        const resData = JSON.parse(responseBody.nodedata);
        console.log("data res ======> ", resData);
        // const data =
        //   (node && node.id && resData.length > 0) || !(node && node.id)
        //     ? dataFomater(node, JSON.parse(responseBody.nodedata))
        //     : resData;
        // return data;
        // const data = arrayFormater(resData?.workItems, resData?.logicalname, internalId, node?.level ? node.level : 0);
        return resData;
        // {treeData: data, logicalname: resData.logicalname, currentLoactionIds: resData?.currentLoactionIds};
      })
      .catch(function (error: any) {
        console.log('error ======> ', error);
        return [];
      });
    await Promise.all([surveyTemplate, result])
    console.log("tree data",result);
    return result;
  } catch (error) {
    console.log(" 'error' ====> ", error);
    return [];
  }
}