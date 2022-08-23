import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();

import Home from './Home';
import Map from './Map';

const Navigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Map" component={Map} />
    </Stack.Navigator>
  );
};

export default Navigation;
