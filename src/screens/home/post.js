import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  Dimensions,
  StyleSheet,
  Modal,
  Share,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Avatar, Icon, Card } from "react-native-elements";
import VideoPlayer from "expo-video-player";
import { Video } from "expo-av";
import Constants from "expo-constants";

const baseColor = "#D34646";
const comments = require("../../data/comment_small.test.json");

/**
 *
 * @param {post} : post data prop passed
 * @param {navigation} : navigation prop passed from parent (stack navigator)
 *
 * @summary This component makes the video buttons placed at right-hand side.
 * Buttons available - Profile_pic, Like, Comment, Reply.
 * "Comment" & "Reply" buttons opens a stack screen, and "Like" button
 * changes the color if clicked.
 *
 * @todo
 * 1) make "onCreatorAvatarPress" open up a stack screen for creator's profile
 * 2) "onReplyPress" doesn't take data from parent as props, but needs to
 * 3) In "onLikePress", setIsLiked doesn't update isLiked value
 *
 */

const VideoSideButtons = ({ post, navigation }) => {
  const [avatar_icon, like_icon, comment_icon, reply_icon] = [40, 40, 35, 40];
  const [isLiked, setIsLiked] = useState(false);

  const onCreatorAvatarPress = () => {
    console.log("Creator avatar pressed !");
    props.navigation.navigate("UserProfileScreen", {
      userId: "user1",
    });
  };

  const onLikePress = () => {
    setIsLiked(!isLiked);
    // send +1 like to backend here
  };

  const onCommentPress = () => {
    console.log("pressed comments !");
    navigation.navigate("Comments", { ...comments });
  };

  const onReplyPress = () => {
    console.log("pressed replies !");
    navigation.navigate("Replies");
  };

  return (
    <View style={styles.optionlist}>
      {/* Creator profile picture */}
      <View style={styles.eachOption}>
        <Avatar
          rounded
          size={avatar_icon}
          source={{
            uri: post.creator_profile_pic,
          }}
          containerStyle={{ borderWidth: 2, borderColor: "white" }}
          onPress={onCreatorAvatarPress}
        />
      </View>

      {/* Like */}
      <View style={styles.eachOption}>
        <Icon
          name="favorite"
          color={isLiked ? "#ed1556" : "white"}
          type="material"
          onPress={onLikePress}
          size={like_icon}
          containerStyle={{
            elevation: 0, // Remove shadow on Android
            shadowOpacity: 0, // Remove shadow on IOS
          }}
        />
        <Text style={styles.counterText}>{post.likes_count}</Text>
      </View>

      {/* Comments */}
      <View style={styles.eachOption}>
        <Icon
          name="commenting"
          color="white"
          type="font-awesome"
          onPress={onCommentPress}
          size={comment_icon}
        />
        <Text style={styles.counterText}>{post.comments_count}</Text>
      </View>

      {/* Replies */}
      {post.is_challenge && (
        <View style={styles.eachOption}>
          <Icon
            name="whatshot"
            color="white"
            type="material"
            onPress={onReplyPress}
            size={reply_icon}
          />
          <Text style={styles.counterText}>{post.video_reply_count}</Text>
        </View>
      )}
    </View>
  );
};

/**
 *
 * @param {onClose} : onClose handler to hide the Modal element, passed from parent
 *
 * @summary This component appears when "Show Challenge" is clicked at video's bottom
 *
 * @todo
 * 1) Time needs to be human readable not unix
 *
 */

const ChallengeDescription = ({ post, onClose }) => {
  const _openVideoPressed = () => console.log("open video pressed!");
  const hashtags = post.hashtags.map((hashtag, index) => {
    return <Text key={index}>#{hashtag} </Text>;
  });

  return (
    <Card containerStyle={styles.modal_container}>
      <View style={styles.modal_header}>
        <Text style={styles.modal_title}>Challenge</Text>
        <Icon
          name="ios-close"
          type="ionicon"
          size={44}
          style={styles.modal_closeButton}
          onPress={onClose}
        />
      </View>

      <Card.Divider />

      <Text style={styles.modal_content}>{post.description}</Text>
      <Text style={styles.modal_hashtags}>{hashtags}</Text>
      <View style={styles.modal_footerContainer}>
        <TouchableOpacity onPress={_openVideoPressed}>
          <Text styles={styles.modal_footerText}>Open video</Text>
        </TouchableOpacity>
        <Text styles={styles.modal_footerText}>{post.timestamp}</Text>
      </View>
    </Card>
  );
};

/**
 *
 * @param {*} post the post data to display
 * @param {*} navigation navigation prop to navigate to screens like replies
 *
 * @summary Displays a single video post
 *
 */
class Post extends React.PureComponent {
  state = {
    finished: false,
    modalVisible: false,
    loaded: true,
  };

  componentDidMount() {
    console.log(`${this.post.video_id} mounted`);
  }

  componentWillUnmount() {
    console.log(`${this.post.video_id} unmounted`);
    if (this.video) {
      this.video.unloadAsync();
    }
  }

