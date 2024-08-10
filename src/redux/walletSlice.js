import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    wallets: [],
    addresses: {},
  },
  reducers: {
    addWallet: (state, action) => {
      state.wallets.push(action.payload);
    },
    addAddress: (state, action) => {
      const { walletType, address } = action.payload;
      const updatedAddresses = {
        ...state.addresses,
        [walletType]: state.addresses[walletType]
          ? [...state.addresses[walletType], address]
          : [address],
      };
      state.addresses = updatedAddresses;
      AsyncStorage.setItem('addresses', JSON.stringify(state.addresses));
    },
    loadAddresses: (state, action) => {
      state.addresses = action.payload;
    },
    removeAddress: (state, action) => {
      const { walletType, addressId } = action.payload;
      const updatedAddresses = {
        ...state.addresses,
        [walletType]: state.addresses[walletType].filter(
          (address) => address.id !== addressId
        ),
      };
      state.addresses = updatedAddresses;
      AsyncStorage.setItem('addresses', JSON.stringify(state.addresses));
    },
    resetState: (state) => {
      // Reset the state
      state.wallets = [];
      state.addresses = {};
      // Clear the AsyncStorage
      AsyncStorage.removeItem('addresses');
    },
  },
});

export const { addWallet, addAddress, loadAddresses, removeAddress, resetState } = walletSlice.actions;

export const loadStoredAddresses = () => async (dispatch) => {
  const storedAddresses = await AsyncStorage.getItem('addresses');
  if (storedAddresses) {
    dispatch(loadAddresses(JSON.parse(storedAddresses)));
  }
};

export default walletSlice.reducer;
