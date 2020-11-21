import React from "react";
import { useSelector } from "react-redux";
import { Header, Icon } from "semantic-ui-react";
import Spinner from "../../Spinner";

const isLoggedInUser = (user, displayName) =>
  displayName.slice(1) === user.displayName ? true : false;

export function EmptyMessage({ user, isPrivate, displayName, loading }) {
  const color = useSelector((state) => state.color);
  if (loading) {
    return <Spinner content=" " size="medium" />;
  }

  return (
    <Header as="h2">
      <Icon name="write square" />
      <Header.Content>
        {isPrivate ? (
          <>
            {isLoggedInUser(user, displayName) ? (
              "This is your space. Draft messages, list your to-dos, or keep links and files handy."
            ) : (
              <span>
                You don't have any direct message with{" "}
                <span style={{ color: color.primary }}>{displayName}</span>
              </span>
            )}
          </>
        ) : (
          "No message has been added to this channel"
        )}

        <Header.Subheader>
          {isLoggedInUser(user, displayName)
            ? "You can also talk to yourself here."
            : "Be the first to start a discussion here"}
        </Header.Subheader>
      </Header.Content>
    </Header>
  );
}
