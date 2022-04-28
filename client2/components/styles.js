import styled from "styled-components";
import {View, Text, Image, TextInput, TouchableOpacity} from 'react-native';
import Constants from "expo-constants";

const StatusBarHeight = Constants.statusBarHeight;

 export const Colors ={
     primary: "#ffffff",
     secondary: "#E5E7EB",
     tertiary: "#1f2937",
     derlight: "#9ca3af",
     brand: "#5797ff",
     green: "#10b981",
     red: "#ef4444"
 };

 const {primary, secondary, tertiary,derlight,brand,green,red} = Colors;

 export const StyledContainer = styled.View`
    flex: 1;
    padding-top:${StatusBarHeight + 10}px ;
    padding-bottom: 25px ;
    background-color: ${primary};
 `;

 export const InnerContainer = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
 `;

 export const PageLogo = styled.Image`
    width: 200px;
    height: 200px;
    borderRadius: 100px;
 `;

 export const PageTitle = styled.Text`
    font-size: 30px;
    text-align: center;
    font-weight: bold;
    color: ${brand};
    padding: 10px;
 `;

 export const SubTitle = styled.Text`
    font-size: 18px;
    margin-bottom: 20px;
    letter-spacing: 1px;
    font-weight: bold;
    color: ${tertiary};
 `;

 export const StyledFormArea = styled.View`
   margin-top: 40px;
    width: 90%;
 `;

 export const StyledTextInput = styled.TextInput`
   background-color: ${secondary};
   padding: 15px;
   padding-left: 55px;
   padding-right: 55px;
   border-radius: 5px;
   font-size: 16px;
   height: 60px;
   margin-vertical: 3px;
   margin-bottom: 10px;
   text-align: center;
   color: ${tertiary};  
 `;

 export const StyledInputLabel = styled.Text`
   color: ${tertiary};
   font-size: 13px;
   text-align: center;
 `;

 export const LeftIcon = styled.View`
   left: 15px;
   top: 38px;
   position: absolute;
   z-index: 1;
 `; 
 
 export const RightIcon = styled.TouchableOpacity`
   right: 15px;
   top: 38px;
   position: absolute;
   z-index: 1;
 `;
 
 export const StyledButton = styled.TouchableOpacity`
   padding: 15px;
   background-color: #FFE2E2;
   justify-content: center;
   align-items: center;
   border-radius: 5px;
   margin-vertical: 5px;
   height: 60px;
 `;
  
 export const ButtonText = styled.Text`
   color: black;
   font-size: 16px;
 `;

 export const Line = styled.View`
   height: 1px;
   width: 100%;
   background-color: ${derlight};
   margin-vertical: 10px;
 `;

 export const ExtraView = styled.View`
   justify-content: center;
   flex-direction: row;
   align-items: center;
   padding: 10px;
 `;
export const ExtraText = styled.Text`
   justify-content: center;
   align-content: center;
   color: ${tertiary};
   font-size: 15px;
 `;

 export const TextLink = styled.TouchableOpacity`
   justify-content: center;
   align-items: center;
 `;

 export const TextLinkContent =styled.Text`
   color: ${brand};
   font-size: 15px;
 `;

