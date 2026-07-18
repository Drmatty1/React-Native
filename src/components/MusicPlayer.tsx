import { 
    StyleSheet, Text, View, ActivityIndicator, FlatList
 } from 'react-native'
import React from 'react'
import {useLocalMusic} from '../hooks/useLocalMusic'
import SongCard from './SongCard/SongCard'
import { useAudioPlayer } from '../context/AudioPlayerContext'
import Player from './Player'
import SongCardBottom from './SongCard/SongCardBottom'

const MusicPlayer = () => {
  const { songs, loading } = useLocalMusic();
  const { playTrack, activeTrack, isPlaying, isPlayerOpen, closePlayer } = useAudioPlayer();

    if (isPlayerOpen) {
        return <Player onBack={closePlayer} />;
    }

    const startPlayer = (index: number) => {
        playTrack(index)
    }

    return (
        <View style={{flex: 1, backgroundColor: '#001d23'}}>
            <FlatList
                data={songs}
                style={{flex: 1, backgroundColor: '#1c1c1c'}}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) => (
                    <SongCard song={item} onPress={() => startPlayer(index)} />
                )}
                ListEmptyComponent={
                  loading ? (
                    <View style={styles.emptyState}>
                      <ActivityIndicator color="#fff" />
                      <Text style={styles.emptyText}>Scanning your music library...</Text>
                    </View>
                  ) : (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyText}>No songs found.</Text>
                    </View>
                  )
                }
                contentContainerStyle={{paddingBottom: activeTrack && isPlaying ? 88 : 0}}
            />
            { activeTrack && !isPlayerOpen && 
                    <SongCardBottom />
            }
        </View>
    );
}

export default MusicPlayer

const styles = StyleSheet.create({
  emptyState: {
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 10,
    color: '#fff',
  },
})
