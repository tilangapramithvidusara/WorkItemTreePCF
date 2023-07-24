import { promises } from "dns";

export const addObjectToTree = (tree: any, key: string, newObject: any[]) => {
  if (tree.key === key) {
    tree.children = newObject;
    return;
  } else if (tree.children) {
    tree.children.forEach((child: any) =>
      addObjectToTree(child, key, newObject)
    );
  } else {
    console.log('addObjectToTree else');
  }
}

export const findAndChange = (arr: any, id: string, newValue: any, attry: any) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      console.log('found =====> ', arr[i]);
      arr[i] = newValue;
      console.log('found111 =====> ', arr[i]);
      Object.assign(arr[i], newValue);
      console.log('found111www =====> ', arr[i]);
      // arr[i][attry] = newValue;
      return true;
    }
    if (arr[i].children && arr[i].children.length > 0) {
      if (findAndChange(arr[i].children, id, newValue, attry)) {
        return true;
      }
    }
  }
  return false;
}

export const getNode = (key: string, nodes: any[]): any | undefined => {
  for (const node of nodes) {
    if (node.key === key) {
      return node;
    } else if (node.children) {
      const childNode = getNode(key, node.children);
      if (childNode) {
        return childNode;
      }
    }
  }
};

const loadResourceString = async (textObject: object, setTextObject: any) => {
  const url =
    await window.parent.Xrm.Utility.getGlobalContext().getClientUrl();
  const language = await window.parent.Xrm.Utility.getGlobalContext()
    .userSettings.languageId;
  const webResourceUrl = `${url}/WebResources/gyde_localizedstrings.${language}.resx`;

  try {
    const response = await fetch(`${webResourceUrl}`);
    const data = await response.text();
    // CREATE YOUR OWN KEYS
    const filterKeys = ['numberValueValidation', 'stringLengthValidation', 'requiredError','decimalValidation','duplicateError','saveDataNotify','saveDataError','commonError'];
     // Replace with the key you want to filter
    filterKeys.map((filterKey: string, index: number) => {
      const parser = new DOMParser();
      // Parse the XML string
      const xmlDoc = parser.parseFromString(data, "text/xml");
      // Find the specific data element with the given key
      const dataNode: any = xmlDoc.querySelector(`data[name="${filterKey}"]`);
      // Extract the value from the data element
      const value: any = dataNode?.querySelector("value").textContent;

      // SET MESSAGES ACCORDING TO YOUR ORDER
      // if (index === 0) {
      //   setNumberValueValidation(value)
      // }
      // if (index === 1) {
      //   setStringLengthValidation(value)
      // }
      // if (index === 2) {
      //   setRequiredError(value)
      // }
      // if (index === 3) {
      //   setDecimalValidation(value)
      // }
      // if (index === 4) {
      //   setDuplicateError(value)
      // }
      // if (index === 5) {
      //   setSaveDataNotify(value)
      // }
      // if (index === 6) {
      //   setSaveDataError(value)
      // }if (index === 7) {
      //   setCommonError(value)
      // }
      // CREATE AN OBJECT AND ASSIGN TO IT
    });
  } catch (error) {
    console.error("Error loading data:", error);
  }
};