import React, { Component } from "react";
import { AppRegistry, View, Image, StatusBar, Alert, StyleSheet, Platform, Dimensions, Modal, TouchableHighlight, TouchableOpacity, TextInput } from "react-native";
import {
    Root, Toast, Container, Body, Content, Header, Left, Right, Picker, Spinner,
    Icon, Title, Input, Item, Label, Button, Text, StyleProvider, getTheme,
} from "native-base";
import customVariables from '../../../assets/styles/variables';
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import { TextField } from 'react-native-material-textfield';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import 'moment/locale/vi';
import { OnExcute, getUserInfo, getDataJson } from '../../../services/FetchData';
import DefaultPreference from 'react-native-default-preference';
import Loader from '../../SYS/Loader';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import variables from "../../../assets/styles/variables";
import Icon1 from 'react-native-vector-icons/Entypo';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { TextInput as TextInput1, Colors } from 'react-native-paper';


export default class MBHRRE004 extends Component {
    handleButton(navigate) {
        this.props.navigation.navigate(navigate);
    }
    constructor(props) {
        super(props);
        this.state = {
            startTimePickerVisible: false,
            endTimePickerVisible: false,
            dt_emp_pk: '',
            dt_crt_by: '',
            dt_emp_id: '',
            dt_org_pk: '',

            description: '',
            dt_fromtime: moment(new Date()).format("HH:MM"),
            dt_totime: moment(new Date()).format("HH:MM"),
            secureTextEntry: true,
            loading: false,
            //colorDotRequired: '#51bc8a',
            colorDotRequired: 'red',
            status: '',
            colorStatus: '',

            onDayPress: moment(new Date()).format("DD-MM-YYYY"),
            selectedCurrentDay: true,
            current: false,
            isModalOpen: false,

            lydovang_pk: null,
            lydovang: undefined,
            cb_lydovang: [{}],

            formKey: 0
        }
        this.onDayPress = this.onDayPress.bind(this);
    }
    onDayPress(day) {
        var that = this;
        that.setState({
            selectedCurrentDay: false,
            selected: day.dateString,
            onDayPress: moment(day.dateString).format("DD-MM-YYYY"),
        });
        console.log('dayonDayPress' + moment(day.dateString).format("YYYYMMDD"));
        //this.updateState2(moment(day.dateString).format("YYYYMMDD"));

        setTimeout(() => { this.setState({ isModalOpen: false, }) }, 150)
    }

    componentDidMount = async () => {
        DefaultPreference.getAll().then(async (valueAll) => {
            let user_pk = valueAll['user_pk'];
            let full_name = valueAll['full_name'];
            let emp_id = valueAll['emp_id'];
            let org_pk = valueAll['org_pk'];

            await this.setState(
                { dt_emp_pk: user_pk, dt_crt_by: full_name, dt_org_pk: org_pk, dt_emp_id: emp_id })

            let procedure = "stv_hr_sel_mbi_mbhrre004";
            let para = `ALL|${full_name}`;
            getDataJson(procedure, para, '1')
                .then((res) => {
                    console.log(res);
                    let data_info_tb = res.objcurdatas[0];
                    this.setState({
                        cb_lydovang: data_info_tb.records,
                        lydovang_pk: data_info_tb.records[0].pk,
                        lydovang: data_info_tb.records[0].value
                    });

                });
        })
    }

    onChangeLyDoVang(text, index) {
        // console.log("onChangelydovang: " + this.state.cb_lydovang[index].pk + ' ' + this.state.cb_lydovang[index].value);
        this.setState({
            lydovang_pk: this.state.cb_lydovang[index].pk,
            lydovang: this.state.cb_lydovang[index].value
        })
    }

    showStartTimePicker = () => this.setState({ startTimePickerVisible: true });

    showEndTimePicker = () => this.setState({ endTimePickerVisible: true });

    hideStartTimePicker = () => this.setState({ startTimePickerVisible: false });

    hideEndTimePicker = () => this.setState({ endTimePickerVisible: false });

    handleStartTimePicked = (time) => {
        console.log('A time has been picked: ', time);
        this.setState({ dt_fromtime: moment(time).format("HH:mm") });
        this.hideStartTimePicker();
    };

