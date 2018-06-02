import React from 'react';
import { RkButton, RkTheme } from 'react-native-ui-kitten';
import { FontAwesome } from '@expo/vector-icons';

const ICON_SIZE =36;
const roundButtonStyle = {
  borderRadius: 25,
  width: 50,
  height: 50,
  alignSelf: 'center'
};

RkTheme.setType('RkButton', 'disabled', {
  container: {
    backgroundColor: 'gray'
  }
});

export const GetPlayButtonByStatus = (props) => {
  if (props.playStatus === 'LOADING' || props.playStatus === 'BUFFERING') {
    // show disabled play button
    return getDisabledButton(
      <RkButton rkType="disabled" style={roundButtonStyle} onPress={() => {}}>
        <FontAwesome name="hourglass" color="white" size={ICON_SIZE} />
      </RkButton>
    );
  } else if (props.playStatus === 'STOPPED') {
    // show active play button
    return getActiveButton(
      <RkButton
        rkType="success"
        style={roundButtonStyle}
        onPress={props.onPlayPress}
      >
        <FontAwesome name="play" color="white" size={ICON_SIZE} />
      </RkButton>
    );
  } else if (props.playStatus === 'PAUSED') {
    return (
      <RkButton
        rkType="success"
        style={roundButtonStyle}
        onPress={props.onPlayPress}
      >
        <FontAwesome name="play" color="white" size={ICON_SIZE} />
      </RkButton>
    );
    // show play button
  } else if (props.playStatus === 'PLAYING') {
    // show pause button
    return (
      <RkButton
        rkType="danger"
        style={roundButtonStyle}
        onPress={props.onPausePress}
      >
        <FontAwesome name="pause" color="white" size={ICON_SIZE} />
      </RkButton>
    );
  }
};

/* 
Shouldn't need these with the slider available
export const GetRewindButtonByStatus = (props) => {
  if (props.playStatus === 'BUFFERING') {
    // show disabled Rewind button
  } else if (props.playStatus === 'AT_BEGINNING') {
    // show disabled Rewind button
  } else if (props.playStatus === 'REWINDING') {
    // show disabled Rewind button
  } else if (
    props.playStatus === 'PLAYING' ||
    props.playStatus === 'STOPPED' ||
    props.playStatus === 'PAUSED'
  ) {
    // show enabled Fast forward button
  }
};

export const GetFastForwardButtonByStatus = (props) => {
  if (props.playStatus === 'BUFFERING') {
    // show disabled Fast forward button
  } else if (props.playStatus === 'AT_END') {
    // show disabled Fast forward button
  } else if (props.playStatus === 'FAST_FORWARDING') {
    // show disabled Fast forward button
  } else if (
    props.playStatus === 'PLAYING' ||
    props.playStatus === 'STOPPED' ||
    props.playStatus === 'PAUSED'
  ) {
    // show enabled Fast forward button
  }
}; */

export const GetReplayButtonByStatus = (props) => {
  // show enabled replay button
  return (
    <RkButton
      rkType="success"
      style={roundButtonStyle}
      onPress={props.onReplayPress}
    >
      <FontAwesome name="replay" color="white" size={ICON_SIZE} />
    </RkButton>
  );
};
