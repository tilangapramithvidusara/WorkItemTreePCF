import * as React  from "react";

import { dataFomater } from "../utils/data.formatter.utils";

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
    };
    //  parentworkitemid , surveytemplateid
    if (node && node.id) {
      req.parentnodeid = node.id;
      req.parentlogicalname = node.a_attr.LogicalName;
      parameterTypes = {
        ...parameterTypes,
        parentnodeid: {
          typeName: "Edm.String",
          structuralProperty: 1,
        },
        parentlogicalname: {
          typeName: "Edm.String",
          structuralProperty: 1,
        },
      };
    }

    var surveyTemplate = await window.parent.Xrm.Page.data.entity
      .getId()
      .replace("{", "")
      .replace("}", "");

    req.surveytemplateid = surveyTemplate;

    req.getMetadata = function () {
      return {
        boundParameter: null,
        parameterTypes,
        operationType: 1, // This is a function. Use '0' for actions and '2' for CRUD
        operationName: "gyde_GetSurveyWorkItemTreeData", // need to change according to work items
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
        const data =
          (node && node.id && resData.length > 0) || !(node && node.id)
            ? dataFomater(node, JSON.parse(responseBody.nodedata))
            : resData;
        return data;
      })
      .catch(function (error: any) {
        return [];
      });
    await Promise.all([surveyTemplate, result])
    console.log("tree data",result);
    return result;
  } catch (error) {
    console.log("retrive tree data 'error' ====> ", Error);
    return [];
  }
}