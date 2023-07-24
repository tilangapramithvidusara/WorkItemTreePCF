import React from "react";
import {
  SmileOutlined,
  RocketOutlined,
  // FileOutlined,
  BookOutlined,
  // ToolOutlined,
  ScheduleOutlined
} from "@ant-design/icons";
import type { DataNode } from "antd/es/tree";

export const res_one: any[] = [{
  title: "DATBC1 - Datacom BC template",
  key: "173d7d50-d196-ed11-aad1-0022481b7ce9", // to identify key to access react-ant-tree component
  // icon: <img src="https://cdn.pixabay.com/photo/2017/01/10/03/54/icon-1968240_960_720.png" width={25} height={25} alt="ïmg" />,
  hasChildren: true, // if has children node
  id: '173d7d50-d196-ed11-aad1-0022481b7ce9',
  // imgUrl: "https://cdn.pixabay.com/photo/2017/01/10/03/54/icon-1968240_960_720.png",
  formId: null,
  a_attr: {
    LogicalName: 'gyde_surveytemplate',
  },
  text: 'DATBC1 - Datacom BC template',
  state: {
    disabled: false,
    opened: true,
    selected: false
  },
  level: 1,
  haveNextlevel: true,
  nextLevelLogicalName: 'gyde_surveytemplatechapter',
  nextLevelDisplayName: "Chapter",
  children: [
    {
      title: "BC V1_CH1 - Chapter One - BC",
      key: "133D7D50-D196-ED11-AAD1-0022481B7CE9",
      // icon: <img src="https://cdn.pixabay.com/photo/2017/01/10/03/54/icon-1968240_960_720.png" width={20} height={20} alt="ïmg" />,
      hasChildren: false,
      disableExpand: true,
      isVisible: true,
      // switcherIcon: false,
      switcherIcon: () => null, // hide the expand icon
      // disabled: true,
      id: '133D7D50-D196-ED11-AAD1-0022481B7CE9',
      formId: null,
      a_attr: {
        LogicalName: 'gyde_surveytemplatechapter'
      },
      text: 'BC V1_CH1 - Chapter One - BC"',
      state: {
        disabled: false,
        opened: false,
        selected: false
      },
      level: 2,
      haveNextlevel: true,
      nextLevelLogicalName: 'gyde_surveytemplatechaptersection',
      nextLevelDisplayName: "Section",
      // children: [{}],
    },
    {
      title: "BC V1_CH1 - Chapter One - NEW DATA",
      key: "133D7D50-D196-ED11-AAD1-0022481B7DASD9",
      // icon: <img src="https://cdn.pixabay.com/photo/2017/01/10/03/54/icon-1968240_960_720.png" width={25} height={25} alt="ïmg" />,
      hasChildren: false,
      disableExpand: true,
      isVisible: false,
      // switcherIcon: false,
      switcherIcon: () => null, // hide the expand icon
      // disabled: true,
      id: '133D7D50-D196-ED11-AAD1-0022481B7DASD9',
      formId: null,
      a_attr: {
        LogicalName: 'gyde_surveytemplatechapter'
      },
      text: 'BC V1_CH1 - Chapter One - NEW DATA"',
      state: {
        disabled: false,
        opened: false,
        selected: false
      },
      level: 2,
      haveNextlevel: true,
      nextLevelLogicalName: 'gyde_surveytemplatechaptersection',
      nextLevelDisplayName: "Section",
      // children: [{}],
    },
    {
      title: "BC V1_CH1 - Chapter Two - BC",
      key: "133D7D50-D196-ED11-AAD1-0022481B7CE8",
      // icon: <img src="https://cdn.pixabay.com/photo/2017/01/10/03/54/icon-1968240_960_720.png" width={25} height={25} alt="ïmg" />,
      hasChildren: true,
      id: '133D7D50-D196-ED11-AAD1-0022481B7CE8',
      formId: null,
      isVisible: null,
      a_attr: {
        LogicalName: 'gyde_surveytemplatechapter'
      },
      text: 'BC V1_CH1 - Chapter One - BC"',
      state: {
        disabled: false,
        opened: false,
        selected: false
      },
      level: 2,
      haveNextlevel: true,
      nextLevelLogicalName: 'gyde_surveytemplatechaptersection',
      nextLevelDisplayName: "Section",
      // children: [{}],
    },
    {
      title: "BC V1_CH1 - Chapter One - 1111111111",
      key: "133D7D50-D196-ED11-AAD1-0022481B7DA23SD9",
      // icon: <img src="https://cdn.pixabay.com/photo/2017/01/10/03/54/icon-1968240_960_720.png" width={25} height={25} alt="ïmg" />,
      hasChildren: false,
      disableExpand: true,
      // switcherIcon: false,
      switcherIcon: () => null, // hide the expand icon
      // disabled: true,
      id: '133D7D50-D196-ED11-AAD1-0022481B7DA23SD9',
      formId: null,
      a_attr: {
        LogicalName: 'gyde_surveytemplatechapter'
      },
      text: 'BC V1_CH1 - Chapter One - NEW DATA"',
      state: {
        disabled: false,
        opened: false,
        selected: false
      },
      level: 2,
      haveNextlevel: true,
      nextLevelLogicalName: 'gyde_surveytemplatechaptersection',
      nextLevelDisplayName: "Section",
      // children: [{}],
    },
    {
      title: "BC V1_CH1 - Chapter One - 22222222",
      key: "133D7D50-D196-ED11-AAD1-0022481234A23SD9",
      // icon: <img src="https://cdn.pixabay.com/photo/2017/01/10/03/54/icon-1968240_960_720.png" width={25} height={25} alt="ïmg" />,
      hasChildren: false,
      disableExpand: true,
      // switcherIcon: false,
      switcherIcon: () => null, // hide the expand icon
      // disabled: true,
      isVisible: true,
      id: '133D7D50-D196-ED11-AAD1-0022481234A23SD9',
      formId: null,
      a_attr: {
        LogicalName: 'gyde_surveytemplatechapter'
      },
      text: 'BC V1_CH1 - Chapter One - NEW DATA"',
      state: {
        disabled: false,
        opened: false,
        selected: false
      },
      level: 2,
      haveNextlevel: true,
      nextLevelLogicalName: 'gyde_surveytemplatechaptersection',
      nextLevelDisplayName: "Section",
      // children: [{}],
    },
    {
      title: "BC V1_CH1 - Chapter One - 3333333333",
      key: "133D7D50-D196-ED11-AAD1-023423423SD9",
      // icon: <img src="https://cdn.pixabay.com/photo/2017/01/10/03/54/icon-1968240_960_720.png" width={25} height={25} alt="ïmg" />,
      hasChildren: false,
      disableExpand: true,
      // isVisible: false,
      isVisible: null,
      // switcherIcon: false,
      switcherIcon: () => null, // hide the expand icon
      // disabled: true,
      id: '133D7D50-D196-ED11-AAD1-023423423SD9',
      formId: null,
      a_attr: {
        LogicalName: 'gyde_surveytemplatechapter'
      },
      text: 'BC V1_CH1 - Chapter One - NEW DATA"',
      state: {
        disabled: false,
        opened: false,
        selected: false
      },
      level: 2,
      haveNextlevel: true,
      nextLevelLogicalName: 'gyde_surveytemplatechaptersection',
      nextLevelDisplayName: "Section",
      // children: [{}],
    },
  ],
},
{
  title: "DATBC1 - Datacom BC TEST",
  key: "173d7d50-d196-ed11-aad1-024481b7ce9", // to identify key to access react-ant-tree component
  // icon: <img src="https://cdn.pixabay.com/photo/2017/01/10/03/54/icon-1968240_960_720.png" width={25} height={25} alt="ïmg" />,
  hasChildren: true, // if has children node
  id: '173d7d50-d196-ed11-aad1-024481b7ce9',
  formId: null,
  a_attr: {
    LogicalName: 'gyde_surveytemplate',
  },
  text: 'DATBC1 - Datacom BC template',
  state: {
    disabled: false,
    opened: true,
    selected: false
  },
  level: 1,
}];

