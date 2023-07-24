import * as React  from "react";


export const saveTreeDataRequest = async (
  entityLogicalName: any,
  id: any,
  data: any
): Promise<any> => {
  try {
    const result = await window.parent.Xrm.WebApi.updateRecord(
      entityLogicalName,
      id,
      data
    );
    console.log("update result",result);
    return { error: false, data: result };
  } catch (error: any) {
    console.log("update error",error);
    return { error: true, data: {} };
  }
};

export const updateTreeDataRequest = async(isReParenting: boolean, node: any, newParent: any, sequence?: number) => {
  const record: any = {};
  if (isReParenting) {
    record["gyde_parentworkitemsequence@odata.bind"] = `/gyde_workitemtemplatesequences(${newParent?.workItemsequance?.sequanceid})`;
  } else {
    record.gyde_sequence = sequence
  }
  try {
    const result = await window.parent.Xrm.WebApi.updateRecord("gyde_workitemtemplatesequence", node?.workItemsequance?.sequanceid, record);
    console.log("result updateTreeDataRequest ==========> ", result);
    return { error: false, data: result };
    
  } catch (error) {
    console.log("error updateTreeDataRequest =======> ", error);
    return { error: true, data: {} };
    
  }
}
