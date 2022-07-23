import React, {useState} from "react";
import { 
    View,
    StyleSheet,
    Linking,
    TouchableOpacity,
    Image,
    Text
 } from "react-native";
 import {
   FontAwesome5,
   AntDesign,
 } from "@expo/vector-icons";
 import { LinearGradient } from "expo-linear-gradient";

const Links = () => {
    return(
        <>
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
            <Image style={styles.tinyLogo} source={require("../assets/tik-tok.png")} />
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
    </>
    );
}

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
  tinyLogo: {
    marginHorizontal: 22,
    width: 40,
    height: 40,
  },
});

export default Links;