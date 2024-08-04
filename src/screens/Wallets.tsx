import { View, Text, FlatList, StyleSheet, Modal, TextInput, TouchableOpacity, Button } from 'react-native';
import React, { useState, useCallback, useMemo, useRef } from 'react';
import Metamask from '../assets/svg/Metamask.svg';
import TrustWallet from '../assets/svg/Trustwallet.svg';
import PhantomWallet from '../assets/svg/Phantom.svg';
import LedgerLive from '../assets/svg/LeadgerLive.svg';
import Plus from '../assets/svg/PlusIcon.svg';
import CoinbaseWallet from '../assets/svg/CoinbaseWallet.svg';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const [selectedWallet, setSelectedWallet] = useState(null);
  
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

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  return (
    <SafeAreaView style={{ backgroundColor: 'black', flex: 1 }}>
      <FlatList data={wallets} renderItem={renderItem} keyExtractor={(item) => item.id} style={{marginTop: 20}} />
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
});

export default WalletList;
