import React, { useEffect, useState, useContext, useRef } from 'react';
import * as Device from 'expo-device';
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View ,ScrollView, Pressable, FlatList, TouchableOpacity, Image ,Modal, Text, ActivityIndicator, Platform} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import client from '../api/client';
import { FontAwesome } from '@expo/vector-icons';
import { UserContext } from '../contexts/userContexts';
import {API, ADMIN_ID} from '@env';
import { Overlay } from 'react-native-elements';
import {LinearGradient} from 'expo-linear-gradient';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import storage from "@react-native-async-storage/async-storage"

const days = {  0: "ראשון",
                1: "שני", 
                2:"שלישי", 
                3: "רביעי",
                4: "חמישי", 
                5: "שישי", 
                6: "שבת"
            };

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
});

export default function Calendar(navigation) {
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const [expoPushToken, setExpoPushToken] = useState('');

    const [thinking, setThinking] = useState(false);
    const [indicator, setIndicator] = useState(false);
    const [toApear, SetApearence] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const {user} = useContext(UserContext);
    const [Success, setSuccess] = useState(false);
    const [Error, setError] = useState(false);
    const [visible, setVisible] = useState(false);
    const [massage, setMassage] = useState(false);
    const [catchH, setCatchH] = useState([]);
    const [choousenHour, setChoosenHour] = useState(0)
    const [hours, setHours] = useState([
        { hour:9, key: '1', color:'#d3ffa3', iscatched: false},
        { hour:10, key: '2', color:'#d3ffa3', iscatched: false},
        { hour:11, key: '3', color:'#d3ffa3', iscatched: false},
        { hour:12, key: '4', color:'#d3ffa3', iscatched: false},
        { hour:13, key: '11', color:'#d3ffa3', iscatched: false},
        { hour:14, key: '12', color:'#d3ffa3', iscatched: false},
        { hour:15, key: '5', color:'#d3ffa3', iscatched: false},
        { hour:16, key: '6', color:'#d3ffa3', iscatched: false},
        { hour:17, key: '7', color:'#d3ffa3', iscatched: false},
        { hour:18, key: '8', color:'#d3ffa3', iscatched: false},
        { hour:19, key: '9', color:'#d3ffa3', iscatched: false},
        { hour:20, key: '10', color:'#d3ffa3', iscatched: false}
        
    ]);

    async function schedulePushNotification(ddate, hhour) {

        var dateObj = new Date(ddate);
        var month = dateObj.getUTCMonth(); //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        const trigger = new Date(year,month,day-1 ,12);
        await Notifications.scheduleNotificationAsync({
            content: {
            title: "נעמה מניקור 💅🏼",
            body: ` קיים תור אצלי מחר בשעה ${hhour+3}:00`,
            data: { data: 'goes here' },
            },
            trigger,
        });
    }

    const addQueue = async () => {
        setThinking(true);
        await client.post('/events/addQueue', {'user': user, 'time': selectedDate, 'hour': choousenHour, 'admin': ADMIN_ID} , {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(async (response) => {
            if(!(typeof(response.data) == "string")){
                setThinking(false);
                setMassage(false);
                toggleOverlay();
                setIndicator(!indicator);
                await schedulePushNotification(selectedDate, choousenHour);
            }else{
                ErrortoggleOverlay();
                setThinking(false);
                setMassage(false);
                setIndicator(!indicator);
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    
    function visi(){
        SetApearence(!toApear);
    };
    
    const onDateChange = async (date) => {
        const a = new Date(date);
        setSelectedDate(a); 
    }

    // get permission to sent notifications.
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        }
        if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        });
    }

    return token;
    }

    useEffect(async () => {

        // chaeck if it's friday or saturday
        let x = selectedDate;
        if(x.getDay() == 6 || x.getDay() == 5)
        {
            setThinking(false);
            setCatchH([9,10,11,12,13,14,15,16,17,18,19,20]);
        }
        else{
            setThinking(true);
            await client.post('/events/getDayQueues', {"date" : selectedDate,"admin": user.myAdmin}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                setThinking(false);
                setCatchH(response.data.events);
            }).catch((err) => {
                console.log(err);
            })
        }
    }, [selectedDate, indicator])

    const toggleOverlay = () => {
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            visi();
        }, 4200)
    };

    const ErrortoggleOverlay = () => {
        setError(true);
        setTimeout(() => {
            setError(false);
        }, 5000)
    };

   
    

    return (
        
        <View style={{display: 'flex',justifyContent: "center", alignContent: 'center'}}>
            <StatusBar style="dark" />

           

                
                {Platform.OS === "android"?  
                <TouchableOpacity activeOpacity={0.1} onPress={()=> visi()} style={ styles.touchi }>
                     <LinearGradient colors={['#aca9d1', '#9b97c4','#474659']} locations={[0.0, 0.5, 1.0]} style={styles.linearGradient} >

                        <FontAwesome name="plus" size={32} color="white" />
                    </LinearGradient>
                </TouchableOpacity>
                
                : 
                <TouchableOpacity activeOpacity={0.1} onPress={()=> visi()} style={ styles.touchiIOS }>
                     
                     <View style={styles.linearGradient}>
                        <FontAwesome name="plus" size={32} color="white" />
                     </View>
                    
                </TouchableOpacity>}
                
                
            

            <Modal 
                visible={toApear} 
                animationType="slide" 
                onRequestClose={() => visi() }
                transparent={true}
                >
                
                <Overlay isVisible={Success} onBackdropPress={toggleOverlay} overlayStyle={{padding:0}}>
                    <View style={{height: 300,display: "flex", flexDirection:"column", width: 300,justifyContent:"center", alignItems:"center", backgroundColor:"#e5e5e8"}}>
                        <Image
                            source={require('../assets/success.gif')}
                            style={{height: 270,width:270}}
                        />
                        <Text style={{fontSize:19}}>התור נקבע בהצלחה!</Text>
                    </View>
                </Overlay>

                <Overlay isVisible={Error} onBackdropPress={ErrortoggleOverlay}>
                    <View style={{height: 250,display: "flex", flexDirection:"column", width: 250, borderRadius:15,justifyContent:"center", alignItems:"center", backgroundColor:"white"}}>
                        <Image
                            source={require('../assets/alert.gif')}
                            style={{height: 150,width:150}}
                        />
                        <Text style={{fontSize:15}}>לא הצלחנו לקבוע תור</Text>
                        <Text style={{fontSize:15}}>שימי לב שצריך שבוע בין תור לתור</Text>
                    </View>
                </Overlay>
                <View
                        style={{
                        height: '80%',
                        marginTop: 'auto',
                        width:"100%",
                        
                        }}>
                <View style={styles.container}>
                    <Modal            
                        animationType = {"fade"}  
                        transparent = {true}  
                        visible = {massage}  
                        onRequestClose = {() =>{ console.log("Modal has been closed.") } }>  

                        {/*All views of Modal*/}  
                        <View style = {styles.modal}>  
                            <View style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: 30}}>
                                <Text style = {styles.text}>לקבוע לך תור לתאריך {selectedDate.getUTCDate()}/{selectedDate.getMonth() + 1} בשעה {choousenHour}:00 ?</Text>  
                            </View>
                            <View style={styles.buttons}>

                                    <Pressable
                                        onPress={() => setMassage(!massage)}
                                    >
                                        <LinearGradient colors={['#FFE2E2', '#fad4d4', '#e8b7b7']} locations={[0.0, 0.5, 1.0]} style={[styles.button, styles.buttonOpen]}>
                                            <Text style={styles.textStyle}>ביטול</Text>
                                        </LinearGradient>
                                    </Pressable>
                                        
                                    <Pressable
                                        onPress={() => addQueue()}
                                        >
                                        <LinearGradient colors={['#FFE2E2', '#fad4d4', '#e8b7b7']} locations={[0.0, 0.5, 1.0]} style={[styles.button, styles.buttonOpen]}>
                                            <Text style={styles.textStyle}>כן אני אשמח :)</Text>
                                        </LinearGradient>
                                    </Pressable>
                                    
                            </View>
                        </View>  
                    </Modal>  
                    

                    <ScrollView>

                    
                    <CalendarPicker
                        startFromMonday={false}
                        weekdays={
                            [
                                'ראשון', 
                                'שני', 
                                'שלישי', 
                                'רביעי', 
                                'חמישי', 
                                'שישי', 
                                'שבת'
                        ]}

                        minDate={new Date()}

                        todayBackgroundColor = {'#FFC7C7'}

                        selectedDayColor={"#ffebeb"}

                        months={[
                            'ינואר',
                            'פברואר',
                            'מרץ',
                            'אפריל',
                            'מאי',
                            'יוני',
                            'יולי',
                            'אוגוסט',
                            'ספטמבר',
                            'אוקטובר',
                            'נובמבר',
                            'דצמבר',
                        ]}
                        onDateChange={onDateChange}
                        previousTitle = 'הקודם'
                        nextTitle="הבא"
                    />
                    
                    <LinearGradient colors={[ 'white', 'white', '#faf7f7']} locations={[0.0, 0.4, 1.0]} style={{height: 80,width:"100%" ,backgroundColor:"white",justifyContent: "center", alignContent: 'center',display: "flex",flexDirection:"column", borderRadius: 30,marginTop:0}}>
                        <View></View>
                        <Text style={{textAlign: 'center', fontSize: 30}}>
                            יום {days[selectedDate.getDay()]}
                        </Text>

                        <Text style={{textAlign: 'center', fontSize: 17}}>
                            {selectedDate.getDate()}/{selectedDate.getMonth() + 1}/{selectedDate.getFullYear()}
                        </Text>
                    </LinearGradient>
                    
                    <View style={styles.FLcontainer}> 
                        {
                            selectedDate.getDay() != 5 && selectedDate.getDay() != 6 ?
                            <FlatList  
                                horizontal
                                data={hours}
                                renderItem={({item}) => {
                                    //check if hour is catched
                                    let flag = false;
                                    for(let x in catchH){
                                        if(catchH[x] == item.hour){
                                            flag = true;
                                        }
                                    }
                                    if(flag){
                                            item.color = 'white';
                                            item.iscatched= true;
                                            return <></>
                                        }else{
                                            item.color = 'white';
                                            item.iscatched= false;
                                            return  <TouchableOpacity onPress={() => {if(item.iscatched){console.log("catched " + item.hour)}else{setChoosenHour(item.hour); setMassage(!massage)}}}>
                                                        <View style={[ styles.sectionBox, {backgroundColor: 'white'}] }>
                                                            <FontAwesome name="calendar" size={27} color="#8785A2" />
                                                            <Text style={{textAlign: 'right', fontSize: 19}}> {item.hour}:00</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                        }
                                        
                                }}
                                
                            />

                            :
                            <View style={{height:90, justifyContent:"center", alignItems:"center"}}>
                                <Text style={{fontSize:22}}>אין תורים ביום הזה</Text>
                            </View>  
                        }
                    </View>
                        </ScrollView>
                </View>


                        <ActivityIndicator
                            style={styles.loading}
                            size="large" 
                            color="#0000ff"
                            animating={thinking}
                            />


                {Platform.OS === "android"?
                <TouchableOpacity activeOpacity={0.1} onPress={()=> visi(!visible)} style={ styles.touchiArrow}>
                    <LinearGradient colors={['#f0eded', '#fafafa', 'white']} locations={[0.0, 0.3, 1.0]} style={styles.linearGradient1} >
                        <FontAwesome name="arrow-down" size={30} color="#918fb3" />
                    </LinearGradient>
                </TouchableOpacity>
                :
                <TouchableOpacity activeOpacity={0.1} onPress={()=> visi(!visible)} style={ styles.touchiArrowIOS}>
                    <LinearGradient colors={['#e6e6e6', 'white', 'white']} locations={[0.0, 0.3, 1.0]} style={styles.linearGradient1} >
                        <FontAwesome name="arrow-down" size={30} color="#918fb3" />
                    </LinearGradient>
                </TouchableOpacity>
                
                }
                </View>
            </Modal>
        </View>

    )
}

