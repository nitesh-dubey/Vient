import React from "react";
import { View, StyleSheet } from "react-native";
import PostList from "./postList";

export default function Feed(props) {
  return (
    <View style={styles.container}>
      <PostList {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
});
