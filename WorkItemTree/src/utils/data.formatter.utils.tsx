import * as React from "react";

export const dataFomater = (node: any, dataSet: any): any => {
  let children = [];
  if (node && node?.id) {
    children = arrayFormater(dataSet, node?.level);
    return children;
  } else {
    const icon = dataSet?.icon;
    let { children, ...rest } = dataSet;
    if (!dataSet.children) {
      dataSet.switcherIcon = () => null;
    }
    // hasVisibility
    dataSet = {
      ...dataSet,
      key: dataSet.id,
      icon: <img src={`${icon}`} width={25} height={25} alt="img" />,
      imgUrl: icon || null,
      title: dataSet.text,
      hasChildren: dataSet.children.length > 0 ? true : false,
      disableExpand: !dataSet.children,
      level: 1,
      haveNextlevel: dataSet.nextLevelLogicalName ? true : false,
      isVisible: dataSet.hasVisibility ? dataSet.isVisible : null,
      expanded: false,
    };
    if (dataSet.children) {
      children = arrayFormater(dataSet.children, 1);
      dataSet.children = children;
    }
    return [dataSet];
  }
};

const arrayFormater = (array: any[], previousLevel: number): any => {
  for (let i = 0; i < array.length; i++) {
    let dataSet = array[i];
    const icon = dataSet?.icon;
    let { children, ...rest } = dataSet;
    if (!dataSet.children) {
      rest = { ...rest, switcherIcon: () => null };
    }
    dataSet = {
      ...rest,
      key: dataSet.id,
      icon: <img src={`${icon}`} width={25} height={25} alt="img" />,
      imgUrl: icon || null,
      title: dataSet.text,
      hasChildren: dataSet.children,
      disableExpand: !dataSet.children,
      level: previousLevel + 1,
      haveNextlevel: dataSet.nextLevelLogicalName ? true : false,
      isVisible: dataSet.hasVisibility ? dataSet.isVisible : null,
      expanded: false,
    };
    array[i] = dataSet;
  }
  return array;
};