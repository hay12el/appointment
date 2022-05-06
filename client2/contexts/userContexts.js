import { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext({
        isAuthenticated: false,
        myAdmin: '6272c80b408e4d22a05231c2',
        isAdmin: false,
        id: '',
        userName: '',
        email: '',
        phone: '',
        queues: []
    });

export const UserProvider = ({ children }) => {
  
    const [user, setUser] = useState({ 
        isAuthenticated: false,
        isAdmin: false,
        myAdmin: '626132acee9af2167833d3fc',
        id:'',
        userName: '',
        email: '',
        phone: '',
        queues: [] });

  // Login updates the user data with a name parameter
    const Login = (id, name, email, phone, queues, isAdmin) => {
        
        setUser((user) => ({
            id: id,
            userName: name,
            myAdmin: '626132acee9af2167833d3fc',
            isAuthenticated: true,
            isAdmin: isAdmin,
            email: email,
            phone: phone,
            queues: queues
        }
        ));
    };

  // Logout updates the user data to default
    const setAuth = () => {
        setUser(() => {user.isAuthenticated = !user.isAuthenticated});
    };

    const Logout = () => {
        setUser((user) => ({
           isAuthenticated: false,
            isAdmin: false,
            id:'',
            userName: '',
            email: '',
            phone: '',
            queues: []
        }
        ));
    };
  
    return (
    <UserContext.Provider value={{ user, Login, Logout, setAuth }}>
      {children}
    </UserContext.Provider>
  );
}