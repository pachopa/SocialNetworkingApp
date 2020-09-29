import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { FirebaseContext } from "./../../context/firebase";
import { SignUp } from "../../pages";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({}),
}));

const firebase = {
  auth: jest.fn(() => ({
    createUserWithEmailAndPassword: jest.fn(() =>
      Promise.resolve({
        user: {
          updateProfile: jest.fn(() => Promise.resolve("I am signed up!")),
        },
      })
    ),
  })),
};

describe("<SignUp />", () => {
  it("renders the sign up page with a form submission", async () => {
    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <SignUp />
        </FirebaseContext.Provider>
      </Router>
    );

    await act(async () => {
      await fireEvent.change(getByPlaceholderText("First name"), {
        target: { value: "Chris" },
      });
      await fireEvent.change(getByPlaceholderText("Email address"), {
        target: { value: "chrislee910320@gmail.com" },
      });
      await fireEvent.change(getByPlaceholderText("Password"), {
        target: { value: "Password" },
      });

      fireEvent.click(getByTestId("sign-up"));

      expect(getByPlaceholderText("First name").value).toBe("Chris");

      expect(getByPlaceholderText("Email address").value).toBe(
        "chrislee910320@gmail.com"
      );
      expect(getByPlaceholderText("Password").value).toBe("Password");
      expect(queryByTestId("error")).toBeFalsy();
    });
  });
});
