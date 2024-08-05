import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, TextInput, TouchableOpacity, Button } from 'react-native';
import Metamask from '../assets/svg/Metamask.svg';
import TrustWallet from '../assets/svg/Trustwallet.svg';
import PhantomWallet from '../assets/svg/Phantom.svg';
import LedgerLive from '../assets/svg/LeadgerLive.svg';
import Plus from '../assets/svg/PlusIcon.svg';
import CoinbaseWallet from '../assets/svg/CoinbaseWallet.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { addAddress } from '../redux/walletSlice';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import RNHapticFeedback from 'react-native-haptic-feedback';

const wallets = [
  { 
    id: '1',
    name: 'MetaMask',
    description: 'ERC wallet',
    icon: 'Metamask', // Store identifier instead of component
  },
  {
    id: '2',
    name: 'Trust Wallet',
    description: 'ERC wallet',
    icon: 'TrustWallet', // Store identifier instead of component
  }, 
  {
    id: '3',
    name: 'Phantom Wallet',
    description: 'Solana wallet',
    icon: 'PhantomWallet', // Store identifier instead of component
  },
  {
    id: '4',
    name: 'Aptos Wallet',
    description: 'Aptos wallet',
    icon: 'LedgerLive', // Store identifier instead of component
  },
  {
    id: '5',
    name: 'Coinbase Wallet',
    description: 'ERC wallet',
    icon: 'CoinbaseWallet', // Store identifier instead of component
  }
];

const WalletList = () => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState('');
  const [selectedWallet, setSelectedWallet] = useState(null);
  const snapPoints = useMemo(() => ['40%'], []);
  const bottomSheetRef = useRef(null); 
  // For the @gorhom/bottom-sheet library, we need to render the backdrop component
  const renderBackdrop = useCallback((props:any) => (<BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} enableTouchThrough={true} />), []);

  const renderItem = ({ item }) => (
    <View style={styles.walletItem}>
      {getIconComponent(item.icon)}
      <View style={styles.walletInfo}>
        <Text style={styles.walletName}>{item.name}</Text>
        <Text style={styles.walletDescription}>{item.description}</Text>
      </View>
      <Plus
        style={styles.plusIcon}
        width={24}
        height={24}
        onPress={() => {
          setSelectedWallet(item);
          setModalVisible(true);
        }}
      />
    </View>
  );

  const getIconComponent = (icon) => {
    switch (icon) {
      case 'Metamask':
        return <Metamask width={56} height={56} />;
      case 'TrustWallet':
        return <TrustWallet width={56} height={56} />;
      case 'PhantomWallet':
        return <PhantomWallet width={56} height={56} />;
      case 'LedgerLive':
        return <LedgerLive width={56} height={56} />;
      case 'CoinbaseWallet':
        return <CoinbaseWallet width={56} height={56} />;
      default:
        return null;
    }
  };

  const handleAddAddress = () => {
    if (selectedWallet && address) {
      const walletType = selectedWallet.name.toLowerCase();
      const newAddress = { address, id: `${address}` };
      dispatch(addAddress({ walletType, address: newAddress }));
      
      // Clear the address input
      setAddress('');

      // Close the bottom sheet
      setModalVisible(false);
    }
  };

  const handleSheetChanges = useCallback((index) => {
    setModalVisible(index !== -1);
  }, []);
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  return (
    <SafeAreaView style={{ backgroundColor: 'black', flex: 1 }}>
      {/* <TopBar /> */}
      <FlatList data={wallets} renderItem={renderItem} keyExtractor={(item) => item.id} style={{marginTop: 20}} />
      <BottomSheet
        index={modalVisible ? 0 : -1}
        onChange={handleSheetChanges}
        backgroundStyle={{ backgroundColor: '#0f151a' }}
        handleIndicatorStyle={{ backgroundColor: '#fafafa' }}
        enablePanDownToClose
        snapPoints={snapPoints}
        enableContentPanningGesture={false}
        ref={bottomSheetRef}
        backdropComponent={renderBackdrop}
      >
        <View>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Add address for {selectedWallet?.name}</Text>
            <TextInput
              style={styles.input}
              onChangeText={setAddress}
              value={address}
              placeholder="Enter address"
              placeholderTextColor="rgba(148, 173, 199, 0.5)"
            />
            <TouchableOpacity style={styles.addButton}   onPress={() => {
    RNHapticFeedback.trigger('impactLight', options);
    handleAddAddress();
  }}>
              <Text style={styles.addButtonText}>Add address</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  walletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  walletInfo: {
    flex: 1,
    marginLeft: 10,
  },
  walletName: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Poppins',
    fontWeight: 'bold',
  },
  walletDescription: {
    fontSize: 12,
    color: '#94ADC7',
    fontFamily: 'Poppins',
    marginTop: 12,
  },
  plusIcon: {
    marginLeft: 10,
  },
  modalText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    fontFamily: 'Poppins',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalView: {
    backgroundColor: "#0f151a",
    padding: 20,
    alignItems: "center",
    height: '100%',
  },
  input: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderColor: '#94ADC7',
    borderRadius: 10,
    color: 'white',
    marginBottom: 20,
    padding: 10,
  },
  addButton: {
    backgroundColor: '#5856d6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: '100%',
    marginTop: 50,
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default WalletList;
