import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from 'types/navigation';
import { screens } from '@/screens';
import { useTheme } from '@/hooks';

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  const { Colors } = useTheme();

  return (
    <Tab.Navigator
      backBehavior="initialRoute"
      initialRouteName="home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: Colors.background, borderColor: Colors.border_01 },
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon({ color, focused, size }) {
          color = focused ? Colors.text_04 : Colors.text_02;

          if (route.name === 'home') {
            return <Ionicons name="wallet" size={size} color={color} />;
          }
          if (route.name === 'explore') {
            return <MaterialIcons name="camera" size={size} color={color} />;
          }
          if (route.name === 'browser') {
            return <MaterialIcons name="explore" size={size} color={color} />;
          }
          if (route.name === 'defi') {
            return <AntDesign name="swap" size={size} color={color} />;
          }
          if (route.name === 'history') {
            return <MaterialIcons name="history" size={size} color={color} />;
          }
        },
      })}>
      <Tab.Screen name="home" component={screens.home} />
      <Tab.Screen name="explore" component={screens.explore} />
      <Tab.Screen name="browser" component={screens.browser} />
      <Tab.Screen name="defi" component={screens.explore} />
      <Tab.Screen name="history" component={screens.explore} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
