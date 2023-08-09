import * as React  from "react";
import { LogicalNames } from "../constants";
import { openSidePane } from "../utils/pane.open.utils";
import { notification } from "antd";


// export const saveTreeDataRequest = async (
//   entityLogicalName: any,
//   id: any,
//   data: any
// ): Promise<any> => {
//   try {
//     const result = await window.parent.Xrm.WebApi.updateRecord(
//       entityLogicalName,
//       id,
//       data
//     );
//     console.log("update result",result);
//     return { error: false, data: result };
//   } catch (error: any) {
//     console.log("update error",error);
//     return { error: true, data: {} };
//   }
// };

export const updateTreeDataRequest = async(isReParenting: boolean, node: any, newParent: any, sequence?: number) => {
  const record: any = {};
  if (isReParenting) {
    record["gyde_parentworkitemsequence@odata.bind"] = `/gyde_workitemtemplatesequences(${newParent?.workItemsequance?.sequanceid})`;
  } else {
    record.gyde_sequence = sequence
  }
  try {
    const result = await window.parent.Xrm.WebApi.updateRecord("gyde_workitemtemplatesequence", node?.workItemsequance?.sequanceid, record);
    // console.log("result updateTreeDataRequest ==========> ", result);
    return { error: false, data: result };
    
  } catch (error) {
    // console.log("error updateTreeDataRequest =======> ", error);
    return { error: true, data: {} };
    
  }
}

export const copyWorkItemRequest = async(node: any, retrieveWorkItemData: any, copySuccess: string, copyFailed: string) => {
  var execute_gyde_CopyWorkItem_Request = {
      // Parameters
      workitemtemplatesequenceid: {guid: node?.workItemsequance?.sequanceid }, // Edm.Guid
    
      getMetadata: function () {
        return {
          boundParameter: null,
          parameterTypes: {
            workitemtemplatesequenceid: { typeName: "Edm.Guid", structuralProperty: 1 }
          },
          operationType: 0, operationName: LogicalNames.COPYWORKITEM,
        };
      }
    };
    
    await window.parent.Xrm.WebApi.execute(execute_gyde_CopyWorkItem_Request).then(
      function success(response: any) {
        if (response.ok) { return response.json(); }
      }
    ).then(async function (responseBody: any) {
      var result = responseBody;
      // console.log("copy result", result);
      // Return Type: mscrm.gyde_CopyWorkItemResponse
      // Output Parameters
      var newId = result["newid"]; // Edm.Guid
      notification.success({
        message: "Success",
        description: copySuccess,
      });

      await retrieveWorkItemData(false);
      openSidePane("", newId, {
        workItemsequance: {
          logicalname: node?.workItemsequance?.logicalname,
          sequanceid: newId
        },
      }, false);
    }).catch(function (error: any) {
      // console.log("copy error", error.message);
      notification.error({
        message: "Error",
        description: copyFailed,
      });
    });
}
