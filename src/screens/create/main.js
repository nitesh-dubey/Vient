import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Icon, Slider } from "react-native-elements";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import * as VideoThumbnails from "expo-video-thumbnails";
import { Video } from "expo-av";
// import FocusAwareStatusBar from "../../utils/statusbar";

const timer = require("react-native-timer");

/**
 * @param props : receives all Icon props and Text props
 * @returns : A wrapper around Icon element from react-native-elements, to display
 * name. If no textProps are provided, it falls back to regular <Icon />
 */
const IconWrapper = (props) => {
  const { containerStyle, textProps, ...iconProps } = props;
  console.log(textProps);

  if (textProps) {
    const { placeholder, style } = textProps;

    return (
      <View style={containerStyle}>
        <Icon {...iconProps} />
        <Text style={{ ...style }}>{placeholder}</Text>
      </View>
    );
  } else {
    return <Icon {...props} />;
  }
};

const VideoEditingPage = ({ route, navigation }) => {
  console.log(route);

  return (
    <Video
      source={{
        uri: route.params.sourceUri,
      }}
      style={styles.video}
      resizeMode="cover"
      useNativeControls
    />
  );
};

const Create = (props) => {
  const MAX_DURATION = 20;
  const [recordingDuration, setRecordingDuration] = useState(MAX_DURATION);

  //  camera permissions
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  // const [isCameraReady, setIsCameraReady] = useState(false);

  // Screen Ratio and image padding
  const [imagePadding, setImagePadding] = useState(0);
  const [ratio, setRatio] = useState("4:3"); // default is 4:3
  const { height, width } = Dimensions.get("window");
  const screenRatio = height / width;
  const [isRatioSet, setIsRatioSet] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);

  // Icon
  const [isRecording, setIsRecording] = useState(false);
  // const [videoUri, setVideoUri] = useState(null);
  // const [thumbnailUri, setThumbnailUri] = useState(null);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode["off"]);
  const [timerSliderVisible, setTimerSliderVisible] = useState(false);

  // Focused or not
  const [focused, setFocused] = useState(false);

  // Timer
  const [counter, setCounter] = useState(0);

  /**
   * Experimental optimizations
   */
  let videoUri = null;
  let thumbnailUri = null;

  // on screen load, ask for permission to use the camera
  // useEffect(() => {
  //   async function getPermissions() {
  //     const cameraStatus = await Permissions.askAsync(Permissions.CAMERA);
  //     const audioStatus = await Permissions.askAsync(
  //       Permissions.AUDIO_RECORDING
  //     );
  //     setHasCameraPermission(cameraStatus.status == "granted");
  //     setHasAudioPermission(audioStatus.status == "granted");
  //   }
  //   getPermissions();
  //   console.log("camera mounted");

  //   // on unmount
  //   return async () => {
  //     // setVideoUri(null);
  //     // setThumbnailUri(null);
  //     // setFlashMode(Camera.Constants.FlashMode["off"]);
  //     // setIsRecording(false);
  //     // setCamera(null);
  //     // setIsCameraReady(false);
  //     console.log("camera unmounted");
  //   };
  // }, []);

  async function getPermissions() {
    const cameraStatus = await Permissions.askAsync(Permissions.CAMERA);
    const audioStatus = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    setHasCameraPermission(cameraStatus.status == "granted");
    setHasAudioPermission(audioStatus.status == "granted");
  }

  useFocusEffect(
    React.useCallback(() => {
      // when focused
      if (!hasCameraPermission || !hasAudioPermission) {
        getPermissions();
      }
      setFocused(true);
      console.log("camera focused");

      // when unfocused
      return () => {
        setFocused(false);
        console.log("camera unfocused");
      };
    }, [])
  );

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // when focused
  //     setFocused(true);
  //     console.log("camera focused");

  //     // when unfocused
  //     return () => {
  //       setFocused(false);
  //       console.log("camera unfocused");
  //     };
  //   }, [])
  // );

  // set the camera ratio and padding.
  // this code assumes a portrait mode screen
  const prepareRatio = async () => {
    let desiredRatio = "4:3"; // Start with the system default
    // This issue only affects Android
    if (Platform.OS === "android") {
      const ratios = await camera.getSupportedRatiosAsync();

      // Calculate the width/height of each of the supported camera ratios
      // These width/height are measured in landscape mode
      // find the ratio that is closest to the screen ratio without going over
      let distances = {};
      let realRatios = {};
      let minDistance = null;
      for (const ratio of ratios) {
        const parts = ratio.split(":");
        const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
        realRatios[ratio] = realRatio;
        // ratio can't be taller than screen, so we don't want an abs()
        const distance = screenRatio - realRatio;
        distances[ratio] = realRatio;
        if (minDistance == null) {
          minDistance = ratio;
        } else {
          if (distance >= 0 && distance < distances[minDistance]) {
            minDistance = ratio;
          }
        }
      }
      // set the best match
      desiredRatio = minDistance;
      // calculate the difference between the camera width and the screen height
      const remainder = Math.floor(
        (height - realRatios[desiredRatio] * width) / 2
      );
      // set the preview padding and preview ratio
      setImagePadding(remainder / 2);
      setRatio(desiredRatio);
      // Set a flag so we don't do this
      // calculation each time the screen refreshes
      setIsRatioSet(true);
    }
  };

  const generateThumbnail = async (url, frameTime = 1000) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(url, {
        time: frameTime,
      });

      // save thumbnail Uri
      thumbnailUri = uri;
      console.log("thumbnail info", thumbnailUri);
    } catch (e) {
      console.warn(e);
    }
  };

  // the camera must be loaded in order to access the supported ratios
  const _onCameraReady = async () => {
    // setIsCameraReady(true);
    // if (isCameraReady) {
    if (!isRatioSet) {
      await prepareRatio();
    }
    // }
  };

  const startTimer = async () => {
    timer.setInterval(
      this,
      "record",
      () => {
        if (recordingDuration > counter) {
          setCounter((prevCounter) => prevCounter + 1);
        }
      },
      1000
    );
  };

  const stopTimer = async () => {
    timer.clearInterval(this);
    setCounter(0);
  };

  // this is called after video is stopped
  const recordingFinished = async (videoFile) => {
    console.log("file info ->", videoFile);

    // stop the timer here
    stopTimer();

    // set isRecording to false
    setIsRecording(false);

    // save the video's local uri and generate it's thumbnail
    videoUri = videoFile.uri;
    await generateThumbnail(videoUri);
  };

  // specs of video to be recorded
  const recodingVideoSpecs = {
    maxDuration: recordingDuration,
    quality: "720p",
    mute: hasAudioPermission === null,
  };

  // this is called when record button is pressed
  const _onPressRecord = async () => {
    try {
      if (isRecording) {
        await camera.stopRecording();
      } else {
        setIsRecording(true);
        // start timer here
        startTimer();
        await camera.recordAsync(recodingVideoSpecs).then(recordingFinished);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const _onPressFlash = () => {
    if (flashMode == Camera.Constants.FlashMode["off"]) {
      setFlashMode(Camera.Constants.FlashMode["torch"]);
    } else {
      setFlashMode(Camera.Constants.FlashMode["off"]);
    }
  };

  const _onPressTimer = () => {
    setTimerSliderVisible(!timerSliderVisible);
  };

  // const _onPressSpeed = () => {};

  const _onPressClose = () => {
    props.navigation.goBack();
  };

  const _onPressUpload = () => {
    props.navigation.navigate("Upload", {
      thumbnail: thumbnailUri,
      videoPath: videoUri,
      videoType: {
        type: "reply",
        opponent: "username",
      },
    });
  };

  const _onPressReview = () => {
    console.log("Open video edit section");
    if (videoUri) {
      props.navigation.navigate("VideoEdit", { sourceUri: videoUri });
    }
  };

  if (hasCameraPermission === null) {
    return (
      <View style={styles.information}>
        <Text style={{ color: "white" }}>
          Waiting for camera permissions...
        </Text>
      </View>
    );
  } else if (hasCameraPermission === false) {
    return (
      <View style={styles.information}>
        <Text style={{ color: "white" }}>No access to camera</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {/* <FocusAwareStatusBar hidden /> */}
        {/* 
          We created a Camera height by adding margins to the top and bottom, 
          but we could set the width/height instead 
          since we know the screen dimensions
        */}
        {focused && (
          <Camera
            style={[
              styles.cameraPreview,
              { marginTop: imagePadding, marginBottom: imagePadding },
            ]}
            type={type}
            onCameraReady={_onCameraReady}
            ratio={ratio}
            flashMode={flashMode}
            ref={(ref) => {
              setCamera(ref);
            }}
          >
            {/* {videoUri !== null && <VideoWrapper sourceUri={videoUri} />} */}
            <View style={styles.iconContainer}>
              <View style={{ alignItems: "center" }}>
                <Slider
                  disabled
                  animateTransitions
                  animationType="timing"
                  maximumTrackTintColor="rgba(0,0,0,0.5)"
                  maximumValue={recordingDuration + 1}
                  minimumTrackTintColor="cyan"
                  minimumValue={0}
                  orientation="horizontal"
                  step={1}
                  style={{ width: "100%", height: 30 }}
                  thumbStyle={{ height: 10, width: 5 }}
                  thumbTintColor="#fff"
                  trackStyle={{ height: 5, borderRadius: 5 }}
                  value={counter + 1}
                />
                <Text style={{ color: "white" }}>
                  Remaining: {recordingDuration - counter} sec
                </Text>
              </View>

              <View style={styles.topIcons}>
                {/* 
                Close button
               */}
                <View style={styles.topLeftIcons}>
                  <Icon
                    name="ios-close"
                    type="ionicon"
                    color="white"
                    size={44}
                    onPress={_onPressClose}
                  />
                </View>

                <View style={styles.topRightIcons}>
                  {/* 
                  Camera flash button
                 */}
                  <IconWrapper
                    name="ios-flash"
                    type="ionicon"
                    color="white"
                    size={36}
                    textProps={{
                      placeholder: "Flash",
                      style: styles.iconWrapperText,
                    }}
                    onPress={_onPressFlash}
                    containerStyle={{ paddingVertical: 10 }}
                  />

                  {/* 
                    Not sure if speed control will be possible to make now
                 */}
                  {/* <IconWrapper
                  name="play-speed"
                  type="material-community"
                  color="white"
                  size={36}
                  textProps={{
                    placeholder: "Speed",
                    style: styles.iconWrapperText,
                  }}
                  containerStyle={{ paddingVertical: 10 }}
                /> */}

                  {/* 
                  Video timer button
                 */}
                  <IconWrapper
                    name="timer"
                    type="material"
                    color="white"
                    size={36}
                    textProps={{
                      placeholder: "Timer",
                      style: styles.iconWrapperText,
                    }}
                    onPress={_onPressTimer}
                    containerStyle={{ paddingVertical: 10 }}
                  />

                  {/* 
                  Video review button 
                 */}
                  <IconWrapper
                    name="controller-play"
                    type="entypo"
                    color="white"
                    size={36}
                    textProps={{
                      placeholder: "Review",
                      style: styles.iconWrapperText,
                    }}
                    onPress={_onPressReview}
                    containerStyle={{ paddingVertical: 10 }}
                  />
                </View>
              </View>
              {timerSliderVisible && (
                <View style={{ alignItems: "center" }}>
                  <Slider
                    animateTransitions
                    animationType="timing"
                    maximumTrackTintColor="rgba(0,0,0,0.2)"
                    maximumValue={20}
                    minimumTrackTintColor="cyan"
                    minimumValue={0}
                    allowTouchTrack
                    orientation="horizontal"
                    step={1}
                    style={{ width: "90%" }}
                    thumbStyle={{ height: 30, width: 30 }}
                    thumbTintColor="white"
                    thumbTouchSize={{ width: 40, height: 40 }}
                    trackStyle={{ height: 10, borderRadius: 20 }}
                    value={20}
                    disabled={isRecording}
                    onValueChange={(newValue) => {
                      if (newValue != recordingDuration) {
                        /**
                         * avoid duplicate setting of duration,
                         * occurs when pressed, the finger touches
                         * same spot multiple times
                         */
                        setRecordingDuration(newValue);
                      }
                    }}
                  />
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Time: {recordingDuration} sec
                  </Text>
                </View>
              )}

              {/* 
              The bottom video controls section
             */}

              <View style={styles.bottomIcons}>
                <IconWrapper
                  name="flip-camera-ios"
                  type="material"
                  color="white"
                  size={36}
                  textProps={{
                    placeholder: "Flip",
                    style: styles.iconWrapperText,
                  }}
                  onPress={() => {
                    setType(
                      type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                    );
                  }}
                />

                {/* 
                  Camera flip button
                */}
                <IconWrapper
                  reverse
                  name={isRecording ? "ios-pause" : "ios-videocam"}
                  type="ionicon"
                  color="red"
                  size={32}
                  onPress={_onPressRecord}
                />

                {/* 
                  Upload button
                 */}
                <IconWrapper
                  name="upload"
                  type="feather"
                  color="white"
                  size={28}
                  textProps={{
                    placeholder: "Upload",
                    style: styles.iconWrapperText,
                  }}
                  onPress={_onPressUpload}
                />
              </View>
            </View>
          </Camera>
        )}
      </View>
    );
  }
};

export { VideoEditingPage, Create };

const styles = StyleSheet.create({
  information: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  cameraPreview: {
    flex: 1,
  },
  iconContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    // -- test purpose --
    // borderColor: "cyan",
    // borderWidth: 1,
  },
  bottomIcons: {
    width: "100%",
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // -- test purpose --
    // borderColor: "yellow",
    // borderWidth: 1,
  },
  topIcons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    // -- test purpose --
    // borderColor: "purple",
    // borderWidth: 1,
  },
  topRightIcons: {
    // -- test purpose --
    // borderWidth: 1,
    // borderColor: "red",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  iconWrapperText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
  video: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
