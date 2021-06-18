import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Header, Icon, Avatar, Input } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MyBottomSheet from "../../components/MyBottomSheet";

import testData from "../../data/testProfileInfo.json";
const myInfo = testData[testData.myUserId].userInfo;

const EditProfileScreen = (props) => {
  const [name, setName] = useState(myInfo.name);
  const [username, setUsername] = useState(myInfo.username);
  const [Password, setPassword] = useState("");
  const [bio, setBio] = useState(myInfo.description);

  const cancelUpdatesPressed = () => {
    props.navigation.goBack();
  };

  const saveUpdatesPressed = () => {
    //update the data to the server and
    props.navigation.goBack();
  };

  return (
    <KeyboardAwareScrollView style={styles.keyboardAwareScrollViewContainer}>
      <View style={styles.container}>
        <Header
          backgroundColor="#fff"
          leftComponent={
            <Icon
              color="#000"
              type="feather"
              name="x"
              size={40}
              onPress={cancelUpdatesPressed}
            />
          }
          centerComponent={{
            text: "Edit Profile",
            style: { color: "#000", fontWeight: "bold", fontSize: 20 },
          }}
          rightComponent={
            <Icon
              color="blue"
              type="feather"
              name="check"
              size={40}
              onPress={saveUpdatesPressed}
            />
          }
          // statusBarProps = {{
          //     barStyle : 'light-content'
          // }}
        />

        <View style={styles.avatarContainer}>
          <Avatar
            rounded
            size="xlarge"
            source={{
              uri: myInfo.avatar,
            }}
            overlayContainerStyle={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Avatar.Accessory size={45} />
          </Avatar>
        </View>

        <View style={styles.detailsContainer}>
          <Input
            label="Name"
            value={name}
            leftIcon={<Icon name="person" size={24} color="black" />}
            maxLength={20}
            underlineColorAndroid="transparent"
            onChangeText={(newName) => setName(newName)}
          />

          <Input
            label="Username"
            value={username}
            leftIcon={<Icon name="person" size={24} color="black" />}
            maxLength={20}
            underlineColorAndroid="transparent"
            onChangeText={(newUsername) => setUsername(newUsername)}
          />

          <Input
            placeholder="Password"
            label="Password"
            value={Password}
            leftIcon={
              <Icon name="lock" type="Entypo" size={24} color="black" />
            }
            maxLength={20}
            underlineColorAndroid="transparent"
            onChangeText={(newPassword) => setPassword(newPassword)}
          />

          <Input
            label="Bio"
            value={bio}
            leftIcon={
              <Icon
                name="short-text"
                type="MaterialIcons"
                size={24}
                color="black"
              />
            }
            maxLength={100}
            underlineColorAndroid="transparent"
            onChangeText={(newBio) => setBio(newBio)}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  avatarContainer: {
    alignItems: "center",
  },
  detailsContainer: {
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  keyboardAwareScrollViewContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
