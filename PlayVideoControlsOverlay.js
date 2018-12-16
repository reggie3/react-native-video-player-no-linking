import React from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  View
} from 'react-native';
import {
  GetPlayButtonByStatus,
  GetReplayButtonByStatus
} from './VideoPlayerUI';
import * as Animatable from 'react-native-animatable';

/***************************************
 * 
 * A transparent touchable view that contains the video playback controls
 * The view will display the controls when touched, and hide them other wise
 */
class PlayVideoControlsOverlay extends React.Component {
  render() {
    return (
      <Animatable.View
        style={{
          ...StyleSheet.absoluteFillObject,
          display: 'flex'
        }}
        animation={this.props.showControls ? 'fadeIn' : 'fadeOut'}
        useNativeDriver
      >
        <TouchableOpacity
          style={{
            backgroundColor: 'rgba(100,0,0,0)',
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1
          }}
          onPress={this.props.onControlLayerPressed}
        >
          {this.props.showControls ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'absolute',
                width: 150
              }}
            >
              {GetPlayButtonByStatus({
                playStatus: this.props.playStatus,
                onPlayPress: this.props.onPlayPress,
                onPausePress: this.props.onPausePress
              })}
              {GetReplayButtonByStatus({
                playStatus: this.props.playStatus,
                onReplayPress: this.props.onReplayPress
              })}
            </View>
          ) : null}
        </TouchableOpacity>
      </Animatable.View>
    );
  }
}

export default PlayVideoControlsOverlay;
