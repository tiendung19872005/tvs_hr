
import React, { Component } from 'react';
import { FlatList, RefreshControl, AppRegistry, Modal, View, Alert, Image, TouchableWithoutFeedback, StatusBar, StyleSheet, Platform, Dimensions, TouchableOpacity } from "react-native";
import {
    Root, Toast, Container, ListItem, Body, Content, Header, Left, Right, Picker, Spinner,
    Title, Input, Item, Label, Text, StyleProvider, getTheme, Icon, List, ListView
} from "native-base";
import { Button } from 'react-native-elements';
import { CheckBox, SearchBar } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';
import variables from '../../../assets/styles/variables';
import DefaultPreference from 'react-native-default-preference';
import { OnExcute, getUserInfo, getDataJson } from '../../../services/FetchData';
import Loader from '../../SYS/Loader';
import moment from 'moment';
import { Block, theme } from "galio-framework";

export default class MBHRIN009 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cb_org: [],
            orgValue: '',

            isModalOpen: false,
            data: [],
            numberRecordRender: 5,

            loading: false,
            loadingSearch: false,
            emp_pk: '',
            tes_user_pk: '',
            user_name: '',

            working: true,
            hasRetired: false,
            valueSearchBar: '',

            dataAlert: {},
        }
        this.arrayholder = [];
    }

    componentDidMount() {
        var that = this;
        console.log("========componentDidMount===");
        DefaultPreference.getAll().then(async (valueAll) => {
            let user_pk = valueAll['user_pk'];
            let full_name = valueAll['full_name'];
            let tes_user_pk = valueAll['tes_user_pk'];
            let username = valueAll['username'];
            //let emp_id = valueAll['emp_id'];
            //org_pk = valueAll['org_pk'];

            await that.setState({ emp_pk: user_pk, tes_user_pk: tes_user_pk, user_name: username, })

            let procedure = "STV_HR_SEL_MBI_MBHRIN009_0";
            let para = `${tes_user_pk}|${username}`;
            getDataJson(procedure, para, '1')
                .then(async (res) => {
                    console.log(res);
                    let cb_org = res.objcurdatas[0].records;
                    cb_org.unshift({ value: '0', label: 'Tất cả' })
                    await this.setState({ cb_org, orgValue: cb_org[0].value },
                        await this.getData,
                    )
                })
        })
    }

    getData = async () => {
        let that = this;
        this.setState({
            loading: true,//isModalOpen: false,
        });
        let procedure = "STV_HR_SEL_MBI_MBHRIN009_1";
        const orgValue = this.state.orgValue;
        let status = 'ALL';
        const hasRetired = this.state.hasRetired;
        const working = this.state.working;
        if (hasRetired && working) {
            status = 'ALL';
        } else if (hasRetired && !working) {
            status = 'R';
        } else if (!hasRetired && working) {
            status = 'A';
        }
        let para = `${this.state.tes_user_pk}|${''}|${''}|${orgValue == 0 ? 'ALL' : orgValue}|${status}|${this.state.user_name}`

        console.log("log para:---------->" + para);
        getDataJson(procedure, para, '1')
            .then((res) => {
                console.log(res);
                let data_info = res.objcurdatas[0];
                that.setState({
                    loading: false,
                    data: data_info.records,
                    numberRecordRender: 5
                });
                this.arrayholder = data_info.records;
            }).catch(() => {
                that.setState({ loading: false, });
            });
    }

    onChangeORG = async (value, index) => {
        await this.setState({ orgValue: value, },
            await this.getData
        );
    }

    showAlert(no) {
        const item = this.state.data.filter(i => i.no == no);
        this.setState({ isModalOpen: true, dataAlert: item[0] });
    }

    renderRow = ({ item, index }) => {
        // console.log(item)
        return (
            <TouchableOpacity onPress={() => { this.showAlert(item.no) }}>
                <View style={{
                    paddingVertical: 5, marginVertical: 2, borderRadius: 5,
                    borderBottomColor: '#CCCCCC', borderBottomWidth: 0.5,
                    backgroundColor: 'white', flexDirection: 'row'
                }}>

                    <View style={{
                        alignSelf: 'flex-start', marginHorizontal: 3,
                        width: '15.5%',
                        // height: '100%',
                        justifyContent: 'center',
                    }}>
                        {item.photo.length < 14 ?
                            <View style={{ flex: 1, justifyContent: 'center', }}>
                                <View style={{ flex: 0.28, backgroundColor: 'rgb(247,248,247)', justifyContent: 'center', borderColor: 'gray', borderWidth: 0.5, borderRadius: 5, paddingLeft: 1 }}>
                                    <Text style={{ fontSize: 14, alignSelf: 'center', fontWeight: 'bold' }}>Chưa có hình ảnh</Text>
                                </View>
                            </View>
                            :
                            <Image
                                style={{
                                    flex: 1,
                                    resizeMode: 'contain',
                                    borderColor: 'gray', borderWidth: 0.5, borderRadius: 5,
                                }}
                                source={{ uri: item.photo }}
                            />
                        }

                    </View>
                    <View style={{ borderWidth: 0.7, borderColor: '#d9e1e8', width: '82%', borderRadius: 5 }}>

                        <View style={[styles.cart1, { borderBottomWidth: 0.5, justifyContent: 'center', borderTopWidth: 0 }]}>
                            <Text style={[styles.textCart1Value, {}]}>{item.full_name}</Text>
                        </View>

                        <View style={[styles.cart1, { borderBottomWidth: 0.5, }]}>
                            <Left>
                                <Text style={[styles.textCart, {}]}>Mã số: </Text>
                            </Left>
                            <Right style={styles.borderLeft}>
                                <Text style={[styles.textCart1Value, {}]}>{item.employee_id}</Text>
                            </Right>
                        </View>

                        <View style={[styles.cart1, { borderBottomWidth: 0.5, }]}>
                            <Left>
                                <Text style={[styles.textCart, {}]}>Ngày sinh: </Text>
                            </Left>
                            <Right style={styles.borderLeft}>
                                <Text style={[styles.textCart1Value, {}]}>{item.birth_dt}</Text>
                            </Right>
                        </View>

                        <View style={[styles.cart1, { borderBottomWidth: 0.5, }]}>
                            <Left>
                                <Text style={[styles.textCart, {}]}>Phòng ban: </Text>
                            </Left>
                            <Right style={styles.borderLeft}>
                                <Text style={[styles.textCart1Value, {}]}>{item.organization}</Text>
                            </Right>
                        </View>

                        <View style={[styles.cart1, { borderBottomWidth: 0.5, }]}>
                            <Left>
                                <Text style={[styles.textCart, {}]}>Nhóm làm việc: </Text>
                            </Left>
                            <Right style={styles.borderLeft}>
                                <Text style={[styles.textCart1Value, {}]}>{item.work_group}</Text>
                            </Right>
                        </View>

                        <View style={[styles.cart1, { borderBottomWidth: 0.5, }]}>
                            <Left>
                                <Text style={[styles.textCart, {}]}>Trạng thái: </Text>
                            </Left>
                            <Right style={[styles.borderLeft, { flexDirection: 'row', justifyContent: 'flex-end' }]}>
                                <Text style={[styles.textCart1Value, {}]}>{item.status == 'A' ? 'Làm việc' : 'Nghỉ việc'}</Text>
                                <View style={{ width: 13, height: 13, backgroundColor: item.status == 'A' ? 'rgb(63,170,52)' : 'red', alignSelf: 'center', marginRight: 5 }}></View>
                            </Right>
                        </View>

                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    handleLoadMore = (lengthData) => {
        let numberRecordRender = this.state.numberRecordRender;
        console.log(numberRecordRender)
        if (numberRecordRender < lengthData) {
            numberRecordRender += 5;
            this.setState({ numberRecordRender });
        }
    }

    searchFilterFunction = text => {
        this.setState({ valueSearchBar: text, loadingSearch: true });
        const newData = this.arrayholder.filter(item => {
            const itemData = `${item.full_name.toUpperCase()} ${item.employee_id.toUpperCase()} `;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({ data: newData, loadingSearch: false });
    }

    render() {
        const data = this.state.data;
        const lengthData = data.length;
        const dataAlert = this.state.dataAlert;
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

                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', }}>
                                    <CheckBox
                                        iconRight={true}
                                        center={true}
                                        title='Làm việc'
                                        textStyle={{ color: variables.brandLight, marginLeft: 5, marginRight: 5 }}
                                        size={23}
                                        checkedColor={variables.textValue}
                                        containerStyle={{
                                            margin: 3,
                                            paddingTop: 2.4, paddingBottom: 1,
                                            paddingLeft: 0, paddingRight: 0
                                        }}
                                        onPress={async () => {
                                            await this.setState({ working: !this.state.working })
                                            await this.getData()
                                        }}
                                        checked={this.state.working}
                                    />
                                    <CheckBox
                                        iconRight={true}
                                        center={true}
                                        title='Nghỉ việc'
                                        textStyle={{ color: variables.brandLight, marginLeft: 5, marginRight: 5 }}
                                        size={23}
                                        checkedColor={variables.textValue}
                                        containerStyle={{
                                            margin: 3,
                                            paddingTop: 2.4, paddingBottom: 1, paddingLeft: 0, paddingRight: 0
                                        }}
                                        onPress={async () => {
                                            await this.setState({ hasRetired: !this.state.hasRetired })
                                            await this.getData()
                                        }}
                                        checked={this.state.hasRetired}
                                    />
                                </View>
                                <SearchBar
                                    placeholder="Nhập tên hoặc mã số nhân viên..."
                                    lightTheme
                                    showLoading={this.state.loadingSearch}
                                    round
                                    onChangeText={text => this.searchFilterFunction(text)}
                                    autoCorrect={false}
                                    value={this.state.valueSearchBar}
                                    containerStyle={{ backgroundColor: 'white', padding: 4 }}
                                    inputContainerStyle={{
                                        backgroundColor: 'rgb(222,221,229)',
                                        height: 30,
                                        // borderColor: 'black',
                                        borderRadius: 5
                                    }}
                                    inputStyle={{ color: 'black' }}
                                />

                            </View>

                            {lengthData > 0 ?
                                <FlatList style={[{}]}
                                    extraData={data}
                                    data={data.slice(0, this.state.numberRecordRender)}
                                    // data={data}
                                    keyExtractor={(item, index) => { item.pk }}
                                    renderItem={this.renderRow}
                                    onEndReached={() => this.handleLoadMore(lengthData)}
                                    onEndReachedThreshold={0.5}
                                /> : null
                            }
                            {
                                !!dataAlert ?
                                    <Modal
                                        animationType='fade'
                                        transparent={true}
                                        presentationStyle={'overFullScreen'}
                                        visible={this.state.isModalOpen}
                                    // onRequestClose={() => { this.setState({ isModalOpen: false }) }}
                                    >
                                        <TouchableOpacity
                                            style={[styles.container1, { justifyContent: 'center' }]}
                                            activeOpacity={1}
                                            onPressOut={() => { this.setState({ isModalOpen: false }) }}
                                        >
                                            <TouchableWithoutFeedback>
                                                <View style={[styles.modalBackground, { borderRadius: 5, width: '90%', alignSelf: 'center' }]}>
                                                    <View style={{ marginVertical: 3, borderRadius: 5, borderWidth: 0.7, borderColor: '#d9e1e8', }}>

                                                        <Block middle style={styles.avatarContainer}>
                                                            {dataAlert.photo != 'data:;base64,' ?
                                                                <Image
                                                                    source={{ uri: dataAlert.photo }}
                                                                    style={styles.avatar}
                                                                />
                                                                :
                                                                <View style={[styles.avatar, { marginTop: 2, justifyContent: 'center', backgroundColor: 'rgb(247,248,247)', }]}>
                                                                    <Text style={[, { fontSize: 14, alignSelf: 'center', fontWeight: 'bold', color: 'gray' }]}>Chưa có hình ảnh</Text>
                                                                </View>
                                                            }
                                                        </Block>

                                                        <View style={[styles.cart1, { borderBottomWidth: 0.5, justifyContent: 'center', borderTopWidth: 0 }]}>
                                                            <Text style={[styles.textCart1Value, {}]}>{dataAlert.full_name}</Text>
                                                        </View>

                                                        <View style={[styles.cart1, { borderBottomWidth: 0.5, }]}>
                                                            <Left>
                                                                <Text style={[styles.textCart, {}]}>Mã số: </Text>
                                                            </Left>
                                                            <Right style={styles.borderLeft}>
                                                                <Text style={[styles.textCart1Value, {}]}>{dataAlert.employee_id}</Text>
                                                            </Right>
                                                        </View>

                                                        <View style={[styles.cart1, { borderBottomWidth: 0.5, }]}>
                                                            <Left>
                                                                <Text style={[styles.textCart, {}]}>Ngày sinh: </Text>
                                                            </Left>
                                                            <Right style={styles.borderLeft}>
                                                                <Text style={[styles.textCart1Value, {}]}>{dataAlert.birth_dt}</Text>
                                                            </Right>
                                                        </View>

                                                        <View style={[styles.cart1, { borderBottomWidth: 0.5, }]}>
                                                            <Left>
                                                                <Text style={[styles.textCart, {}]}>Phòng ban: </Text>
                                                            </Left>
                                                            <Right style={styles.borderLeft}>
                                                                <Text style={[styles.textCart1Value, {}]}>{dataAlert.organization}</Text>
                                                            </Right>
                                                        </View>

                                                        <View style={[styles.cart1, { borderBottomWidth: 0.5, }]}>
                                                            <Left>
                                                                <Text style={[styles.textCart, {}]}>Nhóm làm việc: </Text>
                                                            </Left>
                                                            <Right style={styles.borderLeft}>
                                                                <Text style={[styles.textCart1Value, {}]}>{dataAlert.work_group}</Text>
                                                            </Right>
                                                        </View>

                                                        <View style={[styles.cart1, { borderBottomWidth: 0.5, }]}>
                                                            <Left>
                                                                <Text style={[styles.textCart, {}]}>Trạng thái: </Text>
                                                            </Left>
                                                            <Right style={[styles.borderLeft, { flexDirection: 'row', justifyContent: 'flex-end' }]}>
                                                                <Text style={[styles.textCart1Value, {}]}>{dataAlert.status == 'A' ? 'Làm việc' : 'Nghỉ việc'}</Text>
                                                                <View style={{ width: 13, height: 13, backgroundColor: dataAlert.status == 'A' ? 'rgb(63,170,52)' : 'red', alignSelf: 'center', marginRight: 5 }}></View>
                                                            </Right>
                                                        </View>

                                                        <View style={[styles.cart1, { borderBottomWidth: 0.5, }]}>
                                                            <Left>
                                                                <Text style={[styles.textCart, {}]}>Ngày vào: </Text>
                                                            </Left>
                                                            <Right style={[styles.borderLeft, { flexDirection: 'row', justifyContent: 'flex-end' }]}>
                                                                <Text style={[styles.textCart1Value, {}]}>{moment(dataAlert.join_dt).format('DD/MM/YYYY')}</Text>
                                                            </Right>
                                                        </View>

                                                        <View style={[styles.cart1, { borderBottomWidth: 0.5, }]}>
                                                            <Left>
                                                                <Text style={[styles.textCart, {}]}>Số điện thoại: </Text>
                                                            </Left>
                                                            <Right style={[styles.borderLeft, { flexDirection: 'row', justifyContent: 'flex-end' }]}>
                                                                <Text style={[styles.textCart1Value, {}]}>{dataAlert.telephone}</Text>
                                                            </Right>
                                                        </View>

                                                        <View style={[styles.cart1, { borderBottomWidth: 0.5, }]}>
                                                            <Left>
                                                                <Text style={[styles.textCart, {}]}>Giới tính: </Text>
                                                            </Left>
                                                            <Right style={[styles.borderLeft, { flexDirection: 'row', justifyContent: 'flex-end' }]}>
                                                                <Text style={[styles.textCart1Value, {}]}>{
                                                                    dataAlert.sex == 'F' || dataAlert.sex == 'Nữ' ?
                                                                        'Nữ' :
                                                                        dataAlert.sex == 'M' || dataAlert.sex == 'Nam' ?
                                                                            'Nam' :
                                                                            'Không xác định'
                                                                }</Text>
                                                            </Right>
                                                        </View>

                                                        <View style={[styles.cart1, { borderBottomWidth: 0.5, }]}>
                                                            <Left>
                                                                <Text style={[styles.textCart, {}]}>Lương thử việc: </Text>
                                                            </Left>
                                                            <Right style={[styles.borderLeft, { flexDirection: 'row', justifyContent: 'flex-end' }]}>
                                                                <Text style={[styles.textCart1Value, {}]}>{dataAlert.pro_salary}</Text>
                                                            </Right>
                                                        </View>

                                                        <View style={[styles.cart1, { borderBottomWidth: 0.5, }]}>
                                                            <Left>
                                                                <Text style={[styles.textCart, {}]}>Lương cơ bản: </Text>
                                                            </Left>
                                                            <Right style={[styles.borderLeft, { flexDirection: 'row', justifyContent: 'flex-end' }]}>
                                                                <Text style={[styles.textCart1Value, {}]}>{dataAlert.basic_salary}</Text>
                                                            </Right>
                                                        </View>

                                                    </View>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </TouchableOpacity>
                                    </Modal> :
                                    null
                            }


                        </View>
                    </Container>
                </Root>
            </StyleProvider >


        );
    }
}
const styles = StyleSheet.create({
    container1: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        // justifyContent: 'center',
        // alignItems: 'stretch',
    },
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
        marginLeft: 3,
        fontSize: 15.5,
        fontWeight: '400',
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
    },

    avatarContainer: {
        // position: "relative",
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 0,
        borderWidth: 3,
        borderColor: 'rgb(235, 236,235)',
        // marginTop: 10,
    },
});
