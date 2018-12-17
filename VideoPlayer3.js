import React from 'react';
import { Audio, Video } from 'expo';
import {
  View,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Text,
  Slider,
  NetInfo,
  ActivityIndicator
} from 'react-native';
import PropTypes from 'prop-types';
import {
    PlayIcon,
    PauseIcon,
    FullscreenEnterIcon,
    FullscreenExitIcon,
    ReplayIcon
  } from './assets/icons';
  const TRACK_IMAGE = require('./assets/track.png');
  const THUMB_IMAGE = require('./assets/thumb.png');
  
class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.videoPlayer = null;
  }

  onPlaybackStatusUpdate = (playbackStatus) => {
    debugger;
    console.log(playbackStatus);
  };

  render() {
    const videoWidth = Dimensions.get('window').width;
    const videoHeight = videoWidth * (9 / 16);
    const {
      ref,
      callback,
      style,
      source,
      ...otherVideoProps
    } = this.props.videoProps;

    return (
      <View
        style={{
          flex: 1,
        backgroundColor: 'pink'
        }}
      >
        <Video
          source={source}
          ref={(component) => {
            console.log('setting ref');
            this.videoPlayer = component;
          }}
          onPlaybackStatusUpdate={(update) => {
            console.log({ update });
            this.onPlaybackStatusUpdate(update);
          }}
          style={{
            width: videoWidth,
            height: videoHeight,
            elevation: 5,
              shadowOffset: { width: 5, height: 3 },
              shadowColor: 'black',
              shadowOpacity: 0.5
          }}
          {...otherVideoProps}
        />
      </View>
    );
  }
}

export default VideoPlayer;

VideoPlayer.propTypes = {
    /**
     * How long should the fadeIn animation for the controls run? (in milliseconds)
     * Default value is 200.
     *
     */
    fadeInDuration: PropTypes.number,
    /**
     * How long should the fadeOut animation run? (in milliseconds)
     * Default value is 1000.
     *
     */
    fadeOutDuration: PropTypes.number,
    /**
     * How long should the fadeOut animation run when the screen is tapped when the controls are visible? (in milliseconds)
     * Default value is 200.
     *
     */
    quickFadeOutDuration: PropTypes.number,
    /**
     * If the user has not interacted with the controls, how long should the controls stay visible? (in milliseconds)
     * Default value is 4000.
     *
     */
    hideControlsTimerDuration: PropTypes.number,

    /**
     * Callback that gets passed `playbackStatus` objects for the underlying video element
     */
    playbackCallback: PropTypes.func,

    /**
     * Error callback (lots of errors are non-fatal and the video will continue to play)
     */
    errorCallback: PropTypes.func,

    // Icons
    playIcon: PropTypes.func,
    pauseIcon: PropTypes.func,
    fullscreenEnterIcon: PropTypes.func,
    fullscreenExitIcon: PropTypes.func,

    showFullscreenButton: PropTypes.bool,

    /**
     * Style to use for the all the text in the videoplayer including seek bar times and error messages
     */
    textStyle: PropTypes.object,

    /**
     * Props to use into the underlying <Video>. Useful for configuring autoplay, playback speed, and other Video properties.
     * See Expo documentation on <Video>. `source` is required.
     */
    videoProps: PropTypes.object,

    /**
     * Write internal logs to console
     */
    debug: PropTypes.bool,

    // Dealing with fullscreen
    isPortrait: PropTypes.bool,
    switchToLandscape: PropTypes.func,
    switchToPortrait: PropTypes.func,

    showControlsOnLoad: PropTypes.bool
  };

  VideoPlayer.defaultProps = {
    // Animations
    fadeInDuration: 200,
    fadeOutDuration: 1000,
    quickFadeOutDuration: 200,
    hideControlsTimerDuration: 4000,
    // Appearance (assets and styles)
    playIcon: PlayIcon,
    pauseIcon: PauseIcon,
    fullscreenEnterIcon: FullscreenEnterIcon,
    fullscreenExitIcon: FullscreenExitIcon,
    showFullscreenButton: true,
    replayIcon: ReplayIcon,
    trackImage: TRACK_IMAGE,
    thumbImage: THUMB_IMAGE,
    textStyle: {
      color: '#FFFFFF',
      fontSize: 12
    }
}
