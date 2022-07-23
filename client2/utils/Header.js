import React, {useState} from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";


const Header = () => {
    return (
        Platform.OS === "android" ? (
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
        )
    );
}

const styles = StyleSheet.create({
    linearGradientIOS: {
        height: 180,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 25,
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
});

export default Header;