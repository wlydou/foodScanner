import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Scanner from './screens/Scanner';
import ProductDetails from './screens/ProductDetails';
import { Icon } from 'react-native-elements';
import { Provider as PaperProvider } from 'react-native-paper';

const Tab = createBottomTabNavigator();

function History() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Mes scans :</Text>
    </View>
  );
}

const ScannerStack = createStackNavigator();

function ScannerStackScreen() {
  return (
    <ScannerStack.Navigator>
      <ScannerStack.Screen name="Scanner" component={Scanner} />
      <ScannerStack.Screen name="Details" component={ProductDetails} />
    </ScannerStack.Navigator>
  );
}

const HistoryStack = createStackNavigator();

function HistoryStackScreen() {
  return (
    <HistoryStack.Navigator>
      <HistoryStack.Screen name="History" component={History} />
      <HistoryStack.Screen name="Details" component={ProductDetails} />
    </HistoryStack.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Scanner') {
              iconName = 'camera'
            } else if (route.name === 'History') {
              iconName = 'list';
            }

            // You can return any component that you like here!
            return <Icon name={iconName} size={size} color={color} />;
          },
        })} tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}>
          <Tab.Screen name="Scanner" component={ScannerStackScreen} />
          <Tab.Screen name="History" component={HistoryStackScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
