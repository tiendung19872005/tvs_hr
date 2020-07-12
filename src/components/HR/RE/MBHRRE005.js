import React, { Component } from "react";
import { AppRegistry, View, TouchableWithoutFeedback, Image, StatusBar, Alert, StyleSheet, Platform, Dimensions, Modal, TouchableHighlight, TouchableOpacity, TextInput } from "react-native";
import {
    Root, Toast, Container, Body, Content, Header, Left, Right, Picker, Spinner,
    Icon, Title, Input, Item, Label, Button, Text, StyleProvider, getTheme,
} from "native-base";
import customVariables from '../../../assets/styles/variables';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import { TextField } from 'react-native-material-textfield';
import { Dropdown } from 'react-native-material-dropdown';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import 'moment/locale/vi';
import { OnExcute, getUserInfo, getDataJson } from '../../../services/FetchData';
import DefaultPreference from 'react-native-default-preference';
import Loader from '../../SYS/Loader';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import variables from "../../../assets/styles/variables";
import { variance } from "@babel/types";
import Icon1 from 'react-native-vector-icons/Entypo';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { TextInput as TextInput1, Colors } from 'react-native-paper';


export default class MBHRRE005 extends Component {
    handleButton(navigate) {
        this.props.navigation.navigate(navigate);
    }
    constructor(props) {
        super(props);
        this.state = {
            dt_emp_pk: '',
            dt_crt_by: '',
            dt_emp_id: '',
            dt_org_pk: '',

            loading: false,
            //colorDotRequired: '#51bc8a',
            colorDotRequired: 'red',
            status: '',
            colorStatus: '',

            onDayPressStart: moment(new Date()).format("DD-MM-YYYY"),
            onDayPressTo: moment(new Date()).format("DD-MM-YYYY"),
            isModalOpenStart: false,
            isModalOpenTo: false,

            loaiDangKy_pk: '',
            loaiDangKy: undefined,
            cb_regType: [{}],

            timeType_pk: '',
            timeType: undefined,
            cb_timeType: [{}],

            checkNumber: false,
            timeInput: '',
            description: ''

        }
        this.onDayPressStart = this.onDayPressStart.bind(this);
        this.onDayPressTo = this.onDayPressTo.bind(this);
    }

    onChangeDangKy(text, index) {
        this.setState({
            loaiDangKy_pk: this.state.cb_regType[index].pk,
            loaiDangKy: this.state.cb_regType[index].value
        })
    }

    onChangeTimeType(text, index) {
        this.setState({
            timeType_pk: this.state.cb_timeType[index].pk,
            timeType: this.state.cb_timeType[index].value
        })
    }

    onDayPressStart(day) {
        this.setState({
            onDayPressStart: moment(day.dateString).format("DD-MM-YYYY"),
        });
        console.log((day.dateString));
        setTimeout(() => { this.setState({ isModalOpenStart: false, }) }, 150)
    }
    onDayPressTo(day) {
        this.setState({
            onDayPressTo: moment(day.dateString).format("DD-MM-YYYY"),
        });
        console.log('dayonDayPress' + moment(day.dateString).format("YYYYMMDD"));
        setTimeout(() => { this.setState({ isModalOpenTo: false, }) }, 150)
    }

    onChangeNumberTime = (timeInput) => {
        if (((!timeInput.match(/^[0-9]+$/) && timeInput != ''))) {
            let toast = variables.toastError;
            toast.text = 'Bạn phải nhập kí tự là số!'
            Toast.show(toast)

            this.setState({ timeInput: '', checkNumber: true })
            return;
        } else {
            this.setState({ timeInput: timeInput, checkNumber: false, })
        }
    }


