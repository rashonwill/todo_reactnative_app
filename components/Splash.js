import React, { useState, useEffect } from 'react';
import {
  BottomSheet,
  Button,
  ListItem,
  Input,
  ButtonGroup,
  withTheme,
} from 'react-native-elements';

import {
  StyleSheet,
  View,
  Text,
  SectionList,
  Image,
  TextInput,
  Linking,
  ScrollView,
  FlatList,
  Alert,
  Keyboard,
  ImageBackground,
} from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

import Constants from 'expo-constants';

import { Ionicons } from '@expo/vector-icons';

import {
  faCheckSquare,
  faCoffee,
  faBars,
} from '@fortawesome/fontawesome-free-solid';

import { FontAwesome } from '@expo/vector-icons';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

import { Entypo } from '@expo/vector-icons';

import { MaterialIcons } from '@expo/vector-icons';

import { SimpleLineIcons } from '@expo/vector-icons';

import { Feather as Icon } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';

import { useFonts, OpenSans_400Regular } from '@expo-google-fonts/dev';

import { PermanentMarker_400Regular } from '@expo-google-fonts/permanent-marker';
import { GloriaHallelujah_400Regular } from '@expo-google-fonts/gloria-hallelujah';


import {
  Teko_300Light,
  Teko_400Regular,
  Teko_500Medium,
  Teko_600SemiBold,
  Teko_700Bold,
} from '@expo-google-fonts/teko';

import PendingScreen from './Pending'


function Splash(){
  const navigation = useNavigation();
  const [ready, setReady] = useState(false);    

    function goToHome(){
      setTimeout(() => {
       navigation.navigate('Pending')
    }, 3500);
  }

    useEffect(() => {
    goToHome();
  }, []);
     
    

  return(
    <>
    <View style={{width: '100%', height: '100%', backgroundColor: 'white'}}>
    <ImageBackground 
    source={{uri: 'https://s.hdnux.com/photos/47/46/46/10381742/3/rawImage.jpg'}} 
    resizeMode="contain" 
    style={{width: '100%', height: '60%', marginTop: 200}} />
    </View>
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 200,
    backgroundColor: '#0c1559',
    margin: 10,
    textAlign: 'center',
    padding: 5,
    alignItems: 'center',
    marginBottom: 10,
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fdfbf9',
    marginTop: 10,
    height: 50,
    fontFamily: 'Teko_700Bold',
    zIndex: 19,
    borderRadius: '50%'
  },


});


export default Splash;