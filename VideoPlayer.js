import React, { Component } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
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
  positionMillis: 0
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
      debugger;
    }
  };

  onReadyForDisplay = ({ naturalSize, status }) => {
    this.setState({
      videoSize: naturalSize,
      durationMillis: status.durationMillis,
      positionMillis: status.positionMillis
    });
  };

  render() {
    const videoWidth = Dimensions.get('window').width;
    const videoHeight = videoWidth * (9 / 16);

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
          ref={(component) => {
            this.videoPlayer = component;
          }}
          style={{
            height: videoHeight,
            width: videoWidth,
            elevation: 5,
            shadowOffset: { width: 5, height: 3 },
            shadowColor: 'black',
            shadowOpacity: 0.5
          }}
          source={{ uri: this.props.uri }}
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
            margin: 5
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
              <View style={{marginHorizontal: 3}}>
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
