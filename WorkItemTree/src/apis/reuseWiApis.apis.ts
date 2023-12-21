
import axios from "axios";
export const getAllWorkItemList = async () : Promise<any> =>  {
  const record: any = {};
  try {
      const workItemList = await window.parent.Xrm.WebApi.retrieveMultipleRecords("gyde_workitemtemplate");
      console.log("workItemList", workItemList)
    return { error: false, data: workItemList?.entities };
  } catch (error) {
    return { error: true, data: null };
  }
}

export const getWorkItemsListByWorkItemTemplateId = async (workItemId: any) : Promise<any> => {
    try {
        const surveyList = await window.parent.Xrm.WebApi.retrieveMultipleRecords("gyde_workitemtemplatesequence", `?$filter=_gyde_workitemtemplate_value eq '${workItemId}'`);

        console.log("surveyListsurveyList", surveyList);
        return { error: false, data: surveyList?.entities };
    } catch (e) {
        return { error: true, data: null };
    }
}

export const getSurveyListByWorkItemId = async (workitemId: any) : Promise<any> =>{
    try {
        const surveyList = await window.parent.Xrm.WebApi.retrieveMultipleRecords("gyde_surveytemplate", `?$filter=_gyde_workitemtemplate_value eq  '${workitemId}'`);
        console.log("surveyListsurveyList", surveyList);
        return { error: false, data: surveyList?.entities };
    } catch (e) {
        return { error: true, data: null };
    }
}

export const getTemplatebyType = async (workItemId: any,templateType:any) : Promise<any> => {
    try {
        let _templateType =templateType === 'chapter' ? 'gyde_surveytemplatechapter' :templateType === 'section' ? 'gyde_surveytemplatechaptersection' :templateType === 'question' ? 'gyde_surveytemplatechaptersectionquestion' : '';
        console.log("_templateType*1",_templateType,"templateTypes",templateType);
        
        const templateTypeList = await window.parent.Xrm.WebApi.retrieveMultipleRecords(`${_templateType}`, `?$filter=_gyde_surveytemplate_value eq ${workItemId}`);
        console.log("templateTypeList", templateTypeList);
        return { error: false, data: templateTypeList?.entities };
    } catch (e) {
        return { error: true, data: null };
    }
}


export const releatedSurveyItemLookup = async (workItemSequenceId: any) : Promise<any> => {
    var fetchXml = `?fetchXml=
   <fetch top='5000' aggregate='true'>
    <entity name='gyde_workitemtemplatesequence'>
        <filter>
            <condition attribute='gyde_workitemtemplatesequenceid' operator='eq' value='${workItemSequenceId}' />
        </filter>
        <link-entity name='gyde_surveyworkitem' from='gyde_surveyworkitemid' to='gyde_workitem' alias='surveyworkitem'>
            <link-entity name='gyde_surveyworkitemrelatedsurveyitem' from='gyde_surveyworkitem' to='gyde_surveyworkitemid' alias='relatedsurveyitem'>
                <all-attributes />
            </link-entity>
        </link-entity>
    </entity>
</fetch>`;
    try {
        const result = await window.parent.Xrm.WebApi.retrieveMultipleRecords("gyde_workitemtemplatesequence", fetchXml);
        return { error: false, data: result?.entities };
    } catch (e) {
        console.log("Error", e);
        return { error: true, data: null };
    }
}


export const migrateWotkItemdata = async (url:any,payload :any) : Promise<any> =>  {
    const record: any = {};
    console.log("urlRews",url);
    
    try {
        const response = await axios.post(url,payload);
        console.log('Parent node saved:', response);
        console.log("workItem Migrated", response)
      return { error: false, data: response };
    } catch (error) {
      return { error: true, data: null };
    }
  }
  