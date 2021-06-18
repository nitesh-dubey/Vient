import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Icon, CheckBox, Input, Button } from "react-native-elements";

const SigninPage = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");

  const _onSubmitLogin = () => {
    // check email
    const emailError = validateEmail(email);
    if (emailError) {
      // email error present, set it as a message
      setEmailErrorMsg(emailError);
    } else {
      // check password
      const passwordError = validatePassword(password);
      if (passwordError) {
        // if basic validation fails, set message
        setPasswordErrorMsg(passwordError);
      } else {
        // check if password matches with server record
        // ...
      }
    }
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
      return "Please make your password between 3 to 32 characters";
    }
  };

  const signUpRedirect = () => {
    props.navigation.navigate("SignUp");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Sign In</Text>
        </View>
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
          maxLength={32}
          onChangeText={(newPassword) => setPassword(newPassword)}
          secureTextEntry={!showPassword}
          errorMessage={passwordErrorMsg}
        />
        <CheckBox
          title="Show password"
          checked={showPassword}
          onPress={() => setShowPassword(!showPassword)}
          containerStyle={{
            backgroundColor: "transparent",
            borderWidth: 0,
            width: "100%",
            paddingHorizontal: 10,
            paddingVertical: 20,
          }}
          wrapperStyle={{
            paddingHorizontal: 10,
          }}
          textStyle={{ fontWeight: "normal" }}
        />
        <Button
          title="Login"
          containerStyle={{
            width: "100%",
            paddingHorizontal: 20,
          }}
          onPress={_onSubmitLogin}
        />
        <View style={styles.footer}>
          <TouchableOpacity>
            <Text style={[styles.footerText, styles.blue]}>
              Forgot password?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={signUpRedirect}>
            <Text style={styles.footerText}>
              Don't have an account?
              <Text style={styles.blue}> Sign Up </Text>
              here
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SigninPage;

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
});
