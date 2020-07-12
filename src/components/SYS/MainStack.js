import React, { Component } from 'react';
import { Platform, Dimensions, ActivityIndicator, StatusBar, StyleSheet, SliderBase } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Icon, Button, View } from "native-base";
import GlobalStyles from "../../assets/styles/GlobalStyles";
import DefaultPreference from 'react-native-default-preference';

import MBHRIN001 from '../../components/HR/IN/MBHRIN001';
import MBHRIN002 from '../../components/HR/IN/MBHRIN002';
import MBHRIN003 from '../../components/HR/IN/MBHRIN003';
import MBHRIN004 from '../../components/HR/IN/MBHRIN004';
import MBHRIN005 from '../../components/HR/IN/MBHRIN005';
import MBHRIN007 from '../../components/HR/IN/MBHRIN007';
import MBHRIN009 from '../../components/HR/IN/MBHRIN009';

import MBHRRE001 from '../../components/HR/RE/MBHRRE001';
import MBHRRE002 from '../../components/HR/RE/MBHRRE002';
import MBHRRE003_IOS from '../../components/HR/RE/MBHRRE003_IOS';
import MBHRRE003_Android from '../../components/HR/RE/MBHRRE003_Android';
import MBHRRE004 from '../HR/RE/MBHRRE004';
import MBHRRE005 from '../HR/RE/MBHRRE005';
import MBHRRE007 from '../../components/HR/RE/MBHRRE007';
import MBHRRE008 from '../../components/HR/RE/MBHRRE008';
import MBHRRE009 from '../../components/HR/RE/MBHRRE009';
import MBHRRE009_1 from '../../components/HR/RE/MBHRRE009_1';

import MBHRAP001 from '../../components/HR/AP/MBHRAP001';
import MBHRAP002 from '../../components/HR/AP/MBHRAP002';
import MBHRAP004 from '../../components/HR/AP/MBHRAP004';

import MBHRAN001 from '../../components/HR/AN/MBHRAN001';
import MBHRAN002 from '../../components/HR/AN/MBHRAN002';
import MBHRAN003 from '../../components/HR/AN/MBHRAN003';
import MBHRAN004 from '../../components/HR/AN/MBHRAN004';
import MBHRAN005 from '../../components/HR/AN/MBHRAN005';

import HelpScreen from '../../components/HR/HRHelp';
import LoginScreen from './SYSLogin';
import MBHRMN from '../../components/HR/MN/MBHRMN';
import BottomNavigation from '../../components/HR/BottomNavigation';
import MainNaivigation from '../../components/HR/MainNaivigation';
import HRSidebar from '../../components/HR/HRSidebar';

import ResetPasswordScreen from './SYSResetPass';
import ConfigScreen from './SYSConfig';
import SYSPin from './SYSPin';
import variables from '../../assets/styles/variables';
const platform = Platform.OS;
// console.log(variables.checkStyleHome._55 + 'huy');

