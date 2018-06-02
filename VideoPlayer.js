import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import PlaybackSlider from './PlaybackSlider';
import PlaybackTimeStamp from './PlaybackTimeStamp';
import {
  GetPlayButtonByStatus,
  GetReplayButtonByStatus
} from './VideoPlayerUI';
import { Video } from 'expo';
import { View } from 'react-native';

class VideoPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playStatus: 'LOADING'
    };
  }

  getResizeMode = (mode) => {
    switch (mode) {
      case 'COVER':
        return Video.RESIZE_MODE_COVER;
      default:
        return Video.RESIZE_MODE_COVER;
    }
  };

  onReplayPress = () => {
    console.log('onReplayPress');
  };

  onPlayPress = () => {
    console.log('onPlayPress');
  };

  onPausePress = () => {
    console.log('onPausePress');
  };
  render() {
    return (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Video
          style={{ flex: 1 }}
          source={{ uri: this.props.uri }}
          rate={this.props.rate}
          volume={this.props.volume}
          resizeMode={this.props.resizeMode}
          shouldPlay={this.props.shouldPlay}
          isLooping={this.props.isLooping}
        />
        <View style={{ flexDirection: 'row' }}>
          {GetPlayButtonByStatus({
            playStatus: this.playStatus,
            onPlayPress: this.onPlayPress,
            onPausePress: this.onPausePress
          })}
          {this.props.showPlaybackSlider ? (
            <PlaybackSlider
              maximumValue={this.state.maxSliderValue}
              onValueChange={this.onSliderValueChange}
              value={this.state.currentSliderValue}
              width={this.progressBarWidth}
            />
          ) : null}
          {GetReplayButtonByStatus({
            playStatus: this.playStatus,
            onReplayPress: this.onReplayPress
          })}
        </View>
      </View>
    );
  }
}

export default VideoPlayer;

VideoPlayer.propTypes = {
  timeStampStyle: PropTypes.object,
  showTimeStamp: PropTypes.bool,
  showPlaybackSlider: PropTypes.bool,
  showDebug: PropTypes.bool
};

VideoPlayer.defaultProps = {
  timeStampStyle: {
    color: 'blue',
    fontSize: 24
  },
  showTimeStamp: true,
  showPlaybackSlider: true,
  showDebug: false
};
