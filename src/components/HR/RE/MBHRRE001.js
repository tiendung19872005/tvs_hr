import React, { Component } from 'react';
import {
    View, TextInput, Image, KeyboardAvoidingView, ScrollView, StyleSheet, Modal,
    TouchableHighlight, TouchableOpacity, SafeAreaView, ImageBackground, ActivityIndicator
} from 'react-native';
import {
    Root, Toast, Container, Body, Content, Header, Left, Right, Picker, Spinner,
    Title, Input, Item, Label, Button, Text, StyleProvider, getTheme, Icon, CheckBox, Tab, Tabs, TabHeading, Badge
} from "native-base";
import customVariables from '../../../assets/styles/variables';
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import MBHRRE001_1 from "./MBHRRE001_1";
import MBHRRE001_2 from "./MBHRRE001_2";
import variables from '../../../assets/styles/variables';
import { Block, theme } from "galio-framework";
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export default class MBHRRE001 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataDaXN: [],
            dataChoXN: [],
            choXN: 0,
            daXN: 0,
            loading: false,
            arrayDataInserted: [],
            arrayDataCanceled: [],

            reloadData: false,
        };
    }

    onChangeTab(i) {
        if (this.state.arrayDataInserted.length > 0 || this.state.arrayDataCanceled.length > 0) {
            this.setState({ arrayDataInserted: [], arrayDataCanceled: [], reloadData: !this.state.reloadData })
        }
    }

    getResponse(result) {
        this.setState({ arrayDataInserted: result.arrayDataInserted })
    }

    getResponse1(result) {
        this.setState({ arrayDataCanceled: result.arrayDataCanceled })
    }

    render() {
        return (
            <StyleProvider style={getTheme(customVariables)}>
                <Root>
                    <Container>
                        <Tabs
                            style={{}}
                            tabBarActiveTextColor={variables.backgroundColorTV}
                            tabBarUnderlineStyle={{ backgroundColor: variables.backgroundColorTV }}
                            initialPage={0}
                            scrollWithoutAnimation={false}
                            tabBarPosition='top'
                            onChangeTab={({ i }) => this.onChangeTab(i)}
                        >
                            <Tab
                                heading={
                                    <TabHeading style={{ backgroundColor: variables.tabBgColor, borderColor: 'gray', borderBottomWidth: 0.5 }}>
                                        <Text style={{ fontSize: 15, color: 'black' }}>Đăng kí vắng</Text>
                                        <IconMaterialCommunityIcons style={[GlobalStyles.iconHeader, { fontSize: 23, color: variables.textValue }]} name="content-save-edit-outline" />
                                    </TabHeading>
                                }>
                                <MBHRRE001_1
                                    callback={this.getResponse.bind(this)}
                                    reloadData={this.state.reloadData}
                                // data={this.state.dataChoXN}
                                />
                            </Tab>
                            <Tab
                                heading={
                                    <TabHeading style={{ backgroundColor: variables.tabBgColor, borderColor: 'gray', borderLeftWidth: 0.5, borderBottomWidth: 0.5 }}>
                                        <Text style={{ fontSize: 15, color: 'black' }}>Lịch sử</Text>
                                        <IconMaterialCommunityIcons style={[GlobalStyles.iconHeader, { fontSize: 23, color: variables.textValue }]} name="history" />
                                    </TabHeading>
                                }>
                                <MBHRRE001_2
                                    callback={this.getResponse1.bind(this)}
                                    reloadData={this.state.reloadData}
                                // data={this.state.dataDaXN}
                                />
                            </Tab>
                        </Tabs>

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
        justifyContent: 'center',
        alignItems: 'stretch',
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

});
