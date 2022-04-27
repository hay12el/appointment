import {AppStack} from './RootStack'
import {AuthStackscreen} from './RootStack'
import {AdminStackscreen} from './RootStack'
import {NavigationContainer} from '@react-navigation/native';
import {UserContext} from '../contexts/userContexts'
import { useContext, useEffect } from 'react';
import client from "../api/client";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Router = () => {
  const {user, Login} = useContext(UserContext);

  useEffect(async () => {
    let token = await AsyncStorage.getItem('token');
      if(token !== null){
        const res = await client.post('/users/userInfo', {token: token}
        ).then((response) => {
            const newUser = response.data.user;
            Login(newUser._id, newUser.username, newUser.email, newUser.phone, newUser.queues, newUser.isAdmin);
        }).catch((err) => {
            console.log(err);
        })
      }
      return () => console.log("useEffect");;
  }, [])

  if(!user.isAuthenticated){
    return (
      <NavigationContainer> 
        <AppStack />
      </NavigationContainer>
  );
  }else if(user.isAdmin){
    return (
      <NavigationContainer>
          <AdminStackscreen />   
      </NavigationContainer>
    );
  }else{
      return (
        <NavigationContainer>
            <AuthStackscreen />   
        </NavigationContainer>
      );
  }
  
};