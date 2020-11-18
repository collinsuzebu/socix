import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button, Input, Segment } from "semantic-ui-react";
import firebase from "../../firebase";
import { FileModal } from "./FileModal";

export function MessageForm({
  messagesRef,
  channel,
  user,
  isPrivateChannel,
  getMessagesRef,
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [uploadState, setUploadState] = useState("");
  const [uploadTask, setUploadTask] = useState(null);
  const [percentUploaded, setPercentUploaded] = useState(null);
  const [error, setError] = useState("");

  const [storageRef, _] = useState(firebase.storage().ref());

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  const createMessage = (fileUrl = null) => {
    const _message = {
      user: {
        id: user.uid,
        name: user.displayName,
        avatar: user.photoURL,
      },
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    };

    if (fileUrl) {
      _message["image"] = fileUrl;
    } else {
      _message["content"] = message;
    }

    return _message;
  };

  const sendMessage = () => {
    if (message) {
      setLoading(true);
      getMessagesRef()
        .child(channel.id)
        .push()
        .set(createMessage())
        .then(() => {
          setLoading(false);
          setMessage("");
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
          setError(err);
        });
    } else {
      setError("There is no message to send");
    }
  };

  const getPath = () => {
    if (isPrivateChannel) {
      return `chat/private-${channel.id}`;
    } else {
      return `chat/public`;
    }
  };

  const uploadFile = (file, metadata) => {
    const pathToUpload = channel.id;
    const ref = getMessagesRef();
    const filePath = `${getPath()}/${uuidv4()}.jpg`; // TODO: make file path dynamic

    setUploadState("uploading");
    setUploadTask(storageRef.child(filePath).put(file, metadata));
  };

  useEffect(() => {
    if (uploadTask) {
      uploadTask.on(
        "state_changed",
        (snap) => {
          const percent = Math.round(
            (snap.bytesTransferred / snap.totalBytes) * 100
          );

          setPercentUploaded(percent);
        },
        (err) => {
          console.log(err);
          setError(err);
          setUploadState("An error occurred while uploading the file");
          setUploadTask(null);
        }
      );

      uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl) => {
        sendFilemessage(downloadUrl, messagesRef, channel.id).catch((err) => {
          console.log(err);
          setUploadState("An error occurred while uploading the file");
          setUploadTask(null);
        });
      });
    }
    // return () => {
    //   cleanup;
    // };
  }, [uploadTask]);

  const sendFilemessage = (fileUrl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(createMessage(fileUrl))
      .then(() => {
        setUploadState("File upload complete");
      })
      .catch((err) => {
        console.log(err);
        setError(err);
      });
  };
  return (
    <Segment className="message__form">
      <Input
        fluid
        name="message"
        placeholder="Write a message"
        labelPosition="left"
        label={<Button icon="add" />}
        value={message}
        style={{ marginBottom: "0.7em" }}
        onChange={handleChange}
        className={error ? "error" : ""}
      />

      <Button.Group icon widths="2">
        <Button
          color="vk"
          content="Reply"
          labelPosition="left"
          icon="edit"
          onClick={sendMessage}
          disabled={loading}
        />
        <Button
          color="google plus"
          content="Upload media"
          labelPosition="right"
          icon="cloud upload"
          onClick={openModal}
        />

        <FileModal
          modal={modal}
          closeModal={closeModal}
          uploadFile={uploadFile}
        />
      </Button.Group>
    </Segment>
  );
}