export const res_two: any[] = [{
  title: "BC V1_CH1_SC1 - Section number 1",
  key: "1813d7d50-d1296-ed113-aad1-002248435b7ce19",
  // icon: <img src="https://cdn.pixabay.com/photo/2017/01/10/03/54/icon-1968240_960_720.png" width={25} height={25} alt="ïmg" />,
  hasChildren: true,
  id: '1813d7d50-d1296-ed113-aad1-002248435b7ce19',
  formId: null,
  a_attr: {
    LogicalName: 'gyde_surveytemplatechaptersection'
  },
  text: 'BC V1_CH1_SC1 - Section number 1',
  state: {
    disabled: false,
    opened: false,
    selected: false
  },
  level: 3,
  // children: [
  //   {}
  // ],
}];

export const res_three: any[] = [{
  title: "BC V1_CH1_SC1_001 - Q1",
  key: "1b3d7d50-d196-ed11-aad1-0022481b7ce9",
  // icon: <img src="https://cdn.pixabay.com/photo/2017/01/10/03/54/icon-1968240_960_720.png" width={25} height={25} alt="ïmg" />,
  hasChildren: true,
  id: '1b3d7d50-d196-ed11-aad1-0022481b7ce9',
  formId: null,
  a_attr: {LogicalName: 'gyde_surveytemplatechaptersectionquestion'},
  text: 'BC V1_CH1_SC1_001 - Q1',
  state: {
    disabled: false,
    opened: false,
    selected: false
  },
  level: 4
  // children: [
  //   {}
  // ],
}];



