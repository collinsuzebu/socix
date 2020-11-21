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
import { validatePassword, validateEmail } from "../../helpers/validators";
import firebase from "../../firebase";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [isEmptyField, setIsEmptyField] = useState(false);
  const [firebaseError, setFirebaseError] = useState("");
  const [usersRef, setUsersRef] = useState(firebase.database().ref("users"));

  useEffect(() => {
    register({ name: "email" }, { required: true, validate: validateEmail });
    register(
      { name: "password" },
      { required: true, minLength: 6, validate: validatePassword }
    );
  }, []);

  const { register, errors, handleSubmit, setValue, trigger } = useForm();

  const onSubmit = (data) => {
    const { email, password } = data;
    setLoading(true);

    if (!email || !password) {
      setIsEmptyField(true);
      setLoading(false);
    } else {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((signedInUser) => {
          setLoading(false);
        })
        .catch((err) => {
          setFirebaseError(err.message);
          setLoading(false);
        });
    }
  };

  const handleChange = async (e, { name, value }) => {
    setValue(name, value);
    await trigger({ name });
  };

  return (
    <Grid textAlign="center" verticalAlign="middle" className="auth__page">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" icon color="teal" textAlign="center">
          <Icon name="ravelry" color="teal" />
          Login to your Socix Account
        </Header>

        {errors.email && errors.email.type === "validate" && (
          <Message color="red">A valid email is required!</Message>
        )}

        {isEmptyField && <Message color="red">Fields cannot be empty!</Message>}

        {firebaseError && <Message color="red">{firebaseError}</Message>}

        <Form size="large" onSubmit={handleSubmit(onSubmit)}>
          <Segment>
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

            <Button
              disabled={loading}
              className={loading ? "loading" : ""}
              color="teal"
              fluid
              size="large"
            >
              Login
            </Button>
          </Segment>
        </Form>
        <Message>
          New to Socix? <Link to="/register">Register</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
}
