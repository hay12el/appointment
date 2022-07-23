import React, {useState} from "react";
import { 
    View,
    StyleSheet,
    Platform,
    Text
 } from "react-native";
 import { LinearGradient } from "expo-linear-gradient";


const AboutMe = () => {
    return (
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
            אני עושה לק ג'ל עם מניקור בתשומת לב מירבית - אשמח לקבל אתכן ולעזור
            לשמור על הציפורניים שלכן יפות ומטופחות לאורך זמן.
          </Text>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
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

export default AboutMe;