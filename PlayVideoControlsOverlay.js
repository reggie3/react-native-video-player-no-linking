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
  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.showControls !== prevProps.showControls) {
      console.log(
        'showControls changed: this.props.showControls = ',
        this.props.showControls, this.props.source
      );
    }
  };
  render() {
    return (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          display: 'flex',
          bottom: 30,   // avoid the playback overlay that displays the status bar
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: this.props.backgroundColor || 'rgba(100,0,0,0)',
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
      </View>
    );
  }
}

export default PlayVideoControlsOverlay;

/****************
 * 
 * 
 * 
 * <Animatable.View
        style={{
          ...StyleSheet.absoluteFillObject,
          display: 'flex'
        }}
        animation={this.props.showControls ? 'fadeIn' : 'fadeOut'}
        useNativeDriver
      > 
      </Animatable.View> 


 */
