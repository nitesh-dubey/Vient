import React from "react";
import { BottomSheet, ListItem } from "react-native-elements";

const MyBottomSheet = (props) => {
  const list = [
    { title: "Choose Image" },
    { title: "Take Image" },
    {
      title: "Cancel",
      containerStyle: { backgroundColor: "red" },
      titleStyle: { color: "white" },
      onPress: () => setIsVisible(false),
    },
  ];

  return (
    <BottomSheet
      isVisible={props.isBottomSheetVisible}
      containerStyle={{ backgroundColor: "#fff", borderRadius: 10 }}
    >
      {list.map((l, i) => (
        <ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress}>
          <ListItem.Content>
            <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    </BottomSheet>
  );
};

export default MyBottomSheet;
