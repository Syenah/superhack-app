import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  Clipboard,
} from 'react-native';
import React, {useState,useMemo,useRef,useEffect,useCallback} from 'react';
import SwapLine from '../assets/svg/swapline.svg';
import Ethereum from '../assets/svg/network logo/EthereumMainnet.svg';
import WalletIcon from '../assets/svg/walleticon.svg';
import Arbitrum from '../assets/svg/network logo/Arbitrum.svg';
import Avalanche from '../assets/svg/network logo/Avalanche.svg';
import Binance from '../assets/svg/network logo/BNBMainnet.svg';
import Base from '../assets/svg/network logo/Base.svg';
import Gnosis from '../assets/svg/network logo/Gnosis.svg';
import Matic from '../assets/svg/network logo/PolygonMainnet.svg';
import Optimism from '../assets/svg/network logo/optimism.svg';
import Cronos from '../assets/svg/network logo/Cronos.svg';
import CCIP from '../assets/svg/ccipbnm.svg';
import Blast from '../assets/svg/network logo/Blast.svg';
import Mode from '../assets/svg/network logo/Mode.svg';
import Wemix from '../assets/svg/network logo/Wemix.svg';
import Sucess from '../assets/Sucess.json';
import LottieView from 'lottie-react-native';
import Swapfail from '../assets/swapfail.json';
import Copy from '../assets/svg/copy.svg';
import SwapLoading from '../assets/swaploading.json';
import axios from 'axios';


const testBlockchain = [
  {
    id: '1',
    name: 'Avalanche',
    destinationChainSelector: '14767482510784806043',
    logo: <Avalanche height={28} width={28}/>,
  },
  {
    id: '2',
    name: 'BNB',
    destinationChainSelector: '13264668187771770619',
    logo: <Binance height={28} width={28}/>,
  },
  {
    id: '3',
    name: 'Celo',
    destinationChainSelector: '3552045678561919002',
    logo: <Cronos height={28} width={28}/>,
  },
  {
    id: '4',
    name: 'Arbitrum',
    destinationChainSelector: '3478487238524512106',
    logo: <Arbitrum height={28} width={28}/>,
  },
  {
    id: '5',
    name: 'Base',
    destinationChainSelector: '10344971235874465080',
    logo: <Base height={28} width={28}/>,
  },
  {
    id: '6',
    name: 'Optimism',
    destinationChainSelector: '5224473277236331295',
    logo: <Optimism height={28} width={28}/>,
  },
  {
    id: '7',
    name: 'Polygon',
    destinationChainSelector: '16281711391670634445',
    logo: <Matic height={28} width={28}/>,
  },
  {
    id: '8',
    name: 'Gnosis',
    destinationChainSelector: '8871595565390010547',
    logo: <Gnosis height={28} width={28}/>,
  },
  {
    id: '9',
    name: 'Blast',
    destinationChainSelector: '2027362563942762617',
    logo: <Blast height={28} width={28}/>,
  },
  {
    id: '10',
    name: 'Mode',
    destinationChainSelector: '829525985033418733',
    logo: <Mode height={28} width={28}/>,
  },


  {
    id: '11',
    name: 'Wemix',
    destinationChainSelector: '9284632837123596123',
    logo: <Wemix height={28} width={28}/>,
  },

];

const testTokens = [
  {
    id: '1',
    name: 'CCIP-BnM',
    tokenAddress: '0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05',
    logo : <CCIP height={42} width={42}/>,
  },
];

