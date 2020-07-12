
import React, { Component } from 'react';
import { FlatList, AppRegistry, RefreshControl, View, TouchableWithoutFeedback, TextInput, Image, StatusBar, Alert, StyleSheet, Platform, Modal, TouchableHighlight, Dimensions, TouchableOpacity } from "react-native";
import {
    Root, Toast, Container, ListItem, Body, Content, Header, Left, Right, Picker, Spinner,
    Title, Input, Item, Label, Text, StyleProvider, getTheme, Icon, List, ListView
} from "native-base";
import { Button } from 'react-native-elements';
import Calender from '../../SYS/Calender';
import variables from '../../../assets/styles/variables';
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import moment from 'moment';
import DefaultPreference from 'react-native-default-preference';
import { OnExcute, getUserInfo, getDataJson } from '../../../services/FetchData';
import Loader from '../../SYS/Loader';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import { Block, theme } from "galio-framework";

export default class MBHRRE001_2 extends Component {
    constructor(props) {
        super(props);
        focusListener = null;
        this.state = {
            arrayDataCanceled: [],
            data: [],
            dataRender: [],

            loading: false,
            //org_pk: '',
            user_pk: '',
            // emp_id: '',
            full_name: '',

            isModalOpen: false,
            daySelected: moment(new Date()).format('DD.MM'),
            startingDay: moment(new Date()).format('YYYY-MM-DD'),
            endingDay: moment(new Date()).format('YYYY-MM-DD'),
        }
        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        var that = this;
        DefaultPreference.getAll().then(async (valueAll) => {
            let user_pk = valueAll['user_pk'];
            let full_name = valueAll['full_name'];
            let username = valueAll['username'];

            //let emp_id = valueAll['emp_id'];
            //org_pk = valueAll['org_pk'];

            await that.setState(
                { user_pk: user_pk, full_name: username, },
                await this.getData
            )
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.reloadData !== this.props.reloadData) {
            this.getData(moment(this.state.startingDay).format("YYYYMMDD"), moment(this.state.endingDay).format('YYYYMMDD'));
        }
    }

    getData = async (p_fromdate = moment(this.state.startingDay).format("YYYYMMDD"), p_todate = moment(this.state.endingDay).format("YYYYMMDD")) => {
        let that = this;
        that.setState({ loading: true })

        let procedure = "STV_HR_SEL_MBI_MBHR00001_2";
        let p_absence_type = 'ALL';
        let p_reason_type = 'ALL';
        let para = `${this.state.user_pk}|${p_fromdate}|${p_todate}|${p_absence_type}|${p_reason_type}|${this.state.full_name}`;
        console.log("log para:---------->" + para);
        await getDataJson(procedure, para, '1')
            .then((res) => {
                console.log(res);
                let data_info = res.objcurdatas[0];
                if (data_info.totalrows > 0) {
                    that.setState({ data: data_info.records, dataRender: data_info.records.slice(0, 3) });
                } else {
                    that.setState({
                        data: [],
                        dataRender: [],
                    });
                }
                that.setState({ loading: false })
            }).catch(() => {
                that.setState({ loading: false })
            });
    }

    updateExperience = (p_pk) => {
        this.setState({ loading: true })
        var isThis = this;
        let procedure = 'STV_HR_UPD_MBI_MBHRRE001_2'
        let p_action = 'UPDATE';
        let p_v = 'Y'
        let P_PK_TABLE = p_pk;
        let p_crt_by = this.state.full_name;
        let para = '';
        para = `${p_action}|${p_v}|${P_PK_TABLE}|${p_crt_by}`;
        // console.log("para:---------->" + para);

        OnExcute(p_action, procedure, para)
            .then((res) => {
                console.log(res);
                let data_info = res.objcurdatas[0];
                let arrayDataCanceled = isThis.state.arrayDataCanceled;

                if (data_info.totalrows > 0) {
                    if (data_info.records[0].status == "OK") {
                        arrayDataCanceled.push(P_PK_TABLE),
                            isThis.setState({
                                arrayDataCanceled,
                                loading: false
                            });
                        let toast = variables.toastSuccessful;
                        variables.toastSuccessful.text = 'Hủy đăng ký vắng thành công!'
                        Toast.show(toast)
                        this.calc();

                    } else {
                        isThis.setState({ loading: false });
                        if (data_info.records[0].error_ex != "") {
                            let toast = variables.toastError;
                            toast.text = data_info.records[0].error_ex
                            Toast.show(toast)
                            return;
                        } else {
                            let toast = variables.toastError;
                            toast.text = 'Hủy đăng ký vắng thất bại!'
                            Toast.show(toast)
                            return;
                        }

                    }
                }
                else {
                    isThis.setState({ loading: false });
                    let toast = variables.toastError;
                    toast.text = 'Cập nhật không thành công!'
                    Toast.show(toast)
                }
            });
    }

    comfirmAlert = (p_pk) => {
        Alert.alert(
            'Hủy đăng ký vắng',
            'Bạn có chắc chắn muốn hủy?',
            [
                { text: 'Hủy', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'OK', onPress: async () => this.updateExperience(p_pk) },
            ],
            { cancelable: false }
        )
    }

    calc() {
        this.props.callback({ arrayDataCanceled: this.state.arrayDataCanceled });
    }

    getResponseCalendar = async (result) => {
        await setTimeout(() => this.setState({
            isModalOpen: false,
            startingDay: result.startingDay, endingDay: result.endingDay,
            daySelected: result.daySelected
        }), 100)
        await this.getData(result.startingDay, result.endingDay);
    }

    renderRow = ({ item, index }) => {
        return (
            <View
                style={{
                    marginHorizontal: 10, margin: 5, borderRadius: 8, paddingRight: 10, paddingTop: 5, paddingBottom: 7
                    /* backgroundColor: index % 2 == 0 ? variables.cardCustomBg0 : variables.cardCustomBg1,*/,
                    backgroundColor: 'white'
                }}>
                <View style={styles.cart, { borderBottomWidth: 0.5, borderColor: 'gray', paddingVertical: 5, marginLeft: 5, flexDirection: 'row' }}>
                    <View style={{
                        height: 13, width: 13, alignSelf: 'center', justifyContent: 'center', marginHorizontal: 5, borderRadius: 2,
                        backgroundColor:
                            item.hr_approve_yn == 'N' ?
                                item.approve_status == '1' ? 'hsl(40, 89%, 52%)' :
                                    item.approve_status == '2' ? 'green' :
                                        item.approve_status == '3' ? 'red' : null
                                : variables.backgroundColorTV,
                    }}></View>
                    <Text style={[styles.textCartHeder, { marginTop: 0, paddingTop: 0, alignSelf: 'flex-start' }]}>Ngày vắng: <Text style={[styles.textCart1Value, { color: variables.textValue }]}>{moment(item.abs_dt).format('DD-MM-YYYY')}</Text></Text>
                    {/* <Text style={[styles.textCartHeder, { marginTop: 0, paddingTop: 0, position: 'absolute', right: 0, color: variables.backgroundColorTV  }]}>{item.emp_pk}</Text> */}
                    {/* <Text style={[styles.textCartHeder, { marginTop: 0, paddingTop: 0, position: 'absolute', right: 0, color: variables.backgroundColorTV  }]}>{item.day_type}</Text> */}
                </View>

                <View style={{ borderWidth: 0.7, borderColor: '#d9e1e8', borderRadius: 10, marginLeft: 5 }}>

                    <View style={styles.cart1}>
                        <Left>
                            <Text style={styles.textCart1}>Tình trạng phê duyệt: </Text>
                        </Left>
                        <Right style={styles.borderLeft}>
                            {item.hr_approve_yn == 'N' ?
                                item.approve_status == '1' ?
                                    <Text style={[styles.textCart1Value, { color: 'hsl(40, 89%, 52%)' }]}>Chờ phê duyệt</Text> :
                                    item.approve_status == '2' ?
                                        <Text style={[styles.textCart1Value, { color: 'green' }]}>TBP đã phê duyệt</Text> :
                                        item.approve_status == '3' ?
                                            <Text style={[styles.textCart1Value, { color: 'red' }]}>Không phê duyệt</Text> :
                                            <Text></Text>
                                : <Text style={[styles.textCart1Value, { color: variables.backgroundColorTV }]}>HR đã phê duyệt</Text>}
                        </Right>
                    </View>

                    {item.approve_status == '2' || item.approve_status == '3' ?
                        <View>
                            <View style={styles.cart1}>
                                <Left>
                                    <Text style={styles.textCart1}>Người phê duyệt: </Text>
                                </Left>
                                <Right style={styles.borderLeft}>
                                    <Text style={[styles.textCart1Value, {}]}>{item.approve_by}</Text>
                                </Right>
                            </View>
                            <View style={styles.cart1}>
                                <Left>
                                    <Text style={styles.textCart1}>Ngày phê duyệt: </Text>
                                </Left>
                                <Right style={styles.borderLeft}>
                                    <Text style={[styles.textCart1Value, {}]}>{moment(item.approve_date).format('DD-MM-YYYY')}</Text>
                                </Right>
                            </View>
                        </View>
                        : item.approve_status == '1' ?
                            null : null}

                    <View style={styles.cart1}>
                        <Left>
                            <Text style={styles.textCart1}>Ý kiến người phê duyệt: </Text>
                        </Left>
                        <Right style={styles.borderLeft}>
                            <Text style={[styles.textCart1Value, {}]}>{item.approve_note}</Text>
                        </Right>
                    </View>

                    <View style={styles.cart1}>
                        <Left>
                            <Text style={styles.textCart1}>Giờ vào(<IconAntDesign style={{ fontWeight: '1000', color: variables.textValue }} name='login' />)<IconAntDesign style={{ fontWeight: '1000' }} name='arrowright' />ra(<IconAntDesign style={{ fontWeight: '1000', color: variables.textValue }} name='logout' />): </Text>
                        </Left>
                        <Right style={styles.borderLeft}>
                            <Text style={[styles.textCart1Value, {}]}>
                                <IconAntDesign style={{ fontWeight: '1000', }} name='login'></IconAntDesign> {item.start_hours} | <IconAntDesign style={{ fontWeight: '1000', }} name='logout'></IconAntDesign> {item.end_hours != '' ? item.end_hours : `--:--`}
                            </Text>
                        </Right>
                    </View>

                    <View style={styles.cart1}>
                        <Left>
                            <Text style={styles.textCart1}>Số giờ vắng: </Text>
                        </Left>
                        <Right style={styles.borderLeft}>
                            <Text style={[styles.textCart1Value, {}]}>{item.hours}</Text>
                        </Right>
                    </View>

                    <View style={styles.cart1}>
                        <Left style={[, {}]}>
                            <Text style={[styles.textCart1, {}]}>Loại vắng: </Text>
                        </Left>
                        <Right style={[styles.borderLeft, {}]}>
                            <Text style={[styles.textCart1Value, {}]}>{item.abs_type}</Text>
                        </Right>
                    </View>

                    <View style={styles.cart1}>
                        <Left style={[, {}]}>
                            <Text style={[styles.textCart1, {}]}>Lý do vắng: </Text>
                        </Left>
                        <Right style={[styles.borderLeft, {}]}>
                            <Text style={[styles.textCart1Value, {}]}>{item.reason_type}</Text>
                        </Right>
                    </View>

                    <View style={styles.cart1}>
                        <Left style={[styles.textAreaContainer, { flex: 0.8, borderRadius: 10, }]}>
                            <TextInput
                                mode='outlined'
                                fontStyle={'italic'}
                                style={[styles.textArea, {}]}
                                underlineColorAndroid="transparent"
                                // placeholder="Ghi chú"
                                label='Ghi chú'
                                error={false}
                                numberOfLines={1}
                                multiline={true}
                                editable={false}
                                disabled={true}
                                theme={{
                                    colors: {
                                        // placeholder: variables.backgroundColorTV,
                                        text: variables.textValue, primary: variables.textValue,
                                        underlineColor: variables.backgroundColorTV, background: '#ffff'
                                    }
                                }}
                                baseColor={variables.textValue}
                                labelFontSize={variables.textValue}
                                value={item.description == '' ? ' ' : item.description} />
                        </Left>
                        <Right style={[, { flex: 0.2, alignItems: 'center' }]}>
                            <Button
                                disabled={
                                    item.hr_approve_yn == 'N' ?
                                        this.state.arrayDataCanceled.includes(item.pk) ?
                                            true : false
                                        : true}
                                icon={
                                    <Icon
                                        style={[GlobalStyles.iconHeader, { fontSize: 22, marginLeft: 5, marginBottom: '8%', height: '100%' }]}
                                        name="ios-close"
                                    />
                                }
                                onPress={() => { this.comfirmAlert(item.pk) }}
                                iconContainerStyle={{ marginLeft: 15, paddingLeft: 15 }}
                                buttonStyle={{ height: 33, backgroundColor: '#FA383E' }}
                                raised
                                iconRight
                                loading={false}
                                title="Hủy"
                                titleStyle={{ fontSize: 12, fontWeight: '600', marginTop: 0, paddingTop: 0, marginBottom: 0, paddingBottom: 0 }}
                            />
                        </Right>
                    </View>
                </View>
            </View >
        )
    }

    handleLoadMore = (lengthData) => {
        let dataRender = this.state.dataRender;
        const lengthDataRender = this.state.dataRender.length;
        if (lengthDataRender < lengthData) {
            dataRender = dataRender.concat(this.state.data.slice(lengthDataRender, lengthDataRender + 3));
            this.setState({ dataRender })
        }
    }

    render() {
        const lengthData = this.state.data.length;
        return (
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
                    }}
                >
                    <TouchableOpacity success onPress={() => this.setState({ isModalOpen: true })} style={[{ flexDirection: 'row', alignSelf: 'center', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }]} >
                        <Icon style={[GlobalStyles.iconHeader, { color: 'black', fontSize: 22, color: theme.COLORS.ICON, marginLeft: 3 }]} name="calendar" />
                        <Text style={{ marginHorizontal: 'auto', marginVertical: 'auto', marginLeft: 6, marginRight: 6, marginTop: '0.5%', color: theme.COLORS.ICON, fontSize: 15 }}>Chọn ngày: {this.state.daySelected}</Text>
                        <Icon style={[GlobalStyles.iconHeader, { color: 'black', marginTop: 4 }]} name="arrow-dropdown" />
                    </TouchableOpacity>
                </View>

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

                {lengthData > 0 ?
                    <View>
                        <View style={[GlobalStyles.row, { flex: 0, }]}>
                            <View style={[GlobalStyles.rowLeft, { marginLeft: '3%' }]}>
                                <Text style={[styles.textCart, {}]} >
                                    Tổng số dòng: <Text style={[styles.textCart, { color: variables.textValue }]}>{lengthData}</Text></Text>
                            </View>
                        </View>
                    </View>
                    :
                    <View>
                        <View style={[styles.cart, { backgroundColor: variables.cardCustomBg0, }]}>
                            <Text style={{
                                marginTop: '10%', flex: 2, paddingBottom: '10%',
                                textAlign: 'center', color: variables.textValue, fontWeight: 'bold',
                                fontSize: 17
                            }}>{variables.textNullValue}</Text>
                        </View>
                    </View>
                }

                <FlatList style={[{ flex: 1, backgroundColor: lengthData > 0 ? variables.cardCustomBg0 : 'white' }]}
                    extraData={this.state}
                    data={this.state.dataRender}
                    keyExtractor={(item, index) => { item.pk }}
                    renderItem={this.renderRow}
                    onEndReached={() => this.handleLoadMore(lengthData)}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                        <RefreshControl
                            progressViewOffset={40}
                            refreshing={this.state.loading}
                            onRefresh={() => { this.getData() }}
                        />
                    }
                />
            </Container>
        );
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
        borderColor: variables.textValue,
        borderWidth: 1,
        padding: 5,
        marginVertical: 5,
        marginLeft: 10,
        justifyContent: "center"
    },

    textArea: {
        height: 30,
        //justifyContent: "flex-start"
    },

    borderLeft: {
        borderLeftColor: '#d9e1e8', borderLeftWidth: 0.8
    },
    borderRight: {
        borderRightColor: '#d9e1e8', borderRightWidth: 0.8
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
        zIndex: 0
    },
    calendar: {
        borderTopWidth: 1,
        paddingTop: 5,
        borderBottomWidth: 1,
        borderColor: '#eee',
        width: '100%',
        height: '100%',

    },
    container1: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        // justifyContent: 'center',
        // alignItems: 'stretch',
    },
});
