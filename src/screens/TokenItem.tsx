import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Clipboard,
  RefreshControl
} from 'react-native';
import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
import axios from 'axios';
import {useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Arbitrum from '../assets/svg/network logo/Arbitrum.svg';
import Avalanche from '../assets/svg/network logo/Avalanche.svg';
import Binance from '../assets/svg/network logo/BNBMainnet.svg';
import Base from '../assets/svg/network logo/Base.svg';
import Chiliz from '../assets/svg/network logo/Chiliz.svg';
import Cronos from '../assets/svg/network logo/Cronos.svg';
import Ethereum from '../assets/svg/network logo/EthereumMainnet.svg';
import Fantom from '../assets/svg/network logo/Fantom.svg';
import Gnosis from '../assets/svg/network logo/Gnosis.svg';
import Linea from '../assets/svg/network logo/Linea.svg';
import Matic from '../assets/svg/network logo/PolygonMainnet.svg';
import Moonriver from '../assets/svg/network logo/Moonriver.svg';
import Optimism from '../assets/svg/network logo/optimism.svg';
import Moonbeam from '../assets/svg/network logo/Moonbeam.svg';
import Palm from '../assets/svg/network logo/Palm.svg';
import ArrowDown from '../assets/svg/ArrowDown.svg';
import SolanaNetwork from '../assets/svg/network logo/Solana.svg';
import BottomSheet, { BottomSheetBackdrop }  from '@gorhom/bottom-sheet';
import SearchIcon from '../assets/svg/SearchIcon.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Copy from '../assets/svg/copy.svg';
import RNHapticFeedback from 'react-native-haptic-feedback';
import SkeletonLoader from '../components/SkeletonLoader';
import { BASE_URL } from '../../URL';

const logoComponents = {
  Arbitrum: <Arbitrum height={28} width={28} />,
  Avalanche: <Avalanche height={28} width={28} />,
  Binance: <Binance height={28} width={28} />,
  Ethereum: <Ethereum height={28} width={28} />,
  Fantom: <Fantom height={28} width={28} />,
  Gnosis: <Gnosis height={28} width={28} />,
  Matic: <Matic height={28} width={28} />,
  Optimism: <Optimism height={28} width={28} />,
  Moonbeam: <Moonbeam height={28} width={28} />,
  Cronos: <Cronos height={28} width={28} />,
  Chiliz: <Chiliz height={28} width={28} />,
  Base: <Base height={28} width={28} />,
  Linea: <Linea height={28} width={28} />,
  Moonriver: <Moonriver height={28} width={28} />,
  Palm: <Palm height={28} width={28} />,
};

export const network = [
  {
    name: 'Metamask',
    networks: [
      {
        name: 'Arbitrum',
        chainId: 42161,
        logoName: 'Arbitrum',
      },
      {
        name: 'Avalanche',
        chainId: 43114,
        logoName: 'Avalanche',
      },
      {
        name: 'BNB',
        chainId: 56,
        logoName: 'Binance',
      },
      {
        name: 'Ethereum',
        chainId: 0x1,
        logoName: 'Ethereum',
      },
      {
        name: 'Fantom',
        chainId: 250,
        logoName: 'Fantom',
      },
      {
        name: 'Gnosis',
        chainId: 100,
        logoName: 'Gnosis',
      },
      {
        name: 'Polygon',
        chainId: 0x89,
        logoName: 'Matic',
      },
      {
        name: 'Optimism',
        chainId: 10,
        logoName: 'Optimism',
      },
      {
        name: 'Moonbeam',
        chainId: 1284,
        logoName: 'Moonbeam',
      },
      {
        name: 'Cronos',
        chainId: 25,
        logoName: 'Cronos',
      },
      {
        name: 'Chiliz',
        chainId: 1,
        logoName: 'Chiliz',
      },
      {
        name: 'Base',
        chainId: 109,
        logoName: 'Base',
      },
      {
        name: 'Linea',
        chainId: 59,
        logoName: 'Linea',
      },
      {
        name: 'Moonriver',
        chainId: 1285,
        logoName: 'Moonriver',
      },
      {
        name: 'Palm',
        chainId: 11297108109,
        logoName: 'Palm',
      },
    ],
  },
];
const initialNetwork = {
  name: 'Ethereum',
  chainId: 0x1,
  logoName: 'Ethereum',
};
const lightColors = [
  '#FFFACD', // light yellow
  '#E0FFFF', // light cyan, for a smooth feel
  '#B0E0E6', // powder blue, for a light feel
  '#F0E68C', // khaki, light and smooth
  '#D8BFD8', // thistle, light violet
  '#98FB98', // pale green, very smooth and light
  '#AFEEEE', // pale turquoise, smooth and light
];
const TokenItem = () => {
  const route = useRoute();
  const {address, walletType} = route.params;
  const [tokenData, setTokenData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [ethereum, setEthereum] = useState(false);
  const [solana, setSolana] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['50%'], []);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNetworks, setFilteredNetworks] = useState(network[0].networks);
  const [loading, setLoading] = useState(true);
  const [totalUsdValue, setTotalUsdValue] = useState(0);
  const [tokenCount, setTokenCount] = useState(0);

// Function to randomly select a light color
// const getRandomLightColor = () => {
//   const randomIndex = Math.floor(Math.random() * lightColors.length);
//   return lightColors[randomIndex];
// };
const calculateTotalValue = (data) => {
  let total = 0;
  let count = 0;
  data.forEach(item => {
    if (item.usd_value) {
      total += parseFloat(item.usd_value);
    }
    count++;
  });
  setTotalUsdValue(total);
  setTokenCount(count);
};
  const toggleBottomSheet = () => {
    setIsBottomSheetVisible(!isBottomSheetVisible);
  };
  const renderBackdrop = useCallback((props:any) => (<BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} enableTouchThrough={true} />), []);

  const handleNetworkSelect = async (selectedNetwork) => {
    if (selectedNetwork === null) {
      setSelectedNetwork(initialNetwork);
    } else {
      setSelectedNetwork(selectedNetwork);
      try {
        const jsonValue = JSON.stringify(selectedNetwork);
        await AsyncStorage.setItem('selectedNetwork', jsonValue);
         ('selected network', selectedNetwork);
      } catch (e) {
         ('error', e);
      }
    }
  };
  const renderNetworkItem = ({ item }) => (
    <TouchableOpacity
      style={styles.networkItem}
      onPress={() =>{    RNHapticFeedback.trigger('impactLight', options); handleNetworkSelect(item)}}
    >
      <View style={styles.networkItemContainer}>
        {logoComponents[item.logoName]}
        <Text style={styles.networkName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );
  const handleSheetChanges = useCallback(index => {
    if (index === -1) {
      setIsBottomSheetVisible(false);
    }
  }, []);
  const fetchTokenData = async () => {
    let dataToken;
     ('selectedNetwork====================>>>>>>>>>>>>>>>>>>>>', selectedNetwork)

    if (walletType === 'metamask' || walletType === 'trust wallet' || walletType === 'coinbase wallet') {
      if (address) {
        try {
          const response = await axios.get(
            `${BASE_URL}/moralis/ethereumTokenBalances?chain=${selectedNetwork?.chainId}&address=${address}`,
          );
          dataToken = response.data;
          if(response?.status === 200){
            setLoading(false);
          }
          setEthereum(true);
        } catch (error) {
          console.error(
            'Error fetching data for MetaMask or Trust Wallet:',
            error,
          );
        }
      } else {
         ('No address found for MetaMask or Trust Wallet');
        setTokenData([]); // Set an empty array to clear the token data
        return;
      }
    } else if (walletType === 'phantom wallet') {
      if (address) {
        try {
          const response = await axios.get(
            `https://api.shyft.to/sol/v1/wallet/all_tokens?network=mainnet-beta&wallet=${address}`,
            {
              headers: {
                'x-api-key': process.env.SOLANA_API_KEY,
              },
            },
          );
          dataToken = response?.data?.result;
          if(response?.status === 200){
            setLoading(false);
          }
          setSolana(true);
           ('solana data', response);
        } catch (error) {
          console.error('Error fetching data for Phantom Wallet:', error);
        }
      } else {
         ('No address found for Phantom Wallet');
        setTokenData([]); // Set an empty array to clear the token data
        return;
      }
    }

    setTokenData(dataToken);
    calculateTotalValue(dataToken);
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
  
    try {
      const jsonValue = await AsyncStorage.getItem('selectedNetwork');
      if (jsonValue !== null) {
        const networkData = JSON.parse(jsonValue);
        const updatedNetwork = {
          name: networkData.name,
          chainId: networkData.chainId,
          logoName: networkData.logoName,
          logo: logoComponents[networkData.logoName],
        };
        setSelectedNetwork(updatedNetwork);
      } else {
        setSelectedNetwork(initialNetwork);
      }
    } catch (e) {
       ('error', e);
    }
  
    fetchTokenData().then(() => setRefreshing(false));
  }, []);

  const handleSearch = query => {
    setSearchQuery(query);
    if (query) {
      const filtered = network[0].networks.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredNetworks(filtered);
    } else {
      setFilteredNetworks(network[0].networks);
    }
  };
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };
  // const logoPlaceholderBackgroundColor = getRandomLightColor();
  useEffect(() => {
    fetchTokenData();
  }, [selectedNetwork, walletType,]);
  // useEffect(() => {
  //   const fetchData = () => {
  //     fetchTokenData();
  //   };

  //   fetchData();
  // }, [address, walletType]);

  useEffect(() => {
    const fetchNetwork = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('selectedNetwork');
         ('jsonValue', jsonValue);
        if (jsonValue !== null) {
          const networkData = JSON.parse(jsonValue);
          const updatedNetwork = {
            name: networkData.name,
            chainId: networkData.chainId,
            logoName: networkData.logoName,
            logo: logoComponents[networkData.logoName],
          };
          setSelectedNetwork(updatedNetwork);
        } else {
          // If no value is found in AsyncStorage, set the default initialNetwork
          setSelectedNetwork(initialNetwork);
        }
      } catch (e) {
         ('error', e);
      }
    };
  
    fetchNetwork();
  }, []);
  return (
    <SafeAreaView style={{backgroundColor: 'black', flex: 1}}>
      <View style={styles.top}>
        
          {walletType === 'metamask' || walletType === 'trust wallet' || walletType === 'coinbase wallet' ? (
            <TouchableOpacity   onPress={() => {
              RNHapticFeedback.trigger('impactLight', options);
              toggleBottomSheet();
            }}>
            <View style={{flexDirection: 'column'}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 10,
                  alignItems: 'center',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View>{logoComponents[selectedNetwork?.logoName]}</View>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'Poppins',
                      fontSize: 16,
                      marginLeft: 15,
                      fontWeight: 'bold',
                    }}>
                    {selectedNetwork?.name}
                  </Text>
                </View>
                <ArrowDown height={28} width={28} />
              </View>
            </View>
            </TouchableOpacity>
          ) : (
            <View style={{flexDirection: 'column'}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 10,
                  alignItems: 'center',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <SolanaNetwork height={40} width={40} />
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'Poppins',
                      fontSize: 16,
                      marginLeft: 15,
                      fontWeight: 'bold',
                    }}>
                    SOLANA
                  </Text>
                </View>
                {/* <ArrowDown height={28} width={28} /> */}
              </View>
            </View>
          )}
       
        <View
          style={{
            height: 1,
            backgroundColor: '#fafafa',
            marginTop: 5,
            marginHorizontal: 16,
          }}
        />
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginTop: 20,
            alignItems: 'center',
            paddingHorizontal: 9,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                color: '#fff',
                fontFamily: 'Poppins',
                fontSize: 14,
                fontWeight: 'bold',
                marginLeft: 10,
               
              }}>
              Address:{' '}
            </Text>
            <Text
              style={{
                backgroundColor: '#121A21',
                borderRadius: 20,
                width: 100,
                color: '#fafafa',
                fontSize: 14,
                fontFamily: 'Poppins',
              }}>{`${address.slice(0, 5)}...${address.slice(-4)}`}</Text>
          </View>
          <Copy height={28} width={28}  onPress={() => Clipboard.setString(address)} />
        </View>
      </View>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          Total Value: ${totalUsdValue?.toFixed(2)}
        </Text>
        <Text style={styles.summaryText}>
          Total Tokens: {tokenCount}
        </Text>
      </View>

     { loading ? <FlatList
        data={[1,1,1,1,1,1,1,1 ]}
        keyExtractor={item => item}
        renderItem={() => <SkeletonLoader />}
      
     /> : <FlatList
        data={tokenData}
        keyExtractor={item => item.address}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{paddingBottom: 10, marginTop: 10}}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <View style={styles.container}>
            <View style={styles.leftContainer}>
              {walletType === 'metamask' || walletType === 'trust wallet' || walletType === 'coinbase wallet' ? (
                item.thumbnail ? (
                  <Image source={{uri: item?.thumbnail}} style={styles.logo} />
                ) : (
                  <View style={styles.logoPlaceholder}>
                    <Text style={styles.logoPlaceholderText}>
                      {item?.name ? item?.name[0]?.toUpperCase() : "N"}
                    </Text>
                  </View>
                )
              ) : walletType === 'phantom wallet' ? (
                item?.info?.image ? (
                  item?.info?.image.includes('ipfs') ? (
                    <View style={styles.logoPlaceholder}>
                      <Text style={styles.logoPlaceholderText}>
                        {item?.info?.name ? item?.info?.name[0]?.toUpperCase() : 'N'}
                      </Text>
                    </View>
                  ) : (
                    <Image
                      source={{ uri: item?.info?.image }}
                      style={styles.logo}
                    />
                  )
                ) : (
                  <View style={styles.logoPlaceholder}>
                    <Text style={styles.logoPlaceholderText}>
                      {item?.info?.name ? item?.info?.name.toUpperCase():'N'}
                    </Text>
                  </View>
                )
              ) : null}

              <View style={{display: 'flex', width: 100}}>
                <Text style={styles.symbol}>
                  {item?.symbol?.toUpperCase() || item?.info?.symbol}
                </Text>
                <Text style={styles.name}>
                  {item?.name || item?.info?.name}
                </Text>
              </View>
            </View>
            <View style={styles.rightContainer}>
              <Text style={styles.balance}>
                {ethereum
                  ? Number(item.balance_formatted).toFixed(5)
                  : item.balance}
              </Text>
              <Text style={styles.usdValue}>
                {item.usd_value
                  ? `$${Number(item.usd_value).toFixed(2)}`
                  : null}
              </Text>
            </View>
          </View>
        )}
      />}
      <BottomSheet
        ref={bottomSheetRef}
        index={isBottomSheetVisible ? 0 : -1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        enableContentPanningGesture={false}
        handleIndicatorStyle={{backgroundColor: '#fafafa'}}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: '#0f151a',
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',

        }}>
        <SafeAreaView style={{backgroundColor: '#0f151a', marginTop: 10}}>
          <View style={styles.containerTopbar}>
            <View style={styles.searchBar}>
              <SearchIcon width={24} height={24} />
              <TextInput
                placeholder="Search"
                style={styles.input}
                placeholderTextColor="#94ADC7"
                onChangeText={handleSearch}
                value={searchQuery}
              />
            </View>
          </View>
        </SafeAreaView>

        <FlatList
          data={filteredNetworks}
          renderItem={renderNetworkItem}
          numColumns={3}
          keyExtractor={item => `${item.name}-${item.chainId}`} // Generate a unique key for each item
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}
        />
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'black',
    borderBottomWidth: 1,
    borderBottomColor: '#16242C',
    marginHorizontal: 10,
  },
  top: {
    height: '20%',
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 10,
    borderColor: '#FAFAFA',
    borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 20,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 20,
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1C313A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoPlaceholderText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Poppins',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 14,
    color: '#94ADC7',
    fontFamily: 'Poppins',
    marginTop: 5,
  },
  symbol: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Poppins',
  },
  rightContainer: {
    alignItems: 'flex-end',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '50%',
  },
  balance: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Poppins',
  },
  usdValue: {
    fontSize: 12,
    color: '#94ADC7',
    fontFamily: 'Poppins',
    marginTop: 5,
  },
  contentContainer: {
    backgroundColor: '#121A21',
  },
  networkItem: {
    margin: 20,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  networkItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  networkName: {
    color: '#fafafa',
    fontSize: 12,
    marginTop: 20,
    fontFamily: 'Poppins',
  },
  containerTopbar: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    height: 72,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#243647',
    borderRadius: 12,
    flex: 1,
    paddingLeft: 10,
    height: 48,
  },
  input: {
    marginLeft: 10,
    flex: 1,
    color: 'white',
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#121A21',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  summaryText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
  },
});

export default TokenItem;
