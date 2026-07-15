import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
// import { FontAwesome6 } from '@expo/vector-icons';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

type Props = {
  key : number | null;
  value: string | null;
  onPress: () => void;
};

const Square = ({value, onPress}: Props) => {

  const getIcon = () => {
    switch (value) {
      case 'X':
        return (
          <FontAwesome6
            name="xmark"
            size={60}
            color="red"
            iconStyle="solid"
          />
        );

      case 'O':
        return (
          <FontAwesome6
            name="circle"
            size={45}
            color="blue"
          />
        );

      default:
        return (
          <FontAwesome6
            name="pencil"
            size={45}
            color= "#ccc"
            iconStyle="solid"
          />
        );

    }
  };

  return (
    <Pressable
      style={styles.cell}
      onPress={onPress}>
      {getIcon()}
    </Pressable>
  );
};

export default Square;

const styles = StyleSheet.create({
  cell: {
    width: 100,
    height: 100,
    backgroundColor: 'white',

    borderWidth: 2,
    borderColor: '#000',

    justifyContent: 'center',
    alignItems: 'center',
  },
});