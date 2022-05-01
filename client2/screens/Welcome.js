import { StatusBar } from "expo-status-bar";
import client from "../api/client";
import React, {useContext} from "react";
import {LinearGradient} from 'expo-linear-gradient';
import Calendar from './newQueue';
import { Ionicons, Entypo, MaterialIcons, FontAwesome5, AntDesign } from '@expo/vector-icons';
import {
    StyledContainer,
    InnerContainer
} from './../components/styles'
import {View, Text, Alert ,Image,TouchableOpacity, StyleSheet, Linking, ScrollView,Pressable, Platform} from 'react-native';
import {UserContext} from '../contexts/userContexts'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from "react-native-gesture-handler";

const SECTIONS = 
    [
      {
        key: '1',
        text: 'Item text 1',
        uri: 'https://www.lady-nails.co.il/wp-content/uploads/2020/06/%D7%9C%D7%A7-%D7%92%D7%9C-12.jpg',
      },
      {
        key: '2',
        text: 'Item text 2',
        uri: 'https://www.lady-nails.co.il/wp-content/uploads/2020/11/nails5.jpg',
      },

      {
        key: '3',
        text: 'Item text 3',
        uri: 'https://biosculpture.co.il/wp-content/uploads/2021/03/%D7%9E%D7%95%D7%A1%D7%9C%D7%9E%D7%99%D7%95%D7%AA-%D7%9C%D7%A7-%D7%92%D7%9C.jpg',
      },
      {
        key: '4',
        text: 'Item text 4',
        uri: 'https://www.lady-nails.co.il/wp-content/uploads/2020/11/nails2.jpg',
      },
      {
        key: '5',
        text: 'Item text 5',
        uri: 'https://www.lady-nails.co.il/wp-content/uploads/2020/11/nails6.jpg',
      },
    ];

const ListItem = ({ item }) => {
  return (
    <View style={styles.item}>
      <Image
        source={{
          uri: item.uri,
        }}
        style={styles.itemPhoto}
        resizeMode="cover"
      />
      <Text style={styles.itemText}>{item.text}</Text>
    </View>
  );
};

const Welcome = ({navigation}) => {
      const {user, Logout} = useContext(UserContext);

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
      <View style={{height: "100%", flex: 1, backgroundColor: "white", paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, paddingBottom: 80}}>

      <View style={{height: "100%", flex: 1}}>
              {Platform.OS === "android"?
                  <LinearGradient colors={['#ffc7c7', '#ffc7c7', '#fa9393']} locations={[0.0, 0.5, 1.0]} style={styles.linearGradient}>
                    <Image source={require('../assets/11.png')} style={{height:180, width:180}}></Image>
                  </LinearGradient>
                  :
                  <LinearGradient colors={['#ffc7c7', '#ffc7c7', '#fa9393']} locations={[0.0, 0.5, 1.0]} style={styles.linearGradientIOS}>
                    <Image source={require('../assets/11.png')} style={{height:180, width:180}}></Image>
                  </LinearGradient>
              }
              
      <ScrollView>

        <StyledContainer>
            <StatusBar style="dark" />
            
            <InnerContainer>
                {/* <PageLogo resizeMode="cover" source = {require('./../assets/lak.jpeg')}/> */}
                <View style={{ height: 180, width: '100%'}}>
                  {Platform.OS === "android"?
                  <LinearGradient colors={['#f7e6e6','#f5cece', '#e8a9a9']} locations={[0.0,0.5,1.0]} style={{width: "30%", borderTopLeftRadius: 15, borderBottomLeftRadius: 15,height: 50, alignItems: "center", justifyContent: "center"}}>
                      <Text style={{color: "#364F6B", fontSize: 16}}>על עצמי</Text>
                  </LinearGradient>
                  :
                  <LinearGradient colors={['#f7e6e6','#f5cece', '#e8a9a9']} locations={[0.0,0.5,1.0]} style={{width: "30%", borderRadius: 15, height: 50, alignItems: "center", justifyContent: "center"}}>
                      <Text style={{color: "#364F6B", fontSize: 16}}>על עצמי</Text>
                  </LinearGradient>
                  }
                  
                  
                  
                  
                  <View style={{margin:10,height: 130,padding: 12, backgroundColor: "white", borderRadius: 12, elevation:16,shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,}}>
                    <Text style={{color: "#364F6B", fontSize: 16, textAlign: "center"}}>נעים להכיר :) </Text>
                    <Text style={{color: "#364F6B", fontSize: 16, textAlign: "center"}}>