const styles = StyleSheet.create({
    
    linearGradient: {
        elevation:4,
        margin:0,
        backgroundColor:"#9b97c4",
        borderRadius:100,
        height:65,
        width:65,
        display: "flex",
        justifyContent:"center", 
        alignItems:"center",  
    },
    linearGradient1: {
        height:65,
        width:"100%",
        borderRadius:30,
        display: "flex",
        justifyContent:"center", 
        alignItems:"center",
        
    },
    FLcontainer: {
        flex:1,
        width: '100%', 
        borderRadius:5,
        backgroundColor: 'white',
        paddingBottom:1,
        marginTop:15,
        
    },
    touchi: {
        borderRadius:100,
        position:'absolute', 
        backgroundColor:"white",
        top:-30, left:-40, 
        alignItems:'center',
        justifyContent:'center'
    },
    touchiIOS: {
        borderRadius:100,
        position:'absolute', 
        backgroundColor:"white",
        top:-3, left:-42, 
        alignItems:'center',
        justifyContent:'center'
    },
    touchiArrow: {
         
        position:'absolute', 
        bottom: 0, left: 0, 
        height:65,
        width:"100%",
        borderTopRightRadius:30,
        borderTopLeftRadius:30,
        alignItems:'center',
        justifyContent:'center'
    },
    touchiArrowIOS: {
         
        backgroundColor:'#8785A2', 
        position:'absolute', 
        bottom: 0, left: 0, 
        height:65,
        width:"100%",
        borderRadius:30,
        alignItems:'center',
        justifyContent:'center'
    },
    sectionBox: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        display: 'flex',
        flexDirection: 'column',
        padding: 20,
        width:100,
        // borderWidth: 1,
        borderRadius:10,
        alignItems: 'center',
        justifyContent:'space-evenly',
        height:100,
        marginHorizontal: 9,
        marginVertical: 6,
        elevation: 4,
    },
  container: {
        // margin: 15,
        backgroundColor: "black",
        paddingTop: 0,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderColor: '#0000ff'
  },
  loading: {
        position: 'absolute',
        height:30,
        width:78,
        left: "40%",
        top: "50%",
        alignItems: 'center',
        justifyContent: 'center'
  },
  button: {
    borderRadius: 20,
    padding: 10,
    width: 110,
    alignItems:'center',  
    elevation: 8,
    marginHorizontal:24,
    height: 40
  },
  buttonOpen: {
    backgroundColor: "#FFf6f6",
  },
  modal: {  
        elevation: 30,
        justifyContent: "space-between",  
        alignContent: 'center',
        alignItems: 'center',   
        backgroundColor : "#f8f8f8",   
        height: 150 ,  
        width: '80%',  
        borderRadius:10,  
        borderWidth: 1,  
        borderColor: '#fff', 
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        marginTop: '80%',  
        marginLeft: 40,  
   },  
   text: {  
      color: '#3f2949',  
      fontSize: 16,
      marginTop: 10  
   },
   textStyle:{
       fontSize: 13,
   },
   buttons: {
       direction:'rtl',
       height: 55,
       borderBottomLeftRadius:10, 
       borderBottomRightRadius:10,
       backgroundColor: '#f1f1f1',
       alignItems: 'center',
       justifyContent: 'center',
       width: "100%",
       display: 'flex',
       flexDirection: 'row',
       bottom: 0
   }
});