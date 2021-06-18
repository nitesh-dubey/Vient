import React from "react";
import { View, StyleSheet } from "react-native";
import SearchSection from "./searchsection";
import ContentSplitter from "./contentSplitter";

/**
 * TODO : background fetch items from backend
 */

const Search = (props) => {
  return (
    <View style={styles.container}>
      <SearchSection {...props} />
      <ContentSplitter {...props} />
    </View>
  );
};

/**
 * Uniform padding for the entire screen is provided as 10
 * Bottom navigation bar's height is also taken into consideration
 */

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
});

export default Search;
