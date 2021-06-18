import React, { useState, useCallback } from "react";
import { View, FlatList, Dimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Post from "./post";
import Constants from "expo-constants";

const posts = require("../../data/post.big.test.json")["result"];

const PostList = ({ navigation, styles }) => {
  // const [postRefs, setPostRefs] = useState({});
  let postRefs = {};
  let currentlyPlaying = null;
  let replayLastVideo = false;

  useFocusEffect(
    useCallback(() => {
      console.log("Home screen focused");
      if (currentlyPlaying && replayLastVideo) {
        currentlyPlaying.play();
      }
      replayLastVideo = false;

      return () => {
        console.log("Home screen unfocussed");
        if (currentlyPlaying) {
          currentlyPlaying.stop();
          replayLastVideo = true;
        }
      };
    }, [])
  );

  const _renderItem = ({ item }) => {
    return (
      <Post
        ref={(ref) => {
          postRefs[item.video_id] = ref;
        }}
        post={item}
        navigation={navigation}
      />
    );
  };

  const _onViewableItemsChanged = (props) => {
    const changed = props.changed;
    changed.forEach((item) => {
      const cell = postRefs[item.key];
      if (cell) {
        if (item.isViewable) {
          cell.play();
          currentlyPlaying = cell;
        } else {
          cell.stop();
        }
      }
    });
  };

  const itemHeight =
    Dimensions.get("window").height - (48 + Constants.statusBarHeight);

  return (
    <View style={styles}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.video_id}
        renderItem={_renderItem}
        onViewableItemsChanged={_onViewableItemsChanged}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={7}
        getItemLayout={(_data, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 80,
        }}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        snapToAlignment="start"
        decelerationRate="fast"
      />
    </View>
  );
};

export default PostList;
