import React, { Component } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import PropTypes from "prop-types";
import PlaybackSlider from "./PlaybackSlider";
import PlaybackTimeStamp from "./PlaybackTimeStamp";
import {
  GetPlayButtonByStatus,
  GetReplayButtonByStatus
} from "./VideoPlayerUI";
import { Video } from "expo";
import { View } from "react-native";

const initialState = {
  playStatus: "LOADING",
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

  componentDidUpdate = (prevProps, prevState) => {
    if (!prevState.viewDimensions.isSet && this.state.viewDimensions.isSet) {
      var maxWidth = this.state.viewDimensions.width; // Max width for the image
      var maxHeight = this.state.viewDimensions.height; // Max height for the image
      var ratio = 0; // Used for aspect ratio
      var width = this.props.videoWidth; // Current image width
      var height = this.props.videoHeight; // Current image height
      debugger;

      if (width > maxWidth || height > maxHeight) {
        this.shrinkVideo(maxWidth, maxHeight, ratio, width, height);
      } else if (width < maxWidth && height < maxHeight) {
        this.enlargeVideo(maxWidth, maxHeight, ratio, width, height);
      }
    }
  };

  shrinkVideo = (maxWidth, maxHeight, ratio, width, height) => {
    debugger
    // Check if the current width is larger than the max
    if (width > maxWidth) {
      ratio = maxWidth / width; // get ratio for scaling image

      this.setState({
        calculatedVideoWidth: maxWidth,
        calculatedVideoHeight: height * ratio
      });

      height = height * ratio; // Reset height to match scaled image
      width = width * ratio; // Reset width to match scaled image
    }

    // Check if current height is larger than max
    if (height > maxHeight) {
      ratio = maxHeight / height; // get ratio for scaling image

      this.setState({
        calculatedVideoHeight: maxHeight,
        calculatedVideoWidth: width * ratio
      });

      width = width * ratio; // Reset width to match scaled image
      height = height * ratio; // Reset height to match scaled image
    }
  };

  enlargeVideo = (maxWidth, maxHeight, ratio, width, height) => {
    debugger;
    // Check if the current width is larger than the max
    if (width < maxWidth) {
      ratio = maxWidth / width; // get ratio for scaling image

      this.setState({
        calculatedVideoWidth: maxWidth,
        calculatedVideoHeight: height * ratio
      });

      height = height * ratio; // Reset height to match scaled image
      width = width * ratio; // Reset width to match scaled image
    }

    // Check if current height is larger than max
    if (height < maxHeight) {
      ratio = maxHeight / height; // get ratio for scaling image

      this.setState({
        calculatedVideoHeight: maxHeight,
        calculatedVideoWidth: width * ratio
      });

      width = width * ratio; // Reset width to match scaled image
      height = height * ratio; // Reset height to match scaled image
    }
  };   

  componentWillUnmount = () => {
    this.videoPlayer.unloadAsync();
  };

  getResizeMode = mode => {
    switch (mode) {
      case "COVER":
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

  onSliderValueChange = value => {
    this.videoPlayer.setPositionAsync(value);
  };

  onPlaybackStatusUpdate = status => {
    if (status.isBuffering) {
      this.setState({
        playStatus: "BUFFERING",
        playableDurationMillis: status.playableDurationMillis
      });
    } else if (status.isLoaded) {
      this.setState({
        playStatus: "STOPPED",
        playableDurationMillis: status.playableDurationMillis,
        durationMillis: status.durationMillis
      });
      if (status.isPlaying) {
        this.setState({
          playStatus: "PLAYING",
          positionMillis: status.positionMillis,
          playableDurationMillis: status.playableDurationMillis
        });
      }
    } else {
      if (this.props.onError) {
        this.props.onError({
          msg: "Unhandled playback status in onPlaybackStatusUpdate: ",
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
          height,
          isSet: true
        }
      });
    }
  };

  maybeRenderVideo = () => {
    if (this.state.calculatedVideoHeight) {
      return (
        <Video
          ref={component => {
            this.videoPlayer = component;
          }}
          style={{
            /* height: this.state.viewDimensions.width - 10 * (9 / 16),
          width: this.state.viewDimensions.width - 10, */
            height: this.state.calculatedVideoHeight,
            width: this.state.calculatedVideoWidth,
            elevation: 5,
            shadowOffset: { width: 5, height: 3 },
            shadowColor: "black",
            shadowOpacity: 0.5,
            zIndex: 1
          }}
          source={this.props.source}
          rate={this.props.rate}
          volume={this.props.volume}
          resizeMode={Video.RESIZE_MODE_CONTAIN}
          shouldPlay={this.props.shouldPlay}
          isLooping={this.props.isLooping}
          onPlaybackStatusUpdate={this.onPlaybackStatusUpdate}
          onReadyForDisplay={this.onReadyForDisplay}
        />
      );
    } else {
      return <ActivityIndicator size="large" />;
    }
  };

  maybeRenderControls = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "orange",
          position: "absolute",
          zIndex: 100
        }}
      >
        {GetPlayButtonByStatus({
          playStatus: this.state.playStatus,
          onPlayPress: this.onPlayPress,
          onPausePress: this.onPausePress
        })}
        {GetReplayButtonByStatus({
          playStatus: this.playStatus,
          onReplayPress: this.onReplayPress
        })}
      </View>
    );
  };

  maybeRenderPlaybackSlider = () => {
    if (this.props.showPlaybackSlider) {
      return (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "orange"
          }}
        >
          <PlaybackSlider
            maximumValue={this.state.durationMillis}
            onValueChange={this.onSliderValueChange}
            value={this.state.positionMillis}
          />
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
        </View>
      );
    } else {
      return null;
    }
  };

  render() {
    return (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          //display: "flex",
          //justifyContent: "center",
          //alignItems: "center",
          //flex: 1,
          backgroundColor: 'pink'
        }}
        onLayout={this.setLayoutInformation}
      >
        {this.state.viewDimensions.width ? (
          <View
            style={{
              display: "flex",
              flex:1,
              backgroundColor: 'gray',
              justifyContent: "space-around"
            }}
          >
            {this.maybeRenderVideo()}
            <View style={{ ...StyleSheet.absoluteFillObject, zIndex: 1000, backgroundColor: 'blue' }}>
              {this.maybeRenderControls()}
              {this.maybeRenderPlaybackSlider()}
            </View>
          </View>
        ) : (
          <ActivityIndicator size="large" color="green" />
        )}
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
    color: "#222222",
    fontSize: 20
  },
  showTimeStamp: true,
  showPlaybackSlider: true,
  showDebug: false
};
