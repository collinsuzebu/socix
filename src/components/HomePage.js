import React from "react";
import { useSelector } from "react-redux";
import { Divider, Grid, Segment } from "semantic-ui-react";
import { Offline, Online } from "react-detect-offline";
import { ColorPanel } from "./color-panel/ColorPanel";
import { Messages } from "./messages/Messages";
import { MetaPanel } from "./meta-panel/MetaPanel";
import { SidePanel } from "./side-panel/SidePanel";

import { Menu } from "semantic-ui-react";
const items = [
  { key: "editorials", active: true, name: "Editorials" },
  { key: "review", name: "Reviews" },
  { key: "events", name: "Upcoming Events" },
];

export default function HomePage() {
  const color = useSelector((state) => state.color);
  const isPrivateChannel = useSelector(
    (state) => state.channel.isPrivateChannel
  );

  return (
    <>
      <div className="top__menu" style={{ background: color.primary }}>
        <Offline>It seems that you're currently offline.</Offline>
        <Online></Online>
      </div>

      <Grid
        columns="equal"
        className="app"
        style={{ background: color.secondary }}
      >
        <ColorPanel color={color} />
        <SidePanel color={color} />

        <Grid.Row stretched>
          <Grid.Column style={{ marginLeft: 325 }} className="white__box">
            <Messages />
          </Grid.Column>

          {!isPrivateChannel && (
            <Grid.Column width={4} className="white__box">
              <MetaPanel />
            </Grid.Column>
          )}
        </Grid.Row>
      </Grid>
    </>
  );
}
