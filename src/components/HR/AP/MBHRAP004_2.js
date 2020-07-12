
import React, { Component } from 'react';
import { FlatList, RefreshControl, AppRegistry, View, Alert, Image, StatusBar, StyleSheet, Platform, Dimensions, TouchableOpacity } from "react-native";
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
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import Loader from '../../SYS/Loader';

export default class MBHRAP004_2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dt_crt_by: '',
            dt_emp_pk: '',
            status: 'NOOK',
            loading: false,

            numberRecordRender: 5,
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setState({
                numberRecordRender: 5,
            })
        }
    }

    componentDidMount() {
        var that = this;
        console.log("========componentDidMount===");
        DefaultPreference.getAll().then(async (valueAll) => {
            let user_pk = valueAll['user_pk'];
            let full_name = valueAll['full_name'];
            let username = valueAll['username'];
            //let emp_id = valueAll['emp_id'];
            //org_pk = valueAll['org_pk'];

            await that.setState({ dt_emp_pk: user_pk, dt_crt_by: username, })
        })
    }

    renderRow = ({ item, index }) => {
        return (
            <View
                style={{
                    marginHorizontal: 10, margin: 5, borderRadius: 8, paddingRight: 10, paddingTop: 5, paddingBottom: 7
                /* backgroundColor: index % 2 == 0 ? variables.cardCustomBg0 : variables.cardCustomBg1,*/,
                    backgroundColor: 'white'
                }}>
                <View style={styles.cart, { borderBottomWidth: 0.5, borderColor: 'gray', paddingBottom: 5, marginBottom: 7, marginLeft: 5, flexDirection: 'row' }}>
                    <View style={{
                        height: 13, width: 13, alignSelf: 'center', justifyContent: 'center', marginHorizontal: 5, borderRadius: 2,
                        backgroundColor:
                            item.approve_status == '1' ? 'hsl(40, 89%, 52%)' :
                                item.approve_status == '2' ? variables.brandSuccess :
                                    item.approve_status == '3' ? 'red' : null
                    }}></View>
                    <Text style={[styles.textCartHeder, { marginTop: 0, paddingTop: 0, alignSelf: 'flex-start' }]}>Ngày: <Text style={{ color: variables.textValue, fontSize: 15 }}>{moment(item.abs_dt).format('DD-MM-YYYY')}</Text></Text>
                </View>

                <View style={{ borderWidth: 0.7, borderColor: '#d9e1e8', borderRadius: 10, marginLeft: 5 }}>
                    <View style={styles.cart1}>
                        <Left>
                            <Text style={styles.textCart1}>Giờ vào(<IconAntDesign style={{ fontWeight: '1000', color: variables.textValue }} name='login' />)<IconAntDesign style={{ fontWeight: '1000' }} name='arrowright' />ra(<IconAntDesign style={{ fontWeight: '1000', color: variables.textValue }} name='logout' />): </Text>
                        </Left>
                        <Right style={styles.borderLeft}>
                            <Text style={[styles.textCart1Value, {}]}>
                                <IconAntDesign style={{ fontWeight: '1000', }} name='login'></IconAntDesign> {!!item.start_hours ? item.start_hours : `--:--`} | <IconAntDesign style={{ fontWeight: '1000', }} name='logout'></IconAntDesign> {!!item.end_hours ? item.end_hours : `--:--`}
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
                        <Left>
                            <Text style={styles.textCart1}>Loại vắng: </Text>
                        </Left>
                        <Right style={styles.borderLeft}>
                            <Text style={[styles.textCart1Value, {}]}>{item.abs_type}</Text>
                        </Right>
                    </View>

                    <View style={styles.cart1}>
                        <Left>
                            <Text style={styles.textCart1}>Ghi chú: </Text>
                        </Left>
                        <Right style={styles.borderLeft}>
                            <Text style={[styles.textCart1Value, {}]}>{item.description}</Text>
                        </Right>
                    </View>

                    <View style={styles.cart1}>
                        <Left>
                            <Text style={styles.textCart1}>Ngày phê duyệt: </Text>
                        </Left>
                        <Right style={styles.borderLeft}>
                            <Text style={[styles.textCart1Value, {}]}>{!!item.approve_date ? moment(item.approve_date).format('DD-MM-YYYY') : ''}</Text>
                        </Right>
                    </View>

                    <View style={styles.cart1}>
                        <Left>
                            <Text style={styles.textCart1}>Ý kiến người phê duyệt: </Text>
                        </Left>
                        <Right style={styles.borderLeft}>
                            <Text style={[styles.textCart1Value, {}]}>{item.approve_note}</Text>
                        </Right>
                    </View>
                </View>
            </View>
        )
    }

    handleLoadMore = (lengthData) => {
        let numberRecordRender = this.state.numberRecordRender;
        if (numberRecordRender < lengthData) {
            numberRecordRender += 5;
            this.setState({ numberRecordRender });
        }
    }

    calc() {
        this.props.callback();
    }

    render() {
        const lengthDataProps = this.props.data.length;
        return (
            <Container>
                <Loader loading={this.state.loading} />

                {lengthDataProps > 0 ?
                    <View style={[GlobalStyles.row, { flex: 0, }]}>
                        <View style={[GlobalStyles.rowLeft, { marginLeft: '3%' }]}>
                            <Text style={[styles.textCart, {}]} >Tổng số dòng: <Text style={[styles.textCart, { color: variables.textValue }]}>{lengthDataProps}</Text></Text>
                        </View>
                    </View>
                    :
                    <View style={[styles.cart, { backgroundColor: variables.cardCustomBg0, }]}>
                        <Text style={{
                            marginTop: '10%', flex: 2, paddingBottom: '10%',
                            textAlign: 'center', color: variables.textValue, fontWeight: 'bold',
                            fontSize: 17
                        }}>{variables.textNullValue}</Text>
                    </View>
                }

                <FlatList style={[{ flex: 1, backgroundColor: lengthDataProps > 0 ? variables.cardCustomBg0 : 'white' }]}
                    extraData={this.props}
                    data={this.props.data.slice(0, this.state.numberRecordRender)}
                    keyExtractor={(item, index) => { item.pk }}
                    renderItem={this.renderRow}
                    onEndReached={() => this.handleLoadMore(lengthDataProps)}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                        <RefreshControl
                            progressViewOffset={40}
                            refreshing={this.state.loading}
                            onRefresh={() => { this.calc() }}
                        />
                    }
                />

            </Container>

        );
    }
}
const styles = StyleSheet.create({
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
    borderLeft: {
        borderLeftColor: '#d9e1e8', borderLeftWidth: 0.8
    }
});
