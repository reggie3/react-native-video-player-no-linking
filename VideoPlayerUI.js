import React from 'react';
import { Button, Icon } from 'native-base';

const ICON_SIZE = 22;
const roundButtonStyle = {
  elevation: 5,
  shadowOffset: { width: 5, height: 3 },
  shadowColor: 'black',
  shadowOpacity: 0.5,
  borderRadius: 25,
  width: 50,
  height: 50,
  alignSelf: 'center',
  padding: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

export const GetPlayButtonByStatus = (props) => {
  if (props.playStatus === 'LOADING' || props.playStatus === 'BUFFERING') {
    // show disabled play button
    return (
      <Button disabled style={roundButtonStyle} onPress={() => {}}>
        <Icon
          type="FontAwesome"
          name={'hourglass'}
          style={{
            fontSize: ICON_SIZE,
            color: 'white'
          }}
        />
      </Button>
    );
  } else if (props.playStatus === 'STOPPED') {
    // show active play button
    return (
      <Button success style={roundButtonStyle} onPress={props.onPlayPress}>
        <Icon
          type="FontAwesome"
          name={'play'}
          style={{
            fontSize: ICON_SIZE,
            color: 'white'
          }}
        />
      </Button>
    );
  } else if (props.playStatus === 'PAUSED') {
    return (
      <Button success style={roundButtonStyle} onPress={props.onPlayPress}>
        <Icon
          type="FontAwesome"
          name={'play'}
          style={{
            fontSize: ICON_SIZE,
            color: 'white'
          }}
        />
      </Button>
    );
    // show play button
  } else if (props.playStatus === 'PLAYING') {
    // show pause button
    return (
      <Button danger style={roundButtonStyle} onPress={props.onPausePress}>
        <Icon
          type="FontAwesome"
          name={'pause'}
          style={{
            fontSize: ICON_SIZE,
            color: 'white'
          }}
        />
      </Button>
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
    <Button success style={roundButtonStyle} onPress={props.onReplayPress}>
      <Icon
        type="FontAwesome"
        name="step-backward"
        style={{
          fontSize: ICON_SIZE,
          color: 'white'
        }}
      />
    </Button>
  );
};
