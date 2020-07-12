import React from 'react';
import { FlatList, ToastAndroid, PermissionsAndroid, Platform, Dimensions, Alert, StyleSheet, Image, ActivityIndicator, View, TouchableOpacity, ImageBackground, TouchableHighlight, Button as Button1, ListView } from 'react-native';
import {
    Root, Toast, Container, ListItem, Body, Content, Header, Left, Right, Spinner,
    Title, Input, dataMonth, Label, Text, StyleProvider, getTheme, MonthBox
} from "native-base";
import { RNCamera } from 'react-native-camera';
import { Avatar, colors, Button } from 'react-native-elements';
import variables from '../../../assets/styles/variables.js';
import Icon from 'react-native-vector-icons/Ionicons';
import GlobalStyles from '../../../assets/styles/GlobalStyles.js';
import Loader from '../../SYS/Loader';
import moment from 'moment';
import DefaultPreference from 'react-native-default-preference';
import { OnExcute, getUserInfo, getDataJson, UploadImage } from '../../../services/FetchData';
import { CheckBox } from 'react-native-elements';
const { width, height } = Dimensions.get('window');
const gutter = 0;

export default class MBHRRE009_1 extends React.Component {

    constructor(props) {
        super(props);
        console.disableYellowBox = true;
        // console.log(this.state.imgRegisted)
        this.state = {
            checked: false,
            checkboxes: [],
            numberCheck: 0,

            loading: false,

            p_ipserver: '',
            p_nameapi: '',
            recognize_face_id: '',

            imgRegisted: [],
        }
    }



    componentDidMount = async () => {

        let that = this;
        DefaultPreference.getAll().then(async (valueAll) => {
            let user_pk = valueAll['user_pk'];
            let username = valueAll['username'];
            let p_ipserver = valueAll['serverip'] || variables.ipServer.trim();
            let p_nameapi = valueAll['nameapi'] || variables.nameApi.trim();
            let recognize_face_id = valueAll['recognize_face_id'] || variables.nameApi.trim();
            await that.setState(
                { dt_emp_pk: user_pk, dt_crt_by: username, p_ipserver: p_ipserver, p_nameapi: p_nameapi, recognize_face_id },
            ),
                await this.getData();
        })
    }

    toggleCheckbox(recognizeface_id) {
        let checkboxes = this.state.checkboxes;
        if (checkboxes && checkboxes.includes(recognizeface_id)) {
            const index = checkboxes.indexOf(recognizeface_id);
            checkboxes.splice(index, 1);
        } else {
            checkboxes = [...checkboxes, recognizeface_id];
        }
        this.setState({ checkboxes, numberCheck: checkboxes.length });
    }

    getData = async () => {
        this.setState({ loading: true })
        let procedure = "STV_HR_SEL_MBI_MBHRRE009";
        let para = `GET_IMG|${this.state.dt_emp_pk}`;
        // console.log(para + 'sss');
        await getDataJson(procedure, para, '1')
            .then((res) => {
                // console.log(res);
                let data_info = res.objcurdatas[0];
                if (res.results == 'S') {
                    this.setState({ loading: false, imgRegisted: data_info.records });
                } else {
                    this.setState({ loading: false });
                    let toast = variables.toastError;
                    variables.toastError.text = res.error[1].mgs.substring(11) || 'Lỗi khi tải hình ảnh!'
                    Toast.show(toast);
                }
            }).catch(() => {
                this.setState({ loading: false })
            });
    }

