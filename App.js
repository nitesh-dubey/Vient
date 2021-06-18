import "react-native-gesture-handler";
import React from "react";
import { enableScreens } from "react-native-screens";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import RootNavigation from "./src/navigation";

enableScreens();
export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeAreaStyle}>
        <RootNavigation />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
  },
});
