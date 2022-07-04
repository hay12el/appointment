import { StatusBar } from "expo-status-bar";
import React, { useContext, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Calendar from "./newQueue";
import {
  Ionicons,
  Entypo,
  MaterialIcons,
  FontAwesome5,
  AntDesign,
  FontAwesome,
} from "@expo/vector-icons";
import { StyledContainer, InnerContainer } from "./../components/styles";
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ScrollView,
  Button,
  Platform,
  Pressable,
  Modal,
} from "react-native";
import { UserContext } from "../contexts/userContexts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from "react-native-gesture-handler";
import { Overlay } from "react-native-elements";
import Constants from "expo-constants";

const StatusBarHeight = Constants.statusBarHeight;

// Images Dictionary
const SECTIONS = [
  {
    key: "1",
    text: "פאני באני",
    uri: "https://www.lady-nails.co.il/wp-content/uploads/2020/06/%D7%9C%D7%A7-%D7%92%D7%9C-12.jpg",
  },
  {
    key: "2",
    text: "סגול מטאלי",
    uri: "https://www.lady-nails.co.il/wp-content/uploads/2020/11/nails5.jpg",
  },

  {
    key: "3",
    text: "לבן פנינה",
    uri: "https://biosculpture.co.il/wp-content/uploads/2021/03/%D7%9E%D7%95%D7%A1%D7%9C%D7%9E%D7%99%D7%95%D7%AA-%D7%9C%D7%A7-%D7%92%D7%9C.jpg",
  },
  {
    key: "4",
    text: "תכלת אפרפר",
    uri: "https://www.lady-nails.co.il/wp-content/uploads/2020/11/nails2.jpg",
  },
  {
    key: "5",
    text: "משולב",
    uri: "https://www.lady-nails.co.il/wp-content/uploads/2020/11/nails6.jpg",
  },
];

// Image
const ListItem = ({ item }) => {
  const [open, setOpen] = useState(false);

  const closeImage = () => {
    if (open != false) {
      setOpen(false);
    }
  };

  const OpenImage = () => {
    if (open != true) {
      setOpen(true);
    }
  };

  return (
    <View style={styles.item}>
      <Pressable
        delayLongPress={100}
        onPressIn={console.log("")}
        onLongPress={() => OpenImage()}
        onPressOut={() => closeImage()}
      >
        <Image
          source={{
            uri: item.uri,
          }}
          style={styles.itemPhoto}
          resizeMode="cover"
        />
        <View
          style={{
            justifyContent: "center",
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            backgroundColor: "white",
            height: 40,
            width: "100%",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: "#364F6B",
            }}
          >
            {item.text}
          </Text>
        </View>
      </Pressable>
      {/* <Overlay isVisible={open} onBackdropPress={toggleOverlay}> */}
      <Overlay isVisible={open} overlayStyle={{ padding: 0 }}>
        <View
          style={{
            height: 500,
            display: "flex",
            flexDirection: "column",
            width: 300,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#e5e5e8",
          }}
        >
          <Image
            source={{
              uri: item.uri,
            }}
            style={{ height: "100%", width: "100%" }}
            resizeMode="cover"
          />
        </View>
      </Overlay>
    </View>
  );
};

