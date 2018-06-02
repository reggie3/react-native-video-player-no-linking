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
            backgroundColor: '#F0D3C9',
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
            timeStampStyle={{ 
              color: '#ff22ff',
              fontSize: 20
          }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#D3F0C9'
  },
  statusBar: {
    backgroundColor: '#D3F0C9',
    height: Constants.statusBarHeight,
    elevation: 2,
    shadowOffset: {width: 5, height: 3},
    shadowColor: 'black',
    shadowOpacity: 0.5,
  }
});