    componentDidMount() {
        DefaultPreference.getAll().then(async (valueAll) => {
            let user_pk = valueAll['user_pk'];
            let full_name = valueAll['full_name'];
            let emp_id = valueAll['emp_id'];
            let org_pk = valueAll['org_pk'];

            await this.setState(
                { dt_emp_pk: user_pk, dt_crt_by: full_name, dt_org_pk: org_pk, dt_emp_id: emp_id })
            let procedure = "stv_hr_sel_mbi_mbhrre004_0";
            let para = `ALL|${full_name}`;
            getDataJson(procedure, para, '1')
                .then((res) => {
                    console.log(res);
                    let data_info_tb = res.objcurdatas[0];
                    let cb_regType = [];
                    let cb_timeType = [];
                    data_info_tb.records.map(item => {
                        if (item.type == 'regType') {
                            cb_regType = [...cb_regType, item];
                        } else if (item.type == 'timeType') {
                            cb_timeType = [...cb_timeType, item];
                        }
                    })
                    this.setState({ cb_regType, cb_timeType })
                });
        })


    }

    updateExperience() {
        const { dt_emp_pk, dt_crt_by, dt_emp_id, dt_org_pk,
            loaiDangKy_pk, timeType_pk, onDayPressStart, onDayPressTo, timeInput, description, } = this.state;

        var isThis = this;

        let p_action = 'INSERT';
        let p_pk_table = '';
        let p_thr_emp_pk = dt_emp_pk;
        let p_reg_type = loaiDangKy_pk;
        let p_times_type = timeType_pk;
        let p_start_dt = moment(onDayPressStart, 'DD-MM-YYYY').format('YYYYMMDD');
        let p_end_dt = moment(onDayPressTo, 'DD-MM-YYYY').format('YYYYMMDD');
        let p_reg_hours = timeInput;
        let p_description = description;
        let p_seq = '';
        let p_crt_by = dt_crt_by;

        let para = `${p_action}|${p_pk_table}|${p_thr_emp_pk}|${p_reg_type}|${p_times_type}|${p_start_dt}|${p_end_dt}|${p_reg_hours}|${p_description}|${p_seq}|${p_crt_by}`;
        let action = "INSERT";
        let procedure = "STV_HR_UPD_MBI_MBHRRE00400";
        console.log("log procedure:---------->" + procedure);

        OnExcute(action, procedure, para)
            .then((res) => {
                console.log(res);
                let data_info = res.objcurdatas[0];
                if (data_info.totalrows > 0) {
                    if (data_info.records[0].status == "OK") {
                        isThis.setState({
                            loading: false, status: 'Đăng kí đi trễ về sớm thành công!', colorStatus: '#51bc8a',
                            description: '',
                            timeInput: '',
                            onDayPressStart: moment(new Date()).format("DD-MM-YYYY"),
                            onDayPressTo: moment(new Date()).format("DD-MM-YYYY"),
                            loaiDangKy_pk: '',
                            loaiDangKy: undefined,

                            timeType_pk: '',
                            timeType: undefined,
                        });
                        let toast = variables.toastSuccessful;
                        variables.toastSuccessful.text = 'Đăng kí đi trễ về sớm thành công!'
                        Toast.show(toast)
                    } else {
                        if (data_info.records[0].error_ex.includes('ORA-20009')) {
                            isThis.setState({ loading: false, status: `ID ${dt_emp_id}: Bạn đã đăng kí đi trễ về sớm ngày hôm nay rồi!`, colorStatus: 'red' });
                            let toast = variables.toastError;
                            toast.text = 'Đăng ký tăng ca thất bại!'
                            Toast.show(toast)
                            return;
                        } else {
                            isThis.setState({ loading: false, status: 'Đăng kí đi trễ về sớm thất bại!', colorStatus: 'red' });
                            let toast = variables.toastError;
                            toast.text = 'Đăng ký tăng ca thất bại!'
                            Toast.show(toast)
                            return;
                        }
                    }
                }
                else {
                    isThis.setState({ loading: false, status: 'Đăng kí đi trễ về sớm thất bại!', colorStatus: 'red' });
                    console.log("Cập nhật thất bại");
                    let toast = variables.toastError;
                    toast.text = 'Cập nhật không thành công!'
                    Toast.show(toast)
                }
            });
        setTimeout(() => this.setState({ status: '', colorStatus: '' }), 10000)
    }

