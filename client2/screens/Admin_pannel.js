import React, { useEffect, useState, useContext, useRef } from 'react';
import { StyleSheet, View ,Button, Pressable, FlatList, TouchableOpacity, Linking, Image ,Modal, Text, ActivityIndicator, Alert} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import client from '../api/client';
import { Ionicons, Entypo, MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';
import { UserContext } from '../contexts/userContexts';
import {API, ADMIN_ID} from '@env';
import { Overlay } from 'react-native-elements';
import AsyncStorage from "@react-native-async-storage/async-storage";

const days = {  0: "ראשון",
                1: "שני", 
                2:"שלישי", 
                3: "רביעי",
                4: "חמישי", 
                5: "שישי", 
                6: "שבת"
            };


export default function Admin_pannel({navigation}) {
    const {user, Logout} = useContext(UserContext);
    const [thinking, setThinking] = useState(false);
    const [indicator, setIndicator] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [Success, setSuccess] = useState(false);
    const [massage, setMassage] = useState(false);
    const [catchH, setCatchH] = useState([]);
    const [choousenHour, setChoosenHour] = useState(0)
    const [hours, setHours] = useState([
        { hour:9, key: '1', iscatched: false, user: {}},
        { hour:10, key: '2', iscatched: false, user: {}},
        { hour:11, key: '3', iscatched: false, user: {}},
        { hour:12, key: '4', iscatched: false, user: {}},
        { hour:13, key: '11', iscatched: false, user: {}},
        { hour:14, key: '12', iscatched: false, user: {}},
        { hour:15, key: '5', iscatched: false, user: {}},
        { hour:16, key: '6', iscatched: false, user: {}},
        { hour:17, key: '7', iscatched: false, user: {}},
        { hour:18, key: '8', iscatched: false, user: {}},
        { hour:19, key: '9', iscatched: false, user: {}},
        { hour:20, key: '10', iscatched: false, user: {}}
        
    ]);

    const addQueue = async () => {
        setThinking(true);
        console.log(ADMIN_ID);
        console.log(choousenHour);
        await client.post('/events/addQueue', {'user': user, 'time': selectedDate, 'hour': choousenHour, 'admin': ADMIN_ID} , {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            setThinking(false);
            setMassage(false);
            toggleOverlay();
            setIndicator(!indicator);
        }).catch((err) => {
            console.log(err);
        })
    }
    
    const onDateChange = async (date) => {
        const a = new Date(date);
        setSelectedDate(a); 
    }

    useEffect(async () => {
        setThinking(true);
        await client.post('/events/AdminGetDayQueues', {"date" : selectedDate}, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            setThinking(false);
            setCatchH(response.data.events);
        }).catch((err) => {
            console.log(err);
        })
    }, [selectedDate, indicator])

    const toggleOverlay = () => {
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
        }, 3300)
    };

    const toggleopen = () => {
        setCHeight(200)
    } 

    const changePhone = (p) => {
        if(p[0] == "0"){
            return ("+972"+p.slice(1));
        }else{
            return p;
        }
    }

    const Queue = ({item}) => {
        
        const deleteQueue = async (userid, postid, selectedDate) =>{
            await client.post("/events/AdminDeleteQueue", {'userid' : userid, 'postid': postid, 'date': selectedDate}, 
            { headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) =>{
                setCatchH(response.data.events);
                setIndicator(!indicator);
            })
            .catch((err) => {
                console.log(err);
            })
        }

        const catchQueue = async (userid, selectedDate, hour) =>{
            await client.post("/events/AdminCatchQueue", {'userid' : userid,'date': selectedDate, 'hour': hour}, 
            { 
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) =>{
                setCatchH(response.data.events);
                setIndicator(!indicator);
            })
            .catch((err) => {
                console.log(err);
            })
        }

        const showAlert = () => {
            Alert.alert('ביטול תור', 
                        `האם את בטוחה שאת רוצה לבטל את התור? (אל תשכחי לעדכן את ${item.user.username})`,
                        [{text:'לא'},
                        {text:'כן', onPress: ()=> deleteQueue(item.user._id, item.postId, selectedDate)}])
            }
        let theTime = new Date(item.time)
        return (
            <View> 
                {item.iscatched ? 
                            
                <View style={{height: 180, display: "flex", flexDirection: 'column', alignItems: 'center',justifyContent:"space-between"
                                , elevation : 8, backgroundColor: "white" ,shadowOpacity: 3,borderRadius: 20, marginHorizontal: 20, marginVertical: 5}} >
                    <View style={{ marginTop: 30,display: 'flex', flexDirection: 'row', alignContent: 'flex-start',justifyContent:"center"}}>
                        <Text style={{textAlign: 'right',fontSize: 18}}>
                                יום {days[selectedDate.getDay()]} {selectedDate.getDate()}/{selectedDate.getMonth() + 1}
                        </Text>
                        <Text> </Text>
                        <Text style={{textAlign: 'right',fontSize: 18}}>
                            בשעה {item.hour}:00 
                        </Text>
                    </View>
                            
                    <View style={{width: "95%",display: "flex", flexDirection:"column", justifyContent:"center", alignItems:"center", margin: 8,backgroundColor:"#f5f5f5", borderRadius:10, paddingBottom: 10}}>  
                                    
                        <View style={{marginBottom: 18}}>
                                        
                            <Text style={{fontSize:16}}>התור של {item.user.username}</Text> 
                                        
                        </View>

                        <View style={{display: "flex" ,flexDirection:"row", alignContent: "center",justifyContent:"center"}}> 
                                        
                            <Pressable style={styles.buttonCancle} onPress={() => showAlert()} >
                                <Text style={{fontSize: 14}}>ביטול התור</Text>
                            </Pressable>

                            <TouchableOpacity onPress={() => {Linking.openURL(`tel:${item.user.phone}`)}}>
                                            
                                <Feather name="phone-forwarded" size={37} color="black" style={{marginHorizontal: 15}}/>
                                        
                            </TouchableOpacity>
                    
                            <TouchableOpacity onPress={() => Linking.openURL(`https://wa.me/${changePhone(item.user.phone)}`)}>
                                <FontAwesome name="whatsapp" size={40} color="black" style={{marginLeft: 20}}/>
                            </TouchableOpacity>

                        </View>

                    </View>
                </View>
                : 
                <View style={{height: 110, display: "flex", flexDirection: 'column', alignItems: 'center',justifyContent:"space-between", 
                                elevation : 8, backgroundColor: "white" ,shadowOpacity: 3,borderRadius: 20, padding: 3, paddingBottom:10,marginHorizontal: 20, marginVertical: 5, }}>
                    
                        <View style={{ marginTop: 10,display: 'flex', flexDirection: 'row', alignContent: 'flex-start',justifyContent:"center"}}>
                            
                            <Text style={{textAlign: 'right',fontSize: 18}}>
                                יום {days[selectedDate.getDay()]} {selectedDate.getDate()}/{selectedDate.getMonth() + 1}
                            </Text>

                            <Text> </Text>

                            <Text style={{textAlign: 'right',fontSize: 18}}>
                                בשעה {item.hour}:00 
                            </Text>

                        </View>
                        <View>
                            <Pressable style={[styles.button, styles.buttonOpen]} onPress={() => catchQueue(user.id, selectedDate, item.hour)} >
                            
                                <Text style={{fontSize: 14}}>ביטול התור</Text>
                            </Pressable>
                        </View>
                    
                </View>
                                
            }

        </View>
    )
}

    const logout = async () => {
          try {
              await AsyncStorage.removeItem('token');
              Logout();
              navigation.navigate('Login');
          } catch (e) {
              console.log(e);
          }
    }
        const showAlertSignOut = () => {
        Alert.alert('התנתקות', 
                    'האם את בטוחה שאת רוצה להתנתק?',
                    [{text:'כן', onPress: ()=> logout()},
                    {text:'ביטול'}])
    }

    return (
        <View style={{display: 'flex',justifyContent: 'center', alignContent: 'center', height: "100%"}}>
                
                <Overlay isVisible={Success} onBackdropPress={toggleOverlay}>
                    <View style={{height: 250,display: "flex", flexDirection:"column", width: 250, borderRadius:15,justifyContent:"center", alignItems:"center", backgroundColor:"#e5e5e8"}}>
                        <Image
                            source={require('../assets/success.gif')}
                            style={{height: 150,width:150}}
                        />
                        <Text style={{fontSize:15}}>התור נקבע בהצלחה!</Text>
                    </View>
                </Overlay>

                <View style={styles.container}>
                    <Modal            
                        animationType = {"slide"}  
                        transparent = {true}  
                        visible = {massage}  
                        onRequestClose = {() =>{ console.log("Modal has been closed.") } }>  

                        {/*All views of Modal*/}  
                        <View style = {styles.modal}>  
                            <Text style = {styles.text}>לקבוע לך תור לתאריך {selectedDate.getUTCDate()}/{selectedDate.getMonth() + 1} בשעה {choousenHour}:00 ?</Text>  
                            <View style={styles.buttons}>

                                    <Pressable
                                        style={[styles.button, styles.buttonOpen]}
                                        onPress={() => setMassage(!massage)}
                                        >
                                        <Text style={styles.textStyle}>ביטול</Text>
                                    </Pressable>
                                        
                                    <Pressable
                                        style={[styles.button, styles.buttonOpen]}
                                        onPress={() => addQueue()}
                                        >
                                        <Text style={styles.textStyle}>כן אני אשמח :)</Text>
                                    </Pressable>
                                    
                            </View>
                        </View>  
                    </Modal>  

                    
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
                    <View style={styles.FLcontainer}>
                        <FlatList 
                            
                            data={hours}
                            renderItem={({item}) => {
                                //check if hour is catched
                                let flag = false;
                                let user = {};
                                let pId = "";
                                //console.log(item);
                                for(let x in catchH){
                                    if(catchH[x].hour == item.hour){
                                        flag = true;
                                        user = catchH[x].user[0];
                                        pId = catchH[x].postId;
                                    }
                                }
                                if(flag){
                                        item.color = '#FFD9D9';
                                        item.iscatched= true;
                                        item.user = user;
                                        item.postId = pId;
                                    }else{
                                        item.color = '#d3ffa3';
                                        item.iscatched= false;
                                        item.user = {};
                                        item.postId = "";
                                    }
                                    return <Queue item={item}/>
                                    
                            }}
                            
                        />
                        
                        
                        
                            



                    </View>
                </View>
                <View style={{display: 'flex',justifyContent: 'center', alignContent: 'center', position: "relative", width: "100%",backgroundColor:"white"}}>        
                    <View style={{display: 'flex', alignItems: 'center',marginBottom:25}}>
                        <View style={ styles.menuNavigator }>
    
                            
                              
                            <TouchableOpacity onPress={() => navigation.navigate("Welcome_admin") } >
                                <Ionicons name="home-outline" size={30} color="#364F6B" />
                            </TouchableOpacity>
                            
    
                            <TouchableOpacity onPress={() => navigation.navigate("Admin_pannel")} style={{marginRight:10}}>
                                <MaterialIcons name="playlist-add-check" size={35} color="#364F6B" />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => showAlertSignOut()}>
                                <Entypo name="log-out" size={29} color="#364F6B" />
                            </TouchableOpacity>
    
                        </View>
                    </View>
                </View>
                <ActivityIndicator
                    style={styles.loading}
                    size="large" 
                    color="#0000ff"
                    animating={thinking}
                />
            </View>
                
           

    )
}

