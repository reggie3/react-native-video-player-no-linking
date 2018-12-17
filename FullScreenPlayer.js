import React from 'react';
import { Modal, View, StyleSheet, Dimensions } from 'react-native';
import { Video, takeSnapshotAsync } from 'expo';
import PlaybackStatusOverlay from './PlaybackStatusOverlay';
import PlayVideoControlsOverlay from './PlayVideoControlsOverlay';

class FullScreenPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoIsReadyForDisplay: false,
      showControls: true,
      playStatus: 'LOADING',
      durationMillis: 0,
      positionMillis: 0,
      screenDimensions: Dimensions.get('window'),
      calculatedVideoHeight: 1,
      calculatedVideoWidth: 1
    };
    this.videoPlayer = null;
    this.videoPlayerSnapshotView = null;
  }

  componentWillUnmount = () => {
    this.videoPlayer.unloadAsync();
  };

  componentDidUpdate = async (prevProps, prevState) => {
    // this player is being hidden
    if (prevProps.visible && !this.props.visible) {
      // since we are leaving this player we need to do the following:
      // stop this player's playback
      this.videoPlayer.pauseAsync();
    }

    // this player is being displayed
    if (!prevProps.visible && this.props.visible) {
      debugger;
      // since we are coming to this player
      // 1. check to see if there is a global postion stored
      // indicating where we should start playing the video from.
      // If there is, then move to that position in the video
      if (this.props.globalPositionMillis) {
        this.videoPlayer.setPositionAsync(this.props.globalPositionMillis);
        console.log(
          'setting this player position to: ',
          this.props.globalPositionMillis
        );
      }

      // 2. check to see if there is a status stored, and if
      // there is, then assume that status
      if (this.props.globalPlayStatus) {
        console.log({ globalPlayStatus: this.props.globalPlayStatus });
      }

      // 3. Play or pause the video based on what the user was doing
      // when they left the other player

      // FIXME: can't actually play until the video player has been loaded
      if (this.props.globalPlayStatus === 'PLAYING') {
        // this.videoPlayer.playAsync();
      }
    }

    // get the correct size of the video to display in this player
    if (this.state.naturalSize && !prevState.naturalSize) {
      console.log('calling calculateAspectRatioFit');
      this.calculateAspectRatioFit(
        this.state.naturalSize.width,
        this.state.naturalSize.height,
        this.state.screenDimensions.width,
        this.state.screenDimensions.height
      );
    }

    if (prevState.positionMillis !== this.state.positionMillis) {
      this.props.updateGlobalPositionMillis(this.state.positionMillis);
    }
    if (prevState.playStatus !== this.state.playStatus) {
      this.props.updateGlobalPlayStatus(this.state.playStatus);
    }

    /* // take a picture of the video so that we can see it when we come pa
    if (prevProps.visible && !this.props.visible) {
      console.log('take snapshot');
      try {
        let snapshot = await takeSnapshotAsync(this.videoPlayerSnapshotView, {
            format: 'jpg',
            result: 'base64',
            height: this.state.screenDimensions.height - 10,
            width: this.state.screenDimensions.width
          });
          console.table({ snapshot });
          debugger;
      } catch (error) {
          console.log({error});
          debugger;
      }
    } */
  };

  calculateAspectRatioFit = (srcWidth, srcHeight) => {
    let ratio = Math.min(this.state.screenDimensions.width / srcWidth, this.state.screenDimensions.height / srcHeight);
    debugger;
    this.setState(
      {
        calculatedVideoWidth: srcWidth * ratio,
        calculatedVideoHeight: srcHeight * ratio,
        videoIsReadyForDisplay: true
      },
      () => {
        console.log(
          'Full screen video size: ',
          this.state.calculatedVideoWidth,
          ', ',
          this.state.calculatedVideoHeight
        ); 
      }
    );
  };

  // toggle control visiblity when they are pressed
  onControlLayerPressed = () => {
    console.log('FullScreenPlayer onControlLayerPressed');
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
        durationMillis: status.durationMillis
        // showControls: true
      });
      if (status.isPlaying) {
        this.setState({
          playStatus: 'PLAYING',
          positionMillis: status.positionMillis,
          playableDurationMillis: status.playableDurationMillis
          // showControls: false
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

  onReadyForDisplay = ({ naturalSize, status }) => {
    console.log({ naturalSize });

    this.setState({
      naturalSize,
      durationMillis: status.durationMillis,
      positionMillis: status.positionMillis
    });
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
          <View
            ref={(component) => {
              this.videoPlayerSnapshotView = component;
            }}
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
          >
            <Video
              ref={(component) => {
                if (!this.videoPlayer) {
                  this.videoPlayer = component;
                }
              }}
              style={{
                width: this.state.calculatedVideoWidth,
                height: this.state.calculatedVideoHeight,
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
              onReadyForDisplay={this.onReadyForDisplay}
              useNativeControls={false}
            />
          </View>
          <PlayVideoControlsOverlay
            showControls={this.state.showControls}
            playStatus={this.state.playStatus}
            onPlayPress={this.onPlayPress}
            onPausePress={this.onPausePress}
            onReplayPress={this.onReplayPress}
            onControlLayerPressed={this.onControlLayerPressed}
            source={'full'}
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
