//import React from "react";
//import { createStackNavigator } from "@react-navigation/stack";

import Home from "./screens/home/main";
import Replies from "./screens/home/replies";
import CommentPage from "./screens/home/comments";

import Search from "./screens/search/main";

import { Create, VideoEditingPage } from "./screens/create/main";
import Upload from "./screens/create/upload";

import { Notification, LongMessage } from "./screens/notification/main";

import ProfileDrawer from "./screens/profile/main";
import ProfileScreen from "./screens/profile/ProfileScreen";
import EditProfileScreen from "./screens/profile/EditProfileScreen";

import ChatListScreen from "./screens/chats/ChatListScreen";
import ChatRoomScreen from "./screens/chats/ChatRoomScreen";

import Login from "./screens/login/main";
import SigninPage from "./screens/login/signinPage";
import SignupPage from "./screens/login/signupPage";

/*

const Stack = createStackNavigator();

// Home Screen
const HomeScreenStack = () => {
  return (
    <Stack.Navigator initialRouteName="Home" headerMode="none">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Comments" component={CommentPage} />
      <Stack.Screen name="Replies" component={Replies} />
    </Stack.Navigator>
  );
};

// Search Screen
const SearchScreenStack = Search;

// Create Screen
const CreateScreenStack = () => {
  return (
    <Stack.Navigator initialRouteName="Create" headerMode="none">
      <Stack.Screen name="Create" component={Create} />
      <Stack.Screen name="VideoEdit" component={VideoEditingPage} />
      <Stack.Screen name="Upload" component={Upload} />
    </Stack.Navigator>
  );
};

// Notification Screen
const NotificationScreenStack = () => {
  return (
    <Stack.Navigator initialRouteName="Notification" headerMode="none">
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="LongMessage" component={LongMessage} />
    </Stack.Navigator>
  );
};

// Profile Screen
const ProfileScreenStack = Profile;

// Login Screen
const LoginScreenStack = () => {
  return (
    <Stack.Navigator initialRouteName="DefaultLogin" headerMode="none">
      <Stack.Screen name="DefaultLogin" component={Login} />
      <Stack.Screen name="SignIn" component={SigninPage} />
      <Stack.Screen name="SignUp" component={SignupPage} />
    </Stack.Navigator>
  );
};

export default {
  HomeScreenStack,
  SearchScreenStack,
  CreateScreenStack,
  NotificationScreenStack,
  ProfileScreenStack,
  LoginScreenStack,
};

*/

export default {
  Home,
  Replies,
  CommentPage,
  Search,
  Create,
  VideoEditingPage,
  Upload,
  Notification,
  LongMessage,
  ProfileDrawer,
  ProfileScreen,
  EditProfileScreen,
  ChatListScreen,
  ChatRoomScreen,
  Login,
  SigninPage,
  SignupPage,
};
