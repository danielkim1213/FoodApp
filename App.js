import { useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions} from 'react-native';
import Animated, {
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring,
  withRepeat,
  useAnimatedGestureHandler,
  withDecay,
  withDelay,
} from 'react-native-reanimated';
import {PanGestureHandler, GestureHandlerRootView} from 'react-native-gesture-handler';

const SIZE = 100.0;
const CIRCLE_RADIUS = 100.0;

const handleRotation = (progress) => {
  'worklet';

  return `${progress.value * Math.PI * 2}rad`;
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


export default function App() {
  const progress = useSharedValue(1);
  const scale = useSharedValue(2);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      borderRadius: (progress.value * SIZE)/2,
      transform: [{scale: scale.value}, {rotate: handleRotation(progress)}, {translateX: translateX.value}, {translateY: translateY.value}, ],
    };
  }, []);

  useEffect(() => {
    progress.value = withRepeat(withTiming(0.5, {duration: 500}), 5, true);
    scale.value = withRepeat(withSpring(1, {duration: 500}), 5, true);
  }, [])

  const panGestureEvent = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.translateX = translateX.value;
      context.translateY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = context.translateX - event.translationX;
      translateY.value = context.translateY - event.translationY;
    },
    onEnd: () => {
      const distance = Math.sqrt(translateX.value ** 2 + translateY.value **2);
      if(distance < CIRCLE_RADIUS){
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  return (
    <View style={styles.container}>
      <GestureHandlerRootView style={styles.gestureContainer}>
        <View style={{width: CIRCLE_RADIUS*2, height: CIRCLE_RADIUS*2, borderRadius: CIRCLE_RADIUS*0.7, alignItems: 'center', justifyContent: 'center', borderColor: 'black', borderWidth: 5, }}>
          <PanGestureHandler onGestureEvent={panGestureEvent}>
            <Animated.View
              style={[
                { height: SIZE, width: SIZE, backgroundColor: 'blue'},
                reanimatedStyle,
              ]}
            />
          </PanGestureHandler>
        </View>
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gestureContainer: {
    height: screenHeight,
    width: screenWidth,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
