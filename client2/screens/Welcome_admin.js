import { StatusBar } from "expo-status-bar";
import client from "../api/client";
import React, {useContext} from "react";
import Calendar from './newQueue';
import { Ionicons, Entypo, MaterialIcons, FontAwesome5, AntDesign } from '@expo/vector-icons';
import {
    StyledContainer,
    InnerContainer,
    PageLogo,
    PageTitle,
} from './../components/styles'
import {View, Text, Alert ,Image,TouchableOpacity, StyleSheet, Linking, ScrollView} from 'react-native';
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

const Welcome_admin = ({navigation}) => {
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

      <View style={{height: "100%", flex: 1, backgroundColor: "#F6F6F6"}}>
              <View style={{height: 170, display: "flex",justifyContent:"center", alignItems:"center",borderBottomLeftRadius:18, borderBottomRightRadius:18 ,backgroundColor:"#FFC7C7", marginTop: 42}}>
                <Image source={require('../assets/11.png')} style={{height:180, width:180}}></Image>
                {/* <Text style={{fontSize:30, color: "#364F6B", marginTop: 0}}>נעמה כהן</Text> */}
              </View>
      <ScrollView>

        <StyledContainer>
            <StatusBar style="dark" />
            
            <InnerContainer>
                {/* <PageLogo resizeMode="cover" source = {require('./../assets/lak.jpeg')}/> */}
                <View style={{ height: 180, width: '100%'}}>
                  <View style={{width: "30%", backgroundColor: "#FFE2E2", borderTopRightRadius:15, borderBottomRightRadius:15, height: 50, alignItems: "center", justifyContent: "center"}}>
                    <Text style={{color: "#364F6B", fontSize: 16}}>על עצמי</Text>
                  </View>
                  <View style={{margin:10,height: 130,padding: 12, backgroundColor: "white", borderRadius: 12, elevation:6}}>
                    <Text style={{color: "#364F6B", fontSize: 16, textAlign: "center"}}>נעים להכיר :) </Text>
                    <Text style={{color: "#364F6B", fontSize: 16, textAlign: "center"}}>
אני עושה לק ג'ל עם מניקור בתשומת לב מירבית - אשמח לקבל אתכן ולעזור לשמור על הציפורניים שלכן יפות ומטופחות לאורך זמן.</Text>


                  </View>
                    
                </View>
                
                <View style={{ height: 300, width: '100%', marginVertical: 30}}>
                  <View style={{width: "30%", backgroundColor: "#FFE2E2", borderTopRightRadius:15, borderBottomRightRadius:15, height: 50, alignItems: "center", justifyContent: "center"}}>
                    <Text style={{color: "#364F6B", fontSize: 16}}>העבודות שלי</Text>
                  </View>
                  <View style={{height: 250,margin:10, elevation:17, backgroundColor: "white", borderRadius:10}}>
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
              <View style={{width: "30%", backgroundColor: "#FFE2E2", borderTopRightRadius:15, borderBottomRightRadius:15, height: 50, alignItems: "center", justifyContent: "center"}}>
                <Text style={{color: "#364F6B", fontSize: 16}}>עקבו אחרי</Text>
              </View>
            </View>
            {/* style={{margin:15,height: 130,padding: 12, backgroundColor: "#F6F6F6", borderRadius: 12}} */}
            <View style={{margin:90,height: 70,display: "flex", flexDirection:"row", alignItems: "center", justifyContent: "center",marginBottom: 20, marginTop:30, backgroundColor: "white", borderRadius: 12, elevation:8}}>
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
            <View style={{display: 'flex',justifyContent: 'center', alignContent: 'center', position: "absolute", bottom: 7,right: 0, width: "100%"}}>        
                    <View style={{display: 'flex', alignItems: 'center'}}>
                        <View style={ styles.menuNavigator }>
    
                            
                              
                            <TouchableOpacity onPress={() => navigation.navigate("Welcome") } >
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
            {/* Navigation Bar */}
    </View>
    );
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

export default Welcome_admin;