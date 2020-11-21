import React from "react";
import moment from "moment";
import { Comment, Image } from "semantic-ui-react";
import { useSelector } from "react-redux";

const isOwnMessage = (message, user) => {
  return message.user.id === user.uid ? true : false;
};

const timeFromNow = (timestamp) => moment(timestamp).fromNow();

export function Message({ message, user }) {
  const color = useSelector((state) => state.color);
  const isImage = (message) => {
    return (
      message.hasOwnProperty("image") && !message.hasOwnProperty("content")
    );
  };
  // console.log(user);
  return (
    <div className="message__display">
      <Comment>
        <Comment.Avatar src={message.user.avatar} />
        <Comment.Content>
          <Comment.Author
            style={{
              filter: "brightness(95%)",
              color:
                isOwnMessage(message, user) !== false ? `${color.primary}` : "",
            }}
            as="a"
          >
            {message.user.name}
          </Comment.Author>
          <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>

          {isImage(message) ? (
            <Image src={message.image} className="message__image" />
          ) : (
            <Comment.Text>{message.content}</Comment.Text>
          )}
          <Comment.Actions>
            <Comment.Action>Reply</Comment.Action>
          </Comment.Actions>
        </Comment.Content>
      </Comment>
    </div>
  );
}
