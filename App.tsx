/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import { View,  Text} from 'react-native';
import CustomCamera from './src/components/CustomCamera.tsx';
import Home from './src/pages/Home.tsx';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen options={{ title: 'Inicio' }} name="Home" component={Home} />
                <Stack.Screen options={{ title: 'Escanear Ingredientes' }} name="ScanIngredients" component={CustomCamera} />
                <Stack.Screen options={{ title: 'Escanear Tabla Nutricional' }} name="ScanNutritionalFacts" component={CustomCamera} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
