import React, { useState, useContext } from "react";
import Message from "./message";
import client from "../api/client";
import { FontAwesome, Feather } from "@expo/vector-icons";
import {
  View,
  StyleSheet,
  Linking,
  Pressable,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { UserContext } from "../contexts/userContexts";

const days = {
  0: "ראשון",
  1: "שני",
  2: "שלישי",
  3: "רביעי",
  4: "חמישי",
  5: "שישי",
  6: "שבת",
};

const Queue = (props) => {
  const { user } = useContext(UserContext);
  const selectedDate = props.selectedDate;
  const setThinking = props.setThinking;
  const setCatchH = props.setCatchH;
  const setIndicator = props.setIndicator;
  const indicator = props.indicator;

  const changePhone = (p) => {
    if (p[0] == "0") {
      return "+972" + p.slice(1);
    } else {
      return p;
    }
  };

  const deleteQueue = async (userid, postid, selectedDate) => {
    setThinking(true);
    await client
      .post(
        "/events/AdminDeleteQueue",
        { userid: userid, postid: postid, date: selectedDate },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setIndicator(!indicator);
        setThinking(false);
        setCatchH(response.data.events);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const catchQueue = async (userid, selectedDate, hour) => {
    setThinking(true);
    await client
      .post(
        "/events/AdminCatchQueue",
        { userid: userid, date: selectedDate, hour: hour + 3 },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setCatchH(response.data.events);
        setIndicator(!indicator);
        setThinking(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showAlert = () => {
    Alert.alert(
      "ביטול תור",
      `האם את בטוחה שאת רוצה לבטל את התור? (אל תשכחי לעדכן את ${item.user.username})`,
      [
        { text: "לא" },
        {
          text: "כן",
          onPress: () => deleteQueue(item.user._id, item.postId, selectedDate),
        },
      ]
    );
  };
  const item = props.item;
  let theTime = new Date(item.time);
  return (
    <View>
      {item.iscatched ? (
        <View
          style={{
            height: 180,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            borderWidth: 1,
            marginHorizontal: 3,
            marginVertical: 0,
          }}
        >
          <View
            style={{
              marginTop: 3,
              display: "flex",
              flexDirection: "row",
              alignContent: "flex-start",
              justifyContent: "center",
              direction: "rtl",
            }}
          >
            <Text style={{ textAlign: "right", fontSize: 18 }}>
              יום {days[selectedDate.getDay()]} {selectedDate.getDate()}/
              {selectedDate.getMonth() + 1}
            </Text>
            <Text> </Text>
            <Text style={{ textAlign: "right", fontSize: 18 }}>
              בשעה {item.hour}:00
            </Text>
          </View>

          {!item.user.isAdmin ? (
            <View
              style={{
                width: "95%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                margin: 12,
                backgroundColor: "#f5f5f5",
                borderRadius: 10,
                paddingBottom: 10,
              }}
            >
              <View style={{ marginBottom: 18 }}>
                <Text style={{ fontSize: 16 }}>
                  התור של {item.user.username}
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignContent: "center",
                  justifyContent: "center",
                  direction: "rtl",
                }}
              >
                <Pressable
                  style={[
                    styles.button,
                    styles.buttonOpen,
                    { backgroundColor: "#fff7f7" },
                  ]}
                  onPress={() => showAlert()}
                >
                  <Text style={{ fontSize: 14 }}>ביטול התור</Text>
                </Pressable>

                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(`tel:${item.user.phone}`);
                  }}
                >
                  <Feather
                    name="phone-forwarded"
                    size={37}
                    color="black"
                    style={{ marginHorizontal: 15 }}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      `https://wa.me/${changePhone(item.user.phone)}`
                    )
                  }
                >
                  <FontAwesome
                    name="whatsapp"
                    size={40}
                    color="black"
                    style={{ marginLeft: 20 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View
              style={{
                width: "95%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                margin: 12,
                backgroundColor: "#f5f5f5",
                borderRadius: 10,
                paddingBottom: 10,
              }}
            >
              <View style={{ marginBottom: 18 }}>
                <Text style={{ fontSize: 16 }}>ביטלת את התור</Text>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignContent: "center",
                  justifyContent: "center",
                  direction: "rtl",
                }}
              >
                <Pressable
                  style={[
                    styles.button,
                    styles.buttonOpen,
                    { backgroundColor: "#fff7f7" },
                  ]}
                  onPress={() =>
                    deleteQueue(item.user._id, item.postId, selectedDate)
                  }
                >
                  <Text style={{ fontSize: 14 }}>שחרור התור</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      ) : (
        <View
          style={{
            height: 110,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            direction: "rtl",
            backgroundColor: "white",
            borderWidth: 1,
            padding: 3,
            paddingBottom: 10,
            marginHorizontal: 3,
            marginVertical: 0,
            backgroundColor: "#fcfcfc",
          }}
        >
          <View
            style={{
              marginTop: 10,
              display: "flex",
              flexDirection: "column",
              alignContent: "flex-end",
              justifyContent: "center",
            }}
          >
            <Text style={{ textAlign: "right", fontSize: 18 }}>
              {days[selectedDate.getDay()]} {selectedDate.getDate()}/
              {selectedDate.getMonth() + 1}
            </Text>

            <Text style={{ textAlign: "center", fontSize: 18 }}>
              {item.hour}:00
            </Text>
          </View>
          <View>
            <Pressable
              style={[styles.button, styles.buttonOpen]}
              onPress={() => catchQueue(user.id, selectedDate, item.hour)}
            >
              <Text style={{ fontSize: 14 }}>ביטול התור</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: "#fafafa",
  },
});

export default Queue;
