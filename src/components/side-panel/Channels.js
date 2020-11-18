import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import {
  Menu,
  Icon,
  Modal,
  Form,
  Input,
  Button,
  Label,
} from "semantic-ui-react";
import firebase from "../../firebase";
import {
  setCurrentChannel,
  setPrivateChannel,
} from "../../redux/actions/channel";

export function Channels() {
  const [modal, setModal] = useState(false);
  const [channels, setChannels] = useState([]);
  const [channel, setChannel] = useState([]);
  const [loadLastActiveChannel, setLoadLastActiveChannel] = useState(true);
  const [activeChannel, setActiveChannel] = useState({});
  const [notifications, setNotifications] = useState([]);

  const [channelsRef, setChannelsRef] = useState(
    firebase.database().ref("channels")
  );
  const [messagesRef, setMessagesRef] = useState(
    firebase.database().ref("messages")
  );

  const { register, handleSubmit, reset } = useForm();

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.currentUser);

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  useEffect(() => {
    let loadedChannels = [];
    channelsRef.on("child_added", (snap) => {
      loadedChannels.push(snap.val());

      // TODO: fix clearTimeout Issue
      setTimeout(() => {
        setChannels(loadedChannels);
      }, 800);

      addNotificationListener(snap.key);

      return () => channelsRef.off();
    });

    return () => channelsRef.off(); //clean up
  }, []);

  // Notification
  const addNotificationListener = (channelId) => {
    messagesRef.child(channelId).on("value", (snap) => {
      if (channel) {
        handleNotifications(channelId, channel.id, notifications, snap);
      }
    });
  };

  const handleNotifications = (
    channelId,
    currentcChannelId,
    notifications,
    snap
  ) => {
    let lastTotal = 0;

    let index = notifications.findIndex(
      (notification) => notification.id === channelId
    );

    if (index !== -1) {
      if (channelId !== currentcChannelId) {
        lastTotal = notifications[index].total;

        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }
      notifications[index].lastKnownTotal = snap.numChildren();
    } else {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0,
      });
    }

    setNotifications(notifications);
  };

  useEffect(() => {
    if (channels.length > 0) {
      setLastActiveChannel();
    }
  }, [channels]);

  const submitModal = (data) => {
    if (data.channelName && data.channelDetails) {
      addChannel(data);
    }
  };

  const addChannel = ({ channelName, channelDetails }) => {
    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL,
      },
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        reset();
        closeModal();
        console.log("Channel Added successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getNotificationCount = (channel) => {
    let count = 0;

    notifications.forEach((notification) => {
      if (notification.id === channel.id) {
        count = notification.count;
      }
    });

    if (count > 0) return count;
  };

  const displayChannels = (channels) =>
    channels.length > 0 &&
    channels.map((channel) => (
      <Menu.Item
        key={channel.id}
        name={channel.name}
        onClick={() => {
          changeChannel(channel);
        }}
        style={{ opacity: 0.7 }}
        active={channel.id === activeChannel.id}
      >
        {getNotificationCount(channel) && (
          <Label color="red">{getNotificationCount(channel)}</Label>
        )}
        # {channel.name}
      </Menu.Item>
    ));

  const changeChannel = (channel) => {
    setActiveChannelIndicator(channel);
    clearNotifications();
    dispatch(setCurrentChannel(channel));
    dispatch(setPrivateChannel(false));
    setChannel(channel);
  };

  const clearNotifications = () => {
    let index = notifications.findIndex(
      (notification) => notification.id === channel.id
    );

    if (index !== -1) {
      let updatedNotifications = [...notifications];
      updatedNotifications[index].total = notifications[index].lastKnownTotal;
      updatedNotifications[index].count = 0;
      setNotifications(updatedNotifications);
    }
  };

  const setLastActiveChannel = () => {
    const lastActiveChannel = channels[0]; // do the actual changes later
    if (loadLastActiveChannel) {
      setActiveChannelIndicator(lastActiveChannel);
      dispatch(setCurrentChannel(lastActiveChannel));
      setChannel(lastActiveChannel);
    }

    setLoadLastActiveChannel(false);
  };

  const setActiveChannelIndicator = (channel) => {
    setActiveChannel(channel);
  };

  return (
    <>
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="exchange" /> Channels
          </span>
          <Icon name="add" onClick={openModal} />
        </Menu.Item>

        {displayChannels(channels)}
      </Menu.Menu>

      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header>Add a channel</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit(submitModal)}>
            <Form.Field>
              <input
                placeholder="Name of Channel"
                name="channelName"
                ref={register()}
              />
            </Form.Field>
            <Form.Field>
              <input
                placeholder="About the Channel"
                name="channelDetails"
                ref={register()}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            inverted
            color="green"
            onClick={handleSubmit((d) => submitModal(d))}
          >
            <Icon name="checkmark" /> Add
          </Button>
          <Button inverted color="red" onClick={closeModal}>
            <Icon name="checkmark" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}
