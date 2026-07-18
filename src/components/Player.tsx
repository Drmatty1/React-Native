import React from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import SongInfo from './PlayerComponent/SongInfo';
import SongSlider from './PlayerComponent/SongSlider';
import ControlCenter from './PlayerComponent/ControlCenter';

import MaterialIcons from '@react-native-vector-icons/material-icons';

import { useAudioPlayer } from '../context/AudioPlayerContext';


type PlayerProps = {
  onBack?: () => void;
};

const Player = ({onBack}: PlayerProps) => {
  const { activeTrack } = useAudioPlayer();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={12} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Now Playing</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.albumContainer}>
        {activeTrack?.artwork ? (
          <Image
            source={{ uri: activeTrack.artwork?.toString() ?? '' }}
            style={styles.albumArtImg}
          />
        ) : (
          <MaterialIcons
            name="music-note"
            size={180}
            color="white"
          />
        )}
      </View>

      <SongInfo track={activeTrack} />

      <SongSlider />

      <ControlCenter />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 16,
      paddingHorizontal: 18,
      alignItems: 'center',
      backgroundColor: '#001d23',
    },
    header: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    headerTitle: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 1,
    },
    headerSpacer: {
      width: 24,
    },
    backButton: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    albumContainer: {
      width: 300,
      height: 300,
      marginTop: 18,
    },
    albumArtImg: {
      height: '100%',
      width: '100%',
      borderRadius: 4,
    },
  });
  

export default Player
