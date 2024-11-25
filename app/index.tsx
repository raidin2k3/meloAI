import { Text, View, StyleSheet, TextInput, Pressable } from "react-native";
import React, { useRef } from "react";

export default function Index() {
  const inputRef = useRef<TextInput>(null);

  const handlePress = () => {
    inputRef.current?.focus();
  };
  return (
    <View style={styles.container}>
      <TextInput style={styles.inputHolder} placeholder="What's on your mind?" placeholderTextColor={'grey'} ref={inputRef}></TextInput>
      <View style={styles.instruct}>
        <Pressable style={styles.help}>
          <Text style={styles.helpText}>Tesla</Text>
        </Pressable>
        <Pressable style={styles.help}>
          <Text style={styles.helpText}>Apple</Text>
        </Pressable>
        <Pressable style={styles.help}>
          <Text style={styles.helpText}>Nvidia</Text>
        </Pressable>
        <Pressable style={styles.help}>
          <Text style={styles.helpText}>Meta</Text>
        </Pressable>
        <Pressable style={styles.help}>
          <Text style={styles.helpText}>Google</Text>
        </Pressable>
      </View>
      <View style={styles.result}>
        <View style={styles.resultrow}>
          <Text style={styles.resultset}>Negative :</Text>
          <Text style={styles.resultval}>33.33%</Text>
        </View>
        <View style={styles.resultrow}>
          <Text style={styles.resultset}>Positive :</Text>
          <Text style={styles.resultval}>33.33%</Text>
        </View>
        <View style={styles.resultrow}>
          <Text style={styles.resultset}>Neutral :</Text>
          <Text style={styles.resultval}>33.33%</Text>
        </View>
        <View style={styles.resultrow}>
          <Text style={styles.resultset}>Overall :</Text>
          <Text style={styles.resultval}>🟡 (skeptical)</Text>
        </View>
      </View>
      <View style={styles.loader}>
        <Text style={styles.loadertext}>... Analyzing ...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'black',
    padding: 10
  },
  inputHolder:{
    height: 55,
    width: 350,
    borderWidth: 0.75,
    borderColor: 'white',
    borderRadius: 50,
    color: 'white',
    fontSize: 12,
    paddingLeft: 25,
  },
  instruct:{
    margin: 15,
    height: 30,
    width: 350,
    borderWidth: 0.75,
    // borderColor: 'grey',
    borderRadius: 15,
    flexDirection: 'row',
    paddingLeft: 4,
  },
  help:{
    backgroundColor: 'white',
    color: 'black',
    height: 30,
    width: 62,
    borderRadius: 20,
    marginRight: 8,
  },
  helpText:{
    height: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 12,
  },
  result:{
    margin: 5,
    height: 200,
    width: 350,
    borderWidth: 0.75,
    borderColor: 'white',
    borderRadius: 15,
    flexDirection: 'column'
  },
  resultrow:{
    height: 50,
    textAlignVertical: 'center',
    flexDirection: 'row'
    // backgroundColor: 'white',
  },
  resultset:{
    color: 'grey',
    height: 50,
    width: 100,
    textAlignVertical: 'center',
    textAlign: 'center',
    // backgroundColor: 'red'
  },
  resultval:{
    color: 'white',
    height: 50,
    width: 100,
    textAlignVertical: 'center',
    // backgroundColor: 'green',
  },
  loader:{
    margin: 5,
    height: 25,
    width: 350,
    borderWidth: 0.75,
    // borderColor: 'white',
  },
  loadertext:{
    color: 'white',
    textAlign: 'center',
    fontFamily: 'sans-serif',
    fontSize: 12,
  },
})
