
import React, { Component } from 'react';

import { ToastAndroid, PermissionsAndroid, Platform, Dimensions, Alert, StyleSheet, Image, ActivityIndicator, View, TouchableOpacity, ImageBackground, TouchableHighlight, Button as Button1 } from 'react-native';
import {
    Root, Toast, Container, Body, Content, Header, Left, Right, Spinner,
    Title, Input, dataMonth, Label, Button, Text, StyleProvider, getTheme, MonthBox
} from "native-base";
import variables from '../../../assets/styles/variables.js';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/Ionicons';
import Loader from '../../SYS/Loader';
import moment from 'moment';
import Geolocation from '@react-native-community/geolocation';
import DefaultPreference from 'react-native-default-preference';
import { OnExcute, getUserInfo, getDataJson, UploadImage } from '../../../services/FetchData';
import BackgroundGeolocation from "react-native-background-geolocation";
import MapView, { Marker, AnimatedRegion, Polyline, PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { Badge, withBadge } from 'react-native-elements'


export default class MBHRRE003_IOS extends Component {

    constructor(props) {
        super(props);
        focusListener = null;
        this.mapRef = null;
        this.state = {
            loading: false,
            p_emp_pk: '',
            username: '',
            emp_id: '',
            statusCheckIn: true,
            statusCheckOut: false,
            clearAll: false,
            checkin_dt: '',
            checkout_dt: '',
            coorDinates: [],
            latitudeCheckIn: null,
            longitudeCheckIn: null,
            latitude: '',
            longitude: '',
        }
        DefaultPreference.getAll().then((valueAll) => {
            this.setState({ p_emp_pk: valueAll['user_pk'], username: valueAll['username'], emp_id: valueAll['emp_id'] });
        })
    }

    startBackground = async () => {

        //await BackgroundGeolocation.destroyLocations();
        BackgroundGeolocation.ready({
            // BackgroundGeolocation Config
            reset: true,
            desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_NAVIGATION,
            //desiredAccuracy: 0,
            distanceFilter: 10,
            stationaryRadius: 10,
            stopAfterElapsedMinutes: 0,
            //stopTimeout: 1,
            debug: false,              // <-- enable this hear debug sounds.
            logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
            logMaxDays: 1,
            stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when app terminated.
            startOnBoot: true,        // <-- Auto start tracking when device is powered-up.

            persistMode: BackgroundGeolocation.PERSIST_MODE_LOCATION,

            // HTTP / SQLite config
            httpTimeout: 40000,
            url: `http://${variables.ipServer}/${variables.nameApi}/ExcutePosList`,
            locationTemplate: '{"lat":<%= latitude %>,"lng":<%= longitude %>, "timestamp": "<%= timestamp %>"}',
            httpRootProperty: 'dataPositon',
            batchSync: true,       // <-- Set true to sync locations to server in a single HTTP request.
            autoSync: false,
            //autoSyncThreshold: 5,  // <-- Set true to sync each location to server as it arrives.
            headers: {              // <-- Optional HTTP headers
                "X-FOO": "bar"
            },
            params: {               // <-- Optional HTTP params
                'procedure': 'STV_HR_UPD_MBI_MBHRRE003_0',
                "para": `UPDATE|${this.state.p_emp_pk}|${this.state.emp_id}|${0}|${this.state.username}`,
                'auth_token': "null",
            },
        }
            , (state) => {
                console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);
                if (!state.enabled) {
                    BackgroundGeolocation.start(function () {
                        console.log("- Start success");
                    });
                }
            });
        // This handler fires whenever bgGeo receives a location update.
        BackgroundGeolocation.onLocation(location => {
            // BackgroundGeolocation.getCount(async count => {
            // });
        }, error => {
            console.log('[location] ERROR: ', error);
        });

        // This handler fires when movement states changes (stationary->moving; moving->stationary)
        BackgroundGeolocation.onMotionChange(location => {
            console.log('[motionchange] ', location);
        });

        // This handler fires on HTTP responses
        BackgroundGeolocation.onHttp(async response => {
            let status = response.status;
            let success = response.success;
            let responseText = JSON.parse(response.responseText);
            let responseJson = JSON.parse(responseText)
            // console.log('[motionchange] ', responseJson);
            if (responseJson.objcurdatas[0].records[0].status == 'OK') {
                //await BackgroundGeolocation.destroyLocations();
            }

        });

        // This event fires when a change in motion activity is detected
        BackgroundGeolocation.onActivityChange(activityEvent => {
            console.log('[activitychange] ', activityEvent);
        });

        // This event fires when the user toggles location-services authorization
        BackgroundGeolocation.onProviderChange(providerEvent => {
            console.log('[providerchange] ', providerEvent);
        });
    }


    componentDidMount = async () => {
        this.focusListener = this.props.navigation.addListener('didFocus', async () => {
            if (this.state.checkout_dt != '') {
                await this.setState({ coorDinates: [], checkin_dt: '', checkout_dt: '', clearAll: false, statusCheckIn: true, statusCheckOut: false, loading: false });
            }
            DefaultPreference.getAll().then(async (valueAll) => {
                // p_emp_pk = valueAll['user_pk'];
                // username = valueAll['username'];
                // emp_id = valueAll['emp_id'];

                this.setState({ loading: true });
                let procedure = "STV_HR_UPD_MBI_MBHRRE003_1";
                let para = `${valueAll['user_pk']}|${valueAll['username']}`;
                console.log("log para:---------->" + para);
                await getDataJson(procedure, para, '1')
                    .then(async (res) => {
                        console.log(res);
                        var data_info = res.objcurdatas[0];

                        if (data_info.totalrows > 0) {
                            let lat = data_info.records[0].checkin_location.slice(0, data_info.records[0].checkin_location.lastIndexOf(','));
                            let lng = data_info.records[0].checkin_location.slice(data_info.records[0].checkin_location.lastIndexOf(',') + 1);

                            this.startBackground()
                            this.setState({
                                latitude: parseFloat(lat), longitude: parseFloat(lng),
                                latitudeCheckIn: lat, longitudeCheckIn: lng,
                                statusCheckIn: false, statusCheckOut: true,
                                clearAll: false, loading: false,
                                checkin_dt: data_info.records[0].checkin_dt,
                            })
                        } else {
                            BackgroundGeolocation.getCurrentPosition(
                                {
                                    timeout: 30,          // 30 second timeout to fetch location
                                    maximumAge: 5000,     // Accept the last-known-location if not older than 5000 ms.
                                    desiredAccuracy: 1,  // Try to fetch a location with an accuracy of `10` meters.
                                    persist: false,
                                },
                                position => {
                                    this.setState({
                                        latitude: position.coords.latitude,
                                        longitude: position.coords.longitude,
                                    });
                                },
                                error => this.setState({ error: error.message })
                            );
                            await BackgroundGeolocation.stop();
                            await BackgroundGeolocation.destroyLocations();

                            this.setState({ statusCheckIn: true, statusCheckOut: false, clearAll: false, loading: false, });

                        }

                    }).catch((error) => {
                        BackgroundGeolocation.getCurrentPosition(
                            {
                                timeout: 30,          // 30 second timeout to fetch location
                                maximumAge: 5000,     // Accept the last-known-location if not older than 5000 ms.
                                desiredAccuracy: 1,  // Try to fetch a location with an accuracy of `10` meters.
                                persist: false,
                            },
                            position => {
                                this.setState({
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude,
                                });
                            },
                            error => this.setState({ error: error.message })
                        );
                        this.setState({ statusCheckIn: true, statusCheckOut: false, clearAll: false, loading: false, });

                        let toast = variables.toastError;
                        toast.text = 'Chức năng này cần có kết nối mạng để thực hiện!'
                        Toast.show(toast)

                    });
            })
        });
    }


    checkIn = async () => {

        this.setState({ loading: true })
        await BackgroundGeolocation.getCurrentPosition({
            timeout: 30,          // 30 second timeout to fetch location
            maximumAge: 5000,     // Accept the last-known-location if not older than 5000 ms.
            desiredAccuracy: 1,  // Try to fetch a location with an accuracy of `10` meters.
            persist: false,
        }, async location => {
            console.log(location)
            let para = `INSERT|${this.state.p_emp_pk}|${this.state.emp_id}|${0}|${this.state.username}|${(location.coords.latitude)},${(location.coords.longitude)}`
            let procedure = 'STV_HR_UPD_MBI_MBHRRE003_0';

            await OnExcute("INSERT", procedure, para)
                .then(async (res) => {
                    console.log(res);
                    var data_info = res.objcurdatas[0];

                    if (data_info.totalrows > 0) {
                        if (data_info.records[0].status == "OK") {
                            await BackgroundGeolocation.destroyLocations();
                            this.startBackground();

                            this.setState({
                                latitude: parseFloat(location.coords.latitude), longitude: parseFloat(location.coords.longitude),
                                latitudeCheckIn: location.coords.latitude, longitudeCheckIn: location.coords.longitude,
                                checkin_dt: new Date, loading: false, statusCheckIn: false,
                                statusCheckOut: true, clearAll: false,
                            });
                            let toast = variables.toastSuccessful;
                            variables.toastSuccessful.text = 'Check in thành công!'
                            Toast.show(toast)

                        } else {
                            this.setState({ loading: false, statusCheckIn: true, statusCheckOut: false, clearAll: false, });
                            let toast = variables.toastError;
                            toast.text = 'Check in thất bại!'
                            Toast.show(toast)

                            return;
                        }
                    } else {
                        this.setState({ loading: false, statusCheckIn: true, statusCheckOut: false, clearAll: false, });

                        let toast = variables.toastError;
                        toast.text = 'Check in không thành công!'
                        Toast.show(toast)

                    }
                }).catch((error) => {
                    this.setState({ loading: false, statusCheckIn: true, statusCheckOut: false, clearAll: false, });
                    let toast = variables.toastError;
                    toast.text = 'Check in không thành công hãy kiểm tra lại kết nối mạng!'
                    Toast.show(toast)
                });
        })
    }

    checkOut = async () => {

        this.setState({ loading: true });
        let para = `${this.state.p_emp_pk}|${this.state.username}`;
        let procedure = "STV_HR_UPD_MBI_MBHRRE003_1";

        await getDataJson(procedure, para, '1')
            .then(async (res) => {
                console.log(res);
                var data_info = res.objcurdatas[0];

                if (data_info.totalrows == 0) {
                    let toast = variables.toastError;
                    toast.text = 'Bạn đã thực hiện Check out, vui lòng kiểm tra lại!'
                    Toast.show(toast)
                    return;
                } else {
                    // await BackgroundGeolocation.getCount(async count => {

                    // count > 0 ? await BackgroundGeolocation.getLocations(locationArray => {
                    //     //console.log(locationArray);
                    //     fetch('http://14.241.235.252:8484/TINVIETAPI/api/Mobile', {
                    //         method: 'POST',
                    //         headers: {
                    //             'Accept': 'application/json',
                    //             'Content-Type': 'application/json'
                    //         },
                    //         body: JSON.stringify({
                    //             "auth_token": "null",
                    //             "location": locationArray,
                    //             "para": `UPDATE|${this.state.p_emp_pk}|${this.state.emp_id}|DATA_LOCATION|${0}|${this.state.username}`,
                    //             "procedure": "STV_HR_UPD_MBI_MBHRRE003_0"
                    //         }),
                    //     }).catch(() => {
                    //         this.setState({ loading: false, statusCheck: true });
                    //         Toast.show({
                    //             text: 'Check out thất bại!',
                    //             buttonText: 'Lỗi',
                    //             position: "bottom"
                    //         })
                    //         return;
                    //     });
                    // }) : null;

                    await BackgroundGeolocation.sync()
                        .then(async () => {
                            await BackgroundGeolocation.stop();
                            await BackgroundGeolocation.destroyLocations();

                            await this.submitCheckOut();
                        }).catch((error) => {
                            console.log('[sync] FAILURE: ', error);
                            this.setState({ loading: false, statusCheckIn: false });

                            let toast = variables.toastError;
                            toast.text = 'Check out không thành công hãy kiểm tra lại kết nối mạng!'
                            Toast.show(toast)

                        });
                    //});
                }
            }).catch((error) => {
                this.setState({ loading: false });
                let toast = variables.toastError;
                toast.text = 'Chức năng này cần có kết nối mạng để thực hiện!'
                Toast.show(toast)
            });
    }

    submitCheckOut = async () => {
        await BackgroundGeolocation.getCurrentPosition({
            timeout: 30,          // 30 second timeout to fetch location
            maximumAge: 5000,     // Accept the last-known-location if not older than 5000 ms.
            desiredAccuracy: 1,  // Try to fetch a location with an accuracy of `10` meters.
            persist: false,
        }, async location => {

            let para = `INSERT|${this.state.p_emp_pk}|${this.state.emp_id}|${1}|${this.state.username}|${(location.coords.latitude)},${(location.coords.longitude)}`
            let procedure = 'STV_HR_UPD_MBI_MBHRRE003_0';
            await OnExcute("INSERT", procedure, para)
                .then(async (res) => {
                    console.log(res);
                    var data_info = res.objcurdatas[0];

                    if (data_info.totalrows > 0) {
                        if (data_info.records[0].status == "OK") {
                            // await BackgroundGeolocation.destroyLocations();
                            // await BackgroundGeolocation.stop();
                            this.getCoordinates(data_info.records[0].rtn_value);
                            this.setState({ latitudeCheckIn: null, longitudeCheckIn: null, checkout_dt: new Date, loading: false, statusCheckIn: false, statusCheckOut: false, clearAll: true, })
                            let toast = variables.toastSuccessful;
                            variables.toastSuccessful.text = 'Check out thành công!'
                            Toast.show(toast)

                        } else {
                            this.setState({ loading: false, statusCheckIn: false, statusCheckOut: true, clearAll: false, });
                            let toast = variables.toastError;
                            toast.text = 'Check out thất bại!'
                            Toast.show(toast)
                            return;
                        }
                    } else {
                        this.setState({ loading: false, statusCheckIn: false, statusCheckOut: true, clearAll: false, });
                        let toast = variables.toastError;
                        toast.text = 'Check out không thành công!'
                        Toast.show(toast)
                    }
                }).catch((error) => {
                    this.setState({ loading: false, statusCheckIn: false, statusCheckOut: true, clearAll: false, });
                    let toast = variables.toastError;
                    toast.text = 'Check out không thành công hãy kiểm tra lại kết nối mạng!'
                    Toast.show(toast)
                });
        });
    }

    getCoordinates = async (rtn_value) => {
        let procedure = "stv_hr_sel_MBI_MBHRRE003_2";
        let para = `${rtn_value}`;
        let coorDinates = this.state.coorDinates;
        coorDinates = [];
        console.log("log para:---------->" + para);
        await getDataJson(procedure, para, '1')
            .then(async (res) => {
                console.log(res);
                var data_info = res.objcurdatas[0];
                let data = data_info.records[0].route_location.slice(0, -1);
                if (data != '') {
                    // Geolocation.getCurrentPosition(
                    //     position => {
                    //         this.setState({
                    //             latitude: position.coords.latitude,
                    //             longitude: position.coords.longitude,
                    //             error: null
                    //         });
                    //     },
                    //     error => this.setState({ error: error.message }),
                    //     { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
                    // );
                    data = data.split('/');
                    await data.map(item => {
                        let lat = item.slice(0, item.lastIndexOf(','));
                        let lng = item.slice(item.lastIndexOf(',') + 1);
                        coorDinates = coorDinates.concat({ latitude: parseFloat(lat), longitude: parseFloat(lng) })
                    })
                    await this.setState({ coorDinates, loading: false }, this.onLayout);
                }
            }).catch((error) => {
                this.setState({ statusCheckIn: true, loading: false });

                let toast = variables.toastError;
                toast.text = 'Chức năng này cần có kết nối mạng để thực hiện!'
                Toast.show(toast)

            });
    }

    getMapRegion = () => ({
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        latitudeDelta: 0.009,
        longitudeDelta: 0.009
    });

    clearMap = async () => {
        Alert.alert(
            'Tạo mới lộ trình',
            'Bạn có chắc chắn muốn tạo mới?',
            [
                { text: 'Hủy', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: 'OK', onPress: async () => {
                        await this.setState({ coorDinates: [], checkin_dt: '', checkout_dt: '', clearAll: false, statusCheckIn: true, statusCheckOut: false, });
                        await BackgroundGeolocation.getCurrentPosition(
                            {
                                timeout: 30,          // 30 second timeout to fetch location
                                maximumAge: 5000,     // Accept the last-known-location if not older than 5000 ms.
                                desiredAccuracy: 1,  // Try to fetch a location with an accuracy of `10` meters.
                                persist: false,
                            },
                            position => {
                                this.setState({
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude,
                                });
                            },
                            error => this.setState({ error: error.message })
                        );
                    }
                },
            ],
            { cancelable: false }
        )
    }

    confirmCheckOut = () => {
        // Works on both iOS and Android
        Alert.alert(
            'Check out',
            'Bạn có chắc chắn muốn check out?',
            [
                { text: 'Hủy', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'OK', onPress: () => { this.checkOut(); } },
            ],
            { cancelable: false }
        )
    }

    onLayout = () => {
        if (this.state.coorDinates.length > 0) {
            this.mapRef.fitToCoordinates(
                this.state.coorDinates,
                { edgePadding: { top: 30, right: 20, bottom: 20, left: 20 }, animated: true, });
        }
    }

    componentWillUnmount() {
        // unregister all event listeners
        // BackgroundGeolocation.removeAllListeners();
        //this.focusListener.remove();
    }

    render() {
        return (
            <StyleProvider style={getTheme(variables)}>
                <Root>
                    <Container>
                        <Loader loading={this.state.loading} />
                        <View style={[{
                            //flex: 1,
                            alignItems: 'center',
                            marginTop: 10,
                        }]}>
                            <View style={[styles.buttonCustomCheckIn, { borderColor: 'rgb(128,128,0)', borderWidth: 1 }]}>
                                <Button onPress={this.checkIn} disabled={!this.state.statusCheckIn} style={{ opacity: !this.state.statusCheckIn ? 0.7 : 1 }}>
                                    <View style={{ backgroundColor: !this.state.statusCheckIn ? variables.textValue : variables.backgroundColorTV, borderRadius: 20, borderColor: 'rgba(128,128,0,0.7)', borderWidth: 2 }} >
                                        <EntypoIcons size={21} name='location-pin' color={!this.state.statusCheckIn ? "#DADDE1" : '#F2F3F5'} style={{ paddingVertical: 2, paddingHorizontal: 4, }} />
                                    </View>
                                    <Text style={{ paddingLeft: 3, paddingRight: 3, fontFamily: "Times", fontWeight: '600', fontSize: 19, fontStyle: !this.state.statusCheckIn ? 'italic' : '', color: !this.state.statusCheckIn ? '#CCD0D5' : variables.textValue }}> Check In </Text>
                                </Button>
                            </View>
                        </View>
                        <View style={{ marginVertical: 10, marginHorizontal: '7%', flex: 0, borderColor: '#DADDE1', borderWidth: 1, borderRadius: 5 }}>
                            <View style={styles.cart}>
                                <Left>
                                    <View style={{ flexDirection: 'row', paddingLeft: 3, }}>
                                        <EntypoIcons style={{ paddingVertical: 5, paddingHorizontal: 2, }} size={20} name='location-pin' />
                                        <Text style={[styles.textCart, { fontWeight: '400', paddingLeft: 2 }]}>Check in: </Text>
                                    </View>

                                </Left>
                                {this.state.checkin_dt != '' ?

                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                        <View style={{ flexDirection: 'row', }}>
                                            <Text style={[styles.textCart, { color: variables.textValue }]}>
                                                <Icon style={{}} size={18} name="ios-today" />
                                                {' ' + moment(this.state.checkin_dt).format('DD-MM-YYYY')}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', }}>
                                            <Text style={[styles.textCart, { color: variables.textValue }]}>
                                                <Icon style={{ paddingVertical: 0, paddingHorizontal: 8, }} size={19} name="md-time" />
                                                {' ' + moment(this.state.checkin_dt).format('hh:mm:ss')}
                                            </Text>
                                        </View>
                                    </View>
                                    :
                                    <Right>
                                        <Text style={[styles.textCart, { fontWeight: '400', color: variables.textValue, fontStyle: 'italic' }]}>Bạn chưa check in!</Text>
                                    </Right>
                                }
                            </View>

                            <View style={[styles.cart, { borderWidth: 0, }]}>
                                <Left>
                                    <View style={{ flexDirection: 'row', paddingLeft: 3 }}>
                                        <EntypoIcons style={{ paddingVertical: 5, paddingHorizontal: 2, }} size={18} name='location' />
                                        <Text style={[styles.textCart, { fontWeight: '400', }]}> Check out: </Text>
                                    </View>
                                </Left>
                                {this.state.checkout_dt != '' ?
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                        <View style={{ flexDirection: 'row', }}>
                                            <Text style={[styles.textCart, { color: variables.textValue }]}>
                                                <Icon style={{}} size={18} name="md-today" />
                                                {' ' + moment(this.state.checkout_dt).format('DD-MM-YYYY')}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', }}>
                                            <Text style={[styles.textCart, { color: variables.textValue }]}>
                                                <Icon style={{ paddingVertical: 0, paddingHorizontal: 8, }} size={19} name="md-time" />
                                                {' ' + moment(this.state.checkout_dt).format('hh:mm:ss')}
                                            </Text>
                                        </View>
                                    </View>
                                    :
                                    <Right>
                                        <Text style={[styles.textCart, { fontWeight: '400', color: variables.textValue, fontStyle: 'italic' }]}>Bạn chưa check out!</Text>
                                    </Right>
                                }
                            </View>
                        </View>

                        <View style={[{
                            //flex: 1,
                            alignItems: 'center',
                            borderBottomColor: '#DADDE1',
                            borderBottomWidth: 1,
                            paddingBottom: '1%',
                        }]}>
                            <View style={[styles.buttonCustomCheckIn, { borderColor: 'rgb(128,128,0)', borderWidth: 1 }]}>
                                <Button onPress={this.confirmCheckOut} disabled={!this.state.statusCheckOut} style={{ opacity: !this.state.statusCheckOut ? 0.7 : 1 }}>
                                    <View style={{ backgroundColor: !this.state.statusCheckOut ? variables.textValue : variables.backgroundColorTV, borderRadius: 20, borderColor: 'rgba(128,128,0,0.7)', borderWidth: 2 }} >
                                        <EntypoIcons size={19} name='location' color={!this.state.statusCheckOut ? "#DADDE1" : '#F2F3F5'} style={{ paddingVertical: 3, paddingHorizontal: 5, }} />
                                    </View>
                                    <Text style={{ paddingLeft: 3, paddingRight: 3, fontWeight: 'bold', fontFamily: "Times", fontWeight: '600', fontSize: 19, fontStyle: !this.state.statusCheckOut ? 'italic' : '', color: !this.state.statusCheckOut ? '#CCD0D5' : variables.textValue }}> Check Out </Text>
                                </Button>
                            </View>
                        </View>
                        <View style={[{
                            alignItems: 'flex-end',
                            marginTop: '1%',
                            marginRight: '3%'
                        }]}>
                            <View style={[styles.buttonCustomReset, { borderColor: 'rgb(128,128,0)', borderWidth: 1, }]}>
                                <Button onPress={() => { this.clearMap() }} disabled={!this.state.clearAll} style={{ height: 30, opacity: !this.state.clearAll ? 0.7 : 1 }} >
                                    {/* <View style={{ backgroundColor: this.state.clearAll ? variables.textValue : variables.backgroundColorTV , borderRadius: 20, borderColor: 'rgba(128,128,0,0.7)', borderWidth: 2 }} >
                                        <EntypoIcons size={19} name='location' color={this.state.clearAll ? "#DADDE1" : '#F2F3F5'} style={{ paddingVertical: 3, paddingHorizontal: 5, }} />
                                    </View> */}
                                    <Text style={{ paddingLeft: 3, paddingRight: 3, fontWeight: 'bold', fontFamily: "Times", fontWeight: '600', fontSize: 17, fontStyle: 'normal', color: !this.state.clearAll ? '#CCD0D5' : variables.backgroundColorTV }}> Tạo mới lộ trình </Text>
                                </Button>
                            </View>
                        </View>
                        <View style={[styles.mapView, {}]}>

                            <MapView
                                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                                style={styles.map}
                                mapType="standard"
                                followUserLocation={true}
                                showsUserLocation={true}
                                showsMyLocationButton={true}
                                showsCompass={true}
                                showsScale={true}
                                showsBuildings={true}
                                //showsTraffic={true}
                                showsIndoors={true}
                                showsIndoorLevelPicker={true}
                                zoomEnabled={true}
                                zoomTapEnabled={true}
                                zoomControlEnabled={true}
                                rotateEnabled={true}
                                scrollEnabled={true}
                                loadingEnabled={true}
                                region={this.state.longitude != '' && this.state.latitude != '' ? this.getMapRegion() : null}
                                ref={(ref) => { this.mapRef = ref }}
                            //onLayout={this.onLayout}
                            >

                                {this.state.longitudeCheckIn && this.state.latitudeCheckIn != null ?
                                    <Marker
                                        coordinate={{
                                            latitude: parseFloat(this.state.latitudeCheckIn),
                                            longitude: parseFloat(this.state.longitudeCheckIn)
                                        }}
                                        title={"Check In"}
                                        description={""}
                                    >
                                        {/* <View style={{ backgroundColor: variables.backgroundColorTV, borderRadius: 20, borderColor: 'rgba(128,128,0,0.7)', borderWidth: 2 }} >
                                            <Text style={{ paddingVertical: 0, paddingHorizontal: 4, color: '#F2F3F5', fontWeight: 'bold' }}>A</Text>
                                        </View> */}
                                        <Badge value={'A'} textStyle={{ color: '#F2F3F5', fontWeight: 'bold', }} badgeStyle={{ borderColor: 'rgba(128,128,0,0.7)', backgroundColor: variables.backgroundColorTV, }} />
                                    </Marker>
                                    : null
                                }


                                {this.state.checkin_dt != '' && this.state.checkout_dt != '' && this.state.coorDinates.length > 0 ?
                                    <View>
                                        <Marker
                                            coordinate={{
                                                latitude: this.state.coorDinates[0].latitude,
                                                longitude: this.state.coorDinates[0].longitude,
                                            }}
                                            title={"Check In"}
                                            description={""}
                                        >
                                            <Badge value={'A'} textStyle={{ color: '#F2F3F5', fontWeight: 'bold', }} badgeStyle={{ borderColor: 'rgba(128,128,0,0.7)', backgroundColor: variables.backgroundColorTV, }} />

                                        </Marker>

                                        <Polyline
                                            coordinates={this.state.coorDinates}
                                            strokeColor="blue" // fallback for when `strokeColors` is not supported by the map-provider
                                            // strokeColors={[
                                            //     '#7F0000',
                                            //     '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
                                            //     '#B24112',
                                            //     '#E5845C',
                                            //     '#238C23',
                                            //     '#7F0000'
                                            // ]}
                                            strokeWidth={3}
                                            fillColor="rgba(255,0,0,0.5)"

                                            geodesic={true}
                                        />
                                        <Marker
                                            coordinate={{
                                                latitude: this.state.coorDinates[this.state.coorDinates.length - 1].latitude,
                                                longitude: this.state.coorDinates[this.state.coorDinates.length - 1].longitude,
                                            }}
                                            title={"Check In"}
                                            description={""}
                                        >
                                            {/* <View style={{ backgroundColor: variables.textValue, borderRadius: 20, borderColor: 'rgba(128,128,0,0.7)', borderWidth: 2, }} >
                                                <Text style={{ paddingVertical: 0, paddingHorizontal: 4, color: '#F2F3F5', fontWeight: 'bold' }}>B</Text>
                                            </View> */}
                                            <Badge value={'B'} textStyle={{ color: '#F2F3F5', fontWeight: 'bold', }} badgeStyle={{ borderColor: 'rgba(128,128,0,0.7)', backgroundColor: variables.textValue, }} />


                                        </Marker>
                                    </View>

                                    : null}

                            </MapView>
                        </View>


                    </Container>
                </Root>
            </StyleProvider>
        )
    }


}

const styles = StyleSheet.create({
    buttonCustomCheckIn: {

        marginBottom: 5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#EBEDF0',
        borderRadius: 30,
        borderColor: '#010d33',
        shadowColor: 'rgb(199, 93, 47)',
        shadowOffset: { width: 0.5, height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 3,
    },
    buttonCustomReset: {
        marginBottom: 5,
        // justifyContent: 'center',
        // alignItems: 'center',
        paddingHorizontal: 5,
        backgroundColor: '#EBEDF0',
        borderRadius: 20,
        borderColor: '#010d33',
        shadowColor: 'rgb(199, 93, 47)',
        shadowOffset: { width: 0.5, height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 3,
    },
    cart: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderColor: '#d9e1e8',
        marginLeft: '0%',
        marginRight: '0%',
    },
    textCart: {
        fontFamily: 'Arial',
        //color:'#010d33',
        marginTop: 8,
        marginBottom: 8,
        //fontWeight: 'bold',
        fontSize: 15,
        fontWeight: '500',
        margin: '0%',
        marginRight: '6%'
    },
    mapView: {
        flex: 1,
        marginTop: '1%',
        marginHorizontal: '0%'
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
