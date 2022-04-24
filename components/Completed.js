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
  Pressable,
  TouchableOpacity
} from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';


    function CompletedScreen({ navigation, todos }) {
       const [isDeleted, setisDeleted] = useState();
       const [completed, setCompleted] = useState([]);
       const [selected, setSelected] = useState();
       const [isVisible, setIsVisible] = useState(false);
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



      const removeCompleted = async () => {
       await AsyncStorage.removeItem('completedTask');
       setIsVisible(false)
       await AsyncStorage.setItem('completedTask', JSON.stringify([]));
       getCompleted();
    };

    async function getCompleted(){
      let completedTodos = JSON.parse(await AsyncStorage.getItem('completedTask'))
      setCompleted(completedTodos)
    }

    const list = [
      {
        title: 'Remove Completed Task',
        onPress: () => removeCompleted(),
        containerStyle: { backgroundColor: '#0C1559' },
        titleStyle: {
          color: '#fdfbf9',
          fontFamily: 'Teko_600SemiBold',
          letterSpacing: '0.03rem',
        },
      },

      {
        title: 'Cancel',
        containerStyle: { backgroundColor: '#0C1559' },
        titleStyle: {
          color: '#fdfbf9',
          fontFamily: 'Teko_600SemiBold',
          letterSpacing: '0.03em',
        },
        onPress: () => setIsVisible(false),
      },
    ];
   

   async function deleteTodo() {
      let newData = []
      let todoid = JSON.parse(await AsyncStorage.getItem('todoID'))
      console.log(todoid)
      let allTodos = JSON.parse(await AsyncStorage.getItem('todos'))
      let removingTodo = allTodos.findIndex(todos => todos.id === todoid)

       allTodos.splice(removingTodo, 1);
       newData = allTodos
       console.log(newData)
       await AsyncStorage.setItem('todos', JSON.stringify(newData))
       getTodos().then(splitTodos).then(getCompleted)
    }

    useEffect(() => {
    getCompleted()
      }, []);

  const rightSwipe = (progress, dragX) => {
     const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

  return (
      <View style={{display: 'flex', flexDirection: 'row'}}>
      <TouchableOpacity activeOpacity={0.6}>
        <View style={styles.deleteBox}>
          <Pressable
            onPress={() => {
              deleteTodo();
            }}>
            <FontAwesome5 name="trash" size={25} color="white" />
          </Pressable>
        </View>
        </TouchableOpacity>      
      </View>
    );
  };

    return (
        <>
        <View style={{width: '100%', marginTop: 80}}>
          <ScrollView>
            {completed.length == 0 && (
              <Text style={styles.message}>
                You have no{' '}
                <Text
                  style={{ color: '#00FA9A', textDecorationLine: 'underline' }}>
                  completed
                </Text>{' '}
                task.
              </Text>
            )}
            {completed && completed.length > 0
              ? completed.map((todos) => {
                  return (
                <Swipeable
                  onSwipeableOpen={() => {
                      AsyncStorage.setItem(
                      'todoID',
                      JSON.stringify(todos.id)
                    )
                  }
 
                  }
                  renderRightActions={rightSwipe}>
                    <View class="todo" style={styles.toDoCompleted}>
                      <View class="top">
                        <Text style={styles.noteText}>
                          <Text
                            style={{
                              fontSize: 18,
                              textDecorationLine: 'underline',
                              color: 'darkblue',
                            }}>
                            {todos.title}
                          </Text>{' '}
                          -{' '}
                          <Text style={{ fontSize: 13 }}>{todos.date}</Text>
                        </Text>
                      </View>

                      <View class="note">
                        <Text style={styles.noteText}>
                          {' '}
                          {todos.description}
                        </Text>
                      </View>
                    </View>
                    </Swipeable>
                  );
                })
              : null}
          </ScrollView>
          </View>
          
        <BottomSheet modalProps={{}} isVisible={isVisible}>
          {list.map((l, i) => (
            <ListItem
              key={i}
              containerStyle={l.containerStyle}
              onPress={l.onPress}>
              <ListItem.Content>
                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
        </BottomSheet>
        </>
      );
    }




const styles = StyleSheet.create({
  
  noteText: {
    color: '#171717',
    fontSize: 17,
    fontFamily: 'PermanentMarker_400Regular',
    marginTop: 10,
  },

 

  toDoCompleted: {
    height: 200,
    width: '100%',
    backgroundColor: '#00FA9A',
    margin: 5,
    padding: 5,
  },


  
  message: {
    fontSize: 25,
    textAlign: 'center',
    margin: '1rem auto',
    marginTop: 250,
    color: '#fdfbf9',
  },

    deleteBox: {
    backgroundColor: '#171717',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: '96%',
    marginTop: 5
  },


});

export default CompletedScreen;