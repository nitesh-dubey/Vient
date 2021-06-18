import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { ButtonGroup } from "react-native-elements";
// import FocusAwareStatusBar from "../../utils/statusbar";
import Feed from "./Feed";

const ForYouFeed = (props) => {
  return <Feed key="1" {...props} />;
};

const FollowingFeed = (props) => {
  return <Feed key="2" {...props} />;
};

export default function Home(props) {
  const [selectedIndex, updateIndex] = useState(1);
  const buttons = ["Following", "For You"];

  const showSelectedScreen = () => {
    if (selectedIndex == 0) {
      return <FollowingFeed {...props} />;
    } else if (selectedIndex == 1) {
      return <ForYouFeed {...props} />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* <FocusAwareStatusBar hidden /> */}
      {showSelectedScreen()}

      <ButtonGroup
        onPress={updateIndex}
        selectedIndex={selectedIndex}
        buttons={buttons}
        containerStyle={styles.overallButtonContainer}
        selectedButtonStyle={styles.selectedButtonContainer}
        selectedTextStyle={styles.selectedButtonLabel}
        textStyle={styles.overallButtonLabel}
        innerBorderStyle={styles.innerBorder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overallButtonContainer: {
    borderWidth: 0,
    backgroundColor: "transparent",
    width: "70%",
    alignSelf: "center",
    position: "absolute",
  },
  overallButtonLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
  selectedButtonContainer: {
    borderWidth: 0,
    backgroundColor: "transparent",
  },
  selectedButtonLabel: {
    color: "white",
    fontSize: 16,
  },
  innerBorder: {
    width: 0,
  },
});
