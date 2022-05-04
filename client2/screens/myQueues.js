import React, { useEffect, useState, useContext } from 'react';
import { Image, StyleSheet, View ,Button, Pressable, FlatList, TouchableOpacity, Linking,Alert, ActivityIndicator, Modal, Text, Platform} from 'react-native';
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
                    <Text style={{textAlign: 'right',fontSize: 16}}>
                        יום {days[theTime.getDay()]} {theTime.getDate()}/{theTime.getMonth() + 1} 
                    </Text>
                    <Text> </Text>
                    <Text style={{textAlign: 'right',fontSize: 16}}>
                        בשעה {theTime.getUTCHours()}:00 
                    </Text>
                </View>
                
                <Pressable  onPress={() => showAlert()} >
                    <LinearGradient colors={['#FFE2E2', '#fad4d4', '#e8b7b7']} locations={[0.0, 0.5, 1.0]} style={[styles.button]}>
                            <Text style={{fontSize: 14}}>ביטול התור</Text>
                    </LinearGradient>
                </Pressable>
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
            {Platform.OS ==="android"?
                <LinearGradient colors={['#ffc7c7', '#ffc7c7', '#fa9393']} locations={[0.0, 0.5, 1.0]} style={styles.linearGradient}>
                    <Image source={require('../assets/2.png')} style={{height:80, width:70}}></Image>
                    <Text style={{fontSize:30, color: "#364F6B"}}>התורים שלך:</Text>
                </LinearGradient>
                :
                <LinearGradient colors={['#ffc7c7', '#ffc7c7', '#fa9393']} locations={[0.0, 0.5, 1.0]} style={styles.linearGradientIOS}>
                    <Image source={require('../assets/2.png')} style={{height:80, width:70}}></Image>
                    <Text style={{fontSize:30, color: "#364F6B"}}>התורים שלך:</Text>
                </LinearGradient>
            }


            <View style={{height: "67%", borderRadius: 50, position: "relative"}}>
                {Object.keys(queues).length === 0?
                <View style={{marginTop:"50%"}}>
                    <Text style={{textAlign:'center', fontSize:40}}>
                       אין תורים עתידיים
                    </Text>
                </View>

                :

                <FlatList
                    data={queues}
                    renderItem={({ item }) => <Queue item={item} />}
                    keyExtractor={item => item._id}              
                />
                }
            </View>
            



            {/* Navigation Bar */}
            <View style={{display: 'flex',justifyContent: 'center', alignContent: 'center', position: "absolute", bottom: 32,right: 0, width: "100%"}}>        
                <View style={{display: 'flex', alignItems: 'center'}}>
                    <LinearGradient colors={['#FFE2E2', '#fad4d4', '#e8a9a9']} locations={[0,0.5,1]} style={styles.menuNavigator}>

                        <TouchableOpacity onPress={() => navigation.navigate("Welcome")}>
                            <Ionicons name="home-outline" size={30} color="#364F6B" />
                        </TouchableOpacity>
                        
                        {Platform.OS === "android"?
                        <LinearGradient colors={['#FFE2E2', '#fad4d4', '#f08b8b']} style={{height:50, width:50, elevation:1, borderRadius:100,backgroundColor:"#FFE2E2",  justifyContent: "center", alignItems: "center"}}>
                            <TouchableOpacity onPress={() => navigation.navigate("MyQueues")}>
                                <MaterialIcons name="playlist-add-check" size={35} color="#364F6B" />
                            </TouchableOpacity>
                        </LinearGradient> 
                        :
                        <TouchableOpacity onPress={() => navigation.navigate("MyQueues")}>
                            <MaterialIcons name="playlist-add-check" size={35} color="#364F6B" />
                        </TouchableOpacity>
                        }
                        

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

                    </LinearGradient>
                </View>
            </View>
            {/* Navigation Bar */}

             {/* Navigation Bar */}
            
            {/* Navigation Bar */}
    

        </StyledContainer>
    )
}

const styles = StyleSheet.create({
    linearGradient: { 
        height: 180, 
        display: "flex",
        justifyContent:"center", 
        alignItems:"center",
        borderBottomRightRadius:25,  
        borderBottomLeftRadius:25,  
    },
    linearGradientIOS: {
        height: 180, 
        display: "flex",
        justifyContent:"center", 
        alignItems:"center",
        borderRadius:25,  
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
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
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