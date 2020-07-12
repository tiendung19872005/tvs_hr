import React, { Component } from "react";
import { AppRegistry, View, Image, StatusBar, StyleSheet, TouchableWithoutFeedback, Platform, Dimensions, TouchableOpacity, Modal, TouchableHighlight } from "react-native";
import {
    Root, Toast, Container, Body, Content, Header, Left, Right, Spinner,
    Icon, Title, Input, dataMonth, Label, Button, Text, StyleProvider, getTheme, MonthBox
} from "native-base";
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import variables from "../../../assets/styles/variables";
import moment from "moment";
import 'moment/locale/vi';
import DefaultPreference from 'react-native-default-preference';
import { OnExcute, getUserInfo, getDataJson } from '../../../services/FetchData';
import Loader from '../../SYS/Loader';
import DateTimePicker from "react-native-modal-datetime-picker";
import MonthSelectorCalendar from 'react-native-month-selector'; //add this import line

class MBHRIN004 extends Component {
    handleButton(navigate) {
        this.props.navigation.navigate(navigate);
    }

    constructor(props) {
        super(props);

        this.state = {
            // txtfull_name: '',
            // tv_emp_id: '',
            tv_org_nm: '',
            tv_position: '',
            tv_join_dt: '',
            tv_left_dt: '',

            tv_probation_salary: '',
            tv_basic_salary: '',
            tv_a1: '',
            tv_a2: '',
            tv_a3: '',
            tv_a4: '',

            tv_a5: '',
            tv_a6: '',
            tv_a7: '',
            tv_a8: '',
            tv_a9: '',
            tv_a10: '',

            tv_working_time: '',
            tv_working_amt: '',
            tv_annual_time: '',
            tv_annual_amt: '',
            tv_absother_time: '',
            tv_absother_amt: '',

            tv_ot_time: '',
            tv_ot_amt: '',
            tv_st_time: '',
            tv_st_amt: '',
            tv_ht_time: '',
            tv_ht_amt: '',

            tv_nt_time: '',
            tv_nt_amt: '',
            tv_ont_time: '',
            tv_ont_amt: '',
            tv_ale_days: '',
            tv_ale_amt: '',

            tv_gross_amt: '',
            tv_ins_amt: '',
            tv_health_amt: '',
            tv_unemp_amt: '',
            tv_deduct_amt: '',
            tv_return_amt: '',

            tv_ottax_amt: '',
            tv_deductpit_amt: '',
            tv_income_amt: '',
            tv_tax_amt: '',
            tv_union_amt: '',
            tv_net_amt: '',

            dataMonth: [],
            loading: false,
            month: moment(),
            isModalOpen: false,

            user_pk: '',
            emp_id: '',
            full_name: '',
        };
        this.onMonthTapped = this.onMonthTapped.bind(this);
        this.getData = this.getData.bind(this);
    }

    componentDidMount = async () => {
        DefaultPreference.getAll().then(async (valueAll) => {
            user_pk = valueAll['user_pk'];
            tv_full_name = valueAll['username'];
            tv_emp_id = valueAll['emp_id'];

            await this.setState({ user_pk: user_pk, emp_id: tv_emp_id, full_name: tv_full_name });
            await this.getData(moment(new Date()).format("YYYYMM"));
        })
    }

    onMonthTapped(month) {
        this.setState({
            month: month
        });
        console.log('daaaaaaa:' + moment(month).format("YYYYMM"))
        this.getData(moment(month).format("YYYYMM"));
    }

    getData(p_work_mon) {
        var that = this;
        this.setState({ loading: true });

        var procedure = "STV_HR_SEL_MBI_MBHRIN004_0";
        var para = that.state.user_pk + "|" + p_work_mon + "|" + that.state.full_name;

        console.log("log para:---------->" + para);
        getDataJson(procedure, para, '1')
            .then((res) => {
                console.log(res);
                var data_info = res.objcurdatas[0];

                if (data_info.totalrows > 0) {
                    that.setState(
                        { dataMonth: data_info.records, loading: false, isModalOpen: false, });
                    //console.log("log state:---------->" + that.state.dataDay);
                } else {
                    that.setState({ dataMonth: [], loading: false, isModalOpen: false, });
                }
            });
    }


