// import { ModalPortal } from "react-native-modals";
import { Provider } from "react-redux";
import StackNavigator from "./navigation/StackNavigator";
import store from "./store";
import { UserContext } from "./UserContext";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <>
      <SafeAreaProvider>
        <Provider store={store}>
          <UserContext>
            <StackNavigator />
            {/* <ModalPortal /> */}
          </UserContext>
        </Provider>
      </SafeAreaProvider>
    </>
  );
}
