import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Task = (props) => {

  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <View style={styles.square}>
          <Text style={styles.textNum}>
          {props.classNum}
          </Text>
        </View>
        <View style={styles.classTimeContainer}>
          <Text style={styles.classTime}>{props.classTime}</Text>
          <Text style={styles.itemText}>{props.text}</Text>
        </View>
      </View>
      <View style={styles.circular}></View>
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    padding: 15,
    paddingRight: 25,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: '#55BCF6',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex'
  },
  textNum: {
    color: 'black'
  },
  itemText: {
    maxWidth: '80%',
  },
  circular: {
    width: 12,
    height: 12,
    borderColor: '#55BCF6',
    borderWidth: 2,
    borderRadius: 5
  },
  classTimeContainer: {
    flexGrow: 2
  },
  classTime: {
    fontWeight: '500',
    marginBottom: 5
  }
});

export default Task;