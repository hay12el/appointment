import React, { useState, useContext } from "react";
import { UserContext } from "../contexts/userContexts";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Text,
  Pressable,
  Modal,
} from "react-native";

const Message = (props) => {


  return (
    <Modal
      animationType={"fade"}
      transparent={true}
      visible={props.open}
      onRequestClose={props.onClose}
    >
      <View style={styles.modal}>
        <View
          style={{ flex: 2, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{fontSize:16}}>{props.text}</Text>
        </View>
        <View style={[styles.buttons, { flex: 1 }]}>
          <Pressable onPress={props.onClose}>
            <LinearGradient
              colors={["#ebe0ff", "#dacafa", "#c7a8ff"]}
              locations={[0.0, 0.5, 1.0]}
              style={[styles.button, styles.buttonOpen]}
            >
              <Text style={styles.textStyle}>ביטול</Text>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={() => props.action()}>
            <LinearGradient
              colors={["#ebe0ff", "#dacafa", "#c7a8ff"]}
              locations={[0.0, 0.5, 1.0]}
              style={[styles.button, styles.buttonOpen]}
            >
              <Text style={styles.textStyle}>כן</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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

export default Message;
