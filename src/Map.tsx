import React, {useContext, useEffect, useState} from 'react';
import {
  Box,
  Button,
  Center,
  FlatList,
  HStack,
  VStack,
  Text,
  FormControl,
  Input,
  Modal,
  Radio,
  Alert,
} from 'native-base';
import {round, isNull} from 'lodash';
import moment from 'moment';

import GlobalContext from './context';
import {FLAT_RATE, MAX_HOURS_TO_RETURN, PARKING_SPACE} from './constant';

const Map = ({route}) => {
  const {parkingComplex, setParkingComplex} = useContext(GlobalContext);
  const [selectedParkingPoint, setSelectedParkingPoint] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [vehicleSize, setVehicleSize] = useState('small');
  const [vehiclePlateNo, setVehiclePlateNo] = useState('');
  const [selectedSlot, setSelectedSlot] = useState({
    number: null,
    size: null,
  });
  const [alert, setAlert] = useState({
    isVisible: false,
    title: '',
    message: '',
    status: '',
  });
  const [unparkingDetails, setUnparkingDetails] = useState({
    unparkCompleted: false,
    startDate: '',
    totalHours: 0,
    exceedHours: 0,
    amountToPay: 0,
  });

  useEffect(() => {
    const {parkingNumber} = route.params;
    const selectedParkingPointHolder = parkingComplex.filter(
      parking => parking.parkingNumber === parkingNumber,
    );
    setSelectedParkingPoint(selectedParkingPointHolder);
  }, [route]);

  const handlePressSlot = (action: string, slot: number, size: string) => {
    const {parkingNumber} = route.params;
    setSelectedSlot({
      number: slot,
      size: size,
    });

    if (action === 'park') {
      setIsModalVisible(true);
    } else {
      const slotSelected = selectedParkingPoint[0].parkingSlots.filter(
        parking => parking.slot === slot,
      );

      let receipt = {
        startDate: '',
        totalHours: 0,
        exceedHours: 0,
        amountToPay: 0,
      };

      if (
        !isNull(slotSelected[0].lastVehicle) &&
        slotSelected[0].lastVehicle?.vehiclePlateNo ===
          slotSelected[0].vehiclePlateNo
      ) {
        // vehicle return
        const exit = moment(slotSelected[0].lastVehicle?.exit);
        const enter = moment(new Date());
        const returnDuration = moment.duration(enter.diff(exit));
        const returnHours = round(returnDuration.asHours());

        if (returnHours <= MAX_HOURS_TO_RETURN) {
          receipt = calculateFee(slotSelected[0].lastVehicle?.enter, size);
        } else {
          receipt = calculateFee(slotSelected[0].timestamp, size);
        }
      } else {
        // new parking
        receipt = calculateFee(slotSelected[0].timestamp, size);
      }

      // update state and context
      const parkingPoint = selectedParkingPoint[0].parkingSlots.map(obj =>
        obj.slot === selectedSlot.number
          ? {
              ...obj,
              isOccupied: false,
              timestamp: null,
              vehiclePlateNo: null,
              lastVehicle: {
                vehiclePlateNo: obj.vehiclePlateNo,
                enter: obj.timestamp,
                exit: new Date(),
              },
            }
          : obj,
      );

      const parkingPointHolder = {
        parkingNumber: parkingNumber,
        parkingSlots: parkingPoint,
      };
      setSelectedParkingPoint([parkingPointHolder]);
      const newParkingComplex = parkingComplex.map(parking => {
        if (parking.parkingNumber === parkingNumber) {
          return parkingPointHolder;
        }
        return parking;
      });
      setParkingComplex(newParkingComplex);
      setUnparkingDetails({
        ...receipt,
        unparkCompleted: true,
      });
    }
  };

  const calculateFee = (enter, size) => {
    const startDate = moment(enter);
    const endDate = moment(new Date());
    const duration = moment.duration(endDate.diff(startDate));
    const totalHours = round(duration.asHours());
    let amountToPay = 0;
    let exceedHours = 0;
    if (totalHours <= FLAT_RATE.hours) {
      amountToPay = FLAT_RATE.fee;
    } else {
      const parkingInfo = PARKING_SPACE.filter(
        parking => parking.size === size,
      );

      exceedHours = totalHours - FLAT_RATE.hours;
      const exceedFee = exceedHours * parkingInfo[0].feePerHour;
      amountToPay = exceedFee + FLAT_RATE.fee;
    }

    return {
      startDate: moment(startDate).format('MM/DD hh:mm A'),
      totalHours,
      exceedHours,
      amountToPay,
    };
  };

  const park = () => {
    const {parkingNumber} = route.params;
    let newAlert = {
      title: '',
      message: '',
      status: '',
    };

    const parkingDetails = PARKING_SPACE.filter(
      parking => parking.size === selectedSlot.size,
    );

    const isValidParking =
      parkingDetails[0].allowedVehicle.includes(vehicleSize);

    if (isValidParking) {
      const parkingPoint = selectedParkingPoint[0].parkingSlots.map(obj =>
        obj.slot === selectedSlot.number
          ? {
              ...obj,
              isOccupied: true,
              timestamp: new Date(),
              vehiclePlateNo: vehiclePlateNo,
            }
          : obj,
      );
      const parkingPointHolder = {
        parkingNumber: parkingNumber,
        parkingSlots: parkingPoint,
      };
      setSelectedParkingPoint([parkingPointHolder]);

      const newParkingComplex = parkingComplex.map(parking => {
        if (parking.parkingNumber === parkingNumber) {
          return parkingPointHolder;
        }
        return parking;
      });
      setParkingComplex(newParkingComplex);
      newAlert = {
        title: 'Parking Success',
        message: 'The vehicle is successfully parked.',
        status: 'info',
      };
    } else {
      newAlert = {
        title: 'Parking Failed',
        message: 'Selected vehicle are not allowed to park here.',
        status: 'error',
      };
    }
    setAlert({
      isVisible: true,
      ...newAlert,
    });
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (alert.isVisible) {
      setTimeout(() => {
        setAlert({
          isVisible: false,
          title: '',
          message: '',
          status: '',
        });
      }, 1000);
    }
  }, [alert]);

  const renderItem = ({item, index}) => (
    <Box
      key={index}
      flex={1}
      maxWidth="50%"
      borderWidth="1"
      borderColor="coolGray.300"
      shadow="3"
      padding="5"
      margin={1}
      bg={item.isOccupied ? 'red.400' : 'coolGray.100'}
      rounded="8">
      <VStack space="2">
        <Center>
          <Text color="coolGray.800">{`Slot ${item.slot}`}</Text>
          <Text color="coolGray.800">{`Parking Size: ${item.size}`}</Text>
          {!isNull(item.timestamp) && (
            <Text color="coolGray.800">{`Timestamp:\n ${moment(
              item.timestamp,
            ).format('MM/DD hh:mm:ss A')}`}</Text>
          )}
        </Center>
        <Button
          size="xs"
          onPress={() =>
            handlePressSlot(
              item.isOccupied ? 'unpark' : 'park',
              item.slot,
              item.size,
            )
          }>
          {item.isOccupied ? 'Unpark' : 'Park'}
        </Button>
      </VStack>
    </Box>
  );

  return (
    <Box flex={1} m={1}>
      <Modal
        isOpen={unparkingDetails.unparkCompleted}
        onClose={() =>
          setUnparkingDetails({
            ...unparkingDetails,
            unparkCompleted: false,
          })
        }
        size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Receipt</Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontWeight="medium">Timestamp</Text>
                <Text color="blueGray.400">{unparkingDetails.startDate}</Text>
              </HStack>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontWeight="medium">Total hours</Text>
                <Text color="blueGray.400">{unparkingDetails.totalHours}</Text>
              </HStack>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontWeight="medium">Exceed Hours</Text>
                <Text color="blueGray.400">{unparkingDetails.exceedHours}</Text>
              </HStack>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontWeight="medium">Total Amount</Text>
                <Text color="green.500">{`PHP ${unparkingDetails.amountToPay}`}</Text>
              </HStack>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button
              flex="1"
              onPress={() => {
                setUnparkingDetails({
                  ...unparkingDetails,
                  unparkCompleted: false,
                });
              }}>
              Continue
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      {alert.isVisible && (
        <Center>
          <Alert w="100%" status={alert.status}>
            <VStack space={2} flexShrink={1} w="100%">
              <HStack
                flexShrink={1}
                space={2}
                alignItems="center"
                justifyContent="space-between">
                <HStack flexShrink={1} space={2} alignItems="center">
                  <Alert.Icon />
                  <Text fontSize="md" fontWeight="medium" color="coolGray.800">
                    {alert.title}
                  </Text>
                </HStack>
              </HStack>
              <Box
                pl="6"
                _text={{
                  color: 'coolGray.600',
                }}>
                {alert.message}
              </Box>
            </VStack>
          </Alert>
        </Center>
      )}
      <Modal safeArea isOpen={isModalVisible}>
        <Modal.Content>
          <Modal.Header>Park New Vehicle</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Vehicle Plate</FormControl.Label>
              <Input
                value={vehiclePlateNo}
                w="100%"
                onChangeText={text => setVehiclePlateNo(text)}
                placeholder="Value Controlled Input"
              />
              <FormControl.Label>Vehicle Size</FormControl.Label>
              <Radio.Group
                name="myRadioGroup"
                accessibilityLabel="favorite number"
                value={vehicleSize}
                onChange={nextValue => {
                  setVehicleSize(nextValue);
                }}>
                <HStack w="100%" justifyContent="center" space="3">
                  <Radio size="sm" value="small">
                    Small
                  </Radio>
                  <Radio size="sm" value="medium">
                    Medium
                  </Radio>
                  <Radio size="sm" value="large">
                    Large
                  </Radio>
                </HStack>
              </Radio.Group>
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button flex="1" onPress={park}>
              Proceed
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      {!isNull(selectedParkingPoint) && (
        <FlatList
          data={selectedParkingPoint[0].parkingSlots}
          renderItem={renderItem}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </Box>
  );
};

export default Map;
