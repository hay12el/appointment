import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, ScrollView , TouchableOpacity, SafeAreaView,StyleSheet , Text, Platform} from "react-native";
import { Formik} from "formik";
import {LinearGradient} from 'expo-linear-gradient';
import {
    StyledContainer,
    InnerContainer,
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
} from '../components/styles'
import {View} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import client from "../api/client";
import {UserContext} from "../contexts/userContexts"

const {brand, derLight, primary} = Colors;

import {Octicons, Ionicons} from '@expo/vector-icons';
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useState, useContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as yup from 'yup';
import "yup-phone";



const validationSchema = yup.object().shape({
    name: yup.string()
                .required('הכניסי שם')
                .min(3, 'לא מספיק אותיות בשם!'),
    email: yup.string()
                .email('אימייל לא חוקי')
                .required('Required'),
    password: yup.string()
                .min(6, 'סיסמא חייבת להכיל 6 תוים לפחות')
                .required('הכניסי סיסמא'),
    confirmPassword:yup.string()
                .oneOf([yup.ref('password')], 'אימות סיסמא אינו תואם')
                .required('הכניסי אימות סיסמא'),
    //phone: yup.string().required('הכניסי מספר פלאפון')
});

const SignUp = ({navigation}) => {
    const {Login} = useContext(UserContext);
    const [hidePassword, setHidePassword] = useState(true);
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date(1598051730000));
    const [dob, setDob] = useState(new Date(1598051730000));

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
        console.log(currentDate);
        setDob(currentDate);
    }

    const showDatePicker = () => {
        setShow('true');
    }

    const signup = async (values, formikActions) => {
        console.log("checked");
        const res = await client.post('/users/register',{
            "username": values.name,
            "email": values.email,
            "password": values.password,
            "birthDay": dob,
            "phone": values.phone
        }, {
        headers: {
            'Content-Type': 'application/json',
        }
        }).then(async (response) => {
            await AsyncStorage.setItem('token', response.data.token);
            const newUser = response.data.user;
            Login(newUser._id, newUser.username, newUser.email, newUser.phone, newUser.queues);
        }).catch((err) => {
            console.log(err);
        })
    }

    return (
        <SafeAreaView style={{flex:1,paddingTop: Platform.OS === "android" ? 45 : 0, backgroundColor:"white"}}>

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

        <StyledContainer style={{paddingTop: 0}}>
            <StatusBar style="dark" />
            <InnerContainer >
                {show && (
                    
                    <DateTimePicker
                        locale="es-ES"
                        style={{width:'100%'}}
                        testID="dateTimePicker"
                        value={date}
                        mode="date"
                        is24Hour={true}
                        display="spinner"
                        onChange={onChange}
                    />
                    
                    )}
                <Formik
                    initialValues={{name: '',dateOfBirth: Date ,email: '',phone: '', password:'', confirmPassword:''}}
                    validationSchema={validationSchema}
                    onSubmit={signup}
                    >{({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
                        <StyledFormArea>
                        <MyTextInput 
                            label="שם מלא"
                            icon = "person"
                            placeholder="שם"
                            placeholderTextColor={derLight}
                            onChangeText={handleChange('name')}
                            onBlur={handleBlur('name')}
                            value={values.name}
                            />
                           
                        <MyTextInput 
                            label="תאריך לידה"
                            icon = "calendar"
                            placeholder="YYYY - MM - DD"
                            placeholderTextColor={derLight}
                            onChangeText={handleChange('dateOfBirth')}
                            onBlur={handleBlur('dateOfBirth')}
                            value={dob ? dob.toDateString() : ''}
                            isDate ={true}
                            editable ={false}
                            showDatePicker={showDatePicker}
                            /> 
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
                            label="טלפון"
                            icon = "broadcast"
                            placeholder="מספר טלפון"
                            placeholderTextColor={derLight}
                            onChangeText={handleChange('phone')}
                            onBlur={handleBlur('phone')}
                            value={values.phone}
                            keboardType="phone"
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
                        <MyTextInput 
                            label="אימות סיסמא"
                            icon = "lock"
                            placeholder="אימות סיסמא"
                            placeholderTextColor={derLight}
                            onChangeText={handleChange('confirmPassword')}
                            onBlur={handleBlur('confirmPassword')}
                            value={values.confirmPassword}
                            secureTextEntry={hidePassword}
                            isPassword={hidePassword}
                            hidePassword={hidePassword}
                            setHidePassword={setHidePassword}
                        />
                        
                        <StyledButton>
                            <ButtonText onPress={handleSubmit}>
                                הרשמי
                            </ButtonText>
                        </StyledButton>
                        <Line/>

                        <ExtraView>
                            <ExtraText>
                                כבר יש לך חשבון?
                            </ExtraText>
                            <TextLinkContent onPress={ () => navigation.navigate("Login")}> התחברי </TextLinkContent>
                            <TextLink>
                            </TextLink>
                        </ExtraView>

                        <Text style={styles.error}>{touched.name && errors.name}</Text>
                        <Text style={styles.error}>{touched.phone && errors.phone}</Text>
                        <Text style={styles.error}>{touched.password && errors.password}</Text>
                        <Text style={styles.error}>{touched.email && errors.email}</Text>
                        <Text style={styles.error}>{touched.confirmPassword && errors.confirmPassword}</Text>

                    </StyledFormArea>
                )}


                </Formik>
            </InnerContainer>
        </StyledContainer>
    </ScrollView>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    error: {
        textAlign: 'center',
        fontSize: 16,
        color: 'red'
    },
    linearGradient: {
        height: 180, 
        width:"100%",
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
})

const MyTextInput = ({label, icon, isPassword, hidePassword,
    setHidePassword, isDate, showDatePicker, ...props}) => {
    return (
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color= {brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            {!isDate && <StyledTextInput {...props} />}
            {isDate && <TouchableOpacity onPress={() => showDatePicker()}>
                    <StyledTextInput {...props} />
                </TouchableOpacity>}
            {isPassword && (

                <RightIcon onPress={()=> setHidePassword(!hidePassword)}>
                    <Ionicons size={30} color={derLight} name={hidePassword ? 'md-eye-off' : 'md-eye'}/>
                </RightIcon>
            )}
        </View>
    )
};

export default SignUp;