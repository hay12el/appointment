import React, { useContext, useState } from "react";
import { Overlay } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";

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

const WorkScroll = () => {
  return (
    <>
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
      <View style={styles.FLView}>
        <FlatList
          data={SECTIONS}
          renderItem={({ item }) => <ListItem item={item} />}
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          horizontal
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
});

export default WorkScroll;
