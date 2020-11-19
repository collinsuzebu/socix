import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Icon, Menu } from "semantic-ui-react";
import firebase from "../../firebase";
import { setCurrentChannel } from "../../redux/actions/channel";
import { setPrivateChannel } from "../../redux/actions/channel";

export function DirectMessages() {
  const [users, setUsers] = useState([]);
  const [activeChannel, setActiveChannel] = useState("");
  const [usersRef, setUsersRef] = useState(firebase.database().ref("users"));
  const [connectedRef, setConnectedRef] = useState(
    firebase.database().ref(".info/connected")
  );
  const [onlineRef, setOnlineRef] = useState(
    firebase.database().ref("online-users")
  );

  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      addListeners(user.uid);
    }
  }, [user]);

  const addListeners = (currentUserUid) => {
    let loadedUsers = [];
    usersRef.on("child_added", (snap) => {
      let user = snap.val();
      user["uid"] = snap.key;
      user["status"] = "offline";
      if (currentUserUid === snap.key) {
        user["status"] = "online";
      }
      loadedUsers.push(user);
      setTimeout(() => {
        setUsers(loadedUsers);
      }, 500);
    });

    connectedRef.on("value", (snap) => {
      if (snap.val() === true) {
        const ref = onlineRef.child(currentUserUid);
        ref.set(true);
        ref.onDisconnect().remove((err) => {
          if (err !== null) {
            console.log(err);
          }
        });
      }
    });

    onlineRef.on("child_added", (snap) => {
      addStatusToUser(snap.key);
    });

    onlineRef.on("child_removed", (snap) => {
      addStatusToUser(snap.key, false);
    });
  };

  const addStatusToUser = (userId, connected = true) => {
    const updatedUsers = users.reduce((acc, user) => {
      if (user.uid === userId) {
        user["status"] = `${connected ? "online" : "offline"}`;
      }
      return acc.concat(user);
    }, []);

    setTimeout(() => {
      setUsers(updatedUsers);
    }, 500);
  };

  const changeChannel = (user) => {
    const channelId = getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.name,
    };

    dispatch(setCurrentChannel(channelData));
    dispatch(setPrivateChannel(true));
    setActiveChannel(user.uid);
  };

  const getChannelId = (userId) => {
    return userId < user.uid
      ? `${userId}/${user.uid}`
      : `${user.uid}/${userId}`;
  };

  const isUserOnline = (user) => user.status === "online";

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="mail" /> Direct messages
        </span>
        ({users.length})
      </Menu.Item>

      {users.map((user) => (
        <Menu.Item
          key={user.uid}
          active={user.uid === activeChannel}
          onClick={() => changeChannel(user)}
          style={{ opacity: 0.7 }}
        >
          <Icon
            name="circle"
            size="tiny"
            color={isUserOnline(user) ? "green" : "red"}
          />
          @ {user.name}
        </Menu.Item>
      ))}
    </Menu.Menu>
  );
}
