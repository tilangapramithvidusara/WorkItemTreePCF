
import axios from "axios";
import { LogicalNames } from "../constants";
export const getAllWorkItemList = async () : Promise<any> =>  {
  const record: any = {};
  try {
      const workItemList = await window.parent.Xrm.WebApi.retrieveMultipleRecords("gyde_workitemtemplate");
      // console.log("workItemList", workItemList)
    return { error: false, data: workItemList?.entities };
  } catch (error) {
    return { error: true, data: null };
  }
}

export const getWorkItemsListByWorkItemTemplateId = async (workItemTemplateId: any) : Promise<any> => {
	// console.log('workItemTemplateId -- >', workItemTemplateId);
	
	try {
		const fetchXml = `
			<fetch top="500">
				<entity name="gyde_workitemtemplatesequence">
					<filter>
						<condition attribute="gyde_workitemtemplate" operator="eq" value="${workItemTemplateId}" />
					</filter>
					<all-attributes />
					<link-entity name="gyde_surveyworkitem" from="gyde_surveyworkitemid" to="gyde_workitem" link-type="inner" alias="workitem">
						<attribute name="gyde_apcqbusinessprocessid" />
						<attribute name="gyde_workitemtype" />
					</link-entity>
				</entity>
			</fetch>`;

		const workItemList = await window.parent.Xrm.WebApi.retrieveMultipleRecords(LogicalNames?.WORKITEMTEMPLETESEQUENCE, "?fetchXml=" + encodeURIComponent(fetchXml))
		// ("gyde_workitemtemplatesequence", "?fetchXml=" + encodeURIComponent(fetchXml))
		// const surveyList = await window.parent.Xrm.WebApi.retrieveMultipleRecords("gyde_workitemtemplatesequence", `?$filter=_gyde_workitemtemplate_value eq '${workItemTemplateId}'`);

		// console.log("workItemList ***** ", workItemList, workItemTemplateId);
		return { error: false, data: workItemList?.entities };
	} catch (e) {
		console.log('error *** ', e);
		
		return { error: true, data: null };
	}
}

export const getSurveyListByWorkItemId = async (workitemId: any) : Promise<any> =>{
    try {
        const surveyList = await window.parent.Xrm.WebApi.retrieveMultipleRecords("gyde_surveytemplate", `?$filter=_gyde_workitemtemplate_value eq  '${workitemId}'`);
        // console.log("surveyListsurveyList 123 ", surveyList);
        return { error: false, data: surveyList?.entities };
    } catch (e) {
        return { error: true, data: null };
    }
}

export const getTemplatebyType = async (workItemId: any,templateType:any) : Promise<any> => {
    try {
        let _templateType =templateType === 'chapter' ? 'gyde_surveytemplatechapter' :templateType === 'section' ? 'gyde_surveytemplatechaptersection' :templateType === 'question' ? 'gyde_surveytemplatechaptersectionquestion' : '';
        // console.log("_templateType*1",_templateType,"templateTypes",templateType);
        
        const templateTypeList = await window.parent.Xrm.WebApi.retrieveMultipleRecords(`${_templateType}`, `?$filter=_gyde_surveytemplate_value eq ${workItemId}`);
        // console.log("templateTypeList", templateTypeList);
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
    // console.log("urlRews",url);
    
    try {
        const response = await axios.post(url,payload);
        // console.log('Parent node saved:', response);
        // console.log("workItem Migrated", response)
      return { error: false, data: response };
    } catch (error) {
      return { error: true, data: null };
    }
  }

export const getAllWorkItemType = async() => {
	try {
		const response = await window.parent.Xrm.WebApi.retrieveMultipleRecords(LogicalNames?.WORKITEMTYPE);
		// console.log('type list  ===> ', response);
		return { error: false, data: response?.entities };
	} catch (error) {
		return { error: true, data: null };
	}
}
  
// workitem.gyde_workitemtype@OData.Community.Display.V1.FormattedValue
// workitem.gyde_apcqbusinessprocessid
