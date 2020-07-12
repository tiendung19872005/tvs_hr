
import React, { Component } from 'react';
import { FlatList, RefreshControl, AppRegistry, View, Alert, Image, StatusBar, StyleSheet, Platform, Dimensions, TouchableOpacity } from "react-native";
import {
    Root, Toast, Container, ListItem, Body, Content, Header, Left, Right, Picker, Spinner,
    Title, Input, Item, Label, Text, StyleProvider, getTheme, Icon, List, ListView
} from "native-base";
import { Button } from 'react-native-elements';
import { CheckBox } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';
import variables from '../../../assets/styles/variables';
import DefaultPreference from 'react-native-default-preference';
import { OnExcute, getUserInfo, getDataJson } from '../../../services/FetchData';
import Loader from '../../SYS/Loader';
import moment from 'moment';
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default class MBHRAN005 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cb_org: [],
            orgValue: '',

            gender: true,
            position: false,
            // status: true,
            org: true,
            data: {},
            dataPosition: [],
            numberRecordRender: 10,

            loading: false,

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

            let procedure = "STV_HR_SEL_MBI_MBHRAN005_0";
            let para = `ALL|${username}`;
            getDataJson(procedure, para, '1')
                .then(async (res) => {
                    let cb_org = res.objcurdatas[0].records;
                    await this.setState({ cb_org, orgValue: cb_org[0].value },
                        await this.getData)
                })
        })
    }

    getData = async () => {
        let that = this;
        this.setState({
            loading: true,//isModalOpen: false,
        });
        let procedure = "STV_HR_SEL_MBI_MBHRAN005_1";
        let para = `${this.state.dt_emp_pk}|${''}|${this.state.orgValue}|${'ALL'}|${'ALL'}|${'A'}|${1}|${''}|${''}|${this.state.dt_crt_by}`

        console.log("log para:---------->" + para);
        getDataJson(procedure, para, '1')
            .then((res) => {
                let data_info = res.objcurdatas[0];
                let dataPosition = !!data_info.records.length > 0 ? data_info.records[0].position.split('*') : [];
                let data = !!data_info.records.length > 0 ? data_info.records[0] :
                    {
                        gender: 'Nam|male: 0*Nữ|female: 0',
                        //status: 'Làm việc: 0*Nghỉ việc: 0',
                        org: `${this.state.cb_org.filter(i => i.value == this.state.orgValue)[0].label.replace(/\./g, '')}: 0`,
                        position: ''
                    }
                that.setState({ loading: false, data, dataPosition });
            }).catch(() => {
                that.setState({ loading: false, });
            });
    }

    onChangeORG = async (value, index) => {
        await this.setState({ orgValue: value, },
            await this.getData
        );
        console.log(this.state.orgLable)
    }

    renderRow = ({ item, index }) => {
        // console.log(item)
        return (
            <View style={[styles.cart1, {}]}>
                <Left style={styles.borderRigth}>
                    <Text style={styles.textCart1}>{`${item.substring(item.indexOf('|') + 1, item.indexOf(':'))}`}</Text>
                </Left>
                <Right>
                    <Text style={[styles.textCart1Value, {}]}>{`${item.substring(item.indexOf(':') + 1)} người`}</Text>
                </Right>
            </View>

        )
    }


    renderRowPosition = ({ item, index }) => {
        // console.log(item)
        return (
            <View style={[styles.cart1, {}]}>
                <Left style={styles.borderRigth}>
                    <Text style={styles.textCart1}>{`${item.substring(0, item.indexOf(':') + 1)}`}</Text>
                </Left>
                <Right>
                    <Text style={[styles.textCart1Value, {}]}>{`${item.substring(item.indexOf(':') + 1)} người`}</Text>
                </Right>
            </View>
        )
    }

    handleLoadMore = (lengthData) => {
        let numberRecordRender = this.state.numberRecordRender;
        console.log(numberRecordRender)
        if (numberRecordRender < lengthData) {
            numberRecordRender += 10;
            this.setState({ numberRecordRender });
        }
    }

    render() {
        const data = this.state.data;
        const dataPosition = this.state.dataPosition;
        const lengthDataPosition = this.state.dataPosition.length;

        const gender = !!data.gender ? data.gender.split('*') : null;

        // const status = !!data.status ? data.status.split('*') : null;
        // let sumStatus = !!status ? status.reduce((prevValue, currValue) =>
        //     prevValue + parseInt(currValue.substring(currValue.indexOf(':') + 1)), 0
        // ) : null

        // const position = !!data.position ? data.position.split('*') : null;

        let org = !!data.org ? data.org.split('*') : null;
        const sumOrg = !!org ? org[0].substring(org[0].indexOf(':') + 1) : 0;
        const nameOrg = !!org ? org[0].substring(0, org[0].indexOf(':')) : '';
        org = !!org ? org.length > 1 ? org.slice(1) : org : null;
        return (
            <StyleProvider style={getTheme(variables)} >
                <Root>
                    <Container >
                        <Loader loading={this.state.loading} />
                        <View style={{ flex: 1, marginHorizontal: 10 }}>
                            <Dropdown
                                itemCount={8}
                                baseColor={'gray'}
                                selectedItemColor="black"
                                textColor={variables.textValue}
                                label={'Phòng ban'}
                                value={this.state.cb_org.length > 0 ? this.state.cb_org[0].label : ''}
                                data={this.state.cb_org}
                                dropdownOffset={{ top: 20, }}
                                rippleInsets={{ top: 0, bottom: -12, right: 0, left: 0, }}
                                dropdownPosition={-9.2}
                                containerStyle={{ backgroundColor: 'white', overflow: 'hidden', borderRadius: 5, borderWidth: 0.5, borderColor: 'gray', height: 53, marginTop: 5, paddingLeft: 5 }}
                                pickerStyle={{ backgroundColor: variables.cardDefaultBg, borderRadius: 5, }}
                                style={{ fontSize: 15, fontWeight: '500', fontSize: 16 }} //for changed text color
                                onChangeText={(text, index) => this.onChangeORG(text, index)}
                            // renderAccessory={() => {
                            //     return (
                            //         <Icon style={[GlobalStyles.iconHeader, { color: 'black', marginTop: 2, marginRight: 10, color: variables.textValue }]} name="arrow-dropdown" />
                            //     )
                            // }}
                            />
                            <View style={[, { backgroundColor: 'white', borderRadius: 5, marginVertical: 5, }]}>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                    {/* <CheckBox
                                        iconRight={true}
                                        center={true}
                                        title='Tình trạng'
                                        textStyle={{ color: variables.brandLight, marginLeft: 5, marginRight: 5 }}
                                        size={23}
                                        checkedColor={variables.textValue}
                                        containerStyle={{
                                            paddingTop: 2.4, paddingBottom: 1,
                                            paddingLeft: 0, paddingRight: 0
                                        }}
                                        onPress={() => this.setState({ status: !this.state.status })}
                                        checked={this.state.status}
                                    /> */}
                                    <CheckBox
                                        iconRight={true}
                                        center={true}
                                        title='Giới tính'
                                        textStyle={{ color: variables.brandLight, marginLeft: 5, marginRight: 5 }}
                                        size={23}
                                        checkedColor={variables.textValue}
                                        containerStyle={{
                                            paddingTop: 2.4, paddingBottom: 1, paddingLeft: 0, paddingRight: 0
                                        }}
                                        onPress={() => this.setState({ gender: !this.state.gender })}
                                        checked={this.state.gender}
                                    />
                                    <CheckBox
                                        iconRight={true}
                                        center={true}
                                        title='Phòng ban'
                                        textStyle={{ color: variables.brandLight, marginLeft: 5, marginRight: 5 }}
                                        size={23}
                                        checkedColor={variables.textValue}
                                        containerStyle={{
                                            paddingTop: 2.4, paddingBottom: 1, paddingLeft: 0, paddingRight: 0
                                        }}
                                        onPress={() => this.setState({ org: !this.state.org })}
                                        checked={this.state.org}
                                    />
                                    <CheckBox
                                        iconRight={true}
                                        center={true}
                                        title='Chức vụ'
                                        textStyle={{ color: variables.brandLight, marginLeft: 5, marginRight: 5 }}
                                        size={23}
                                        checkedColor={variables.textValue}
                                        containerStyle={{
                                            paddingTop: 2.4, paddingBottom: 1, paddingLeft: 0, paddingRight: 0
                                        }}
                                        onPress={() => this.setState({ position: !this.state.position })}
                                        checked={this.state.position}
                                    />
                                </View>
                            </View>
                            <Content
                                // contentContainerStyle={{ flex: 2 }} // important!
                                refreshControl={
                                    <RefreshControl
                                        progressViewOffset={40}
                                        refreshing={this.state.loading}
                                        onRefresh={() => { this.getData() }}
                                    />
                                }>
                                {/* {this.state.status ?
                                    <View
                                        style={{
                                            margin: 5, borderRadius: 8, paddingRight: 10, paddingTop: 5, paddingBottom: 7
                                            , backgroundColor: 'white'
                                        }}>
                                        <View style={styles.cart, { borderBottomWidth: 0.5, borderColor: 'gray', paddingBottom: 5, marginBottom: 7, marginLeft: 5 }}>
                                            <Text style={[styles.textCartHeder, { marginTop: 0, paddingTop: 0, alignSelf: 'flex-start', color: variables.textValue, fontWeight: 'bold' }]}>Tình trạng</Text>
                                        </View>

                                        <View style={{ borderWidth: 0.7, borderColor: '#d9e1e8', borderRadius: 10, marginLeft: 5 }}>
                                            {status != null ?
                                                status.map(item => {

                                                    return (
                                                        <View style={[styles.cart1, {}]}>
                                                            <Left style={styles.borderRigth}>
                                                                <Text style={styles.textCart1}>{`${item.substring(0, item.indexOf(':') + 1)}`}</Text>
                                                            </Left>
                                                            <Right>
                                                                <Text style={[styles.textCart1Value, {}]}>{`${item.substring(item.indexOf(':') + 1)} người`}</Text>
                                                            </Right>
                                                        </View>
                                                    )
                                                }) : null}
                                        </View>
                                    </View>
                                    : null} */}

                                {this.state.gender ?
                                    <View
                                        style={{
                                            margin: 5, borderRadius: 8, paddingRight: 10, paddingTop: 5, paddingBottom: 7
                                            , backgroundColor: 'white'
                                        }}>
                                        <View style={styles.cart, { borderBottomWidth: 0.5, borderColor: 'gray', paddingBottom: 5, marginBottom: 7, marginLeft: 5, flexDirection: 'row', }}>
                                            <MaterialCommunityIcons name={'gender-male-female'} style={[, { color: variables.textValue, fontSize: 22, marginRight: 5 }]} />
                                            <Text style={[styles.textCartHeder, { marginTop: 0, paddingTop: 0, alignSelf: 'center', color: variables.textValue, fontWeight: 'bold' }]}>Giới tính</Text>
                                        </View>

                                        <View style={{ borderWidth: 0.7, borderColor: '#d9e1e8', borderRadius: 10, marginLeft: 5 }}>
                                            {gender != null ?
                                                gender.map(item => {
                                                    let value = item.substring(item.indexOf(':') + 1);
                                                    return (
                                                        <View style={[styles.cart1, {}]}>
                                                            <Left style={[styles.borderRigth, { flexDirection: 'row' }]}>
                                                                <FontAwesome name={`${item.substring(item.indexOf('|') + 1, item.indexOf(':'))}`} style={[, { fontSize: 18, marginHorizontal: 7, alignSelf: 'center' }]} />
                                                                <Text style={[styles.textCart1, { marginLeft: 0 }]}>{`${item.substring(0, item.indexOf('|'))}`}</Text>
                                                            </Left>
                                                            <Right>
                                                                <Text style={[styles.textCart1Value, {}]}>{`${value} người`}</Text>
                                                            </Right>
                                                        </View>
                                                    )
                                                })
                                                : null}
                                        </View>
                                    </View>
                                    : null}

                                {this.state.org ?
                                    <View
                                        style={{
                                            margin: 5, borderRadius: 8, paddingRight: 10, paddingTop: 5, paddingBottom: 7
                                            , backgroundColor: 'white'
                                        }}>
                                        <View style={styles.cart, { borderBottomWidth: 0.5, borderColor: 'gray', paddingBottom: 5, marginBottom: 7, marginLeft: 5, flexDirection: 'row' }}>
                                            <MaterialCommunityIcons name={'office-building'} style={[, { color: variables.textValue, fontSize: 22, marginRight: 0 }]} />
                                            <Text style={[styles.textCartHeder, { marginTop: 0, paddingTop: 0, alignSelf: 'center', color: variables.textValue, fontWeight: 'bold' }]}>{`Phòng ban: ${nameOrg}`}</Text>
                                            <Text style={[styles.textCartHeder, { marginTop: 0, paddingTop: 0, alignSelf: 'center', position: 'absolute', right: 0, color: variables.textValue, fontWeight: 'bold' }]}>{`${sumOrg} người`}</Text>
                                        </View>

                                        <FlatList style={[{ backgroundColor: 'white' }]}
                                            extraData={org}
                                            data={org}
                                            keyExtractor={(item, index) => { item.pk }}
                                            renderItem={this.renderRow}
                                        />
                                    </View>
                                    : null}

                                {this.state.position ?
                                    <View
                                        style={{
                                            margin: 5, borderRadius: 8, paddingRight: 10, paddingTop: 5, paddingBottom: 7
                                            , backgroundColor: 'white'
                                        }}>
                                        <View style={styles.cart, { borderBottomWidth: 0.5, borderColor: 'gray', paddingBottom: 5, marginBottom: 7, marginLeft: 5 }}>
                                            <Text style={[styles.textCartHeder, { marginTop: 0, paddingTop: 0, alignSelf: 'flex-start', color: variables.textValue, fontWeight: 'bold' }]}>Chức vụ</Text>
                                        </View>

                                        <FlatList style={[{ backgroundColor: 'white' }]}
                                            extraData={dataPosition}
                                            // data={dataPosition.slice(0, this.state.numberRecordRender)}
                                            data={dataPosition}
                                            keyExtractor={(item, index) => { item.pk }}
                                            renderItem={this.renderRowPosition}
                                        // onEndReached={() => this.handleLoadMore(lengthDataPosition)}
                                        // onEndReachedThreshold={0.5}
                                        />
                                    </View>
                                    : null}
                            </Content>
                        </View>
                    </Container>
                </Root>
            </StyleProvider >


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
        fontSize: 16,
    },
    borderLeft: {
        borderLeftColor: '#d9e1e8', borderLeftWidth: 0.8
    },
    borderRigth: {
        borderRightColor: '#d9e1e8', borderRightWidth: 0.8
    }
});
