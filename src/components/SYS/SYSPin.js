import React, { Component } from 'react';
import { View } from 'react-native';
import PinView from 'react-native-pin-view';

export default class SYSPin extends Component {

  static navigationOptions = {
    headerTitle: 'Nhập mã Pin',
  }

  constructor(props) {
    super(props);
    this.onComplete = this.onComplete.bind(this);
    this.state = {
      pin: "1911"
    }
  }
  onComplete(inputtedPin, clear) {
    if (inputtedPin !== this.state.pin) {
      alert('Mã pin không đúng!');
      clear();
    } else {
      //console.log("Pin is correct");
      this.props.navigation.navigate('Config');
    }
  }
  render() {
    const { goBack } = this.props.navigation;

    const { navigation } = this.props;
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#f1f1f1',
        justifyContent: 'center'
      }}>
        <PinView
          onComplete={this.onComplete}
          //pinLength={this.state.pin.length}
          pinLength={4} // You can also use like that.
        />
      </View>
    );
  }
}
