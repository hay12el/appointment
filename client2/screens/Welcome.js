import { StatusBar } from "expo-status-bar";
import React, { useContext, useState } from "react";
import WorkScroll from "../utils/WorkScroll";
import Header from "../utils/Header";
import AboutMe from "../utils/AboutMe";
import Links from "../utils/Links";
import NavBar from "../utils/NavBar";
import Message from "../utils/message";
import { StyledContainer, InnerContainer } from "./../components/styles";
import { View, StyleSheet, ScrollView } from "react-native";
import { UserContext } from "../contexts/userContexts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const StatusBarHeight = Constants.statusBarHeight;

const Welcome = ({ navigation }) => {
  const [massage, setMassage] = useState(false);
  const { Logout } = useContext(UserContext);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      Logout();
      navigation.navigate("Login");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.BigContainer}>
      {/* Log Out Alert */}
      <Message
        text="האם את בטוחה שאת רוצה להתנתק?"
        action={logout}
        open={massage}
        onClose={() => setMassage(false)}
      />
      {/* Log Out Alert */}

      <View style={styles.main}>
        <StatusBar style="dark" backgroundColor="#ffc7c7" />
        <Header />

        <ScrollView>
          <StyledContainer style={{ backgroundColor: "#fffafa" }}>
            <InnerContainer>
              <AboutMe />
              <View style={styles.WS}>
                <WorkScroll />
              </View>
            </InnerContainer>
            <Links />
          </StyledContainer>
        </ScrollView>
      </View>
      <NavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  BigContainer: {
    height: "100%",
    flex: 1,
    backgroundColor: "#fffafa",
    paddingTop: StatusBarHeight,
    paddingBottom: 80,
  },
  header: {
    marginTop: 20,
    marginBottom: 60,
    width: "100%",
    height: 120,
    overflow: "visible",
  },
  WS: {
    height: 300,
    width: "100%",
    marginVertical: 30,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 70,
  },
  main: {
    height: "100%",
    flex: 1,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
  },
});

export default Welcome;
