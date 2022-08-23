export const MAX_PARKING_SPACE = 6;
export const FLAT_RATE = {
  fee: 40,
  hours: 3,
};
export const PARKING_SPACE = [
  {
    size: 'small',
    allowedVehicle: ['small'],
    feePerHour: 20,
  },
  {
    size: 'medium',
    allowedVehicle: ['small', 'medium'],
    feePerHour: 60,
  },
  {
    size: 'large',
    allowedVehicle: ['small', 'medium', 'large'],
    feePerHour: 100,
  },
];

export const MAX_HOURS_TO_RETURN = 1;

export const DUMMY = [
  {
    parkingNumber: 1,
    parkingSlots: [
      {
        slot: 1,
        isOccupied: false,
        size: 'small',
        timestamp: null,
        vehiclePlateNo: null,
        lastVehicle: {
          vehiclePlateNo: '123',
          enter: '2022-08-23T04:24:43.074Z', // 12:25 PM
          exit: '2022-08-23T04:24:50.880Z',
        },
      },
      {
        slot: 2,
        isOccupied: false,
        size: 'small',
        timestamp: null,
        vehiclePlateNo: null,
        lastVehicle: null,
      },
      {
        slot: 3,
        isOccupied: false,
        size: 'medium',
        timestamp: null,
        vehiclePlateNo: null,
        lastVehicle: null,
      },
      {
        slot: 4,
        isOccupied: false,
        size: 'medium',
        timestamp: null,
        vehiclePlateNo: null,
        lastVehicle: null,
      },
      {
        slot: 5,
        isOccupied: false,
        size: 'large',
        timestamp: null,
        vehiclePlateNo: null,
        lastVehicle: null,
      },
      {
        slot: 6,
        isOccupied: false,
        size: 'large',
        timestamp: null,
        vehiclePlateNo: null,
        lastVehicle: null,
      },
    ],
  },
  {
    parkingSlots: [
      {
        slot: 1,
        isOccupied: false,
        size: 'small',
        timestamp: null,
        vehiclePlateNo: null,
        lastVehicle: null,
      },
      {
        slot: 2,
        isOccupied: false,
        size: 'small',
        timestamp: null,
        vehiclePlateNo: null,
        lastVehicle: null,
      },
      {
        slot: 3,
        isOccupied: false,
        size: 'medium',
        timestamp: null,
        vehiclePlateNo: null,
        lastVehicle: null,
      },
      {
        slot: 4,
        isOccupied: false,
        size: 'medium',
        timestamp: null,
        vehiclePlateNo: null,
        lastVehicle: null,
      },
      {
        slot: 5,
        isOccupied: false,
        size: 'large',
        timestamp: null,
        vehiclePlateNo: null,
        lastVehicle: null,
      },
      {
        slot: 6,
        isOccupied: false,
        size: 'large',
        timestamp: null,
        vehiclePlateNo: null,
        lastVehicle: null,
      },
    ],
    parkingNumber: 2,
  },
  {
    parkingSlots: [
      {
        slot: 1,
        isOccupied: false,
        size: 'small',
        timestamp: null,
        vehiclePlateNo: null,
        lastVehicle: null,
      },
      {
        slot: 2,
        isOccupied: false,
        size: 'small',
        timestamp: null,
        vehiclePlateNo: null,
        lastVehicle: null,
      },
      {
        slot: 3,
        isOccupied: false,
        size: 'medium',
        timestamp: null,
        vehiclePlateNo: null,
        lastVehicle: null,
      },
      {
        slot: 4,
        isOccupied: false,
        size: 'medium',
        timestamp: null,
        vehiclePlateNo: null,
        lastVehicle: null,
      },
      {
        slot: 5,
        isOccupied: false,
        size: 'large',
        timestamp: null,
        vehiclePlateNo: null,
        lastVehicle: null,
      },
      {
        slot: 6,
        isOccupied: false,
        size: 'large',
        timestamp: null,
        vehiclePlateNo: null,
        lastVehicle: null,
      },
    ],
    parkingNumber: 3,
  },
];
