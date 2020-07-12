
import React, { Component, PureComponent } from 'react';
import { FlatList, AppRegistry, View, Image, StatusBar, Alert, Modal, TouchableHighlight, StyleSheet, Platform, Dimensions, TouchableOpacity, TextInput } from "react-native";
import {
    Root, Toast, Container, ListItem, Body, Content, Header, Left, Right, Picker, Spinner,
    Title, Input, Item, Label, Text, StyleProvider, getTheme, Icon, List, ListView,
} from "native-base";
import { Button } from 'react-native-elements';
import { TextField } from 'react-native-material-textfield';
import customVariables from '../../../assets/styles/variables';
import { CheckBox } from 'react-native-elements';
import variables from '../../../assets/styles/variables';
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import moment from 'moment';
import DialogInput from 'react-native-dialog-input';
import DefaultPreference from 'react-native-default-preference';
import { OnExcute, getUserInfo, getDataJson } from '../../../services/FetchData';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Loader from '../../SYS/Loader';
import { TextInput as TextInput1, Colors } from 'react-native-paper';
import { Badge, withBadge } from 'react-native-elements'

export default class MBHRRE007_1 extends Component {
    constructor(props) {
        // console.disableYellowBox = true
        super(props);
        this.state = {
            arrayDataInserted: [],
            arrayAddTime: [],
            arrayTimeNLD: [],
            arrayCommentNLD: [],
            numberInputs: [],
            commnetInputs: [],
            data: this.props.data.slice(0, 3),

            dt_crt_by: '',
            dt_emp_pk: '',
            status: 'NOOK',
            isModalOpen: false,

            work_dt: '',
            no: '',
            day_type: '',

            dt_fromtime: '-- : --',
            dt_totime: '-- : --',
            dt_fromdate: '',
            dt_todate: '',

            dt_fromtime1: '-- : --',
            dt_totime1: '-- : --',
            dt_fromdate1: '',
            dt_todate1: '',

            startTimePickerVisible: false,
            endTimePickerVisible: false,
            startDatePickerVisible: false,
            endDatePickerVisible: false,
            checkEat: false,

            startTimePickerVisible1: false,
            endTimePickerVisible1: false,
            startDatePickerVisible1: false,
            endDatePickerVisible1: false,
            checkEat1: false,

            //org_pk: '',
            user_pk: '',
            // emp_id: '',
            full_name: '',
            loading: false,

        }
    }

