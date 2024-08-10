import { View, Text,Button,StyleSheet } from 'react-native'
import React from 'react'
import { useDispatch } from 'react-redux';
import { resetState } from '../redux/walletSlice';


const Profile = () => {
    const dispatch = useDispatch();
    const handleDeleteAccount = () => {
        dispatch(resetState());
      };
  return (
<View style={styles.container}>
  <Button title="Delete Account" color="red" onPress={handleDeleteAccount} />
</View>
  )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121A21',
    },
    });

export default Profile