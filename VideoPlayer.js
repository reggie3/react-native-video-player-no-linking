import React, { Component } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import PropTypes from 'prop-types';

import FullScreenPlayer from './FullScreenPlayer';
import SmallInViewPlayer from './SmallInViewPlayer';

const initialState = {
  playStatus: 'LOADING',
  videoSize: {},
  durationMillis: 0,
  globalPositionMillis: 0,
  globalPlayStatus: null,
  viewDimensions: {
    width: 0
  },
  showControls: true
};

class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      smallPlayerIsReady: false,
      naturalSize: {},
      useFullScreenPlayer: false,
      globalPositionMillis: null,
      globalPlayStatus: null
    };
  }
  componentDidUpdate=(prevProps, prevState)=>{
    // console.log('VideoPlayer.js update: ', this.state);
  }

  

  toggleFullScreenVideo = () => {
    this.setState(
      { useFullScreenPlayer: !this.state.useFullScreenPlayer },
      () => {
        // console.log({ useFullScreenPlayer: this.state.useFullScreenPlayer });
      }
    );
  };

  updateGlobalPositionMillis = (globalPositionMillis) => {
      this.setState({globalPositionMillis})
  };
  updateGlobalPlayStatus = (globalPlayStatus) => {
    this.setState({globalPlayStatus})
  };

  renderVideoPlayer = () => {
    
      return (
        <React.Fragment>
          <FullScreenPlayer
            visible={this.state.useFullScreenPlayer}
            onClose={this.toggleFullScreenVideo}
            source={this.props.source}
            rate={this.props.rate}
            volume={this.props.volume}
            shouldPlay={this.props.shouldPlay}
            isLooping={this.props.isLooping}
            onPlaybackStatusUpdate={this.onPlaybackStatusUpdate}
            onReadyForDisplay={this.onReadyForDisplay}
            useNativeControls={false}
            maximumValue={this.state.playableDurationMillis}
            onValueChange={this.onSliderValueChange}
            value={this.state.positionMillis}
            toggleFullScreenVideo={this.toggleFullScreenVideo}
            showTimeStamp={this.props.showTimeStamp}
            updateGlobalPositionMillis={this.updateGlobalPositionMillis}
            updateGlobalPlayStatus={this.updateGlobalPlayStatus}
            timeStampStyle={this.props.timeStampStyle}

          />
          <SmallInViewPlayer
            useFullScreenPlayer={!this.state.useFullScreenPlayer}
            source={this.props.source}
            rate={this.props.rate}
            volume={this.props.volume}
            shouldPlay={this.props.shouldPlay}
            isLooping={this.props.isLooping}
            onPlaybackStatusUpdate={this.onPlaybackStatusUpdate}
            onReadyForDisplay={this.onReadyForDisplay}
            useNativeControls={false}
            maximumValue={this.state.playableDurationMillis}
            onValueChange={this.onSliderValueChange}
            value={this.state.positionMillis}
            showTimeStamp={this.props.showTimeStamp}
            playStatus={this.state.playStatus}
            positionMillis={this.state.positionMillis}
            durationMillis={this.state.playableDurationMillis}
            timeStampStyle={this.props.timeStampStyle}
            toggleFullScreenVideo={this.toggleFullScreenVideo}
            onReadyCallback={this.smallPlayerReadyCallback}
            updateGlobalPositionMillis={this.updateGlobalPositionMillis}
            updateGlobalPlayStatus={this.updateGlobalPlayStatus}
          />
        </React.Fragment>
      );
   
  };

  smallPlayerReadyCallback = () => {
    this.setState({ smallPlayerIsReady: true });
  };

  render() {
    return (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0,0,0,0)'
        }}
      >
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {this.renderVideoPlayer()}
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
    color: '#ffffff',
    fontSize: 16
  },
  showTimeStamp: true,
  showPlaybackSlider: true,
  showDebug: false
};
