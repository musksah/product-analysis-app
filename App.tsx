/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import ScanIngredientsScreen from './src/components/ScanIngredientsComponent.tsx';
import HomeScreen from './src/pages/Home.tsx';
import ReviewScreen from './src/pages/Review.tsx';
import ScanNutriFactsScreen from './src/components/ScanNutriFactsComponent.tsx';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: route.name === 'ScanIngredients' ? { display: 'none' } : {},
        headerStyle: {
          borderBottomWidth: 0.5,
          borderBottomColor: '#b1b2b5',
          backgroundColor: '#0a6801',
        },
        tabBarIconStyle: { marginTop: 8 },
        tabBarLabelStyle: { marginBottom: 8 },
        headerTintColor: '#fff',
        tabBarActiveTintColor: '#11bf00',
        tabBarActiveBackgroundColor: '#eeeeee',
      })}
    >
      <Tab.Screen name="home" component={ HomeScreen } options={{
        tabBarLabel: 'Inicio',
        tabBarIcon: ({ focused, color, size }) => {
          if(focused){
            return <Icon name="home" size={22} color="#11bf00"/>
          }else{
            return <Icon name="home" size={22}/>
          }
        },
      }}/>
      <Tab.Screen name="Escanear" component={ ScanIngredientsScreen } options={{
        tabBarLabel: 'Escanear',
        tabBarIcon: ({ focused, color, size }) => {
            return <Icon name="camera" size={22}/>
        },
        tabBarStyle: { display: 'none' },
      }}/>
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator >
            <Stack.Screen name="Tabs" component={ MyTabs } options={{ headerShown: false }}/>
            <Stack.Screen 
              options={{ 
                title: 'Escanear Tabla Nutricional',
                headerStyle: {
                  backgroundColor: '#0a6801',
                }, 
                headerTintColor: '#fff',
              }} 
              name="ScanNutritionalFacts" component={ ScanNutriFactsScreen }  />
            <Stack.Screen 
              options={{ 
                title: 'Resultados', 
                headerStyle: {
                  backgroundColor: '#0a6801',
                },
                headerTintColor: '#fff',
              }} 
              name="Review" component={ ReviewScreen } />
        </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
