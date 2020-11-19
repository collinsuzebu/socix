import React from "react";
import { Menu } from "semantic-ui-react";
import { Channels } from "./Channels";
import { DirectMessages } from "./DirectMessages";
import { Starred } from "./Starred";
import UserPanel from "./UserPanel";

export function SidePanel({ color }) {
  return (
    <Menu
      vertical
      inverted
      size="large"
      fixed="left"
      style={{ background: color.primary, fontSize: "1.2rem" }}
    >
      <UserPanel color={color} />
      <Starred />
      <Channels />
      <DirectMessages />
    </Menu>
  );
}
