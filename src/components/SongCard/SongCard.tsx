import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';

export type Song = {
  id: string;
  title?: string;
  artist?: string;
  album?: string;
  duration?: number;
  uri?: string;
};

type SongCardProps = {
  song: Song;
  onPress?: () => void;
};

function formatDuration(ms: number = 0) {
  const totalSeconds = Math.floor(ms / 1000);

  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function SongCard({
  song,
  onPress,
}: SongCardProps) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: '#ddd' }}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}>

      <View style={styles.iconContainer}>
        <MaterialIcons
          name="music-note"
          size={28}
          color="#6200EE"
        />
      </View>

      <View style={styles.info}>
        <Text
          numberOfLines={1}
          style={styles.title}>
          {song.title || 'Unknown Title'}
        </Text>

        <Text
          numberOfLines={1}
          style={styles.artist}>
          {song.artist || 'Unknown Artist'}
        </Text>
      </View>

      <Text style={styles.duration}>
        {formatDuration(song.duration)}
      </Text>

    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },

  pressed: {
    opacity: 0.7,
  },

  iconContainer: {
    width: 45,
    alignItems: 'center',
  },

  info: {
    flex: 1,
    marginLeft: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },

  artist: {
    marginTop: 3,
    fontSize: 13,
    color: '#666',
  },

  duration: {
    fontSize: 13,
    color: '#888',
    marginLeft: 10,
  },
});
