import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'native-base';
import VideoPlayer from './VideoPlayer';
import { Constants } from 'expo';

const URI = 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4';

export default class App extends React.Component {
  onPlayComplete = () => {
    console.log('onPlayComplete');
  };

  render() {
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

        <View
          style={{
            backgroundColor: '#F0D3C9',
            padding: 5,
            display: 'flex',
            flex: 1
          }}
        >
          <VideoPlayer
            uri={{uri: URI}}
            rate={1.0}
            volume={1.0}
            /* resizeMode={RESIZE_MODE_COVER} */
            shouldPlay={false}
            isLooping={this.props.isLooping}
            onPlayComplete={this.onPlayComplete}
            timeStampStyle={{
              color: '#000000',
              fontSize: 20
            }}
            onError={(error) => {
              console.log({ error });
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
    shadowOffset: { width: 5, height: 3 },
    shadowColor: 'black',
    shadowOpacity: 0.5
  }
});
