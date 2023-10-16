import React, {useEffect, useState} from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
import Task from './Task';
import CalendarPicker from 'react-native-calendar-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDateSchedule } from '../utils/getDateSchedule';

export default function MainScreen() {
  const [task, setTask] = useState();
  const [classes, setClasses] = useState([]);
  const [taskItems, setTaskItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState({
    year: -1,
    month: -1,
    day: -1,
    dayOfWeek: -1
  });
  let reg = /\d{4}-\d{2}-\d{2}/;

  const handleAddTask = () => {
    Keyboard.dismiss();
    setTaskItems([...taskItems, task])
    setTask(null);
  }

  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy)
  }

  useEffect(() => {
    (async () => {
      if(selectedDate.year === -1 || selectedDate.month === -1 || selectedDate.day === -1 || selectedDate.dayOfWeek === -1) return null;

      let [url, group] = await Promise.all([
        AsyncStorage.getItem('group-url'),
        AsyncStorage.getItem('group-name')
      ]);

      let instName = group.substring(0, 2)
      let curClasses = await getDateSchedule(instName, url, selectedDate)
      setClasses(curClasses.length ? curClasses : Array(7).fill(''));
    })()
  }, [selectedDate])

  function onDateChange(date) {

    try {
      let newDate = new Date(date.toString())
      let newYear = newDate.getFullYear()
      let newMonth = newDate.getMonth() + 1
      let newDay = newDate.getDate()
      let newDayOfWeek = newDate.getDay()
      
      setSelectedDate({
        year: newYear,
        month: newMonth,
        day: newDay,
        dayOfWeek: newDayOfWeek
      })
    }
    catch {
      throw new Error('Invalid date')
    }
  }

  return (
    <View style={styles.container}>
      {/* Added this scroll view to enable scrolling when list gets longer than the page */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1
        }}
        keyboardShouldPersistTaps='handled'
      >

      {/* Today's Tasks */}
      <View style={styles.tasksWrapper}>
        <CalendarPicker
          startFromMonday={true}
          onDateChange={onDateChange}
        />
        <Text style={styles.sectionTitle}>Today's Classes</Text>
        <View style={styles.items}>
          {/* This is where the tasks will go! */}
          {
            classes.map((item, index) => {
              return (
                <Task key={index} text={item ? item : 'Окно'} /> 
              )
            })
          }
        </View>
      </View>
        
      </ScrollView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addText: {},
});
