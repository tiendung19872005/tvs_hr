
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Loader from '../../SYS/Loader';
import { TextInput as TextInput1, Colors } from 'react-native-paper';


export default class MBHRAP001_1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkboxes: [],
            isDialogVisible: false,
            comment: [],
            commentPk: '',
            dt_crt_by: '',
            dt_emp_pk: '',
            checkAll: false,
            numberCheck: 0,
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

    toggleCheckbox(pk) {
        let checkboxes = this.state.checkboxes;

        if (pk == 'All') {
            checkboxes = [];
            if (this.state.checkAll == true) {
                checkboxes = [];
                this.setState({ checkAll: false, checkboxes, numberCheck: checkboxes.length })
            } else {
                this.props.data.map(item => {
                    checkboxes.push(item.pk);
                })
                this.setState({ checkAll: true, checkboxes, numberCheck: checkboxes.length })
            }
        } else {
            const index = checkboxes.indexOf(pk);
            if (checkboxes && index != -1) {
                checkboxes.splice(index, 1);
            } else {
                checkboxes.push(pk);
            }

            if (checkboxes.length == this.props.data.length) {
                this.setState({ checkAll: true, checkboxes, numberCheck: checkboxes.length });
            } else {
                this.setState({ checkAll: false, checkboxes, numberCheck: checkboxes.length });
            }
        }
    }

    showDialogInput(pk) {
        this.setState({
            isDialogVisible: true,
            commentPk: pk,
        })
    }

    submitInput(inputText) {
        let { comment, commentPk } = this.state;
        this.setState({ isDialogVisible: false });

        if (inputText == '') {
            let index = comment.findIndex(cmt => cmt.pk == commentPk);
            if (index != -1) {
                comment.splice(index, 1);
            }
            // console.log(comment);

        } else {
            let index = comment.findIndex(cmt => cmt.pk == commentPk);
            if (index == -1) {
                comment.push({ pk: commentPk, comment: inputText });
            } else {
                comment[index].comment = inputText;
            }
            // console.log(comment);
        }
        this.setState({ comment });
    }


    updateExperience = async (p_approve_status) => {
        this.setState({ loading: true, })
        let dataSend = [];
        let comment = this.state.comment;
        let checkboxes = this.state.checkboxes;

        if (comment.length == 0) {
            let dataSend_;
            dataSend_ = checkboxes.map(pk => ({ pk: pk, comment: '' }));
            dataSend = dataSend_;
        } else {
            checkboxes.map(item => {
                let itemComment = comment.filter(cmt => cmt.pk == item);
                if (itemComment.length > 0) {
                    dataSend.push({ pk: item, comment: itemComment[0].comment });
                } else {
                    dataSend.push({ pk: item, comment: '' });
                }
            })
        }
        // console.log(dataSend)

        let p_action = 'UPDATE';
        let para = '';
        dataSend.map((item, index) => {
            if (index + 1 == dataSend.length) {
                para += `${p_action}|${item.pk}|${p_approve_status}|${item.comment}|${this.state.dt_emp_pk}|${this.state.dt_crt_by}`;
            } else {
                para += `${p_action}|${item.pk}|${p_approve_status}|${item.comment}|${this.state.dt_emp_pk}|${this.state.dt_crt_by}*|*`;
            }
        })
        // console.log(para);

        let procedure = "STV_HR_UPD_MBI_MBHRAP001_0";
        OnExcute(p_action, procedure, para)
            .then((res) => {
                let data_info = res.objcurdatas[0];

                if (data_info.totalrows > 0) {
                    if (data_info.records[0].status == "OK") {
                        this.setState({
                            loading: false,
                            colorStatus: '#51bc8a',
                            status: 'OK',
                            comment: [],
                            checkboxes: [],
                            checkAll: false,
                            numberCheck: 0
                        });
                        let toast = variables.toastSuccessful;
                        variables.toastSuccessful.text = 'Phê duyệt vắng thành công!'
                        Toast.show(toast)
                        this.calc();

                    } else {
                        this.setState({ loading: false, status: 'NOOK', colorStatus: 'red' });
                        if (data_info.records[0].error_ex != "") {
                            let toast = variables.toastError;
                            toast.text = data_info.records[0].error_ex || data_info.records[0].rtn_value
                            Toast.show(toast)
                            return;
                        } else {
                            let toast = variables.toastError;
                            toast.text = 'Phê duyệt vắng thất bại!'
                            Toast.show(toast)
                            return;
                        }
                    }
                }
                else {
                    this.setState({ loading: false, status: 'NOOK', colorStatus: 'red' });
                    let toast = variables.toastError;
                    toast.text = 'Cập nhật không thành công!'
                    Toast.show(toast)
                }
            }).catch(() => {
                that.setState({ loading: false, });
            });;
    }

    comfirmAlert(p_approve_status) {

        let checkboxes = this.state.checkboxes;
        if (checkboxes == '') {
            let toast = variables.toastError;
            toast.text = 'Phải chọn ít nhất một dòng!'
            Toast.show(toast)
            return;
        }

        Alert.alert(
            'Phê duyệt vắng',
            'Bạn có chắc chắn muốn phê duyệt?',
            [
                { text: 'Hủy', onPress: () => console.log('Cancel Pressed'), style: 'destructive' },
                { text: 'OK', onPress: async () => { await this.updateExperience(p_approve_status); } }
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
            let username = valueAll['username'];
            //let emp_id = valueAll['emp_id'];
            //org_pk = valueAll['org_pk'];

            await that.setState({ dt_emp_pk: user_pk, dt_crt_by: username, })
        })
    }

    calc() {
        this.props.callback({ status: this.state.status, startingDay: this.props.startingDay, endingDay: this.props.endingDay });
    }

    renderRow = ({ item, index }) => {
        const checkboxes = this.state.checkboxes;
        return (
            <View style={{
                marginHorizontal: 10, marginVertical: 5, paddingBottom: 5, borderRadius: 8,
                backgroundColor: 'white'
            }}>

                <View style={styles.cart, { borderBottomWidth: 0.2, borderColor: 'gray', paddingBottom: 0, marginBottom: 2.5, paddingLeft: 5, flexDirection: 'row', }}>
                    <Text style={[styles.textCartHeder, { marginTop: 0, paddingTop: 0, alignSelf: 'center', }]}>Ngày: <Text style={[styles.textCart1Value, { color: variables.textValue }]}>{moment(item.abs_dt).format('DD-MM-YYYY')}</Text></Text>

                    <CheckBox
                        size={26}
                        checkedColor={variables.textValue}
                        containerStyle={{
                            flex: 1,
                            padding: 0, margin: 0,
                            paddingTop: 0, margin: 0, paddingLeft: 0, paddingRight: 0, paddingBottom: 0,
                            marginRight: 0, marginLeft: 0,
                            alignItems: 'flex-end',
                        }}
                        onPress={() => this.toggleCheckbox(item.pk)}
                        checked={checkboxes && checkboxes.includes(item.pk)}
                    />


                </View>

                <View style={{ flexDirection: 'row', }}>
                    <Body style={{ borderColor: '#eeee', borderRadius: 5, borderWidth: 1, marginLeft: 5, }}>
                        <View style={styles.cart}>
                            <Text style={styles.textCart}>Mã nhân viên: </Text>
                            <Right>
                                <Text style={[styles.textCart1Value, { color: variables.textValue }]}>{item.emp_id}</Text>
                            </Right>
                            <View style={GlobalStyles.spaceHorizontalSmall}></View>
                        </View>

                        <View style={styles.cart}>
                            <Text style={styles.textCart}>Họ tên: </Text>
                            <Right>
                                <Text style={[styles.textCart1Value, { color: variables.textValue }]}>{item.full_name}</Text>
                            </Right>
                            <View style={GlobalStyles.spaceHorizontalSmall}></View>
                        </View>

                        <View style={styles.cart}>
                            <Text style={styles.textCart}>Giờ nghỉ từ - đến: </Text>
                            <Right>
                                <Text style={[styles.textCart1Value, { color: variables.textValue, }]}>
                                    {!!item.start_hours ? item.start_hours : `--:--`} - {!!item.end_hours ? item.end_hours : `--:--`}
                                </Text>
                            </Right>
                            <View style={GlobalStyles.spaceHorizontalSmall}></View>
                        </View>

                        <View style={styles.cart}>
                            <Text style={styles.textCart}>Lý do vắng: </Text>
                            <Right>
                                <Text style={[styles.textCart1Value, { color: variables.textValue }]}>{item.reason_type}</Text>
                            </Right>
                            <View style={GlobalStyles.spaceHorizontalSmall}></View>
                        </View>

                        <View style={styles.cart, { flex: 1, flexDirection: "row" }}>
                            <TextInput1
                                mode='outlined'
                                style={{ marginLeft: 5, marginTop: 5, flex: 0.99 }}
                                underlineColorAndroid="transparent"
                                label='Mô tả'
                                multiline={true}
                                editable={false}
                                scrollEnabled={false}
                                value={!!item.description ? item.description : ' '}
                                theme={{
                                    colors: {
                                        // placeholder: variables.backgroundColorTV,
                                        text: variables.textValue, primary: variables.textValue,
                                        underlineColor: variables.backgroundColorTV, background: '#ffff'
                                    },
                                }}
                                baseColor={variables.textValue}
                                labelFontSize={variables.textValue}
                            />
                            <View style={{ alignItems: 'center', flex: 0.09, justifyContent: 'center' }}>
                                <TouchableOpacity onPress={() => this.showDialogInput(item.pk)}>
                                    <MaterialCommunityIcons name='comment-text' style={{ color: variables.listBorderColor, fontSize: 27, }} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {this.state.comment.map((prop, index) => {
                            return (
                                prop.pk == item.pk ?
                                    <View style={styles.cart} key={index}>
                                        <Text style={[styles.textCart, { fontWeight: 'bold', fontStyle: 'italic' }]}>Phản hồi: </Text>
                                        <Right>
                                            <Text style={[styles.textCart1Value, { color: variables.textValue, fontWeight: 'bold', fontStyle: 'italic' }]}>{prop.comment}</Text>

                                        </Right>
                                        <View style={GlobalStyles.spaceHorizontalSmall}></View>
                                    </View>
                                    :
                                    <View key={index}></View>
                            );
                        })}

                    </Body>

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

    render() {
        const lengthDataProps = this.props.data.length;
        return (
            <Container>
                <Loader loading={this.state.loading} />

                {lengthDataProps > 0 ?
                    <View>
                        <View style={[GlobalStyles.row, { flex: 0, marginVertical: 2, paddingBottom: 0 }]}>
                            <View style={[GlobalStyles.rowLeft, { marginRight: '5%' }]}>
                                <Button
                                    icon={
                                        <Icon
                                            style={[GlobalStyles.iconHeader, { fontSize: 22, marginLeft: 5, marginBottom: '8%', height: '100%' }]}
                                            name="ios-checkmark"
                                        />
                                    }
                                    onPress={() => { this.comfirmAlert(2) }}
                                    iconContainerStyle={{ marginLeft: 15, paddingLeft: 15 }}
                                    buttonStyle={{ height: 33, backgroundColor: variables.brandSuccess }}
                                    raised
                                    iconRight
                                    loading={false}
                                    title="Phê duyệt"
                                    titleStyle={{ fontSize: 12, fontWeight: '600', marginTop: 0, paddingTop: 0, marginBottom: 0, paddingBottom: 0 }}
                                />

                            </View>
                            <View style={[, { marginRight: '3%' }]}>
                                <Button
                                    icon={
                                        <Icon
                                            name="ios-close"
                                            style={[GlobalStyles.iconHeader, { fontSize: 20, marginLeft: 5, marginBottom: '2%', height: '100%' }]}
                                        />
                                    }
                                    onPress={() => this.comfirmAlert(3)}
                                    iconContainerStyle={{ marginLeft: 15, paddingLeft: 15 }}
                                    buttonStyle={{ height: 33, backgroundColor: 'red' }}
                                    raised
                                    iconRight
                                    loading={false}
                                    title="Không phê duyệt"
                                    titleStyle={{ fontSize: 12, fontWeight: '600', marginTop: 0, paddingTop: 0, marginBottom: 0, paddingBottom: 0 }}

                                />
                            </View>
                            <View style={[GlobalStyles.rowRight, { marginRight: '2.2%', }]}>
                                <CheckBox
                                    iconRight={true}
                                    center={true}
                                    title='Tất cả'
                                    textStyle={{ color: variables.brandLight }}
                                    size={30}
                                    checkedColor={variables.backgroundColorTV}
                                    containerStyle={{
                                        paddingTop: 2.4, paddingBottom: 1, paddingLeft: 0, paddingRight: 0
                                    }}
                                    onPress={() => this.toggleCheckbox('All')}
                                    checked={this.state.checkAll}
                                />
                            </View>
                        </View>
                        <View style={[GlobalStyles.row, { flex: 0, }]}>
                            <View style={[GlobalStyles.rowLeft, { marginLeft: '3%' }]}>
                                <Text style={[styles.textCart, {}]} >Tổng số dòng: <Text style={[styles.textCart, { color: variables.textValue }]}>{lengthDataProps}</Text></Text>
                            </View>
                            <View style={[GlobalStyles.rowRight, { marginLeft: '17.5%' }]}>
                                <Text style={[styles.textCart, {}]} >Tổng số dòng đã chọn: <Text style={[styles.textCart, { color: variables.textValue }]}>{this.state.numberCheck}</Text></Text>
                            </View>
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
                />


                <DialogInput isDialogVisible={this.state.isDialogVisible}
                    title={"Ghi chú"}
                    //message={""}ssss
                    hintInput={"Nhập nội dung"}
                    modalStyle={{ backgroundColor: 'rgba(0,0,0,.5)' }}
                    submitText='Ok'
                    cancelText='Hủy'
                    textInputProps={{ height: 20, backgroundColor: 'red' }}
                    submitInput={(inputText) => { { this.submitInput(inputText) } }}
                    closeDialog={() => { this.setState({ isDialogVisible: false }) }}>
                </DialogInput>

            </Container>

        );
    }
}
const styles = StyleSheet.create({
    cart: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderColor: '#d9e1e8',
        //marginLeft: 5,
        // marginRight: 10,
    },
    textCart: {
        marginVertical: 2.5,
        //fontWeight: 'bold',
        fontSize: 15,
        marginLeft: 5,
        fontWeight: '400',

    },
    textCartHeder: {
        marginTop: 0,
        marginBottom: 0,
        textAlign: 'center',
        color: 'black',
        //fontWeight: 'bold',
        fontSize: 15.7,
    },

    textAreaContainer: {
        //borderColor: variables.textValue,
        //borderWidth: 1,
        // padding: 5,
        width: '92.2%',
        marginVertical: 5,
        // marginHorizontal: 15,
        justifyContent: "center"
    },
    textCart1Value: {
        //marginLeft: 10,
        marginRight: 3,
        marginVertical: 2.5,
        fontWeight: 'bold',
        fontSize: 15,
        //fontWeight: '300',
        color: variables.textValue
    },
    textAreaContainer: {
        //borderColor: variables.textValue,
        //borderWidth: 1,
        // padding: 5,
        width: '92.2%',
        marginVertical: 5,
        marginHorizontal: 15,
        justifyContent: "center"
    },
    textArea: {
        height: 50,
        //justifyContent: "flex-start"
    },
});
