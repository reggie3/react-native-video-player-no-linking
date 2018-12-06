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
    marginLeft: 10,
    marginRight: 10,
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

var customStyles4 = StyleSheet.create({
  track: {
    height: 10,
    borderRadius: 4,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 1,
    shadowOpacity: 0.15,
  },
  thumb: {
    width: 20,
    height: 20,
    backgroundColor: '#ccffcc',
    borderColor: '#0aaf00',
    borderWidth: 5,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 2,
    shadowOpacity: 0.35,
  }
});