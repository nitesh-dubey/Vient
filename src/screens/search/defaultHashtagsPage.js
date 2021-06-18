import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SliderBox } from "react-native-image-slider-box";
import { Icon } from "react-native-elements";

const dummyData = require("../../data/hashtag.test.json");
const baseColor = "#D34646";

const TopContent = ({ images }) => {
  console.log("top content called");
  const sliderBoxHeight = Dimensions.get("window").height * 0.25;
  const fullWidth = Dimensions.get("window").width;

  // const renderItem = (item) => {
  //   console.log("render");
  //   return (
  //     <Image
  //       source={{ uri: item.url }}
  //       style={{ height: sliderBoxHeight, width: fullWidth }}
  //       resizeMode="cover"
  //     />
  //   );
  // };

  // return (
  //   <View>
  //     <SliderBox
  //       sliderBoxHeight={sliderBoxHeight}
  //       images={images}
  //       autoplay
  //       circleLoop
  //       // ImageComponentStyle={{ height: sliderBoxHeight }}
  //       renderItem={renderItem}
  //     />

  return (
    <View>
      <Image
        source={{ uri: images[0] }}
        style={{ height: sliderBoxHeight, width: fullWidth }}
        resizeMode="cover"
      />
      <Text style={styles.trendingText}>Trending Now</Text>
    </View>
  );
};

const CardFormat = ({ item }) => {
  return (
    <View style={styles.sectionContainer}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          marginBottom: 10,
        }}
      >
        <View style={styles.sectionHeadingBox}>
          <Text style={styles.sectionHeadingText}># {item.hashtag_id}</Text>
        </View>
        <View style={styles.sectionCounter}>
          <Text style={{ fontWeight: "bold", fontSize: 16, color: baseColor }}>
            {item.video_count}
          </Text>
          {/* <Entypo name="chevron-right" size={22} color={baseColor} /> */}
          <Icon
            type="entypo"
            name="chevron-right"
            size={22}
            color={baseColor}
          />
        </View>
      </View>

      <View style={styles.sectionThumbnail}>
        {item.videos.map((video_data) => (
          <View key={video_data.video_id} style={{ marginRight: 5 }}>
            <Image
              // source={{ uri: video_data.thumbnail }}
              source={{
                uri:
                  "https://embed-fastly.wistia.com/deliveries/4b75e34c66be763461de66a95d9bbf09d56d2077.webp?image_crop_resized=750x1334",
              }}
              style={{ height: 150, width: 90 }}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const DefaultHashtagsPage = () => {
  return (
    <View
      name="Hashtags"
      style={{
        backgroundColor: "white",
        paddingTop: 20,
      }}
    >
      <FlatList
        nestedScrollEnabled
        data={dummyData["trending-hashtags"]}
        keyExtractor={(item) => item.hashtag_id}
        ListHeaderComponent={<TopContent images={dummyData["banner-images"]} />}
        renderItem={CardFormat}
      />
    </View>
  );
};

export default DefaultHashtagsPage;

const styles = StyleSheet.create({
  trendingText: {
    color: baseColor,
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionHeadingBox: {
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "rgba(0,0,0,0.3)",
    padding: 5,
    alignItems: "center",
  },
  sectionHeadingText: {
    fontSize: 16,
  },
  sectionCounter: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  sectionThumbnail: {
    flexDirection: "row",
    overflow: "hidden",
  },
});
