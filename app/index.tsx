import { Text, View, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import React, { useRef } from "react";

export default function Index() {
  const inputRef = useRef<TextInput>(null);

  const handlePress = () => {
    inputRef.current?.focus();
  };
  return (
    <View style={styles.container}>
      <View style={styles.holder}>
        <Text style={styles.text1}>Search</Text>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <TextInput style={styles.inputHolder} value="What's on your mind?" ref={inputRef}></TextInput>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    justifyContent: 'flex-start',
  },
  holder: {
    backgroundColor: 'black',
    height: 160,
    width: 325,
    borderWidth: 0.75,
    borderRadius: 30,
    borderColor: 'grey',
    marginTop: 30,
    elevation: 30,
    shadowColor: 'lightgreen',
    alignItems: 'center',
    alignContent:'center'
  },
  text1:{
    color: 'white',
    padding: 30,
    textAlign: 'center',
    fontFamily: 'sans-serif',
    fontSize: 14
  },
  inputHolder:{
    height: 55,
    width: 275,
    borderWidth: 0.75,
    borderColor: 'grey',
    borderRadius: 50,
    color: 'grey',
    fontSize: 12,
    paddingLeft: 25,
  }
})
