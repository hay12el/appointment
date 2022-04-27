import React, { useEffect, useState, useContext, useRef } from 'react';
import { StyleSheet, View ,Button, Pressable, FlatList, TouchableOpacity, Image ,Modal, Text, ActivityIndicator} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import client from '../api/client';
import { FontAwesome } from '@expo/vector-icons';
import { UserContext } from '../contexts/userContexts';
import {API, ADMIN_ID} from '@env';
import { Overlay } from 'react-native-elements';

const days = {  0: "ראשון",
                1: "שני", 
                2:"שלישי", 
                3: "רביעי",
                4: "חמישי", 
                5: "שישי", 
                6: "שבת"
            };

export default function Calendar(navigation) {
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

    const addQueue = async () => {
        setThinking(true);
        await client.post('/events/addQueue', {'user': user, 'time': selectedDate, 'hour': choousenHour, 'admin': ADMIN_ID} , {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            if(!(typeof(response.data) == "string")){
                setThinking(false);
                setMassage(false);
                toggleOverlay();
                setIndicator(!indicator);
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

    useEffect(async () => {
        setThinking(true);
        await client.post('/events/getDayQueues', {"date" : selectedDate}, {
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

    const ErrortoggleOverlay = () => {
        setError(true);
        setTimeout(() => {
            setError(false);
        }, 5000)
    };

    return (
        <View style={{display: 'flex',justifyContent: "center", alignContent: 'center'}}>

            <TouchableOpacity activeOpacity={0.1} onPress={()=> visi()} style={ styles.touchi }>
                <FontAwesome name="plus" size={32} color="white" />
            </TouchableOpacity>

            <Modal 
                visible={toApear} 
                animationType="slide" 
                onRequestClose={() => visi() }
                
                >
                
                <Overlay isVisible={Success} onBackdropPress={toggleOverlay}>
                    <View style={{height: 250,display: "flex", flexDirection:"column", width: 250, borderRadius:15,justifyContent:"center", alignItems:"center", backgroundColor:"#e5e5e8"}}>
                        <Image
                            source={require('../assets/success.gif')}
                            style={{height: 150,width:150}}
                        />
                        <Text style={{fontSize:15}}>התור נקבע בהצלחה!</Text>
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
                    <View style={{height: 80,width:"100%" ,backgroundColor:"white",justifyContent: "center", alignContent: 'center',display: "flex",flexDirection:"column", borderBottomRightRadius: 30,borderBottomLeftRadius: 30,elevation:3,marginTop:0}}>
                        <Text style={{textAlign: 'center', fontSize: 30}}>
                            יום {days[selectedDate.getDay()]}
                        </Text>
                        <Text style={{textAlign: 'center', fontSize: 17}}>
                            {selectedDate.getDate()}/{selectedDate.getMonth() + 1}/{selectedDate.getFullYear()}
                        </Text>
                    </View>
                    <View style={styles.FLcontainer}>
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
                        <ActivityIndicator
                            style={styles.loading}
                            size="large" 
                            color="#0000ff"
                            animating={thinking}
                        />
                        
                    </View>
                        
                </View>
                <TouchableOpacity activeOpacity={0.1} onPress={()=> visi(!visible)} style={ styles.touchiArrow}>
                    <FontAwesome name="arrow-down" size={30} color="white" />
                </TouchableOpacity>
                
            </Modal>
        </View>

    )
}

const styles = StyleSheet.create({
    FLcontainer: {
        borderRadius:16,
        height:114, 
        width: '97%', 
        borderRadius:5,
        elevation:10,
        backgroundColor: 'white',
        paddingBottom:1,
        marginTop:15
    },
    touchi: {
        elevation: 5, 
        backgroundColor:'#8785A2', 
        position:'relative', 
        top: 30, left: '43%', 
        height:65,
        width:65,
        borderRadius:100,
        alignItems:'center',
        justifyContent:'center'
    },
    touchiArrow: {
        elevation: 5, 
        backgroundColor:'#8785A2', 
        position:'absolute', 
        bottom: 22, left: '43%', 
        height:65,
        width:65,
        borderRadius:100,
        alignItems:'center',
        justifyContent:'center'
    },
    sectionBox: {
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
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderColor: '#0000ff'
  },
  loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
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
        marginTop: '50%',  
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