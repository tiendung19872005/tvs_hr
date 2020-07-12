import React, { Component } from 'react';
import { StyleSheet, View, Modal, ActivityIndicator, Text } from 'react-native';
import variables from '../../assets/styles/variables';

const Loader = props => {
  const { loading } = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => { console.log('close modal') }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator color={'white'} size='large'
            animating={loading} />
          <Text style={{ color: 'white', marginTop: 6, fontWeight: 'bold' }}>Đang xử lý</Text>

        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    // backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    height: 90,
    width: 90,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 0.5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Loader;
