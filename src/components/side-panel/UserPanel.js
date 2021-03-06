import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Divider,
  Dropdown,
  Grid,
  Header,
  Icon,
  Image,
  Input,
  Modal,
  Segment,
} from "semantic-ui-react";
import AvatarEditor from "react-avatar-editor";
import firebase from "../../firebase";
import { contentType } from "mime-types";

export default function UserPanel({ color }) {
  const [modal, setModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blob, setBlob] = useState(null);
  const [metadata, setMetadata] = useState({ contentType: "image/jpeg" });
  const [storageRef, setStorageRef] = useState(firebase.storage().ref());
  const [userRef, setUserRef] = useState(firebase.auth().currentUser);
  const [usersRef, setUsersRef] = useState(firebase.database().ref("users"));
  const [uploadedCroppedImage, setUploadedCroppedImage] = useState(null);

  // Selectors
  const user = useSelector((state) => state.user.currentUser);

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  const handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("Signed Out");
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener("load", () => {
        setPreviewImage(reader.result);
      });
    }
  };

  var avatarEditor;
  const setEditorRef = (editor) => {
    avatarEditor = editor;
  };

  const handleCroppedImage = () => {
    if (avatarEditor) {
      avatarEditor.getImageScaledToCanvas().toBlob((blob) => {
        let imageUrl = URL.createObjectURL(blob);
        setCroppedImage(imageUrl);
        setBlob(blob);
      });
    }
  };

  const uploadCroppedImage = () => {
    setLoading(true);
    storageRef
      .child(`avatars/users/${userRef.uid}`)
      .put(blob, metadata)
      .then((snap) => {
        snap.ref.getDownloadURL().then((downloadUrl) => {
          setUploadedCroppedImage(downloadUrl);
        });
      });
  };

  // Effect when crop image has successfully been set in state
  useEffect(() => {
    if (uploadedCroppedImage) {
      setLoading(false);
      userRef
        .updateProfile({
          photoURL: uploadedCroppedImage,
        })
        .then(() => {
          closeModal();
          console.log("PhotoURL updated");
        })
        .catch((err) => {
          console.log(err);
        });

      usersRef
        .child(user.uid)
        .update({ avatar: uploadedCroppedImage })
        .then(() => {
          console.log("user avatar updated");
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [uploadedCroppedImage]);

  const dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{user.displayName}</strong>
        </span>
      ),
    },

    {
      key: "avatar",
      text: <span onClick={openModal}>Change Profile Image</span>,
    },

    {
      key: "signout",
      text: <span onClick={handleSignout}>Sign Out</span>,
    },
  ];

  return (
    <Grid style={{ background: color.primary }}>
      <Grid.Column>
        <Grid.Row className="user__panel">
          <Header inverted floated="left" as="h2">
            <Icon name="ravelry" />
            <Header.Content>Socix</Header.Content>
          </Header>
        </Grid.Row>
        <div
          className="line"
          style={{ borderBottom: `2.3px solid ${color.primary}` }}
        ></div>

        <Header inverted as="h4" style={{ padding: "1.25em" }}>
          <Dropdown
            trigger={
              <span>
                <Image avatar spaced="right" src={user.photoURL} />
                {user.displayName}
              </span>
            }
            options={dropdownOptions()}
          />
        </Header>
        <Modal standard open={modal} onClose={closeModal}>
          <Modal.Header>Select a Photo</Modal.Header>

          <Modal.Content image>
            {!previewImage && (
              <Image
                size="medium"
                src="https://react.semantic-ui.com/images/avatar/large/rachel.png"
                wrapped
              />
            )}

            {previewImage && (
              <AvatarEditor
                ref={(node) => setEditorRef(node)}
                image={previewImage}
                border={50}
                scale={1.2}
              />
            )}

            {
              <Icon
                color="green"
                size="huge"
                name="arrow alternate circle right outline"
                style={{
                  paddingLeft: 50,
                  paddingTop: 120,
                }}
              />
            }

            {croppedImage && (
              <Image
                style={{ marginLeft: "15em" }}
                width={280}
                height={280}
                src={croppedImage}
              />
            )}
          </Modal.Content>
          <Modal.Actions>
            <Button>
              <Input
                transparent
                floated="left"
                type="file"
                name="previewImage"
                onChange={handleFileChange}
              />
            </Button>
            {croppedImage && (
              <Button
                color="green"
                inverted
                onClick={uploadCroppedImage}
                disabled={loading}
                loading={loading}
              >
                <Icon name="save" /> Change Profile
              </Button>
            )}
            <Button color="green" inverted onClick={handleCroppedImage}>
              <Icon name="image" /> Preview
            </Button>
            <Button color="red" inverted onClick={closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Grid.Column>
    </Grid>
  );
}
