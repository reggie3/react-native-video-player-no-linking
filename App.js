import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RkText } from 'react-native-ui-kitten';
import VideoPlayer from './VideoPlayer';
import { Constants } from 'expo';

const URI = 'http://res.cloudinary.com/tourystory/video/upload/v1525517881/Best_of_Cats_in_2_Minutes_-_Funny_cats_compilation_ucdmjp.mp4';

export default class App extends React.Component {
  onPlayComplete = () => {
    console.log('onPlayComplete')
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBar} />
        <RkText
          style={{
            margin: 10,
            fontSize: 24,
            color: 'black'
          }}
        >
          Video Player Demo App
        </RkText>

        <View
          style={{
            backgroundColor: 'lightblue',
            padding: 5,
            display: 'flex',
            flex: 1
          }}
        >
          <VideoPlayer
            uri={URI}
            rate={1.0}
            volume={1.0}
            /* resizeMode={RESIZE_MODE_COVER} */
            shouldPlay={false}
            isLooping={this.props.isLooping}
            onPlayComplete={this.onPlayComplete}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#eee'
  },
  statusBar: {
    backgroundColor: '#C2185B',
    height: Constants.statusBarHeight
  }
});