    confirmSave = () => {
        if (this.state.loaiDangKy_pk == "") {
            let toast = variables.toastError;
            toast.text = 'Phải chọn loại quy chuẩn!'
            Toast.show(toast)
            return;
        }
        if (this.state.timeType_pk == "") {
            let toast = variables.toastError;
            toast.text = 'Phải chọn loại thời gian!'
            Toast.show(toast)
            return;
        }
        if (this.state.timeInput == '' || !this.state.timeInput.match(/^[0-9]+$/)) {
            this.setState({ status: 'Đăng kí đi trễ về sớm thất bại!', colorStatus: 'red' })
            let toast = variables.toastError;
            toast.text = 'Phải nhập số giờ!'
            Toast.show(toast)
            return;
        }
        console.log(this.state.description)
        if (this.state.description == '') {
            let toast = variables.toastError;
            toast.text = 'Phải nhập lý do đi trễ về sớm!'
            Toast.show(toast)
            return;
        }
        Alert.alert(
            'Đăng kí đi trễ về sớm',
            'Bạn có chắc chắn muốn lưu?',
            [
                { text: 'Hủy', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'OK', onPress: () => { this.updateExperience(); } },
            ],
            { cancelable: false }
        )
    }

    render() {
        const { navigate } = this.props.navigation;
        let tv_baseColor = variables.defaultTextColor;
        let tv_baseSize = 14;
        let tv_baseWeight = 'normal';

        return (

            <StyleProvider style={getTheme(customVariables)} backdropTransitionOutTiming={0}>
                <Root>
                    <Container>
                        <Loader loading={this.state.loading} />

                        <Content padder style={{ marginHorizontal: 5 }}>

                            <View style={[GlobalStyles.row1, { height: variables.deviceHeight * 0.06, borderColor: variables.cardBorderColor, borderWidth: 0.7, borderRadius: 10, marginVertical: 5 }]}>
                                <Icon1 style={{ fontSize: 20, color: 'red' }} name={'dot-single'} />
                                <Text style={{ fontSize: tv_baseSize, fontWeight: tv_baseWeight }}>Loại quy chuẩn: </Text>
                                <View style={[GlobalStyles.rowRight1, { height: variables.deviceHeight * 0.06, flex: 1, }]}>
                                    <Dropdown
                                        //label='Loại vắng'
                                        itemCount={8}
                                        baseColor={tv_baseColor}
                                        selectedItemColor="black"
                                        textColor={variables.textValue}
                                        //value={this.state.loaivang}
                                        value={this.state.loaiDangKy || 'Chọn loại quy chuẩn'}
                                        data={this.state.cb_regType}
                                        rippleInsets={{ top: 0, bottom: 0, right: 0, left: 0 }}
                                        containerStyle={{ backgroundColor: /*variables.listDividerBg*/'transparent', height: variables.deviceHeight * 0.058, width: '100%', overflow: 'hidden', borderRadius: 10 }}

                                        dropdownPosition={0}
                                        dropdownOffset={{ top: 8, left: variables.deviceWidth / 24.5 }}
                                        pickerStyle={{ backgroundColor: variables.tabBgColor, borderRadius: 10, marginTop: variables.deviceHeight * 0.06 }}

                                        inputContainerStyle={{ borderBottomColor: 'transparent', }}
                                        style={{ textAlign: 'right', paddingRight: 8, fontSize: 15, }} //for changed text color
                                        onChangeText={(text, index) => this.onChangeDangKy(text, index)}
                                        renderAccessory={() => {
                                            return (
                                                // <View></View>
                                                <Icon style={[GlobalStyles.iconHeader, { color: 'black', marginTop: 2, marginRight: 10, color: variables.textValue }]} name="arrow-dropdown" />
                                            )
                                        }}
                                    />
                                </View>
                            </View>

                            <View style={[GlobalStyles.row1, { height: variables.deviceHeight * 0.06, borderColor: variables.cardBorderColor, borderWidth: 0.7, borderRadius: 10, marginVertical: 5 }]}>
                                <Icon1 style={{ fontSize: 20, color: 'red' }} name={'dot-single'} />
                                <Text style={{ fontSize: tv_baseSize, fontWeight: tv_baseWeight }}>Loại thời gian: </Text>
                                <View style={[GlobalStyles.rowRight1, { height: variables.deviceHeight * 0.06, flex: 1, }]}>
                                    <Dropdown
                                        //label='Loại vắng'
                                        itemCount={8}
                                        baseColor={tv_baseColor}
                                        selectedItemColor="black"
                                        textColor={variables.textValue}
                                        //value={this.state.loaivang}
                                        value={this.state.timeType || 'Chọn loại thời gian'}
                                        data={this.state.cb_timeType}
                                        rippleInsets={{ top: 0, bottom: 0, right: 0, left: 0 }}
                                        containerStyle={{ backgroundColor: /*variables.listDividerBg*/'transparent', height: variables.deviceHeight * 0.058, width: '100%', overflow: 'hidden', borderRadius: 10 }}

                                        dropdownPosition={0}
                                        dropdownOffset={{ top: 8, left: variables.deviceWidth / 24.5 }}
                                        pickerStyle={{ backgroundColor: variables.tabBgColor, borderRadius: 10, marginTop: variables.deviceHeight * 0.06 }}

                                        inputContainerStyle={{ borderBottomColor: 'transparent', }}
                                        style={{ textAlign: 'right', paddingRight: 8, fontSize: 15, }} //for changed text color
                                        onChangeText={(text, index) => this.onChangeTimeType(text, index)}
                                        renderAccessory={() => {
                                            return (
                                                // <View></View>
                                                <Icon style={[GlobalStyles.iconHeader, { color: 'black', marginTop: 2, marginRight: 10, color: variables.textValue }]} name="arrow-dropdown" />
                                            )
                                        }}
                                    />
                                </View>
                            </View>

                            <View style={[GlobalStyles.row1, { height: variables.deviceHeight * 0.06, borderColor: variables.cardBorderColor, borderWidth: 0.7, borderRadius: 10, marginVertical: 5 }]}>
                                <Icon1 style={{ fontSize: 20, color: 'red' }} name={'dot-single'} />
                                <Text style={{ fontSize: tv_baseSize, fontWeight: tv_baseWeight }}>Từ ngày: </Text>
                                <View style={[GlobalStyles.rowRight1, { height: variables.deviceHeight * 0.06, flex: 1, }]}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={[styles.dropDownDay,]} >
                                            <TouchableOpacity success onPress={() => this.setState({ isModalOpenStart: true })} style={[{ flexDirection: 'row', alignSelf: 'center', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }]} >
                                                {/* <Icon style={[GlobalStyles.iconHeader, { color: 'black', fontSize: 22, color: 'black', marginLeft: 3 }]} name="calendar" /> */}
                                                <Text style={{ marginHorizontal: 'auto', marginVertical: 'auto', marginLeft: 6, marginRight: 6, marginTop: '0.5%', color: variables.textValue, fontSize: 15 }}> {this.state.onDayPressStart}</Text>
                                                <Icon style={[GlobalStyles.iconHeader, { color: variables.textValue, marginTop: 1 }]} name="arrow-dropdown" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <Modal
                                        animationType='fade'
                                        transparent={true}
                                        visible={this.state.isModalOpenStart}
                                        presentationStyle='overFullScreen'
                                        onRequestClose={() => { }}>
                                        <TouchableHighlight
                                            onPress={(e) => [this.setState({ isModalOpenStart: false }),]}
                                            style={[styles.container1, {}]}>
                                            <View style={[styles.modalBackground, { right: '2%', bottom: '34.5%', borderRadius: 5, width: '93%', overflow: "hidden", position: 'absolute' }]}>

                                                <Calendar
                                                    style={styles.calendar}
                                                    minDate={moment(new Date()).format("YYYY-MM-DD")}
                                                    //maxDate={moment(new Date()).format("YYYY-MM-DD")}
                                                    monthFormat={'MMMM - yyyy'}
                                                    onDayPress={this.onDayPressStart}
                                                    onDayLongPress={this.onDayPressStart}
                                                    //onMonthChange={this.onMonthChange}
                                                    hideDayNames={false}
                                                    showWeekNumbers={false}
                                                    hideExtraDays={false}
                                                    firstDay={0}
                                                    current={moment(this.state.onDayPressStart, 'DD-MM-YYYY').format('YYYY-MM')}
                                                    markedDates={{
                                                        [moment(new Date()).format("YYYY-MM-DD")]: { marked: true, dotColor: 'red', },
                                                        [moment(this.state.onDayPressStart, 'DD-MM-YYYY').format('YYYY-MM-DD')]: { selected: true, disableTouchEvent: false, selectedDotColor: variables.textValue }
                                                    }}
                                                    style={{
                                                        marginTop: 0,
                                                        //borderWidth: 0.5,
                                                        //borderRadius: 2,
                                                        //height: 200
                                                    }}
                                                    theme={{
                                                        'stylesheet.day.basic': {

                                                        },
                                                        'stylesheet.calendar.main': {
                                                            week: {
                                                                marginTop: 3,
                                                                marginBottom: 5,
                                                                flexDirection: 'row',
                                                                justifyContent: 'space-around'
                                                            },
                                                        },
                                                        'stylesheet.calendar.header': {
                                                            'header': {
                                                                flexDirection: 'row',
                                                                justifyContent: 'space-between',
                                                                paddingLeft: 10,
                                                                paddingRight: 10,
                                                                marginTop: 0,
                                                                alignItems: 'center'
                                                            },
                                                            week: {
                                                                marginTop: 0,
                                                                flexDirection: 'row',
                                                                justifyContent: 'space-around'
                                                            },
                                                            arrow: {
                                                                padding: 0,
                                                            },
                                                        },

                                                        calendarBackground: '#ffffff',
                                                        selectedDayBackgroundColor: variables.backgroundColorTV,
                                                        selectedDayTextColor: '#ffffff',
                                                        todayTextColor: variables.textValue,
                                                        dayTextColor: '#2d4150',
                                                        textDisabledColor: '#d9e1e8',
                                                        dotColor: variables.textValue,
                                                        selectedDotColor: '#ffffff',
                                                        arrowColor: variables.textValue,
                                                        monthTextColor: variables.backgroundColorTV,
                                                        indicatorColor: variables.textValue,
                                                        textDayFontWeight: '400',
                                                        textMonthFontWeight: '600',
                                                        textDayHeaderFontWeight: '400',
                                                        textDayFontSize: 14,
                                                        textMonthFontSize: 14,
                                                        textDayHeaderFontSize: 13
                                                    }}
                                                />
                                            </View>
                                        </TouchableHighlight>
                                    </Modal>


                                </View>
                            </View>

                            <View style={[GlobalStyles.row1, { height: variables.deviceHeight * 0.06, borderColor: variables.cardBorderColor, borderWidth: 0.7, borderRadius: 10, marginVertical: 5 }]}>
                                <Icon1 style={{ fontSize: 20, color: 'red' }} name={'dot-single'} />
                                <Text style={{ fontSize: tv_baseSize, fontWeight: tv_baseWeight }}>Đến ngày: </Text>
                                <View style={[GlobalStyles.rowRight1, { height: variables.deviceHeight * 0.06, flex: 1, }]}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={[styles.dropDownDay,]} >
                                            <TouchableOpacity success onPress={() => this.setState({ isModalOpenTo: true })} style={[{ flexDirection: 'row', alignSelf: 'center', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }]} >
                                                {/* <Icon style={[GlobalStyles.iconHeader, { color: 'black', fontSize: 22, color: 'black', marginLeft: 3 }]} name="calendar" /> */}
                                                <Text style={{ marginHorizontal: 'auto', marginVertical: 'auto', marginLeft: 6, marginRight: 6, marginTop: '0.5%', color: variables.textValue, fontSize: 15 }}> {this.state.onDayPressTo}</Text>
                                                <Icon style={[GlobalStyles.iconHeader, { color: variables.textValue, marginTop: 1 }]} name="arrow-dropdown" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <Modal
                                        animationType='fade'
                                        transparent={true}
                                        visible={this.state.isModalOpenTo}
                                        presentationStyle='overFullScreen'
                                        onRequestClose={() => { }}>
                                        <TouchableHighlight
                                            onPress={(e) => [this.setState({ isModalOpenTo: false }),]}
                                            style={[styles.container1, {}]}>
                                            <View style={[styles.modalBackground, { right: '2%', bottom: '27.5%', borderRadius: 5, width: '93%', overflow: "hidden", position: 'absolute' }]}>

                                                <Calendar
                                                    style={styles.calendar}
                                                    minDate={moment(new Date()).format("YYYY-MM-DD")}
                                                    //maxDate={moment(new Date()).format("YYYY-MM-DD")}
                                                    monthFormat={'MMMM - yyyy'}
                                                    onDayPress={this.onDayPressTo}
                                                    onDayLongPress={this.onDayPressTo}
                                                    //onMonthChange={this.onMonthChange}
                                                    hideDayNames={false}
                                                    showWeekNumbers={false}
                                                    hideExtraDays={false}
                                                    firstDay={0}
                                                    current={moment(this.state.onDayPressTo, 'DD-MM-YYYY').format('YYYY-MM')}
                                                    markedDates={{
                                                        [moment(new Date()).format("YYYY-MM-DD")]: { marked: true, dotColor: 'red', },
                                                        [moment(this.state.onDayPressTo, 'DD-MM-YYYY').format('YYYY-MM-DD')]: { selected: true, disableTouchEvent: false, selectedDotColor: variables.textValue }
                                                    }}
                                                    style={{
                                                        marginTop: 0,
                                                        //borderWidth: 0.5,
                                                        //borderRadius: 2,
                                                        //height: 200
                                                    }}
                                                    theme={{
                                                        'stylesheet.day.basic': {

                                                        },
                                                        'stylesheet.calendar.main': {
                                                            week: {
                                                                marginTop: 3,
                                                                marginBottom: 5,
                                                                flexDirection: 'row',
                                                                justifyContent: 'space-around'
                                                            },
                                                        },
                                                        'stylesheet.calendar.header': {
                                                            'header': {
                                                                flexDirection: 'row',
                                                                justifyContent: 'space-between',
                                                                paddingLeft: 10,
                                                                paddingRight: 10,
                                                                marginTop: 0,
                                                                alignItems: 'center'
                                                            },
                                                            week: {
                                                                marginTop: 0,
                                                                flexDirection: 'row',
                                                                justifyContent: 'space-around'
                                                            },
                                                            arrow: {
                                                                padding: 0,
                                                            },
                                                        },

                                                        calendarBackground: '#ffffff',
                                                        selectedDayBackgroundColor: variables.backgroundColorTV,
                                                        selectedDayTextColor: '#ffffff',
                                                        todayTextColor: variables.textValue,
                                                        dayTextColor: '#2d4150',
                                                        textDisabledColor: '#d9e1e8',
                                                        dotColor: variables.textValue,
                                                        selectedDotColor: '#ffffff',
                                                        arrowColor: variables.textValue,
                                                        monthTextColor: variables.backgroundColorTV,
                                                        indicatorColor: variables.textValue,
                                                        textDayFontWeight: '400',
                                                        textMonthFontWeight: '600',
                                                        textDayHeaderFontWeight: '400',
                                                        textDayFontSize: 14,
                                                        textMonthFontSize: 14,
                                                        textDayHeaderFontSize: 13
                                                    }}
                                                />
                                            </View>
                                        </TouchableHighlight>
                                    </Modal>
                                </View>
                            </View>


                            <View style={[GlobalStyles.row1, { height: variables.deviceHeight * 0.06, borderColor: variables.cardBorderColor, borderWidth: 0.7, borderRadius: 10, marginVertical: 5 }]}>
                                <View style={[GlobalStyles.rowLeft1, { width: '49%', alignItems: 'center' }]}>
                                    <Icon1 style={{ fontSize: 20, color: this.state.colorDotRequired }} name={'dot-single'} />
                                    <Text style={{ fontSize: tv_baseSize, fontWeight: tv_baseWeight }}>Số giờ: </Text>
                                </View>

                                <View style={[GlobalStyles.rowRight1, { height: variables.deviceHeight * 0.06, flex: 1, }]}>
                                    <TextInput1
                                        mode='outlined'
                                        // fontStyle={this.state.arrayDataInserted.includes(item.no) ? 'italic' : 'normal'}
                                        style={[, {
                                            color: variables.textValue, width: '90%',
                                            height: 30, textAlign: 'right',
                                            textAlignVertical: 'right',
                                            marginBottom: 6
                                        }]}
                                        onChangeText={(timeInput) => { this.onChangeNumberTime(timeInput) }}
                                        label='Nhập số giờ ...'
                                        error={this.state.checkNumber}
                                        keyboardType="number-pad"
                                        theme={{
                                            colors: {
                                                // placeholder: variables.backgroundColorTV,
                                                text: variables.textValue, primary: variables.textValue,
                                                underlineColor: variables.backgroundColorTV, background: '#ffff'
                                            }
                                        }}
                                        value={this.state.timeInput}
                                    />
                                </View>
                                <View style={[GlobalStyles.rowRight1, { height: variables.deviceHeight * 0.06, }]}>
                                    <Icon style={[GlobalStyles.iconHeader, { color: variables.textValue, paddingRight: 10, paddingLeft: 10 }]} name="clock" />
                                </View>
                            </View>

                            <View style={GlobalStyles.spaceSmall}></View>
                            {/* <View style={[styles.textAreaContainer, { borderRadius: 10 }]} > */}

                            <TextInput1
                                mode='outlined'
                                // fontStyle={this.state.arrayDataInserted.includes(item.no) ? 'italic' : 'normal'}
                                style={[styles.textArea, {
                                    marginHorizontal: 5,
                                    marginVertical: 0,
                                    color: variables.textValue,
                                    // paddingVertical: 0,
                                }]}
                                underlineColorAndroid="transparent"
                                placeholder="Ghi chú"
                                placeholderTextColor={tv_baseColor}
                                numberOfLines={1}
                                multiline={true}
                                label={'Ghi chú'}
                                value={this.state.description}
                                onChangeText={(description) => this.setState({ description: description })}
                                labelFontSize={tv_baseSize}
                                theme={{
                                    colors: {
                                        // placeholder: variables.backgroundColorTV,
                                        text: variables.textValue, primary: variables.textValue,
                                        underlineColor: variables.backgroundColorTV, background: '#ffff'
                                    }
                                }}
                                baseColor={variables.textValue}
                            />
                            {/* <TextInput
                                    style={styles.textArea}
                                    underlineColorAndroid="transparent"
                                    placeholder="Ghi chú"
                                    placeholderTextColor={tv_baseColor}
                                    numberOfLines={1}
                                    multiline={true}
                                    label={'Ghi chú'}
                                    value={this.state.description}
                                    onChangeText={(description) => this.setState({ description })}
                                    baseColor={tv_baseColor}
                                    labelFontSize={tv_baseSize}
                                /> */}
                            {/* </View> */}

                            <View style={GlobalStyles.spaceSmall}></View>
                            <Text style={{ fontStyle: 'italic', color: this.state.colorStatus, textAlign: 'center', fontSize: 15 }}>{this.state.status}</Text>
                            <View style={GlobalStyles.spaceSmall}></View>
                            <View style={GlobalStyles.row}>
                                <View style={[GlobalStyles.rowRight, {}]}>
                                    <Button success
                                        onPress={() => this.confirmSave()}
                                        style={[GlobalStyles.buttonCustom1, { borderRadius: 50 }]}>
                                        <Text style={{ padding: 0, fontWeight: 'bold' }}>Sao lưu  <Icon style={[GlobalStyles.iconHeader, { fontSize: 20 }]} name="ios-create" />
                                        </Text>

                                    </Button>
                                </View>
                            </View>
                        </Content>
                    </Container>
                </Root>
            </StyleProvider>
        );
    }
}


const styles = StyleSheet.create({
    textAreaContainer: {
        borderColor: variables.textValue,
        borderWidth: 1,
        padding: 5
    },
    textArea: {
        height: 60,
        justifyContent: "flex-start"
    },
    container1: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    modalBackground: {
        backgroundColor: 'white',

    },
    dropDownDay: {
        alignSelf: 'flex-start',
        padding: 3,
        margin: 7,
        // borderBottomLeftRadius: 6,
        // borderTopRightRadius: 6,
        borderRadius: 10,
        backgroundColor: 'white',
        // shadowColor: "black",
        // shadowOffset: { width: 0, height: 0 },
        // shadowRadius: 4,
        // shadowOpacity: 0.2,
        zIndex: 2
    }
});
