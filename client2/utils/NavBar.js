import React, { useState, useContext } from "react";
import Message from "./message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../contexts/userContexts";
import { View, StyleSheet, TouchableOpacity, Linking } from "react-native";
import {
  Ionicons,
  Entypo,
  FontAwesome5,
  FontAwesome,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Calendar from "../utils/newQueue";
import { useNavigation } from "@react-navigation/native";

const NavBar = () => {
  const [massage, setMassage] = useState(false);
  const { user, Logout } = useContext(UserContext);
  const navigation = useNavigation();

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
    <View style={styles.navBar}>
      <Message
        text="האם את בטוחה שאת רוצה להתנתק?"
        action={logout}
        open={massage}
        onClose={() => setMassage(false)}
      />

      <View style={{ display: "flex", alignItems: "center" }}>
        <LinearGradient
          colors={["#FFE2E2", "#fad4d4", "#e8a9a9"]}
          locations={[0, 0.5, 1]}
          style={styles.menuNavigator}
        >
          <View>
            <TouchableOpacity onPress={() => navigation.navigate("Welcome")}>
              <Ionicons name="home-outline" size={30} color="#364F6B" />
            </TouchableOpacity>
          </View>
          {user.isAdmin ? (
            <TouchableOpacity
              onPress={() => navigation.navigate("Admin_pannel")}
              style={{ marginRight: 10 }}
            >
              <FontAwesome name="calendar" size={28} color="#364F6B" />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => navigation.navigate("MyQueues")}
                style={{ marginRight: 10 }}
              >
                <FontAwesome name="calendar" size={28} color="#364F6B" />
              </TouchableOpacity>

              <View style={{ position: "absolute", right: "53%", bottom: 65 }}>
                <Calendar />
              </View>

              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    "https://ul.waze.com/ul?ll=31.24937992%2C34.78982806&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location"
                  )
                }
              >
                <FontAwesome5 name="waze" size={29} color="#364F6B" />
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity onPress={() => setMassage(true)}>
            <Entypo name="log-out" size={29} color="#364F6B" />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    position: "absolute",
    bottom: 32,
    right: 0,
    width: "100%",
  },
  menuNavigator: {
    direction: "rtl",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFC7C7",
    width: "95%",
    height: 70,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    paddingHorizontal: 22,
  },
  textStyle: {
    fontSize: 13,
  },
  AndroidButton: {
    height: 50,
    width: 50,
    elevation: 1,
    borderRadius: 100,
    backgroundColor: "#FFE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    elevation: 30,
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    height: 150,
    width: "80%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    marginTop: "80%",
    marginLeft: 40,
  },
  buttons: {
    direction: "rtl",
    height: 55,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    bottom: 0,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    width: 110,
    alignItems: "center",
    elevation: 8,
    marginHorizontal: 24,
    height: 40,
  },
  buttonOpen: {
    backgroundColor: "#FFf6f6",
  },
});

export default NavBar;
