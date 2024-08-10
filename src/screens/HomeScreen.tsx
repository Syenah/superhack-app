import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  Clipboard,
  Button,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import { Swipeable } from "react-native-gesture-handler";
import TopBar from "../components/Topbar";
import Plus from "../assets/svg/PlusIcon.svg";
import Metamask from "../assets/svg/Metamask.svg";
import TrustWallet from "../assets/svg/Trustwallet.svg";
import PhantomWallet from "../assets/svg/Phantom.svg";
import LedgerLive from "../assets/svg/LeadgerLive.svg";
import {
  loadStoredAddresses,
  removeAddress,
  resetState,
} from "../redux/walletSlice";
import { Picker } from "@react-native-picker/picker";
import ArrowDown from "../assets/svg/ArrowDown.svg";
import RightArrow from "../assets/svg/RightArrow.svg";
import OpenEye from "../assets/svg/OpenEye.svg";
import ClosedEye from "../assets/svg/ClosedEye.svg";
import Setting from "../assets/svg/Setting.svg";
import RNHapticFeedback from "react-native-haptic-feedback";
import Carousel, { Pagination } from "react-native-snap-carousel";
import Carosal1 from "../assets/c1.png";
import Carosal2 from "../assets/c2.png";
import Bitcoin3d from "../assets/svg/3dBitcoin.svg";
import Coinbase from "../assets/svg/CoinbaseWallet.svg";
import Swap from "../assets/svg/swap.svg";
import ProfileImg from "../assets/svg/profile.svg";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const [activeSlide, setActiveSlide] = useState(0);
  const storedAddresses = useSelector((state) => state.wallet.addresses);
  const [selectedAddress, setSelectedAddress] = useState({});
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [openWalletType, setOpenWalletType] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const toggleDropdown = (walletType) => {
    setOpenWalletType(openWalletType === walletType ? null : walletType);
    setDropdownVisible(openWalletType !== walletType);
  };
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };
  const images = [{ uri: Carosal1 }, { uri: Carosal2 }];

  const renderCarosalItem = ({ item }) => {
    return (
      <View style={{ width: "100%", marginTop: 20, paddingHorizontal: 15 }}>
        <Image
          source={item.uri}
          style={{ width: "100%" }}
          resizeMode="contain"
        />
      </View>
    );
  };

  useEffect(() => {
    dispatch(loadStoredAddresses());
  }, [dispatch]);

  useEffect(() => {
    const initialSelected = {};
    Object.keys(storedAddresses).forEach((walletType) => {
      if (storedAddresses[walletType].length > 0) {
        initialSelected[walletType] = storedAddresses[walletType][0].address;
      }
    });
    setSelectedAddress(initialSelected);
  }, [storedAddresses]);

  const handleDeleteAccount = () => {
    dispatch(resetState());
  };

  const toTitleCase = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const getIconComponent = (icon) => {
    switch (icon) {
      case "metamask":
        return <Metamask width={56} height={56} />;
      case "trust wallet":
        return <TrustWallet width={56} height={56} />;
      case "phantom wallet":
        return <PhantomWallet width={56} height={56} />;
      case "aptos wallet":
        return <LedgerLive width={56} height={56} />;
      case "coinbase wallet":
        return <Coinbase width={56} height={56} />;
      default:
        return null;
    }
  };

  const renderItem = ({ item }) => {
    const { walletType, addresses, addressCount } = item;
    const isDropdownVisible = openWalletType === walletType;
    return (
      <>
        <View style={styles.walletItem}>
          {getIconComponent(item.walletType)}
          <TouchableOpacity
            activeOpacity={0.95}
            style={styles.walletInfo}
            onPress={() => {
              RNHapticFeedback.trigger("impactLight", options);
              toggleDropdown(walletType);
            }}
          >
            <View style={{ flexDirection: "column" }}>
              <Text style={styles.walletName}>
                {toTitleCase(item.walletType)}
              </Text>
              <Text style={styles.walletDescription}>
                {addressCount} Address{addressCount > 1 ? "es" : ""}
              </Text>
            </View>
            <ArrowDown width={28} height={28} />
          </TouchableOpacity>
        </View>
        {isDropdownVisible && (
          <View style={{ alignItems: "center" }}>
            <FlatList
              data={addresses}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Swipeable
                  renderRightActions={() => (
                    <View style={styles.hiddenItemContainer}>
                      <TouchableOpacity
                        activeOpacity={0.95}
                        style={styles.deleteButton}
                        onPress={() => {
                          RNHapticFeedback.trigger("impactLight", options);
                          dispatch(
                            removeAddress({
                              walletType: walletType,
                              addressId: item.id,
                            })
                          );
                        }}
                      >
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                >
                  <TouchableOpacity
                    activeOpacity={0.95}
                    style={{
                      height: 60,
                      width: "100%",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingHorizontal: 20,
                      marginVertical: 1,
                      backgroundColor: "black",
                    }}
                    onPress={() => {
                      RNHapticFeedback.trigger("impactLight", options);
                      setSelectedAddress({
                        ...selectedAddress,
                        [item.walletType]: item.address,
                      });
                      setActiveItem(item.id);
                      navigation.navigate("WalletDetails", {
                        address: item.address,
                        walletType,
                      });
                    }}
                  >
                    {activeItem === item.id ? (
                      <OpenEye width={48} height={48} />
                    ) : (
                      <ClosedEye width={48} height={48} />
                    )}
                    <Text
                      style={[
                        styles.walletAddress,
                        { flex: 1, marginHorizontal: 10 },
                      ]}
                    >
                      {item.address}
                    </Text>
                    <RightArrow width={28} height={28} />
                  </TouchableOpacity>
                </Swipeable>
              )}
            />
          </View>
        )}
      </>
    );
  };
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning, Crypto Star!";
    if (hour < 18) return "Hey, Blockchain Buff!";
    return "Evening, Digital Ace!";
  };

  // Group addresses by wallet type
  const groupedAddresses = Object.keys(storedAddresses).map((walletType) => ({
    walletType,
    addresses: storedAddresses[walletType],
    icon: walletType,
    addressCount: storedAddresses[walletType]?.length,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 15,
          paddingTop: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => {
              RNHapticFeedback.trigger("impactLight", options);
              navigation.navigate("Profile");
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontFamily: "Poppins",
                fontWeight: "bold",
                marginRight: 5,
              }}
            >
              {getGreeting()}
            </Text>
          </TouchableOpacity>

          <Bitcoin3d width={24} height={24} />
        </View>
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={() => {
            RNHapticFeedback.trigger("impactLight", options);
            navigation.navigate("Swap");
          }}
        >
          <Swap width={40} height={40} />
        </TouchableOpacity>
      </View>
      <View style={{ height: 200, position: "relative" }}>
        <Carousel
          data={images}
          renderItem={renderCarosalItem}
          sliderWidth={Dimensions.get("window").width}
          itemWidth={Dimensions.get("window").width}
          loop={true}
          autoplay={true}
          autoplayInterval={5000}
          onSnapToItem={(index) => setActiveSlide(index)} // Update the active slide index
        />
        <Pagination
          dotsLength={images.length} // The number of dots to display
          activeDotIndex={activeSlide} // Active dot index
          dotStyle={{
            width: 15,
            height: 5,
            borderRadius: 5,
            marginHorizontal: 2,
            backgroundColor: "rgba(255, 255, 255, 0.92)",
          }}
          inactiveDotStyle={{
            backgroundColor: "grey",
            width: 6,
            height: 6,
            borderRadius: 5,
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={1}
          containerStyle={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "transparent",
            paddingVertical: 0,
            marginBottom: 7,
          }}
        />
      </View>
      {groupedAddresses.length === 0 ? (
        <View style={styles.centeredView}>
          <Text style={styles.homeText}>You have not added anything yet</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={groupedAddresses}
            renderItem={renderItem}
            keyExtractor={(item) => item.walletType}
            contentContainerStyle={styles.listContentContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
      <TouchableOpacity
        activeOpacity={0.95}
        style={styles.addButtonBottom}
        onPress={() => {
          RNHapticFeedback.trigger("impactLight", options);
          navigation.navigate("Wallets");
        }}
      >
        <Text style={styles.addButtonText}>Add to Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
  },
  logo: {
    width: 24,
    height: 24,
  },
  walletItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#1C313A",
    marginHorizontal: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  walletInfo: {
    flex: 1,
    // marginLeft: 10,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  walletName: {
    fontSize: 16,
    color: "white",
    fontFamily: "Poppins",
    fontWeight: "bold",
  },
  walletDescription: {
    fontSize: 12,
    color: "#94ADC7",
    fontFamily: "Poppins",
    fontWeight: "500",
    marginTop: 10,
  },
  walletAddress: {
    fontSize: 14,
    color: "white",
    fontFamily: "Poppins",
  },
  // navigateButton: {
  //   marginLeft: 10,
  //   paddingVertical: 5,
  //   paddingHorizontal: 10,
  //   backgroundColor: '#1C313A',
  //   borderRadius: 5,
  // },
  navigateButtonText: {
    color: "white",
    fontSize: 10,
    fontFamily: "Poppins",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  homeText: {
    color: "grey",
    fontSize: 16,
    fontFamily: "Poppins",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#1C313A",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Poppins",
    fontWeight: "bold",
  },
  addButtonBottom: {
    backgroundColor: "#5856d6",
    padding: 15,
    borderRadius: 10,
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
  hiddenItemContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: 75,
  },
  deleteButtonText: {
    color: "white",
    fontFamily: "Poppins",
    fontSize: 12,
    fontWeight: "bold",
  },
  listContentContainer: {
    marginTop: 0,
    paddingBottom: 80, // To ensure the last item is not hidden behind the add button at the bottom
  },
});
