
import React, { Component } from 'react';
import { FlatList, AppRegistry, View, TextInput, Image, StatusBar, Alert, StyleSheet, Platform, Dimensions, TouchableOpacity } from "react-native";
import {
    Root, Toast, Container, ListItem, Body, Content, Header, Left, Right, Picker, Spinner,
    Title, Input, Item, Label, Text, StyleProvider, getTheme, Icon, List, ListView
} from "native-base";
import { Button } from 'react-native-elements';

import customVariables from '../../../assets/styles/variables';
import { CheckBox } from 'react-native-elements';
import variables from '../../../assets/styles/variables';
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import moment from 'moment';
import DialogInput from 'react-native-dialog-input';
import DefaultPreference from 'react-native-default-preference';
import { OnExcute, getUserInfo, getDataJson } from '../../../services/FetchData';
import Loader from '../../SYS/Loader';
import IconAntDesign from 'react-native-vector-icons/AntDesign';

export default class MBHRRE007_2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrayDataCanceled: [],
            data: this.props.data.slice(0, 3),

            loading: false,
            //org_pk: '',
            user_pk: '',
            // emp_id: '',
            full_name: '',
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setState({
                arrayDataCanceled: [],
                data: this.props.data.slice(0, 3),
            })
        }
    }

    updateExperience = (pk_req_over, work_dt) => {
        this.setState({ loading: true });
        var isThis = this;

        let P_WORK_DT = work_dt;
        let P_THR_EMP_PK = this.state.user_pk;
        let p_crt_by = this.state.full_name;

        let procedure = 'STV_HR_SEL_MBI_MBHRRE007_2'
        let p_action = 'CANCEL';
        let P_PK_TABLE = pk_req_over;
        let para = '';

        para = `${p_action}|${P_PK_TABLE}|${P_WORK_DT}|${P_THR_EMP_PK}|${p_crt_by}`;
        console.log("para:---------->" + para);
        OnExcute(p_action, procedure, para)
            .then((res) => {
                console.log(res);
                let data_info = res.objcurdatas[0];
                let arrayDataCanceled = isThis.state.arrayDataCanceled;

                if (data_info.totalrows > 0) {
                    if (data_info.records[0].status == "OK") {
                        arrayDataCanceled.push(pk_req_over);
                        isThis.setState({
                            arrayDataCanceled,
                            loading: false
                        });
                        let toast = variables.toastSuccessful;
                        variables.toastSuccessful.text = 'Hủy xác nhận tăng ca thành công!'
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
                            toast.text = 'Hủy xác nhận tăng ca thất bại!'
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

    comfirmAlert = (pk_req_over, work_dt) => {
        Alert.alert(
            'Hủy xác nhận tăng ca',
            'Bạn có chắc chắn muốn hủy?',
            [
                { text: 'Hủy', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: 'OK', onPress: async () => { this.updateExperience(pk_req_over, work_dt) }
                },
            ],
            { cancelable: false }
        )
    }

    componentDidMount() {
        var that = this;
        console.log("========componentDidMount===");
        DefaultPreference.getAll().then(async (valueAll) => {
            let user_pk = valueAll['user_pk'];
            let full_name = valueAll['full_name'];
            //let emp_id = valueAll['emp_id'];
            //org_pk = valueAll['org_pk'];

            await that.setState({ user_pk: user_pk, full_name: full_name, })
        })
    }

    calc() {
        this.props.callback({ arrayDataCanceled: this.state.arrayDataCanceled });
    }

    renderRow = ({ item, index }) => {
        let arrayDataCanceled = this.state.arrayDataCanceled;
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
                        <Right style={[, {}]}>
                            <Text style={[styles.textCart1Value, {}]}>{item.otxn_nld}</Text>
                        </Right>
                    </View>

                    <View style={styles.cart1}>
                        <Left style={[styles.textAreaContainer, { flex: 0.8, borderRadius: 10, }]}>
                            <TextInput
                                style={[styles.textArea, {}]}
                                underlineColorAndroid="transparent"
                                //placeholder="Công việc làm thêm"
                                placeholderTextColor={'gray'}
                                numberOfLines={2}
                                multiline={true}
                                label={'Ghi chú'}
                                editable={false}
                                value={item.reason_nld}
                                //onChangeText={(commentNLD) => this.onChangeComentTimeNLD(item.no, commentNLD)}
                                baseColor={variables.textValue}
                                labelFontSize={variables.textValue}
                            />
                        </Left>
                        <Right style={[, { flex: 0.2, alignItems: 'center' }]}>
                            <Button
                                disabled={arrayDataCanceled.includes(item.pk_req_over) ? true : false}
                                icon={
                                    <Icon
                                        style={[GlobalStyles.iconHeader, { fontSize: 22, marginLeft: 5, marginBottom: '8%', height: '100%' }]}
                                        name="ios-close"
                                    />
                                }
                                onPress={() => { this.comfirmAlert(item.pk_req_over, item.work_dt) }}
                                // iconContainerStyle={{}}
                                buttonStyle={{ height: 33, backgroundColor: '#FA383E' }}
                                raised
                                iconRight
                                loading={false}
                                title="Hủy"
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
            data = data.concat(this.props.data.slice(lengthDataState, lengthDataState + 3));
            this.setState({ data })
        }
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

                <FlatList style={[{ flex: 1, backgroundColor: lengthDataProps > 0 ? variables.cardCustomBg0 : 'white' }]}
                    extraData={this.state}
                    data={this.state.data}
                    keyExtractor={(item, index) => { item.pk }}
                    renderItem={this.renderRow}
                    onEndReached={() => this.handleLoadMore(lengthDataProps)}
                    onEndReachedThreshold={0.5}
                />

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
    }
});
