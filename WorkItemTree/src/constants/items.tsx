import type { MenuProps } from "antd/es/menu";
import * as React from "react";

import {
  CopyOutlined,
} from "@ant-design/icons";

import { DropDownItems } from ".";

export const items: MenuProps["items"] = [
  {
    key: "1",
    icon: <CopyOutlined />,
    label: <div>{DropDownItems?.COPY}</div>,
  },
];