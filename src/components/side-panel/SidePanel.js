import React from "react";
import { Menu } from "semantic-ui-react";
import { Channels } from "./Channels";
import { DirectMessages } from "./DirectMessages";
import UserPanel from "./UserPanel";

export function SidePanel() {
  return (
    <Menu
      vertical
      inverted
      size="large"
      fixed="left"
      style={{ background: "#4c3c4c", fontSize: "1.2rem" }}
    >
      <UserPanel />
      <Channels />
      <DirectMessages />
    </Menu>
  );
}
