import React from "react";
import { Grid } from "semantic-ui-react";
import { ColorPanel } from "./color-panel/ColorPanel";
import { Messages } from "./messages/Messages";
import { MetaPanel } from "./meta-panel/MetaPanel";
import { SidePanel } from "./side-panel/SidePanel";

export default function HomePage() {
  return (
    <Grid columns="equal" className="app" style={{ background: "#eee" }}>
      <ColorPanel />
      <SidePanel />

      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages />
      </Grid.Column>

      <Grid.Column width={4}>
        <MetaPanel />
      </Grid.Column>
    </Grid>
  );
}
