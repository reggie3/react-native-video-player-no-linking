import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import PlaybackSlider from './PlaybackSlider';
import PlaybackTimeStamp from './PlaybackTimeStamp';
import {
  GetPlayButtonByStatus,
  GetReplayButtonByStatus
} from './VideoPlayerUI';
import { Video } from 'expo';
import { View } from 'react-native';

const initialState = {
  playStatus: 'LOADING',
  videoSize: {},
  durationMillis: 0,
  positionMillis: 0,
  viewDimensions: {
    width: 0
  }
};
class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState
    };
  }

  componentWillUnmount = () => {
    this.videoPlayer.unloadAsync();
  };

  getResizeMode = (mode) => {
    switch (mode) {
      case 'COVER':
        return Video.RESIZE_MODE_COVER;
      default:
        return Video.RESIZE_MODE_COVER;
    }
  };

  onReplayPress = () => {
    this.videoPlayer.replayAsync();
  };

  onPlayPress = () => {
    this.videoPlayer.playAsync();
  };

  onPausePress = () => {
    this.videoPlayer.pauseAsync();
  };

  onSliderValueChange = (value) => {
    this.videoPlayer.setPositionAsync(value);
  };

  onPlaybackStatusUpdate = (status) => {
    if (status.isBuffering) {
      this.setState({
        playStatus: 'BUFFERING',
        playableDurationMillis: status.playableDurationMillis
      });
    } else if (status.isLoaded) {
      this.setState({
        playStatus: 'STOPPED',
        playableDurationMillis: status.playableDurationMillis,
        durationMillis: status.durationMillis
      });
      if (status.isPlaying) {
        this.setState({
          playStatus: 'PLAYING',
          positionMillis: status.positionMillis,
          playableDurationMillis: status.playableDurationMillis
        });
      }
    } else {
      if (this.props.onError) {
        this.props.onError({
          msg: 'Unhandled playback status in onPlaybackStatusUpdate: ',
          status
        });
      }
    }
  };

  onReadyForDisplay = ({ naturalSize, status }) => {
    this.setState({
      videoSize: naturalSize,
      durationMillis: status.durationMillis,
      positionMillis: status.positionMillis
    });
  };

  setLayoutInformation = ({
    nativeEvent: { layout: { x, y, width, height } = {} } = {}
  }) => {
    if (!this.state.viewDimensions.width) {
      this.setState({
        viewDimensions: {
          x,
          y,
          width,
          height
        }
      });
    }
  };

  render() {
    return (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 5
        }}
      >
        <View
          style={{
           width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onLayout={this.setLayoutInformation}
        >
          {this.state.viewDimensions.width ? (
            <View style ={{display: 'flex',
            // backgroundColor: 'blue',
            justifyContent: 'space-around'}}>
              <Video
                ref={(component) => {
                  this.videoPlayer = component;
                }}
                style={{
                  height: this.state.viewDimensions.width - 10 * (9 / 16),
                  width: this.state.viewDimensions.width - 10,
                  elevation: 5,
                  shadowOffset: { width: 5, height: 3 },
                  shadowColor: 'black',
                  shadowOpacity: 0.5
                }}
                source={{
                  uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'
                }} //{this.props.uri }
                rate={this.props.rate}
                volume={this.props.volume}
                resizeMode={Video.RESIZE_MODE_CONTAIN}
                shouldPlay={this.props.shouldPlay}
                isLooping={this.props.isLooping}
                onPlaybackStatusUpdate={this.onPlaybackStatusUpdate}
                onReadyForDisplay={this.onReadyForDisplay}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  margin: 5,
                  // backgroundColor: 'orange'
                }}
              >
                {GetPlayButtonByStatus({
                  playStatus: this.state.playStatus,
                  onPlayPress: this.onPlayPress,
                  onPausePress: this.onPausePress
                })}
                {this.props.showPlaybackSlider ? (
                  <PlaybackSlider
                    maximumValue={this.state.durationMillis}
                    onValueChange={this.onSliderValueChange}
                    value={this.state.positionMillis}
                  />
                ) : null}
                {this.props.showTimeStamp ? (
                  <View style={{ marginHorizontal: 3 }}>
                    <PlaybackTimeStamp
                      playStatus={this.state.playStatus}
                      positionMillis={this.state.positionMillis}
                      durationMillis={this.state.durationMillis}
                      timeStampStyle={this.props.timeStampStyle}
                    />
                  </View>
                ) : null}
                {GetReplayButtonByStatus({
                  playStatus: this.playStatus,
                  onReplayPress: this.onReplayPress
                })}
              </View>
            </View>
          ) : (
            <ActivityIndicator size="large" color="green" />
          )}
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
    color: '#222222',
    fontSize: 20
  },
  showTimeStamp: true,
  showPlaybackSlider: true,
  showDebug: false
};
