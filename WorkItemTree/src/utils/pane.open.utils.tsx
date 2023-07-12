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
  e: any
) => {
  const openPanes = window.parent.Xrm.App.sidePanes.getAllPanes();
  openPanes.forEach((item: any) => {
    window.parent.Xrm.App.sidePanes.getPane(item.paneId).close();
  });
  if (entId != null) {
    window.parent.Xrm.App.sidePanes
      .createPane({
        title: e?.title,
        imageSrc: e?.imgUrl,
        paneId: e?.id,
        hideHeader: false,
        canClose: true,
        width: 800,
      })
      .then((pane: any) => {
        pane.navigate({
          pageType: "entityrecord",
          entityName: entName,
          entityId: entId,
          // formId: frmId,
        });
      });
  } else {
    entId = "";
  }
}