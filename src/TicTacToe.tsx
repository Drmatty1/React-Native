import {StyleSheet, Text, View, Pressable, Button} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {useState} from 'react';
import Square from './components/square';

import {
  useNavigation,
  NavigationProp
} from '@react-navigation/native';

import TicTacToeAi from './TicTacToeAi'

const wins = [
  [0,1,2],
  [3,4,5],
  [6,7,8],

  [0,3,6],
  [1,4,7],
  [2,5,8],

  [0,4,8],
  [2,4,6]
]

type RootStackParamList = {
  vsPlayer: undefined;
  vsAI: undefined;
};

const TicTacToe = () => {
  
 const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [board, setBoard] = useState(
      Array(9).fill(null)
  );

  const [isXTurn, setIsXTurn] = useState(true);
  const [won, setWon] = useState<(string | null)>(null);

  const checkWinner = (board: (string | null)[]) => {
    for(let [a,b,c] of wins){
      if( board[a] != null &&
          board[a] === board[b] && board[b] === board[c]
       ){
         return board[a]
       }
    }
    return null;
  }

  const handlePress = (index : number) => {
    if (board[index])  return;
     if (won !== null )  return;

    //set board
    const newBoard = [...board];
    newBoard[index] = isXTurn?"X":"O"
    setBoard(newBoard)

    // check Winner
    const win = checkWinner(newBoard)
    if(win !== null){ 
      setWon(win)
      return
    }

    if( !newBoard.includes(null) ){ 
      setWon("Draw")
      return
    }

    setIsXTurn(!isXTurn) 
  }

  const startGame = () => {
    const newBoard = Array(9).fill(null)
    setBoard(newBoard)
    setWon(null)
    setIsXTurn(true)
  }

  return (
    <>
      <View style={styles.container}>

        <Pressable
            style={styles.navButton}
            onPress={() => navigation.navigate('vsAI')}
        >
            <Text style={styles.navButtonText}>
                Play with AI
            </Text>
        </Pressable>

        <View >
          <Text style={styles.headingText}>
            {won
              ? won === "Draw"
                ? "Draw!"
                : `${won} Wins!`
              : `${isXTurn ? "X" : "O"}'s Turn`}
          </Text>
        </View>

        <View
          style={styles.board}
        >
          {board.map((cell, index) => (
            <Square
              key={index}
              value={cell}
              onPress={() => handlePress(index)}
            />
          ))}
        </View>

        <View>
         <Text style={styles.footer}>
          {won
            ? won === "Draw"
              ? "Game Draw"
              : `Winner is ${won}`
            : ""}
        </Text>
        </View>

        <View>
         <Pressable style={styles.button} onPress={startGame}>
          <Text style={styles.buttonText}>New Game</Text>
        </Pressable>
        </View>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#fff',
  },
  cell: {
    backgroundColor: 'pink',
    width: 100,
    height: 100,
    
    borderWidth: 2,
    borderColor: '#000',

    justifyContent: 'center',
    alignItems: 'center',

  },
  navButton: {
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  navButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
  },
  headingText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10
  },
  text: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  footer: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10
  },
  board: {
    width: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },

  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default TicTacToe;