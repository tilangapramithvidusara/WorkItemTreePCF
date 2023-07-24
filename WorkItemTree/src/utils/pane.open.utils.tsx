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
  const openPanes = window.parent.Xrm.App.sidePanes.getAllPanes();
  openPanes.forEach((item: any) => {
    window.parent.Xrm.App.sidePanes.getPane(item.paneId).close();
  });

  const entityFormOptions: any = {};
  entityFormOptions[LogicalNames?.ENTITYNAME] = entName;
  const formParameters: any = {};

  formParameters[LogicalNames?.WORKITEMDESCRIPTION] = e?.description;
  formParameters[LogicalNames?.WORKITEMTYPE] = entName;
  formParameters[LogicalNames?.SURVEYWORKITEM] = entName;
  formParameters[LogicalNames?.TITLE] = e?.title;
  formParameters[LogicalNames?.COMPLEXITY] = '';
  formParameters[LogicalNames?.BUILDESTIMATEPTS] = '',
  formParameters[LogicalNames?.BUILDESTIMATEHRS] = ''

  
  // SET LOOKUPS
  formParameters[LogicalNames?.WORKITEMRESOURCE] = '',
  formParameters[LogicalNames?.WORKITEMMODULE] = '',
  formParameters[LogicalNames?.WORKITEMISV] = ''

  formParameters[LogicalNames?.WORKITEMTYPE] = e?.workItemtype?.workitemtypeid;
  formParameters[LogicalNames?.WORKITEMTYPENAME] = e?.workItemtype?.type
  formParameters[LogicalNames?.WORKITEMTYPETYPE] = e?.workItemtype?.WORKITEMTYPE;

  if (entId != null) {
    window.parent.Xrm.App.sidePanes
      .createPane({
        title: e?.title,
        // imageSrc: e?.imgUrl,
        paneId: e?.workItemsequance?.sequanceid,
        hideHeader: false,
        canClose: true,
        width: 800,
      })
      .then((pane: any) => {
        isCopy ? 
          pane.navigate({
            pageType: "entityrecord",
            entityName: e?.workItemsequance?.logicalname,
            entityId: e?.key,
            // e?.workItemsequance?.sequanceid,
            // formId: frmId,
            createFromEntityName: entityFormOptions.entityName,
            formType: 1, // 2 represents Update form, change it accordingly if you want another form type.
            entityFormOptions: {
                entityName: entityFormOptions.entityName,
            },
            formParameters: formParameters,
          })
        : 
          pane.navigate({
            pageType: "entityrecord",
            entityName: e?.workItemsequance?.logicalname,
            entityId: e?.workItemsequance?.sequanceid,
            // formId: frmId,
          });
      });
  } else {
    entId = "";
  }
}