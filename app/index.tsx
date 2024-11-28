import { Text, View, StyleSheet, TextInput, Pressable, Keyboard, Animated } from "react-native";
import React, { useRef , useState, useEffect } from "react";
import axios from "axios";

export default function Index() {
  const inputRef = useRef<TextInput>(null);

  const [inputText, setInputText] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [sentiment, setSentiment] = useState(null);  // State to store sentiment
  const [error, setError] = useState(null);  // State for handling errors
  const [negativeSentiment, setNegativeSentiment] = useState(null);  // State for storing Negative sentiment
  const [positiveSentiment, setPositiveSentiment] = useState(null);
  const [neutralSentiment, setNeutralSentiment] = useState(null);
  const [overallSentiment, setOverallSentiment] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null); // Whether animation should be running

  const [dotColor1] = useState(new Animated.Value(0)); // For left dot color
  const [dotColor2] = useState(new Animated.Value(0)); // For middle dot color
  const [dotColor3] = useState(new Animated.Value(0)); // For right dot color
  const animationLoop = useRef<Animated.CompositeAnimation | null>(null); // Type it as CompositeAnimation or null

  // Function to animate the dots (fade in/out and color change)
  const animateDots = () => {
    // Animate the dots in sequence
    animationLoop.current = Animated.loop(
      Animated.sequence([
        // Fade in dots to white (using color change)
        Animated.parallel([
          Animated.timing(dotColor1, {
            toValue: 1, // 1 means white
            duration: 500,
            useNativeDriver: false, // Color animations do not support native driver
          }),
          Animated.timing(dotColor2, {
            toValue: 1, // 1 means white
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(dotColor3, {
            toValue: 1, // 1 means white
            duration: 500,
            useNativeDriver: false,
          }),
        ]),
        // Fade out dots to black (using color change)
        Animated.parallel([
          Animated.timing(dotColor1, {
            toValue: 0, // 0 means black
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(dotColor2, {
            toValue: 0, // 0 means black
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(dotColor3, {
            toValue: 0, // 0 means black
            duration: 500,
            useNativeDriver: false,
          }),
        ]),
      ])
    )
    // Start the animation loop
    animationLoop.current.start();
  };

  // Interpolate the color values from 0 (black) to 1 (white)
  const dotInterpolation1 = dotColor1.interpolate({
    inputRange: [0, 1],
    outputRange: ['#000', '#fff'], // Black to white color
  });

  const dotInterpolation2 = dotColor2.interpolate({
    inputRange: [0, 1],
    outputRange: ['#000', '#fff'], // Black to white color
  });

  const dotInterpolation3 = dotColor3.interpolate({
    inputRange: [0, 1],
    outputRange: ['#000', '#fff'], // Black to white color
  });

  const handleSubmit = async (displayText:any, action:any) => {
    // Trigger the animation and set analyzing state to true
    setIsAnalyzing(' Analyzing ');
    animateDots();
    try {
      const link = 'https://8845-115-247-147-18.ngrok-free.app'
      const response = await axios.post(link + '/process', {
        user_input: displayText,
        action: action, // 'search' or 'generate'
      });
  
      // console.log(response.data);
  
      if (action === 'search') {
        console.log('Sentiment:', response.data.sentiment);
        const negative = response.data?.negative; // Access 'Negative' inside 'sentiment'
        setNegativeSentiment(negative);  // Set the Negative sentiment value in state
        const positive = response.data?.positive;
        setPositiveSentiment(positive);
        const neutral = response.data?.neutral;
        setNeutralSentiment(neutral);

        let overall = '';

        if (positive > neutral && positive > negative) {
          overall = '🟢 (good to go)';  // Positive sentiment is the highest
        } else if (negative > neutral && negative > positive) {
          overall = '🔴 (red flag)';  // Negative sentiment is the highest
        } else if (neutral > positive && neutral > negative) {
          overall = '🟡 (skeptical)';  // Neutral sentiment is the highest
        } else if (positive === negative && positive === neutral) {
          overall = '🟡 (skeptical)';  // In case of tie, default to neutral
        }
        setOverallSentiment(overall);

        // Display the overall sentiment
        console.log('Overall Sentiment:', overallSentiment);
        if (animationLoop.current) {
          animationLoop.current.stop(); // Stop the animation loop only if it exists
          Animated.timing(dotColor1, {
            toValue: 0, // Reset to black
            duration: 0,
            useNativeDriver: false,
          }).start();
          Animated.timing(dotColor2, {
            toValue: 0, // Reset to black
            duration: 0,
            useNativeDriver: false,
          }).start();
          Animated.timing(dotColor3, {
            toValue: 0, // Reset to black
            duration: 0,
            useNativeDriver: false,
          }).start();
          setIsAnalyzing('')
        }

      }
      else if (action === 'generate') {
        console.log('Generated Text:', response.data.generated_text);
      }
    } catch (error:any) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.inputHolder} 
        placeholder="What's on your mind?" 
        placeholderTextColor={'grey'} 
        ref={inputRef}
        onChangeText={setInputText} // Updates state as you type
        onSubmitEditing={(e) => handleSubmit(e.nativeEvent.text, 'search')} // Passes the input text when "Done" is pressed
        returnKeyType="done" // Set the keyboard return key
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
  dots: {
    fontSize: 20,
  },
})
