import { StatusBar } from "expo-status-bar";
import client from "../api/client";
import React, { useContext } from "react";
import { Formik } from "formik";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    StyledContainer,
    InnerContainer,
    PageLogo,
    PageTitle,
    SubTitle,
    StyledFormArea, 
    LeftIcon,
    StyledInputLabel,
    StyledTextInput,
    RightIcon,
    colors,
    StyledButton,
    ButtonText,
    Line,
    ExtraText,
    ExtraView,
    TextLink,
    TextLinkContent
} from './../components/styles'
import {View, Text, Button, Image} from 'react-native';

const {brand, derLight, primary} = Colors;

import {Octicons, Ionicons} from '@expo/vector-icons';

/*import {colors} from './../components/styles';*/
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useState } from "react";
import {UserContext} from '../contexts/userContexts'

const Login = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hidePassword, setHidePassword] = useState(true);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const {user, Login} = useContext(UserContext);

    const login = async (values, formikActions) => {
        const res = await client.post('/users/login', {...values}, {
        headers: {
            'Content-Type': 'application/json'
        }
        }).then(async (response) => {
            await AsyncStorage.setItem('token', response.data.token);
            const newUser = response.data.user;
            console.log(newUser);
            Login(newUser._id, newUser.username, newUser.email, newUser.phone, newUser.queues, newUser.isAdmin);
        }).catch((err) => {
            console.log(err);
        })
    }

    return (
        <StyledContainer>
            <StatusBar style="dark" />
            <InnerContainer>
                <View style={{width: "100%", height: 180, display: "flex",justifyContent:"center", alignItems:"center",borderBottomLeftRadius:18, borderBottomRightRadius:18 ,backgroundColor:"#FFC7C7"}}>
                    <Image source={require('../assets/11.png')} style={{height:180, width:180}}></Image>
                    {/* <Text style={{fontSize:30, color: "#364F6B", marginTop: 0}}>נעמה כהן</Text> */}
                </View>
                <Formik
                    initialValues={{email: '', password:''}}
                    onSubmit={login}
                >{({handleChange, handleBlur, handleSubmit, values}) => (
                    <StyledFormArea>
                        <MyTextInput 
                            label="כתובת מייל"
                            icon = "mail"
                            placeholder="אימייל"
                            placeholderTextColor={derLight}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            keboardType="email-address"
                        />
                        <MyTextInput 
                            label="סיסמא"
                            icon = "lock"
                            placeholder="סיסמא"
                            placeholderTextColor={derLight}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            secureTextEntry={hidePassword}
                            isPassword={hidePassword}
                            hidePassword={hidePassword}
                            setHidePassword={setHidePassword}
                        />
                        <StyledButton onPress={handleSubmit}>
                            <ButtonText>
                                התחברי
                            </ButtonText>
                        </StyledButton>
                        <Line/>

                        <ExtraView>
                            <ExtraText>
                                עוד לא נרשמת?
                            </ExtraText>
                            <TextLinkContent onPress={ () => navigation.navigate("SignUp")}> הירשמי </TextLinkContent>
                            <TextLink>
                            </TextLink>
                        </ExtraView>
                    </StyledFormArea>
                )}


                </Formik>
            </InnerContainer>
        </StyledContainer>
    );
}

const MyTextInput = ({label, icon, isPassword, hidePassword,setHidePassword, ...props}) => {
    return (
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color= {brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props} />
            {isPassword && (

                <RightIcon onPress={()=> setHidePassword(!hidePassword)}>
                    <Ionicons size={30} color={derLight} name={hidePassword ? 'md-eye-off' : 'md-eye'}/>
                </RightIcon>
            )}
        </View>
    )
};

export default Login;