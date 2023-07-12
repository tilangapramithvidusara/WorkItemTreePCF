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