    componentDidMount() {
        var that = this;
        console.log("========componentDidMount===");
        DefaultPreference.getAll().then(async (valueAll) => {
            let user_pk = valueAll['user_pk'];
            let full_name = valueAll['full_name'];
            //let emp_id = valueAll['emp_id'];
            //org_pk = valueAll['org_pk'];

            await that.setState({ user_pk: user_pk, full_name: full_name })
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setState({
                arrayDataInserted: [],
                arrayAddTime: [],
                arrayTimeNLD: [],
                arrayCommentNLD: [],
                numberInputs: [''],
                commnetInputs: [''],
                data: this.props.data.slice(0, 3),

                work_dt: '',
                no: '',
                day_type: '',

                dt_fromtime: '-- : --',
                dt_totime: '-- : --',
                dt_fromdate: '',
                dt_todate: '',
                checkEat: false,

                dt_fromtime1: '-- : --',
                dt_totime1: '-- : --',
                dt_fromdate1: '',
                dt_todate1: '',
                checkEat1: false,
            })
        }
    }

    handleStartDatePicked = (date, type) => {
        // console.log('A date has been picked: ', type);
        if (type === 'from0') {
            this.setState({
                dt_fromdate: moment(date).format("DD-MM-YYYY"),
                startDatePickerVisible: false
            });
        } else if (type === 'from1') {
            this.setState({
                dt_fromdate1: moment(date).format("DD-MM-YYYY"),
                startDatePickerVisible1: false
            });
        }
    };

    handleEndDatePicked = (date, type) => {
        // console.log('A date has been picked: ', date);
        if (type === 'to0') {
            this.setState({
                dt_todate: moment(date).format("DD-MM-YYYY"),
                endDatePickerVisible: false
            });
        } else if (type === 'to1') {
            this.setState({
                dt_todate1: moment(date).format("DD-MM-YYYY"),
                endDatePickerVisible1: false
            });
        }

    };

    handleStartTimePicked = (time, type) => {
        // console.log('A time has been picked: ', time);
        if (type == 'from0') {
            this.setState({
                dt_fromtime: moment(time).format("HH:mm"),
                startTimePickerVisible: false
            });
        } else if (type == 'from1') {
            this.setState({
                dt_fromtime1: moment(time).format("HH:mm"),
                startTimePickerVisible1: false
            });
        }

    };

    handleEndTimePicked = (time, type) => {
        // console.log('A time has been picked: ', time);
        if (type == 'to0') {
            this.setState({
                dt_totime: moment(time).format("HH:mm"),
                endTimePickerVisible: false
            });
        } else if (type == 'to1') {
            this.setState({
                dt_totime1: moment(time).format("HH:mm"),
                endTimePickerVisible1: false
            });
        }

    };

    showDialog = (no, work_dt, day_type) => {
        let arrayAddTime = this.state.arrayAddTime;

        const item = arrayAddTime.filter(item => item.no == no)[0];
        if (!!item) {
            if (item.fromDateTime != '-- : --') {
                this.setState({
                    dt_fromtime: (item.fromDateTime).substring(8, 15),
                    dt_totime: (item.toDateTime).substring(8, 15),
                    dt_fromdate: moment((item.fromDateTime).substring(0, 8)).format('DD-MM-YYYY'),
                    dt_todate: moment((item.toDateTime).substring(0, 8)).format('DD-MM-YYYY'),
                    checkEat: item.eat,

                    isModalOpen: true,
                    no: no, work_dt: work_dt, day_type: day_type
                })
            } else {
                this.setState({ checkEat: false });
            }

            if (item.fromDateTime1 != '-- : --') {
                this.setState({
                    dt_fromtime1: (item.fromDateTime1).substring(8, 15),
                    dt_totime1: (item.toDateTime1).substring(8, 15),
                    dt_fromdate1: moment((item.fromDateTime1).substring(0, 8)).format('DD-MM-YYYY'),
                    dt_todate1: moment((item.toDateTime1).substring(0, 8)).format('DD-MM-YYYY'),
                    checkEat1: item.eat1,

                    isModalOpen: true,
                    no: no, work_dt: work_dt, day_type: day_type
                })
            } else {
                this.setState({ checkEat1: false });
            }
        } else {
            this.setState({
                checkEat: false,
                checkEat1: false,

                isModalOpen: true,
                no: no, work_dt: work_dt, day_type: day_type
            });
        }
    }


    addTime = (no, fromTime, toTime, fromDate, toDate, fromTime1, toTime1, fromDate1, toDate1) => {
        let fromT = `${moment(fromDate, 'DD-MM-YYYYY').format('YYYY-MM-DD')}T${fromTime}Z`;
        let toT = `${moment(toDate, 'DD-MM-YYYYY').format('YYYY-MM-DD')}T${toTime}Z`;
        let isAfter = moment(toT).diff(fromT, 'days');

        let fromT1 = `${moment(fromDate1, 'DD-MM-YYYYY').format('YYYY-MM-DD')}T${fromTime1}Z`;
        let toT1 = `${moment(toDate1, 'DD-MM-YYYYY').format('YYYY-MM-DD')}T${toTime1}Z`;
        let isAfter1 = moment(toT1).diff(fromT1, 'days');

        if ((fromTime != '-- : --' && toTime == '-- : --') || (fromTime == '-- : --' && toTime != '-- : --')) {
            let toast = variables.toastError;
            toast.text = 'Bạn phải chọn đủ trong khung giờ 1!'
            Toast.show(toast)
            return;
        } else if ((toTime < fromTime) && (toDate == fromDate)) {
            let toast = variables.toastError;
            toast.text = 'Bạn phải chọn ngày giờ hợp lệ trong khung giờ 1!'
            Toast.show(toast)
            return;
        } else if (isAfter > 1) {
            let toast = variables.toastError;
            toast.text = 'Bạn phải chọn ngày giờ hợp lệ trong khung giờ 1!'
            Toast.show(toast)
            return;
        } else if ((fromTime1 != '-- : --' && toTime1 == '-- : --') || (fromTime1 == '-- : --' && toTime1 != '-- : --')) {
            let toast = variables.toastError;
            toast.text = 'Bạn phải chọn đủ trong khung giờ 2!'
            Toast.show(toast)
            return;
        } else if ((toTime1 < fromTime1) && (toDate1 == fromDate1)) {
            let toast = variables.toastError;
            toast.text = 'Bạn phải chọn ngày giờ hợp lệ trong khung giờ 2!'
            Toast.show(toast)
            return;
        } else if (isAfter1 > 1) {
            let toast = variables.toastError;
            toast.text = 'Bạn phải chọn ngày giờ hợp lệ trong khung giờ 2!'
            Toast.show(toast)
            return;
        } else {

            let arrayAddTime = this.state.arrayAddTime;
            const index = arrayAddTime.findIndex(item => item.no == no);
            const checkEat = this.state.checkEat;
            const checkEat1 = this.state.checkEat1;

            if ((fromTime == '-- : --' && toTime == '-- : --') && (fromTime1 == '-- : --' && toTime1 == '-- : --')) {
                // const index = arrayAddTime.findIndex(item => item.no == no);
                // if (index != -1) {
                //     arrayAddTime.splice(index, 1);
                // }
            } else {
                if (index == -1) {
                    if ((fromTime != '-- : --' && toTime != '-- : --') && (fromTime1 != '-- : --' && toTime1 != '-- : --')) {
                        arrayAddTime.push({
                            no: no,
                            fromDateTime: `${moment(fromDate, 'DD-MM-YYYY').format('YYYYMMDD')}${fromTime}`,
                            toDateTime: `${moment(toDate, 'DD-MM-YYYY').format('YYYYMMDD')}${toTime}`,
                            eat: checkEat,
                            fromDateTime1: `${moment(fromDate1, 'DD-MM-YYYY').format('YYYYMMDD')}${fromTime1}`,
                            toDateTime1: `${moment(toDate1, 'DD-MM-YYYY').format('YYYYMMDD')}${toTime1}`,
                            eat1: checkEat1,
                        })
                    } else if ((fromTime != '-- : --' && toTime != '-- : --') && (fromTime1 == '-- : --' && toTime1 == '-- : --')) {
                        arrayAddTime.push({
                            no: no,
                            fromDateTime: `${moment(fromDate, 'DD-MM-YYYY').format('YYYYMMDD')}${fromTime}`,
                            toDateTime: `${moment(toDate, 'DD-MM-YYYY').format('YYYYMMDD')}${toTime}`,
                            eat: checkEat,
                            fromDateTime1: `${fromTime1}`,
                            toDateTime1: `${toTime1}`,
                            eat1: checkEat1,
                        })
                    } else if ((fromTime == '-- : --' && toTime == '-- : --') && (fromTime1 != '-- : --' && toTime1 != '-- : --')) {
                        arrayAddTime.push({
                            no: no,
                            fromDateTime: `${fromTime}`,
                            toDateTime: `${toTime}`,
                            eat: checkEat,
                            fromDateTime1: `${moment(fromDate1, 'DD-MM-YYYY').format('YYYYMMDD')}${fromTime1}`,
                            toDateTime1: `${moment(toDate1, 'DD-MM-YYYY').format('YYYYMMDD')}${toTime1}`,
                            eat1: checkEat1,
                        })
                    }

                } else {
                    if ((fromTime != '-- : --' && toTime != '-- : --') && (fromTime1 != '-- : --' && toTime1 != '-- : --')) {

                        arrayAddTime[index].no = no;
                        arrayAddTime[index].fromDateTime = `${moment(fromDate, 'DD-MM-YYYY').format('YYYYMMDD')}${fromTime}`;
                        arrayAddTime[index].toDateTime = `${moment(toDate, 'DD-MM-YYYY').format('YYYYMMDD')}${toTime}`;
                        arrayAddTime[index].eat = checkEat;
                        arrayAddTime[index].fromDateTime1 = `${moment(fromDate1, 'DD-MM-YYYY').format('YYYYMMDD')}${fromTime1}`;
                        arrayAddTime[index].toDateTime1 = `${moment(toDate1, 'DD-MM-YYYY').format('YYYYMMDD')}${toTime1}`;
                        arrayAddTime[index].eat1 = checkEat1;

                    } else if ((fromTime != '-- : --' && toTime != '-- : --') && (fromTime1 == '-- : --' && toTime1 == '-- : --')) {

                        arrayAddTime[index].no = no;
                        arrayAddTime[index].fromDateTime = `${moment(fromDate, 'DD-MM-YYYY').format('YYYYMMDD')}${fromTime}`;
                        arrayAddTime[index].toDateTime = `${moment(toDate, 'DD-MM-YYYY').format('YYYYMMDD')}${toTime}`;
                        arrayAddTime[index].eat = checkEat;
                        arrayAddTime[index].fromDateTime1 = `${fromTime1}`;
                        arrayAddTime[index].toDateTime1 = `${toTime1}`;
                        arrayAddTime[index].eat1 = false;

                    } else if ((fromTime == '-- : --' && toTime == '-- : --') && (fromTime1 != '-- : --' && toTime1 != '-- : --')) {

                        arrayAddTime[index].no = no;
                        arrayAddTime[index].fromDateTime = `${fromTime}`;
                        arrayAddTime[index].toDateTime = `${toTime}`;
                        arrayAddTime[index].eat = false;
                        arrayAddTime[index].fromDateTime1 = `${moment(fromDate1, 'DD-MM-YYYY').format('YYYYMMDD')}${fromTime1}`;
                        arrayAddTime[index].toDateTime1 = `${moment(toDate1, 'DD-MM-YYYY').format('YYYYMMDD')}${toTime1}`;
                        arrayAddTime[index].eat1 = checkEat1;
                    }
                }
            }

            this.setState({
                arrayAddTime, isModalOpen: false,

                dt_fromtime: '-- : --',
                dt_totime: '-- : --',
                dt_fromdate: '',
                dt_todate: '',

                dt_fromtime1: '-- : --',
                dt_totime1: '-- : --',
                dt_fromdate1: '',
                dt_todate1: '',
            });
            console.log(arrayAddTime);
        }
    }

    clearTimeFollowNo = (no, type) => {
        let arrayAddTime = this.state.arrayAddTime;
        const index = arrayAddTime.findIndex(item => item.no == no);

        if (type == 'time01') {
            if (index != -1) {
                if (arrayAddTime[index].fromDateTime1 == '-- : --') {
                    arrayAddTime.splice(index, 1);
                } else {
                    arrayAddTime[index].no = no;
                    arrayAddTime[index].fromDateTime = '-- : --';
                    arrayAddTime[index].toDateTime = '-- : --';
                }
            }
            this.setState({
                arrayAddTime,
                dt_fromtime: '-- : --',
                dt_totime: '-- : --',
                dt_fromdate: moment(this.state.work_dt).format("DD-MM-YYYY"),
                dt_todate: moment(this.state.work_dt).format("DD-MM-YYYY"),
            })
        } else if (type == 'time02') {
            if (index != -1) {
                if (index != -1) {
                    if (arrayAddTime[index].fromDateTime == '-- : --') {
                        arrayAddTime.splice(index, 1);
                    } else {
                        arrayAddTime[index].no = no;
                        arrayAddTime[index].fromDateTime1 = '-- : --';
                        arrayAddTime[index].toDateTime1 = '-- : --';
                    }
                }
            }
            this.setState({
                dt_fromtime1: '-- : --',
                dt_totime1: '-- : --',
                dt_fromdate1: moment(this.state.work_dt).format("DD-MM-YYYY"),
                dt_todate1: moment(this.state.work_dt).format("DD-MM-YYYY"),
            })
        }

    }


    onChangeNumberTimeNLD = (no, timeNLD) => {
        let arrayTimeNLD = this.state.arrayTimeNLD;
        const index = arrayTimeNLD.findIndex(item => item.no == no);
        if (((!timeNLD.match(/^\d+(\.\d)?\d*$/) && timeNLD != '') || parseFloat(timeNLD) > 24)) {
            let toast = variables.toastError;
            toast.text = 'Bạn phải nhập kí tự là số và nhỏ hơn 24!';
            Toast.show(toast);
            if (index != -1) {
                arrayTimeNLD.splice(index, 1);
            };
            this.setState({ arrayTimeNLD });
            return;
        }

        if (timeNLD == '') {
            if (index != -1) {
                arrayTimeNLD.splice(index, 1);
            }
        } else {
            if (index == -1) {
                arrayTimeNLD.push({ no: no, timeNLD: timeNLD, });
            } else {
                arrayTimeNLD[index].no = no;
                arrayTimeNLD[index].timeNLD = timeNLD;
            }
        }
        // console.log(arrayTimeNLD)
        this.setState({ arrayTimeNLD })

    }

    onChangeComentTimeNLD = (no, commentNLD) => {
        let arrayCommentNLD = this.state.arrayCommentNLD;
        const index = arrayCommentNLD.findIndex(item => item.no == no);

        if (commentNLD == '') {
            if (index != -1) {
                arrayCommentNLD.splice(index, 1);
            }
        } else {
            if (index == -1) {
                arrayCommentNLD.push({ no: no, commentNLD: commentNLD, });
            } else {
                arrayCommentNLD[index].no = no;
                arrayCommentNLD[index].commentNLD = commentNLD;
            }
        }
        this.setState({ arrayCommentNLD })
        console.log(arrayCommentNLD);
    }

    updateExperience = (no, work_dt, P_OTXN_NLD, P_REASON_NLD) => {
        this.setState({ loading: true })
        var isThis = this;

        let p_start_time1 = '';
        let p_end_time1 = '';
        let p_meal_1 = '';
        let p_start_time2 = '';
        let p_end_time2 = '';
        let p_meal_2 = '';

        const item = this.state.arrayAddTime.filter(item => item.no == no)[0];
        if (!!item) {
            if ((item.fromDateTime != '-- : --' && item.toDateTime != '-- : --') && (item.fromDateTime1 != '-- : --' && item.toDateTime1 != '-- : --')) {

                p_start_time1 = item.fromDateTime;
                p_end_time1 = item.toDateTime;
                item.eat ? p_meal_1 = 'Y' : null;
                p_start_time2 = item.fromDateTime1;
                p_end_time2 = item.toDateTime1;
                item.eat1 ? p_meal_2 = 'Y' : null;

            } else if (item.fromDateTime != '-- : --' && item.toDateTime != '-- : --') {

                p_start_time1 = item.fromDateTime;
                p_end_time1 = item.toDateTime;
                item.eat ? p_meal_1 = 'Y' : null;

            } else if (item.fromDateTime1 != '-- : --' && item.toDateTime1 != '-- : --') {

                p_start_time2 = item.fromDateTime1;
                p_end_time2 = item.toDateTime1;
                item.eat1 ? p_meal_2 = 'Y' : null;

            }
        }

        let P_APPROVE_STATUS = '';
        let P_APPROVE_DATE = '';
        let P_ARPPOVE_BY_PK = '';
        let P_APPROVE_BY_NAME = '';
        let P_APPROVE_NOTE = '';
        let P_HR_APPROVE_YN = '';
        let P_HR_APPROVE_NOTE = '';


        let P_WORK_DT = work_dt;
        let P_THR_EMP_PK = this.state.user_pk;
        let p_crt_by = this.state.full_name;


        let procedure = 'STV_HR_SEL_MBI_MBHRRE007_1'
        let p_action = 'INSERT';
        let P_PK_TABLE = '';
        let para = '';

        // para = `${p_action}|${P_PK_TABLE}|${P_OTXN_NLD}|${P_REASON_NLD}|
        //         ${p_start_time1}|${p_end_time1}|${p_start_time2}|${p_end_time2}|
        //         ${P_APPROVE_STATUS}|${P_APPROVE_DATE}|${P_ARPPOVE_BY_PK}|${P_APPROVE_BY_NAME}|${P_APPROVE_NOTE}|${P_HR_APPROVE_YN}|${P_HR_APPROVE_NOTE}|
        //         ${P_WORK_DT}|${P_THR_EMP_PK}|${p_crt_by}`;

        para = `${p_action}|${P_PK_TABLE}|${P_OTXN_NLD}|${P_REASON_NLD}|${p_start_time1}|${p_end_time1}|${p_meal_1}|${p_start_time2}|${p_end_time2}|${p_meal_2}|${P_APPROVE_STATUS}|${P_APPROVE_DATE}|${P_ARPPOVE_BY_PK}|${P_APPROVE_BY_NAME}|${P_APPROVE_NOTE}|${P_HR_APPROVE_YN}|${P_HR_APPROVE_NOTE}|${P_WORK_DT}|${P_THR_EMP_PK}|${p_crt_by}`;
        console.log("para:---------->" + para);

        OnExcute(p_action, procedure, para)
            .then((res) => {
                console.log(res);
                let data_info = res.objcurdatas[0];
                let arrayDataInserted = isThis.state.arrayDataInserted;

                if (data_info.totalrows > 0) {
                    if (data_info.records[0].status == "OK") {
                        arrayDataInserted.push(no);
                        isThis.setState({
                            arrayDataInserted,
                            loading: false
                        });
                        let toast = variables.toastSuccessful;
                        variables.toastSuccessful.text = 'Xác nhận tăng ca thành công!'
                        Toast.show(toast)
                        this.calc();
                    } else {
                        isThis.setState({ loading: false });
                        if (data_info.records[0].error_ex != "") {
                            let toast = variables.toastError;
                            toast.text = data_info.records[0].error_ex || data_info.records[0].rtn_value;
                            Toast.show(toast)
                            return;
                        } else {
                            let toast = variables.toastError;
                            toast.text = 'Xác nhận tăng ca thất bại!'
                            Toast.show(toast)
                            return;
                        }

                    }
                }
                else {
                    isThis.setState({ loading: false });
                    // console.log("Cập nhật thất bại");
                    let toast = variables.toastError;
                    toast.text = 'Cập nhật không thành công!'
                    Toast.show(toast)
                }
            });
    }


    comfirmAlert = (no, work_dt) => {
        let itemTime = this.state.arrayTimeNLD.filter(item => item.no == no)[0];;
        let itemComent = this.state.arrayCommentNLD.filter(item => item.no == no)[0];

        if (itemTime == undefined || itemTime.timeNLD == '') {
            let toast = variables.toastError;
            toast.text = 'Bạn phải nhập giờ tăng ca xác nhận NLD!'
            Toast.show(toast)
            return;
        } else if (itemTime.timeNLD > 24) {
            let toast = variables.toastError;
            toast.text = 'Bạn phải số giờ tăng ca nhỏ hơn 24!'
            Toast.show(toast)
            return;
        }

        if (itemComent == undefined || itemComent.commentNLD == '') {
            let toast = variables.toastError;
            toast.text = 'Bạn phải nhập mô tả công việc đã làm thêm!'
            Toast.show(toast)
            return;
        }

        Alert.alert(
            'Xác nhận tăng ca',
            'Bạn có chắc chắn muốn xác nhận?',
            [
                { text: 'Hủy', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: 'OK', onPress: async () => { this.updateExperience(no, work_dt, itemTime.timeNLD, itemComent.commentNLD) }
                },
            ],
            { cancelable: false }
        )
    }

    calc() {
        this.props.callback({ arrayDataInserted: this.state.arrayDataInserted });
    }

    renderRow = ({ item, index }) => {
        let arrayDataInserted = this.state.arrayDataInserted;
        let timeNLD = this.state.arrayTimeNLD.filter(item1 => item1.no == item.no)[0];
        let commentNLD = this.state.arrayCommentNLD.filter(item1 => item1.no == item.no)[0];

        return (
            <View
                style={{
                    marginHorizontal: 10, margin: 5, borderRadius: 8, paddingRight: 10, paddingTop: 5, paddingBottom: 7
                    /* backgroundColor: index % 2 == 0 ? variables.cardCustomBg0 : variables.cardCustomBg1,*/,
                    backgroundColor: 'white'
                }}>
                <View style={styles.cart, { borderBottomWidth: 0.5, borderColor: 'gray', paddingBottom: 5, marginBottom: 7, marginLeft: 5 }}>
                    <Text style={[styles.textCartHeder, { marginTop: 0, paddingTop: 0, alignSelf: 'flex-start' }]}>Ngày: <Text style={[styles.textCart1Value, { color: variables.textValue }]}>{moment(item.work_dt).format('DD-MM-YYYY')} ({Number.isInteger(parseInt(item.work_dt)) ? `Thứ ${item.day_type}` : `${item.day_type}`})</Text></Text>
                    {/* <Text style={[styles.textCartHeder, { marginTop: 0, paddingTop: 0, position: 'absolute', right: 0, color: variables.backgroundColorTV  }]}>{item.emp_pk}</Text> */}
                    {/* <Text style={[styles.textCartHeder, { marginTop: 0, paddingTop: 0, position: 'absolute', right: 0, color: variables.backgroundColorTV  }]}>{item.day_type}</Text> */}
                </View>

                <View style={{ borderWidth: 0.7, borderColor: '#d9e1e8', borderRadius: 10, marginLeft: 5 }}>
                    <View style={[styles.cart1, { borderTopWidth: 0 }]}>
                        <Left>
                            <Text style={styles.textCart1}>Ca làm việc: </Text>
                        </Left>
                        <Right style={styles.borderLeft}>
                            <Text style={[styles.textCart1Value, {}]}>{item.shift}</Text>
                        </Right>
                    </View>

                    <View style={styles.cart1}>
                        <Left>
                            <Text style={styles.textCart1}>Giờ vào(<IconAntDesign style={{ fontWeight: '1000', color: variables.textValue }} name='login' />)<IconAntDesign style={{ fontWeight: '1000' }} name='arrowright' />ra(<IconAntDesign style={{ fontWeight: '1000', color: variables.textValue }} name='logout' />): </Text>
                        </Left>
                        <Right style={styles.borderLeft}>
                            <Text style={[styles.textCart1Value, {}]}>
                                <IconAntDesign style={{ fontWeight: '1000', }} name='login'></IconAntDesign> {item.time_in} | <IconAntDesign style={{ fontWeight: '1000', }} name='logout'></IconAntDesign> {item.time_out != '' ? item.time_out : `--:--`}
                            </Text>
                        </Right>
                    </View>

                    <View style={styles.cart1}>
                        <Left>
                            <Text style={styles.textCart1}>Giờ làm việc: </Text>
                        </Left>
                        <Right style={styles.borderLeft}>
                            <Text style={[styles.textCart1Value, {}]}>{item.gio_lv}</Text>
                        </Right>
                    </View>

                    <View style={styles.cart1}>
                        <Left>
                            <Text style={styles.textCart1}>Giờ tăng ca: </Text>
                        </Left>
                        <Right style={styles.borderLeft}>
                            <Text style={[styles.textCart1Value, {}]}>{item.ot_tt}</Text>
                        </Right>
                    </View>

                    <View style={styles.cart1}>
                        <Left style={[, { borderRightColor: '#d9e1e8', borderRightWidth: 0.8 }]}>
                            <Text style={[styles.textCart1, {}]}>Giờ tăng ca xác nhận (NLD): </Text>
                        </Left>
                        {item.otxn_nld != '' ?
                            <Right style={[, {}]}>
                                <Text style={[styles.textCart1Value, {}]}>{item.otxn_nld}</Text>
                            </Right>
                            :
                            <Right style={[, {}]}>
                                <View style={{ width: '70%', marginRight: 5 }}>
                                    <TextInput1
                                        ref={input => { this.textInput = input }}
                                        mode='outlined'
                                        fontStyle={arrayDataInserted.includes(item.no) ? 'italic' : 'normal'}
                                        style={[, {
                                            fontStyle: arrayDataInserted.includes(item.no) ? 'italic' : 'normal',
                                            color: variables.textValue, width: '100%',
                                            height: 30,
                                        }]}
                                        label='Nhập số giờ ...'
                                        keyboardType="decimal-pad"
                                        error={!!timeNLD ? false : true}
                                        editable={arrayDataInserted.includes(item.no) ? false : true}
                                        onChangeText={(numberTimeNLD) => {
                                            this.onChangeNumberTimeNLD(item.no, numberTimeNLD);

                                            let { numberInputs } = this.state;
                                            numberInputs[index] = numberTimeNLD;
                                            this.setState({ numberInputs });
                                        }}
                                        value={this.state.numberInputs[index]}
                                        theme={{
                                            colors: {
                                                // placeholder: variables.backgroundColorTV,
                                                text: variables.textValue, primary: variables.textValue,
                                                underlineColor: variables.backgroundColorTV, background: '#ffff'
                                            }
                                        }}
                                    />
                                </View>
                            </Right>
                        }
                    </View>

                    <View style={styles.cart1}>
                        <View style={[styles.textAreaContainer, {}]} >
                            <TextInput1
                                mode='outlined'
                                fontStyle={arrayDataInserted.includes(item.no) ? 'italic' : 'normal'}
                                style={[styles.textArea, {
                                    fontStyle: arrayDataInserted.includes(item.no) ? 'italic' : 'normal',
                                    color: variables.textValue,
                                }]}
                                underlineColorAndroid="transparent"
                                placeholder="Nhập công việc làm thêm ..."
                                label='Nhập công việc làm thêm ...'
                                error={!!commentNLD ? false : true}
                                numberOfLines={3}
                                multiline={true}
                                editable={arrayDataInserted.includes(item.no) ? false : true}
                                onChangeText={(commentNLD) => {
                                    this.onChangeComentTimeNLD(item.no, commentNLD);

                                    let { commnetInputs } = this.state;
                                    commnetInputs[index] = commentNLD;
                                    this.setState({ commnetInputs });
                                }}
                                value={this.state.commnetInputs[index]}
                                theme={{
                                    colors: {
                                        // placeholder: variables.backgroundColorTV,
                                        text: variables.textValue, primary: variables.textValue,
                                        underlineColor: variables.backgroundColorTV, background: '#ffff'
                                    }
                                }}
                                baseColor={variables.textValue}
                                labelFontSize={variables.textValue}
                            />
                        </View>
                    </View>

                    <View style={[styles.cart1, {}]}>
                        <Left style={{ borderRightWidth: 0.5, borderRightColor: '#EEEEEE', paddingVertical: 6, alignItems: 'center' }}>
                            <Button
                                disabled={arrayDataInserted.includes(item.no) ? true : false}
                                icon={
                                    <View style={{ flexDirection: 'row' }}>
                                        <Icon name="ios-add"
                                            style={[GlobalStyles.iconHeader, { fontSize: 18, marginHorizontal: 4, marginBottom: '2%', height: '100%', marginTop: 2 }]}>
                                        </Icon>
                                        {
                                            !!this.state.arrayAddTime ?
                                                this.state.arrayAddTime.map((item1, index) => {
                                                    return (
                                                        item1.no == item.no ?
                                                            <Badge key={index} value={
                                                                (item1.fromDateTime != '-- : --') && (item1.fromDateTime1 != '-- : --') ? 2
                                                                    : (item1.fromDateTime != '-- : --') || (item1.fromDateTime1 != '-- : --') ? 1
                                                                        : null
                                                            } status="warning" textStyle={{ fontSize: 12, fontWeight: '600', color: 'red', }} containerStyle={{ justifyContent: 'center', }} />
                                                            : null
                                                    )
                                                }) : null
                                        }
                                    </View>
                                }
                                onPress={() => this.showDialog(item.no, item.work_dt, item.day_type)}
                                // iconContainerStyle={{ marginLeft: 15, paddingLeft: 15 }}
                                buttonStyle={{ height: 33, backgroundColor: '#3391f7c9' }}
                                raised
                                iconRight
                                loading={false}
                                title={'Thêm khung giờ'}
                                titleStyle={{ fontSize: 12, fontWeight: '600', }}

                            />
                        </Left>
                        <Right style={{ alignItems: 'center' }}>
                            <Button
                                disabled={arrayDataInserted.includes(item.no) ? true : false}
                                icon={
                                    <Icon
                                        style={[GlobalStyles.iconHeader, { fontSize: 22, marginLeft: 5, marginBottom: '8%', height: '100%' }]}
                                        name="ios-checkmark"
                                    />
                                }
                                onPress={() => { this.comfirmAlert(item.no, item.work_dt) }}
                                // iconContainerStyle={{ marginLeft: 15, paddingLeft: 15 }}
                                buttonStyle={{ height: 33, backgroundColor: variables.backgroundColorTV }}
                                raised
                                iconRight
                                loading={false}
                                title="Xác nhận "
                                titleStyle={{ fontSize: 12, fontWeight: '600', }}
                            />
                        </Right>
                    </View>

                </View>
            </View>
        )
    }

    handleLoadMore = (lengthDataProps) => {
        let data = this.state.data;
        const lengthDataState = this.state.data.length;
        if (lengthDataState < lengthDataProps) {
            // console.warn('a')
            data = data.concat(this.props.data.slice(lengthDataState, lengthDataState + 3));
            this.setState({ data });
        }
    }

    toggleCheckbox() {
        this.setState({ checkEat: !this.state.checkEat });
    }

    toggleCheckbox1() {
        this.setState({ checkEat1: !this.state.checkEat1 });
    }

    render() {
        let lengthDataProps = this.props.data.length;
        return (
            <Container>
                <Loader loading={this.state.loading} />
                {lengthDataProps > 0 ?
                    <View>
                        <View style={[GlobalStyles.row, { flex: 0, }]}>
                            <View style={[GlobalStyles.rowLeft, { marginLeft: '3%' }]}>
                                <Text style={[styles.textCart, {}]} >
                                    Tổng số dòng: <Text style={[styles.textCart, { color: variables.textValue }]}>{lengthDataProps}</Text></Text>
                            </View>
                        </View>
                    </View>
                    :
                    <View style={{}}>
                        <View style={[styles.cart, { backgroundColor: variables.cardCustomBg0, }]}>
                            <Text style={{
                                marginTop: '10%', flex: 2, paddingBottom: '10%',
                                textAlign: 'center', color: variables.textValue, fontWeight: 'bold',
                                fontSize: 17
                            }}>{variables.textNullValue}</Text>
                        </View>
                    </View>
                }

                <FlatList style={[{ flex: 1, backgroundColor: lengthDataProps > 0 ? variables.cardCustomBg0 : 'white' }]}
                    extraData={this.state}
                    data={this.state.data}
                    keyExtractor={(item, index) => { item.pk }}
                    renderItem={this.renderRow}
                    onEndReached={() => this.handleLoadMore(lengthDataProps)}
                    onEndReachedThreshold={0.5}
                />

                <Modal
                    animationType='fade'
                    transparent={true}
                    presentationStyle={'overFullScreen'}
                    visible={this.state.isModalOpen}
                // onRequestClose={() => { this.setState({ isModalOpen: false }) }}
                >
                    <View style={styles.container}>
                        <View style={[styles.modalBackground, { borderRadius: 5, marginHorizontal: '4%', }]}>
                            <View style={styles.cart, { borderBottomWidth: 0.5, borderColor: 'gray', paddingBottom: 5, marginBottom: 7, marginLeft: 5 }}>
                                <Text style={[styles.textCartHeder, { alignSelf: 'flex-start' }]}>Ngày: <Text style={[styles.textCart1Value, { color: variables.textValue }]}>{moment(this.state.work_dt).format('DD-MM-YYYY')} ({Number.isInteger(parseInt(this.state.work_dt)) ? `Thứ ${this.state.day_type}` : `${this.state.day_type}`})</Text></Text>
                            </View>

                            <View style={{ borderWidth: 0.7, borderColor: '#d9e1e8', borderRadius: 10, }}>
                                <View style={[styles.cart1, { borderTopWidth: 0, borderBottomWidth: 1, }]}>
                                    <Body style={{ flexDirection: 'row', justifyContent: 'center', flex: 0.9 }}>
                                        <Text style={styles.textCart1, { fontWeight: 'bold', paddingVertical: 5, }}>Khung giờ 1</Text>
                                    </Body>
                                    <Right style={{ flex: 0.1 }}>
                                        <TouchableOpacity onPress={() => this.clearTimeFollowNo(this.state.no, 'time01')} style={{ justifyContent: 'flex-end', marginRight: 13 }}>
                                            <Icon style={[GlobalStyles.iconHeader, { paddingHorizontal: 4, fontSize: 17, borderColor: 'gray', borderWidth: 0.7, borderRadius: 5, backgroundColor: '#FA383E', overflow: 'hidden', marginTop: 2 }]} name="close" />
                                        </TouchableOpacity>
                                    </Right>
                                </View>

                                <View style={styles.cart1}>
                                    <Left style={{ flex: 0.25 }}>
                                        <Text style={styles.textCart1}>Từ giờ: </Text>
                                    </Left>

                                    <Right style={[styles.borderLeft, { flex: 0.75, paddingVertical: 8, }]}>

                                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                                            <TouchableOpacity onPress={() => this.setState({ startTimePickerVisible: true })} style={{ flexDirection: 'row', }}>
                                                <Icon style={[GlobalStyles.iconHeader, { color: variables.textValue, paddingHorizontal: 5, fontSize: 21, }]} name="clock" />
                                                <Text style={[styles.textCart1Value, { marginRight: 0 }]}>{this.state.dt_fromtime}</Text>
                                                <Icon style={[GlobalStyles.iconHeader, { marginRight: 2, color: variables.textValue, fontSize: 18, paddingTop: 3, marginHorizontal: 2 }]} name="arrow-dropdown" />
                                            </TouchableOpacity>
                                            <Text style={{ fontWeight: 'bold', color: 'gray', }}> | </Text>
                                            <TouchableOpacity onPress={() => this.setState({ startDatePickerVisible: true })} style={{ flexDirection: 'row', }}>
                                                <Icon style={[GlobalStyles.iconHeader, { color: variables.textValue, paddingHorizontal: 5, fontSize: 21, }]} name="calendar" />
                                                <Text style={[styles.textCart1Value, { marginRight: 0 }]}>{!!this.state.dt_fromdate ? this.state.dt_fromdate : moment(this.state.work_dt).format('DD-MM-YYYY')}</Text>
                                                <Icon style={[GlobalStyles.iconHeader, { marginRight: 5, color: variables.textValue, fontSize: 18, paddingTop: 4, marginHorizontal: 2 }]} name="arrow-dropdown" />
                                            </TouchableOpacity>

                                        </View>

                                        <DateTimePicker
                                            cancelTextIOS='Hủy bỏ'
                                            confirmTextIOS='Xác nhận'
                                            cancelTextStyle={{ color: 'red' }}
                                            confirmTextStyle={{ color: variables.backgroundColorTV }}
                                            hideTitleContainerIOS={false}
                                            titleIOS='Từ giờ (Khung giờ 1)'
                                            titleStyle={{ color: variables.textValue, fontWeight: 'bold' }}
                                            is24Hour={true}
                                            locale="vi_VN"
                                            date={new Date()}
                                            isVisible={this.state.startTimePickerVisible}
                                            onConfirm={(time) => this.handleStartTimePicked(time, 'from0')}
                                            onCancel={() => this.setState({ startTimePickerVisible: false })}
                                            mode={'time'}
                                            datePickerModeAndroid={'calendar'}
                                        />

                                        <DateTimePicker
                                            cancelTextIOS='Hủy bỏ'
                                            confirmTextIOS='Xác nhận'
                                            cancelTextStyle={{ color: 'red' }}
                                            confirmTextStyle={{ color: variables.backgroundColorTV }}
                                            hideTitleContainerIOS={false}
                                            titleIOS='Từ ngày (Khung giờ 1)'
                                            titleStyle={{ color: variables.textValue, fontWeight: 'bold' }}
                                            is24Hour={true}
                                            locale="vi_VN"
                                            date={new Date(moment(this.state.work_dt).format('YYYY-MM-DD'))}
                                            // minimumDate={new Date()}
                                            isVisible={this.state.startDatePickerVisible}
                                            onConfirm={(data) => this.handleStartDatePicked(data, 'from0')}
                                            onCancel={() => this.setState({ startDatePickerVisible: false })}
                                            mode={'date'}
                                            datePickerModeAndroid={'calendar'}
                                        />
                                    </Right>


                                </View>

                                <View style={styles.cart1}>
                                    <Left style={{ flex: 0.25 }}>
                                        <Text style={styles.textCart1}>Đến giờ: </Text>
                                    </Left>

                                    <Right style={[styles.borderLeft, { flex: 0.75, paddingVertical: 8, }]}>
                                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                                            <TouchableOpacity onPress={() => this.setState({ endTimePickerVisible: true })} style={{ flexDirection: 'row', }}>
                                                <Icon style={[GlobalStyles.iconHeader, { color: variables.textValue, paddingHorizontal: 5, fontSize: 21, }]} name="clock" />
                                                <Text style={[this.state.dt_totime != '--:--' ? styles.textCart1Value : null, { marginRight: 0 }]}>{this.state.dt_totime}</Text>
                                                <Icon style={[GlobalStyles.iconHeader, { marginRight: 2, color: variables.textValue, fontSize: 18, paddingTop: 3, marginHorizontal: 2 }]} name="arrow-dropdown" />
                                            </TouchableOpacity>
                                            <Text style={{ fontWeight: 'bold', color: 'gray', }}> | </Text>
                                            <TouchableOpacity onPress={() => this.setState({ endDatePickerVisible: true })} style={{ flexDirection: 'row', }}>
                                                <Icon style={[GlobalStyles.iconHeader, { color: variables.textValue, paddingHorizontal: 5, fontSize: 21, }]} name="calendar" />
                                                <Text style={[styles.textCart1Value, { marginRight: 0 }]}>{!!this.state.dt_todate ? this.state.dt_todate : moment(this.state.work_dt).format('DD-MM-YYYY')}</Text>
                                                <Icon style={[GlobalStyles.iconHeader, { marginRight: 5, color: variables.textValue, fontSize: 18, paddingTop: 4, marginHorizontal: 2 }]} name="arrow-dropdown" />
                                            </TouchableOpacity>
                                        </View>

                                        <DateTimePicker
                                            cancelTextIOS='Hủy bỏ'
                                            confirmTextIOS='Xác nhận'
                                            cancelTextStyle={{ color: 'red' }}
                                            confirmTextStyle={{ color: variables.backgroundColorTV }}
                                            hideTitleContainerIOS={false}
                                            titleIOS='Đến giờ (Khung giờ 1)'
                                            titleStyle={{ color: variables.textValue, fontWeight: 'bold' }}
                                            is24Hour={true}
                                            locale="vi_VN"
                                            date={new Date()}
                                            isVisible={this.state.endTimePickerVisible}
                                            onConfirm={(time) => this.handleEndTimePicked(time, 'to0')}
                                            onCancel={() => this.setState({ endTimePickerVisible: false })}
                                            mode={'time'}
                                            datePickerModeAndroid={'calendar'}
                                        />

                                        <DateTimePicker
                                            cancelTextIOS='Hủy bỏ'
                                            confirmTextIOS='Xác nhận'
                                            cancelTextStyle={{ color: 'red' }}
                                            confirmTextStyle={{ color: variables.backgroundColorTV }}
                                            hideTitleContainerIOS={false}
                                            titleIOS='Đến ngày (Khung giờ 1)'
                                            titleStyle={{ color: variables.textValue, fontWeight: 'bold' }}
                                            is24Hour={true}
                                            locale="vi_VN"
                                            date={new Date(moment(this.state.work_dt).format('YYYY-MM-DD'))}
                                            // minimumDate={new Date()}
                                            isVisible={this.state.endDatePickerVisible}
                                            onConfirm={(data) => this.handleEndDatePicked(data, 'to0')}
                                            onCancel={() => this.setState({ endDatePickerVisible: false })}
                                            mode={'date'}
                                            datePickerModeAndroid={'calendar'}
                                        />
                                    </Right>
                                </View>

                                <View style={[styles.cart1, { justifyContent: 'flex-end', paddingRight: 5 }]}>
                                    <CheckBox
                                        size={25}
                                        checkedColor={variables.textValue}
                                        containerStyle={{
                                            paddingTop: 0, paddingLeft: 0, paddingRight: 0, paddingBottom: 0,
                                            marginRight: 0,
                                        }}
                                        onPress={() => this.toggleCheckbox()}
                                        checked={this.state.checkEat}
                                    />
                                    <TouchableOpacity onPress={() => { this.toggleCheckbox() }} style={{ alignSelf: 'center' }}>
                                        <Text style={[styles.textCart1Value, {}]}>Ăn ca 1</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>


                            <View style={GlobalStyles.space}></View>


                            <View style={{ borderWidth: 0.7, borderColor: '#d9e1e8', borderRadius: 10, }}>
                                <View style={[styles.cart1, { borderTopWidth: 0, borderBottomWidth: 1, }]}>
                                    <Body style={{ flexDirection: 'row', justifyContent: 'center', flex: 0.9 }}>
                                        <Text style={styles.textCart1, { fontWeight: 'bold', paddingVertical: 5, }}>Khung giờ 2</Text>
                                    </Body>
                                    <Right style={{ flex: 0.1 }}>
                                        <TouchableOpacity onPress={() => this.clearTimeFollowNo(this.state.no, 'time02')} style={{ justifyContent: 'flex-end', marginRight: 13 }}>
                                            <Icon style={[GlobalStyles.iconHeader, { paddingHorizontal: 4, fontSize: 17, borderColor: 'gray', borderWidth: 0.7, borderRadius: 5, backgroundColor: '#FA383E', overflow: 'hidden', marginTop: 2 }]} name="close" />
                                        </TouchableOpacity>
                                    </Right>
                                </View>

                                <View style={styles.cart1}>
                                    <Left style={{ flex: 0.25 }}>
                                        <Text style={styles.textCart1}>Từ giờ: </Text>
                                    </Left>

                                    <Right style={[styles.borderLeft, { flex: 0.75, paddingVertical: 8, }]}>
                                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                                            <TouchableOpacity onPress={() => this.setState({ startTimePickerVisible1: true })} style={{ flexDirection: 'row', }}>
                                                <Icon style={[GlobalStyles.iconHeader, { color: variables.textValue, paddingHorizontal: 5, fontSize: 21, }]} name="clock" />
                                                <Text style={[styles.textCart1Value, { marginRight: 0 }]}>{this.state.dt_fromtime1}</Text>
                                                <Icon style={[GlobalStyles.iconHeader, { marginRight: 2, color: variables.textValue, fontSize: 18, paddingTop: 3, marginHorizontal: 2 }]} name="arrow-dropdown" />
                                            </TouchableOpacity>
                                            <Text style={{ fontWeight: 'bold', color: 'gray', }}> | </Text>
                                            <TouchableOpacity onPress={() => this.setState({ startDatePickerVisible1: true })} style={{ flexDirection: 'row', }}>
                                                <Icon style={[GlobalStyles.iconHeader, { color: variables.textValue, paddingHorizontal: 5, fontSize: 21, }]} name="calendar" />
                                                <Text style={[styles.textCart1Value, { marginRight: 0 }]}>{!!this.state.dt_fromdate1 ? this.state.dt_fromdate1 : moment(this.state.work_dt).format('DD-MM-YYYY')}</Text>
                                                <Icon style={[GlobalStyles.iconHeader, { marginRight: 5, color: variables.textValue, fontSize: 18, paddingTop: 4, marginHorizontal: 2 }]} name="arrow-dropdown" />
                                            </TouchableOpacity>
                                        </View>

                                        <DateTimePicker
                                            cancelTextIOS='Hủy bỏ'
                                            confirmTextIOS='Xác nhận'
                                            cancelTextStyle={{ color: 'red' }}
                                            confirmTextStyle={{ color: variables.backgroundColorTV }}
                                            hideTitleContainerIOS={false}
                                            titleIOS='Từ giờ (Khung giờ 2)'
                                            titleStyle={{ color: variables.textValue, fontWeight: 'bold' }}
                                            is24Hour={true}
                                            locale="vi_VN"
                                            date={new Date()}
                                            isVisible={this.state.startTimePickerVisible1}
                                            onConfirm={(time) => this.handleStartTimePicked(time, 'from1')}
                                            onCancel={() => this.setState({ startTimePickerVisible1: false })}
                                            mode={'time'}
                                            datePickerModeAndroid={'calendar'}
                                        />

                                        <DateTimePicker
                                            cancelTextIOS='Hủy bỏ'
                                            confirmTextIOS='Xác nhận'
                                            cancelTextStyle={{ color: 'red' }}
                                            confirmTextStyle={{ color: variables.backgroundColorTV }}
                                            hideTitleContainerIOS={false}
                                            titleIOS='Từ ngày (Khung giờ 2)'
                                            titleStyle={{ color: variables.textValue, fontWeight: 'bold' }}
                                            is24Hour={true}
                                            locale="vi_VN"
                                            date={new Date(moment(this.state.work_dt).format('YYYY-MM-DD'))}
                                            // minimumDate={new Date()}
                                            isVisible={this.state.startDatePickerVisible1}
                                            onConfirm={(data) => this.handleStartDatePicked(data, 'from1')}
                                            onCancel={() => this.setState({ startDatePickerVisible1: false })}
                                            mode={'date'}
                                            datePickerModeAndroid={'calendar'}
                                        />
                                    </Right>
                                </View>

                                <View style={styles.cart1}>
                                    <Left style={{ flex: 0.25 }}>
                                        <Text style={styles.textCart1}>Đến giờ: </Text>
                                    </Left>

                                    <Right style={[styles.borderLeft, { flex: 0.75, paddingVertical: 8, }]}>
                                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                                            <TouchableOpacity onPress={() => this.setState({ endTimePickerVisible1: true })} style={{ flexDirection: 'row', }}>
                                                <Icon style={[GlobalStyles.iconHeader, { color: variables.textValue, paddingHorizontal: 5, fontSize: 21, }]} name="clock" />
                                                <Text style={[this.state.dt_totime != '--:--' ? styles.textCart1Value : null, { marginRight: 0 }]}>{this.state.dt_totime1}</Text>
                                                <Icon style={[GlobalStyles.iconHeader, { marginRight: 2, color: variables.textValue, fontSize: 18, paddingTop: 3, marginHorizontal: 2 }]} name="arrow-dropdown" />
                                            </TouchableOpacity>
                                            <Text style={{ fontWeight: 'bold', color: 'gray', }}> | </Text>
                                            <TouchableOpacity onPress={() => this.setState({ endDatePickerVisible1: true })} style={{ justifyContent: 'center', flexDirection: 'row', }}>
                                                <Icon style={[GlobalStyles.iconHeader, { color: variables.textValue, paddingHorizontal: 5, fontSize: 21, }]} name="calendar" />
                                                <Text style={[styles.textCart1Value, { marginRight: 0 }]}>{!!this.state.dt_todate1 ? this.state.dt_todate1 : moment(this.state.work_dt).format('DD-MM-YYYY')}</Text>
                                                <Icon style={[GlobalStyles.iconHeader, { marginRight: 5, color: variables.textValue, fontSize: 18, paddingTop: 4, marginHorizontal: 2 }]} name="arrow-dropdown" />
                                            </TouchableOpacity>
                                        </View>

                                        <DateTimePicker
                                            cancelTextIOS='Hủy bỏ'
                                            confirmTextIOS='Xác nhận'
                                            cancelTextStyle={{ color: 'red' }}
                                            confirmTextStyle={{ color: variables.backgroundColorTV }}
                                            hideTitleContainerIOS={false}
                                            titleIOS='Đến giờ (Khung giờ 2)'
                                            titleStyle={{ color: variables.textValue, fontWeight: 'bold' }}
                                            is24Hour={true}
                                            locale="vi_VN"
                                            date={new Date()}
                                            isVisible={this.state.endTimePickerVisible1}
                                            onConfirm={(time) => this.handleEndTimePicked(time, 'to1')}
                                            onCancel={() => this.setState({ endTimePickerVisible1: false })}
                                            mode={'time'}
                                            datePickerModeAndroid={'calendar'}
                                        />

                                        <DateTimePicker
                                            cancelTextIOS='Hủy bỏ'
                                            confirmTextIOS='Xác nhận'
                                            cancelTextStyle={{ color: 'red' }}
                                            confirmTextStyle={{ color: variables.backgroundColorTV }}
                                            hideTitleContainerIOS={false}
                                            titleIOS='Đến ngày (Khung giờ 2)'
                                            titleStyle={{ color: variables.textValue, fontWeight: 'bold' }}
                                            is24Hour={true}
                                            locale="vi_VN"
                                            date={new Date(moment(this.state.work_dt).format('YYYY-MM-DD'))}
                                            // minimumDate={new Date()}
                                            isVisible={this.state.endDatePickerVisible1}
                                            onConfirm={(data) => this.handleEndDatePicked(data, 'to1')}
                                            onCancel={() => this.setState({ endDatePickerVisible1: false })}
                                            mode={'date'}
                                            datePickerModeAndroid={'calendar'}
                                        />
                                    </Right>
                                </View>

                                <View style={[styles.cart1, { justifyContent: 'flex-end', paddingRight: 5 }]}>
                                    <CheckBox
                                        size={25}
                                        checkedColor={variables.textValue}
                                        containerStyle={{
                                            paddingTop: 0, paddingLeft: 0, paddingRight: 0, paddingBottom: 0,
                                            marginRight: 0,
                                        }}
                                        onPress={() => this.toggleCheckbox1()}
                                        checked={this.state.checkEat1}
                                    />
                                    <TouchableOpacity onPress={() => { this.toggleCheckbox1() }} style={{ alignSelf: 'center' }}>
                                        <Text style={[styles.textCart1Value, {}]}>Ăn ca 2</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>


                            <View style={GlobalStyles.spaceSmall}></View>
                            <View style={[styles.cart1, { marginVertical: 10, borderTopWidth: 0 }]}>

                                <Right style={[, { flex: 0.5, }]}>
                                    <View style={[, { aalignContent: 'center', alignSelf: 'center', }]}>
                                        <Button
                                            icon={
                                                <Icon
                                                    style={[GlobalStyles.iconHeader, { fontSize: 22, marginLeft: 5, marginBottom: '8%', height: '100%' }]}
                                                    name="ios-close"
                                                />
                                            }
                                            onPress={() => {
                                                this.setState({
                                                    isModalOpen: false,

                                                    dt_fromtime: '-- : --',
                                                    dt_totime: '-- : --',
                                                    dt_fromdate: '',
                                                    dt_todate: '',

                                                    dt_fromtime1: '-- : --',
                                                    dt_totime1: '-- : --',
                                                    dt_fromdate1: '',
                                                    dt_todate1: '',
                                                })
                                            }}
                                            iconContainerStyle={{ marginLeft: 15, paddingLeft: 15 }}
                                            buttonStyle={{ height: 33, backgroundColor: '#FA383E' }}
                                            raised
                                            iconRight
                                            loading={false}
                                            title="Hủy"
                                            titleStyle={{ fontSize: 12, fontWeight: '600', marginTop: 0, paddingTop: 0, marginBottom: 0, paddingBottom: 0 }}
                                        />
                                    </View>
                                </Right>
                                <Right style={[, { flex: 0.5 }]}>
                                    <View style={[, { alignContent: 'center', alignSelf: 'center' }]}>
                                        <Button
                                            icon={
                                                <Icon
                                                    style={[GlobalStyles.iconHeader, { fontSize: 18, marginLeft: 5, marginBottom: '8%', height: '100%' }]}
                                                    name="ios-add"
                                                />
                                            }
                                            onPress={() => {
                                                this.addTime(
                                                    this.state.no,
                                                    this.state.dt_fromtime, this.state.dt_totime, this.state.dt_fromdate == '' ? moment(this.state.work_dt, 'YYYYMMDD').format('DD-MM-YYYY') : this.state.dt_fromdate, this.state.dt_todate == '' ? moment(this.state.work_dt, 'YYYYMMDD').format('DD-MM-YYYY') : this.state.dt_todate,
                                                    this.state.dt_fromtime1, this.state.dt_totime1, this.state.dt_fromdate1 == '' ? moment(this.state.work_dt, 'YYYYMMDD').format('DD-MM-YYYY') : this.state.dt_fromdate1, this.state.dt_todate1 == '' ? moment(this.state.work_dt, 'YYYYMMDD').format('DD-MM-YYYY') : this.state.dt_todate1)
                                            }}
                                            iconContainerStyle={{ marginLeft: 15, paddingLeft: 15 }}
                                            buttonStyle={{ height: 33, backgroundColor: variables.backgroundColorTV }}
                                            raised
                                            iconRight
                                            loading={false}
                                            title="Thêm"
                                            titleStyle={{ fontSize: 12, fontWeight: '600', marginTop: 0, paddingTop: 0, marginBottom: 0, paddingBottom: 0 }}
                                        />
                                    </View>
                                </Right>
                            </View>
                        </View>


                    </View>
                </Modal>

            </Container>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    modalBackground: {
        backgroundColor: 'white',
        padding: 10
    },

    cart1: {
        flexDirection: 'row',
        borderTopWidth: 0.5,
        borderColor: '#d9e1e8',
        //marginLeft: 10,
        // marginRight: 10,
    },
    textCart1: {
        marginLeft: 10,
        marginRight: 10,
        paddingTop: 3,
        paddingBottom: 3,
        //fontWeight: 'bold',
        fontSize: 15,
        fontWeight: '300',
    },
    textCart1Value: {
        //marginLeft: 10,
        marginRight: 5,
        paddingTop: 3,
        paddingBottom: 3,
        fontWeight: 'bold',
        fontSize: 15,
        //fontWeight: '300',
        color: variables.textValue
    },
    cart: {
        flexDirection: 'row',
    },
    textCart: {
        marginTop: 1,
        marginBottom: 1,
        //fontWeight: 'bold',
        fontSize: 14.5,
        fontWeight: '300',
    },
    textCartHeder: {
        marginTop: 0,
        marginBottom: 0,
        textAlign: 'center',
        color: 'black',
        //fontWeight: 'bold',
        fontSize: 15,
    },

    textAreaContainer: {
        //borderColor: variables.textValue,
        //borderWidth: 1,
        // padding: 5,
        width: '92.2%',
        marginVertical: 5,
        marginHorizontal: 15,
        justifyContent: "center"
    },
    textArea: {
        height: 50,
        //justifyContent: "flex-start"
    },

    borderLeft: {
        borderLeftColor: '#d9e1e8', borderLeftWidth: 0.8
    }
});
