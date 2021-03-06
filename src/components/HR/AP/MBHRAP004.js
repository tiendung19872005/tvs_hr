import React, { Component } from 'react';
import {
    View, StyleSheet, Modal, TouchableHighlight, TouchableOpacity, SafeAreaView, ImageBackground, TouchableWithoutFeedback,
} from 'react-native';
import {
    Root, Toast, Container, Text, StyleProvider, getTheme, Icon, CheckBox, Tab, Tabs, TabHeading, ScrollableTab
} from "native-base";
import { Badge, withBadge } from 'react-native-elements'
import customVariables from '../../../assets/styles/variables';
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import Loader from '../../SYS/Loader';
import moment, { months } from 'moment';
import Calender from '../../SYS/Calender';
import MBHRAP004_1 from "./MBHRAP004_1";
import MBHRAP004_2 from "./MBHRAP004_2";
import MBHRAP004_3 from "./MBHRAP004_3";
import { getLoginJson, getDataJson } from '../../../services/FetchData'
import DefaultPreference from 'react-native-default-preference';
import variables from '../../../assets/styles/variables';
import { Block, theme } from "galio-framework";

export default class MBHRAP004 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            daySelected: moment(new Date()).format('DD.MM'),
            startingDay: moment(new Date()).format('YYYY-MM-DD'),
            endingDay: moment(new Date()).format('YYYY-MM-DD'),

            data: [],
            statusControl: 1,
            dataKhongPD: [],
            dataDaPD: [],
            dataChoPD: [],
            choduyet: 0,
            dapheduyet: 0,
            khongpheduyet: 0,
            emp_id: '',
            full_name: '',
            org_nm: '',
            abs_dt: '',
            start_hours: '',
            end_hours: '',
            hours: '',
            abs_type: '',
            description: '',
            loading: false,
            p_approve_status: '',

            emp_id: '',
            user_pk: '',
            user_name: '',
            full_name: '',
        };
    }

    componentDidMount = async () => {
        DefaultPreference.getAll().then(async (valueAll) => {
            let user_pk = valueAll['user_pk'];
            let full_name = valueAll['full_name'];
            let emp_id = valueAll['emp_id'];
            let user_name = valueAll['username'];
            //org_pk = valueAll['org_pk'];

            await this.setState(
                { user_pk: user_pk, emp_id: emp_id, full_name: full_name, user_name: user_name },
                await this.getData
            )
        })
    }

    getResponse(result) {
        this.getData();
    }

    getData = async (p_fromdate = moment(this.state.startingDay).format("YYYYMMDD"), p_todate = moment(this.state.endingDay).format("YYYYMMDD")) => {
        let that = this;
        this.setState({
            loading: true,//isModalOpen: false,
        });
        let procedure = "STV_HR_SEL_MBI_MBHRAP004_0";
        let para = this.state.user_pk + "|" + 'ALL' + "|" + p_fromdate + "|" + p_todate + "|" + this.state.user_name;

        console.log("log para:---------->" + para);
        getDataJson(procedure, para, '1')
            .then((res) => {
                console.log(res);
                let data_info = res.objcurdatas[0];
                if (data_info.totalrows > 0) {
                    //await that.setState({ data: data_info.records })
                    that.updateState(data_info.records);
                } else {
                    this.setState({
                        dataChoPD: [],
                        dataDaPD: [],
                        dataKhongPD: [],
                        khongpheduyet: 0,
                        choduyet: 0,
                        dapheduyet: 0,
                        //loading:false
                    });
                }
                that.setState({ loading: false, });
            }).catch(() => {
                that.setState({ loading: false, });
            });
    }

    updateState = (data) => {
        let dataChoPD = [];
        let dataDaPD = [];
        let dataKhongPD = [];
        let khongpheduyet = 0;
        let choduyet = 0;
        let dapheduyet = 0;

        (data).map(element => {
            if (element.approve_status == 3) {
                khongpheduyet++;
                dataKhongPD.push(element);
            } else if (element.approve_status == 2) {
                dapheduyet++;
                dataDaPD.push(element);
            } else if (element.approve_status == 1) {
                choduyet++;
                dataChoPD.push(element);
            }
        });

        this.setState({
            dataChoPD: dataChoPD,
            dataDaPD: dataDaPD,
            dataKhongPD: dataKhongPD,
            khongpheduyet: khongpheduyet,
            choduyet: choduyet,
            dapheduyet: dapheduyet,
        });
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
                        <Loader loading={this.state.loading} />

                        <View style={styles.dropDownDay}
                            ref={(ref) => { this.marker = ref }}
                            onLayout={({ nativeEvent }) => {
                                if (this.marker) {
                                    this.marker.measure((x, y, width, height, pageX, pageY) => {
                                        this.setState({ pageX, pageY, heightOfCld: height });
                                    })
                                }
                            }} >
                            <TouchableOpacity success onPress={() => this.setState({ isModalOpen: true })} style={[{ flexDirection: 'row', alignSelf: 'center', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }]} >
                                <Icon style={[GlobalStyles.iconHeader, { color: 'black', fontSize: 22, color: theme.COLORS.ICON, marginLeft: 3 }]} name="calendar" />
                                <Text style={{ marginHorizontal: 'auto', marginVertical: 'auto', marginLeft: 6, marginRight: 6, marginTop: '0.5%', color: theme.COLORS.ICON, fontSize: 15 }}>Chọn ngày: {this.state.daySelected}</Text>
                                <Icon style={[GlobalStyles.iconHeader, { color: 'black', marginTop: 4 }]} name="arrow-dropdown" />
                            </TouchableOpacity>
                        </View>

                        <Tabs
                            renderTabBar={() => <ScrollableTab />}
                            style={{}}
                            tabBarActiveTextColor={variables.backgroundColorTV}
                            tabBarUnderlineStyle={{ backgroundColor: variables.backgroundColorTV }}
                            initialPage={0}
                            scrollWithoutAnimation={false}
                            tabBarPosition='top'
                        // onChangeTab={({ i }) => this.onChangeTab(i)}
                        >
                            <Tab
                                heading={
                                    <TabHeading style={{ backgroundColor: variables.tabBgColor, borderBottomColor: 'gray', paddingLeft: 10, paddingRight: 5 }}>
                                        <Text style={{ fontSize: 15, color: 'black', marginRight: 2 }}>Chờ phê duyệt</Text>
                                        <Badge value={this.state.choduyet} status="warning" textStyle={{ fontSize: 13, fontWeight: 'bold', }} containerStyle={{ width: 35 }} />

                                    </TabHeading>
                                }>
                                <MBHRAP004_1
                                    callback={this.getResponse.bind(this)}
                                    data={this.state.dataChoPD}
                                // tabLabel={"Chờ phê duyệt " + '(' + this.state.choduyet + ')'} 
                                />

                            </Tab>
                            <Tab
                                heading={
                                    <TabHeading style={{ backgroundColor: variables.tabBgColor, borderColor: 'gray', borderLeftWidth: 0.5, paddingLeft: 10, paddingRight: 5 }}>
                                        <Text style={{ fontSize: 15, color: 'black', marginRight: 2 }}>Đã phê duyệt</Text>
                                        <Badge value={this.state.dapheduyet} status="success" textStyle={{ fontSize: 13, fontWeight: 'bold', }} containerStyle={{ width: 35 }} />
                                    </TabHeading>
                                }>
                                <MBHRAP004_2
                                    callback={this.getResponse.bind(this)}
                                    data={this.state.dataDaPD}
                                //  tabLabel={"Đã phê duyệt " + '(' + this.state.dapheduyet + ')'}
                                />

                            </Tab>
                            <Tab
                                heading={
                                    <TabHeading style={{ backgroundColor: variables.tabBgColor, borderColor: 'gray', borderLeftWidth: 0.5, borderLeftWidth: 0.5, paddingLeft: 10, paddingRight: 5 }}>
                                        <Text style={{ fontSize: 15, color: 'black', marginRight: 2 }}>Không phê duyệt</Text>
                                        <Badge value={this.state.khongpheduyet} status="error" textStyle={{ fontSize: 13, fontWeight: 'bold', }} containerStyle={{ width: 35 }} />
                                    </TabHeading>
                                }>
                                <MBHRAP004_3
                                    callback={this.getResponse.bind(this)}
                                    data={this.state.dataKhongPD}
                                // tabLabel={"Không phê duyệt " + '(' + this.state.khongpheduyet + ')'} 
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
            </StyleProvider>
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
        zIndex: 2
    }
    , container1: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        // justifyContent: 'center',
        // alignItems: 'stretch',
    },
});