    deleteFace = async () => {
        if (this.state.checkboxes.length > 0) {
            this.setState({ loading: true });
            // let url = `http://${this.state.p_ipserver}/${this.state.p_nameapi}/api/mobile/?pk=${this.state.dt_emp_pk}&name=${this.state.dt_crt_by}&personId=${this.state.recognize_face_id}&method=DELETE`
            let url = `http://${this.state.p_ipserver}/${this.state.p_nameapi}/CreatePerson`
            console.log(url)
            let res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pk: this.state.dt_emp_pk,
                    name: this.state.dt_crt_by,
                    personId: this.state.recognize_face_id,
                    method: 'DELETE',
                    imageBase64List: this.state.checkboxes
                })
            }).then((res) => res.json()).then(response => (response.d.Result));
            console.log(res);
            if (!res.includes('FaceId không tồn tại!')) {
                await this.getData();
                let toast = variables.toastSuccessful;
                variables.toastSuccessful.text = 'Xóa hình ảnh thành công!';
                Toast.show(toast);
            } else {
                await this.getData();
                let toast = variables.toastError;
                variables.toastError.text = 'FaceId không tồn tại!';
                Toast.show(toast);
            }
            this.setState({ loading: false, checkboxes: [], numberCheck: 0 })
        }
    }

    render() {
        const checkboxes = this.state.checkboxes;

        return (
            <StyleProvider style={getTheme(variables)}>
                <Root>
                    <Container>
                        <Loader loading={this.state.loading} />
                        <View style={[GlobalStyles.rowCenter, { marginLeft: '4%', marginVertical: 10 }]}>
                            <Button
                                icon={
                                    <Icon
                                        style={[GlobalStyles.iconHeader, { fontSize: 22, marginLeft: 5, marginBottom: '3%', height: '100%', fontWeight: '800' }]}
                                        name="ios-close"
                                    />
                                }
                                onPress={() => this.deleteFace()}
                                iconContainerStyle={{ marginLeft: 15, paddingLeft: 15 }}
                                buttonStyle={{ height: 33, backgroundColor: 'red' }}
                                raised
                                iconRight
                                loading={false}
                                title="Xóa hình"
                                titleStyle={{ fontSize: 13, fontWeight: '800', marginTop: 0, paddingTop: 0, marginBottom: 0, paddingBottom: 0 }}
                            />
                        </View>
                        <View style={[GlobalStyles.row, { flex: 0, }]}>
                            <View style={[GlobalStyles.rowLeft, { marginLeft: '3%' }]}>
                                <Text style={[styles.textCart, {}]} >Tổng số hình: <Text style={[styles.textCart, { color: variables.textValue }]}>{this.state.imgRegisted.length}</Text></Text>
                            </View>
                            <View style={[GlobalStyles.rowRight, { marginLeft: '17.5%' }]}>
                                <Text style={[styles.textCart, {}]} >Tổng số hình đã chọn: <Text style={[styles.textCart, { color: variables.textValue }]}>{this.state.numberCheck}</Text></Text>
                            </View>
                        </View>
                        {/* <View style={[styles.parent, {}]}> */}
                        <FlatList
                            style={{ flex: 1, backgroundColor: '#FFF' }}
                            extraData={this.state}
                            data={this.state.imgRegisted}
                            numColumns={2}
                            keyExtractor={(item, index) => { item.recognizeface_id }}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={styles.child}>
                                        <Image
                                            style={[, {
                                                flex: 1,
                                                resizeMode: 'contain',
                                            }]}
                                            source={{
                                                uri: item.base64data
                                            }}
                                        />
                                        <CheckBox
                                            size={30}
                                            checkedColor={variables.textValue}
                                            containerStyle={{
                                                padding: 0, margin: 0,
                                                marginRight: 0, marginLeft: 8,
                                                alignItems: 'flex-end',
                                                paddingTop: 5
                                            }}
                                            onPress={() => this.toggleCheckbox(item.recognizeface_id)}
                                            checked={checkboxes && checkboxes.includes(item.recognizeface_id)}
                                        />
                                    </View>

                                )
                            }}
                        />
                        {/* </View> */}

                    </Container>
                </Root>
            </StyleProvider>
        )
    }

}
const styles = StyleSheet.create({
    // parent: {
    //     // width: '100%',
    //     flexDirection: 'row',
    //     flexWrap: 'wrap',
    //     // flex: 1,
    //     backgroundColor: variables.cardCustomBg1
    //     // alignItems: 'flex-start',
    //     // padding: 16,
    // },
    child: {
        width: '47.5%',
        margin: 5,
        aspectRatio: 1.3,
        borderColor: variables.cardBorderColor,
        borderWidth: 0.5,
        borderRadius: 5,
        flexDirection: "row",

        // marginBottom: '3%'
        backgroundColor: '#FFF',
        // marginBottom: 16
    },
    item: {
        width: (width - gutter * 3) / 2,
        marginBottom: gutter,
        flexDirection: 'column',
        alignSelf: 'flex-start',
        backgroundColor: '#ff0000',
    },
    list: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        paddingHorizontal: gutter,
    },
    cart: {
        flexDirection: 'row',
        borderTopWidth: 0.5,
        borderColor: '#d9e1e8',
        //marginLeft: 5,
        // marginRight: 10,
    },
    textCart: {
        marginTop: 1,
        marginBottom: 1,
        //fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 5,
        fontWeight: '400',

    }
});