// import { ModalPortal } from "react-native-modals";
import { Provider } from "react-redux";
import StackNavigator from "./navigation/StackNavigator";
import store from "./store";
import { UserContext } from "./UserContext";
import React from "react";

export default function App() {
  return (
    <>
      <Provider store={store}>
        <UserContext>
          <StackNavigator />
          {/* <ModalPortal /> */}
        </UserContext>
      </Provider>
    </>
  );
}
