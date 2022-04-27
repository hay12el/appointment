import React, { useEffect, useState, useContext } from 'react';
import { Image, StyleSheet, View ,Button, Pressable, FlatList, TouchableOpacity, Linking,Alert, ActivityIndicator, Modal, Text} from 'react-native';
import Calendar from './newQueue';
import { Entypo, MaterialIcons, FontAwesome5, Ionicons, FontAwesome } from '@expo/vector-icons';
import client from '../api/client';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from '../contexts/userContexts';
import { StyledContainer } from './../components/styles'
import {LinearGradient} from 'expo-linear-gradient';
import {API, ADMIN_ID} from '@env';

const days = {  0: "ראשון",
                1: "שני", 
                2:"שלישי", 
                3: "רביעי",
                4: "חמישי", 
                5: "שישי", 
                6: "שבת"
            };
            
            
export default function MyQueues({navigation}) {
    const [queues, setQueues] = useState({});
    const {user, Logout} = useContext(UserContext);
    const [thinking, setThinking] = useState(false);

    // 
    const Queue = ({item}) => {
        const showAlert = () => {
            Alert.alert('ביטול תור', 
                        'האם את בטוחה שאת רוצה לבטל את התור?',
                        [{text:'לא'},
                        {text:'כן', onPress: ()=> deleteQueue(item._id)}])
        }
        let theTime = new Date(item.time)
        return (

            <View style={{height: 140, display: "flex", flexDirection: 'column', alignItems: 'center',justifyContent:"space-between", 
            shadowOffset: {
              width: 2,
              height: 2
            }
            ,shadowColor: "black", elevation : 5, backgroundColor: "white" ,shadowOpacity: 3,borderRadius: 20, padding: 3, marginHorizontal: 27, marginTop: 40, marginBottom: 20 }}>
                <View style={{position: "absolute", height:50, width: 50,borderRadius:100, borderWidth: 1, justifyContent: 'center', alignItems: "center",top:-25,backgroundColor: 'white',elevation : 5}}>
                    <FontAwesome name="calendar" size={27} color="black" />
                </View>
                <View style={{ marginTop: 30,display: 'flex', flexDirection: 'row', alignContent: 'flex-start',justifyContent:"center"}}>
                    <Text style={{textAlign: 'right',fontSize: 15}}>
                        יום {days[theTime.getDay()]} {theTime.getDate()}/{theTime.getMonth() + 1} 
                    </Text>
                    <Text> </Text>
                    <Text style={{textAlign: 'right',fontSize: 15}}>
                        בשעה {theTime.getUTCHours()}:00 
                    </Text>
                </View>
                <View>
                    <Pressable style={[styles.button, styles.buttonOpen]} onPress={() => showAlert()} >
                        <Text style={{fontSize: 14}}>ביטול התור</Text>
                    </Pressable>
                </View>
            </View>
            )
        }
                
    useEffect(async () => {
        setThinking(true);
        await client.post('/events/getMyQueue', {"user" : user}, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
                setQueues(response.data);
                setThinking(false);
            }).catch((err) => {
                console.log(err);
            })
    }, [])

    const deleteQueue = async (id) =>{
        await client.post("/events/deleteQueue", {'user' : user, 'id': id}, 
        { headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) =>{
            setQueues(response.data)
        })
        .catch((err) => {
            console.log(err);
        })
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


    // Sign Out Alert
    const showAlertSignOut = () => {
                    console.log(API);
                        Alert.alert('התנתקות', 
                                    'האם את בטוחה שאת רוצה להתנתק?',
                                    [{text:'כן', onPress: ()=> logout()},
                                    {text:'ביטול'}])
                    }

    return (
        <StyledContainer >
            <View style={{height: 180, display: "flex",justifyContent:"center", alignItems:"center",borderBottomLeftRadius:25, borderBottomRightRadius:25 ,backgroundColor:"#FFC7C7"}}>
                <Image source={require('../assets/2.png')} style={{height:80, width:70}}></Image>
                <Text style={{fontSize:30, color: "#364F6B"}}>התורים שלך:</Text>
            </View>


            <View style={{height: "67%", borderRadius: 50, position: "relative"}}>
                <FlatList
                    data={queues}
                    renderItem={({ item }) => <Queue item={item} />}
                    keyExtractor={item => item._id}              
                />
            </View>
            



            {/* Navigation Bar */}
            <View style={{display: 'flex',justifyContent: 'center', alignContent: 'center', position: "absolute", bottom: 32,right: 0, width: "100%"}}>        
                <View style={{display: 'flex', alignItems: 'center'}}>
                    <View style={ styles.menuNavigator }>

                        <TouchableOpacity onPress={() => navigation.navigate("Welcome")}>
                            <Ionicons name="home-outline" size={30} color="#364F6B" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate("MyQueues")} style={{height:50, width:50, backgroundColor:"#ffbaba", borderRadius:100, elevation:5, justifyContent: "center", alignItems: "center"}}>
                            <MaterialIcons name="playlist-add-check" size={35} color="#364F6B" />
                        </TouchableOpacity>

                        {/* Calendar model */}
                        <View style={{position: 'absolute', right: "53%", bottom: 65}}>
                            <Calendar/>
                        </View>
                        {/* Calendar model */}
                        
                        <TouchableOpacity onPress={() => Linking.openURL('https://ul.waze.com/ul?ll=31.24937992%2C34.78982806&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location')}>
                            <FontAwesome5 name="waze" size={29} color="#364F6B" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => showAlertSignOut()}>
                            <Entypo name="log-out" size={29} color="#364F6B" />
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
            {/* Navigation Bar */}

        </StyledContainer>
    )
}

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
        
        backgroundColor: "white",
        display: "flex",
        flexDirection: 'row',
        justifyContent:'space-around',
        alignItems: 'center',
        height:90,
        marginLeft: 3,
        marginRight: 3,
        marginVertical: 2
    },
    menuNavigator: {
        display: 'flex',
        flexDirection: 'row', 
        justifyContent:'space-between', 
        alignItems:'center', 
        backgroundColor: '#FFC7C7', 
        width: '95%',height:70,
        borderRadius:15,   
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
        paddingHorizontal: 22
    },
    queues: {     
        borderWidth: 1,
        borderColor: "black",
        backgroundColor: "white",
        borderRadius:10,
        display: "flex",
        flexDirection: 'row',
        justifyContent:'space-around',
        alignItems: 'center',
        height:90,
        marginLeft: 3,
        marginRight: 3,
        marginVertical: 2
    },
    button: {
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