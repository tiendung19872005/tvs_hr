import React, { Component } from "react";
import { AppRegistry, View, Image, Alert, StatusBar, StyleSheet, Platform, Dimensions, Modal, TouchableOpacity, TextInput } from "react-native";
import {
    Root, Toast, Container, Body, Content, Header, Left, Right, Picker, Spinner,
    Icon, Title, Input, Item, Label, Button, Text, StyleProvider, getTheme,
} from "native-base";
import customVariables from '../../../assets/styles/variables';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import GlobalStyles from "../../../assets/styles/GlobalStyles";
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
import { TextInput as TextInput1, Colors } from 'react-native-paper';


export default class MBHRRE001_1 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loaivang_pk: '',
            cb_loaivang: [{}],
            lydovang_pk: '',
            cb_lydovang: [{}],
            cbPersonApproved: [{}],
            empApproved_pk1: '',
            empApproved_pk2: '',
            startDatePickerVisible: false,
            endDatePickerVisible: false,

            dt_emp_pk: '',
            dt_crt_by: '',
            dt_fromtime: '',
            dt_totime: '',
            description: '',
            dt_fromdate: moment(new Date()).format("DD-MM-YYYY"),
            dt_todate: moment(new Date()).format("DD-MM-YYYY"),
            loading: false,
            status: '',
            colorStatus: '',
            arrayDataInserted: [],
        }
    }

    componentDidMount() {
        DefaultPreference.getAll().then(async (valueAll) => {
            let user_pk = valueAll['user_pk'];
            let full_name = valueAll['full_name'];
            let emp_id = valueAll['emp_id'];
            let org_pk = valueAll['org_pk'];

            await this.setState(
                { dt_emp_pk: user_pk, dt_crt_by: full_name, emp_id: emp_id })

            let procedure = "STV_HR_SEL_MBI_MBHRRE001_0";
            let para = `ALL|${full_name}`;
            getDataJson(procedure, para, '1')
                .then((res) => {
                    console.log(res);
                    let data_info_tb = res.objcurdatas[0];
                    let cb_loaivang = [];
                    let cb_lydovang = [];
                    let cbPersonApproved = [];
                    data_info_tb.records.map(item => {
                        if (item.type == 'AbsenceType') {
                            cb_loaivang.push(item);
                        } else if (item.type == 'AbsenceReason') {
                            cb_lydovang.push(item);
                        }
                    });

                    let procedure = "STV_HR_SEL_MBI_MBHRRE001_1";
                    let para = `${org_pk}`;
                    getDataJson(procedure, para, '1').then((res) => {
                        console.log(res);
                        let data = res.objcurdatas[0];
                        cbPersonApproved = data.records;
                    }).then(() => this.setState({ cb_loaivang, cb_lydovang, cbPersonApproved }));
                });
        })
    }

    onChangeLoaiVang(text, index) {
        this.setState({ loaivang_pk: this.state.cb_loaivang[index].pk })
    }

    onChangeLyDoVang(text, index) {
        this.setState({ lydovang_pk: this.state.cb_lydovang[index].pk, })
    }

    onChangePersonApproved1(text, index) {
        let cbPersonApproved1 = this.state.cbPersonApproved.filter(i => i.level_type == 1);
        this.setState({ empApproved_pk1: cbPersonApproved1[index].pk, })
    }

    onChangePersonApproved2(text, index) {
        let cbPersonApproved2 = this.state.cbPersonApproved.filter(i => i.level_type == 2);
        this.setState({ empApproved_pk2: cbPersonApproved2[index].pk, })
    }

    hideStartDatePicker = () => this.setState({ startDatePickerVisible: false });

    hideEndDatePicker = () => this.setState({ endDatePickerVisible: false });

    handleStartDatePicked = (date) => {
        console.log('A date has been picked: ', date);
        this.setState({ dt_fromdate: moment(date).format("DD-MM-YYYY") });
        this.hideStartDatePicker();
    };

    handleEndDatePicked = (date) => {
        console.log('A date has been picked: ', date);
        this.setState({ dt_todate: moment(date).format("DD-MM-YYYY") });
        this.hideEndDatePicker();
    };

    updateExperience() {
        var isThis = this;
        isThis.setState({ loading: true });
        const { dt_crt_by, dt_totime, dt_fromtime, dt_emp_pk, loaivang_pk, lydovang_pk, description, dt_fromdate, dt_todate, empApproved_pk1, empApproved_pk2 } = this.state;

        let p_action = 'INSERT';
        // let p_absencdange_pk = '';
        let p_thr_emp_pk = dt_emp_pk;
        let p_absence_type = loaivang_pk;
        let p_reason_type = lydovang_pk;
        let p_from_date = moment(moment(this.state.dt_fromdate, 'DD-MM-YYYY')).format('YYYYMMDD');
        let p_to_date = moment(moment(this.state.dt_todate, 'DD-MM-YYYY')).format('YYYYMMDD');
        let p_start_hours = dt_fromtime;
        let p_end_hours = dt_totime;
        let p_description = description;
        let p_seq_dt = '';
        let p_crt_by = dt_crt_by;


        let para = p_action + "|" + p_thr_emp_pk + "|" + p_absence_type + "|" + p_reason_type + "|" + p_from_date + "|" + p_to_date + "|" + p_start_hours + "|" + p_end_hours + "|" + p_description + "|" + p_seq_dt + "|" + empApproved_pk1 + "|" + empApproved_pk2 + "|" + p_crt_by;
        let action = "INSERT";
        let procedure = "STV_HR_UPD_MBI_MBHRRE001_1";
        console.log("log para:---------->" + para);

        OnExcute(action, procedure, para)
            .then((res) => {
                console.log(res);
                let data_info = res.objcurdatas[0];
                let arrayDataInserted = isThis.state.arrayDataInserted;


                if (data_info.totalrows > 0) {
                    if (data_info.records[0].status == "OK") {
                        arrayDataInserted.push(p_thr_emp_pk)

                        isThis.setState({
                            arrayDataInserted,
                            loading: false, status: 'Đăng kí vắng thành công!', colorStatus: '#51bc8a',
                            loaivang_pk: '',
                            lydovang_pk: '',
                            description: '',
                            dt_fromdate: moment(new Date()).format("DD-MM-YYYY"),
                            dt_todate: moment(new Date()).format("DD-MM-YYYY"),
                            dt_fromtime: '',
                            dt_totime: '',
                        });
                        let toast = variables.toastSuccessful;
                        variables.toastSuccessful.text = 'Đăng ký vắng thành công!'
                        Toast.show(toast);
                        this.calc();
                    } else {
                        if (!!data_info.records[0].error_ex && data_info.records[0].error_ex.includes('EXIST DATA')) {
                            isThis.setState({ loading: false, status: `ID ${this.state.emp_id}: Bạn đã đăng kí vắng ngày hôm nay rồi!`, colorStatus: 'red' });
                            let toast = variables.toastError;
                            toast.text = 'Đăng ký vắng thất bại! ' + data_info.records[0].error_ex || data_info.records[0].rtn_value
                            Toast.show(toast)
                            return;
                        } else if (!!data_info.records[0].error_ex && data_info.records[0].error_ex.includes('not got any schedule')) {
                            isThis.setState({ loading: false, status: `Ngày này chưa có sắp lịch làm việc!`, colorStatus: 'red' });
                            let toast = variables.toastError;
                            toast.text = 'Đăng ký vắng thất bại! ' || data_info.records[0].error_ex || data_info.records[0].rtn_value
                            Toast.show(toast)
                            return;
                        } else {
                            isThis.setState({ loading: false, status: 'Đăng kí vắng thất bại!', colorStatus: 'red' });
                            let toast = variables.toastError;
                            toast.text = 'Đăng ký vắng thất bại! ' || data_info.records[0].error_ex || data_info.records[0].rtn_value
                            Toast.show(toast)
                            return;
                        }

                    }
                }
                else {
                    isThis.setState({ loading: false, status: 'Đăng kí vắng thất bại!', colorStatus: 'red' });
                    let toast = variables.toastError;
                    toast.text = 'Cập nhật không thành công!'
                    Toast.show(toast)
                }
            });
        setTimeout(() => this.setState({ status: '', colorStatus: '' }), 10000)
    }

    confirmSave = () => {
        const { lydovang_pk, dt_fromdate, dt_todate, empApproved_pk1, empApproved_pk2 } = this.state;

        if (dt_fromdate == "") {
            this.setState({ status: 'Đăng kí vắng thất bại!', colorStatus: 'red' })
            let toast = variables.toastError;
            toast.text = 'Phải chọn từ ngày xin nghỉ!'
            Toast.show(toast)
            return;
        }
        if (dt_todate == "") {
            this.setState({ status: 'Đăng kí vắng thất bại!', colorStatus: 'red' })
            let toast = variables.toastError;
            toast.text = 'Phải chọn đến ngày xin nghỉ!'
            Toast.show(toast)
            return;
        }
        if (moment(dt_todate, 'DD-MM-YYYY') < moment(dt_fromdate, 'DD-MM-YYYY')) {
            this.setState({ status: 'Đăng kí vắng thất bại!', colorStatus: 'red' })
            let toast = variables.toastError;
            toast.text = 'Từ ngày phải nhỏ hơn đến ngày!'
            Toast.show(toast)
            return;
        }

        if (lydovang_pk == "") {
            this.setState({ status: 'Đăng kí vắng thất bại!', colorStatus: 'red' })
            let toast = variables.toastError;
            toast.text = 'Phải chọn lý do vắng!'
            Toast.show(toast)
            return;
        }

        // if (empApproved_pk1 == "") {
        //     this.setState({ status: 'Đăng kí vắng thất bại!', colorStatus: 'red' })
        //     let toast = variables.toastError;
        //     toast.text = 'Phải chọn người phê duyệt!'
        //     Toast.show(toast)
        //     return;
        // }

        if (empApproved_pk2 == "") {
            this.setState({ status: 'Đăng kí vắng thất bại!', colorStatus: 'red' })
            let toast = variables.toastError;
            toast.text = 'Phải chọn người phê duyệt!'
            Toast.show(toast)
            return;
        }

        Alert.alert(
            'Đăng kí vắng',
            'Bạn có chắc chắn muốn lưu?',
            [
                { text: 'Hủy', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'OK', onPress: () => { this.updateExperience(); } },
            ],
            { cancelable: false }
        )
    }

    calc() {
        this.props.callback({ arrayDataInserted: this.state.arrayDataInserted });
    }

    render() {
        const tv_baseColor = variables.defaultTextColor;
        const tv_baseSize = 14;
        const tv_baseWeight = 'normal';
        const cbPersonApproved = this.state.cbPersonApproved;
        const cbPersonApproved1 = cbPersonApproved.filter(i => i.level_type == 1);
        const cbPersonApproved2 = cbPersonApproved.filter(i => i.level_type == 2);

        return (
            <Container>
                <Loader loading={this.state.loading} />
                <Content padder style={{ marginHorizontal: 5 }}>

                    <View style={[GlobalStyles.row1, { paddingVertical: 10, borderColor: variables.cardBorderColor, borderWidth: 0.7, borderRadius: 10, marginVertical: 5 }]}>
                        <View style={[GlobalStyles.rowLeft1, {}]}>
                            <Icon1 style={{ fontSize: 20, color: 'red' }} name={'dot-single'} />
                            <Text style={{ fontSize: tv_baseSize, fontWeight: tv_baseWeight }}>Từ ngày: </Text>
                        </View>

                        <View style={[GlobalStyles.rowRight1, { flex: 1, }]}>
                            <View style={[styles.dropDownDay, { flex: 1, }]} >
                                <TouchableOpacity success onPress={() => this.setState({ startDatePickerVisible: true })} style={[{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', }]} >
                                    <Text style={{ marginHorizontal: 6, color: variables.textValue, fontSize: 15 }}> {this.state.dt_fromdate}</Text>
                                    <Icon style={[GlobalStyles.iconHeader, { color: variables.textValue, fontSize: 20, }]} name="calendar" />
                                </TouchableOpacity>
                            </View>

                            <DateTimePicker
                                cancelTextIOS='Hủy bỏ'
                                confirmTextIOS='Xác nhận'
                                cancelTextStyle={{ color: 'red' }}
                                confirmTextStyle={{ color: variables.backgroundColorTV }}
                                hideTitleContainerIOS={false}
                                titleIOS='Từ ngày'
                                titleStyle={{ color: tv_baseColor, fontWeight: 'bold' }}
                                is24Hour={true}
                                locale="vi_VN"
                                date={new Date()}
                                // minimumDate={new Date()}
                                isVisible={this.state.startDatePickerVisible}
                                onConfirm={this.handleStartDatePicked}
                                onCancel={this.hideStartDatePicker}
                                mode={'date'}
                                datePickerModeAndroid={'calendar'}
                            />
                        </View>
                    </View>

                    <View style={[GlobalStyles.row1, { paddingVertical: 10, borderColor: variables.cardBorderColor, borderWidth: 0.7, borderRadius: 10, marginVertical: 5 }]}>
                        <View style={[GlobalStyles.rowLeft1, {}]}>
                            <Icon1 style={{ fontSize: 20, color: 'red' }} name={'dot-single'} />
                            <Text style={{ fontSize: tv_baseSize, fontWeight: tv_baseWeight }}>Đến ngày: </Text>
                        </View>

                        <View style={[GlobalStyles.rowRight1, { flex: 1, }]}>
                            <View style={[styles.dropDownDay, { flex: 1, }]} >
                                <TouchableOpacity success onPress={() => this.setState({ endDatePickerVisible: true })} style={[{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', }]} >
                                    <Text style={{ marginHorizontal: 6, color: variables.textValue, fontSize: 15 }}> {this.state.dt_todate}</Text>
                                    <Icon style={[GlobalStyles.iconHeader, { color: variables.textValue, fontSize: 20, }]} name="calendar" />
                                </TouchableOpacity>
                            </View>

                            <DateTimePicker
                                cancelTextIOS='Hủy bỏ'
                                confirmTextIOS='Xác nhận'
                                cancelTextStyle={{ color: 'red' }}
                                confirmTextStyle={{ color: variables.backgroundColorTV }}
                                hideTitleContainerIOS={false}
                                titleIOS='Đến ngày'
                                titleStyle={{ color: tv_baseColor, fontWeight: 'bold' }}
                                is24Hour={true}
                                locale="vi_VN"
                                date={new Date()}
                                // minimumDate={new Date()}
                                isVisible={this.state.endDatePickerVisible}
                                onConfirm={this.handleEndDatePicked}
                                onCancel={this.hideEndDatePicker}
                                mode={'date'}
                                datePickerModeAndroid={'calendar'}
                            />
                        </View>
                    </View>

                    <View style={[GlobalStyles.row1, { borderColor: variables.cardBorderColor, borderWidth: 0.7, borderRadius: 10, marginVertical: 5 }]}>
                        <View style={[GlobalStyles.rowLeft1, {}]}>
                            <Icon1 style={{ fontSize: 20, color: 'red' }} name={'dot-single'} />
                            <Text style={{ fontSize: tv_baseSize, fontWeight: tv_baseWeight }}>Lý do vắng: </Text>
                        </View>

                        <View style={[GlobalStyles.rowRight1, { flex: 1, }]}>
                            <Dropdown
                                itemCount={8}
                                baseColor={tv_baseColor}
                                selectedItemColor="black"
                                textColor={variables.textValue}
                                value={this.state.lydovang || 'Chọn lý do vắng'}
                                data={this.state.cb_lydovang}
                                dropdownOffset={{ top: 8, left: variables.deviceWidth / 24.5 }}
                                rippleInsets={{ top: 0, bottom: -8, right: 0, left: 0, }}
                                dropdownPosition={0}
                                containerStyle={{ backgroundColor: 'transparent', width: '100%', overflow: 'hidden', borderTopRightRadius: 10, }}
                                pickerStyle={{ backgroundColor: variables.tabBgColor, borderRadius: 10, marginTop: variables.deviceHeight * 0.06 }}
                                inputContainerStyle={{ borderBottomColor: 'transparent' }}
                                style={{ textAlign: 'right', paddingRight: 8, fontSize: 15, marginTop: 1 }} //for changed text color
                                onChangeText={(text, index) => this.onChangeLyDoVang(text, index)}
                                renderAccessory={() => {
                                    return (
                                        <Icon style={[GlobalStyles.iconHeader, { color: 'black', marginTop: 2, marginRight: 10, color: variables.textValue }]} name="arrow-dropdown" />
                                    )
                                }}
                            />
                        </View>
                    </View>

                    <View style={GlobalStyles.spaceSmall}></View>

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

                    <Text style={{ marginTop: 20, fontSize: 15, marginLeft: 2, marginBottom: 3 }}>Chọn người phê duyệt:</Text>
                    <View style={[GlobalStyles.row1, { borderColor: variables.cardBorderColor, borderWidth: 0.7, borderRadius: 10, }]}>
                        <View style={[GlobalStyles.rowLeft1, {}]}>
                            {/* <Icon1 style={{ fontSize: 20, color: 'red' }} name={'dot-single'} /> */}
                            <Text style={{ fontSize: tv_baseSize, fontWeight: tv_baseWeight, marginLeft: 10 }}>Tổ trưởng: </Text>
                        </View>

                        <View style={[GlobalStyles.rowRight1, { flex: 1, }]}>
                            <Dropdown
                                itemCount={4}
                                baseColor={tv_baseColor}
                                selectedItemColor="black"
                                textColor={variables.textValue}
                                // value={cbPersonApproved2[0].value || 'Chọn tổ trưởng'}
                                value={'Chọn tổ trưởng'}
                                data={cbPersonApproved1}
                                dropdownOffset={{ top: 8, left: variables.deviceWidth / 24.5 }}
                                rippleInsets={{ top: 0, bottom: -8, right: 0, left: 0, }}
                                dropdownPosition={0}
                                containerStyle={{ backgroundColor: 'transparent', width: '100%', overflow: 'hidden', borderTopRightRadius: 10, }}
                                pickerStyle={{ backgroundColor: variables.tabBgColor, borderRadius: 10, marginTop: variables.deviceHeight * 0.06 }}
                                inputContainerStyle={{ borderBottomColor: 'transparent' }}
                                style={{ textAlign: 'right', paddingRight: 8, fontSize: 15, marginTop: 1 }} //for changed text color
                                onChangeText={(text, index) => this.onChangePersonApproved1(text, index)}
                                renderAccessory={() => {
                                    return (
                                        <Icon style={[GlobalStyles.iconHeader, { color: 'black', marginTop: 2, marginRight: 10, color: variables.textValue }]} name="arrow-dropdown" />
                                    )
                                }}
                            />
                        </View>
                    </View>
                    <View style={[GlobalStyles.row1, { borderColor: variables.cardBorderColor, borderWidth: 0.7, borderRadius: 10, marginTop: 10 }]}>
                        <View style={[GlobalStyles.rowLeft1, {}]}>
                            {/* <Icon1 style={{ fontSize: 20, color: 'red' }} name={'dot-single'} /> */}
                            <Text style={{ fontSize: tv_baseSize, fontWeight: tv_baseWeight, marginLeft: 10 }}>Trưởng bộ phận: </Text>
                        </View>

                        <View style={[GlobalStyles.rowRight1, { flex: 1, }]}>
                            <Dropdown
                                itemCount={4}
                                baseColor={tv_baseColor}
                                selectedItemColor="black"
                                textColor={variables.textValue}
                                // value={cbPersonApproved1[0].value || 'Chọn trưởng bộ phận'}
                                value={'Chọn trưởng bộ phận'}
                                data={cbPersonApproved2}
                                dropdownOffset={{ top: 8, left: variables.deviceWidth / 24.5 }}
                                rippleInsets={{ top: 0, bottom: -8, right: 0, left: 0, }}
                                dropdownPosition={0}
                                containerStyle={{ backgroundColor: 'transparent', width: '100%', overflow: 'hidden', borderTopRightRadius: 10, }}
                                pickerStyle={{ backgroundColor: variables.tabBgColor, borderRadius: 10, marginTop: variables.deviceHeight * 0.06 }}
                                inputContainerStyle={{ borderBottomColor: 'transparent' }}
                                style={{ textAlign: 'right', paddingRight: 8, fontSize: 15, marginTop: 1 }} //for changed text color
                                onChangeText={(text, index) => this.onChangePersonApproved2(text, index)}
                                renderAccessory={() => {
                                    return (
                                        <Icon style={[GlobalStyles.iconHeader, { color: 'black', marginTop: 2, marginRight: 10, color: variables.textValue }]} name="arrow-dropdown" />
                                    )
                                }}
                            />

                        </View>
                    </View>

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
    dropDownDay: {
        alignSelf: 'flex-start',
        paddingHorizontal: 3,
        marginRight: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        zIndex: 2
    }
});
