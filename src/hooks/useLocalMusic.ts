import { useEffect, useState } from 'react';
import {
  NativeModules,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import { Song, useAudioPlayer } from '../context/AudioPlayerContext';

const { MusicScanner } = NativeModules;

export function useLocalMusic() {
  const { setQueue } = useAudioPlayer();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  async function requestPermission() {
    if (Platform.OS !== 'android') return true;

    const permission =
      Platform.Version >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const granted = await PermissionsAndroid.request(permission);

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  useEffect(() => {
    async function loadMusic() {
      try {
        const granted = await requestPermission();

        if (!granted) {
          setLoading(false);
          return;
        }

        const scannedSongs: Song[] =
          await MusicScanner.scanAudioFiles();

        setSongs(scannedSongs);
        setQueue(scannedSongs);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadMusic();
  }, []);

  return {
    songs,
    loading,
  };
}
