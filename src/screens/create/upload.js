import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Switch,
  Keyboard,
  Image,
} from "react-native";
import { Icon, Header, ButtonGroup, ListItem } from "react-native-elements";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import * as VideoThumbnails from "expo-video-thumbnails";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import ContentLoader from "react-native-easy-content-loader";

const IconWrapper = (props) => {
  const { containerStyle, textProps, ...iconProps } = props;
  if (textProps) {
    const { placeholder, ...rest } = textProps;
    return (
      <View style={containerStyle}>
        <Icon {...iconProps} />
        <Text {...rest}>{placeholder}</Text>
      </View>
    );
  } else {
    return <Icon {...props} />;
  }
};

const Upload = ({ route, navigation }) => {
  const params = route.params;
  const [thumbnail, setThumbnail] = useState(params.thumbnail); // change this
  const [videoPath, setVideoPath] = useState(params.videoPath); // change this to get home path of video file
  const [saveToAlbum, setSaveToAlbum] = useState(true);
  const [mediaAccessPermitted, setMediaAccessPermitted] = useState(false);

  let selectedVideoType = params.videoType === null ? "fresh" : "reply";

  useEffect(() => {
    async function askPermission() {
      const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
      if (status === "granted") {
        setMediaAccessPermitted(true);
      } else {
        alert(
          "Sorry, we need camera roll permission. Please enable it manually in the phone settings."
        );
      }
    }
    askPermission();

    // return () => {
    //   // when unmounted, reset everything
    //   setThumbnail(null);
    //   setVideoPath(null);
    //   setSaveToAlbum(true);
    // };
  }, []);

  const buttons = [
    <IconWrapper
      name="archive"
      type="feather"
      size={16}
      textProps={{ placeholder: "Drafts" }}
      containerStyle={{ flexDirection: "row" }}
      iconStyle={{ paddingHorizontal: 5 }}
      onPress={_onDraftsClick}
    />,
    <IconWrapper
      name="cloudupload"
      type="antdesign"
      size={20}
      color="white"
      textProps={{ placeholder: "Post", style: { color: "white" } }}
      containerStyle={{ flexDirection: "row" }}
      iconStyle={{ paddingHorizontal: 5 }}
      onPress={_onPostClick}
    />,
  ];

  const toggleSwitch = () => setSaveToAlbum((previousState) => !previousState);

  const generateThumbnail = async (url, frameTime = 1000) => {
    try {
      const createdThumbnail = await VideoThumbnails.getThumbnailAsync(url, {
        time: frameTime,
      }).then(async (createdThumbnail) => {
        setThumbnail(createdThumbnail["uri"]);
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const _onThumbnailUploadClick = async () => {
    try {
      if (mediaAccessPermitted) {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
        });

        if (!result.cancelled) {
          setThumbnail(result.uri);
        }
      } else {
        alert("Permission not given to access media library.");
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const _onVideoUploadClick = async () => {
    try {
      if (mediaAccessPermitted) {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        });

        if (!result.cancelled) {
          /**
           * Local file url must start like this : file://<rest-url>
           * but when a video a selected locally to upload, the returned
           * url looks like : file:<rest-url>, which is rejected by this
           * function. Below code handles this situation.
           */
          let dirtyPath = result.uri.split(":");

          if (dirtyPath[1].startsWith("//")) {
            // given url is correct
            dirtyPath = dirtyPath.join(":");
          } else {
            // given url is wrong
            dirtyPath = dirtyPath[0] + "://" + dirtyPath[1];
          }

          setVideoPath(dirtyPath);
          await generateThumbnail(dirtyPath);
        }
      } else {
        alert("Permission not given to access media library.");
      }
    } catch (e) {
      console.warn(e);
      setVideoPath(null);
    }
  };

  const _onPostClick = () => {
    console.log("post clicked!");
  };

  const _onDraftsClick = async () => {
    console.log("saving as drafts...");
    console.log(videoPath);
    if (videoPath === null) {
      alert("No video is selected. Either create or select one from gallery.");
    } else {
      await MediaLibrary.saveToLibraryAsync(videoPath);
      alert("Video successfully saved to gallery");
    }
  };

  const dropdownVideoTypes =
    params.videoType === null
      ? [
          {
            label: "New Challenge",
            value: "fresh",
          },
        ]
      : [
          {
            label: `Reply to @${params.videoType.opponent}`,
            value: "reply",
          },
          {
            label: "New Challenge",
            value: "fresh",
          },
        ];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.screen}>
        <Header
          leftComponent={
            <Icon
              name="arrow-back"
              type="material"
              color="black"
              onPress={navigation.goBack}
            />
          }
          centerComponent={
            <Text allowFontScaling style={{ color: "black", fontSize: 18 }}>
              Post
            </Text>
          }
          containerStyle={{
            backgroundColor: "transparent",
            borderBottomWidth: 1,
            borderBottomColor: "rgba(0,0,0,0.1)",
          }}
          statusBarProps={{ translucent: true }}
        />

        <View style={styles.middle}>
          <View style={{ paddingBottom: 20 }}>
            {/* Video type - is it a new challenge or a reply ? */}
            <DropDownPicker
              items={dropdownVideoTypes}
              defaultValue={selectedVideoType}
              containerStyle={{ height: 40 }}
              itemStyle={{
                justifyContent: "flex-start",
              }}
              // labelStyle={{ backgroundColor: "red" }}
              onChangeItem={(item) => {
                selectedVideoType = item.value;
              }}
            />
          </View>
          <View style={styles.descriptionThumbnail}>
            {/* Video challenge description */}
            <View
              style={{
                borderLeftWidth: 1,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: "rgba(0,0,0,0.1)",
                borderRadius: 5,
                flex: 1,
                padding: 10,
              }}
            >
              <TextInput placeholder="Describe your challenge" />
            </View>

            {/* Cover picture */}
            <TouchableOpacity onPress={_onThumbnailUploadClick}>
              <View style={{ alignItems: "flex-end" }}>
                <View
                  style={{
                    height: 136,
                    width: 96,
                    borderWidth: 1,
                    borderRadius: 5,
                    overflow: "hidden",
                  }}
                >
                  {thumbnail != null && (
                    <Image
                      height="100%"
                      width="100%"
                      source={{
                        uri: thumbnail,
                      }}
                      style={{ height: "100%", width: "100%" }}
                      resizeMode="cover"
                    />
                  )}

                  <View
                    style={{
                      backgroundColor: "rgba(0,0,0,0.2)",
                      height: 30,
                      width: 96,
                      position: "absolute",
                      bottom: 0,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: "white" }}>Select cover</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.lowerMiddle}>
            {/* Hashtags input */}
            <TextInput
              placeholder="# Hashtags"
              style={{
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.1)",
                borderRadius: 5,
                height: 40,
                padding: 10,
              }}
            />

            {/* Video options */}
            <ListItem
              containerStyle={{ paddingHorizontal: 0, paddingVertical: 30 }}
            >
              <Icon name="download" type="feather" color="rgba(0,0,0,0.3)" />
              <ListItem.Content>
                <ListItem.Title style={{ color: "rgba(0,0,0,0.5)" }}>
                  Save to album
                </ListItem.Title>
              </ListItem.Content>
              <Switch
                trackColor={{ false: "grey", true: "#6be3c7" }}
                thumbColor="white"
                onValueChange={toggleSwitch}
                value={saveToAlbum}
              />
            </ListItem>
          </View>
          {videoPath == null && (
            <TouchableOpacity onPress={_onVideoUploadClick}>
              <View
                style={{
                  paddingVertical: 20,
                  paddingHorizontal: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "rgba(0,0,0,0.5)", fontSize: 15 }}>
                  No video selected.{" "}
                  <Text style={{ color: "#4287f5", fontWeight: "bold" }}>
                    Click here{" "}
                  </Text>
                  to upload one.
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.bottom}>
          <ButtonGroup
            buttons={buttons}
            selectedIndex={1}
            disabled={videoPath == null}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Upload;

const styles = StyleSheet.create({
  screen: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    backgroundColor: "white",
  },
  middle: {
    padding: 20,
  },
  descriptionThumbnail: {
    flexDirection: "row",
  },
  lowerMiddle: {
    marginTop: 20,
    // borderWidth: 1,
  },
  bottom: {
    // flex: 1,
    position: "absolute",
    width: "100%",
    bottom: 0,
    paddingVertical: 10,
    // justifyContent: "flex-end",
  },
  // option: {
  //   flex: 1,
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "space-between",
  // },
});
