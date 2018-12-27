# React Native Video Player Recorder No Linking

## This package provide a video player component that you can drop into your application. It does not require linking to native code, so it is suitable for React Native applications built using Expo.

[![npm](https://img.shields.io/npm/v/react-native-video-player-no-linking.svg)](https://www.npmjs.com/package/react-native-video-player-no-linking)

[![npm](https://img.shields.io/npm/dm/react-native-video-player-no-linking.svg)](https://www.npmjs.com/package/react-native-video-player-no-linking)

[![npm](https://img.shields.io/npm/dt/react-native-video-player-no-linking.svg)](https://www.npmjs.com/package/react-native-video-player-no-linking)

[![npm](https://img.shields.io/npm/l/react-native-video-player-no-linking.svg)](https://github.com/react-native-component/react-native-video-player-no-linking/blob/master/LICENSE)

## Click to view a demo video of the component in action.
[![YouTube Demo Video](https://img.youtube.com/vi/oHJmvOntDT8/0.jpg)](https://www.youtube.com/watch?v=oHJmvOntDT8)


## Why Use This?

This module is useful if you need drop in video player for an application in which using platform specific native code is prohibited; for example an application created using expo.io.

## Why Not Use This?

You are not prohibited from using native code, and can find a better module to use. One option is [react-native-video](https://github.com/react-native-community/react-native-video#readme)

## Installation

`npm install --save react-native-video-player-no-linking`

## Usage

`import VideoPlayer from 'react-native-video-player-no-linking';`

### Example

This component passes through several of the properties used by the [Expo Video component](https://docs.expo.io/versions/latest/sdk/video) Please see that component's documentation for further details.

All properties are optional unless otherwise noted.

```javascript
<VideoPlayer
  videoProps={{
    shouldPlay: true, // Boolean: indicates whether  the video should begin playing immediately
    source: {
      uri: URI // String (Required): path to the source video
    }
  }}
  toggleFullScreenCallback={this.toggleFullScreenCallback} // Function: callback function called when the user selects fulscreen video.  Use this callback to hide components that should not be displayed in fullscreen mode
  playCompleteCallback={() => {
    console.log('play complete');
  }}
  showTimeStamp={true} // Boolean: show the play timestamp
  playerPadding={10} // Number: place padding around the player
  // These properities are directly inherited from the Expo Video Component
  rate={1.0}
  volume={1.0}
  isMuted={false}
  shouldPlay={false}
  isLooping={false}
/>
```

### Changelog

#### 1.0.0 First functional version
