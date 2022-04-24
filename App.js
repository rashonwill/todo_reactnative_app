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

import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';

import { Entypo } from '@expo/vector-icons';

import { MaterialIcons } from '@expo/vector-icons';

import { SimpleLineIcons } from '@expo/vector-icons';

import { Feather as Icon } from '@expo/vector-icons';

import { AppLoading } from 'expo';

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

import Pending from './components/Pending';
import Completed from './components/Completed';
import Expired from './components/Expired';
import NewTask from './components/NewTask';
import Splash from './components/Splash';

function App() {
    let [fontsLoaded, error] = useFonts({
      PermanentMarker_400Regular,
      Teko_600SemiBold,
      GloriaHallelujah_400Regular,
    });

    let todos = []
    let pendingTodos = [];
    let completedTodos = [];
    let expiredTodos = [];

    function isCurrent(todos) {
      const now = new Date();
      const due = new Date(todos.date);
      return now < due;
    }

    const getTodos = async () => {
      try {
        const storedData = JSON.parse(await AsyncStorage.getItem('todos'));
        if(!storedData) {
         todos = []
        }else if(storedData){
          todos = storedData
        }
      } catch (error) {
        console.log(error);
      }
    };

    async function splitTodos() {
      pendingTodos = todos.filter(function (todos) {
        return !todos.isCompleted && isCurrent(todos);
      });
      await AsyncStorage.setItem('pendingTask', JSON.stringify(pendingTodos))

      completedTodos = todos.filter(function (todos) {
        return todos.isCompleted;
      });
      await AsyncStorage.setItem('completedTask', JSON.stringify(completedTodos))
 

      expiredTodos = todos.filter(function (todos) {
        return !todos.isCompleted && !isCurrent(todos);
      });
      await AsyncStorage.setItem('expiredTask', JSON.stringify(expiredTodos))
  
    }
   

    function SplashScreen({navigation}){
      return <Splash  />
    }

    function PendingScreen({navigation}){
        return <Pending todos={todos} />
    }

    function CompletedScreen({navigation}){
        return <Completed todos={todos} />
    }


    function ExpiredScreen({navigation}){
        return <Expired todos={todos} />
    }

    function NewTaskScreen({navigation}){
        return <NewTask todos={todos}  />
   }

  
    const Tab = createBottomTabNavigator();

    const MyTheme = {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: '#2A3271',
        color: '#fdfbf9',
      },
    };


    useEffect(() => {
    getTodos().then(splitTodos)
  }, []);

    return (
      <SafeAreaProvider style={styles.page}>
        <NavigationContainer theme={MyTheme}>
          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: 'white',
              tabBarStyle: {
                backgroundColor: '#0c1559',
                fontFamily: 'PermanentMarker_400Regular',
                elevation: 0,
                shadowOpacity: 0,
                borderTopWidth: 0,
                height: 85
              },
              tabBarLabelStyle: {
                fontFamily: 'PermanentMarker_400Regular',
                letterSpacing: '0.2rem',
                fontSize: 14,
              },
            }}>

              <Tab.Screen
              name="Splash"
              component={SplashScreen}
              options={{
                title: '',
                headerShown: false,
                tabBarLabel: 'Splash',
                tabBarStyle: { display: 'none' },
                tabBarIcon: ({ color, size }) => (
                  <Foundation name="burst" size={25} color="white" />
                ),
                tabBarButton: () => null,
                tabBarVisible: false,
              }}
            />
            <Tab.Screen
              name="Pending"
              component={PendingScreen}
              options={{
                title: '',
                headerShown: false,
                tabBarLabel: 'Pending',
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="pending" size={25} color="white" />
                ),
                unmountOnBlur: true,
              }}
            />
            <Tab.Screen
              name="Completed"
              component={CompletedScreen}
              options={{
                title: '',
                headerShown: false,
                tabBarLabel: 'Completed',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons
                    name="checkmark-done-circle"
                    size={24}
                    color="white"
                  />
                ),
                unmountOnBlur: true,
              }}
            />
            <Tab.Screen
              name="Expired"
              component={ExpiredScreen}
              options={{
                title: '',
                headerShown: false,
                tabBarLabel: 'Expired',
                tabBarIcon: ({ color, size }) => (
                  <Entypo name="back-in-time" size={25} color="white" />
                ),
                unmountOnBlur: true,
              }}
            />

            <Tab.Screen
              name="New Task"
              component={NewTaskScreen}
              options={{
                title: '',
                headerShown: false,
                tabBarLabel: 'New Task',
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="fiber-new" size={25} color="white" />
                ),
                unmountOnBlur: true,
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#2A3271',
    fontFamily: 'Teko_600SemiBold',
  },

});

export default App;
