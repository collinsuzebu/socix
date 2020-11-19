import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";
import {
  setCurrentChannel,
  setPrivateChannel,
} from "../../redux/actions/channel";
import firebase from "../../firebase";

export function Starred() {
  const [starredChannels, setStarredChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState("");

  // Firebase Ref State
  const [usersRef, setUsersRef] = useState(firebase.database().ref("users"));

  //   Selectors
  const user = useSelector((state) => state.user.currentUser);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      addListeners(user.uid);
    }
  }, []);

  const addListeners = (userId) => {
    //   Listen when channel is starred
    usersRef
      .child(userId)
      .child("starred")
      .on("child_added", (snap) => {
        const starredChannel = {
          id: snap.key,
          ...snap.val(),
        };

        setStarredChannels([...starredChannels, starredChannel]);
      });

    //   Listen for unstarred channels
    usersRef
      .child(userId)
      .child("starred")
      .on("child_removed", (snap) => {
        const channelToRemove = {
          id: snap.key,
          ...snap.val(),
        };
        const filteredChannels = starredChannels.filter((channel) => {
          return channel.id !== channelToRemove.id;
        });
        setStarredChannels(filteredChannels);
      });
  };

  const displayChannels = (starredChannels) =>
    starredChannels.length > 0 &&
    starredChannels.map((channel) => (
      <Menu.Item
        key={channel.id}
        name={channel.name}
        onClick={() => {
          changeChannel(channel);
        }}
        style={{ opacity: 0.7 }}
        active={channel.id === activeChannel.id}
      >
        # {channel.name}
      </Menu.Item>
    ));

  const setActiveChannelIndicator = (channel) => {
    setActiveChannel(channel);
  };

  const changeChannel = (channel) => {
    setActiveChannelIndicator(channel);
    dispatch(setCurrentChannel(channel));
    dispatch(setPrivateChannel(false));
  };

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="star" /> Starred
        </span>{" "}
        {starredChannels.length}
      </Menu.Item>

      {displayChannels(starredChannels)}
    </Menu.Menu>
  );
}
