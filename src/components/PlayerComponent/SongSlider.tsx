import Slider from '@react-native-community/slider';
import React from 'react'
import { View, StyleSheet, Text } from 'react-native';
import { useAudioPlayer } from '../../context/AudioPlayerContext'

const SongSlider = () =>  {
    const {position, duration, seekTo} = useAudioPlayer()

    const formatTime = (seconds: number) => {
      if (!seconds || isNaN(seconds) || seconds < 0) return '0:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

  return (
    <View>
        <Slider
        value={position}
        minimumValue={0}
        maximumValue={duration || 1}
        thumbTintColor='#FFF'
        maximumTrackTintColor='#FFF'
        onSlidingComplete={seekTo}
        style={styles.sliderContainer}
        />
        <View style={styles.timeContainer}>
            <Text style={styles.time}>
                {formatTime(position)}
            </Text>
            <Text style={styles.time}>
                {formatTime(duration - position)}
            </Text>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    sliderContainer: {
      width: 350,
      height: 40,
      marginTop: 25,
  
      flexDirection: 'row',
    },
    timeContainer: {
      width: 340,
  
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    time: {
      color: '#fff',
    },
  });

export default SongSlider