  _onPlaybackStatusUpdate = (status) => {
    if (!this.state.loaded && status.isLoaded) {
      console.log(`video ${this.post.video_id} loaded`);
      this.setState({ loaded: true });
    }
    if (status.didJustFinish && !status.isLooping) {
      console.log("video finished");
    }
  };

  play = async () => {
    const status = await this.video.getStatusAsync();
    if (!status.isPlaying) {
      return this.video.playAsync();
    } else return;
  };

  stop = () => {
    if (this.video) {
      this.video.stopAsync();
    }
  };

  _onSharePress = async () => {
    console.log("share pressed !");

    try {
      const result = await Share.share({
        message: this.shareMessage,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // In Android, this means that user has shared it
          console.log("shared with activity type of result.activityType");
        } else {
          // In Android, this means that user hasn't shared it
          console.log("shared else statement");
          console.log(this.shareMessage);
        }
      } else if (result.action === Share.dismissedAction) {
        // Only for IOS, not in Android
        console.log("dismissed");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  render() {
    const { post, navigation } = this.props;

    this.post = post;

    this.shareMessage =
      "Hey! I found an amazing video by @" +
      post.creator_username +
      ". Click to watch it now!\n" +
      post.video_url +
      "\n\nDownload Vient App to see more : https://vientapp.com";

    return (
      <View style={styles.container}>
        {/* <VideoPlayer
          videoProps={{
            videoRef: (videoRef) => {
              this.video = videoRef;
            },
            shouldPlay: false,
            isLooping: true,
            resizeMode: "cover",
            source: {
              uri:
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
            },
          }}
          height={Dimensions.get("window").height - 48}
          inFullscreen={false}
          showFullscreenButton={false}
          playbackCallback={this._onPlaybackStatusUpdate}
          videoBackground="transparent"
          // hack to now display bottom video controller
          disableSlider={true}
          textStyle={null}
        /> */}

        <Video
          ref={(ref) => {
            this.video = ref;
          }}
          shouldPlay={false}
          isLooping
          resizeMode="cover"
          source={{
            uri:
              "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
          }}
          style={styles.video}
        />

        {/* <Video
          ref={(ref) => {
            this.video = ref;
          }}
          shouldPlay={false}
          isLooping
          resizeMode="cover"
          source={require("./video.mp4")}
          style={styles.video}
        /> */}

        {/* 
          Below contains the video description including all buttons on the post
       */}
        <View style={styles.videoInfo}>
          {/* 
            The right-hand button section 
        */}
          <View style={styles.rightContainer}>
            <VideoSideButtons post={post} navigation={navigation} />
          </View>

          {/* 
            The bottom video description 
        */}
          <View style={styles.bottomContainer}>
            <View>
              <Text
                style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
              >
                @{post.creator_username}
                {post.is_challenge ? " challenged" : " replied"}
              </Text>

              <Text style={{ color: "white", fontSize: 14 }}>
                #{post.hashtags[0]}
              </Text>
              {/* make it row-wise */}

              {/* 
                Show challenge button open up a pop up with 'slide'
                animation from bottom and makes the background dim
            */}
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
              >
                <ChallengeDescription
                  post={post}
                  onClose={() => {
                    this.setState({ modalVisible: false });
                  }}
                />
              </Modal>

              <TouchableOpacity
                onPress={() => {
                  this.setState({ modalVisible: true });
                  console.log("pressed show challenge!");
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                >
                  Show challenge
                </Text>
              </TouchableOpacity>
            </View>

            {/* Share button */}
            <View style={styles.shareButton}>
              <Icon
                name="share"
                color="white"
                type="entypo"
                onPress={this._onSharePress}
                size={40}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default Post;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: Dimensions.get("window").height - (48 + Constants.statusBarHeight), // temporary setting, remove "-40" later
  },
  video: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "black",
  },
  videoInfo: {
    height: "100%",
    justifyContent: "flex-end",
  },
  bottomContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  shareButton: {
    // makes the share button's height same as the video description
    height: "100%",
  },
  rightContainer: {
    alignSelf: "flex-end",
  },
  optionlist: {
    padding: 10,
    justifyContent: "space-between",
  },
  eachOption: {
    alignItems: "center",
    marginTop: 10,
  },
  counterText: {
    color: "rgba(255,255,255,0.5)",
    fontWeight: "bold",
    fontSize: 12,
  },
  playBtn: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignContent: "center",
  },

  modal_container: {
    width: "100%",
    position: "absolute",
    bottom: 50, // due to 40 (height of toolbar) + 10 (padding of post in 'optionlist')
    elevation: 0,
    marginLeft: 0,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    borderWidth: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  modal_header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modal_title: {
    fontSize: 22,
  },
  modal_content: {
    fontSize: 18,
    paddingBottom: 10,
  },
  modal_hashtags: {
    fontSize: 16,
    color: "rgba(0,0,0,0.5)",
    paddingBottom: 10,
  },
  modal_footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modal_footerText: {
    // Not sure why it's not working !!!
    color: "rgba(0,0,0,0.5)",
    fontSize: 18,
  },
});
