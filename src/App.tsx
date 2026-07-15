
import { StatusBar, StyleSheet, useColorScheme, View, Text, ScrollView } from 'react-native';
import { SafeAreaProvider} from 'react-native-safe-area-context';

import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';

import TicTacToe from './TicTacToe';
import TicTacToeAi from './TicTacToeAi'


const MyStack = createNativeStackNavigator({
  screenOptions: {
    headerStyle: {
      backgroundColor: "#5cd1f4",
    },

    headerTintColor: "#756a6a",

    headerTitleStyle: {
      fontWeight: "bold",
      fontSize: 22,
    },

    animation: "slide_from_right",
  },
  screens: {
    vsPlayer: createNativeStackScreen({
      screen: TicTacToe,
      options:{
        headerBackVisible: false,
      }
    }),
    vsAI: createNativeStackScreen({
      screen: TicTacToeAi,
      options:{
        headerBackVisible: false,
      }
    }),
  },
});

type RootStackParamList = {
  vsPlayer: undefined;
  vsAI: undefined;
};

const Navigation = createStaticNavigation(MyStack);

function App() {

  // const isDarkMode = useColorScheme() === 'dark';

  return (

    <SafeAreaProvider>
      <Navigation/>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

export default App;
