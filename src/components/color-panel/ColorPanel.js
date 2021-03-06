import React, { useEffect, useState } from "react";
import {
  Button,
  Divider,
  Icon,
  Label,
  Menu,
  Modal,
  Segment,
  Sidebar,
} from "semantic-ui-react";
import { SliderPicker, CompactPicker } from "react-color";
import firebase from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { setColors } from "../../redux/actions/color";

export function ColorPanel() {
  const [modal, setModal] = useState(false);
  const [primary, setPrimary] = useState("");
  const [secondary, setSecondary] = useState("");
  const [userColors, setUserColors] = useState([]);
  const [usersRef, setUsersRef] = useState(firebase.database().ref("users"));

  const user = useSelector((state) => state.user.currentUser);
  const defaultColor = useSelector((state) => state.color.default);

  const dispatch = useDispatch();

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  const handleChangePrimary = (color) => setPrimary(color.hex);

  const handleChangeSecondary = (color) => setSecondary(color.hex);

  // Effect
  useEffect(() => {
    if (user) {
      addListener(user.uid);
    }
    return () => usersRef.child(`${user.uid}/colors`).off();
  }, []);

  const addListener = (userId) => {
    let userColors = [];
    usersRef.child(`${userId}/colors`).on("child_added", (snap) => {
      userColors.unshift(snap.val());
      setTimeout(() => {
        setUserColors(userColors);
      }, 300);
    });
  };

  const defaultColors = () => {
    dispatch(setColors(defaultColor.primary, defaultColor.secondary));
    closeModal();
  };

  const saveColors = () => {
    if (primary && secondary) {
      usersRef
        .child(`${user.uid}/colors`)
        .push()
        .update({
          primary,
          secondary,
        })
        .then(() => {
          console.log("color-added");
          closeModal();
        })
        .catch((err) => console.log(err));
    }
  };

  const displayColors = (colors) =>
    colors.length > 0 &&
    colors.map((color, i) => (
      <React.Fragment key={i}>
        <Divider />

        <div
          className="color__container"
          onClick={() => dispatch(setColors(color.primary, color.secondary))}
        >
          <div className="color__square" style={{ background: color.primary }}>
            <div
              className="color__overlay"
              style={{ background: color.secondary }}
            ></div>
          </div>
        </div>
      </React.Fragment>
    ));

  return (
    <Sidebar
      inverted
      visible
      vertical
      width="very thin"
      as={Menu}
      icon="labeled"
      className="color__bartop"
    >
      <Divider />
      <Button icon="add" size="small" color="grey" onClick={openModal} />

      {displayColors(userColors)}

      {/* Color Picker */}
      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header>Theme Preference</Modal.Header>
        <Modal.Content>
          <Segment inverted>
            {" "}
            <Label content="Primary color" />
            <SliderPicker color={primary} onChange={handleChangePrimary} />
          </Segment>
          <Segment inverted>
            {" "}
            <Label content="Secondary color" />
            <SliderPicker color={secondary} onChange={handleChangeSecondary} />
          </Segment>
        </Modal.Content>

        <Modal.Actions>
          <Button floated="left" color="black" onClick={defaultColors}>
            <Icon name="dashboard" />
            Use Default
          </Button>
          <Button inverted color="green" onClick={saveColors}>
            <Icon name="checkmark" />
            Save
          </Button>
          <Button inverted color="red" onClick={closeModal}>
            <Icon name="remove" />
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </Sidebar>
  );
}
