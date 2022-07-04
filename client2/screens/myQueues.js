import React, { useEffect, useState, useContext, useRef } from "react";
import {
  Image,
  StyleSheet,
  View,
  Button,
  Pressable,
  FlatList,
  TouchableOpacity,
  Linking,
  Alert,
  Animated,
  ActivityIndicator,
  Modal,
  Text,
  Platform,
} from "react-native";
import Calendar from "./newQueue";
import {
  Entypo,
  MaterialIcons,
  FontAwesome5,
  Ionicons,
  FontAwesome,
} from "@expo/vector-icons";
import client from "../api/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../contexts/userContexts";
import { StyledContainer } from "./../components/styles";
import { LinearGradient } from "expo-linear-gradient";
import { API, ADMIN_ID } from "@env";
import Constants from "expo-constants";

const StatusBarHeight = Constants.statusBarHeight;

const days = {
  0: "ראשון",
  1: "שני",
  2: "שלישי",
  3: "רביעי",
  4: "חמישי",
  5: "שישי",
  6: "שבת",
};

export default function MyQueues({ navigation }) {
  const [massage, setMassage] = useState(false);
  const [queues, setQueues] = useState({});
  const { user, Logout } = useContext(UserContext);
  const [ok, setOk] = useState(true);
  const [reload, setReload] = useState(true);
  const [thinking, setThinking] = useState(false);
  const translation = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    Animated.timing(translation, {
      toValue: 0,

      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [ok]);

  //
  const Queue = ({ item }) => {
    const [delete1, setDelete] = useState(false);
    let theTime = new Date(item.time);
    return (
      <Animated.View
        style={{
          height: 140,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          transform: [{ translateY: translation }],
          shadowOffset: {
            width: 2,
            height: 2,
          },
          shadowColor: "black",
          elevation: 5,
          backgroundColor: "white",
          shadowOpacity: 3,
          borderRadius: 20,
          padding: 3,
          marginHorizontal: 27,
          marginTop: 26,
          marginBottom: 20,
        }}
      >
        <View
          style={{
            position: "absolute",
            height: 50,
            width: 50,
            borderRadius: 100,
            borderWidth: 1,
            justifyContent: "center",
            alignItems: "center",
            top: -25,
            backgroundColor: "white",
            elevation: 5,
          }}
        >
          <FontAwesome name="calendar" size={27} color="black" />
        </View>
        <View
          style={{
            direction: "rtl",
            marginTop: 30,
            display: "flex",
            flexDirection: "row",
            alignContent: "flex-start",
            justifyContent: "center",
          }}
        >
          <Text style={{ textAlign: "right", fontSize: 16 }}>
            יום {days[theTime.getDay()]} {theTime.getDate()}/
            {theTime.getMonth() + 1}
          </Text>
          <Text> </Text>
          <Text style={{ textAlign: "right", fontSize: 16 }}>
            בשעה {theTime.getUTCHours() - 3}:00
          </Text>
        </View>

        <Pressable onPress={() => setDelete(!delete1)}>
          <LinearGradient
            colors={["#FFE2E2", "#fad4d4", "#e8b7b7"]}
            locations={[0.0, 0.5, 1.0]}
            style={[styles.QueueButton]}
          >
            <Text style={{ fontSize: 14 }}>ביטול התור</Text>
          </LinearGradient>
        </Pressable>

        {/* deleting queue alert */}

        <Modal
          animationType={"fade"}
          transparent={true}
          visible={delete1}
          onRequestClose={() => setDelete(!delete1)}
        >
          {/*All views of Modal*/}
          <View style={styles.modal}>
            <View
              style={{
                flex: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>האם את בטוחה שאת רוצה לבטל את התור?</Text>
            </View>
            <View style={[styles.buttons, { flex: 1 }]}>
              <Pressable onPress={() => setDelete(!delete1)}>
                <LinearGradient
                  colors={["#FFE2E2", "#fad4d4", "#e8b7b7"]}
                  locations={[0.0, 0.5, 1.0]}
                  style={[styles.button, styles.buttonOpen]}
                >
                  <Text style={styles.textStyle}>ביטול</Text>
                </LinearGradient>
              </Pressable>

              <Pressable onPress={() => deleteQueue(item._id)}>
                <LinearGradient
                  colors={["#FFE2E2", "#fad4d4", "#e8b7b7"]}
                  locations={[0.0, 0.5, 1.0]}
                  style={[styles.button, styles.buttonOpen]}
                >
                  <Text style={styles.textStyle}>כן</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* deleting queue alert */}
      </Animated.View>
    );
  };

  useEffect(async () => {
    setThinking(true);
    await client
      .post(
        "/events/getMyQueue",
        { user: user },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setOk(!ok);
        setQueues(response.data);
        setThinking(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reload]);

  const rreload = () => {
    setReload(!reload);
  };

  const deleteQueue = async (id) => {
    await client
      .post(
        "/events/deleteQueue",
        { user: user, id: id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setQueues(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
    <View
      style={{ height: "100%", paddingBottom: 90, paddingTop: StatusBarHeight }}
    >
      {/* Log Out Alert */}

      <Modal
        animationType={"fade"}
        transparent={true}
        visible={massage}
        onRequestClose={() => setMassage(!massage)}
      >
        {/*All views of Modal*/}
        <View style={styles.modal}>
          <View
            style={{ flex: 2, justifyContent: "center", alignItems: "center" }}
          >
            <Text>האם את בטוחה שאת רוצה להתנתק?</Text>
          </View>
          <View style={[styles.buttons, { flex: 1 }]}>
            <Pressable onPress={() => setMassage(!massage)}>
              <LinearGradient
                colors={["#FFE2E2", "#fad4d4", "#e8b7b7"]}
                locations={[0.0, 0.5, 1.0]}
                style={[styles.button, styles.buttonOpen]}
              >
                <Text style={styles.textStyle}>ביטול</Text>
              </LinearGradient>
            </Pressable>

            <Pressable onPress={() => logout()}>
              <LinearGradient
                colors={["#FFE2E2", "#fad4d4", "#e8b7b7"]}
                locations={[0.0, 0.5, 1.0]}
                style={[styles.button, styles.buttonOpen]}
              >
                <Text style={styles.textStyle}>כן</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Log Out Alert */}

      {Platform.OS === "android" ? (
        <LinearGradient
          colors={["#ffc7c7", "#ffc7c7", "#ffa8a8"]}
          locations={[0.0, 0.7, 1.0]}
          style={styles.linearGradient}
        >
          <Image
            source={require("../assets/2.png")}
            style={{ height: 80, width: 70 }}
          ></Image>
          <Text style={{ fontSize: 30, color: "#364F6B" }}>התורים שלך:</Text>
        </LinearGradient>
      ) : (
        <LinearGradient
          colors={["#ffc7c7", "#ffc7c7", "#ffa8a8"]}
          locations={[0.0, 0.7, 1.0]}
          style={styles.linearGradientIOS}
        >
          <Image
            source={require("../assets/2.png")}
            style={{ height: 80, width: 70 }}
          ></Image>
          <Text style={{ fontSize: 30, color: "#364F6B" }}>התורים שלך:</Text>
        </LinearGradient>
      )}

      <View style={{ flex: 1, borderRadius: 50, position: "relative" }}>
        {Object.keys(queues).length === 0 ? (
          <View style={{ marginTop: "50%" }}>
            <Text style={{ textAlign: "center", fontSize: 40 }}>
              אין תורים עתידיים
            </Text>
          </View>
        ) : (
          <FlatList
            style={{ paddingTop: 10 }}
            data={queues}
            renderItem={({ item }) => <Queue item={item} />}
            keyExtractor={(item) => item._id}
          />
        )}
      </View>

      <ActivityIndicator
        style={styles.loading}
        size="large"
        color="#0000ff"
        animating={thinking}
      />

      {/* Navigation Bar */}
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          position: "absolute",
          bottom: 32,
          right: 0,
          width: "100%",
        }}
      >
        <View style={{ display: "flex", alignItems: "center" }}>
          <LinearGradient
            colors={["#FFE2E2", "#fad4d4", "#e8a9a9"]}
            locations={[0, 0.5, 1]}
            style={styles.menuNavigator}
          >
            <TouchableOpacity onPress={() => navigation.navigate("Welcome")}>
              <Ionicons name="home-outline" size={30} color="#364F6B" />
            </TouchableOpacity>

            {Platform.OS === "android" ? (
              <LinearGradient
                colors={["#FFE2E2", "#fad4d4", "#f08b8b"]}
                style={{
                  height: 50,
                  width: 50,
                  elevation: 1,
                  borderRadius: 100,
                  backgroundColor: "#FFE2E2",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate("MyQueues")}
                >
                  <FontAwesome name="calendar" size={28} color="#364F6B" />
                </TouchableOpacity>
              </LinearGradient>
            ) : (
              <TouchableOpacity onPress={() => navigation.navigate("MyQueues")}>
                <FontAwesome name="calendar" size={28} color="#364F6B" />
              </TouchableOpacity>
            )}

            {/* Calendar model */}
            <View style={{ position: "absolute", right: "53%", bottom: 65 }}>
              <Calendar />
            </View>
            {/* Calendar model */}

            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  "https://ul.waze.com/ul?ll=31.24937992%2C34.78982806&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location"
                )
              }
            >
              <FontAwesome5 name="waze" size={29} color="#364F6B" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setMassage(!massage)}>
              <Entypo name="log-out" size={29} color="#364F6B" />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
      {/* Navigation Bar */}
    </View>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    height: 180,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
  },
  linearGradientIOS: {
    height: 180,
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
  queues: {
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "white",
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 90,
    marginLeft: 3,
    marginRight: 3,
    marginVertical: 2,
  },
  QueueButton: {
    backgroundColor: "#FFE2E2",
    borderRadius: 15,
    padding: 4,
    width: 140,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    marginVertical: 24,
    height: 30,
  },
  buttons: {
    height: 50,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 85,
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  text: {
    color: "#3f2949",
    fontSize: 16,
    marginTop: 10,
  },
  textStyle: {
    fontSize: 13,
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
});
