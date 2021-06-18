import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { ButtonGroup } from "react-native-elements";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ScrollView from "react-native-gesture-handler";
import DefaultHashtagsPage from "./defaultHashtagsPage";
import DefaultUsersPage from "./defaultUsersPage";

const baseColor = "#D34646";

const ContentSplitter = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const buttons = ["Hashtags", "Users"];

  const displayedPage = () => {
    if (selectedIndex == 0) {
      return <DefaultHashtagsPage {...props} />;
    } else if (selectedIndex == 1) {
      return <DefaultUsersPage {...props} />;
    }
  };

  return (
    <View style={{ flex: 1, marginBottom: 50 }}>
      {/*height: "100%"*/}
      <ButtonGroup
        onPress={(index) => {
          selectedIndex == index ? null : setSelectedIndex(index);
        }}
        selectedIndex={selectedIndex}
        buttons={buttons}
        containerStyle={{
          height: 35,
          width: "60%",
          borderWidth: 1,
          borderColor: baseColor,
          alignSelf: "center",
        }}
        selectedButtonStyle={{ backgroundColor: baseColor }}
        textStyle={{ color: baseColor }}
      />

      {displayedPage()}
    </View>
  );
};

export default ContentSplitter;

const styles = StyleSheet.create({
  allTabBar: {
    borderColor: baseColor,
    borderWidth: 1,
    alignSelf: "center",
    width: "70%",
    height: 44,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 20, // margin between search section and top navigation bar
  },
  indicator: {
    backgroundColor: baseColor,
    height: "100%",
  },
  single: {
    // flexDirection: "row",
    // alignItems: "center",
  },
  tabLabel: {
    textTransform: "none",
    fontSize: 16,
    marginTop: 0,
    // alignSelf: "center",
    // backgroundColor: "yellow",
  },
});