const styles = StyleSheet.create({
    menuNavigator: {
        display: 'flex',
        flexDirection: 'row', 
        justifyContent:'space-between', 
        alignItems:'center', 
        backgroundColor: '#FFC7C7', 
        width: '95%',height:70,
        borderRadius:15,   
        elevation: 2,
        paddingHorizontal: 22
    },
    FLcontainer: {
        paddingBottom:"10%",
        height:'45%', 
        width: '97%', 
        borderRadius:5,
    },
    button: {
        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
        backgroundColor: '#FFE2E2',
        borderRadius: 15,
        padding: 4,
        width: 140,
        alignItems:'center',
        justifyContent: "center",  
        elevation: 8,
        marginVertical:24,
        height: 30,    
    },
    touchi: {
        shadowColor: '#000',
        shadowOffset: { width: 9, height: 9 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5, 
        backgroundColor:'#a3c6ff', 
        position:'relative', 
        top: 30, left: '40%', 
        height:65,
        width:65,
        borderRadius:100,
        alignItems:'center',
        justifyContent:'center'
    },
    sectionBox: {
        borderWidth: 1,
        borderRadius:10,
        justifyContent:'center',
        height:60,
        marginLeft: 3,
        marginRight: 3,
        marginVertical: 2
    },
  container: {
        paddingTop: 0,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderColor: '#0000ff'
  },
  loading: {
        position: 'absolute',
        height:30,
        width:78,
        left: "50%",
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
  buttonCancle: {
    borderRadius: 20,
    padding: 10,
    width: 110,
    alignItems:'center',  
    elevation: 8,
    marginHorizontal:7,
    backgroundColor:"#fff7f7",
    height: 40
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
  modal: {  
        elevation: 30,
        justifyContent: 'center',  
        alignContent: 'center',
        alignItems: 'center',   
        backgroundColor : "#f8f8f8",   
        height: 200 ,  
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
        marginTop: '50%',  
        marginLeft: 40,  
   },  
   text: {  
      color: '#3f2949',  
      fontSize: 20,
      marginTop: 10  
   },  
   buttons: {
       height: 50,
       backgroundColor: '#f1f1f1',
       alignItems: 'center',
       justifyContent: 'center',
       marginTop: 85,
       width: "100%",
       display: 'flex',
       flexDirection: 'row'
   }
});