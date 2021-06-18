import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Screens from "../screens";
import { Image } from "react-native";
import { Icon } from "react-native-elements";

import * as IconDimensions from "./iconDimensions";
const smallerSize = IconDimensions.getWidth(0.07);
const largerSize = IconDimensions.getWidth(0.16);

//Icons
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  //const [isTabHome, setIsTabHome] = useState(true);

  // const changeTabBarColor = ({ route }) => {
  //   if (route.name == "Home") setIsTabHome(true);
  //   else setIsTabHome(false);
  // };

  return (
    <Tab.Navigator
      // screenOptions={changeTabBarColor}
      tabBarOptions={{
        style: {
          backgroundColor: "#fff",
        },
        activeTintColor: "#000",
        showLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Screens.Home}
        options={{
          tabBarIcon: ({ color }) => (
            <Entypo name={"home"} size={smallerSize} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Search"
        component={Screens.Search}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name={"search1"} size={smallerSize} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Create"
        component={Screens.Create}
        options={{
          tabBarIcon: () => (
            // <Image
            //   source={createIcon}
            //   style={{ height: largerSize, resizeMode: "contain" }}
            // />
            <Entypo
              name={"circle-with-plus"}
              size={largerSize}
              color={"red"}
              resizeMode={"contain"}
            />
          ),
          tabBarLabel: () => null,
          tabBarVisible: false,
        }}
      />

      <Tab.Screen
        name="Notifications"
        component={Screens.Notification}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name={"bells"} size={smallerSize} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Screens.ProfileDrawer}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name={"person-outline"}
              size={smallerSize}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
