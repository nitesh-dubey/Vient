import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { ListItem, Avatar, Icon, Divider } from "react-native-elements";
import Moment from "react-moment";
import ContentLoader from "react-native-easy-content-loader";
import axios from "axios";

const baseColor = "#D34646";

const RetryMsg = (props) => {
  const {
    iconSize,
    iconColor,
    textMsg,
    textStyle,
    onReloadPress,
    containerStyle,
  } = props;

  const defaultTextStyle = {
    fontSize: 16,
    color: "black",
    fontFamily: "sans-serif-light",
    textAlign: "center",
  };

  const defaultContainerStyle = {
    alignItems: "center",
  };

  if (onReloadPress === undefined || onReloadPress === null) {
    console.warn("Please specify onReloadPress handler.");
  }

  return (
    <View style={containerStyle ? containerStyle : defaultContainerStyle}>
      <Icon
        round
        type="ionicon"
        name="refresh-circle-outline"
        size={iconSize ? iconSize : 52}
        color={iconColor ? iconColor : "rgba(0,0,0,0.4)"}
        onPress={onReloadPress}
      />
      <Text style={[defaultTextStyle, { ...textStyle }]}>
        {textMsg ? textMsg : "An error has occured. Please reload."}
      </Text>
    </View>
  );
};

// const fetchWithTimeout = async (url, options, timeout = 5000) => {
//   return Promise.race([
//     fetch(url, options).catch((error) => {
//       console.error(error);
//     }),
//     new Promise((_, reject) =>
//       setTimeout(() => reject(new Error("timeout")), timeout)
//     ),
//   ]);
// };

// const fetchComments = async (callback) => {
//   await fetchWithTimeout("http://192.168.1.4:18000/comment", {
//     method: "GET",
//   })
//     .then((response) => response.json())
//     .then((jsonData) => callback(jsonData))
//     .catch((error) => {
//       callback(null, error);
//     });
// };

const fetchComments = async (request, callback) => {
  const URL = "http://192.168.1.4:19000/comment";
  //const URL = "exp://uu-8zt.anonymous.app-code.exp.direct:80";
  let error = null;

  // cancel previous request if exists
  if (request) {
    request.cancel();
  }

  // make a new cancellable request
  request = axios.CancelToken.source();

  // retrive jsonData
  let jsonData = await axios
    .get(URL, { cancelToken: request.token })
    .then((response) => response.data)
    .catch((e) => {
      // if (axios.isCancel(error)) {
      //   console.log("Previous request cancel, new request sent");
      // } else {
      //   console.error(error);
      // }
      error = e;
    });

  // call the callback function
  callback(jsonData, error, request);
};

// This is the previous axios request made to the server
let previousRequest = null;

