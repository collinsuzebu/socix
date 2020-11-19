import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Accordion, Image, Header, Icon, Segment } from "semantic-ui-react";

export function MetaPanel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const channel = useSelector((state) => state.channel.currentChannel);
  const isPrivateChannel = useSelector(
    (state) => state.channel.isPrivateChannel
  );

  const setActiveIndexDynamic = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  if (isPrivateChannel) {
    return null;
  }
  return (
    <Segment loading={!channel}>
      <Header as="h3" attached="top">
        About #{channel && channel.name}
      </Header>
      <Accordion styled attached="true">
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={setActiveIndexDynamic}
        >
          <Icon name="dropdown" />
          <Icon name="info" />
          Channel about
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          details
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={setActiveIndexDynamic}
        >
          <Icon name="dropdown" />
          <Icon name="pin" />
          Pinned posts
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          details
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 2}
          index={2}
          onClick={setActiveIndexDynamic}
        >
          <Icon name="dropdown" />
          <Icon name="pencil alternate" />
          Created By
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          <Image
            avatar
            spaced="right"
            src={channel && channel.createdBy.avatar}
          />
          {channel && channel.createdBy.name}
        </Accordion.Content>
      </Accordion>
    </Segment>
  );
}