    handleEndTimePicked = (time) => {
        console.log('A time has been picked: ', time);
        this.setState({ dt_totime: moment(time).format("HH:mm") });
        this.hideEndTimePicker();
    };

    updateExperience() {
        const { dt_emp_pk, dt_crt_by, dt_emp_id, dt_org_pk, onDayPress, dt_totime, dt_fromtime, description, lydovang_pk } = this.state;
        console.log(this.state.lydovang_pk);

        var isThis = this;
        let p_action = 'INSERT';
        let p_thr_emp_pk = dt_emp_pk;
        let p_absence_type = '';
        let p_reason_type = lydovang_pk;
        let p_from_date = moment(onDayPress, 'DD-MM-YYYY').format('YYYYMMDD');
        let p_to_date = moment(onDayPress, 'DD-MM-YYYY').format('YYYYMMDD');
        let p_start_hours = dt_fromtime;
        let p_end_hours = dt_totime;
        let p_description = description;
        let p_seq_dt = '';
        let p_crt_by = dt_crt_by;

        let para = p_action + "|" + p_thr_emp_pk + "|" + p_absence_type + "|" + p_reason_type + "|" + p_from_date + "|" + p_to_date + "|" + p_start_hours + "|" + p_end_hours + "|" + p_description + "|" + p_seq_dt + "|" + p_crt_by;
        let action = "INSERT";
        let procedure = "STV_HR_UPD_MBI_MBHRRE004_1";

        OnExcute(action, procedure, para)
            .then((res) => {
                console.log(res);
                let data_info = res.objcurdatas[0];
                if (data_info.totalrows > 0) {
                    if (data_info.records[0].status == "OK") {
                        isThis.setState({
                            loading: false, status: 'Đăng kí đi trễ về sớm thành công!', colorStatus: '#51bc8a',
                            description: '',
                            onDayPress: moment(new Date()).format("DD-MM-YYYY"),
                            dt_fromtime: moment(new Date()).format("hh:mm"),
                            dt_totime: moment(new Date()).format("hh:mm"),
                            lydovang_pk: this.state.cb_lydovang[0].pk,
                            lydovang: this.state.cb_lydovang[0].value,
                            formKey: Math.random() // update the key 
                        })
                        let toast = variables.toastSuccessful;
                        variables.toastSuccessful.text = 'Đăng kí đi trễ về sớm thành công!'
                        Toast.show(toast)
                    } else {
                        if (!!data_info.records[0].error_ex && data_info.records[0].error_ex.includes('EXIST DATA')) {
                            isThis.setState({ loading: false, status: `ID ${dt_emp_id}: Bạn đã đăng kí đi trễ về sớm ngày hôm nay rồi!`, colorStatus: 'red' });
                            let toast = variables.toastError;
                            toast.text = 'Đăng ký đi trễ về sớm thất bại!'
                            Toast.show(toast)
                            return;
                        } else if (!!data_info.records[0].error_ex && data_info.records[0].error_ex.includes('not got any schedule')) {
                            isThis.setState({ loading: false, status: `Ngày này chưa có sắp lịch làm việc!`, colorStatus: 'red' });
                            let toast = variables.toastError;
                            toast.text = 'Đăng ký vắng thất bại!'
                            Toast.show(toast)
                            return;
                        } else {
                            isThis.setState({ loading: false, status: 'Đăng kí đi trễ về sớm thất bại!', colorStatus: 'red' });
                            let toast = variables.toastError;
                            toast.text = 'Đăng ký đi trễ về sớm thất bại!'
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
        const { dt_totime, dt_fromtime, lydovang_pk } = this.state;
        // console.log(dt_totime < dt_fromtime)

        if (dt_fromtime == "") {
            this.setState({ status: 'Đăng kí đi trễ về sớm thất bại!', colorStatus: 'red' })
            let toast = variables.toastError;
            toast.text = 'Phải chọn đi trễ về sớm từ giờ!'
            Toast.show(toast)
            return;
        }
        if (dt_totime == "") {
            this.setState({ status: 'Đăng kí đi trễ về sớm thất bại!', colorStatus: 'red' })

            let toast = variables.toastError;
            toast.text = 'Phải chọn đi trễ về sớm đến giờ!'
            Toast.show(toast)
            return;
        }
        if (dt_totime < dt_fromtime) {
            this.setState({ status: 'Đăng kí đi trễ về sớm thất bại!', colorStatus: 'red' })
            let toast = variables.toastError;
            toast.text = 'Nhập dữ liệu giờ không hợp lệ!'
            Toast.show(toast)
            return;
        }
        if (lydovang_pk == "") {
            this.setState({ status: 'Đăng kí đi trễ về sớm thất bại!', colorStatus: 'red' })
            let toast = variables.toastError;
            toast.text = 'Phải chọn lý do đi trễ về sớm!'
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
        let tv_baseColor = variables.defaultTextColor;
        let tv_baseSize = 14;
        let tv_baseWeight = 'normal';
        let radio_props = [];
        this.state.cb_lydovang.map((item, index) => {
            radio_props = [...radio_props, { label: item.value, value: index }]
        })
        return (

            <StyleProvider style={getTheme(customVariables)} backdropTransitionOutTiming={0}>
                <Root>
                    <Container>
                        <Loader loading={this.state.loading} />

                        <Content padder style={{ marginHorizontal: 5 }}>

                            <View style={[GlobalStyles.row1, { height: variables.deviceHeight * 0.06, borderColor: variables.cardBorderColor, borderWidth: 0.7, borderRadius: 10, marginVertical: 5, backgroundColor: '#FFF' }]}>
                                <Icon1 style={{ fontSize: 20, color: 'red' }} name={'dot-single'} />
                                <Text style={{ fontSize: tv_baseSize, fontWeight: tv_baseWeight }}>Ngày làm việc: </Text>
                                <View style={[GlobalStyles.rowRight1, { height: variables.deviceHeight * 0.06, flex: 1, }]}>
                                    <View style={{ flexDirection: 'row' }}
                                        ref={(ref) => { this.marker = ref }}
                                        onLayout={({ nativeEvent }) => {
                                            if (this.marker) {
                                                this.marker.measure((x, y, width, height, pageX, pageY) => {
                                                    this.setState({ pageX, pageY, heightOfCld: height });
                                                })
                                            }
                                        }}>
                                        <View style={[styles.dropDownDay, { flex: 1 }]} >
                                            <TouchableOpacity success onPress={() => this.setState({ isModalOpen: true })} style={[{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', }]} >
                                                {/* <Icon style={[GlobalStyles.iconHeader, { color: 'black', fontSize: 22, color: 'black', marginLeft: 3 }]} name="calendar" /> */}
                                                <Text style={{ marginHorizontal: 6, color: variables.textValue, fontSize: 15 }}> {this.state.onDayPress}</Text>
                                                <Icon style={[GlobalStyles.iconHeader, { color: variables.textValue, marginTop: 1 }]} name="arrow-dropdown" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <Modal
                                        animationType='fade'
                                        transparent={true}
                                        visible={this.state.isModalOpen}
                                        presentationStyle='overFullScreen'
                                        onRequestClose={() => { }}>
                                        <TouchableHighlight
                                            onPress={(e) => [this.setState({ isModalOpen: false }),]}
                                            style={[styles.container1, {}]}>
                                            <View style={[styles.modalBackground, { right: '2%', marginTop: this.state.pageY + this.state.heightOfCld, borderRadius: 5, width: '93%', overflow: "hidden", position: 'absolute' }]}>

                                                <Calendar
                                                    style={styles.calendar}
                                                    minDate={moment(new Date()).format("YYYY-MM-DD")}
                                                    //maxDate={moment(new Date()).format("YYYY-MM-DD")}
                                                    monthFormat={'MMMM - yyyy'}
                                                    onDayPress={this.onDayPress}
                                                    onDayLongPress={this.onDayPress}
                                                    //onMonthChange={this.onMonthChange}
                                                    hideDayNames={false}
                                                    showWeekNumbers={false}
                                                    hideExtraDays={false}
                                                    firstDay={0}
                                                    current={this.state.current ? moment(this.state.onDayPress, 'DD-MM-YYYY').format('YYYY-MM') : null}
                                                    markedDates={{
                                                        [moment(new Date()).format("YYYY-MM-DD")]: { selected: this.state.selectedCurrentDay, marked: true, dotColor: 'red', },
                                                        [this.state.selected]: { selected: true, disableTouchEvent: false, selectedDotColor: variables.textValue }
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
                                {/* <View style={[GlobalStyles.rowRight1, { height: variables.deviceHeight * 0.06, }]}>
                                    <Icon style={[GlobalStyles.iconHeader, { color: variables.textValue, paddingRight: 5, paddingLeft: 5, fontSize: 22, paddingTop: 4 }]} name="arrow-dropdown" />
                                </View> */}
                            </View>


                            <View style={[GlobalStyles.row1, { height: variables.deviceHeight * 0.06, borderColor: variables.cardBorderColor, borderWidth: 0.7, borderRadius: 10, marginVertical: 5, backgroundColor: '#FFF' }]}>
                                <View style={[GlobalStyles.rowLeft1, {}]}>
                                    <Icon1 style={{ fontSize: 20, color: this.state.colorDotRequired }} name={'dot-single'} />
                                    <Text style={{ fontSize: tv_baseSize, fontWeight: tv_baseWeight }}>Từ giờ: </Text>
                                </View>

                                <View style={[GlobalStyles.rowRight1, { flex: 1 }]}>
                                    <View style={[styles.dropDownDay, { flex: 1, }]} >
                                        <TouchableOpacity success onPress={this.showStartTimePicker} style={[{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', }]} >
                                            <Text style={{ marginHorizontal: 6, color: variables.textValue, fontSize: 15 }}> {this.state.dt_fromtime}</Text>
                                            <Icon style={[GlobalStyles.iconHeader, { color: variables.textValue, }]} name="clock" />
                                        </TouchableOpacity>
                                    </View>

                                    <DateTimePicker
                                        cancelTextIOS='Hủy bỏ'
                                        confirmTextIOS='Xác nhận'
                                        cancelTextStyle={{ color: 'red' }}
                                        confirmTextStyle={{ color: variables.backgroundColorTV }}
                                        hideTitleContainerIOS={false}
                                        titleIOS='Từ giờ'
                                        titleStyle={{ color: tv_baseColor, fontWeight: 'bold' }}
                                        is24Hour={true}
                                        locale="vi_VN"
                                        date={new Date()}
                                        isVisible={this.state.startTimePickerVisible}
                                        onConfirm={this.handleStartTimePicked}
                                        onCancel={this.hideStartTimePicker}
                                        mode={'time'}
                                        datePickerModeAndroid={'calendar'}
                                    />
                                </View>
                            </View>

                            <View style={[GlobalStyles.row1, { height: variables.deviceHeight * 0.06, borderColor: variables.cardBorderColor, borderWidth: 0.7, borderRadius: 10, marginVertical: 5, backgroundColor: '#FFF' }]}>
                                <View style={[GlobalStyles.rowLeft1, {}]}>
                                    <Icon1 style={{ fontSize: 20, color: this.state.colorDotRequired }} name={'dot-single'} />
                                    <Text style={{ fontSize: tv_baseSize, fontWeight: tv_baseWeight }}>Đến giờ: </Text>
                                </View>

                                <View style={[GlobalStyles.rowRight1, { flex: 1, }]}>
                                    <View style={[styles.dropDownDay, { flex: 1, }]} >
                                        <TouchableOpacity success onPress={this.showEndTimePicker} style={[{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', }]} >
                                            <Text style={{ marginHorizontal: 6, color: variables.textValue, fontSize: 15 }}> {this.state.dt_totime}</Text>
                                            <Icon style={[GlobalStyles.iconHeader, { color: variables.textValue, }]} name="clock" />
                                        </TouchableOpacity>
                                    </View>

                                    <DateTimePicker
                                        cancelTextIOS='Hủy bỏ'
                                        confirmTextIOS='Xác nhận'
                                        cancelTextStyle={{ color: 'red' }}
                                        confirmTextStyle={{ color: variables.backgroundColorTV }}
                                        hideTitleContainerIOS={false}
                                        titleIOS='Đến giờ'
                                        titleStyle={{ color: tv_baseColor, fontWeight: 'bold' }}
                                        is24Hour={true}
                                        locale="vi_VN"
                                        date={new Date()}
                                        isVisible={this.state.endTimePickerVisible}
                                        onConfirm={this.handleEndTimePicked}
                                        onCancel={this.hideEndTimePicker}
                                        mode={'time'}
                                        datePickerModeAndroid={'calendar'}
                                    />
                                </View>
                            </View>

                            <View style={[GlobalStyles.row1, { borderColor: variables.cardBorderColor, borderWidth: 0.7, borderRadius: 10, marginVertical: 5, alignItems: 'flex-start', backgroundColor: '#FFF' }]}>
                                <View style={[GlobalStyles.rowLeft1, { marginTop: 12, }]}>
                                    <Icon1 style={{ fontSize: 20, color: 'red' }} name={'dot-single'} />
                                    <Text style={{ fontSize: tv_baseSize, fontWeight: tv_baseWeight }}>Lý do vắng: </Text>
                                </View>

                                <View style={[GlobalStyles.rowRight1, { alignItems: 'center', }]}>
                                    <View backdropTransitionOutTiming={0}>
                                        <RadioForm
                                            key={this.state.formKey}
                                            radio_props={radio_props}
                                            initial={0}
                                            onPress={(value) => { this.onChangeLyDoVang('', value) }}
                                            buttonColor={'gray'}
                                            labelColor={'gray'}
                                            formHorizontal={false}
                                            labelHorizontal={true}
                                            animation={false}
                                            selectedButtonColor={variables.textValue}
                                            selectedLabelColor={variables.textValue}
                                            style={{
                                                // justifyContent: 'center',
                                                // alignItems: 'center',
                                                alignSelf: 'center',
                                                marginTop: 15,
                                            }}
                                            radioStyle={{ paddingBottom: 15 }}
                                            buttonSize={10}
                                            buttonOuterSize={21}
                                            labelStyle={{ fontSize: 17, marginRight: '4%' }}
                                            buttonStyle={{}}
                                            backdropTransitionOutTiming={0}
                                        />

                                    </View>

                                </View>
                            </View>

                            {/* <View style={[GlobalStyles.row1, { height: variables.deviceHeight * 0.06, borderColor: variables.cardBorderColor, borderWidth: 0.7, borderRadius: 10, marginVertical: 5 }]}>
                                <Icon1 style={{ fontSize: 20, color: 'red' }} name={'dot-single'} />
                                <Text style={{ fontSize: tv_baseSize, fontWeight: tv_baseWeight }}>Lý do vắng: </Text>
                                <View style={[GlobalStyles.rowRight1, { height: variables.deviceHeight * 0.06, flex: 1, }]}>
                                    <Dropdown
                                        itemCount={8}
                                        baseColor={tv_baseColor}
                                        selectedItemColor="black"
                                        textColor={variables.textValue}
                                        value={this.state.lydovang || 'Chọn lý do vắng'}
                                        data={this.state.cb_lydovang}
                                        dropdownOffset={{ top: 8, left: variables.deviceWidth / 24.5 }}
                                        rippleInsets={{ top: 0, bottom: 0, right: 0, left: 0, }}
                                        dropdownPosition={0}
                                        containerStyle={{ backgroundColor: 'transparent', height: variables.deviceHeight * 0.058, width: '100%', overflow: 'hidden', borderRadius: 10 }}
                                        pickerStyle={{ backgroundColor: variables.tabBgColor, borderRadius: 10, marginTop: variables.deviceHeight * 0.06 }}
                                        inputContainerStyle={{ borderBottomColor: 'transparent' }}
                                        style={{ textAlign: 'right', paddingRight: 8, fontSize: 15 }} //for changed text color
                                        onChangeText={(text, index) => this.onChangeLyDoVang(text, index)}
                                        renderAccessory={() => {
                                            return (
                                                <Icon style={[GlobalStyles.iconHeader, { color: 'black', marginTop: 2, marginRight: 10, color: variables.textValue }]} name="arrow-dropdown" />
                                            )
                                        }}
                                    />
                                </View>

                                
                            </View> */}

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
