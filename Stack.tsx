import React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from './components/Main';
import Tab from './components/Tab';

const Stacks=createNativeStackNavigator();
const Stack = () => {
  return (
     <Stacks.Navigator screenOptions={{headerShown:true}}>
        <Stacks.Screen name='File-Manager' component={Main}/>
        <Stacks.Screen name='Folders' component={Tab}/>

     </Stacks.Navigator>
  );
}

export default Stack;
