import * as React  from "react";
import { LogicalNames } from "../constants";

// retrive work items tree data
export const retrieveTreeDataRequest = async (
  node?: any,
  isFirst?: boolean,
  currentLogicalNameData?: any,
  currentSurveyTemplate?: any,
  currentInternalId?: any,
  currentWorkItemTemplateId?: any,
  ): Promise<any[]> => {
  // console.log("retrive tree data 'node' ====> ", node, isFirst, currentLogicalNameData, currentSurveyTemplate, currentWorkItemTemplateId);
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
      islist: {
        typeName: "Edm.Boolean",
        structuralProperty: 1,
      }
    };

    const currentLogicalName = isFirst ? await window.parent.Xrm.Page.ui._formContext.contextToken.entityTypeName : currentLogicalNameData.current;
    isFirst ? currentLogicalNameData.current = currentLogicalName : null
    // const currentEntity = await window.parent.Xrm.Page.ui.formContext.data.entity.getId();
    // const currentEntityId = currentEntity.replace(/[{}]/g, '');
    let surveyTemplate = null;
    let workItemTemplateId = null;
    let internalId = null;
 
    if (currentLogicalName === LogicalNames?.SURVEY) {
      // console.log('surevey=====>>>>>>>>');
      
      surveyTemplate = isFirst ? await window.parent.Xrm.Page.data.entity.getId()
      .replace("{", "")
      .replace("}", "") : currentSurveyTemplate.current;
      isFirst ? currentSurveyTemplate.current = await window.parent.Xrm.Page.data.entity.getId()
      .replace("{", "")
      .replace("}", "") : null
      // internalId = isFirst ? await window.parent.Xrm.Page.getAttribute(LogicalNames?.INTERNAL).getValue() : currentInternalId.current;
      // isFirst ? currentInternalId.current = await window.parent.Xrm.Page.getAttribute(LogicalNames?.INTERNAL).getValue() : null
    } else if (currentLogicalName === LogicalNames?.WORKITEM) {
      workItemTemplateId  = isFirst ? await window.parent.Xrm.Page.data.entity
        .getId()
        .replace("{", "")
        .replace("}", "") : currentWorkItemTemplateId.current; 
      isFirst ? currentWorkItemTemplateId.current = await window.parent.Xrm.Page.data.entity
      .getId()
      .replace("{", "")
      .replace("}", "") : null
      // console.log('run correct if', workItemTemplateId);
      
    } else {
      // console.log("elelelelelel");
      
      surveyTemplate = isFirst ? await 
        window.parent.Xrm.Page.getAttribute(LogicalNames?.SURVEY).getValue()[0]?.id?.replace("{", "").replace("}", "") : currentSurveyTemplate.current;
      isFirst ? currentSurveyTemplate.current = await 
      window.parent.Xrm.Page.getAttribute(LogicalNames?.SURVEY).getValue()[0]?.id?.replace("{", "").replace("}", "") : null
      internalId = isFirst ? await window.parent.Xrm.Page.getAttribute(LogicalNames?.INTERNAL).getValue() : currentInternalId.current
      isFirst ? currentInternalId.current = await window.parent.Xrm.Page.getAttribute(LogicalNames?.INTERNAL).getValue() : null
    }

    req.surveytemplateid = surveyTemplate;
    req.relatedsurveyitemid = internalId;
    req.workitemtemplateid = workItemTemplateId;
    req.islist = false;

    // console.log("form ids ================+> ", surveyTemplate, internalId, currentLogicalName, workItemTemplateId, req);
    

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
        // console.log("data res ======> ", resData);
        return resData;
      })
      .catch(function (error: any) {
        // console.log('error ======> ', error);
        return [];
      });
    await Promise.all([surveyTemplate, result])
    // console.log("tree data",result);
    return result;
  } catch (error) {
    // console.log(" 'error' ====> ", error);
    return [];
  }
}