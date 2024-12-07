import { Text, View, StyleSheet, TextInput, Pressable, Keyboard, Animated, ScrollView } from "react-native";
import React, { useRef , useState, useEffect } from "react";
import axios from "axios";
import * as Clipboard from 'expo-clipboard';

export default function Index() {
  const inputRef = useRef<TextInput>(null);

  const [inputText, setInputText] = useState("");
  const [getText, setDisplayText] = useState("");
  const [sentiment, setSentiment] = useState(null); 
  const [error, setError] = useState(null);  
  const [negativeSentiment, setNegativeSentiment] = useState(null);  
  const [positiveSentiment, setPositiveSentiment] = useState(null);
  const [neutralSentiment, setNeutralSentiment] = useState(null);
  const [overallSentiment, setOverallSentiment] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null); 

  const [responseData, setResponseData] = useState<string | null>(null);

  const [dotColor1] = useState(new Animated.Value(0)); 
  const [dotColor2] = useState(new Animated.Value(0)); 
  const [dotColor3] = useState(new Animated.Value(0)); 
  const animationLoop = useRef<Animated.CompositeAnimation | null>(null); 

  
  const animateDots = () => {
  
    animationLoop.current = Animated.loop(
      Animated.sequence([
      
        Animated.parallel([
          Animated.timing(dotColor1, {
            toValue: 1, 
            duration: 500,
            useNativeDriver: false, 
          }),
          Animated.timing(dotColor2, {
            toValue: 1, 
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(dotColor3, {
            toValue: 1, 
            duration: 500,
            useNativeDriver: false,
          }),
        ]),
    
        Animated.parallel([
          Animated.timing(dotColor1, {
            toValue: 0, 
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(dotColor2, {
            toValue: 0, 
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(dotColor3, {
            toValue: 0, 
            duration: 500,
            useNativeDriver: false,
          }),
        ]),
      ])
    )
    animationLoop.current.start();
  };

  const dotInterpolation1 = dotColor1.interpolate({
    inputRange: [0, 1],
    outputRange: ['#000', '#fff'], 
  });

  const dotInterpolation2 = dotColor2.interpolate({
    inputRange: [0, 1],
    outputRange: ['#000', '#fff'],
  });

  const dotInterpolation3 = dotColor3.interpolate({
    inputRange: [0, 1],
    outputRange: ['#000', '#fff'], 
  });

  const handleCopy = async (textToCopy:any) => {
    await Clipboard.setStringAsync(textToCopy);
    console.log('text copied successfully');
  };

  const handleSubmit = async (displayText:any, action:any) => {
    setDisplayText(displayText);
    if(action=='generate'){
      setIsAnalyzing(' Generating ')
    }
    else{
      setIsAnalyzing(' Analyzing ');
    }
    animateDots();
    try {
      const link = ''                                             // paste your ngrok link generated on melony - all_in_1.ipynb file here
      const response = await axios.post(link + '/process', {
        user_input: displayText,
        action: action, 
      });
  
      // console.log(response.data);
  
      if (action === 'search') {
        console.log('Sentiment:', response.data.sentiment);
        const negative = response.data?.negative; 
        setNegativeSentiment(negative); 
        const positive = response.data?.positive;
        setPositiveSentiment(positive);
        const neutral = response.data?.neutral;
        setNeutralSentiment(neutral);

        let overall = '';

        if (positive > neutral && positive > negative) {
          overall = '🟢 (good to go)';  
        } else if (negative > neutral && negative > positive) {
          overall = '🔴 (red flag)';  
        } else if (neutral > positive && neutral > negative) {
          overall = '🟡 (skeptical)';  
        } else if (positive === negative && positive === neutral) {
          overall = '🟡 (skeptical)'; 
        }
        setOverallSentiment(overall);

        // console.log('Overall Sentiment:', overallSentiment);
      }
      else if (action === 'generate') {
        // console.log('Generated Text:', response.data.generated_text);
        setResponseData(response.data.generated_text);
      }
    } catch (error:any) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
    finally {
      if (animationLoop.current) {
        animationLoop.current.stop(); 
        Animated.timing(dotColor1, {
          toValue: 0, 
          duration: 0,
          useNativeDriver: false,
        }).start();
        Animated.timing(dotColor2, {
          toValue: 0, 
          duration: 0,
          useNativeDriver: false,
        }).start();
        Animated.timing(dotColor3, {
          toValue: 0, 
          duration: 0,
          useNativeDriver: false,
        }).start();
        setIsAnalyzing('')
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.inputHolder} 
        placeholder="What's on your mind?" 
        placeholderTextColor={'grey'} 
        ref={inputRef}
        onChangeText={setInputText} 
        onSubmitEditing={(e) => handleSubmit(e.nativeEvent.text, 'search')} 
        returnKeyType="done" 
      />
      <View style={styles.instruct}>
        <Pressable style={styles.help} onPress={() => handleSubmit('Tesla', 'search')}>
          <Text style={styles.helpText}>Tesla</Text>
        </Pressable>
        <Pressable style={styles.help} onPress={() => handleSubmit('Apple', 'search')}>
          <Text style={styles.helpText}>Apple</Text>
        </Pressable>
        <Pressable style={styles.help} onPress={() => handleSubmit('Nvidia', 'search')}>
          <Text style={styles.helpText}>Nvidia</Text>
        </Pressable>
        <Pressable style={styles.help} onPress={() => handleSubmit('Meta', 'search')}>
          <Text style={styles.helpText}>Meta</Text>
        </Pressable>
        <Pressable style={styles.help} onPress={() => handleSubmit('Google', 'search')}>
          <Text style={styles.helpText}>Google</Text>
        </Pressable>
      </View>
      <View style={styles.result}>
        <View style={styles.resultHolder}>
          <View style={styles.resultrow}>
            <Text style={styles.resultset}>Negative :</Text>
            <Text style={styles.resultval}>{negativeSentiment}</Text>
          </View>
          <View style={styles.resultrow}>
            <Text style={styles.resultset}>Positive :</Text>
            <Text style={styles.resultval}>{positiveSentiment}</Text>
          </View>
          <View style={styles.resultrow}>
            <Text style={styles.resultset}>Neutral :</Text>
            <Text style={styles.resultval}>{neutralSentiment}</Text>
          </View>
          <View style={styles.resultrow}>
            <Text style={styles.resultset}>Overall :</Text>
            <Text style={styles.resultval}>{overallSentiment}</Text>
          </View>
        </View>
      </View>
      <View style={styles.loader}>
        <Text style={styles.loadertext}>
            <Animated.Text style={[styles.dots, { color: dotInterpolation1 }]}>.</Animated.Text>
            <Animated.Text style={[styles.dots, { color: dotInterpolation2 }]}>.</Animated.Text>
            <Animated.Text style={[styles.dots, { color: dotInterpolation2 }]}>.</Animated.Text>
            <Animated.Text style={[styles.dots, { color: dotInterpolation2 }]}>.</Animated.Text>
            <Animated.Text style={[styles.dots, { color: dotInterpolation2 }]}>.</Animated.Text>
            {isAnalyzing}
            <Animated.Text style={[styles.dots, { color: dotInterpolation2 }]}>.</Animated.Text>
            <Animated.Text style={[styles.dots, { color: dotInterpolation3 }]}>.</Animated.Text>
            <Animated.Text style={[styles.dots, { color: dotInterpolation2 }]}>.</Animated.Text>
            <Animated.Text style={[styles.dots, { color: dotInterpolation2 }]}>.</Animated.Text>
            <Animated.Text style={[styles.dots, { color: dotInterpolation2 }]}>.</Animated.Text>
        </Text>
      </View>
      <View style={styles.genTextHolder}>
        <ScrollView style = {styles.gen2}> 
          <Text style={styles.generatedTex}>
            {responseData}
          </Text>
        </ScrollView>
      </View>
      <View style={styles.copy}>
        <Pressable style={styles.genText} onPress={() => handleSubmit(getText, 'generate')}>
          <Text style={styles.helpText}>Generate</Text>
        </Pressable>
        <Pressable style={styles.copyButton} onPress={() => handleCopy(responseData)}>
          <Text style={styles.copyText}>Copy</Text>
        </Pressable>
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
  genText:{
    backgroundColor: 'white',
    color: 'black',
    height: 40,
    width: 100,
    borderRadius: 20,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultHolder: {
    height: 200,
    // backgroundColor: 'yellow',
    width: 210,
  },
  result:{
    margin: 5,
    height: 200,
    width: 350,
    borderWidth: 0.75,
    borderColor: 'white',
    borderRadius: 15,
    flexDirection: 'row'
  },
  resultrow:{
    height: 50,
    width: 205,
    textAlignVertical: 'center',
    flexDirection: 'row',
    // backgroundColor: 'white'
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
  gen: {
    height: 200,
    // backgroundColor: 'blue',
    width: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader:{
    margin: 10,
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
  dots: {
    fontSize: 20,
  },
  genTextHolder: {
    height: 280,
    width: 350,
    borderWidth: 0.75,
    borderColor: 'white',
    borderRadius: 15,
    marginBottom: 10,
  },
  gen2: {
    maxHeight: '95%'
  },
  generatedTex: {
    color: 'white',
    padding: 15,
  },
  copy: {
    height: 60,
    width: 350,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  copyButton: {
    height: 40,
    width: 100,
    backgroundColor: 'black',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  copyText: {
    color: 'white',
    width: 33,
    fontSize: 12,
  },
})
