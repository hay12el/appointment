import { StyleSheet, Text, View ,StatusBar} from 'react-native';
import {Router} from './navigators/Router'
import {UserProvider} from './contexts/userContexts'

export default function App(navigation) {
  return (
      <UserProvider style={{height: "100%", flex: 1, backgroundColor: "white", paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
        <Router/>
      </UserProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


