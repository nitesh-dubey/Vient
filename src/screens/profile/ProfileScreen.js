import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
//import { OptimizedFlatList } from 'react-native-optimized-flatlist';

import ProfileInfoHeader from "../../components/ProfileInfoHeader.js";

import testData from "../../data/testProfileInfo.json";
import myChatRooms from "../../data/myChatRooms.json";

// const userInfo = testData['user1'].userInfo;
// const videoDataList = testData['user1'].videoDataList;
const width = Dimensions.get("window").width;

const ProfileScreen = (props) => {
  //Getting user Details and their data
  const params = props.route.params;
  let userId =
    params === undefined || params.userId === undefined
      ? testData.myUserId
      : params.userId;
  let userInfo = testData[userId].userInfo;
  let videoDataList = testData[userId].videoDataList;

  //The active Index shows which tab among Challenge/Reply is selected to render video in that category
  //const buttons = ['Challenges', 'Replies']; //Categories of Videos
  const [selectedIndex, setSelectedIndex] = useState(0);

  //Returns The View Containing Thumbnails of the videos containing 3 thumbnails on one line
  //(onPress attribute maybe added to open that video on click)
  const renderVideoThumbnails = (videoData) => {
    return (
      <View
        key={videoData.videoId}
        style={[
          { width: width / 3 },
          { height: width / 3 },
          { marginBottom: 2 },
          videoData.index % 3 !== 0 ? { paddingLeft: 2 } : { paddingLeft: 0 },
        ]}
      >
        <Image
          style={{ flex: 1, width: undefined, height: undefined }}
          source={{ uri: videoData.item.thumbnailURL }}
        />
      </View>
    );
  };

  //The Flatlist shows the thumbnails of the videos and ListHeaderComponent shows the user information and Screen header

  return (
    <View style={styles.flatListContainer}>
      <FlatList
        data={
          selectedIndex == 0 ? videoDataList.challenges : videoDataList.replies
        }
        numColumns={3}
        keyExtractor={(videoData) => videoData.videoId}
        renderItem={renderVideoThumbnails}
        removeClippedSubviews={true}
        initialNumToRender={6}
        windowSize={10}
        ListHeaderComponent={
          <ProfileInfoHeader
            userInfo={userInfo}
            isMyProfile={userId === testData.myUserId}
            chatRoomId={
              myChatRooms.hasOwnProperty(userId) ? myChatRooms[userId] : null
            }
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            navigation={props.navigation}
          />
        }
      />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  flatListContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
