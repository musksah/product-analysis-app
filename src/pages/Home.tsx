import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
  Image,
  Button
} from 'react-native';
import React, { useRef, useState } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';

const Home = ({navigation}) => {
    return(
        <View style={styles.container}>
          <View style={styles.content}>
            <Text>Product Analysis</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button
                title="Scan Product"
                onPress={() => navigation.navigate('ScanIngredients')}
            />
          </View>
        </View>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginBottom: 20, // Espacio desde el fondo de la pantalla
    paddingHorizontal: 20, // Espacio a los lados
  },
});


export default Home;