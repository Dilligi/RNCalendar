import React, { useState } from "react";
import { View, Button, StyleSheet, TouchableOpacity, Text, TextInput } from "react-native";
import { getGroupURL } from "../utils/getGroupURL";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

export default function Login({ navigation }) {
  let [group, setGroup] = useState('')
  let [isWrong, setIsWrong] = useState(false)
  let [isLoading, setIsLoading] = useState(false)
  let [loadingError, setLoadingError] = useState(false)

  function changeGroup(e) {
    setGroup(e)
  }

  function clickEnterBtn(e) {
    let curGroup = group.trim()

    setIsLoading(true)
    let groupReg = /(КТ|РТ|УЭ)([а-я]{2})(\d-(\d)+)/;
    
    if (!curGroup.match(groupReg)) {
      setIsWrong(true)
      return;
    }
    else setIsWrong(false)

    getGroupURL(curGroup)
    .then((url) => {

      if (!url) {
        setIsWrong(true)
        return null;
      }

      return Promise.all([
        AsyncStorage.setItem('group-url', url),
        AsyncStorage.setItem('group-name', curGroup)
      ])
    })
    .then((res) => {
      if(res) {
        setIsLoading(false)
        navigation.navigate('Home')
      }
    })
    .catch(() => {
      setIsLoading(false)
      setLoadingError(true)
      setTimeout(() => {
        setLoadingError(false)
      }, 3000)
    })
  }

  if (loadingError) {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.error_text}>Проблема соединения с сетью. Пожалуйста, повторите попытку позже</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        {
          isLoading ? (
            <Text>Loading...</Text>
          ) : (
            <>
              <View style={styles.input_container}>
                <TextInput 
                  style={[styles.input, isWrong ? styles.wrong_input : null]}
                  placeholder="Номер группы"
                  onChangeText={changeGroup}
                  value={group}
                />
                {
                  isWrong ? (
                    <Text style={styles.wrong_text}>
                      Неправильно введен номер группы
                    </Text>
                  ) : null
                }
              </View>
              <TouchableOpacity onPress={clickEnterBtn} style={styles.btn}>
                <Text style={styles.btnText}>
                Войти
                </Text>
              </TouchableOpacity>
            </>
          )
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    display: 'flex',
    backgroundColor: '#66B6FF',
    paddingHorizontal: 67,
    paddingVertical: 13,
    borderRadius: 10,
    color: 'white'
  },
  btnText: {
    color: 'white'
  },
  input_container: {
    marginBottom: 17,
  }, 
  input: {
    padding: 10,
    borderColor: '#000000',
    borderWidth: 0.3,
    minWidth: 235,
    borderRadius: 10,
  },
  wrong_input: {
    borderColor: 'red'
  }, 
  wrong_text: {
    fontSize: 10,
    color: 'red'
  },
  error_text: {
    maxWidth: 250,
    textAlign: 'center'
  }
});