import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Video } from 'expo';
import PlaybackStatusOverlay from './PlaybackStatusOverlay';
import PlayVideoControlsOverlay from './PlayVideoControlsOverlay';

class SmallInViewPlayer extends React.Component {
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

  componentWillUnmount = () => {
    this.videoPlayer.unloadAsync();
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (!prevProps.useFullScreenPlayer && this.props.useFullScreenPlayer) {
      // console.log('switch to full screen player');
    }
    if (prevProps.useFullScreenPlayer && !this.props.useFullScreenPlayer) {
      // console.log('switch to SMALL screen player');
    }

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
      this.props.updateGlobalPositionMillis(this.state.positionMillis);
    }
    if (prevState.playStatus !== this.state.playStatus) {
      this.props.updateGlobalPlayStatus(this.state.playStatus);
    }
  };

  calculateAspectRatioFit = (srcWidth, srcHeight, maxWidth, maxHeight) => {
    console.log({ srcWidth }, { srcHeight }, { maxWidth }, { maxHeight });
    let ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    debugger;
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

  onReadyForDisplay = ({ naturalSize, status }) => {
    console.log({ naturalSize });
    debugger;
    this.setState({
      naturalSize,
      durationMillis: status.durationMillis,
      positionMillis: status.positionMillis
    });
  };

  render() {
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
                this.videoPlayer = component;
              }}
              style={{
                flex: 1,
                height: this.state.calculatedVideoHeight,
                width: this.state.calculatedVideoWidth,
                elevation: 5,
                shadowOffset: { width: 5, height: 3 },
                shadowColor: 'black',
                shadowOpacity: 0.5
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
          {this.state.videoIsReadyForDisplay ? (
            null
          ) : (
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
        <PlaybackStatusOverlay
          playableDurationMillis={this.state.playableDurationMillis}
          onSliderValueChange={this.onSliderValueChange}
          playStatus={this.state.playStatus}
          positionMillis={this.state.positionMillis}
          timeStampStyle={this.props.timeStampStyle}
          toggleFullScreenVideo={this.toggleFullScreenVideo}
          showTimeStamp={this.props.showTimeStamp}
        />
        <PlayVideoControlsOverlay
          showControls={this.state.showControls}
          playStatus={this.state.playStatus}
          onPlayPress={this.onPlayPress}
          onPausePress={this.onPausePress}
          onReplayPress={this.onReplayPress}
          onControlLayerPressed={this.onControlLayerPressed}
        />
      </React.Fragment>
    );
  }
}

export default SmallInViewPlayer;
