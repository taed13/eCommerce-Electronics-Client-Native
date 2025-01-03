// import { ModalPortal } from "react-native-modals";
import { Provider } from "react-redux";
import StackNavigator from "./navigation/StackNavigator";
import store from "./store";
import { UserContext } from "./UserContext";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MenuProvider } from "react-native-popup-menu";
import Toast from "react-native-toast-message";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <MenuProvider>
            <Provider store={store}>
              <UserContext>
                <StackNavigator />
                {/* <ModalPortal /> */}
                <Toast />
              </UserContext>
            </Provider>
          </MenuProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </>
  );
}
