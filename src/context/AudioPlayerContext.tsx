import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Sound from 'react-native-sound';

export type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumId: string;
  duration: number;
  size: number;
  dateAdded: number;
  trackNumber: number;
  uri: string;
  path?: string | null;
  artwork: string | null;
};

type AudioPlayerContextValue = {
  queue: Song[];
  activeTrack: Song | null;
  isPlaying: boolean;
  isPlayerOpen: boolean;
  position: number;
  duration: number;
  setQueue: (songs: Song[]) => void;
  openPlayer: () => void;
  closePlayer: () => void;
  playTrack: (index: number) => void;
  skipToNext: () => void;
  skipToPrevious: () => void;
  togglePlayback: () => void;
  seekTo: (seconds: number) => void;
};

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

export function AudioPlayerProvider({ children }: PropsWithChildren) {
  const soundRef = useRef<Sound | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPlayingRef = useRef(false);
  const [queue, setQueueState] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const activeTrack = currentIndex >= 0 ? queue[currentIndex] ?? null : null;

  const clearPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const releaseSound = () => {
    clearPolling();

    if (soundRef.current) {
      soundRef.current.release();
      soundRef.current = null;
    }
  };

  const setQueue = (songs: Song[]) => {
    setQueueState(songs);
    setCurrentIndex(-1);
    setIsPlaying(false);
    setPosition(0);
    setDuration(0);
  };

  const openPlayer = () => {
    setIsPlayerOpen(true);
  };

  const closePlayer = () => {
    setIsPlayerOpen(false);
  };

  const playTrackAtIndex = (index: number) => {
    if (index < 0 || index >= queue.length) {
      return;
    }

    setCurrentIndex(index);

    //change this if cliking music -> open plyaer immediately
    setIsPlayerOpen(false);
    setIsPlaying(true);
    setPosition(0);
  };

  const skipToNext = () => {
    if (!queue.length) {
      return;
    }

    setIsPlayerOpen(true);
    setCurrentIndex(current => {
      const nextIndex = current < 0 ? 0 : (current + 1) % queue.length;
      setPosition(0);
      return nextIndex;
    });
    setIsPlaying(true);
  };

  const skipToPrevious = () => {
    if (!queue.length) {
      return;
    }

    setIsPlayerOpen(true);
    setCurrentIndex(current => {
      const previousIndex =
        current < 0 ? 0 : (current - 1 + queue.length) % queue.length;
      setPosition(0);
      return previousIndex;
    });
    setIsPlaying(true);
  };

  const togglePlayback = () => {
    if (!activeTrack && queue.length > 0) {
      playTrackAtIndex(0);
      return;
    }

    setIsPlaying(value => !value);
  };

  const seekTo = (seconds: number) => {
    soundRef.current?.setCurrentTime(seconds);
    setPosition(seconds);
  };

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    Sound.setCategory('Playback');
  }, []);

  useEffect(() => {
    releaseSound();

    if (!activeTrack) {
      setDuration(0);
      setPosition(0);
      return;
    }

    const source = activeTrack.path || activeTrack.uri;

    console.log("Loading:", source);


    if (!source) {
      setDuration(0);
      return;
    }

    const sound = new Sound(source, '', error => {
      if (error) {
        console.log('Failed to load sound:', error);
        setDuration(activeTrack.duration / 1000);
        return;
      }

      soundRef.current = sound;
      setDuration(sound.getDuration() || activeTrack.duration / 1000 || 0);
      setPosition(0);

      if (isPlayingRef.current) {
        sound.play(success => {
          if (!success) {
            console.log('Playback failed to start');
          }
        });
      }
    });
  }, [activeTrack]);



  useEffect(() => {
    const sound = soundRef.current;

    if (!sound) {
      return;
    }

    if (isPlaying) {
      sound.play(success => {
        if (!success) {
          console.log('Playback failed to start');
        }
      });

      clearPolling();
      pollRef.current = setInterval(() => {
        sound.getCurrentTime(seconds => {
          setPosition(seconds);
        });
      }, 1000);
    } else {
      sound.pause();
      clearPolling();
    }

    return clearPolling;
  }, [isPlaying]);
  

  useEffect(() => {
    return () => {
      releaseSound();
    };
  }, []);

  const value = useMemo(
    () => ({
      queue,
      activeTrack,
      isPlaying,
      isPlayerOpen,
      position,
      duration,
      setQueue,
      openPlayer,
      closePlayer,
      playTrack: playTrackAtIndex,
      skipToNext,
      skipToPrevious,
      togglePlayback,
      seekTo,
    }),
    [activeTrack, duration, isPlayerOpen, isPlaying, position, queue],
  );

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);

  if (!context) {
    throw new Error('useAudioPlayer must be used inside AudioPlayerProvider');
  }

  return context;
}
