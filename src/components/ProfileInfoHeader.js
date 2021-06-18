import React, { useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import {
  Header,
  Icon,
  Avatar,
  Text,
  ButtonGroup,
  Button,
} from "react-native-elements";

import chatRoomData from "../data/chatRoomData.json";

const ProfileInfoHeader = (props) => {
  const [followButtonStatus, setFollowButtonStatus] = useState("Follow");

  const isMyProfile = props.isMyProfile;
  const buttonGroups = ["Challenges", "Replies"];

  const messageButtonPressed = () => {
    const chatRoomId = props.chatRoomId;
    const myUserInfo = chatRoomData[chatRoomId].users[0];
    const friendUserInfo = chatRoomData[chatRoomId].users[1];
    props.navigation.navigate("ChatRoomScreen", {
      chatRoomId: props.chatRoomId,
      myUserInfo: myUserInfo,
      friendUserInfo: friendUserInfo,
    });
  };

  const followButtonPressed = () => {
    //If following the user unfollow them, else follow them and save the information in server

    setFollowButtonStatus((prevstate) =>
      prevstate === "Follow" ? "Unfollow" : "Follow"
    );
  };

  return (
    <View style={styles.container}>
      <Header
        backgroundColor="#fff"
        leftComponent={
          isMyProfile ? (
            <Icon
              color="#000"
              name="menu"
              size={30}
              onPress={() => props.navigation.openDrawer()}
            />
          ) : (
            <Icon
              color="#000"
              name="arrow-back"
              size={30}
              onPress={() => props.navigation.goBack()}
            />
          )
        }
        centerComponent={{
          text: props.userInfo.username,
          style: { color: "#000", fontWeight: "bold", fontSize: 20 },
        }}
        rightComponent={
          isMyProfile ? (
            <Icon
              color="#000"
              name="chat"
              size={30}
              onPress={() => props.navigation.navigate("ChatListScreen")}
            />
          ) : null
        }
        // statusBarProps={{
        //   barStyle: "dark-content",
        // }}

        statusBarProps={{ translucent: true }}
        containerStyle={Platform.select({
          android: Platform.Version <= 20 ? { paddingTop: 0, height: 56 } : {},
        })}
      />

      <View style={styles.avatarAndEdit}>
        <Avatar
          rounded
          size={130}
          source={{
            uri: props.userInfo.avatar,
          }}
          overlayContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
          containerStyle={{
            alignSelf: "center",
          }}
        ></Avatar>

        {isMyProfile && (
          <Icon
            raised
            name="edit"
            size={23}
            color="#000"
            containerStyle={{
              position: "absolute",
              right: 0,
            }}
            onPress={() => props.navigation.navigate("EditProfileScreen")}
          />
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text h4 style={[styles.text, { color: "#000", fontWeight: "normal" }]}>
          {props.userInfo.name}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statsBox}>
          <Text h4 style={styles.text}>
            {props.userInfo.followers_count}
          </Text>
          <Text h6 style={styles.subText}>
            Followers
          </Text>
        </View>
        <View
          style={[
            styles.statsBox,
            { borderColor: "#DFD8C8", borderLeftWidth: 1, borderRightWidth: 1 },
          ]}
        >
          <Text h4 style={styles.text}>
            {props.userInfo.following_count}
          </Text>
          <Text h6 style={styles.subText}>
            Following
          </Text>
        </View>
        <View style={styles.statsBox}>
          <Text h4 style={styles.text}>
            {props.userInfo.videos_count}
          </Text>
          <Text h6 style={styles.subText}>
            Videos
          </Text>
        </View>
      </View>

      <View style={styles.description}>
        <Text h5 style={{ fontSize: 16, textAlign: "center" }}>
          {props.userInfo.description}
        </Text>
      </View>

      {/* Follow and Message Buttons */}

      {!isMyProfile && (
        <View style={styles.messageAndFollowOptions}>
          <Button
            title={followButtonStatus}
            type="outline"
            containerStyle={{
              borderRadius: 10,
              paddingHorizontal: 10,
              width: "45%",
            }}
            buttonStyle={{
              borderColor: "#000",
            }}
            titleStyle={{
              color: "#000",
            }}
            onPress={followButtonPressed}
          />

          <Button
            title="Message"
            type="outline"
            containerStyle={{
              borderRadius: 10,
              paddingHorizontal: 10,
              width: "45%",
            }}
            buttonStyle={{
              borderColor: "#000",
            }}
            titleStyle={{
              color: "#000",
            }}
            onPress={messageButtonPressed}
          />
        </View>
      )}

      <View>
        <ButtonGroup
          onPress={(index) => {
            props.selectedIndex == index ? null : props.setSelectedIndex(index);
          }}
          selectedIndex={props.selectedIndex}
          buttons={buttonGroups}
          containerStyle={{
            height: 40,
            borderWidth: 0,
            // borderTopColor : '#eae5e5',
            marginTop: 20,
          }}
          selectedButtonStyle={{
            backgroundColor: "#fff",
            borderBottomWidth: 1,
            borderBottomColor: "red",
            color: "#000",
          }}
          textStyle={{
            textTransform: "uppercase",
            color: "#000",
          }}
          selectedTextStyle={{
            color: "red",
          }}
        />
      </View>
    </View>
  );
};

export default ProfileInfoHeader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  avatarAndEdit: {
    marginTop: 5,
    marginHorizontal: 3,
  },
  text: {
    color: "#52575D",
  },
  subText: {
    color: "#AEB5BC",
    textTransform: "uppercase",
    fontWeight: "500",
  },
  infoContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 5,
    marginTop: 10,
  },
  statsBox: {
    alignItems: "center",
    flex: 1,
  },
  description: {
    flexDirection: "row",
    alignSelf: "center",
    paddingHorizontal: 10,
    marginTop: 20,
  },
  messageAndFollowOptions: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 20,
  },
});
