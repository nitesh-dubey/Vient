import React from "react";
import { View, Text } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";

import ProfileScreen from "./ProfileScreen.js";

import chatRoomData from "../../data/chatRoomData.json";
const feedbackRoomData = chatRoomData["feedbackRoom"];

const Drawer = createDrawerNavigator();
const ProfileDrawer = () => {
  const getDrawerContent = (props) => {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Feedback"
          onPress={() =>
            props.navigation.navigate("ChatRoomScreen", {
              chatRoomId: "feedbackRoom",
              myUserInfo: feedbackRoomData.users[0],
              friendUserInfo: feedbackRoomData.users[1],
            })
          }
        />

        <DrawerItem
          label="Logout"
          onPress={() => props.navigation.navigate("DefaultLogin")}
        />
      </DrawerContentScrollView>
    );
  };

  return (
    <Drawer.Navigator
      initialRouteName="Profile"
      drawerContent={getDrawerContent}
    >
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
};

export default ProfileDrawer;
