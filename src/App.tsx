import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MusicPlayer from './components/MusicPlayer'
import { AudioPlayerProvider } from './context/AudioPlayerContext'

const App = () => {
  return (
    <AudioPlayerProvider>
      <View style={styles.container}>
        <MusicPlayer/>
      </View>
    </AudioPlayerProvider>
  )
}

export default App

const styles = StyleSheet.create({
  container:{
    flex: 1
  }
})
