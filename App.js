import { useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions} from 'react-native';
import Animated, {
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring,
  withRepeat,
  useAnimatedGestureHandler,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import {PanGestureHandler, GestureHandlerRootView} from 'react-native-gesture-handler';
import {Page} from './Page';

const WORDS = [ "My", "name", "is", "Daniel", "Kim"];

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


export default function App() {
  const translateX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    translateX.value = event.contentOffset.x;
  });


  return (
    <Animated.ScrollView
      onScroll={scrollHandler}
      pagingEnabled
      scrollEventThrottle={16}
      horizontal
      style={styles.container}
     >
      {WORDS.map((title, index) => {
        return (
          <Page
            key={index.toString()}
            title={title}
            translateX={translateX}
            index={index}
          />
        );
      })}
    </Animated.ScrollView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
