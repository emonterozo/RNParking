import React, {useContext, useState} from 'react';
import {
  Box,
  Text,
  Button,
  VStack,
  IconButton,
  AddIcon,
  MinusIcon,
  HStack,
  Badge,
  Pressable,
} from 'native-base';
import {countBy} from 'lodash';

import {MAX_PARKING_SPACE} from './constant';
import GlobalContext from './context';

interface INavigation {
  navigation: any;
}

const Home = ({navigation}: INavigation) => {
  const {parkingComplex, setParkingComplex} = useContext(GlobalContext);
  const [entryPoints, setEntryPoints] = useState(3);

  const initializeParking = () => {
    // parking slot per entry points
    const parkingSlots = [];
    for (let i = 1; i <= MAX_PARKING_SPACE; i++) {
      let size = '';

      if (i >= 1 && i <= 2) {
        size = 'small';
      } else if (i >= 3 && i <= 4) {
        size = 'medium';
      } else {
        size = 'large';
      }

      parkingSlots.push({
        slot: i,
        isOccupied: false,
        size: size,
        timestamp: null,
        vehiclePlateNo: null,
        lastVehicle: null,
      });
    }

    const parkingComplexHolder = [];
    for (var i = 1; i <= entryPoints; i++) {
      parkingComplexHolder.push({
        parkingSlots: parkingSlots,
        parkingNumber: i,
      });
    }

    setParkingComplex(parkingComplexHolder);
  };

  const handleUpdateEntryPoint = (action: string) => {
    if (action === 'inc') {
      setEntryPoints(entryPoints + 1);
    } else {
      setEntryPoints(entryPoints - 1);
    }
  };

  const renderParkingPoint = (item, index) => {
    const parking = countBy(item.parkingSlots, ({isOccupied}) =>
      isOccupied === true ? 'occupied' : 'notOccupied',
    );

    return (
      <Pressable
        key={index}
        marginY={1}
        onPress={() =>
          navigation.navigate('Map', {parkingNumber: item.parkingNumber})
        }>
        <Box
          w="96"
          borderWidth="1"
          borderColor="coolGray.300"
          shadow="3"
          bg="coolGray.100"
          p="5"
          rounded="8">
          <Text color="coolGray.800" mt="3" fontWeight="medium" fontSize="xl">
            {`Parking ${item.parkingNumber} (${item.parkingSlots.length} parking total slots)`}
          </Text>
          <HStack alignItems="center" marginTop="3" space="5">
            <Badge
              colorScheme="green"
              _text={{
                color: 'white',
              }}
              variant="solid"
              rounded="4">
              {`${parking.notOccupied || 0} available`}
            </Badge>
            <Badge
              colorScheme="red"
              _text={{
                color: 'white',
              }}
              variant="solid"
              rounded="4">
              {`${parking.occupied || 0} occupied`}
            </Badge>
          </HStack>
        </Box>
      </Pressable>
    );
  };

  return (
    <Box flex={1}>
      {parkingComplex.length > 0 ? (
        <Box alignItems="center" m={2}>
          {parkingComplex.map((item, index) => renderParkingPoint(item, index))}
        </Box>
      ) : (
        <Box flex={1} justifyContent="center" padding={2}>
          <VStack space={2}>
            <HStack space={2} alignItems="center" justifyContent="center">
              <Text fontWeight="bold">Entry Points: {entryPoints}</Text>
              {entryPoints > 3 && (
                <IconButton
                  size="sm"
                  bg="warmGray.200"
                  icon={<MinusIcon />}
                  onPress={() => handleUpdateEntryPoint('dec')}
                />
              )}
              <IconButton
                size="sm"
                bg="warmGray.200"
                icon={<AddIcon />}
                onPress={() => handleUpdateEntryPoint('inc')}
              />
            </HStack>
            <Button size="lg" onPress={initializeParking}>
              Confirm
            </Button>
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default Home;
