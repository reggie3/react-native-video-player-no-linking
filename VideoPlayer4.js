import React from 'react';
import { ActivityIndicator, View, StyleSheet, Dimensions } from 'react-native';
import { Video, Audio } from 'expo';
import PlaybackStatusOverlay from './PlaybackStatusOverlay';
import PlayVideoControlsOverlay from './PlayVideoControlsOverlay';

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoIsReadyForDisplay: false,
      showControls: true,
      playStatus: 'LOADING',
      durationMillis: 0,
      positionMillis: 0,
      viewDimensions: {
        width: 0
      },
      calculatedVideoHeight: 1,
      calculatedVideoWidth: 1
    };
    this.videoPlayer = null;
  }

  async componentDidMount() {
    /* this._setupNetInfoListener();

    if (this.state.controlsState === CONTROL_STATES.SHOWN) {
      this._resetControlsTimer();
    } */

    // Set audio mode to play even in silent mode (like the YouTube app)
    try {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid : false
      });
    } catch (e) {
      this.props.errorCallback({
        type: 'NON_FATAL',
        message: 'setAudioModeAsync error',
        obj: e
      });
    }
  }


  componentWillUnmount = () => {
    this.videoPlayer.unloadAsync();
  };

  componentDidUpdate = (prevProps, prevState) => {
   



    if (this.state.naturalSize && !prevState.naturalSize) {
      console.log('calling calculateAspectRatioFit');
      this.calculateAspectRatioFit(
        this.state.naturalSize.width,
        this.state.naturalSize.height,
        this.state.viewDimensions.width,
        this.state.viewDimensions.height
      );
    }
    if (!prevState.videoIsReadyForDisplay && prevState.videoIsReadyForDisplay) {
      this.props.onReadyCallback();
    }

    if (prevState.positionMillis !== this.state.positionMillis) {
      // this.props.updateGlobalPositionMillis(this.state.positionMillis);
    }
    if (prevState.playStatus !== this.state.playStatus) {
      // this.props.updateGlobalPlayStatus(this.state.playStatus);
    }
  };

  calculateAspectRatioFit = (srcWidth, srcHeight, maxWidth, maxHeight) => {
    console.log({ srcWidth }, { srcHeight }, { maxWidth }, { maxHeight });
    let ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    this.setState(
      {
        calculatedVideoWidth: srcWidth * ratio,
        calculatedVideoHeight: srcHeight * ratio,
        videoIsReadyForDisplay: true
      },
      () => {
        /* console.log(
          'Picture: ',
          this.state.calculatedVideoWidth,
          ', ',
          this.state.calculatedVideoHeight
        ); */
      }
    );
  };

  setLayoutInformation = ({
    nativeEvent: { layout: { x, y, width, height } = {} } = {}
  }) => {
    if (!this.state.viewDimensions.width) {
      this.setState(
        {
          viewDimensions: {
            x,
            y,
            width,
            height,
            isSet: true
          },
          isReady: true
        },
        () => {
          /*  console.log(
            'View: ',
            this.state.viewDimensions.width,
            ', ',
            this.state.viewDimensions.width
          ); */
        }
      );
    }
  };

  // toggle control visiblity when they are pressed
  onControlLayerPressed = () => {
    console.log('VideoPlayer onControlLayerPressed');

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
    this.props.isPortrait
    ? this.props.switchToLandscape()
    : this.props.switchToPortrait();
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
    const videoWidth = Dimensions.get('window').width;
    const videoHeight = videoWidth * (9 / 16);
    const centeredContentWidth = 60;

    return (
      <React.Fragment>
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onLayout={this.setLayoutInformation}
        >
          <Video
            ref={(component) => {
              if (!this.videoPlayer) {
                this.videoPlayer = component;
              }
            }}
            style={{
              flex: 1,
              width: videoWidth,
              height: videoHeight,
              elevation: 5,
              shadowOffset: { width: 5, height: 3 },
              shadowColor: 'black',
              shadowOpacity: 0.5,
              backgroundColor: 'black'
            }}
            source={this.props.videoProps.source}
            rate={this.props.rate}
            volume={this.props.volume}
            resizeMode={Video.RESIZE_MODE_CONTAIN}
            shouldPlay={this.props.shouldPlay}
            isLooping={this.props.isLooping}
            onPlaybackStatusUpdate={this.onPlaybackStatusUpdate}
            onReadyForDisplay={this.onReadyForDisplay}
            useNativeControls={false}
          />
          {this.state.videoIsReadyForDisplay ? null : (
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: 'gray',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <ActivityIndicator size="large" color="green" />
            </View>
          )}
        </View>
        <PlayVideoControlsOverlay
          showControls={this.state.showControls}
          playStatus={this.state.playStatus}
          onPlayPress={this.onPlayPress}
          onPausePress={this.onPausePress}
          onReplayPress={this.onReplayPress}
          onControlLayerPressed={this.onControlLayerPressed}
          source={'small'}
        />
        <PlaybackStatusOverlay
          playableDurationMillis={this.state.playableDurationMillis}
          onSliderValueChange={this.onSliderValueChange}
          playStatus={this.state.playStatus}
          positionMillis={this.state.positionMillis}
          timeStampStyle={this.props.timeStampStyle}
          toggleFullScreenVideo={this.toggleFullScreenVideo}
          showTimeStamp={this.props.showTimeStamp}
          isPortrait={this.props.isPortrait}
        />
      </React.Fragment>
    );
  }
}

export default VideoPlayer;
