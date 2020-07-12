import React, { Component } from 'react';
import {
    View, TextInput, Image, KeyboardAvoidingView, ScrollView, StyleSheet, Modal,
    TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, SafeAreaView, ImageBackground, ActivityIndicator
} from 'react-native';
import {
    Root, Toast, Container, Body, Content, Header, Left, Right, Picker, Spinner,
    Title, Input, Item, Label, Button, Text, StyleProvider, getTheme, Icon, CheckBox, Tab, Tabs, TabHeading, ScrollableTab
} from "native-base";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import customVariables from '../../../assets/styles/variables';
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import Loader from '../../SYS/Loader';
import moment, { months } from 'moment';
import MBHRRE007_1 from "./MBHRRE007_1";
import MBHRRE007_1_HP from "./MBHRRE007_1_HP";
import MBHRRE007_2 from "./MBHRRE007_2";
import { getLoginJson, getDataJson } from '../../../services/FetchData'
import DefaultPreference from 'react-native-default-preference';
import variables from '../../../assets/styles/variables';
import { Block, theme } from "galio-framework";
import { Badge, withBadge } from 'react-native-elements'
import Calender from '../../SYS/Calender';

export default class MBHRRE007 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            daySelected: moment(new Date()).format('DD.MM'),
            startingDay: moment(new Date()).format('YYYY-MM-DD'),
            endingDay: moment(new Date()).format('YYYY-MM-DD'),

            dataDaXN: [],
            dataChoXN: [],
            choXN: 0,
            daXN: 0,
            loading: false,
            arrayDataInserted: [],
            arrayDataCanceled: [],

            //org_pk: '',
            user_pk: '',
            emp_id: '',
            full_name: '',

        };
        this.getData = this.getData.bind(this);

    }

    componentDidMount = async () => {
        DefaultPreference.getAll().then(async (valueAll) => {
            let user_pk = valueAll['user_pk'];
            let full_name = valueAll['full_name'];
            let emp_id = valueAll['emp_id'];
            //org_pk = valueAll['org_pk'];

            await this.setState(
                { user_pk: user_pk, emp_id: emp_id, full_name: full_name, },
                await this.getData
            )
        })
    }

    getData = async (p_fromdate = moment(this.state.startingDay).format("YYYYMMDD"), p_todate = moment(this.state.endingDay).format("YYYYMMDD")) => {
        let that = this;
        that.setState({ loading: true })

        let procedure = "STV_HR_SEL_MBI_MBHRRE007";
        // let para = this.state.user_pk + "|" + p_fromdate + "|" + p_todate + "|" + this.state.full_name;
        let para = this.state.user_pk + "|" + p_fromdate + "|" + p_todate + "|" + this.state.full_name;
        console.log("log para:---------->" + para);
        await getDataJson(procedure, para, '1')
            .then((res) => {
                console.log(res);
                let data_info = res.objcurdatas[0];
                if (data_info.totalrows > 0) {
                    //that.setState({ data: data_info.records, });
                    that.updateState(data_info.records);
                } else {
                    that.setState({
                        //data: [],
                        dataDaXN: [],
                        dataChoXN: [],
                        choXN: 0,
                        daXN: 0,
                    });
                }
                that.setState({ loading: false, })
            }).catch(() => {
                that.setState({ loading: false })
            })

        setTimeout(() => {
            this.setState({ isModalOpen: false, })
        }, 0);
    }

    updateState = (data) => {
        let dataDaXN = [];
        let dataChoXN = [];
        let choXN = 0;
        let daXN = 0;

        data.map(element => {
            if (element.pk_req_over != '') {
                daXN++;
                dataDaXN.push(element);
            } else {
                choXN++;
                dataChoXN.push(element);
            }
        });

        this.setState({
            dataDaXN: dataDaXN,
            daXN: daXN,
            dataChoXN: dataChoXN,
            choXN: choXN,
        })
    }

    onChangeTab(i) {
        if (this.state.arrayDataInserted.length > 0 || this.state.arrayDataCanceled.length > 0) {
            this.getData(moment(this.state.startingDay).format("YYYYMMDD"), moment(this.state.endingDay).format('YYYYMMDD'));
            this.setState({ arrayDataInserted: [], arrayDataCanceled: [] })
        }
    }

    getResponse(result) {
        console.log(result);
        this.setState({ arrayDataInserted: result.arrayDataInserted })
    }

    getResponse1(result) {
        this.setState({ arrayDataCanceled: result.arrayDataCanceled })
    }

    getResponseCalendar = async (result) => {
        await setTimeout(() => this.setState({
            isModalOpen: false,
            startingDay: result.startingDay, endingDay: result.endingDay,
            daySelected: result.daySelected
        }), 100)
        await this.getData(result.startingDay, result.endingDay);
    }

    render() {
        return (
            <StyleProvider style={getTheme(customVariables)}>
                <Root>
                    <Container>
                        {/* {this.state.loading &&
                            <View style={styles.loading}>
                                <ActivityIndicator size='large' />
                            </View>
                        } */}
                        <Loader loading={this.state.loading} />

                        <View style={styles.dropDownDay}
                            ref={(ref) => { this.marker = ref }}
                            onLayout={({ nativeEvent }) => {
                                if (this.marker) {
                                    this.marker.measure((x, y, width, height, pageX, pageY) => {
                                        this.setState({ pageX, pageY, heightOfCld: height });
                                    })
                                }
                            }}>
                            <TouchableOpacity success onPress={() => this.setState({ isModalOpen: true })} style={[{ flexDirection: 'row', alignSelf: 'center', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }]} >
                                <Icon style={[GlobalStyles.iconHeader, { color: 'black', fontSize: 22, color: theme.COLORS.ICON, marginLeft: 3 }]} name="calendar" />
                                <Text style={{ marginHorizontal: 'auto', marginVertical: 'auto', marginLeft: 6, marginRight: 6, marginTop: '0.5%', color: theme.COLORS.ICON, fontSize: 15 }}>Chọn ngày: {this.state.daySelected}</Text>
                                <Icon style={[GlobalStyles.iconHeader, { color: 'black', marginTop: 4 }]} name="arrow-dropdown" />
                            </TouchableOpacity>
                        </View>

                        {/* <ScrollableTabView
                            style={{
                                marginTop: 4, backgroundColor: '', borderTopWidth: 0, height: 20
                            }}
                            tabBarActiveTextColor={variables.backgroundColorTV}
                            tabBarUnderlineStyle={{ borderColor: variables.backgroundColorTV, height: 2, backgroundColor: variables.backgroundColorTV }}
                            //tabBarTextStyle={{ alignSelf: "center", alignItems: 'center', paddingTop: '7%' }}
                            initialPage={0}
                            scrollWithoutAnimation={true}
                            tabBarPosition='top'
                            tabBarBackgroundColor={variables.tabBgColor}
                            tabBarTextStyle={{ backgroundColor: '', marginTop: 7 }}
                            onChangeTab={({ i }) => this.onChangeTab(i)}
                            renderTabBar={() => <DefaultTabBar />}
                        >

                            <MBHRRE007_1
                                callback={this.getResponse.bind(this)}
                                data={this.state.dataChoXN}
                                tabLabel={"Chờ xác nhận " + '(' + this.state.choXN + ')'} 
                                />
                            <MBHRRE007_2
                                callback={this.getResponse1.bind(this)}
                                data={this.state.dataDaXN} tabLabel={"Đã xác nhận " + '(' + this.state.daXN + ')'} />
                        </ScrollableTabView> */}

                        <Tabs
                            // renderTabBar={() => <ScrollableTab />}
                            style={{}}
                            tabBarActiveTextColor={variables.backgroundColorTV}
                            tabBarUnderlineStyle={{ backgroundColor: variables.backgroundColorTV, }}
                            initialPage={0}
                            scrollWithoutAnimation={false}
                            tabBarPosition='top'
                            onChangeTab={({ i }) => this.onChangeTab(i)}
                        >
                            <Tab
                                heading={
                                    <TabHeading style={{ backgroundColor: variables.tabBgColor, borderColor: 'gray', borderBottomWidth: 0.5 }}>
                                        <Text style={{ fontSize: 15, color: 'black', marginRight: 0 }}>Chờ xác nhận</Text>
                                        <Badge value={this.state.choXN} status='warning' textStyle={{ fontSize: 13, fontWeight: 'bold', }} containerStyle={{ width: 35 }} />
                                    </TabHeading>
                                }>
                                {variables.nameApi == 'HPDQ_API' ?
                                    <MBHRRE007_1_HP
                                        callback={this.getResponse.bind(this)}
                                        data={this.state.dataChoXN}
                                    />
                                    : <MBHRRE007_1
                                        callback={this.getResponse.bind(this)}
                                        data={this.state.dataChoXN}
                                    />
                                }

                            </Tab>
                            <Tab
                                heading={
                                    <TabHeading style={{ backgroundColor: variables.tabBgColor, borderColor: 'gray', borderLeftWidth: 0.5, borderBottomWidth: 0.5 }}>
                                        <Text style={{ fontSize: 15, color: 'black', marginRight: 0 }}>Đã xác nhận</Text>
                                        <Badge value={this.state.daXN} status='success' textStyle={{ fontSize: 13, fontWeight: 'bold', }} containerStyle={{ width: 35 }} />
                                    </TabHeading>
                                }>
                                <MBHRRE007_2
                                    callback={this.getResponse1.bind(this)}
                                    data={this.state.dataDaXN}
                                />
                            </Tab>
                        </Tabs>

                        <Modal
                            presentationStyle='overFullScreen'
                            animationType="fade"
                            transparent={true}
                            visible={this.state.isModalOpen}
                            onRequestClose={() => { this.setState({ isModalOpen: false }) }}
                        >
                            <TouchableOpacity
                                style={[styles.container1]}
                                activeOpacity={1}
                                onPressOut={() => { this.setState({ isModalOpen: false }) }}
                            >
                                <TouchableWithoutFeedback>
                                    <Calender
                                        startingDay={this.state.startingDay}
                                        endingDay={this.state.endingDay}
                                        callback={this.getResponseCalendar.bind(this)}
                                        marginTopSet={this.state.pageY + this.state.heightOfCld} />
                                </TouchableWithoutFeedback>
                            </TouchableOpacity>
                        </Modal>

                    </Container>
                </Root>
            </StyleProvider >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
    },
    modalBackground: {
        backgroundColor: 'white',
        padding: 10
    },
    innerContainer: {
        borderRadius: 10,
    },
    innerContainerTransparent: {
        backgroundColor: '#ffffff',
        padding: 20
    },
    lineStyle: {
        borderWidth: 0.5,
        borderColor: '#FFFFFF',
        margin: 10,
        width: '100%'
    },
    dropDownDay: {
        alignSelf: 'flex-start',
        padding: 3,
        margin: 7,
        // borderBottomLeftRadius: 6,
        // borderTopRightRadius: 6,
        borderRadius: 10,
        backgroundColor: theme.COLORS.WHITE,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 4,
        shadowOpacity: 0.2,
        zIndex: 0
    },
    container1: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        // justifyContent: 'center',
        // alignItems: 'stretch',
    },

});
