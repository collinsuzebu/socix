import React from "react";
import { render, screen, fireEvent, waitFor } from "../testUtils";
import Register from "./Register";

// const mockLogin = jest.fn((username, email, password, password2) => {
//   return Promise.resolve({ username, email, password, password2 });
// });

const mockLogin = jest.fn(() => {
  return Promise.resolve();
});

describe("Register", () => {
  beforeEach(() => {
    render(<Register />);
  });

  it("should display required error when value is invalid", async () => {
    fireEvent.submit(screen.getByRole("button"));

    // expect(await screen.getByRole("form")).toHaveClass("error field");
    expect(mockLogin).not.toBeCalled();
  });

  it("should display matching error when email is invalid", async () => {
    fireEvent.input(screen.getByPlaceholderText("Username"), {
      target: {
        value: "testuser",
      },
    });

    fireEvent.input(screen.getByPlaceholderText("Email Address"), {
      target: {
        value: "test@invalid_email",
      },
    });

    fireEvent.input(screen.getByPlaceholderText("Password"), {
      target: {
        value: "123Password$",
      },
    });

    fireEvent.input(screen.getByPlaceholderText("Password Confirmation"), {
      target: {
        value: "123Password$",
      },
    });

    fireEvent.submit(screen.getByRole("button"));

    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(mockLogin).not.toBeCalled();
    expect(screen.getByPlaceholderText("Email Address").value).toBe(
      "test@invalid_email"
    );
    expect(screen.getByPlaceholderText("Password").value).toBe("123Password$");
  });

  it("should display strong password is required error when password is invalid", async () => {
    fireEvent.input(screen.getByPlaceholderText("Username"), {
      target: {
        value: "testuser",
      },
    });

    fireEvent.input(screen.getByPlaceholderText("Email Address"), {
      target: {
        value: "test@email.com",
      },
    });

    fireEvent.input(screen.getByPlaceholderText("Password"), {
      target: {
        value: "invalidpassword",
      },
    });

    fireEvent.input(screen.getByPlaceholderText("Password Confirmation"), {
      target: {
        value: "invalidpassword",
      },
    });

    fireEvent.submit(screen.getByRole("button"));

    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(mockLogin).not.toBeCalled();
    expect(screen.getByPlaceholderText("Email Address").value).toBe(
      "test@email.com"
    );
    expect(screen.getByPlaceholderText("Password").value).toBe(
      "invalidpassword"
    );
  });

  //   it("should not display error when value is valid", async () => {
  //     fireEvent.input(screen.getByPlaceholderText("Username"), {
  //       target: {
  //         value: "testuser",
  //       },
  //     });

  //     fireEvent.input(screen.getByPlaceholderText("Email Address"), {
  //       target: {
  //         value: "test@email.com",
  //       },
  //     });

  //     fireEvent.input(screen.getByPlaceholderText("Password"), {
  //       target: {
  //         value: "123Password$",
  //       },
  //     });

  //     fireEvent.input(screen.getByPlaceholderText("Password Confirmation"), {
  //       target: {
  //         value: "123Password$",
  //       },
  //     });

  // const form = await waitFor(() => screen.getByRole("button"));
  // fireEvent.submit(form);

  // fireEvent.submit(screen.getByRole("button"));

  // await waitFor(() => expect(screen.queryAllByRole("alert")).toHaveLength(0));
  // expect(mockLogin).toHaveBeenCalled();
  // expect(mockLogin).toBeCalledWith(
  //   "testuser",
  //   "test@email.com",
  //   "123Password$",
  //   "123Password$"
  // );
  // expect(screen.getByPlaceholderText("Email Address").value).toBe("");
  // expect(screen.getByPlaceholderText("Password").value).toBe("");
  //   });
});