const AppStack = createStackNavigator({
    HRMain: { screen: variables.checkStyleHome._55 == 'BOTTOM' ? BottomNavigation : MainNaivigation },
    // HRMain: { screen: MainNaivigation },
    MBHRMN: { screen: MBHRMN },

    MBHRIN001: { screen: MBHRIN001 },
    MBHRIN002: { screen: MBHRIN002 },
    MBHRIN003: { screen: MBHRIN003 },
    MBHRIN004: { screen: MBHRIN004 },
    MBHRIN005: { screen: MBHRIN005 },
    MBHRIN007: { screen: MBHRIN007 },
    MBHRIN009: { screen: MBHRIN009 },

    MBHRRE001: { screen: MBHRRE001 },
    MBHRRE002: { screen: MBHRRE002 },
    MBHRRE003: { screen: platform === 'ios' ? MBHRRE003_IOS : MBHRRE003_Android },
    MBHRRE004: { screen: MBHRRE004 },
    MBHRRE005: { screen: MBHRRE005 },
    MBHRRE007: { screen: MBHRRE007 },
    MBHRRE008: { screen: MBHRRE008 },
    MBHRRE009: { screen: MBHRRE009 },
    MBHRRE009_1: { screen: MBHRRE009_1 },

    MBHRAP001: { screen: MBHRAP001 },
    MBHRAP002: { screen: MBHRAP002 },
    MBHRAP004: { screen: MBHRAP004 },

    MBHRAN001: { screen: MBHRAN001 },
    MBHRAN002: { screen: MBHRAN002 },
    MBHRAN003: { screen: MBHRAN003 },
    MBHRAN004: { screen: MBHRAN004 },
    MBHRAN005: { screen: MBHRAN005 },

    HelpScreen: { screen: HelpScreen },
}, {
    initialRouteName: 'HRMain',
    defaultNavigationOptions: ({ navigation }) => ({
        headerTitle: navigation.getParam('titleHeader'),
        headerStyle: {
            backgroundColor: variables.backgroundColorTV,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomColor: 'black',
            borderBottomWidth: 0,
        },
        headerTintColor: '#ffffff',
        gestureResponseDistance: { horizontal: variables.deviceWidth / 8.5 },
        //headerBackTitle: null,
        headerLeft: (
            <Button
                transparent
                onPress={() => navigation.goBack(null)} >
                <Icon style={GlobalStyles.iconHeader} name={'ios-arrow-back'} ></Icon>
                {/* <Text>{navigation.getParam('titleHeader')}</Text> */}
            </Button>),
        headerRight: (
            <Button
                transparent
            // onPress={() => navigation.openDrawer(null)}
            >
                <Icon style={GlobalStyles.iconHeader} name='ios-help-circle-outline' />
            </Button>),
        headerMode: 'screen',
    })
});
const DrawerNavigator = createDrawerNavigator(
    {
        DrawerNavigator: { screen: AppStack },
    },

    {
        drawerType: 'front',
        drawerOpenRoute: 'DrawerOpen',
        drawerCloseRoute: 'DrawerClose',
        drawerToggleRoute: 'DrawerToggle',
        // contentComponent: HRSidebar,
        contentComponent: (props) => <HRSidebar {...props} />,
        navigationOptions: {
            drawerLockMode: 'locked-closed',
        },
        // contentOptions: {
        //     activeTintColor: 'red',
        //     activeBackgroundColor: '#6b52ae',
        // },
        drawerWidth: '78%',
        headerMode: 'screen',
        overlayColor: 'rgba(148, 148, 148, 0.28)'
    },
);
const LoginStack = createStackNavigator({
    Login: LoginScreen,
    // ResetPassword: {
    //     screen: ResetPasswordScreen,
    //     navigationOptions: ({ navigation }) => ({
    //         headerTitle: 'This will not show at all',
    //         headerStyle: {
    //             backgroundColor: variables.backgroundColorTV ,
    //         },
    //         headerBackTitle: null,
    //         headerLeft: (
    //             <Button
    //                 transparent
    //                 onPress={() => navigation.goBack(null)} >
    //                 <Icon style={GlobalStyles.iconHeader} name={'ios-arrow-back'} ></Icon>
    //             </Button>)
    //     })
    // },
    ResetPassword: ResetPasswordScreen,
    Config: ConfigScreen,
    PinConfig: SYSPin
}, {
    initialRouteName: 'Login',
    defaultNavigationOptions: ({ navigation }) => ({
        headerStyle: {
            backgroundColor: variables.backgroundColorTV,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomColor: 'black',
            borderBottomWidth: 0,
        },
        headerTintColor: '#ffffff',
        gestureResponseDistance: { horizontal: variables.deviceWidth / 8.5 },
        //headerBackTitle: null,
        headerLeft: (
            <Button
                transparent
                onPress={() => navigation.goBack(null)} >
                <Icon style={GlobalStyles.iconHeader} name={'ios-arrow-back'} ></Icon>
            </Button>)
    })
});


class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        DefaultPreference.get('user_pk').then((value) => {
            this.props.navigation.navigate(value == undefined || value == '' ? 'Login' : 'App');
        })
    };

    // Render any loading content that you like here
    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
const MainStackNavigator = createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        App: DrawerNavigator,
        Login: LoginStack,
    },
    {
        initialRouteName: 'Login',
    }
);

const AppMainStackNavigator = createAppContainer(MainStackNavigator);

export default AppMainStackNavigator;
