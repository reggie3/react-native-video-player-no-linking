import React from 'react';
import { View } from 'react-native';
import PlaybackSlider from './PlaybackSlider';
import PlaybackTimeStamp from './PlaybackTimeStamp';
import { Button, Icon } from 'native-base';

class PlaybackStatusOverlay extends React.Component {
  render() {
   
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'space-between',
          zIndex: 1,
          backgroundColor: 'rgba(150,150,150,.35)'
        }}
      >
        <PlaybackSlider
          maximumValue={this.props.playableDurationMillis}
          onValueChange={this.props.onSliderValueChange}
          value={this.props.positionMillis}
        />
        {this.props.showTimeStamp ? (
          <View style={{ marginHorizontal: 3 }}>
            <PlaybackTimeStamp
              playStatus={this.props.playStatus}
              positionMillis={this.props.positionMillis}
              durationMillis={this.props.playableDurationMillis}
              timeStampStyle={this.props.timeStampStyle}
            />
          </View>
        ) : null}
        {/* The following view is required to center the button vertically */}
        <View>
          <Button transparent small onPress={this.props.toggleFullScreenVideo}>
            <Icon
              type="FontAwesome"
              name="arrows-alt"
              style={{ color: 'white', fontSize: 20, height: '100%' }}
            />
          </Button>
        </View>
      </View>
    );
  }
}

export default PlaybackStatusOverlay;
