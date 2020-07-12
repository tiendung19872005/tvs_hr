import React, { Component } from "react";
import { AppRegistry, View, TouchableWithoutFeedback, RefreshControl, Image, StatusBar, FlatList, StyleSheet, Platform, Dimensions, TouchableOpacity, Modal, TouchableHighlight } from "react-native";
import {
    Root, Toast, Container, Body, Content, Header, Left, Right, Spinner,
    Icon, Title, Input, Item, ListItem, Label, Button, StyleProvider, getTheme, MonthBox
} from "native-base";
import Calender from '../../SYS/Calender';
import customVariables from '../../../assets/styles/variables';
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import moment from "moment";
import DefaultPreference from 'react-native-default-preference';
import { OnExcute, getUserInfo, getDataJson } from '../../../services/FetchData';
import Loader from '../../SYS/Loader';
import variables from '../../../assets/styles/variables';
import { Block, Text, theme } from "galio-framework";
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconFontisto from 'react-native-vector-icons/Fontisto';
import IconIonicons from 'react-native-vector-icons/Ionicons';

class MBHRIN005 extends Component {
    handleButton(navigate) {
        this.props.navigation.navigate(navigate);
    }
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            numberRecordRender: 5,

            user_pk: '',
            emp_id: '',
            full_name: '',

            isModalOpen: false,
            daySelected: moment(new Date()).format('DD.MM'),
            startingDay: moment(new Date()).format('YYYY-MM-DD'),
            endingDay: moment(new Date()).format('YYYY-MM-DD'),

