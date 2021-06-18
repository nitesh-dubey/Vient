import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { Icon, ListItem } from "react-native-elements";
import Moment from "react-moment";

const data = require("../../data/notif.test.json");

const typeIconMap = {
  cloud: { name: "cloud-off", type: "material", color: "red" },
  trending: { name: "like1", type: "antdesign", color: "green" },
  rating: { name: "whatshot", type: "material", color: "orange" },
  user: { name: "group", type: "material", color: "rgba(100,50,200,0.5)" },
};

const TimestampElement = ({ timestamp, style }) => {
  let diff = Date.now() / 1000 - timestamp;
  let secInHour = 3600;
  let format = null;

  if (Math.floor(diff / secInHour) >= 24) {
    format = "MMM D";
  } else {
    format = "h:ss A";
  }

  return (
    <Moment unix format={format} element={Text} style={style}>
      {timestamp}
    </Moment>
  );
};

const ShortMessage = ({ item, navigation, onSeen }) => {
  const icon = typeIconMap[item.type];

  const _onMessageClick = () => {
    if (item.unread) {
      onSeen(item);
    }
    navigation.push("LongMessage", { ...item });
  };

  return (
    <TouchableOpacity
      onPress={item.body ? _onMessageClick : null}
      style={{ borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.1)" }}
    >
      <ListItem>
        <Icon
          name={icon.name}
          type={icon.type}
          color={icon.color}
          size={12}
          reverse
          containerStyle={styles.shortMsgIcon}
        />

        <ListItem.Content>
          <ListItem.Title style={item.unread ? styles.unreadMessage : null}>
            {item.title}
          </ListItem.Title>
        </ListItem.Content>

        <TimestampElement
          timestamp={item.timestamp}
          style={[styles.timestamp, item.unread ? styles.unreadMessage : null]}
        />
      </ListItem>
    </TouchableOpacity>
  );
};

const LongMessage = ({ route, navigation }) => {
  const message = route.params;

  return (
    <View>
      {/* Back button */}
      <ListItem>
        <Icon
          name="arrowleft"
          type="antdesign"
          color="grey"
          onPress={navigation.goBack}
        />
      </ListItem>

      {/* Full message display */}
      <ListItem containerStyle={styles.longMsgContainer}>
        <ListItem.Content>
          <Text style={styles.longMsgTitle}>{message.title}</Text>
          {message.body.top_image_url && (
            <Image
              style={styles.longMsgTopImg}
              source={{ uri: message.body.top_image_url }}
            />
          )}
          <Text style={styles.longMsgBody}>{message.body.content}</Text>
        </ListItem.Content>
      </ListItem>
    </View>
  );
};

const Notification = (props) => {
  const [messages, setSeen] = useState(data["notifications"]);

  const onSeen = (item) => {
    let newMessageList = messages.slice();
    newMessageList[parseInt(item.id)].unread = false;
    setSeen(newMessageList);
  };

  const renderItem = ({ item }) => {
    return (
      <ShortMessage item={item} navigation={props.navigation} onSeen={onSeen} />
    );
  };

  return (
    <View style={styles.container}>
      {/* Notification bar visible */}
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
      </View>
      <FlatList data={messages} renderItem={renderItem} />
    </View>
  );
};

export { Notification, LongMessage };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginVertical: 0,
  },
  timestamp: {
    alignSelf: "center",
    fontSize: 12,
  },
  unreadMessage: {
    fontWeight: "bold",
  },
  shortMsgIcon: {
    margin: 0,
    alignSelf: "center",
  },
  longMsgContainer: {
    height: "100%",
    alignItems: "flex-start",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    paddingHorizontal: 0, // To make the top image's width 100%
  },
  longMsgTitle: {
    fontSize: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  longMsgTopImg: {
    width: "100%",
    height: "25%",
    marginVertical: 10,
    resizeMode: "cover",
    overflow: "hidden",
  },
  longMsgBody: {
    paddingHorizontal: 20,
    marginTop: 10,
    fontSize: 16,
  },
});
