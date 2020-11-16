import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
} from "semantic-ui-react";
import md5 from "md5";
import { validatePassword, validateEmail } from "../../helpers/validators";
import firebase from "../../firebase";

export default function Register() {
  const [passwordMisMatch, setpasswordMisMatch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firebaseError, setFirebaseError] = useState("");
  const [usersRef, setUsersRef] = useState(firebase.database().ref("users"));

  useEffect(() => {
    register({ name: "username" }, { required: true });
    register({ name: "email" }, { required: true, validate: validateEmail });
    register(
      { name: "password" },
      { required: true, minLength: 6, validate: validatePassword }
    );
    register(
      { name: "password2" },
      { required: true, minLength: 6, validate: validatePassword }
    );
  }, []);

  const {
    register,
    errors,
    handleSubmit,
    setValue,
    trigger,
    reset,
  } = useForm();

  const onSubmit = (data) => {
    const { username, email, password, password2 } = data;
    setLoading(true);

    if (password !== password2) {
      setpasswordMisMatch(true);
      setLoading(false);
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((createdUser) => {
          createdUser.user
            .updateProfile({
              displayName: username,
              photoURL: `http://www.gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`,
            })
            .then(() => {
              saveUser(createdUser).then(() => {
                console.log("User saved to database successfully");
              });
            })
            .catch((err) => {
              setFirebaseError(err.message);
            });
          setFirebaseError("");
          setLoading(false);
          // reset();

          console.log(createdUser);
        })
        .catch((err) => {
          setLoading(false);

          setFirebaseError(err.message);
        });
    }
    // alert(JSON.stringify(data));
  };

  const handleChange = async (e, { name, value }) => {
    setValue(name, value);
    await trigger({ name });
  };

  const saveUser = (createdUser) => {
    return usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
    });
  };

  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" icon color="teal" textAlign="center">
          <Icon name="triangle up" color="teal" />
          Register for Socix
        </Header>

        {errors.email && errors.email.type === "validate" && (
          <Message role="alert" color="red">
            A valid email is required!
          </Message>
        )}
        {errors.password && errors.password.type === "validate" && (
          <Message role="alert" color="red">
            A strong password is required!
          </Message>
        )}

        {passwordMisMatch && (
          <Message role="alert" color="red">
            Password does not match!
          </Message>
        )}

        {firebaseError && (
          <Message role="alert" color="red">
            {firebaseError}
          </Message>
        )}

        <Form size="large" aria-label="form" onSubmit={handleSubmit(onSubmit)}>
          <Segment>
            <Form.Input
              fluid
              name="username"
              icon="user"
              iconPosition="left"
              placeholder="Username"
              type="text"
              onChange={handleChange}
              error={errors.username ? true : false}
            />

            <Form.Input
              fluid
              name="email"
              icon="mail"
              iconPosition="left"
              placeholder="Email Address"
              type="email"
              onChange={handleChange}
              error={errors.email ? true : false}
            />

            <Form.Input
              fluid
              name="password"
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              onChange={handleChange}
              error={errors.password ? true : false}
            />

            <Form.Input
              fluid
              name="password2"
              icon="repeat"
              iconPosition="left"
              placeholder="Password Confirmation"
              type="password"
              onChange={handleChange}
              error={errors.password2 ? true : false}
            />

            <Button
              disabled={loading}
              className={loading ? "loading" : ""}
              color="teal"
              fluid
              size="large"
            >
              Submit
            </Button>
          </Segment>
        </Form>
        <Message>
          Already a user? <Link to="/login">Login</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
}
