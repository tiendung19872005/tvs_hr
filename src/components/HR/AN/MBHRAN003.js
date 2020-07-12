import React, { Component } from "react";
import { Text, View, Image, Alert } from 'react-native';
import Loader from '../../SYS/Loader';

export default class MBHRAN003 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.confirmLogOut();
  }

  logOut = async (navigation) => {
    this.setState({ loading: true });

    DefaultPreference.set('user_pk', null).then(function () { console.log('done') });
    //DefaultPreference.set('username', null).then(function () { console.log('done username') });
    DefaultPreference.set('tes_user_pk', null).then(function () { console.log('done tes_user_pk') });
    DefaultPreference.set('emp_id', null).then(function () { console.log('done emp_id') });
    DefaultPreference.set('full_name', null).then(function () { console.log('done full_name') });

    DefaultPreference.set('sysadmin_yn', null).then(function () { console.log('done client_pass') });
    DefaultPreference.set('company_pk', null).then(function () { console.log('done client_pass') });
    DefaultPreference.set('org_pk', null).then(function () { console.log('done org_pk') });
    DefaultPreference.set('client_pk', null).then(function () { console.log('done client_pass') });
    DefaultPreference.set('client_nm', null).then(function () { console.log('done client_nm') });
    DefaultPreference.set('client_pass', null).then(function () { console.log('done client_nm') });
    //this.setState({ dataMenu: [] });

    await setTimeout(async () => { await this.setState({ loading: false }), await navigation.navigate('Login') }, 700)
  }

  confirmLogOut = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'OK', onPress: () => { this.logOut; } },
      ],
      { cancelable: false }
    )
  }

 
}
