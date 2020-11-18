import React from "react";
import { Header, Icon, Input, Segment } from "semantic-ui-react";

export function MessageHeader({
  channelName,
  numUsers,
  handleSearchChange,
  searchLoading,
  isPrivateChannel,
}) {
  return (
    <Segment clearing>
      {/* Channel name and short info */}
      <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
        <span>
          {channelName}
          {!isPrivateChannel && <Icon name="star outline" color="black" />}
        </span>
        <Header.Subheader>{numUsers}</Header.Subheader>
      </Header>

      {/* Channel Search Field */}
      <Header floated="right">
        <Input
          size="mini"
          icon="search"
          name="searchMessages"
          placeholder="Search messages"
          loading={searchLoading}
          onChange={handleSearchChange}
        ></Input>
      </Header>
    </Segment>
  );
}