import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Grid, Header, Icon, Image } from "semantic-ui-react";
import firebase from "../../firebase";

export default function UserPanel() {
  const user = useSelector((state) => state.user.currentUser);

  const handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("Signed Out");
      });
  };

  const dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{user.displayName}</strong>
        </span>
      ),
    },

    { key: "avatar", text: <span>Change Profile Image</span> },

    {
      key: "signout",
      text: <span onClick={handleSignout}>Sign Out</span>,
    },
  ];

  return (
    <Grid>
      <Grid.Column>
        <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
          <Header inverted floated="left" as="h2">
            <Icon name="code" />
            <Header.Content>Socix</Header.Content>
          </Header>
        </Grid.Row>

        <Header inverted as="h4" style={{ padding: "1.25em" }}>
          <Dropdown
            trigger={
              <span>
                <Image avatar spaced="right" src={user.photoURL} />
                {user.displayName}
              </span>
            }
            options={dropdownOptions()}
          />
        </Header>
      </Grid.Column>
    </Grid>
  );
}