            short: false,
        }
        this.getData = this.getData.bind(this);
    }

    componentDidMount = async () => {
        DefaultPreference.getAll().then(async (valueAll) => {
            user_pk = valueAll['user_pk'];
            full_name = valueAll['username'];
            emp_id = valueAll['emp_id'];
            //org_pk = valueAll['org_pk'];

            await this.setState(
                { user_pk: user_pk, emp_id: emp_id, full_name: full_name, },
                await this.getData
            )
        })
    }

    getData = async (p_fromdate = moment(this.state.startingDay).format("YYYYMMDD"), p_todate = moment(this.state.endingDay).format("YYYYMMDD")) => {
        let that = this;
        this.setState({
            loading: true, //isModalOpen: false,
        });
        let procedure = "STV_HR_SEL_MBI_MBHRIN005_0";
        let para = `${this.state.user_pk}|${p_fromdate}|${p_todate}|${'ALL'}|${'ALL'}|${this.state.full_name}`;

        console.log("log para:---------->" + para);
        await getDataJson(procedure, para, '1')
            .then((res) => {
                console.log(res);
                let data_info = res.objcurdatas[0];
                if (data_info.totalrows > 0) {
                    that.setState({ data: data_info.records, short: false });
                } else {
                    that.setState({ data: [] });
                }
                that.setState({ loading: false, });
            });
    }

    reverseData = () => {
        this.setState({ data: this.state.data.reverse(), short: !this.state.short })
    }

    renderRow = ({ item, index }) => {
        return (
            <View
                style={{
                    marginHorizontal: 10, margin: 5, borderRadius: 8, paddingRight: 10, paddingTop: 5, paddingBottom: 7
                /* backgroundColor: index % 2 == 0 ? variables.cardCustomBg0 : variables.cardCustomBg1,*/,
                    backgroundColor: 'white'
                }}>
                <View style={styles.cart, { borderBottomWidth: 0.5, borderColor: 'gray', paddingBottom: 5, marginBottom: 7, marginLeft: 5 }}>
                    <Text style={[styles.textCartHeder, { marginTop: 0, paddingTop: 0, alignSelf: 'flex-start' }]}>Ngày: <Text style={{ color: variables.textValue }}>{moment(item.abs_dt).format('DD-MM-YYYY')}</Text></Text>
                    {/* <Text style={[styles.textCartHeder, { marginTop: 0, paddingTop: 0, position: 'absolute', right: 0, color: variables.backgroundColorTV  }]}>{item.emp_pk}</Text> */}
                    {/* <Text style={[styles.textCartHeder, { marginTop: 0, paddingTop: 0, position: 'absolute', right: 0, color: variables.backgroundColorTV  }]}>{item.day_type}</Text> */}
                </View>

                <View style={{ borderWidth: 0.7, borderColor: '#d9e1e8', borderRadius: 10, marginLeft: 5 }}>
                    <View style={[styles.cart1, { borderTopWidth: 0 }]}>
                        <Left>
                            <Text style={styles.textCart1}>Loại vắng: </Text>
                        </Left>
                        <Right style={styles.borderLeft}>
                            <Text style={[styles.textCart1Value, {}]}>{item.abs_type}</Text>
                        </Right>
                    </View>

                    <View style={styles.cart1}>
                        <Left>
                            <Text style={styles.textCart1}>Giờ vắng từ(<IconAntDesign style={{ fontWeight: '1000', color: variables.textValue }} name='login' />)<IconAntDesign style={{ fontWeight: '1000' }} name='arrowright' />đến(<IconAntDesign style={{ fontWeight: '1000', color: variables.textValue }} name='logout' />): </Text>
                        </Left>
                        <Right style={styles.borderLeft}>
                            <Text style={[styles.textCart1Value, {}]}>
                                <IconAntDesign style={{ fontWeight: '1000', }} name='login'></IconAntDesign> {!!item.start_hours ? item.start_hours : `--:--`} | <IconAntDesign style={{ fontWeight: '1000', }} name='logout'></IconAntDesign> {!!item.end_hours ? item.end_hours : `--:--`}
                            </Text>
                        </Right>
                    </View>

                    <View style={styles.cart1}>
                        <Left>
                            <Text style={styles.textCart1}>Giờ vắng: </Text>
                        </Left>
                        <Right style={styles.borderLeft}>
                            <Text style={[styles.textCart1Value, {}]}>{item.abs_hours}</Text>
                        </Right>
                    </View>

                    <View style={styles.cart1}>
                        <Left>
                            <Text style={styles.textCart1}>Lý do vắng: </Text>
                        </Left>
                        <Right style={styles.borderLeft}>
                            <Text style={[styles.textCart1Value, {}]}>{item.description}</Text>
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

    getResponseCalendar = async (result) => {
        await setTimeout(() => this.setState({
            isModalOpen: false,
            startingDay: result.startingDay, endingDay: result.endingDay,
            daySelected: result.daySelected
        }), 100)
        await this.getData(result.startingDay, result.endingDay);
    }

    render() {
        const lengthData = this.state.data.length;

        return (
            <StyleProvider style={getTheme(customVariables)}>
                <Root>
                    <Container>
                        <Loader loading={this.state.loading} />
                        <View style={{ flexDirection: 'row', }}
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
                                    <Icon style={[GlobalStyles.iconHeader, { color: 'black', fontSize: 22, color: theme.COLORS.ICON, marginLeft: 3 }]} name="calendar" />
                                    <Text style={{ marginHorizontal: 'auto', marginVertical: 'auto', marginLeft: 6, marginRight: 6, marginTop: '0.5%', color: theme.COLORS.ICON, fontSize: 15 }}>Ngày nghỉ: {this.state.daySelected}</Text>
                                    <Icon style={[GlobalStyles.iconHeader, { color: 'black', marginTop: 4 }]} name="arrow-dropdown" />
                                </TouchableOpacity>
                            </View>
                            <Right style={{ flexDirection: 'row', justifyContent: 'flex-end', marginRight: 15, }}>
                                <TouchableOpacity success onPress={() => this.reverseData()} style={[{ borderRadius: 5, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff' }]} >
                                    <IconFontisto style={[GlobalStyles.iconHeader, { color: 'black', marginTop: 0, fontSize: 21, color: variables.textValue, paddingLeft: 0, marginLeft: 0 }]} name={this.state.short ? 'arrow-up-l' : 'arrow-down-l'} />
                                    <IconMaterialIcons style={[GlobalStyles.iconHeader, { color: 'black', marginTop: 0, marginBottom: 12, }]} name="short-text" />
                                    <IconAntDesign style={[GlobalStyles.iconHeader, { color: 'black', fontSize: 24, color: theme.COLORS.ICON, marginRight: 3 }]} name="filter" />
                                </TouchableOpacity>
                            </Right>
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
                            <FlatList style={[{ flex: 1, backgroundColor: lengthData > 0 ? variables.cardCustomBg0 : 'white' }]}
                                extraData={this.state}
                                data={this.state.data.slice(0, this.state.numberRecordRender)}
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
                            :
                            <View>
                                <View style={[styles.cart, { backgroundColor: variables.cardCustomBg0, borderTopColor: '#9FA5AA', borderTopWidth: 1 }]}>
                                    <Text style={{
                                        flex: 1, marginVertical: '10%',
                                        textAlign: 'center', color: variables.textValue, fontWeight: 'bold',
                                        fontSize: 17
                                    }}>{variables.textNullValue}</Text>
                                </View>
                            </View>
                        }

                    </Container>
                </Root>

            </StyleProvider>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'gray'
    },
    container1: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        // justifyContent: 'center',
        // alignItems: 'stretch',
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
    calendar: {
        borderTopWidth: 1,
        paddingTop: 5,
        borderBottomWidth: 1,
        borderColor: '#eee',
        width: '100%',
        height: '100%',

    },
    text: {
        textAlign: 'center',
        borderColor: '#bbb',
        padding: 10,
        backgroundColor: '#eee'
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
    },
    borderLeft: {
        borderLeftColor: '#d9e1e8', borderLeftWidth: 0.8
    }
});

export default MBHRIN005;

