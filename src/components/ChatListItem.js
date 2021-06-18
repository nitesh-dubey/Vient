import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Avatar, Text } from "react-native-elements";
import moment from "moment";

const ChatListItem = (props) => {
  const chatListItemData = props.chatListItemData;

  //My userID
  const myUserId = chatListItemData.users[0]._id;

  //userInfo, UserId and FirstName of person I'm chatting with
  const friendInfo = chatListItemData.users[1];
  const friendFirstName = chatListItemData.users[1].name.split(" ")[0];

  //the "X" in moment(createdAt, "x").fromNow(true) denotes unix timestamp in milli secs
  //Removing true adds suffix "ago" => "a few seconds ago"

  //Function to navigate to the chatRoomScreen Page when a chatListItem is pressed
  const chatListItemPressed = () => {
    props.navigation.navigate("ChatRoomScreen", {
      chatRoomId: chatListItemData.chatRoomId,
      myUserInfo: chatListItemData.users[0],
      friendUserInfo: chatListItemData.users[1],
    });
  };

  return (
    <TouchableWithoutFeedback onPress={chatListItemPressed}>
      <View style={styles.container}>
        <Avatar
          rounded
          size="medium"
          source={{ uri: friendInfo.avatar }}
          containerStyle={{ marginRight: 5 }}
          overlayContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
        />

        <View style={styles.rightContainer}>
          <View style={styles.rightTopContainer}>
            <Text numberOfLines={1} style={styles.username}>
              {friendInfo.name}
            </Text>
            <Text numberOfLines={1} style={styles.timestamp}>
              {moment(
                chatListItemData.lastMessage.createdAt || moment.now(),
                "x"
              ).fromNow(true)}
            </Text>
          </View>

          <View>
            <Text numberOfLines={1} style={styles.lastMessage}>
              {chatListItemData.lastMessage.createdBy === myUserId
                ? "You"
                : friendFirstName}
              : {chatListItemData.lastMessage.text}
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ChatListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    width: "100%",
  },
  rightContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    // borderBottomWidth : StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e5e5",
  },
  rightTopContainer: {
    // flex : 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  username: {
    flex: 2,
    fontWeight: "bold",
    fontSize: 16,
  },
  timestamp: {
    flex: 1,
    fontSize: 14,
    color: "grey",
    textAlign: "right",
  },
  lastMessage: {
    fontSize: 15,
    color: "grey",
  },
});
