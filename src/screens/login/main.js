import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  Icon,
  CheckBox,
  Input,
  Button,
  ListItem,
  Avatar,
} from "react-native-elements";
import { set } from "react-native-reanimated";
import SigninPage from "./signinPage";

const CustomImage = (props) => {
  return <Image source={props.imageName} {...props} />;
};

const accountsList = {
  accounts: [
    {
      username: "kaustav_bhatt",
      fullname: "Kaustav Bhattacharjee",
      email: "kaustav.bhattacharjee2000@gmail.com",
      password: "password",
      profile_pic: require("../../../assets/user/thumbnails/44519220.jpeg"),
    },
    {
      username: "kaustav_bhatt2000",
      fullname: "Kaustav Bhattacharjee",
      email: "kaustav.bhattacharjee2000@gmail.com",
      password: "password",
      profile_pic: require("../../../assets/user/thumbnails/44519220.jpeg"),
    },
    {
      username: "nitesh_dubey",
      fullname: "Nitesh Dubey",
      email: "niteshdubey100@gmail.com",
      password: "password",
      profile_pic: require("../../../assets/user/thumbnails/v1tMw3ya_400x400.jpg"),
    },
  ],
};

const Login = (props) => {
  const [toRemove, setToRemove] = useState(false);
  const [removeBtnTitle, setRemoveBtnTitle] = useState("Remove account");
  const accounts = accountsList.accounts;

  const _onRemovePress = () => {
    // toggle current title and change icon besides the account names accordingly
    if (removeBtnTitle == "Remove account") {
      setRemoveBtnTitle("Back");
      setToRemove(true);
    } else if (removeBtnTitle == "Back") {
      setRemoveBtnTitle("Remove account");
      setToRemove(false);
    }
  };

  const _onAccountPress = () => {
    if (toRemove) {
      // remove account cache if toRemove is set
    } else {
      // otherwise sign in using that account
    }
  };

  const _pressedDifferentAccountSignIn = () => {
    props.navigation.navigate("SignIn");
  };

  const DisplayPage = () => {
    const renderItems = ({ item }) => {
      return (
        <ListItem onPress={_onAccountPress}>
          <Avatar
            rounded
            source={item.profile_pic}
            placeholderStyle={{ backgroundColor: "transparent" }}
          />
          <ListItem.Content>
            <ListItem.Title>{item.fullname}</ListItem.Title>
            <ListItem.Subtitle>@{item.username}</ListItem.Subtitle>
          </ListItem.Content>
          {toRemove ? (
            <Icon
              name="close"
              type="antdesign"
              color="grey"
              size={16}
              onPress={() => console.log("delete profile cache")}
            />
          ) : (
            <ListItem.Chevron />
          )}
        </ListItem>
      );
    };

    // if user already has accounts in App, then show those
    if (accounts.length) {
      return (
        <View>
          <Text style={styles.accountsChoose}>Choose an account</Text>
          <FlatList
            data={accounts}
            renderItem={renderItems}
            keyExtractor={(item) => item.username}
          />
          {!toRemove && (
            <Button
              title="Use different account"
              type="outline"
              containerStyle={{ alignItems: "center", marginVertical: 10 }}
              buttonStyle={{ width: "70%" }}
              onPress={_pressedDifferentAccountSignIn}
            />
          )}
          <Button
            title={removeBtnTitle}
            type="clear"
            containerStyle={{ alignItems: "center" }}
            buttonStyle={{ width: "70%" }}
            titleStyle={{ color: "rgba(0,0,0,0.4)" }}
            onPress={_onRemovePress}
          />
        </View>
      );
    } else {
      // else let user signin
      return <SigninPage {...props} />;
    }
  };

  return (
    <View
      style={{ flex: 1, justifyContent: "center", backgroundColor: "white" }}
    >
      <StatusBar />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Sign In</Text>
          </View>
          <DisplayPage {...props} />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    // alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    paddingBottom: 20,
  },
  titleContainer: {
    alignItems: "center",
  },
  accountsChoose: {
    fontSize: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
});
