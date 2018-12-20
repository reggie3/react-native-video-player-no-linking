import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'native-base';

// use smallInViewPlayer  from VideoPlayer1 as the basis, and don't use a modal for fullscreen
// use fullScreen techniques from https://github.com/expo/videoplayer
import VideoPlayer from './VideoPlayer';

import { Constants, Video, ScreenOrientation } from 'expo';

const URI = 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4';


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
      isFullScreen: false
    };
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.PORTRAIT);
  }

  toggleFullScreenCallback = () => {
    this.setState({ isFullScreen: !this.state.isFullScreen }, () => {
      console.log({ isFullScreen: this.state.isFullScreen });
    });
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
        {this.state.isFullScreen ? null : (
          <View style={{ flex: 1, backgroundColor: '#E5CCFF' }}>
            <Text>Boundary Area</Text>
          </View>
        )}

        <View
          style={{
            backgroundColor: 'rgba(25,100,255,0)',
            padding: 15,
            display: 'flex',
            flex: 2,
          }}
        >
          <VideoPlayer
            videoProps={{
              shouldPlay: true,
              resizeMode: Video.RESIZE_MODE_CONTAIN,
              source: {
                uri: URI
              }
            }}
            toggleFullScreenCallback={this.toggleFullScreenCallback}
            playCompleteCallback={() => {
              console.log('play complete');
            }}
            playFromPositionMillis={0}
            isLooping={false}
            showTimeStamp={true}
            playerPadding={10}
          />
        </View>
        {this.state.isFullScreen ? null : (
          <View
            style={{ flex: 1, backgroundColor: 'rgba(255,255,255,.5)' }}
          >
            <Text>Boundary Area</Text>
          </View>
        )}
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
