import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Comment, Segment } from "semantic-ui-react";
import firebase from "../../firebase";
import { MessageForm } from "./MessageForm";
import { MessageHeader } from "./MessageHeader";
import { Message } from "./Message";
import Typing from "./Typing";
import { MessageSkeleton } from "./MessageSkeleton";
import { EmptyMessage } from "./EmptyMessage";
import setSearchResult from "../../redux/actions/search";

export function Messages() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [numUsers, setNumUsers] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  // const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isChannelStarred, setIsChannelStarred] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);

  // Firebase Ref State
  const [usersRef, setUsersRef] = useState(firebase.database().ref("users"));
  const [typingRef, setTypingRef] = useState(firebase.database().ref("typing"));
  const [connectedRef, setCref] = useState(
    firebase.database().ref(".info/connected")
  );
  const [messagesRef, setMessagesRef] = useState(
    firebase.database().ref("messages")
  );
  const [privateMessagesRef, setPrivateMessagesRef] = useState(
    firebase.database().ref("private_messages")
  );

  // Dispatch

  const dispatch = useDispatch();

  // Selectors
  const channel = useSelector((state) => state.channel.currentChannel);
  const searchResults = useSelector((state) => state.searched);
  const user = useSelector((state) => state.user.currentUser);
  const isPrivateChannel = useSelector(
    (state) => state.channel.isPrivateChannel
  );

  // Refs

  var MessagesScrollRef;
  const setScrollToMessageRef = (scroll) => {
    if (scroll) {
      MessagesScrollRef = scroll;
      MessagesScrollRef.scrollIntoView({ behaviour: "smooth" });
    }
  };

  // useEffect(() => {}, [MessagesScrollRef]);

  useEffect(() => {
    if (channel && user) {
      addListeners(channel.id);
      addStarredListener(channel.id, user.uid);
    }
  }, [channel]);

  const addListeners = (channelId) => {
    addMessageListener(channelId);
    addTypingListeners(channelId);
  };

  const addTypingListeners = (channelId) => {
    let typingUsers = [];

    typingRef.child(channelId).on("child_added", (snap) => {
      if (snap.key !== user.uid) {
        typingUsers = typingUsers.concat({ id: snap.key, name: snap.val() });
      }
      setTypingUsers(typingUsers);
    });

    typingRef.child(channelId).on("child_removed", (snap) => {
      const index = typingUsers.findIndex((user) => user.id === snap.key);

      if (index !== -1) {
        typingUsers = typingUsers.filter((user) => user.id !== snap.key);
        setTypingUsers(typingUsers);
      }
    });

    connectedRef.on("value", (snap) => {
      if (snap.val() === true) {
        typingRef
          .child(channelId)
          .child(user.uid)
          .onDisconnect()
          .remove((err) => {
            if (err !== null) {
              console.log(err);
            }
          });
      }
    });
  };

  const addStarredListener = (channelId, userId) => {
    usersRef
      .child(userId)
      .child("starred")
      .once("value")
      .then((data) => {
        if (data.val() !== null) {
          const channelIds = Object.keys(data.val());
          const prevStarred = channelIds.includes(channelId);
          setIsChannelStarred(prevStarred);
        }
      });
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
      }, 800);
    });

    if (loadedMessages.length === 0) {
      setMessages(loadedMessages);
      getUsers(loadedMessages);
      setLoading(false);
    }
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
    messages.length > 0 ? (
      messages.map((message) => (
        <Message key={message.timestamp} message={message} user={user} />
      ))
    ) : (
      <EmptyMessage
        user={user}
        loading={loading}
        displayName={displayChannelName(channel)}
        isPrivate={isPrivateChannel}
      />
    );

  const displayMessageSkeleton = (loading) =>
    loading ? (
      <React.Fragment>
        {[...Array(10)].map((_, i) => (
          <MessageSkeleton key={i} />
        ))}
      </React.Fragment>
    ) : null;

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
      // setSearchResults(searchResults);
      dispatch(setSearchResult(searchResults));
      setTimeout(() => {
        setSearchLoading(false);
      }, 600);
    } else {
      setSearchLoading(false);
    }
  }, [searchTerm]);

  // Starring a channel
  const handleStar = () => {
    setIsChannelStarred(!isChannelStarred);
  };

  // Effect callback when handleStar is called
  useEffect(() => {
    if (channel) {
      if (isChannelStarred) {
        usersRef.child(`${user.uid}/starred`).update({
          [channel.id]: {
            name: channel.name,
            details: channel.details,
            createdBy: {
              name: channel.createdBy.name,
              avatar: channel.createdBy.avatar,
            },
          },
        });
      } else {
        usersRef
          .child(`${user.uid}/starred`)
          .child(channel.id)
          .remove((err) => {
            if (err !== null) {
              console.error(err);
            }
          });
      }
    }
  }, [isChannelStarred]);

  const displayTypingUsers = (users) =>
    users.length > 0 &&
    users.map((user) => (
      <div key={user.id} className="user__typing__container">
        <span className="user__typing">{user.name} is typing</span>
        <Typing />
      </div>
    ));

  return (
    <>
      <Segment.Group>
        <MessageHeader
          channelName={displayChannelName(channel)}
          numUsers={numUsers}
          searchLoading={searchLoading}
          handleStar={handleStar}
          isChannelStarred={isChannelStarred}
          isPrivateChannel={isPrivateChannel}
          handleSearchChange={handleSearchChange}
        />
        <Segment className="messages">
          <Comment.Group>
            {displayMessageSkeleton(loading)}
            {searchTerm
              ? displayMessages(searchResults)
              : displayMessages(messages)}

            {displayTypingUsers(typingUsers)}
            <div ref={(ref) => setScrollToMessageRef(ref)}></div>
          </Comment.Group>
        </Segment>
      </Segment.Group>

      <MessageForm
        messagesRef={messagesRef}
        getMessagesRef={getMessagesRef}
        channel={channel}
        user={user}
      />
    </>
  );
}
