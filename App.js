import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Text } from 'native-base';
import * as Animatable from 'react-native-animatable';

// original video player with modal as full screen
import VideoPlayer1 from './VideoPlayer1';

// based on https://github.com/expo/videoplayer
import VideoPlayer2 from './VideoPlayer2';

// based on https://github.com/expo/videoplayer and tring to rewrite it
import VideoPlayer3 from './VideoPlayer3';

// use smallInViewPlayer  from VideoPlayer1 as the basis, and don't use a modal for fullscreen
// use fullScreen techniques from https://github.com/expo/videoplayer
import VideoPlayer4 from './VideoPlayer4';

import { Constants } from 'expo';
import { Video, ScreenOrientation } from 'expo';

const URI = "https://res.cloudinary.com/tourystory/video/upload/v1544021333/FACEBOOK-2138947072790494--d2a00850-f89c-11e8-81c6-d3965f15fa89/d39bf480-f89c-11e8-81c6-d3965f15fa89--d68bc170-f89c-11e8-81c6-d3965f15fa89.mp4";
// const URI = 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4';

const random_rgba = () => {
  var o = Math.round,
    r = Math.random,
    s = 255;
  return (
    'rgba(' +
    o(r() * s) +
    ',' +
    o(r() * s) +
    ',' +
    o(r() * s) +
    ',' +
    r().toFixed(1) +
    ')'
  );
};
const BACKGROUND_COLOR = random_rgba();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPortrait: true
    };
  }
  componentDidMount = () => {
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.ALL);
    Dimensions.addEventListener('change', this.orientationChangeHandler);
  };

  componentWillUnmount = () => {
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.PORTRAIT);
    Dimensions.removeEventListener('change', this.orientationChangeHandler);
  };

  orientationChangeHandler = async (dims) => {
    const { width, height } = dims.window;
    const isLandscape = width > height;
    this.setState({ isPortrait: !isLandscape });

    try {
      let res = await ScreenOrientation.allowAsync(
        ScreenOrientation.Orientation.ALL
      );
      console.log({ res });
    } catch (error) {
      console.log('orientationChangeHandler', { error });
      debugger;
    }
  };

  switchToLandscape = () => {
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.LANDSCAPE);
  };

  switchToPortrait = () => {
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.PORTRAIT);
  };

  onPlayComplete = () => {
    console.log('onPlayComplete');
  };

  render = () => {
    return (
      <View style={styles.container}>
        <View style={styles.statusBar} />
        <Text
          style={{
            margin: 10,
            fontSize: 24,
            color: 'black'
          }}
        >
          Video Player Demo App
        </Text>
        {this.state.isPortrait ? (
          <Animatable.View
            style={{ flex: 1, backgroundColor: '#E5CCFF' }}
            animation={this.state.isPortrait ? 'fadeInDownBig' : 'fadeOutUpBig'}
          >
            <Text>Boundary Area</Text>
          </Animatable.View>
        ) : null}
        <View
          style={{
            backgroundColor: 'rgba(255,255,255,.5)',
            padding: 5,
            display: 'flex',
            flex: 2
          }}
        >
          <VideoPlayer4
            videoProps={{
              shouldPlay: true,
              resizeMode: Video.RESIZE_MODE_CONTAIN,
              source: {
                uri: URI
              }
            }}
            isPortrait={this.state.isPortrait}
            switchToLandscape={this.switchToLandscape}
            switchToPortrait={this.switchToPortrait}
            playFromPositionMillis={0}
            isLooping={false}
            showTimeStamp={true}
          />
        </View>
        {this.state.isPortrait ? (
          <Animatable.View
            style={{ flex: 1, backgroundColor: 'rgba(255,255,255,.5)' }}
            animation={this.state.isPortrait ? 'fadeInUpBig' : 'fadeOutDownfadeInUpBig'}
          >
            <Text>Boundary Area</Text>
          </Animatable.View>
        ) : null}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `${BACKGROUND_COLOR}`
  },
  statusBar: {
    backgroundColor: '#6600cc',
    height: Constants.statusBarHeight,
    elevation: 2,
    shadowOffset: { width: 5, height: 3 },
    shadowColor: 'black',
    shadowOpacity: 0.5
  }
});
