import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';

import { useAudioPlayer } from '../../context/AudioPlayerContext';

function formatDuration(ms: number = 0) {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function SongCardBottom() {
  const { activeTrack, isPlaying, openPlayer, togglePlayback } = useAudioPlayer();

  if (!activeTrack) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={openPlayer}
        style={({ pressed }) => [
          styles.container,
          pressed && styles.pressed,
        ]}>
        <MaterialIcons
          name="music-note"
          size={26}
          color="#ffffff"
          style={styles.icon}
        />

        <View style={styles.info}>
          <Text numberOfLines={1} style={styles.title}>
            {activeTrack.title || 'Unknown Title'}
          </Text>
          <Text numberOfLines={1} style={styles.artist}>
            {activeTrack.artist || 'Unknown Artist'}
          </Text>
        </View>

        <Text style={styles.duration}>
          {formatDuration(activeTrack.duration)}
        </Text>
      </Pressable>

      <Pressable onPress={togglePlayback} style={styles.playButton}>
        <MaterialIcons
          name={isPlaying ? 'pause' : 'play-arrow'}
          size={28}
          color="#ffffff"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: '#123d39',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  pressed: {
    opacity: 0.85,
  },
  icon: {
    marginRight: 10,
  },
  info: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  artist: {
    marginTop: 2,
    color: '#b8d3cf',
    fontSize: 12,
  },
  duration: {
    color: '#dbe7e5',
    fontSize: 12,
    marginLeft: 8,
  },
  playButton: {
    width: 46,
    height: 46,
    marginLeft: 10,
    borderRadius: 23,
    backgroundColor: '#0c2f2c',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