אני עושה לק ג'ל עם מניקור בתשומת לב מירבית - אשמח לקבל אתכן ולעזור לשמור על הציפורניים שלכן יפות ומטופחות לאורך זמן.</Text>


                  </View>
                    
                </View>
                
                <View style={{ height: 300, width: '100%', marginVertical: 30}}>
                  {Platform.OS === "android"?
                  <LinearGradient colors={['#f7e6e6','#f5cece', '#e8a9a9']} locations={[0.0,0.5,1.0]} style={{width: "30%", borderTopLeftRadius: 15, borderBottomLeftRadius: 15,height: 50, alignItems: "center", justifyContent: "center"}}>
                      <Text style={{color: "#364F6B", fontSize: 16}}>העבודות שלי</Text>
                  </LinearGradient>
                  :
                  <LinearGradient colors={['#f7e6e6','#f5cece', '#e8a9a9']} locations={[0.0,0.5,1.0]} style={{width: "30%", borderRadius: 15, height: 50, alignItems: "center", justifyContent: "center"}}>
                      <Text style={{color: "#364F6B", fontSize: 16}}>העבודות שלי</Text>
                  </LinearGradient>
                  }
                  <View style={{height: 250,margin:10, elevation:17, backgroundColor: "white", borderRadius:10, shadowColor: "#000",shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,}}>
                    <FlatList
                      data={SECTIONS}
                      renderItem={({ item }) => <ListItem item={item} />}
                      keyExtractor={item => item.key}
                      showsHorizontalScrollIndicator={false}
                      horizontal
                    />
                  </View>
                </View>
                
            
    

            </InnerContainer>
              
            <View style={{justifyContent: "center"}}>
             {Platform.OS === "android"?
                  <LinearGradient colors={['#f7e6e6','#f5cece', '#e8a9a9']} locations={[0.0,0.5,1.0]} style={{width: "30%", borderTopLeftRadius: 15, borderBottomLeftRadius: 15,height: 50, alignItems: "center", justifyContent: "center"}}>
                      <Text style={{color: "#364F6B", fontSize: 16}}>עקבו אחרי</Text>
                  </LinearGradient>
                  :
                  <LinearGradient colors={['#f7e6e6','#f5cece', '#e8a9a9']} locations={[0.0,0.5,1.0]} style={{width: "30%", borderRadius: 15, height: 50, alignItems: "center", justifyContent: "center"}}>
                      <Text style={{color: "#364F6B", fontSize: 16}}>עקבו אחרי</Text>
                  </LinearGradient>
                  }
            </View>
            {/* style={{margin:15,height: 130,padding: 12, backgroundColor: "#F6F6F6", borderRadius: 12}} */}
            <View style={{margin:90,height: 70,display: "flex", flexDirection:"row", alignItems: "center", justifyContent: "center",marginBottom: 50, marginTop:30, backgroundColor: "white", borderRadius: 12, elevation:8,shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,}}>
              <TouchableOpacity>
                <AntDesign name="instagram" size={40} color="black" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image
                  style={styles.tinyLogo}
                  source={require('../assets/tik-tok.png')}
                  />
              </TouchableOpacity>
              <TouchableOpacity>
                <FontAwesome5 name="whatsapp" size={40} color="black" />
              </TouchableOpacity>

            </View>


        </StyledContainer>
            
    </ScrollView>


    </View>
            {/* Navigation Bar */}
            <View style={{display: 'flex',justifyContent: 'center', alignContent: 'center', position: "absolute", bottom: 32,right: 0, width: "100%"}}>        
                <View style={{display: 'flex', alignItems: 'center'}}>
                    {/* <View style={ styles.menuNavigator }> */}
                        <LinearGradient colors={['#FFE2E2', '#fad4d4', '#e8a9a9']} locations={[0,0.5,1]} style={styles.menuNavigator}>


                        {Platform.OS === "android"?
                          <View>
                            <LinearGradient colors={['#FFE2E2', '#fad4d4', '#f08b8b']} locations={[0.0,0.5,1.0]} style={{height:50, width:50, elevation:1, borderRadius:100,backgroundColor:"#FFE2E2",  justifyContent: "center", alignItems: "center"}}>
                              
                            <TouchableOpacity onPress={() => navigation.navigate("Welcome") } style={{}}>
                                  <Ionicons name="home-outline" size={30} color="#364F6B" />
                              </TouchableOpacity>
                            </LinearGradient> 
                          </View> 
                        :
                          <View>
                            <TouchableOpacity onPress={() => navigation.navigate("Welcome") } style={{}}>
                                <Ionicons name="home-outline" size={30} color="#364F6B" />
                            </TouchableOpacity>
                          </View> 
                        }
                        

                        <TouchableOpacity onPress={() => navigation.navigate("MyQueues")} style={{marginRight:10}}>
                            <MaterialIcons name="playlist-add-check" size={35} color="#364F6B" />
                        </TouchableOpacity>

                        <View style={{position: 'absolute', right: "53%", bottom: 65}}>
                            <Calendar/>
                        </View>

                        <TouchableOpacity onPress={() => Linking.openURL('https://ul.waze.com/ul?ll=31.24937992%2C34.78982806&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location')}>
                            <FontAwesome5 name="waze" size={29} color="#364F6B" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => showAlertSignOut()}>
                            <Entypo name="log-out" size={29} color="#364F6B" />
                        </TouchableOpacity>

                        </LinearGradient>
                    {/* </View> */}
                </View>
            </View>
            {/* Navigation Bar */}
    </View>
    );
}



const styles = StyleSheet.create({
  linearGradient: {
        marginTop: 42,
        height: 180, 
        display: "flex",
        justifyContent:"center", 
        alignItems:"center",
        borderBottomRightRadius:25,  
        borderBottomLeftRadius:25,  
    },
    linearGradientIOS: {
        marginTop: 42,
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
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  sectionHeader: {
    fontWeight: '800',
    fontSize: 18,
    color: '#f4f4f4',
    marginTop: 20,
    marginBottom: 5,
  },
  item: {
    margin: 10,
  },
  itemPhoto: {
    width: 170,
    height: 230,
    borderTopLeftRadius: 8,
    borderTopRightRadius:8,
    shadowColor: '#000',
  },
  tinyLogo: {
    marginHorizontal: 22,
    width: 40,
    height: 40,
  },
  itemText: {
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 5,
  },
});

export default Welcome;