import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Music from '../screens/Music';
import Videos from '../screens/Videos';
import Images from '../screens/Images';
import { Image } from 'react-native';
const Tabs=createMaterialBottomTabNavigator();


const Tab = () => {
  return (
    <Tabs.Navigator
    initialRouteName='Music'
    barStyle={{ backgroundColor: '#d9d9d9'}}
    activeColor='black'
    shifting='true'>
        <Tabs.Screen 
        name='Music' 
        component={Music}
        options={{
            tabBarLabel: 'Music',
            tabBarIcon: () => (
                <Image style={{height:30,width:30}} source={require('../images/music-player.png')}/>
            ),
        }}
        />
        <Tabs.Screen 
        
        name='Videos' 
        component={Videos}
        options={{
            tabBarLabel: 'Videos',
            tabBarIcon: () => (
                <Image style={{height:30,width:30}} source={require('../images/video-camera.png')}/>
            ),
        }}/>
        <Tabs.Screen
        
        name='Images' 
        component={Images}
        options={{
            tabBarLabel: 'Images',
            tabBarIcon: () => (
                 <Image style={{height:30,width:30}} source={require('../images/image.png')}/>
            ),
        }}/>

     </Tabs.Navigator>
  );
}

export default Tab;
