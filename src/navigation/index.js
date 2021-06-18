//This contains root navigation which encapsulates whole application within it

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
// import {  } from '@react-navigation/stack'
// import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import Screens from '../screens.js'
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createStackNavigator()

const RootNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS
            }}>
                <Stack.Screen name = 'BottomTabNavigator' component={BottomTabNavigator} />

                <Stack.Screen name = 'Comments' component={Screens.CommentPage} />
                <Stack.Screen name = 'Replies' component={Screens.Replies} />

                <Stack.Screen name="VideoEdit" component={Screens.VideoEditingPage} />
                <Stack.Screen name="Upload" component={Screens.Upload} />

                <Stack.Screen name="Notification" component={Screens.Notification} />
                <Stack.Screen name="LongMessage" component={Screens.LongMessage} />

                <Stack.Screen name = 'UserProfileScreen' component={Screens.ProfileScreen} />
                <Stack.Screen name = 'EditProfileScreen' component={Screens.EditProfileScreen} />

                <Stack.Screen name = 'ChatListScreen' component={Screens.ChatListScreen} />
                <Stack.Screen name = 'ChatRoomScreen' component={Screens.ChatRoomScreen} />

                <Stack.Screen name="DefaultLogin" component={Screens.Login} />
                <Stack.Screen name="SignIn" component={Screens.SigninPage} />
                <Stack.Screen name="SignUp" component={Screens.SignupPage} />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RootNavigation

