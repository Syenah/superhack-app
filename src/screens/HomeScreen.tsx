import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import RNHapticFeedback from 'react-native-haptic-feedback';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import Carosal1 from '../assets/c1.png';
import Carosal2 from '../assets/c2.png';
import Bitcoin3d from '../assets/svg/3dBitcoin.svg';
import Swap from '../assets/svg/swap.svg';


export default function HomeScreen({navigation}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };
  const images = [{uri: Carosal1}, {uri: Carosal2}];

  const renderCarosalItem = ({item}) => {
    return (
      <View style={{width: '100%', marginTop: 20, paddingHorizontal: 15}}>
        <Image source={item.uri} style={{width: '100%'}} resizeMode="contain" />
      </View>
    );
  };
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning, Crypto Star!';
    if (hour < 18) return 'Hey, Blockchain Buff!';
    return 'Evening, Digital Ace!';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 15,
          paddingTop: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => {
              RNHapticFeedback.trigger('impactLight', options);
              navigation.navigate('Profile');
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontFamily: 'Poppins',
                fontWeight: 'bold',
                marginRight: 5,
              }}>
              {getGreeting()}
            </Text>
          </TouchableOpacity>

          <Bitcoin3d width={24} height={24} />
        </View>
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={() => {
            RNHapticFeedback.trigger('impactLight', options);
            navigation.navigate('Swap');
          }}>
          <Swap width={40} height={40} />
        </TouchableOpacity>
      </View>
      <View style={{height: 200, position: 'relative'}}>
        <Carousel
          data={images}
          renderItem={renderCarosalItem}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={Dimensions.get('window').width}
          loop={true}
          autoplay={true}
          autoplayInterval={5000}
          onSnapToItem={index => setActiveSlide(index)} // Update the active slide index
        />
        <Pagination
          dotsLength={images.length} // The number of dots to display
          activeDotIndex={activeSlide} // Active dot index
          dotStyle={{
            width: 15,
            height: 5,
            borderRadius: 5,
            marginHorizontal: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
          }}
          inactiveDotStyle={{
            backgroundColor: 'grey',
            width: 6,
            height: 6,
            borderRadius: 5,
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={1}
          containerStyle={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'transparent',
            paddingVertical: 0,
            marginBottom: 7,
          }}
        />
      </View>
      <TouchableOpacity
        activeOpacity={0.95}
        style={styles.addButtonBottom}
        onPress={() => {
          RNHapticFeedback.trigger('impactLight', options);
          navigation.navigate('Wallets');
        }}>
        <Text style={styles.addButtonText}>Add to Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
  },
  addButtonBottom: {
    backgroundColor: '#5856d6',
    padding: 15,
    borderRadius: 10,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
});
