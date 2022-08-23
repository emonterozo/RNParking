/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {NativeBaseProvider} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';

import GlobalContext from './src/context';
import Navigation from './src/Navigation';

const App = () => {
  const [parkingComplex, setParkingComplex] = useState([]);

  const initialContext = {
    parkingComplex,
    setParkingComplex,
  };

  return (
    <GlobalContext.Provider value={initialContext}>
      <NativeBaseProvider>
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </NativeBaseProvider>
    </GlobalContext.Provider>
  );
};
export default App;
