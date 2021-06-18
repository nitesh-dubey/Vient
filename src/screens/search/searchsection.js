import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Icon, SearchBar } from "react-native-elements";
import * as dims from "../../utils/dimension";

/**
 * This is the search section placed at the very top of the screen;
 * contains the search bar and filter. On submit click, previous
 * searched text is replaced by the current text.
 */

const SearchSection = (props) => {
  const [currentSearch, setCurrentSearch] = useState("");
  const [previousSearch, setPreviousSearch] = useState("");
  const [searchType, setSearchType] = useState("hashtag");

  const _onSubmitSearch = () => {
    if (currentSearch !== "") {
      setPreviousSearch(currentSearch);

      // TODO : fetch search query results from backend here
    }
  };

  const _onBlur = (props) => {
    console.log("on blur called");
    console.log(props);
  };

  // const _onFilterPress = () => {
  //   alert("Pressed!");
  // };

  // Max length of the search is set to 30 chars
  const maxLength = 30;

  return (
    <View style={styles.mainContainer}>
      {/* Search bar section */}
      <SearchBar
        placeholder="Search"
        onChangeText={setCurrentSearch}
        onSubmitEditing={_onSubmitSearch}
        onBlur={_onBlur}
        value={currentSearch}
        containerStyle={styles.searchbarContainer}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        platform="android"
        maxLength={maxLength}
      />

      {/* Search filter section */}
      {/* <Icon
        name="tune"
        type="material"
        color="black"
        size={24}
        containerStyle={styles.filter}
        onPress={_onFilterPress}
      /> */}
    </View>
  );
};

export default SearchSection;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingRight: 10,
    paddingLeft: 10,
  },

  /**
   * Styling props for the whole search bar container.
   * Distributed width as 90%-10% between searchbar
   * and filter button.
   */
  searchbarContainer: {
    width: "100%",
    backgroundColor: "white",
    borderBottomWidth: 0,
    borderTopWidth: 0,
    alignItems: "center",
  },

  /**
   * Styling props for input box of search bar
   */
  inputContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderBottomWidth: 1,
    height: dims.getHeight(0.06),
    // height: dims.getHeight(0.06),
  },
  inputText: {
    marginLeft: 5,
  },

  /**
   * Styling props for search filter button
   */
  // filter: {
  //   width: "15%",
  //   backgroundColor: "white",
  //   justifyContent: "center",
  //   // borderWidth: 1,
  // },
});
