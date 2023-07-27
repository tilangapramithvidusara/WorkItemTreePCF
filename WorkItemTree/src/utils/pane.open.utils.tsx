import { LogicalNames } from "../constants";
import {notification} from "antd";

export const openCopyViewPane = async(
  node: any,
  formType: string,
  messages: any,
  callback: any
) => {
  let selectedNodeData = [{
    "entityType": node.a_attr.LogicalName,
    "id": node?.id,
    "name": node.text,
  }];

  try {
    const templateData =  await window.parent.Xrm.Page.data.entity.getEntityReference();

    var entityFormOptions: any = {};
    entityFormOptions["entityName"] = node?.nextLevelLogicalName
  } catch (error) {
    console.log("open pane error =====> ", error);
    notification.error({
      message: "Error",
      description: "Copy process failed. Plz Try Again..!",
    });
    callback({
      success: false,
      dataLoadSuccess: false,
      data: null,
      error: true,
    });
  }
}

export const openSidePane = (
  entName: string,
  entId: string,
  e: any,
  isCopy?: boolean,
) => {
  console.log('plolol =====>', entName, entId, isCopy, e);
  
  const openPanes = window.parent.Xrm.App.sidePanes.getAllPanes();
  openPanes.forEach((item: any) => {
    window.parent.Xrm.App.sidePanes.getPane(item.paneId).close();
  });

  const entityFormOptions: any = {};
  entityFormOptions[LogicalNames?.ENTITYNAME] = LogicalNames?.SURVEYWORKITEM;
  // entName;
  const formParameters: any = {};

  formParameters[LogicalNames?.WORKITEMDESCRIPTION] = e?.description;
  formParameters[LogicalNames?.WORKITEMTYPE] = LogicalNames?.WORKITEMTYPE;
  // entName;
  // formParameters[LogicalNames?.SURVEYWORKITEM] = entName;

  // "workItemFields": {
  //   "gyde_buildestimatehrs": 0,
  //   "gyde_buildestimatepts": 0,
  //   "gyde_complexity": 0,
  //   "gyde_designclassification": 0,
  //   "gyde_gapfit": 0,
  //   "gyde_priority": 0,
  //   "gyde_workitemisv
  formParameters[LogicalNames?.TITLE] = e?.title;
  formParameters[LogicalNames?.COMPLEXITY] = e?.workItemFields?.[LogicalNames.COMPLEXITY];
  formParameters[LogicalNames?.BUILDESTIMATEPTS] = e?.workItemFields?.[LogicalNames.BUILDESTIMATEPTS],
  formParameters[LogicalNames?.BUILDESTIMATEHRS] = e?.workItemFields?.[LogicalNames.BUILDESTIMATEHRS]

  
  // SET LOOKUPS
  // formParameters[LogicalNames?.WORKITEMRESOURCE] = '';
  // formParameters[LogicalNames?.WORKITEMTYPE] = e?.workItemtype?.workitemtypeid;
  // formParameters[LogicalNames?.WORKITEMTYPENAME] = e?.workItemtype?.type
  // formParameters[LogicalNames?.WORKITEMTYPETYPE] = e?.workItemtype?.WORKITEMTYPE;

  // formParameters[LogicalNames?.WORKITEMMODULE] = '';
  // formParameters[LogicalNames?.WORKITEMTYPE] = e?.workItemtype?.workitemtypeid;
  // formParameters[LogicalNames?.WORKITEMTYPENAME] = e?.workItemtype?.type
  // formParameters[LogicalNames?.WORKITEMTYPETYPE] = e?.workItemtype?.WORKITEMTYPE;

  // formParameters[LogicalNames?.WORKITEMISV] = '';
  // formParameters[LogicalNames?.WORKITEMTYPE] = e?.workItemtype?.workitemtypeid;
  // formParameters[LogicalNames?.WORKITEMTYPENAME] = e?.workItemtype?.type
  // formParameters[LogicalNames?.WORKITEMTYPETYPE] = e?.workItemtype?.WORKITEMTYPE;

  formParameters[LogicalNames?.WORKITEMTYPE] = e?.workItemtype?.workitemtypeid;
  formParameters[LogicalNames?.WORKITEMTYPENAME] = e?.workItemtype?.type
  formParameters[LogicalNames?.WORKITEMTYPETYPE] = e?.workItemtype?.WORKITEMTYPE;

  if (entId != null) {
    // if (isCopy) {//  { inSidePane: true }
    //   console.log("ppp ===> ", formParameters, entityFormOptions);
      
    //   window.parent.Xrm.Navigation.openForm(entityFormOptions, formParameters, {inSidePane: true}).then(
    //     function (success: any) {
    //         console.log("success ====>", success);
    //     },
    //     function (error: any) {
    //         console.log("error =====> ", error);
    //     });
    // } else {
      window.parent.Xrm.App.sidePanes
        .createPane({
          title: e?.title,
          // imageSrc: e?.imgUrl,
          paneId: e?.workItemsequance?.sequanceid,
          hideHeader: false,
          canClose: true,
          width: 800,
        })
        .then(async(pane: any) => {
          if (isCopy) {
            await pane.navigate({
              pageType: "entityrecord",
              entityName: entityFormOptions.entityName,
              // e?.workItemsequance?.logicalname,
              // entityId: e?.key,
              // e?.workItemsequance?.sequanceid,
              // formId: frmId,
              createFromEntityName: entityFormOptions.entityName,
              formType: 1, // 2 represents Update form, change it accordingly if you want another form type.
              entityFormOptions: {
                  entityName: entityFormOptions.entityName,
              },
              formParameters: formParameters,
            })
            // await pane.closed.subscribe(function (result: any) {
            //   console.log("log log ===> ", result);
              
            //   if (result.saved) {
            //       // The side pane was saved
            //       console.log("Side pane was saved.");
            //   } else {
            //       // The side pane was closed without saving
            //       console.log("Side pane was closed without saving.");
            //   }
            // });
        } else { 
            await pane.navigate({
              pageType: "entityrecord",
              entityName: e?.workItemsequance?.logicalname,
              entityId: e?.workItemsequance?.sequanceid,
              // formId: frmId,
            });
            // await pane.closed.subscribe(function (result: any) {
            //   console.log("log log ===> ", result);
              
            //   if (result.saved) {
            //       // The side pane was saved
            //       console.log("Side pane was saved.");
            //   } else {
            //       // The side pane was closed without saving
            //       console.log("Side pane was closed without saving.");
            //   }
            // });
          }
        });
      
    // }
  } else {
    entId = "";
  }
}