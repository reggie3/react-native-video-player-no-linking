import React, { Component } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  View
} from "react-native";
import PropTypes from "prop-types";
import PlaybackSlider from "./PlaybackSlider";
import PlaybackTimeStamp from "./PlaybackTimeStamp";
import {
  GetPlayButtonByStatus,
  GetReplayButtonByStatus
} from "./VideoPlayerUI";
import { Video } from "expo";
import { Button, Icon } from "native-base";

const initialState = {
  playStatus: "LOADING",
  videoSize: {},
  durationMillis: 0,
  positionMillis: 0,
  viewDimensions: {
    width: 0
  },
  showControls: true
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
      this.calculateAspectRatioFit(
        this.props.videoWidth,
        this.props.videoHeight,
        this.state.viewDimensions.width,
        this.state.viewDimensions.height
      );
    }
  };

  calculateAspectRatioFit = (srcWidth, srcHeight, maxWidth, maxHeight) => {
    console.log({ srcWidth }, { srcHeight }, { maxWidth }, { maxHeight });
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    this.setState(
      {
        calculatedVideoWidth: srcWidth * ratio,
        calculatedVideoHeight: srcHeight * ratio
      },
      () => {
        console.log(
          "Picture: ",
          this.state.calculatedVideoWidth,
          ", ",
          this.state.calculatedVideoHeight
        );
      }
    );
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
    this.setState({ showControls: false });
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
        durationMillis: status.durationMillis,
        showControls: true
      });
      if (status.isPlaying) {
        this.setState({
          playStatus: "PLAYING",
          positionMillis: status.positionMillis,
          playableDurationMillis: status.playableDurationMillis,
          showControls: false
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
      this.setState(
        {
          viewDimensions: {
            x,
            y,
            width,
            height,
            isSet: true
          }
        },
        () => {
          console.log(
            "View: ",
            this.state.viewDimensions.width,
            ", ",
            this.state.viewDimensions.width
          );
        }
      );
    }
  };

  maybeRenderVideo = () => {
    if (this.state.calculatedVideoHeight) {
      return (
        <View
          style={{
            zIndex: 0
          }}
        >
          <Video
            ref={component => {
              this.videoPlayer = component;
            }}
            style={{
              height: this.state.calculatedVideoHeight,
              width: this.state.calculatedVideoWidth,
              elevation: 5,
              shadowOffset: { width: 5, height: 3 },
              shadowColor: "black",
              shadowOpacity: 0.5
            }}
            source={this.props.source}
            rate={this.props.rate}
            volume={this.props.volume}
/*             resizeMode={Video.RESIZE_MODE_CONTAIN}
 */            shouldPlay={this.props.shouldPlay}
            isLooping={this.props.isLooping}
            onPlaybackStatusUpdate={this.onPlaybackStatusUpdate}
            onReadyForDisplay={this.onReadyForDisplay}
          />
        </View>
      );
    } else {
      return <ActivityIndicator size="large" />;
    }
  };

  onControlLayerPressed = () => {
    this.setState({ showControls: !this.state.showControls });
  };

  maybeRenderControls = () => {
    return (
      <TouchableOpacity
        style={{
          // backgroundColor: "red",
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1
        }}
        onPress={this.onControlLayerPressed}
      >
        {this.state.showControls ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              position: "absolute",
              width: 150
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
        ) : null}
      </TouchableOpacity>
    );
  };

  showFullScreen=()=>{

  }
  
  maybeRenderPlaybackSlider = () => {
    if (this.props.showPlaybackSlider && this.state.showControls) {
      return (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
            justifyContent: "space-between",
            zIndex: 1,
            backgroundColor: "rgba(150,150,150,.35)"
          }}
        >
          <PlaybackSlider
            maximumValue={this.state.playableDurationMillis}
            onValueChange={this.onSliderValueChange}
            value={this.state.positionMillis}
          />
          {this.props.showTimeStamp ? (
            <View style={{ marginHorizontal: 3 }}>
              <PlaybackTimeStamp
                playStatus={this.state.playStatus}
                positionMillis={this.state.positionMillis}
                durationMillis={this.state.playableDurationMillis}
                timeStampStyle={this.props.timeStampStyle}
              />
            </View>
          ) : null}
          {/* The following view is required to center the button vertically */}
          <View >
          <Button transparent small onPress={()=>{
                this.videoPlayer.presentFullscreenPlayer();
          }}>
            <Icon
              type="FontAwesome"
              name="arrows-alt"
              style={{ color: "white", fontSize: 20, height: '100%' }}
            />
          </Button>
          </View>
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
          backgroundColor: "pink"
        }}
        onLayout={this.setLayoutInformation}
      >
        {this.state.viewDimensions.width ? (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "gray",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {this.maybeRenderVideo()}
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                display: "flex"
              }}
            >
              {this.maybeRenderControls()}
              {this.maybeRenderPlaybackSlider()}
            </View>
          </View>
        ) : (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "gray",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <ActivityIndicator size="large" color="green" />
          </View>
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
    color: "#ffffff",
    fontSize: 16
  },
  showTimeStamp: true,
  showPlaybackSlider: true,
  showDebug: false
};
