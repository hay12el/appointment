import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "./../screens/Login";
import SignUp from "./../screens/SignUp";
import Welcome from "./../screens/Welcome";
import MyQueues from "../screens/myQueues";
import Admin_pannel from "../screens/Admin_pannel";

const Stack = createStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export const AuthStackscreen = () => {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyQueues"
        component={MyQueues}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Admin_pannel"
        component={Admin_pannel}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