const CommentPage = (props) => {
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [initialLoadError, setInitialLoadError] = useState(false);

  useEffect(() => {
    fetchComments(previousRequest, (jsonData, error, request) => {
      if (!error) {
        setComments(jsonData.comments);
        setVideoId(jsonData.video_id);
        if (Array.isArray(comments) && comments.length == 0) {
          setReachedEnd(true);
        }
        setLoading(false);
        previousRequest = request;
      } else {
        // setError(true);
        setLoading(false);
        setInitialLoadError(true);
        console.error(error);
      }
    });

    return () => {
      if (previousRequest) {
        previousRequest.cancel();
      }
    };
  }, [initialLoadError]);

  const fetchMoreComments = async () => {
    if (!reachedEnd) {
      await fetchComments(previousRequest, (jsonData, err, request) => {
        if (!err) {
          // setPage((prev) => prev + 1);
          setComments((prevList) => prevList.concat(jsonData.comments));
          if (Array.isArray(comments) && comments.length == 0) {
            setReachedEnd(true);
          }
          if (initialLoadError) {
            setInitialLoadError(false);
          } else if (error) {
            setError(false);
          }
          previousRequest = request;
          console.log(comments.length);
        } else {
          if (!initialLoadError && !error) {
            setError(true);
          }
          // if (!reachedEnd) {
          //   // this hides the footer
          //   setReachedEnd(true);
          // }
          if (loading) {
            setLoading(false);
          }
          console.error(err);
        }
      });
    } else return;
  };

  const renderEachComment = ({ item: post }) => {
    const onProfilePress = () => {
      props.navigation.navigate("UserProfileScreen", {
        userId: "user1",
      });
    };

    return (
      <>
        <ListItem containerStyle={styles.commentContainer}>
          <Avatar
            rounded
            size="small"
            source={{ uri: post.profile_pic }}
            onPress={onProfilePress}
          />
          <ListItem.Content>
            <ListItem.Title>{post.commenter_username}</ListItem.Title>
            <Text style={styles.commentText}>{post.comment}</Text>
            {/* 
              How long ago comment was posted
             */}
            <Moment unix fromNow element={Text} style={styles.commentTime}>
              {post.timestamp}
            </Moment>
          </ListItem.Content>
        </ListItem>
      </>
    );
  };

  /**
   * @summary Returns a retry component if error, otherwise a loading
   * component (ActivityIndicator) if not end of list, else "null"
   */
  const renderFooter = () => {
    if (error) {
      return <RetryMsg onReloadPress={fetchMoreComments} />;
    } else {
      return reachedEnd ? null : (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 20,
          }}
        >
          <ActivityIndicator size="large" color={baseColor} />
          <View style={{ paddingHorizontal: 10 }}>
            <Text style={{ fontFamily: "sans-serif-light", fontSize: 16 }}>
              Loading more comments
            </Text>
          </View>
        </View>
      );
    }
  };

  const emptyList = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text
          style={{
            paddingRight: 10,
            fontFamily: "sans-serif-light",
            fontSize: 16,
          }}
        >
          Be the first one to post a comment
        </Text>
        <Icon name="smile-wink" type="font-awesome-5" />
      </View>
    );
  };

  return (
    <>
      <StatusBar />
      <View key={videoId} style={styles.container}>
        {/* Visible status bar on top */}

        <>
          {/* Back button */}
          <View style={styles.backContainer}>
            <TouchableOpacity onPress={props.navigation.goBack}>
              <View style={styles.backButton}>
                <Text style={styles.backText}>Back</Text>
                <Icon
                  name="navigate-next"
                  type="material"
                  color={baseColor}
                  size={24}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text style={styles.title}>Comments</Text>
        </>

        {/* List of comments; loading screen if not data loaded */}
        <ContentLoader
          active
          avatar
          aSize="small"
          tHeight={20}
          tWidth={"50%"}
          pRows={2}
          pHeight={[30, 15]}
          pWidth={["100%", "50%"]}
          containerStyles={styles.commentContainer}
          listSize={3}
          loading={loading}
        >
          {/* Comments list */}
          {!initialLoadError && (
            <FlatList
              data={comments}
              keyExtractor={(item, index) =>
                "Comment_" + item.comment_id.toString() + "_" + index.toString()
              }
              renderItem={renderEachComment}
              ListFooterComponent={renderFooter}
              onEndReached={fetchMoreComments}
              ListEmptyComponent={emptyList}
              windowSize={11}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              removeClippedSubviews={true}
            />
          )}

          {/* Error message if initial load failed */}
          {initialLoadError && <RetryMsg onReloadPress={fetchMoreComments} />}

          {/* Send comments here */}
          {!initialLoadError && (
            <>
              <Divider style={{ backgroundColor: "black" }} />
              <TextInput
                placeholder="Type your comment here..."
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  fontSize: 14,
                }}
                onSubmitEditing={(event) => console.log(event.nativeEvent.text)}
              />
            </>
          )}
        </ContentLoader>
      </View>
    </>
  );
};

export default React.memo(CommentPage);
// export default CommentPage;

// React.memo(CommentPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "space-between",
    // paddingVertical: 10,
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "normal",
    alignSelf: "center",
    padding: 10,
  },
  backContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: baseColor,
    fontWeight: "bold",
    fontSize: 16,
  },
  commentContainer: {
    backgroundColor: "transparent",
    alignItems: "flex-start",
    paddingVertical: 10,
  },
  commentText: {
    fontSize: 14,
    textAlign: "justify",
    color: "rgba(0,0,0,0.8)",
  },
  commentTime: {
    fontSize: 12,
    color: "rgba(0,0,0,0.5)",
    paddingTop: 5,
  },
});
