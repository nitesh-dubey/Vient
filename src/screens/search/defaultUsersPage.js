import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { ListItem, Avatar, Icon } from "react-native-elements";

const dummyData = require("../../data/users.test.json");
const baseColor = "#D34646";

const DefaultUsersPage = (props) => {
  const keyExtractor = (item, index) => index.toString();

  const renderUserCategory = ({ item }) => {
    const { category, users } = item;

    const onProfilePress = () => {
      props.navigation.navigate("UserProfileScreen", {
        userId: "user1",
      });
    };

    const renderEachUserCard = ({ item }) => (
      <ListItem containerStyle={styles.custom_ListItem}>
        <Avatar
          rounded
          size="medium"
          source={{ uri: item.profile_pic }}
          onPress={onProfilePress}
        />
        <ListItem.Content>
          <ListItem.Title>{item.fullname}</ListItem.Title>
          <ListItem.Subtitle>{item.username}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    );

    const CardTitle = () => {
      return (
        <ListItem containerStyle={styles.custom_ListItem}>
          <View style={styles.title}>
            <View style={styles.subtitle_left_box}>
              <Text style={styles.subtitle_left_text}>{category}</Text>
            </View>
            <View style={styles.subtitle_right_box}>
              <Text style={styles.subtitle_right_text}>See All</Text>
              {/* <Entypo name="chevron-right" size={22} color={baseColor} /> */}
              <Icon
                type="entypo"
                name="chevron-right"
                size={22}
                color={baseColor}
              />
            </View>
          </View>
        </ListItem>
      );
    };

    return (
      <View>
        <CardTitle />
        <FlatList
          data={users}
          keyExtractor={keyExtractor}
          renderItem={renderEachUserCard}
        />
      </View>
    );
  };

  return (
    <View name="Users" style={styles.container}>
      <FlatList
        data={dummyData["results"]}
        keyExtractor={keyExtractor}
        renderItem={renderUserCategory}
      />
    </View>
  );
};

export default DefaultUsersPage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white", // removed flex: 1
    width: "100%",
    paddingTop: 10,
    alignSelf: "center",
  },
  title: {
    flexDirection: "row",
    alignContent: "center",
  },
  subtitle_left_box: {
    alignItems: "center",
  },
  subtitle_left_text: {
    fontWeight: "bold",
    fontSize: 18,
  },
  subtitle_right_text: {
    fontSize: 14,
    fontWeight: "bold",
    color: baseColor,
  },
  subtitle_right_box: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  custom_ListItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
