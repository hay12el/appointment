import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, ScrollView , TouchableOpacity, SafeAreaView,StyleSheet, ActivityIndicator , Text, Platform, Alert} from "react-native";
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
import client from "../api/client";
import {UserContext} from "../contexts/userContexts"

const {brand, derLight, primary} = Colors;
import DateTimePicker from '@react-native-community/datetimepicker';
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
    const [thinking, setThinking] = useState(false);
    const {Login} = useContext(UserContext);
    const [hidePassword, setHidePassword] = useState(true);
    const [hidePassword1, setHidePassword1] = useState(true);
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date(1598051730000));
    const [dob, setDob] = useState(new Date(1598051730000));

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
        if(Platform.OS === 'android') setShow(false);
        setDob(currentDate);
    }

    const showDatePicker = () => {
        setShow('true');
    }

    const signup = async (values, formikActions) => {
        setThinking(true);
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
            setThinking(false);
            if(!response.data.token){
                showAlertSignOut("האימייל כבר קיים במערכת");
            }else{
                await AsyncStorage.setItem('token', response.data.token);
                const newUser = response.data.user;
                Login(newUser._id, newUser.username, newUser.email, newUser.phone, newUser.queues);
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    const showAlertSignOut = (err) => {
        Alert.alert('בעיה', 
                    err,
                    [{text:'הבנתי'}])
    }

    return (
        <SafeAreaView style={{flex:1,paddingTop: Platform.OS === "android" ? 45 : 0, backgroundColor:"white"}}>

                {Platform.OS === "android"?
                  <LinearGradient colors={['#ffc7c7', '#ffc7c7', '#ffa8a8']} locations={[0.0, 0.7, 1.0]} style={styles.linearGradient}>
                    <Image source={require('../assets/11.png')} style={{height:180, width:180}}></Image>
                  </LinearGradient>
                  :
                  <LinearGradient colors={['#ffc7c7', '#ffc7c7', '#ffa8a8']} locations={[0.0, 0.7, 1.0]} style={styles.linearGradientIOS}>
                    <Image source={require('../assets/11.png')} style={{height:180, width:180}}></Image>
                  </LinearGradient>
                 }
        <ScrollView>

        <StyledContainer style={{paddingTop: 0}}>
            <StatusBar style="dark" />
            <InnerContainer >
                
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
                        <Text style={styles.error}>{touched.name && errors.name}</Text>
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
                        

                            {show && Platform.OS === 'android' && (
                                <DateTimePicker
                                    locale="he-HE"
                                    style={{width:'100%'}}
                                    testID="dateTimePicker"
                                    value={date}
                                    mode="date"
                                    is24Hour={true}
                                    display="spinner"
                                    onChange={onChange}
                                />
                                )}
                                {show && Platform.OS === 'ios' && (
                            
                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                        <DateTimePicker
                                            locale="he-HE"
                                            style={{width:'100%'}}
                                            testID="dateTimePicker"
                                            value={date}
                                            mode="date"
                                            is24Hour={true}
                                            display="spinner"
                                            onChange={onChange}
                                        />
                                        <LinearGradient colors={['#FFE2E2', '#fad4d4', '#e8b7b7']} locations={[0.0, 0.5, 1.0]} style={[styles.button, styles.buttonOpen]}>
                                            <TouchableOpacity onPress={()=>setShow(false)} >
                                                <Text>
                                                    סגור
                                                </Text>
                                            </TouchableOpacity>
                                        </LinearGradient>
                                    </View>
                                </View>
                    )}
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
                        <Text style={styles.error}>{touched.email && errors.email}</Text>
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
                        <Text style={styles.error}>{touched.phone && errors.phone}</Text>
                        <MyTextInput 
                            label="סיסמא"
                            icon = "lock"
                            placeholder="סיסמא"
                            placeholderTextColor={derLight}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            secureTextEntry={hidePassword}
                            isPassword={true}
                            hidePassword={hidePassword}
                            setHidePassword={setHidePassword}
                            />
                        <Text style={styles.error}>{touched.password && errors.password}</Text>
                        <MyTextInput 
                            label="אימות סיסמא"
                            icon = "lock"
                            placeholder="אימות סיסמא"
                            placeholderTextColor={derLight}
                            onChangeText={handleChange('confirmPassword')}
                            onBlur={handleBlur('confirmPassword')}
                            value={values.confirmPassword}
                            secureTextEntry={hidePassword1}
                            isPassword1={true}
                            hidePassword1={hidePassword1}
                            setHidePassword1={setHidePassword1}
                        />
                        <Text style={styles.error}>{touched.confirmPassword && errors.confirmPassword}</Text>
                        <TouchableOpacity onPress={handleSubmit} style={styles.accept}>
                            <Text>
                                הרשמי
                            </Text>
                        </TouchableOpacity>
                        
                        <Line/>

                        <ExtraView style={{direction:'rtl'}}>
                            <ExtraText>
                                כבר יש לך חשבון?
                            </ExtraText>
                            <TextLinkContent onPress={ () => navigation.navigate("Login")}> התחברי </TextLinkContent>
                            <TextLink>
                            </TextLink>
                        </ExtraView>

                    </StyledFormArea>
                )}


                </Formik>
            </InnerContainer>
        </StyledContainer>
        <ActivityIndicator
                            style={styles.loading}
                            size="large" 
                            color="#0000ff"
                            animating={thinking}
                            />
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
    button: {
        backgroundColor: '#FFE2E2',
        borderRadius: 7,
        padding: 4,
        width: 140,
        alignItems:'center',
        justifyContent: "center",  
        elevation: 8,
        marginVertical:24,
        height: 50,  
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
    loading: {
        position: 'absolute',
        height:30,
        width:78,
        left: "40%",
        top: "50%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    linearGradientIOS: {
        height: 180, 
        display: "flex",
        justifyContent:"center", 
        alignItems:"center",
        borderRadius:25,  
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalView: {
        width:"80%",
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
        height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    accept:{
        padding: 15,
        backgroundColor: '#FFE2E2',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginVertical: 5,
        height: 60,
    },
    ddate:{
        backgroundColor: '#E5E7EB',
        padding: 15,
        paddingLeft: 55,
        paddingRight: 55,
        borderRadius: 5,
        fontSize: 16,
        height: 60,
        marginVertical: 3,
        marginBottom: 10,
        textAlign: 'center',
        color: '#1f2937' ,
        alignItems:'center',
        justifyContent:'center'
    }
})

const MyTextInput = ({label, icon, isPassword, isPassword1, hidePassword,hidePassword1,
    setHidePassword, setHidePassword1, isDate, showDatePicker, ...props}) => {
    return (
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color= {brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            {isDate && 
                <TouchableOpacity onPress={() => showDatePicker()}>
                    <View style={styles.ddate}>
                        <Text style={{color: "#9ca3af", textAlign:'center'}}>
                            {props.value}
                        </Text>
                    </View>
                </TouchableOpacity>
            }
            {!isDate && <StyledTextInput {...props} />}
            {isPassword && (
                <RightIcon onPressIn={()=> setHidePassword(!hidePassword)} onPressOut={()=> setHidePassword(!hidePassword)}>
                    <Ionicons size={30} color={derLight} name={'md-eye-off'}/>
                </RightIcon>
            )}
            {isPassword1 && (
                <RightIcon onPressIn={()=> setHidePassword1(!hidePassword1)} onPressOut={()=> setHidePassword1(!hidePassword1)}>
                    <Ionicons size={30} color={derLight} name={'md-eye-off'}/>
                </RightIcon>
            )}
        </View>
    )
};

export default SignUp;