const sampleObject = [
  {
    title: "BC V1_CH1 - Work Item One - BC",
    children: true,
    id: '133D7D50-D196-ED11-AAD1-0022481B7CE9',
    logicalName: "",
    sequence: 1,
    hasParent: false, // can be useful but not mandatory yet
    parentId: "", // can be useful but not mandatory yet
  },
  {
    title: "BC V1_CH1 - Work Item Two - BC",
    children: true,
    id: '233D7D50-D196-ED11-AAD1-0022481B7CE9',
    logicalName: "",
    sequence: 2,
    hasParent: true, // can be useful but not mandatory yet
    parentId: "333D7D50-D196-ED11-AAD1-0022481B7CE9", // can be useful but not mandatory yet
  },
]


const sampleObjectValue = [
  {
    title: "Account Management",
    children: true,
    id: '45384023-2C04-EE11-8F6E-6045BDD0E823',
    logicalName: "",
    sequence: 1,
    hasParent: false,
    parentId: "",
  },
  {
    title: "Contact Management",
    children: true,
    id: '1C84A943-2C04-EE11-8F6E-6045BDD0E823',
    logicalName: "",
    sequence: 2,
    hasParent: false,
    parentId: "",
  },
]

export const sampleDBData = {
  "logicalname": "gyde_surveyworkitem",
  "currentLoactionIds": [], // Id list need to expand current location paths
  "workItems": [
   {
    // "children": [],
    // "switcherIcon": true, // if there are no children then need this true
    "description": null,
    "hasParent": false,
    "key": "a004ed85-4b21-ee11-9cbc-6045bdd0ef22",
    "parentSequanceId": null,
    "title": "API_C1 WI 01",
    "workItemsequance": {
     "sequance": 1,
     "sequanceid": "9f04ed85-4b21-ee11-9cbc-6045bdd0ef22"
    },
    "workItemtype": {
     "type": "Epic",
     "workitemtypeid": "157c2482-c4dc-ed11-a7c6-6045bdd0ef22"
    }
   },
   {
    "children": [
      {
        // "children": [],
        // "switcherIcon": true,
        "description": null,
        "hasParent": true,
        "key": "e3b4d193-4b21-ee11-9cbc-6045bdd0ef212",
        "parentSequanceId": 'e3b4d193-4b21-ee11-9cbc-6045bdd0ef22',
        "title": "API_C1 WI 02-01",
        "workItemsequance": {
          "sequance": 1,
          "sequanceid": "e2b4d193-4b21-ee11-9cbc-6045bdd0ef212"
        },
        "workItemtype": {
          "type": "Feature",
          "workitemtypeid": "187c2482-c4dc-ed11-a7c6-6045bdd0ef122"
        }
      },
      {
        // "children": [],
        // "switcherIcon": true,
        "description": null,
        "hasParent": true,
        "key": "e3b4d193-4b21-ee11-9cbc-6045bdd0ef2442",
        "parentSequanceId": 'e3b4d193-4b21-ee11-9cbc-6045bdd0ef22',
        "title": "API_C1 WI 02-02",
        "workItemsequance": {
          "sequance": 1,
          "sequanceid": "e2b4d193-4b21-ee11-9cbc-6045bdd0ef212"
        },
        "workItemtype": {
          "type": "Feature",
          "workitemtypeid": "187c2482-c4dc-ed11-a7c6-6045bdd0ef122"
        }
      },
      {
        "children": [
          {
            // "children": [],
            // "switcherIcon": true,
            "description": null,
            "hasParent": true,
            "key": "e3b4d193-4b21-ee11-9cbc-6045bdd0ef241242",
            "parentSequanceId": 'e3b4d193-4b21-ee11-9cbc-6045bdd0ef22',
            "title": "API_C1 WI 02-02-01",
            "workItemsequance": {
              "sequance": 1,
              "sequanceid": "e2b4d193-4b21-ee11-9cbc-6045bdd0ef212"
            },
            "workItemtype": {
              "type": "Feature",
              "workitemtypeid": "187c2482-c4dc-ed11-a7c6-6045bdd0ef122"
            }
          }
        ],
        // "switcherIcon": true,
        "description": null,
        "hasParent": true,
        "key": "e3b4d193-4b21-ee11-9cbc-6045bdd0ef24412",
        "parentSequanceId": 'e3b4d193-4b21-ee11-9cbc-6045bdd0ef22',
        "title": "API_C1 WI 02-03",
        "workItemsequance": {
          "sequance": 1,
          "sequanceid": "e2b4d193-4b21-ee11-9cbc-6045bdd0ef212"
        },
        "workItemtype": {
          "type": "Feature",
          "workitemtypeid": "187c2482-c4dc-ed11-a7c6-6045bdd0ef122"
        }
      }
    ],
    // "switcherIcon": false,
    "description": null,
    "hasParent": false,
    "key": "e3b4d193-4b21-ee11-9cbc-6045bdd0ef22",
    "parentSequanceId": null,
    "title": "API_C1 WI 02",
    "workItemsequance": {
     "sequance": 1,
     "sequanceid": "e2b4d193-4b21-ee11-9cbc-6045bdd0ef22"
    },
    "workItemtype": {
     "type": "Feature",
     "workitemtypeid": "187c2482-c4dc-ed11-a7c6-6045bdd0ef22"
    }
   },
   {
    // "children": [],
    // "switcherIcon": true,
    "description": null,
    "hasParent": false,
    "key": "f9d6989e-4b21-ee11-9cbc-6045bdd0ef22",
    "parentSequanceId": null,
    "title": "API_C1 WI 03",
    "workItemsequance": {
     "sequance": 2,
     "sequanceid": "f8d6989e-4b21-ee11-9cbc-6045bdd0ef22"
    },
    "workItemtype": {
     "type": "Epic",
     "workitemtypeid": "157c2482-c4dc-ed11-a7c6-6045bdd0ef22"
    }
   },
   {
    // "children": [],
    // "switcherIcon": true,
    "description": null,
    "hasParent": false,
    "key": "3cb3acac-4b21-ee11-9cbc-6045bdd0ef22",
    "parentSequanceId": null,
    "title": "API_C1 WI 04",
    "workItemsequance": {
     "sequance": 1,
     "sequanceid": "3bb3acac-4b21-ee11-9cbc-6045bdd0ef22"
    },
    "workItemtype": {
     "type": "Task",
     "workitemtypeid": "5c7a6e8a-c4dc-ed11-a7c6-6045bdd0ef22"
    }
   },
   {
    // "children": [],
    // "switcherIcon": true,
    "description": null,
    "hasParent": false,
    "key": "bc49dcbc-4b21-ee11-9cbc-6045bdd0ef22",
    "parentSequanceId": null,
    "title": "API_C1 WI 05",
    "workItemsequance": {
     "sequance": 1,
     "sequanceid": "bb49dcbc-4b21-ee11-9cbc-6045bdd0ef22"
    },
    "workItemtype": {
     "type": "Feature",
     "workitemtypeid": "187c2482-c4dc-ed11-a7c6-6045bdd0ef22"
    }
   },
   {
    "children": null,
    "switcherIcon": true,
    "description": null,
    "hasParent": false,
    "key": "b97043cd-4b21-ee11-9cbc-6045bdd0ef22",
    "parentSequanceId": null,
    "title": "API_C1 WI 06",
    "workItemsequance": {
     "sequance": 1,
     "sequanceid": "b87043cd-4b21-ee11-9cbc-6045bdd0ef22"
    },
    "workItemtype": {
     "type": "User Story",
     "workitemtypeid": "68f77c92-c4dc-ed11-a7c6-6045bdd0ef22"
    }
   }
  ]
}