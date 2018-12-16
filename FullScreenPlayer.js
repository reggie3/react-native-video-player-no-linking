import React from 'react';
import { Modal, View, StyleSheet, Dimensions } from 'react-native';
import { Video, takeSnapshotAsync } from 'expo';
import PlaybackStatusOverlay from './PlaybackStatusOverlay';
import PlayVideoControlsOverlay from './PlayVideoControlsOverlay';

class FullScreenPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screenDimensions: Dimensions.get('window'),
      isReady: false,
      showControls: true,
      playStatus: 'LOADING',
      videoSize: {},
      durationMillis: 0,
      positionMillis: 0
    };
    this.videoPlayer = null;
  }

  componentWillUnmount = () => {
    this.videoPlayer.unloadAsync();
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (!prevProps.visible && this.props.visible) {
      // console.log('switch to full screen player');
    }
    if (prevProps.visible && !this.props.visible) {
      // console.log('switch to SMALL screen player');
      /* if (this.videoPlayer) {
        this.videoPlayer.unloadAsync();
      } */
    }
    if (prevState.positionMillis !== this.state.positionMillis) {
      this.props.updateGlobalPositionMillis(this.state.positionMillis);
    }
    if (prevState.playStatus !== this.state.playStatus) {
      this.props.updateGlobalPlayStatus(this.state.playStatus);
    }
    if (prevProps.visible && !this.props.visible) {
      console.log('take snapshot');
      let snapshot = takeSnapshotAsync(this.videoPlayer, {
        format: 'jpg',
        result: 'base64',
        height: this.state.screenDimensions.height - 10,
        width: this.state.screenDimensions.width
      });
      console.table({ snapshot });
      debugger;
    }
  };

  // toggle control visiblity when they are pressed
  onControlLayerPressed = () => {
    this.setState({ showControls: !this.state.showControls });
  };
  onReplayPress = () => {
    this.videoPlayer.replayAsync();
  };

  onPlayPress = () => {
    this.setState({ showControls: false });
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
        durationMillis: status.durationMillis,
        showControls: true
      });
      if (status.isPlaying) {
        this.setState({
          playStatus: 'PLAYING',
          positionMillis: status.positionMillis,
          playableDurationMillis: status.playableDurationMillis,
          showControls: false
        });
      }
    } else {
      if (this.props.onError) {
        console.log('onPlaybackStatusUpdate onError: ', this.props.onError);
        this.props.onError({
          msg: 'Unhandled playback status in onPlaybackStatusUpdate: ',
          status
        });
      } else {
        console.log('unknown playback status: ', status);
      }
    }
  };

  toggleFullScreenVideo = () => {
    this.props.toggleFullScreenVideo();
  };

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.visible}
        onRequestClose={() => {
          console.log('onRequestClose');
        }}
      >
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'pink',
            display: 'flex'
          }}
        >
          <Video
            ref={(component) => {
              debugger;
              this.videoPlayer = component;
            }}
            style={{
              width: this.state.screenDimensions.width,
              height: this.state.screenDimensions.height,
              /* elevation: 5,
              shadowOffset: { width: 5, height: 3 },
              shadowColor: 'black',
              shadowOpacity: 0.5, */
              zIndex: 0
            }}
            source={this.props.source}
            rate={this.props.rate}
            volume={this.props.volume}
            resizeMode={Video.RESIZE_MODE_COVER}
            shouldPlay={this.props.shouldPlay}
            isLooping={this.props.isLooping}
            onPlaybackStatusUpdate={this.onPlaybackStatusUpdate}
            onReadyForDisplay={this.props.onReadyForDisplay}
            useNativeControls={false}
          />

          <PlayVideoControlsOverlay
            showControls={this.state.showControls}
            playStatus={this.state.playStatus}
            onPlayPress={this.onPlayPress}
            onPausePress={this.onPausePress}
            onReplayPress={this.onReplayPress}
            onControlLayerPressed={this.onControlLayerPressed}
          />
          <PlaybackStatusOverlay
            playableDurationMillis={this.state.playableDurationMillis}
            onSliderValueChange={this.onSliderValueChange}
            playStatus={this.state.playStatus}
            positionMillis={this.state.positionMillis}
            timeStampStyle={this.props.timeStampStyle}
            toggleFullScreenVideo={this.toggleFullScreenVideo}
            showTimeStamp={this.props.showTimeStamp}
          />
        </View>
      </Modal>
    );
  }
}

export default FullScreenPlayer;
