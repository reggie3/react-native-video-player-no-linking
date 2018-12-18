import React from 'react';
import { View, StyleSheet, Slider } from 'react-native';
// import Slider from 'react-native-slider';

const PlaybackSlider = (props) => {
  return (
    <View style={sliderStyles.container}>
      <Slider

        minimimValue={0}
        maximumValue={props.maximumValue}
        value={props.value}
        onSlidingComplete={props.onValueChange}
      />
    </View>
  );
};

export default PlaybackSlider;

const sliderStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 0,
    marginRight: 0,
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  track: {
    height: 18,
    borderRadius: 1,
    backgroundColor: '#d5d8e8'
  },
  thumb: {
    width: 20,
    height: 30,
    borderRadius: 1,
    backgroundColor: '#838486'
  }
});
