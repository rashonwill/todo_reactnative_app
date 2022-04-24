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
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInputMask } from 'react-native-masked-text'
import Constants from 'expo-constants';

import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

function NewTaskScreen({ navigation, todos }) {


    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    
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
   

    const removeAll = async () => {
       const keys = await AsyncStorage.getAllKeys(); 
       await AsyncStorage.multiRemove(keys);
       setIsVisible(false)
      await AsyncStorage.setItem('pendingTask', JSON.stringify([]))
      await AsyncStorage.setItem('expiredTask', JSON.stringify([]))
      await AsyncStorage.setItem('completedTask', JSON.stringify([]))
    };


    const list = [
      {
        title: 'Remove All Task',
        onPress: () => removeAll(),
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

    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setDate(currentDate);
    }

    async function createNewTodo(){
      if (title === '' && description === '') {
        Alert.alert('Please add a title for this task');
      }else{
        let newTodo = {
          id: Math.floor(Math.random() * 500),
          title: title,
          date: date,
          description: description,
          isCompleted: false,
        }
        let arr = []
        let myTask = JSON.parse(await AsyncStorage.getItem('todos'));
        if(!myTask || myTask === null){
        arr.push(newTodo);
        await AsyncStorage.setItem('todos', JSON.stringify(arr))
        getTodos().then(splitTodos);
        setDescription('');
        setTitle('');
        }else if(myTask){
        arr.push(...myTask, newTodo)
        await AsyncStorage.setItem('todos', JSON.stringify(arr))
        getTodos().then(splitTodos);
        setDescription('');
        setTitle('');
        }
        Alert.alert('New task added!');
        }
    

      }


    function cancelTodo(){
        setTitle('');
        setDescription('');
        
    }

    
    
    return (
        <>
        <View style={{ color: '#fdfbf9', fontFamily: 'Teko_600SemiBold' }}>
          <Button
            onPress={() => setIsVisible(true)}
            buttonStyle={styles.button}
            icon={<FontAwesome5 name="tools" size={25} color="white" />}></Button>
        </View>
          <View style={styles.newTask}>
            <View>
              <TextInput
                placeholder="Title"
                style={styles.input}
                value={title}
                returnKeyType="send"
                onChangeText={(value) => setTitle(value)}
                onSubmitEditing={() => {createNewTodo(), Keyboard.dismiss()}}
                />

              <TextInput
                placeholder="Description"
                style={styles.input2}
                value={description}
                multiline={true}
                numberOfLines={10}
                returnKeyType="send"
                onChangeText={(value) => setDescription(value)}
                onSubmitEditing={() => {createNewTodo(), Keyboard.dismiss()}}/>

              <DateTimePicker
                value={date}
                onChange={onChange}
                mode="datetime"
                format="MM-DD-YYYY HH:mm"
                date={date}
                is24Hour="false"
                themeVariant="dark"
                style={{
                  width: '100vw',
                  backgroundColor: 'transparent',
                  calendarForeColor: 'grey',
                  borderRadius: 10,
                  height: 55,
                  marginBottom: 10,
                  marginTop: 10,
                  padding: 5,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}
              />

            </View>

            <View class="bottom" style={styles.btnNewTask}>
              <Button title="Create" buttonStyle={styles.submit} onPress={() => {createNewTodo(), Keyboard.dismiss()}}></Button>
              <Button title="Cancel" buttonStyle={styles.cancel} onPress={() => {cancelTodo(), Keyboard.dismiss()}}></Button>
            </View>
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
  button: {
    height: 50,
    backgroundColor: '#0c1559',
    color: '#fdfbf9',
    fontWeight: 'bold',
    fontSize: '25px',
    fontFamily: 'Teko_600SemiBold',
    shadowColor: 'black',
    shadowRadius: 10,
    shadowOpacity: 1,
    shadowOffset: { width: -2, height: 4 },
    justifyContent: 'flex-start',
    marginTop: 50,
  },

  page: {
    backgroundColor: '#2A3271',
    fontFamily: 'Teko_600SemiBold',
  },

  noteText: {
    color: '#171717',
    fontSize: 17,
    fontFamily: 'PermanentMarker_400Regular',
    marginTop: 10,
  },

  toDoPending: {
    height: 200,
    width: '100%',
    backgroundColor: '#F7E98D',
    margin: 5,
    padding: 5,
  },

  toDoCompleted: {
    height: 200,
    width: '100%',
    backgroundColor: '#00FA9A',
    margin: 5,
    padding: 5,
  },

  toDoExpired: {
    height: 200,
    width: '100%',
    backgroundColor: '#ff5252',
    margin: 5,
    padding: 5,
  },

  actionButtons: {
    backgroundColor: 'black',
    color: 'white',
    margin: 5,
    padding: 5,
    borderRadius: 10,
    width: 90,
    textAlign: 'center',
  },

  btnSection: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },

  newTask: {
    width: '100%',
    height: '100vh',
    padding: 5,
  },
  input: {
    outline: 'none',
    width: '100%',
    height: 55,
    color: '#171717',
    fontSize: 20,
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
    marginTop: 5,
    fontFamily: 'Teko_600SemiBold',
    backgroundColor: '#fdfbf9',
    letteSpacing: '0.02rem',
  },
  input2: {
    outline: 'none',
    width: '100%',
    height: 200,
    color: '#171717',
    fontSize: 20,
    borderRadius: 10,
    padding: 5,
    fontFamily: 'Teko_600SemiBold',
    backgroundColor: '#fdfbf9',
    letteSpacing: '0.02rem',
    overflowWrap: 'break-word',
  },
  btnNewTask: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 20,
    borderRadius: 10,
    position: 'relative',
    bottom: 0,
    marginLeft: 140,
  },

  message: {
    fontSize: 25,
    textAlign: 'center',
    margin: '1rem auto',
    marginTop: 250,
    color: '#fdfbf9',
  },

  submit: {
    backgroundColor: '#171717',
    color: '#fdfbf9',
    width: 110,
    margin: 5,
    borderRadius: '50%'
  },

  cancel: {
    backgroundColor: '#171717',
    color: '#fdfbf9',
    width: 110,
    margin: 5,
    borderRadius: '50%'
  },
});

export default NewTaskScreen
