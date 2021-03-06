import { StatusBar } from "expo-status-bar";
import client from "../api/client";
import React, { useContext } from "react";
import { Formik } from "formik";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  InnerContainer,
  StyledFormArea,
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  RightIcon,
  StyledButton,
  ButtonText,
  Line,
  ExtraText,
  ExtraView,
  TextLink,
  TextLinkContent,
} from "./../components/styles";
import { View, Image, StyleSheet, ActivityIndicator } from "react-native";

const { brand, derLight, primary } = Colors;

import { Octicons, Ionicons } from "@expo/vector-icons";

import { Colors } from "react-native/Libraries/NewAppScreen";
import { useState } from "react";
import { UserContext } from "../contexts/userContexts";
import Constants from "expo-constants";

const StatusBarHeight = Constants.statusBarHeight;

const Login = ({ navigation }) => {
  const [thinking, setThinking] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const { user, Login } = useContext(UserContext);

  const login = async (values, formikActions) => {
    setThinking(true);
    const res = await client
      .post(
        "/users/login",
        { ...values },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(async (response) => {
        await AsyncStorage.setItem("token", response.data.token);
        const newUser = response.data.user;
        setThinking(false);
        Login(
          newUser._id,
          newUser.username,
          newUser.email,
          newUser.phone,
          newUser.queues,
          newUser.isAdmin
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View style={{ height: "100%", paddingTop: StatusBarHeight }}>
      <StatusBar style="dark" />
      <InnerContainer>
        {Platform.OS === "android" ? (
          <LinearGradient
            colors={["#ffc7c7", "#ffc7c7", "#ffa8a8"]}
            locations={[0.0, 0.7, 1.0]}
            style={styles.linearGradient}
          >
            <Image
              source={require("../assets/11.png")}
              style={{ height: 180, width: 180 }}
            ></Image>
          </LinearGradient>
        ) : (
          <LinearGradient
            colors={["#ffc7c7", "#ffc7c7", "#ffa8a8"]}
            locations={[0.0, 0.7, 1.0]}
            style={styles.linearGradientIOS}
          >
            <Image
              source={require("../assets/11.png")}
              style={{ height: 180, width: 180 }}
            ></Image>
          </LinearGradient>
        )}
        <Formik initialValues={{ email: "", password: "" }} onSubmit={login}>
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <StyledFormArea>
              <MyTextInput
                label="?????????? ????????"
                icon="mail"
                placeholder="????????????"
                placeholderTextColor={derLight}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                keboardType="email-address"
              />
              <MyTextInput
                label="??????????"
                icon="lock"
                placeholder="??????????"
                placeholderTextColor={derLight}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                secureTextEntry={hidePassword}
                isPassword={true}
                hidePassword={hidePassword}
                setHidePassword={setHidePassword}
              />
              <StyledButton onPress={handleSubmit}>
                <ButtonText>????????????</ButtonText>
              </StyledButton>
              <Line />

              <ExtraView style={{ direction: "rtl" }}>
                <ExtraText>?????? ???? ???????????</ExtraText>
                <TextLinkContent onPress={() => navigation.navigate("SignUp")}>
                  {" "}
                  ????????????{" "}
                </TextLinkContent>
                <TextLink></TextLink>
              </ExtraView>
            </StyledFormArea>
          )}
        </Formik>

        <ActivityIndicator
          style={styles.loading}
          size="large"
          color="#0000ff"
          animating={thinking}
        />
      </InnerContainer>
    </View>
  );
};

const MyTextInput = ({
  label,
  icon,
  isPassword,
  hidePassword,
  setHidePassword,
  ...props
}) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={brand} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput {...props} />
      {isPassword && (
        <RightIcon
          onPressIn={() => setHidePassword(!hidePassword)}
          onPressOut={() => setHidePassword(!hidePassword)}
        >
          <Ionicons
            size={30}
            color={derLight}
            name={hidePassword ? "md-eye-off" : "md-eye"}
          />
        </RightIcon>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    height: 180,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
  },
  linearGradientIOS: {
    height: 180,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  loading: {
    position: "absolute",
    height: 30,
    width: 78,
    left: "40%",
    top: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Login;
