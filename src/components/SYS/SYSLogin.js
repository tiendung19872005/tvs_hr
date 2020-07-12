import React, { Component } from 'react';
import {
    View, TextInput, Image, Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Modal,
    TouchableHighlight, TouchableOpacity, SafeAreaView, ImageBackground
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import variables from '../../assets/styles/variables';
import GlobalStyles from "../../assets/styles/GlobalStyles";
import { getMD5 } from '../../assets/js/md5';
import Loader from './Loader';
import firebase from 'react-native-firebase';

import {
    Container, Header, Title, Left, Icon, Right, Body, Content, Card, CardItem,
    Button, Text, Item, Input, StyleProvider, getTheme, Root
} from "native-base";

import { getLoginJson, getDataJson, OnExcute } from '../../services/FetchData';
import DefaultPreference from 'react-native-default-preference';


export default class SYSLogin extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            loading: false,
        };

    }

    componentDidMount() {
        console.log("========componentDidMount===Reload login screen============");
        var isThis = this;
        DefaultPreference.get('username').then((value) => {
            isThis.setState({ username: value });
        });
    }


    getToken = async (p_thr_emp_pk, device_id) => {
        const authorized = await firebase.messaging().hasPermission();
        if (authorized) {
            firebase.messaging().getToken()
                .then(fcmToken => {
                    if (fcmToken) {
                        if (device_id != fcmToken) {
                            // console.log(fcmToken)
                            const action = "UPDATE";
                            const para = `${action}|${p_thr_emp_pk}|${fcmToken}|${''}`;
                            const procedure = "STV_HR_UPD_MBI_EMP_DEVICEID";
                            console.log("log procedure:---------->" + procedure);

                            OnExcute(action, procedure, para)
                                .then((res) => {
                                    console.log(res);
                                });
                        }
                    } else {
                        // user doesn't have a device token yet
                    }
                });
        } else {
            await firebase.messaging().requestPermission();
        }
    };


    login(navigation) {
        this.setState({ loading: true });
        const { username, password } = this.state;

        //let pass=getMD5(password);
        const procedure = "ts.sp_sel_check_login_mobile";
        const user = username;
        const pass = password;
        const p_notmd5_pass = '';
        const p_ip_address = '';
        const para = `${p_notmd5_pass}|${p_ip_address}`;

        getLoginJson(procedure, user, pass, para)
            .then((res) => {
                console.log(res);
                var data_info = res.objcurdatas[0];

                if (data_info.totalrows > 0) {
                    let info = data_info.records[0];
                    if (info.thr_emp_pk > 0) {

                        DefaultPreference.set('user_pk', info.thr_emp_pk);
                        DefaultPreference.set('username', username);
                        DefaultPreference.set('gender', info.gender);
                        DefaultPreference.set('tes_user_pk', info.tes_user_pk);
                        DefaultPreference.set('emp_id', info.emp_id);
                        DefaultPreference.set('home_town', info.home_town);
                        DefaultPreference.set('full_name', info.full_name);
                        DefaultPreference.set('recognize_face_id', info.recognize_face_id);

                        DefaultPreference.set('avatar', info.avatar);
                        DefaultPreference.set('sysadmin_yn', info.sysadmin_yn);
                        DefaultPreference.set('company_pk', info.company_pk);
                        DefaultPreference.set('org_pk', info.org_pk);
                        DefaultPreference.set('client_pk', info.client_pk);
                        DefaultPreference.set('client_nm', info.client_nm);
                        DefaultPreference.set('client_pass', info.client_pass);

                        DefaultPreference.set('home_style', info.home_style);

                        this.setState({ loading: false });
                        navigation.navigate('App');
                        this.getToken(info.thr_emp_pk, info.device_id);

                    } else {
                        DefaultPreference.set('user_pk', '');
                        this.alertNotification('Bạn nhập sai mật khẩu hoặc tên đăng nhập!');
                    }
                }
                else {
                    DefaultPreference.set('user_pk', '');
                    this.alertNotification('Bạn nhập sai mật khẩu hoặc tên đăng nhập!');
                }
            }).catch((error) => {
                DefaultPreference.set('user_pk', '');
                this.alertNotification('Lỗi không thể đăng nhập. Vui lòng liên hệ quản lí để được hỗ trợ!');
            });
    }

    validateLogin = (navigation) => {
        const { username, password } = this.state;
        if (username == undefined) {
            this.alertNotification('Vui lòng nhập tên đăng nhập!');
            return;
        }
        if (password == '') {
            this.alertNotification('Vui lòng nhập mật khẩu!');
            return;
        }
        this.login(navigation)
    }

    alertNotification = (text) => {
        Alert.alert(
            'Lỗi',
            text,
            [
                // { text: 'Hủy', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'OK', onPress: () => this.setState({ loading: false }) },
            ],
            { cancelable: false }
        )
    }


    render() {
        const { navigation } = this.props;
        let { ...data } = this.state;
        return (
            <StyleProvider style={getTheme(variables)}>
                <Root>
                    <Loader loading={this.state.loading} />
                    <ImageBackground source={variables.images.background} style={{ flex: 1 }}>
                        <View style={GlobalStyles.container}>

                            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ flexGrow: 1 }}
                                scrollEnabled keyboardShouldPersistTaps='always'>
                                {/* {console.log(variables.isIphoneX)} */}
                                <View style={{ marginTop: variables.isIphoneX ? '47%' : '33%', marginBottom: '13%' }}>
                                    <View style={[GlobalStyles.wrapLoginLogo, { height: 100, }]}>
                                        <Image
                                            style={{
                                                flex: 1,
                                                resizeMode: 'contain',
                                                marginVertical: 16
                                            }}
                                            source={variables.images.logo} />
                                    </View>
                                </View>


                                <View style={[GlobalStyles.wrapLoginInput]}>
                                    <View style={[GlobalStyles.row1, { height: variables.deviceHeight * 0.06, borderColor: 'white', borderWidth: 1.5, borderRadius: 30, marginVertical: 5, width: '90%' }]}>
                                        <Icon style={[GlobalStyles.iconHeader, { marginLeft: '5%', marginRight: '3%', fontSize: 25, marginTop: '0.7%' }]} name={'ios-contact'} />
                                        <Item>
                                            <Input placeholder="Tên đăng nhập" /*textAlign={'center'}*/
                                                //secureTextEntry={true}
                                                placeholderTextColor="#EEEEEE"
                                                value={data.username}
                                                onChangeText={username => this.setState({ username })}
                                                style={GlobalStyles.inputBox}
                                            />
                                            {/* <Image style={GlobalStyles.line} source={require('../../assets/images/line.png')} /> */}
                                        </Item>
                                    </View>
                                    <View style={GlobalStyles.spaceSmall}></View>

                                    <View style={[GlobalStyles.row1, { height: variables.deviceHeight * 0.06, borderColor: 'white', borderWidth: 1.5, borderRadius: 30, marginVertical: 5, width: '90%' }]}>

                                        <Icon style={[GlobalStyles.iconHeader, { marginLeft: '6%', marginRight: '6%', fontSize: 25, marginTop: '0.7%' }]} name={'ios-lock'} />
                                        <Item>
                                            <Input placeholder="Mật khẩu" /*textAlign={'center'}*/
                                                value={data.password}
                                                secureTextEntry={true}
                                                placeholderTextColor="#EEEEEE"
                                                onChangeText={password => this.setState({ password })}
                                                style={GlobalStyles.inputBox} />
                                        </Item>
                                    </View>


                                    {/* <Image style={GlobalStyles.line} source={require('../../assets/images/line.png')} /> */}

                                    {/* <View style={GlobalStyles.spaceSmall}></View> */}
                                    <View style={GlobalStyles.space}></View>
                                    <View style={[GlobalStyles.row, GlobalStyles.minHeight70]}>
                                        <Button success onPress={() => this.validateLogin(navigation)} style={[GlobalStyles.buttonCustom, {}]}>
                                            <Text style={{ fontWeight: 'bold' }}>ĐĂNG NHẬP</Text>
                                        </Button>
                                    </View>


                                    <View style={GlobalStyles.spaceSmall}></View>

                                    <View style={GlobalStyles.spaceSmall}></View>
                                    <View style={[GlobalStyles.row, GlobalStyles.minHeight70]}>
                                        <View style={GlobalStyles.flex1}>
                                            <Text style={[GlobalStyles.textLeft, GlobalStyles.colorWhite, GlobalStyles.fontSize13, { fontSize: 14 },]}
                                                onPress={() => this.props.navigation.navigate('ResetPassword', {})}>
                                                Quên mật khẩu?
                                            </Text>
                                        </View>
                                        <View style={GlobalStyles.flex1}>
                                            <Text style={[GlobalStyles.textRight, GlobalStyles.colorWhite, GlobalStyles.fontSize13, { fontSize: 14 }]}
                                                onPress={() => this.props.navigation.navigate('PinConfig')}>
                                                Cấu hình ứng dụng
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </KeyboardAwareScrollView>
                        </View>
                    </ImageBackground>
                </Root>
            </StyleProvider>
        )
    }
}