export default function SwapScreen() {
  const [amount, setAmount] = useState('0.000001');
  const [destinationChainSelector, setDestinationChainSelector] = useState('16281711391670634445');
  const [receiver, setReceiver] = useState('0x....');
  const [token, setToken] = useState('0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05');
  const [selectedToken, setSelectedToken] = useState('CCIP-BnM');
  const [selectedBlockchain, setSelectedBlockchain] = useState('Polygon');
  const [deployedBlockchain, setDeployedBlockchain] = useState('Ethereum');
  const [transaction, setTransaction] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [localInputValue, setLocalInputValue] = useState('');
  const [swapFail, setSwapFail] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selectedBlockchainLogo, setSelectedBlockchainLogo] = useState(<Matic height={28} width={28}/>);
  const snapPoints = useMemo(() => ['40%'], []);
  const snapPointsSuccess = useMemo(() => ['60%'], []);

  const handleNumberPress = num => {
    setAmount(prevAmount => prevAmount + num);
  };

  const handleDelete = () => {
    setAmount(prevAmount => prevAmount.slice(0, -1));
  };

  const handleAddAddress = () => {
    if (localInputValue.length > 0){
      setReceiver(localInputValue);
    }
    
    setLocalInputValue('');
  };

  const renderItemBlockchain = ({ item }) => (
    <TouchableOpacity style={styles.networkItem} onPress={() => {
      setSelectedBlockchain(item.name);
      setDestinationChainSelector(item.destinationChainSelector);
      setSelectedBlockchainLogo(item.logo);
    }}>
      <View style={styles.networkItemContainer}>
        {item?.logo}
        <Text style={styles.networkName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );
  const swapTokenPayNative = async () => {
    
    setLoader(true);
    const body = {
      destinationChainSelector: destinationChainSelector.trim(),
      receiver: receiver.trim(),
      token: token.trim(),
      amount: amount,
    };
    console.log("bodyyyyyyyyyy", body);
    try {
      const response = await axios.post(
        `http://13.127.84.244/ccip/transfer-native`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response?.status === 201) {
        console.log(response?.data);
        setTransaction(response?.data);
        setLoader(false);
      } else {
        console.log('Failed');
        setLoader(false);
        setSwapFail(true);
        
        
      }
    } catch (error) {
      console.log(error);
      setSwapFail(true);
      setLoader(false);
    }
  };

  


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.swapCard}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{width: '50%'}}>
            <Text
              style={styles.amountText}
              numberOfLines={1}
              ellipsizeMode="tail">
              {amount}
            </Text>
            <Text style={styles.dollarValue}>$0</Text>
          </View>
          <View style={{flexDirection: 'column'}}>
          </View>
        </View>
        <SwapLine width={310} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{width: '50%'}}>
            <Text
              style={styles.amountText}
              numberOfLines={1}
              ellipsizeMode="tail">
              {amount}
            </Text>
            <Text style={styles.dollarValue}>$0</Text>
          </View>
          <View style={{flexDirection: 'column',alignItems:'flex-start'}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <WalletIcon  width={26} height={26}/>
                <View
                  style={{
                    flexDirection: 'column',
                    marginLeft: 10,
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                  }}>
                </View>
              </View>
          
          </View>
        </View>
      </View>

      <View style={styles.percentages}>
        {['25%', '50%', '75%', 'Max'].map((percent, index) => (
          <TouchableOpacity key={index} style={styles.percentButton}>
            <Text style={styles.percentText}>{percent}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.numpad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0].map((num, index) => (
          <TouchableOpacity
            key={index}
            style={styles.numButton}
            onPress={() => handleNumberPress(num.toString())}>
            <Text style={styles.numText}>{num}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.numButton} onPress={handleDelete}>
          <Text style={styles.numText}>⌫</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.previewButton} onPress={swapTokenPayNative}>
        <Text style={styles.previewText}>Swap</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  swapCard: {
    backgroundColor: 'rgba(27, 34, 42, 1)',
    borderRadius: 10,
    marginBottom: 20,
    height: 230,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  amountText: {
    color: 'rgba(219, 223, 225, 1)',
    fontSize: 21,
    fontWeight: '600',
  },
  dollarValue: {
    color: '#8e8e93',
    fontSize: 18,
  },
  tokenSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: 100,
  },
  percentages: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  percentButton: {
    backgroundColor: '#1c1c1e',
    padding: 10,
    borderRadius: 5,
  },
  percentText: {
    color: '#fff',
  },
  numpad: {
    height: '43%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  numButton: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  numText: {
    color: '#fff',
    fontSize: 24,
  },
  previewButton: {
    backgroundColor: '#5856d6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  previewSucessButton: {
    backgroundColor: '#5856d6',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  previewText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
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
    marginTop: 100,
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalView: {
    backgroundColor: "#0f151a",
    padding: 20,
    alignItems: "center",
    flex: 1
  },
  networkItem: {
    margin: 10,
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
});
