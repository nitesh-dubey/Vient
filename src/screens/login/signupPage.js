import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Icon, CheckBox, Input, Button, Header } from "react-native-elements";
import CountryPicker from "react-native-country-picker-modal";
import { material, human } from "react-native-typography";

const termsListed = require("../../data/agreement.json")["terms"];

const ToS = (props) => {
  return (
    <Modal {...props}>
      <View style={{ flex: 1 }}>
        <Header
          containerStyle={null}
          leftComponent={{
            icon: "arrow-back",
            color: "#fff",
            onPress: props.onBack,
          }}
          centerComponent={{
            text: "Terms & Conditions",
            style: [material.title, { color: "#fff" }],
          }}
        />
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {termsListed.map((eachTerm, index) => (
            <Text
              key={index}
              style={[
                human.callout,
                { paddingVertical: 5, color: "rgba(0,0,0,0.7)" },
              ]}
            >
              {index + 1}. {eachTerm}
            </Text>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

const SignupPage = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [usernameErrorMsg, setUsernameErrorMsg] = useState("");
  const [showOrHide, setShowOrHide] = useState("show");
  const [country, setCountry] = useState({});
  const [showToS, setShowToS] = useState(false);

  // const _onSubmitJoin = () => {
  //   // check email
  //   const emailError = validateEmail(email);
  //   if (emailError) {
  //     // email error present, set it as a message
  //     setEmailErrorMsg(emailError);
  //   } else {
  //     // check password
  //     const passwordError = validatePassword(password);
  //     if (passwordError) {
  //       // password error present, set it as a message
  //       setPasswordErrorMsg(passwordError);
  //     } else {
  //       // check username :
  //       // 1. basic validation
  //       const usernameError = validateUsername(username);
  //       if (usernameError) {
  //         setUsernameErrorMsg(usernameError);
  //       } else {
  //         // 2. check if username already exists in server
  //         // ....
  //       }
  //     }
  //   }
  // };

  const _onSubmitJoin = () => {
    // Basic validation on constraints - username, email, password
    setEmailErrorMsg(validateEmail(email));
    setPasswordErrorMsg(validatePassword(password));
    setUsernameErrorMsg(validateUsername(username));

    // check if email is unique
    // ...

    // check if username is unique
    // ...
  };

  const _onShowPassword = () => {
    setShowPassword(!showPassword);
    setShowOrHide(showOrHide == "show" ? "hide" : "show");
  };

  /**
   * sets all country details from "CountryPicker", including -
   * callingCode, cca2, currency, flag, name, region, subregion
   */
  const _onCountryPicked = (country) => {
    setCountry(country);
    console.log(country);
  };

  const _onPressTerms = () => {
    setShowToS(true);
  };

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase())
      ? null
      : "Please enter a valid email address";
  };

  const validatePassword = (password) => {
    // Rule : length 3 <= password <= 32
    if (password.length >= 3 && password.length <= 32) {
      return null;
    } else {
      return "Password length must be between 3 to 32 characters";
    }
  };

  const validateUsername = (username) => {
    // check if username's length is between 3 and 20 characters
    if (username.length >= 3 && username.length <= 20) {
      // check if username exists in server
      // ...
    } else {
      return "Please make username between 3 and 20 characters";
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Sign Up</Text>
        </View>
        <Input
          placeholder="Username"
          leftIcon={{
            type: "font-awesome",
            name: "user",
            color: "rgba(0,0,0,0.5)",
            iconStyle: { paddingHorizontal: 2 },
          }}
          containerStyle={{
            paddingHorizontal: 20,
          }}
          maxLength={20}
          onChangeText={(newUsername) => setUsername(newUsername)}
          errorMessage={usernameErrorMsg}
        />
        <Input
          placeholder="Email"
          leftIcon={{
            type: "material",
            name: "email",
            color: "rgba(0,0,0,0.5)",
          }}
          containerStyle={{
            paddingHorizontal: 20,
          }}
          maxLength={255}
          onChangeText={(newEmail) => setEmail(newEmail)}
          errorMessage={emailErrorMsg}
        />
        <Input
          placeholder="Password"
          leftIcon={{
            type: "material",
            name: "lock",
            color: "rgba(0,0,0,0.5)",
          }}
          containerStyle={{
            paddingHorizontal: 20,
          }}
          rightIcon={
            <TouchableOpacity onPress={_onShowPassword}>
              <Text style={styles.passwordShow}>{showOrHide}</Text>
            </TouchableOpacity>
          }
          maxLength={32}
          onChangeText={(newPassword) => setPassword(newPassword)}
          secureTextEntry={!showPassword}
          errorMessage={passwordErrorMsg}
        />
        <View style={{ width: "100%" }}>
          <CountryPicker
            placeholder="Select your country"
            withFilter
            containerButtonStyle={{
              marginBottom: 30,
              marginHorizontal: 20,
              borderBottomWidth: 1,
              borderBottomColor: "rgba(0,0,0,0.3)",
              paddingHorizontal: 5,
              paddingVertical: 10,
            }}
            onSelect={_onCountryPicked}
            countryCode={country.cca2}
            withCountryNameButton
          />
        </View>
        <Button
          title="Join"
          containerStyle={{
            width: "100%",
            paddingHorizontal: 20,
          }}
          onPress={_onSubmitJoin}
        />
        <View style={styles.footer}>
          <TouchableOpacity onPress={_onPressTerms}>
            <Text style={styles.footerText}>
              By clicking join you are agreeing to our
              <Text style={styles.blue}> Terms and Conditions </Text>
            </Text>
          </TouchableOpacity>
        </View>
        <ToS
          visible={showToS}
          animationType="slide"
          onBack={() => setShowToS(false)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignupPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    paddingBottom: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: "row",
    width: "80%",
    paddingVertical: 5,
    alignItems: "center",
  },
  inputField: {
    flex: 8.5,
  },
  submitIcon: {
    flex: 1.5,
  },
  submitIconDisabled: {
    backgroundColor: "white",
  },
  footer: {
    width: "100%",
    paddingTop: 40,
    alignItems: "center",
  },
  blue: {
    fontWeight: "bold",
    color: "#1984d1",
  },
  footerText: {
    paddingVertical: 5,
    textAlign: "center",
    color: "rgba(0,0,0,0.5)",
  },
  passwordShow: {
    paddingLeft: 10,
    color: "rgba(0,0,0,0.5)",
  },
});
