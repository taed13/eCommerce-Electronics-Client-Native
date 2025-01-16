import { ModalPortal } from "react-native-modals";
import { Provider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import store from "./store";
import { UserContext } from "./UserContext";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MenuProvider } from "react-native-popup-menu";
import Toast from "react-native-toast-message";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RootStackNavigator from "./navigation/RootStackNavigator";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation',
  'IMGElement: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.',
]);

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <MenuProvider>
              <Provider store={store}>
                <UserContext>
                  <RootStackNavigator />
                  <ModalPortal />
                  <Toast />
                </UserContext>
              </Provider>
            </MenuProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
