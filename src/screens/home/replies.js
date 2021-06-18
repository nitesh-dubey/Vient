import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Icon, ListItem, Card } from "react-native-elements";
import PostList from "./postList";

export default function Replies(props) {
  return (
    <View>
      <PostList {...props} />

      <View style={styles.container}>
        <Icon
          name="arrowleft"
          type="antdesign"
          color="white"
          onPress={props.navigation.goBack}
          containerStyle={{ flex: 1 }}
        />
        <View
          style={{ flex: 9, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ color: "white", fontSize: 16 }}>Replies</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flexDirection: "row",
    width: "100%",
    position: "absolute",
  },
});
