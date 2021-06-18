import React from "react";
import { StyleSheet } from "react-native";
import { MaterialIcons, Feather, Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as size from "./dimension";
import Screens from "../screens";

/*
  Returns the bottom navigation bar/toolbar. Icons 
  can auto-change according to current screen width.
*/
function Toolbar() {
  /*
    Default size : All icons except "create" set to 10% of screen width
    Larger size : "create" icon's size set to 15% of screen width
  */
  let defaultSize = size.getWidth(0.08);
  let largerSize = size.getWidth(0.1);
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: "rgba(0,0,0,1)",
        inactiveTintColor: "rgba(0,0,0,0.5)",
        showLabel: false,
        style: styles.container,
      }}
    >
      {/* Home screen tab */}
      <Tab.Screen
        name="Home"
        component={Screens.HomeScreenStack}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={defaultSize} color={color} />
          ),
        }}
      />

      {/* Search tab */}
      <Tab.Screen
        name="Search"
        component={Screens.SearchScreenStack}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="search" size={defaultSize} color={color} />
          ),
        }}
      />

      {/* Video creation tab */}
      <Tab.Screen
        name="Create"
        component={Screens.CreateScreenStack}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-add-circle" size={largerSize} color={color} />
          ),
        }}
      />

      {/* Notification tab */}
      <Tab.Screen
        name="Notification"
        component={Screens.NotificationScreenStack}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="ios-notifications-outline"
              size={defaultSize}
              color={color}
            />
          ),
        }}
      />

      {/* User profile tab */}
      <Tab.Screen
        name="Profile"
        component={Screens.ProfileScreenStack}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={defaultSize} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    borderTopWidth: 0,
    backgroundColor: "white", // "transparent"
  },
});

export default Toolbar;
