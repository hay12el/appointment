import React, { useEffect, useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import client from "../api/client";
import Queue from "../utils/Queue";
import { UserContext } from "../contexts/userContexts";
import { API, ADMIN_ID } from "@env";
import NavBar from "../utils/NavBar";
import { Overlay } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Admin_pannel({ navigation }) {
  const { user, Logout } = useContext(UserContext);
  const [thinking, setThinking] = useState(false);
  const [indicator, setIndicator] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [Success, setSuccess] = useState(false);
  const [catchH, setCatchH] = useState([]);
  const [choousenHour, setChoosenHour] = useState(0);
  const [hours, setHours] = useState([
    { hour: 9, key: "1", iscatched: false, user: {}},
    { hour: 10, key: "2", iscatched: false, user: {}},
    { hour: 11, key: "3", iscatched: false, user: {}},
    { hour: 12, key: "4", iscatched: false, user: {}},
    { hour: 13, key: "11", iscatched: false, user: {}},
    { hour: 14, key: "12", iscatched: false, user: {}},
    { hour: 15, key: "5", iscatched: false, user: {}},
    { hour: 16, key: "6", iscatched: false, user: {}},
    { hour: 17, key: "7", iscatched: false, user: {}},
    { hour: 18, key: "8", iscatched: false, user: {}},
    { hour: 19, key: "9", iscatched: false, user: {}},
    { hour: 20, key: "10", iscatched: false, user: {}},
  ]);
  
  const onDateChange = async (date) => {
    const a = new Date(date);
    setSelectedDate(a);
  };

  useEffect(async () => {
    setThinking(true);
    await client
      .post(
        "/events/AdminGetDayQueues",
        { date: selectedDate, user: user.id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setThinking(false);
        setCatchH(response.data.events);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectedDate, indicator]);

  const toggleOverlay = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 3300);
  };

  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        height: "100%",
      }}
    >
      <StatusBar style="dark" />
      <Overlay isVisible={Success} onBackdropPress={toggleOverlay}>
        <View
          style={styles.overlay}
        >
          <Image
            source={require("../assets/success.gif")}
            style={{ height: 150, width: 150 }}
          />
          <Text style={{ fontSize: 15 }}>התור נקבע בהצלחה!</Text>
        </View>
      </Overlay>

      <View style={styles.container}>
        <CalendarPicker
          startFromMonday={false}
          weekdays={["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"]}
          todayBackgroundColor={"#FFC7C7"}
          selectedDayColor={"#ffebeb"}
          months={[
            "ינואר",
            "פברואר",
            "מרץ",
            "אפריל",
            "מאי",
            "יוני",
            "יולי",
            "אוגוסט",
            "ספטמבר",
            "אוקטובר",
            "נובמבר",
            "דצמבר",
          ]}
          onDateChange={onDateChange}
          previousTitle="הקודם"
          nextTitle="הבא"
        />
        <View style={styles.FLcontainer}>
          {selectedDate.getDay() != 5 && selectedDate.getDay() != 6 ? (
            <FlatList
              data={hours}
              renderItem={({ item }) => {
                //check if hour is catched
                let flag = false;
                let user = {};
                let pId = "";
                let rightHour = item.hour + 3;
                for (let x in catchH) {
                  if (catchH[x].hour == rightHour) {
                    flag = true;
                    user = catchH[x].user[0];
                    pId = catchH[x].postId;
                  }
                }
                if (flag) {
                  item.color = "#FFD9D9";
                  item.iscatched = true;
                  item.user = user;
                  item.postId = pId;
                } else {
                  item.color = "#d3ffa3";
                  item.iscatched = false;
                  item.user = {};
                  item.postId = "";
                }
                return <Queue 
                item={item} 
                selectedDate={selectedDate} 
                setThinking={setThinking}
                setCatchH={setCatchH}
                setIndicator={setIndicator}
                indicator={indicator} />;
              }}
            />
          ) : (
            <View
              style={{
                height: 90,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 22 }}>אין תורים ביום הזה</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.menuNavigator}>
        <NavBar />
      </View>
      <ActivityIndicator
        style={styles.loading}
        size="large"
        color="#0000ff"
        animating={thinking}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  FLcontainer: {
    marginBottom: 3,
    elevation: 4,
    backgroundColor: "white",
    height: "45%",
    width: "99%",
    borderRadius: 5,
    borderWidth: 4,
    borderColor: "#f5f5f5",
  },
  container: {
    paddingTop: 30,
    backgroundColor: "#fff",
    alignItems: "center",
    height:"100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: "#0000ff",
  },
  loading: {
    position: "absolute",
    height: 30,
    width: 78,
    left: "50%",
    top: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    height: 250,
    display: "flex",
    flexDirection: "column",
    width: 250,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e5e5e8",
  },
});
