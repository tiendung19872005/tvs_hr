import React, { Component } from "react";
import {
    AppRegistry, View, Image, StatusBar, StyleSheet, Platform, Dimensions
    , TouchableOpacity, FlatList, Animated, Modal, TouchableHighlight, ListView, TouchableWithoutFeedback
} from "react-native";
import {
    Root, Toast, Container, Body, Content, Header, Left, Right, Spinner,
    Icon, Title, Input, data, Label, Button, Text, StyleProvider, getTheme, MonthBox
} from "native-base";
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import customVariables from '../../../assets/styles/variables';
import moment from "moment";
import 'moment/locale/vi';
import DefaultPreference from 'react-native-default-preference';
import { OnExcute, getUserInfo, getDataJson } from '../../../services/FetchData';
import Loader from '../../SYS/Loader';
import DateTimePicker from "react-native-modal-datetime-picker";
import MonthSelectorCalendar from 'react-native-month-selector'; //add this import line
import variables from '../../../assets/styles/variables';

class MBHRIN003 extends Component {
    handleButton(navigate) {
        this.props.navigation.navigate(navigate);
    }

    constructor(props) {
        super(props);

        this.state = {
            loadMore: false,

            data: [],
            loading: false,
            month: moment(),
            numDayOfMonth: moment(moment(new Date)).daysInMonth(),
            isModalOpen: false,

            org_pk: '',
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
            full_name = valueAll['username'];
            emp_id = valueAll['emp_id'];
            org_pk = valueAll['org_pk'];

            await this.setState(
                { user_pk: user_pk, emp_id: emp_id, full_name: full_name, org_pk: org_pk },
                await this.getData
            )
        })
    }

    isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom
    }

    onMonthTapped(month) {
        this.setState({
            month: month,
            numDayOfMonth: moment(moment(month).format("YYYY-MM"), "YYYY-MM").daysInMonth()
        });
        this.getData(moment(month).format("YYYYMM"));
    }


    getData = async (p_work_mon = moment(new Date()).format("YYYYMM")) => {
        var that = this;
        this.setState({ loading: true });

        var procedure = "STV_HR_SEL_MBI_MBHRIN003_0";
        var para = that.state.emp_id + "|" + p_work_mon + "|" + that.state.org_pk + "|" + '' + "|" + that.state.full_name;
        console.log("log para:---------->" + para);
        getDataJson(procedure, para, '1')
            .then((res) => {
                console.log(res);
                var data_info = res.objcurdatas[0];

                if (data_info.totalrows > 0) {
                    that.setState({ data: data_info.records, });
                } else {
                    that.setState({ data: [] });
                }
                that.setState({ loading: false, isModalOpen: false });
            });
    }

    render() {
        let data = this.state.data[0];
        const nextIcon = React.createElement(Icon, { name: 'ios-arrow-forward', style: [GlobalStyles.iconHeader, { paddingHorizontal: 16, color: variables.textValue }] });
        const prevIcon = React.createElement(Icon, { name: 'ios-arrow-back', style: [GlobalStyles.iconHeader, { paddingHorizontal: 16, color: variables.textValue }] });
        return (
            <StyleProvider style={getTheme(customVariables)}>
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

                        <View style={styles.cart, { borderTopWidth: 0.5, borderColor: '#d9e1e8', paddingHorizontal: 15, marginVertical: 2 }}>
                            <Text style={[styles.textCartHeder, { alignSelf: 'flex-start', color: 'black' }]}>Tháng làm việc: <Text style={[styles.textCartHeder, { color: variables.textValue, fontWeight: 'bold' }]}>{moment(this.state.month).format("MM-YYYY")}</Text></Text>
                            {/* <Text style={[styles.textCartHeder, { position: 'absolute', right: 15, color: variables.backgroundColorTV  }]}>{this.state.tv_emp_id + ' - ' + this.state.tv_full_name}</Text> */}
                        </View>

                        {data != null ?
                            <View>
                                <View style={{ borderWidth: 0.7, borderColor: '#d9e1e8', borderRadius: 10, marginHorizontal: 10, backgroundColor: '#FFF' }}>
                                    <View style={[styles.cart1, { borderTopWidth: 0, borderBottomWidth: 2, }]}>
                                        <Left style={[styles.borderLeft, { justifyContent: 'center', alignItems: 'center' }]}>
                                            <Text style={styles.textCart1, { color: 'black', fontWeight: 'bold', }}>Tổng</Text>
                                        </Left>
                                        <Right style={[styles.borderLeft, { justifyContent: 'center', alignItems: 'center' }]}>
                                            <Text style={[styles.textCart1, { color: 'black', fontWeight: 'bold' }]}>Số giờ</Text>
                                        </Right>
                                    </View>


                                    <View style={styles.cart1}>
                                        <Left style={styles.borderLeft}>
                                            <Text style={styles.textCart1}>Tổng công</Text>
                                        </Left>
                                        <Right style={[styles.borderLeft, {}]}>
                                            <Text style={[styles.textCart1Value, {}]}>
                                                {data.total_wt}
                                            </Text>
                                        </Right>
                                    </View>

                                    <View style={[styles.cart1, { borderTopWidth: 0 }]}>
                                        <Left style={[styles.borderLeft, {}]}>
                                            <Text style={styles.textCart1}>Hỗ trợ tăng ca đêm</Text>
                                        </Left>
                                        <Right style={[styles.borderLeft, {}]}>
                                            <Text style={[styles.textCart1Value, {}]}>{data.nt2}</Text>
                                        </Right>
                                    </View>

                                    <View style={styles.cart1}>
                                        <Left style={styles.borderLeft}>
                                            <Text style={styles.textCart1}>Tăng ca lễ</Text>
                                        </Left>
                                        <Right style={[styles.borderLeft, {}]}>
                                            <Text style={[styles.textCart1Value, {}]}>
                                                {data.ot_30}
                                            </Text>
                                        </Right>
                                    </View>

                                    <View style={styles.cart1}>
                                        <Left style={styles.borderLeft}>
                                            <Text style={styles.textCart1}>Tăng ca chủ nhật</Text>
                                        </Left>
                                        <Right style={[styles.borderLeft, {}]}>
                                            <Text style={[styles.textCart1Value, {}]}>
                                                {data.ot_20}
                                            </Text>
                                        </Right>
                                    </View>

                                    <View style={styles.cart1}>
                                        <Left style={styles.borderLeft}>
                                            <Text style={styles.textCart1}>Tăng ca thường</Text>
                                        </Left>
                                        <Right style={[styles.borderLeft, {}]}>
                                            <Text style={[styles.textCart1Value, {}]}>
                                                {data.ot_15}
                                            </Text>
                                        </Right>
                                    </View>

                                    <View style={styles.cart1}>
                                        <Left style={styles.borderLeft}>
                                            <Text style={styles.textCart1}>Nghỉ khác</Text>
                                        </Left>
                                        <Right style={[styles.borderLeft, {}]}>
                                            <Text style={[styles.textCart1Value, {}]}>
                                                {data.abs_pay}
                                            </Text>
                                        </Right>
                                    </View>

                                    <View style={styles.cart1}>
                                        <Left style={styles.borderLeft}>
                                            <Text style={styles.textCart1}>Nghỉ phép năm</Text>
                                        </Left>
                                        <Right style={[styles.borderLeft, {}]}>
                                            <Text style={[styles.textCart1Value, {}]}>
                                                {data.abs_ale}
                                            </Text>
                                        </Right>
                                    </View>

                                    <View style={styles.cart1}>
                                        <Left style={styles.borderLeft}>
                                            <Text style={styles.textCart1}>Nghỉ lễ</Text>
                                        </Left>
                                        <Right style={[styles.borderLeft, {}]}>
                                            <Text style={[styles.textCart1Value, {}]}>
                                                {data.total_hol}
                                            </Text>
                                        </Right>
                                    </View>

                                </View>
                                <View style={{}}>
                                    <Text style={[styles.textCart1, { textAlign: "center", marginTop: 6, color: variables.textValue, fontWeight: 'bold' }]}>Chi tiết</Text>
                                </View>
                            </View>
                            :
                            <View>
                                <View style={styles.cart}>
                                    <Text style={{
                                        marginTop: 30, flex: 1,
                                        textAlign: 'center', color: variables.textValue, fontWeight: 'bold',
                                        fontSize: 17
                                    }}>{variables.textNullValue}</Text>
                                </View>
                            </View>}

                        {data != null ?

                            <View style={{ flex: 1, backgroundColor: '#FFF', borderWidth: 0.6, borderColor: 'gray', marginHorizontal: 10, borderRadius: 5 }}>
                                <View style={[styles.cart1, { borderTopWidth: 0, borderBottomWidth: 2, }]}>
                                    <Left style={[styles.borderLeft, { justifyContent: 'center', alignItems: 'center' }]}>
                                        <Text style={styles.textCart1, { color: 'black', fontWeight: 'bold', }}>Ngày</Text>
                                    </Left>
                                    <Right style={[styles.borderLeft, { justifyContent: 'center', alignItems: 'center' }]}>
                                        <Text style={[styles.textCart1, { color: 'black', fontWeight: 'bold' }]}>Số giờ</Text>
                                    </Right>
                                </View>
                                <Content style={{}}>
                                    {
                                        data.dataday.split('*').map((item, index) => {
                                            return (
                                                <View key={index} style={[, { flexDirection: 'row', borderBottomWidth: 0.4, borderBottomColor: 'gray' }]}>

                                                    <Left style={styles.borderLeft}>
                                                        <Text style={styles.textCart1}>{item.substring(0, item.indexOf("|"))}</Text>
                                                    </Left>
                                                    <Right>
                                                        <Text style={[styles.textCart1Value,]}>{`${item.substring(item.indexOf("|") + 1)}`}</Text>
                                                    </Right>
                                                </View>

                                            )
                                        })
                                    }
                                </Content>
                            </View>

                            : null
                        }



                    </Container>
                </Root>

            </StyleProvider>
        );
    }
}
export default MBHRIN003;

const styles = StyleSheet.create({
    cart: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderColor: '#d9e1e8',
        marginLeft: 20,
        marginRight: 20,
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
    cart1: {
        borderBottomWidth: 0.5,
        flexDirection: 'row',
        //borderTopWidth: 0.5,
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
        fontWeight: '400',
    },
    textCart1Value: {
        marginLeft: 10,
        marginRight: 10,
        paddingTop: 3,
        paddingBottom: 3,
        fontWeight: 'bold',
        fontSize: 15,
        //fontWeight: '400',
        color: variables.textValue
    },
    borderLeft: {
        borderRightColor: '#d9e1e8', borderRightWidth: 0.8,
        //justifyContent: 'center', alignItems: 'center'
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
});