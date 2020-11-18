import React from "react";
import { Button, Divider, Menu, Sidebar } from "semantic-ui-react";

export function ColorPanel() {
  return (
    <Sidebar
      inverted
      visible
      vertical
      width="very thin"
      as={Menu}
      icon="labeled"
    >
      <Divider />
      <Button icon="add" size="small" color="grey" />
    </Sidebar>
  );
}
