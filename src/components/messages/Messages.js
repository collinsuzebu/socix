import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Comment, Segment } from "semantic-ui-react";
import firebase from "../../firebase";
import { MessageForm } from "./MessageForm";
import { MessageHeader } from "./MessageHeader";
import { Message } from "./Message";

export function Messages() {
  const [messagesRef, setMessagesRef] = useState(
    firebase.database().ref("messages")
  );
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [numUsers, setNumUsers] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [privateMessagesRef, setPrivateMessagesRef] = useState(
    firebase.database().ref("private_messages")
  );

  const channel = useSelector((state) => state.channel.currentChannel);
  const user = useSelector((state) => state.user.currentUser);
  const isPrivateChannel = useSelector(
    (state) => state.channel.isPrivateChannel
  );

  useEffect(() => {
    if (channel && user) {
      addListeners(channel.id);
    }
  }, [channel, user]);

  const addListeners = (channelId) => {
    addMessageListener(channelId);
  };

  const addMessageListener = (channelId) => {
    let loadedMessages = [];
    const ref = getMessagesRef();
    ref.child(channelId).on("child_added", (snap) => {
      loadedMessages.push(snap.val());

      // TODO: fix clearing timeout
      const timeout = setTimeout(() => {
        setMessages(loadedMessages);
        getUsers(loadedMessages);
        setLoading(false);
      }, 200);
    });
  };

  // Get messages reference
  const getMessagesRef = () =>
    isPrivateChannel ? privateMessagesRef : messagesRef;

  const getUsers = (messages) => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;

    const numUniqueUsers = `${uniqueUsers.length} user${plural ? "s" : ""}`;
    setNumUsers(numUniqueUsers);
  };
  const displayChannelName = (channel) =>
    channel ? `${isPrivateChannel ? "@" : "#"}${channel.name}` : "";

  const displayMessages = (messages) =>
    messages.length > 0 &&
    messages.map((message) => (
      <Message key={message.timestamp} message={message} user={user} />
    ));

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSearchLoading(true);
  };

  // Effect for when searchterm is updated

  useEffect(() => {
    if (searchTerm) {
      const channnelMessages = [...messages];
      const regex = new RegExp(searchTerm, "gi");
      const searchResults = channnelMessages.reduce((acc, message) => {
        if (
          message.content &&
          (message.content.match(regex) || message.user.name.match(regex))
        ) {
          acc.push(message);
        }

        return acc;
      }, []);
      setSearchResults(searchResults);
      setTimeout(() => {
        setSearchLoading(false);
      }, 1000);
    }
  }, [searchTerm]);

  return (
    <>
      <MessageHeader
        channelName={displayChannelName(channel)}
        numUsers={numUsers}
        searchLoading={searchLoading}
        isPrivateChannel={isPrivateChannel}
        handleSearchChange={handleSearchChange}
      />
      <Segment>
        <Comment.Group className="messages">
          {searchTerm
            ? displayMessages(searchResults)
            : displayMessages(messages)}
        </Comment.Group>
      </Segment>

      <MessageForm
        messagesRef={messagesRef}
        getMessagesRef={getMessagesRef}
        channel={channel}
        user={user}
      />
    </>
  );
}