    render() {
        const nextIcon = React.createElement(Icon, { name: 'ios-arrow-forward', style: [GlobalStyles.iconHeader, { paddingHorizontal: 20, color: variables.textValue }] });
        const prevIcon = React.createElement(Icon, { name: 'ios-arrow-back', style: [GlobalStyles.iconHeader, { paddingHorizontal: 20, color: variables.textValue }] });
        var dataMonth = this.state.dataMonth[0];
        return (
            <StyleProvider style={getTheme(variables)}>
                <Root>
                    <Container>
                        <Loader loading={this.state.loading} />
                        <View style={{ flexDirection: 'row' }}
                            ref={(ref) => { this.marker = ref }}
                            onLayout={({ nativeEvent }) => {
                                if (this.marker) {
                                    this.marker.measure((x, y, width, height, pageX, pageY) => {
                                        this.setState({ pageX, pageY, heightOfCld: height });
                                    })
                                }
                            }}
                        >
                            <View style={[styles.dropDownDay,]} >
                                <TouchableOpacity success onPress={() => this.setState({ isModalOpen: true })} style={[{ flexDirection: 'row', alignSelf: 'center', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }]} >
                                    <Icon style={[GlobalStyles.iconHeader, { color: 'black', fontSize: 22, color: 'black', marginLeft: 3 }]} name="calendar" />
                                    <Text style={{ marginHorizontal: 'auto', marginVertical: 'auto', marginLeft: 6, marginRight: 6, marginTop: '0.5%', color: 'black', fontSize: 15 }}>Chọn tháng: {moment(this.state.month).format("MM-YYYY")}</Text>
                                    <Icon style={[GlobalStyles.iconHeader, { color: 'black', marginTop: 4 }]} name="arrow-dropdown" />
                                </TouchableOpacity>
                            </View>
                            {/* <Text style={styles.textCartHeder}>00003 - Lê Thị Loan</Text> */}
                        </View>

                        <Modal
                            presentationStyle='overFullScreen'
                            animationType="fade"
                            transparent={true}
                            visible={this.state.isModalOpen}
                            onRequestClose={() => { this.setState({ isModalOpen: false }) }}
                        >
                            <TouchableOpacity
                                style={[styles.container]}
                                activeOpacity={1}
                                onPressOut={() => { this.setState({ isModalOpen: false }) }}
                            >
                                <TouchableWithoutFeedback>
                                    <View style={[styles.modalBackground, { position: 'absolute', top: this.state.pageY + this.state.heightOfCld, left: '2%', borderRadius: 5, width: '85%', }]}>
                                        <MonthSelectorCalendar
                                            nextIcon={nextIcon}
                                            prevIcon={prevIcon}
                                            nextText='Next'
                                            prevText='Prev'
                                            selectedBackgroundColor={variables.backgroundColorTV}
                                            seperatorHeight={1}
                                            monthFormat='M'
                                            seperatorColor='#d9e1e8'
                                            swipable={true}
                                            selectedDate={this.state.month}
                                            currentDate={this.state.month}
                                            initialView={this.state.month}
                                            velocityThreshold={0.1}
                                            directionalOffsetThreshold={60}
                                            gestureIsClickThreshold={3}
                                            yearTextStyle={{ color: variables.backgroundColorTV, fontSize: 14, fontWeight: 'bold' }}
                                            monthTextStyle={{ fontSize: 13, fontWeight: 'bold' }}
                                            currentMonthTextStyle={{ color: variables.textValue, fontWeight: 'bold' }}
                                            localeLanguage='vi'
                                            localeSettings={moment.locale('vi')}
                                            onMonthTapped={this.onMonthTapped}
                                        //onYearChanged={this.onYearChanged}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </TouchableOpacity>
                        </Modal>

                        <View style={styles.cart, { borderTopWidth: 0.5, borderColor: '#d9e1e8', paddingHorizontal: 15, marginTop: 5, paddingBottom: 3 }}>
                            <Text style={[styles.textCartHeder, { alignSelf: 'flex-start', color: 'black' }]}>Tháng làm việc: <Text style={[styles.textCartHeder, { color: variables.textValue, fontWeight: 'bold' }]}>{moment(this.state.month).format("MM-YYYY")}</Text></Text>
                            {/* <Text style={[styles.textCartHeder, { position: 'absolute', right: 15, color: variables.backgroundColorTV  }]}>{this.state.emp_id + ' - ' + this.state.full_name}</Text> */}
                        </View>

                        {dataMonth != null ?
                            <Content style={[, { borderWidth: 0.7, borderColor: '#d9e1e8', borderRadius: 10, marginHorizontal: 10, backgroundColor: '#FFF' }]}>
                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>
                                        <Text style={styles.textCart}>Phòng ban: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtorg_nm}</Text>
                                    </Right>
                                </View>

                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>
                                        <Text style={styles.textCart}>Chức vụ: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.tv_position}</Text>
                                    </Right>
                                </View>

                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>
                                        <Text style={styles.textCart}>Ngày vào: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtjoin_dt}</Text>
                                    </Right>
                                </View>

                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>
                                        <Text style={styles.textCart}>Ngày nghỉ việc: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtleft_dt}</Text>
                                    </Right>
                                </View>

                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>
                                        <Text style={styles.textCart}>Lương thử việc: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtprobation_salary}</Text>
                                    </Right>
                                </View>

                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>
                                        <Text style={styles.textCart}>Lương chính thức: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtbasic_salary}</Text>
                                    </Right>
                                </View>

                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>
                                        <Text style={styles.textCart}>{dataMonth.txta1.substring(0, dataMonth.txta1.indexOf(':') + 1)} </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txta1.substring(dataMonth.txta1.indexOf(':') + 1)}</Text>
                                    </Right>
                                </View>

                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>
                                        <Text style={styles.textCart}>{dataMonth.txta2.substring(0, dataMonth.txta2.indexOf(':') + 1)} </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txta2.substring(dataMonth.txta2.indexOf(':') + 1)}</Text>
                                    </Right>
                                </View>

                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>
                                        <Text style={styles.textCart}>{dataMonth.txta3.substring(0, dataMonth.txta3.indexOf(':') + 1)} </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txta3.substring(dataMonth.txta3.indexOf(':') + 1)}</Text>
                                    </Right>
                                </View>

                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>
                                        <Text style={styles.textCart}>{dataMonth.txta4.substring(0, dataMonth.txta4.indexOf(':') + 1)} </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txta4.substring(dataMonth.txta4.indexOf(':') + 1)}</Text>
                                    </Right>
                                </View>

                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>
                                        <Text style={styles.textCart}>Công làm việc (giờ): </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtworking_time}</Text>
                                    </Right>
                                </View>

                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>
                                        <Text style={styles.textCart}>Tiền ngày công: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtworking_amt}</Text>
                                    </Right>
                                </View>

                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>
                                        <Text style={styles.textCart}>Nghỉ phép năm (giờ): </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtannual_time}</Text>
                                    </Right>
                                </View>

                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>
                                        <Text style={styles.textCart}>Tiền nghỉ phép năm: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtannual_amt}</Text>
                                    </Right>
                                </View>

                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>
                                        <Text style={styles.textCart}>Nghỉ vắng hưởng lương khác: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtabsother_time}</Text>
                                    </Right>
                                </View>


                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>
                                        <Text style={styles.textCart}>Tiền nghỉ vắng khác: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtabsother_amt}</Text>
                                    </Right>
                                </View>


                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>
                                        <Text style={styles.textCart}>Tăng ca ngày thường (giờ): </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtot_time}</Text>
                                    </Right>
                                </View>

                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>
                                        <Text style={styles.textCart}>Tiền tăng ca ngày thường: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtot_amt}</Text>
                                    </Right>
                                </View>


                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>
                                        <Text style={styles.textCart}>Tăng ca ngày chủ nhật (giờ): </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtst_time}</Text>
                                    </Right>
                                </View>

                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>
                                        <Text style={styles.textCart}>Tiền tăng ca ngày chủ nhật: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtst_amt}</Text>
                                    </Right>
                                </View>

                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>
                                        <Text style={styles.textCart}>Tăng ca ngày lễ (giờ): </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtht_time}</Text>
                                    </Right>
                                </View>

                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>
                                        <Text style={styles.textCart}>Tiền tăng ca ngày lễ: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtht_amt}</Text>
                                    </Right>
                                </View>

                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>
                                        <Text style={styles.textCart}>Phụ cấp ca đêm: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtnt_time}</Text>
                                    </Right>
                                </View>

                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>
                                        <Text style={styles.textCart}>Tiền phụ cấp ca đêm: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtnt_amt}</Text>
                                    </Right>
                                </View>

                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>

                                        <Text style={styles.textCart}>Phụ cấp tăng ca đêm: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtont_time}</Text>
                                    </Right>
                                </View>




                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>

                                        <Text style={styles.textCart}>Phép năm còn lại: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtale_days}</Text>
                                    </Right>
                                </View>

                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>

                                        <Text style={styles.textCart}>Tiền phép năm còn lại: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtale_amt}</Text>
                                    </Right>
                                </View>


                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>

                                        <Text style={styles.textCart}>Tổng thu nhập: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtgross_amt}</Text>
                                    </Right>
                                </View>



                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>

                                        <Text style={styles.textCart}>Bảo hiểm xã hội: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtins_amt}</Text>
                                    </Right>
                                </View>

                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>

                                        <Text style={styles.textCart}>Bảo hiểm y tế: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txthealth_amt}</Text>
                                    </Right>
                                </View>


                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>

                                        <Text style={styles.textCart}>Bảo hiểm thất nghiệp: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtunemp_amt}</Text>
                                    </Right>
                                </View>

                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>

                                        <Text style={styles.textCart}>Trừ khác: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtdeduct_amt}</Text>
                                    </Right>
                                </View>

                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>

                                        <Text style={styles.textCart}>Trả khác: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtreturn_amt}</Text>
                                    </Right>
                                </View>


                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>

                                        <Text style={styles.textCart}>Tăng ca tính thuế: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtottax_amt}</Text>
                                    </Right>
                                </View>



                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>

                                        <Text style={styles.textCart}>Giảm trừ thuế: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtdeductpit_amt}</Text>
                                    </Right>
                                </View>

                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>

                                        <Text style={styles.textCart}>Thu nhập tính thuế: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtincome_amt}</Text>
                                    </Right>
                                </View>


                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>

                                        <Text style={styles.textCart}>Thuế thu nhập: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txttax_amt}</Text>
                                    </Right>
                                </View>




                                <View style={styles.cart}>
                                    <Left style={[styles.borderLeft, {}]}>

                                        <Text style={styles.textCart}>Công đoàn: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCartValue}>{dataMonth.txtunion_amt}</Text>
                                    </Right>
                                </View>


                                <View style={[styles.cart, { borderBottomWidth: 0.5 }]}>
                                    <Left style={[styles.borderLeft, {}]}>

                                        <Text style={styles.textCart, { fontWeight: 'bold', paddingBottom: 15, paddingTop: 10, }}>Thực lãnh: </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textCart, { fontWeight: 'bold', }}>{dataMonth.txtnet_amt}</Text>
                                    </Right>
                                </View>

                            </Content>

                            :
                            <View>
                                <View style={styles.cart}>
                                    <Text style={{
                                        marginTop: 30, flex: 1,
                                        textAlign: 'center', color: variables.textValue, fontWeight: 'bold',
                                        fontSize: 17
                                    }}>{variables.textNullValue}</Text>
                                </View>
                            </View>

                        }


                    </Container>
                </Root>

            </StyleProvider>

        );
    }
}
export default MBHRIN004;

const styles = StyleSheet.create({
    cart: {
        flexDirection: 'row',
        borderTopWidth: 0.5,
        borderColor: '#d9e1e8',
        paddingLeft: 10,
        paddingRight: 10,
    },
    textCartHeder: {
        marginTop: 4,
        marginBottom: 4,
        textAlign: 'center',
        color: variables.textValue,
        //fontWeight: 'bold',
        fontSize: 16
    },
    textCart: {
        marginTop: 5,
        marginBottom: 5,
        //fontWeight: 'bold',
        fontSize: 14,
        fontWeight: '300'
    },
    textCartValue: {
        marginTop: 5,
        marginBottom: 5,
        fontWeight: 'bold',
        fontSize: 14,
        color: variables.textValue,
    },
    calendar: {
        borderTopWidth: 1,
        paddingTop: 5,
        borderBottomWidth: 1,
        borderColor: '#eee',
        height: 350
    },

    container: {
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
        shadowColor: "black",
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 4,
        shadowOpacity: 0.2,
        zIndex: 2
    },

    borderLeft: {
        borderRightColor: '#d9e1e8', borderRightWidth: 0.8,
        // justifyContent: 'center', alignItems: 'center'
    },
});