const Welcome = ({ navigation }) => {
  const [massage, setMassage] = useState(false);
  const { user, Logout } = useContext(UserContext);

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
      <StatusBar style="light" />
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

      <View
        style={{
          height: "100%",
          flex: 1,
          borderBottomRightRadius: 25,
          borderBottomLeftRadius: 25,
        }}
      >
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

        <ScrollView>
          <StyledContainer>
            <InnerContainer>
              <View
                style={{
                  height: 180,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 0,
                }}
              >
                {Platform.OS === "android" ? (
                  <LinearGradient
                    colors={["#fffafa", "#f7dada", "#e8a9a9"]}
                    locations={[0.0, 0.5, 1.0]}
                    style={{
                      width: "95%",
                      borderTopLeftRadius: 15,
                      borderTopRightRadius: 15,
                      height: 50,
                      alignItems: "center",
                      justifyContent: "center",
                      elevation: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: "#364F6B",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      על עצמי
                    </Text>
                  </LinearGradient>
                ) : (
                  <LinearGradient
                    colors={["#fffafa", "#f7dada", "#e8a9a9"]}
                    locations={[0.0, 0.5, 1.0]}
                    style={{
                      width: "95%",
                      borderRadius: 15,
                      height: 50,
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                      top: -19,
                    }}
                  >
                    <Text
                      style={{
                        color: "#364F6B",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      על עצמי
                    </Text>
                  </LinearGradient>
                )}

                <View style={styles.massageStyle}>
                  <Text
                    style={{
                      color: "#364F6B",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    נעים להכיר :){" "}
                  </Text>
                  <Text
                    style={{
                      color: "#364F6B",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    אני עושה לק ג'ל עם מניקור בתשומת לב מירבית - אשמח לקבל אתכן
                    ולעזור לשמור על הציפורניים שלכן יפות ומטופחות לאורך זמן.
                  </Text>
                </View>
              </View>

              <View
                style={{
                  height: 300,
                  width: "100%",
                  marginVertical: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 70,
                }}
              >
                {Platform.OS === "android" ? (
                  <LinearGradient
                    colors={["#fffafa", "#f7dada", "#e8a9a9"]}
                    locations={[0.0, 0.5, 1.0]}
                    style={{
                      width: "95%",
                      borderTopLeftRadius: 15,
                      borderTopRightRadius: 15,
                      height: 50,
                      alignItems: "center",
                      justifyContent: "center",
                      elevation: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: "#364F6B",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      העבודות שלי
                    </Text>
                  </LinearGradient>
                ) : (
                  <LinearGradient
                    colors={["#fffafa", "#f7dada", "#e8a9a9"]}
                    locations={[0.0, 0.5, 1.0]}
                    style={{
                      width: "95%",
                      borderRadius: 15,
                      height: 50,
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                      top: -33,
                    }}
                  >
                    <Text
                      style={{
                        color: "#364F6B",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      העבודות שלי
                    </Text>
                  </LinearGradient>
                )}
                {/* FlatList View */}
                <View style={styles.FLView}>
                  <FlatList
                    data={SECTIONS}
                    renderItem={({ item }) => <ListItem item={item} />}
                    keyExtractor={(item) => item.key}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                  />
                </View>
                {/* FlatList View */}
              </View>
            </InnerContainer>

            {Platform.OS === "android" ? (
              <LinearGradient
                colors={["#fffafa", "#f7dada", "#e8a9a9"]}
                locations={[0.0, 0.5, 1.0]}
                style={{
                  width: "30%",
                  borderTopLeftRadius: 15,
                  borderBottomLeftRadius: 15,
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "#364F6B", fontSize: 16, fontWeight: "bold" }}
                >
                  עקבו אחרי
                </Text>
              </LinearGradient>
            ) : (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "flex-end",
                  marginBottom: 35,
                }}
              >
                <LinearGradient
                  colors={["#fffafa", "#f7dada", "#e8a9a9"]}
                  locations={[0.0, 0.5, 1.0]}
                  style={{
                    width: "30%",
                    borderRadius: 15,
                    height: 50,
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    right: -20,
                  }}
                >
                  <Text
                    style={{
                      color: "#364F6B",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    עקבו אחרי
                  </Text>
                </LinearGradient>
              </View>
            )}

            {/* Icons Bar */}
            <View style={styles.IconBar}>
              {/* Instegram Icon */}
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(`https://www.instagram.com/`);
                }}
              >
                <AntDesign name="instagram" size={40} color="black" />
              </TouchableOpacity>

              {/* Tiktok Icon */}
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(`https://www.tiktok.com/en/`);
                }}
              >
                <Image
                  style={styles.tinyLogo}
                  source={require("../assets/tik-tok.png")}
                />
              </TouchableOpacity>

              {/* Whatsapp Icon */}
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(`https://wa.me/+972545806799`);
                }}
              >
                <FontAwesome5 name="whatsapp" size={40} color="black" />
              </TouchableOpacity>
            </View>
            {/* Icons Bar */}
          </StyledContainer>
        </ScrollView>
      </View>
      {/* Navigation Bar */}
      <View style={styles.NavBar}>
        <View style={{ display: "flex", alignItems: "center" }}>
          <LinearGradient
            colors={["#FFE2E2", "#fad4d4", "#e8a9a9"]}
            locations={[0, 0.5, 1]}
            style={styles.menuNavigator}
          >
            {Platform.OS === "android" ? (
              <View>
                <LinearGradient
                  colors={["#FFE2E2", "#fad4d4", "#f08b8b"]}
                  locations={[0.0, 0.5, 1.0]}
                  style={styles.AndroidButton}
                >
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Welcome")}
                  >
                    <Ionicons name="home-outline" size={30} color="#364F6B" />
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            ) : (
              <View>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Welcome")}
                >
                  <Ionicons name="home-outline" size={30} color="#364F6B" />
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              onPress={() => navigation.navigate("MyQueues")}
              style={{ marginRight: 10 }}
            >
              <FontAwesome name="calendar" size={28} color="#364F6B" />
            </TouchableOpacity>

            {/* Calendar Modal */}
            <View style={{ position: "absolute", right: "53%", bottom: 65 }}>
              <Calendar />
            </View>
            {/* Calendar Modal */}

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
};

const styles = StyleSheet.create({
  IconBar: {
    margin: 90,
    height: 70,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
    marginTop: 30,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  NavBar: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    position: "absolute",
    bottom: 32,
    right: 0,
    width: "100%",
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
  FLView: {
    height: 290,
    width: "95%",
    marginTop: 0,
    elevation: 6,
    backgroundColor: "white",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  BigContainer: {
    height: "100%",
    flex: 1,
    backgroundColor: "white",
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
  linearGradient: {
    elevation: 8,
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
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  sectionHeader: {
    fontWeight: "800",
    fontSize: 18,
    color: "#f4f4f4",
    marginTop: 20,
    marginBottom: 5,
  },
  item: {
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    backgroundColor: "white",
    borderRadius: 9,
    margin: 10,
  },
  itemPhoto: {
    width: 170,
    height: 230,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    shadowColor: "#000",
  },
  tinyLogo: {
    marginHorizontal: 22,
    width: 40,
    height: 40,
  },
  itemText: {
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: 5,
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
  massageStyle: {
    width: "95%",
    margin: 10,
    marginTop: 0,
    height: 130,
    padding: 12,
    backgroundColor: "white",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default Welcome;
