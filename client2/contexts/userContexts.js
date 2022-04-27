import { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext({
        isAuthenticated: false,
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