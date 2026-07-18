import React from 'react'
import { View, StyleSheet, Pressable } from 'react-native'

import MaterialIcons from '@react-native-vector-icons/material-icons';
const Icon = MaterialIcons;

import { useAudioPlayer } from '../../context/AudioPlayerContext'


const ControlCenter = () => {
   const { isPlaying, skipToNext, skipToPrevious, togglePlayback } = useAudioPlayer();
    // next button
  return (
    <View style={styles.container}>
        <Pressable onPress={skipToPrevious}>
            <Icon style={styles.icon} name="skip-previous" size={40} />
        </Pressable>
        <Pressable onPress={() => togglePlayback()}>
            <Icon 
            style={styles.icon} 
            name={isPlaying ? "pause" : "play-arrow"} 
            size={75} />
        </Pressable>
        <Pressable onPress={skipToNext}>
            <Icon style={styles.icon} name="skip-next" size={40} />
        </Pressable>

    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      marginBottom: 56,
  
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      color: '#FFFFFF',
    },
    playButton: {
      marginHorizontal: 24,
    },
  });

export default ControlCenter
