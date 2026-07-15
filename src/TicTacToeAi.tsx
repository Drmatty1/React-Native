import {StyleSheet, Text, View, Button,Pressable} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {useEffect, useState} from 'react';
import Square from './components/square';

import {
  useNavigation,
  NavigationProp
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

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

type Cell = 'x' | 'o' | '_';

const board: Cell[][] = [
  ['_', '_', '_'],
  ['_', '_', '_'],
  ['_', '_', '_'],
];

let player:Cell = 'o'
let opponent:Cell = 'x'

function isMovesLeft(board: Cell[][] )
{
    for(let i = 0; i < 3; i++)
        for(let j = 0; j < 3; j++)
            if (board[i][j] == '_')
                return true;
                
    return false;
}

function evaluate(b: Cell[][])
{
    
    // Checking for Rows for X or O victory.
    for(let row = 0; row < 3; row++)
    {
        if (b[row][0] == b[row][1] &&
            b[row][1] == b[row][2])
        {
            if (b[row][0] == player)
                return +10;
                
            else if (b[row][0] == opponent)
                return -10;
        }
    }
 
    // Checking for Columns for X or O victory.
    for(let col = 0; col < 3; col++)
    {
        if (b[0][col] == b[1][col] &&
            b[1][col] == b[2][col])
        {
            if (b[0][col] == player)
                return +10;
 
            else if (b[0][col] == opponent)
                return -10;
        }
    }
 
    // Checking for Diagonals for X or O victory.
    if (b[0][0] == b[1][1] && b[1][1] == b[2][2])
    {
        if (b[0][0] == player)
            return +10;
            
        else if (b[0][0] == opponent)
            return -10;
    }
 
    if (b[0][2] == b[1][1] && 
        b[1][1] == b[2][0])
    {
        if (b[0][2] == player)
            return +10;
            
        else if (b[0][2] == opponent)
            return -10;
    }
 
    // Else if none of them have
    // won then return 0
    return 0;
}

function minimax(board: Cell[][], depth: number, isMax: boolean)
{
    let score = evaluate(board);
 
    // AI wins
    if (score === 10)
        return score - depth;

    // Opponent wins
    if (score === -10)
        return score + depth;
 
    // If there are no more moves and
    // no winner then it is a tie
    if (isMovesLeft(board) == false)
        return 0;
 
    // If this maximizer's move
    if (isMax)
    {
        let best = -1000;
 
        // Traverse all cells
        for(let i = 0; i < 3; i++)
        {
            for(let j = 0; j < 3; j++)
            {
                
                // Check if cell is empty
                if (board[i][j]=='_')
                {
                    
                    // Make the move
                    board[i][j] = player;
 
                    // Call minimax recursively 
                    // and choose the maximum value
                    best = Math.max(best, minimax(board,
                                    depth + 1, !isMax));
 
                    // Undo the move
                    board[i][j] = '_';
                }
            }
        }
        return best;
    }
 
    // If this minimizer's move
    else
    {
        let best = 1000;
 
        // Traverse all cells
        for(let i = 0; i < 3; i++)
        {
            for(let j = 0; j < 3; j++)
            {
                
                // Check if cell is empty
                if (board[i][j] == '_')
                {
                    
                    // Make the move
                    board[i][j] = opponent;
 
                    // Call minimax recursively and 
                    // choose the minimum value
                    best = Math.min(best, minimax(board,
                                    depth + 1, !isMax));
 
                    // Undo the move
                    board[i][j] = '_';
                }
            }
        }
        return best;
    }
}

function findBestMove ()
{
    let bestVal = -1000;
    let bestMove = {row:-1, col:-1};
    bestMove.row = -1;
    bestMove.col = -1;
 
    // Traverse all cells, evaluate 
    // minimax function for all empty 
    // cells. And return the cell
    // with optimal value.
    for(let i = 0; i < 3; i++)
    {
        for(let j = 0; j < 3; j++)
        {
            
            // Check if cell is empty
            if (board[i][j] == '_')
            {
                
                // Make the move
                board[i][j] = player;
 
                // compute evaluation function 
                // for this move.
                let moveVal = minimax(board, 0, false);
 
                // Undo the move
                board[i][j] = '_';
 
                // If the value of the current move 
                // is more than the best value, then 
                // update best
                if (moveVal > bestVal)
                {
                    bestMove.row = i;
                    bestMove.col = j;
                    bestVal = moveVal;
                }
            }
        }
    }
 
    return bestMove;
}

function reset(){

    for(let i = 0; i < 3; i++)
    {
        for(let j = 0; j < 3; j++)
        {
            board[i][j] = '_';
        }
    }
}

function put(index: number, isXTurn: boolean){
    const row = Math.floor(index / 3);
    const col = (Number)(index%3);
    board[row][col] = isXTurn?opponent:player ;
}

type RootStackParamList = {
  vsPlayer: undefined;
  vsAI: undefined;
};

const TicTacToeAi = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
        put(index,isXTurn)
        
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
    
    
    // 2. Safe Side-Effect Management via useEffect
    useEffect(() => {
        if (!isXTurn && won === null) {
        const bestMove = findBestMove();
        if (bestMove.row !== -1 && bestMove.col !== -1) {
            const moveIndex = bestMove.row * 3 + bestMove.col;
            // Small delay so the AI doesn't feel instantly robotic
            const timer = setTimeout(() => handlePress(moveIndex), 300);
            return () => clearTimeout(timer);
        }
        }
    }, [isXTurn, won]);

    const startGame = () => {
        const newBoard = Array(9).fill(null)
        setBoard(newBoard)
        reset()
        setWon(null)
        setIsXTurn(true)
    }

  return (
    <>
      <View style={styles.container}>

        <Pressable
            style={styles.navButton}
            onPress={() => navigation.pop()}
        >
            <Text style={styles.navButtonText}>
                Play with Player
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
              onPress={() => {
                    if(isXTurn) {
                        handlePress(index);
                    }
                }
              }
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

export default TicTacToeAi;