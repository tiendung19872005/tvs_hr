import React, { Component } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { Title, Input, Item, Label, Button, Icon as Icon1, Text, StyleProvider, getTheme } from "native-base";
import { createAppContainer, SwitchActions } from "react-navigation";
import { createBottomTabNavigator } from 'react-navigation-tabs';
import MBHRMN from "./MN/MBHRMN";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import DefaultPreference from "react-native-default-preference";
import { OnExcute, getDataJson, UploadImage } from "../../services/FetchData";
import Loader from "../SYS/Loader";
import GlobalStyles from "../../assets/styles/GlobalStyles";
import variables from "../../assets/styles/variables";
import NetInfo from "@react-native-community/netinfo";
import { variance } from "@babel/types";



export default class BottomNavigation extends Component {

  static navigationOptions = ({ navigation }) => {
    if (navigation.state.params != undefined) {
      return {
        headerTitle: navigation.state.params.myTitle,
        headerStyle: {
          backgroundColor: variables.backgroundColorTV,
        },
        headerTitleStyle: {
          fontWeight: "bold"
        },

        headerLeft: (
          <Button
            transparent
            onPress={() => navigation.openDrawer()}
          >
            <Icon1
              style={[
                GlobalStyles.iconHeader,
                { fontSize: 25, fontWeight: "bold" }
              ]}
              name="menu"
            />
          </Button >
        ),
        headerRight: (
          <Button
            transparent
          // onPress={() => navigation.openDrawer(null)}
          >
            <Icon1 style={GlobalStyles.iconHeader} name="ios-help-circle-outline" />
          </Button>
        )
      };
    }
  };

  constructor(props) {
    // console.disableYellowBox = true;
    super(props);
    this.state = {
      dataMenuMBHRIN: [],
      dataMenuMBHRRE: [],
      dataMenuMBHRAP: [],
      dataMenuMBHRAN: [],
      dataMenuMBHRMN: [],
      //loading: false,
      titleHeader: "",

      routeName: '',
    };

    this.getData();

    this.TabNavigator = createBottomTabNavigator(
      /*createBottomTabNavigator*/ {
        MBHRIN: {
          // screen: (props) => <MBHRMN {...props} navigation={this.props.navigation} titleHeader="Truy vấn thông tin" nameTab="MBHRIN" dataMenu={this.state.dataMenuMBHRIN} />,
          screen: props => (
            <MBHRMN
              {...props}
              navigation={this.props.navigation}
              nameTab="MBHRIN"
              dataMenu={this.state.dataMenuMBHRIN}
            />
          ),
          navigationOptions: {
            tabBarLabel: "Thông tin",
            shifting: false,
            tabBarIcon: ({ tintColor }) => (
              <View>
                <MaterialCommunityIcons
                  style={[{ color: tintColor, fontWeight: 100 }]}
                  type="material-community"
                  size={25}
                  name="account-circle-outline"
                  name={
                    this.props.navigation.state.params != undefined
                      ? this.props.navigation.state.params.myTitle == "Truy vấn thông tin"
                        ? "account-circle" : "account-circle-outline"
                      : "account-circle"
                  }
                />
              </View>
            ),
            tabBarOnPress: ({ navigation, defaultHandler }) => {
              this.props.navigation.setParams({ myTitle: "Truy vấn thông tin" });
              defaultHandler();
            }
          }
        },
        MBHRRE: {
          // screen: (props) => <MBHRMN {...props} navigation={this.props.navigation} titleHeader="Đăng kí xác nhận" nameTab="MBHRRE" dataMenu={this.state.dataMenuMBHRRE} />,
          screen: props => (
            <MBHRMN
              {...props}
              navigation={this.props.navigation}
              nameTab="MBHRRE"
              dataMenu={this.state.dataMenuMBHRRE}
            />
          ),
          navigationOptions: {
            tabBarLabel: "Đăng ký",
            shifting: false,
            tabBarIcon: ({ tintColor }) => (
              <View>
                <MaterialCommunityIcons
                  style={[{ color: tintColor, fontWeight: 100 }]}
                  type="material-community"
                  size={25}
                  name={
                    this.props.navigation.state.params != undefined
                      ? this.props.navigation.state.params.myTitle == "Đăng kí xác nhận"
                        ? "pencil-circle" : "pencil-circle-outline"
                      : "pencil-circle"
                  }
                />
              </View>
            ),
            //activeColor: '#f60c0d',
            //inactiveColor: '#f65a22',
            //barStyle: { backgroundColor: '#f69b31' },
            tabBarOnPress: ({ navigation, defaultHandler }) => {
              this.props.navigation.setParams({ myTitle: "Đăng kí xác nhận" });
              defaultHandler();
            }
          }
        },
        MBHRAP: {
          // screen: (props) => <MBHRMN {...props} navigation={this.props.navigation} titleHeader='Quản lý phê duyệt' nameTab="MBHRAP" dataMenu={this.state.dataMenuMBHRAP} />,
          screen: props => (
            <MBHRMN
              {...props}
              navigation={this.props.navigation}
              nameTab="MBHRAP"
              dataMenu={this.state.dataMenuMBHRAP}
            />
          ),
          navigationOptions: {
            tabBarLabel: "Phê duyệt",
            shifting: false,
            tabBarIcon: ({ tintColor }) => (
              <View>
                <MaterialCommunityIcons
                  style={[{ color: tintColor, fontWeight: 100 }]}
                  type="material-community"
                  size={25}
                  name={
                    this.props.navigation.state.params != undefined
                      ? this.props.navigation.state.params.myTitle == "Quản lý phê duyệt"
                        ? "check-circle" : "check-circle-outline"
                      : "check-circle"
                  }
                />
              </View>
            ),
            //activeColor: '#615af6',
            //inactiveColor: '#46f6d7',
            //barStyle: { backgroundColor: '#67baf6' },
            tabBarOnPress: ({ navigation, defaultHandler }) => {
              this.props.navigation.setParams({ myTitle: "Quản lý phê duyệt" });
              defaultHandler();
            }
          }
        },
        MBHRAN: {
          // screen: (props) => <MBHRMN {...props} navigation={this.props.navigation} titleHeader='Quản lí' nameTab="MBHRAN" dataMenu={this.state.dataMenuMBHRAN} />,
          screen: props => (
            <MBHRMN
              {...props}
              navigation={this.props.navigation}
              nameTab="MBHRAN"
              dataMenu={this.state.dataMenuMBHRAN}
            />
          ),
          navigationOptions: {
            tabBarLabel: "Quản lý",
            shifting: false,
            tabBarIcon: ({ tintColor }) => (
              <View>
                <MaterialCommunityIcons
                  style={[{ color: tintColor, fontWeight: 100 }]}
                  type="material-community"
                  size={25}
                  name="settings-outline"
                  name={
                    this.props.navigation.state.params != undefined
                      ? this.props.navigation.state.params.myTitle == "Quản lý"
                        ? "settings"
                        : "settings-outline"
                      : "settings"
                  }
                />
              </View>
            ),
            //activeColor: '#615af6',
            //inactiveColor: '#46f6d7',
            //barStyle: { backgroundColor: '#67baf6' },
            tabBarOnPress: ({ navigation, defaultHandler }) => {
              this.props.navigation.setParams({ myTitle: "Quản lý" });
              defaultHandler();
            }
          }
        },
        MBHRMN: {
          // screen: (props) => <MBHRMN {...props} navigation={this.props.navigation} titleHeader='Menu' nameTab="MBHRMN" dataMenu={this.state.dataMenuMBHRMN} />,
          screen: props => (
            <MBHRMN
              {...props}
              navigation={this.props.navigation}
              nameTab="MBHRMN"
              dataMenu={this.state.dataMenuMBHRMN}
            />
          ),
          navigationOptions: {
            tabBarLabel: "Menu",
            shifting: false,
            tabBarIcon: ({ tintColor }) => (
              <MaterialCommunityIcons
                style={[{ color: tintColor, fontWeight: 100, }]}
                type="material-community"
                size={25}
                name={
                  this.props.navigation.state.params != undefined
                    ? this.props.navigation.state.params.myTitle == "Menu"
                      ? "view-dashboard"
                      : "view-dashboard-outline"
                    : "view-dashboard"
                } /*name='ios-keypad'*/
              />
            ),
            tabBarOnPress: ({ navigation, defaultHandler }) => {
              this.props.navigation.setParams({ myTitle: "Menu" });
              defaultHandler();
            }
          }
        }
      },
      {
        defaultNavigationOptions: ({ navigation }) => {

          // // initialRouteName: this.props.navigation.dangerouslyGetParent().getParam('paramNameHere') == '' ? "MBIN" : this.props.navigation.dangerouslyGetParent().getParam('paramNameHere'),
          //   labeled: false,
          //     activeColor: variables.backgroundColor,
          //       inactiveColor: "gray",
          //         barStyle: { backgroundColor: "white", },
          // activeBackgroundColor: 'red'
        },
        initialRouteName: 'MBHRIN',
        tabBarOptions: {
          activeTintColor: variables.backgroundColorTV,
          inactiveTintColor: 'gray',
          activeBackgroundColor: variables.activeBackgroundColorTV,
          tabStyle: { marginTop: 3, marginHorizontal: 3, borderTopLeftRadius: 5, borderTopRightRadius: 5 }
        },
      }

    );
    this.props.navigation.setParams({ myTitle: "Truy vấn thông tin" });
    this.AppContainer = createAppContainer(this.TabNavigator);
  }


  getData() {
    let isThis = this;
    // this.setState({ loading: true })
    DefaultPreference.getAll().then(function (valueAll) {
      let p_tes_user_pk = valueAll["tes_user_pk"];
      let p_emp_pk = valueAll["user_pk"];
      let p_crt_by = valueAll["username"];
      let procedure = "STV_HR_SEL_MBI_MBHRMENU";
      let para = p_tes_user_pk + "|" + p_emp_pk + "|" + p_crt_by;
      console.log("log para:---------->" + para);

      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          getDataJson(procedure, para, "1").then(res => {
            console.log(res);
            let data_info = res.objcurdatas[0];
            let dataMenuMBHRIN = [];
            let dataMenuMBHRRE = [];
            let dataMenuMBHRAP = [];
            let dataMenuMBHRAN = [];

            if (data_info.totalrows > 0) {
              for (const result of data_info.records) {
                if (result.menu_cd.includes("MBHRIN")) {
                  dataMenuMBHRIN.push(result);
                }

                if (result.menu_cd.includes("MBHRRE")) {
                  dataMenuMBHRRE.push(result);
                }

                if (result.menu_cd.includes("MBHRAP")) {
                  dataMenuMBHRAP.push(result);
                }

                if (result.menu_cd.includes("MBHRAN")) {
                  dataMenuMBHRAN.push(result);
                }
              }
            }

            isThis.setState({ dataMenuMBHRMN: data_info.records, dataMenuMBHRIN, dataMenuMBHRRE, dataMenuMBHRAP, dataMenuMBHRAN });
            isThis.forceUpdate();
          }).catch(err => {
            // console.warn(err)
            Alert.alert(
              'Không thể kết nối tới server',
              'Vui lòng thử lại sau!',
              [{
                text: 'OK', onPress: async () => {
                  isThis.setState({ loading: true });
                  DefaultPreference.clearAll();
                  await setTimeout(async () => { await isThis.setState({ loading: false }), await isThis.props.navigation.navigate('Login') }, 0)

                }
              }]
            )
          });
        } else {
          Alert.alert(
            'Lỗi khi tải menu',
            'Thiết bị của bạn chưa kết nối với internet!',
            [
              //{ text: 'Hủy', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
              {
                text: 'OK', onPress: async () => {
                  isThis.setState({ loading: true });
                  DefaultPreference.clearAll();
                  await setTimeout(async () => { await isThis.setState({ loading: false }), await isThis.props.navigation.navigate('Login') }, 0)

                  // DefaultPreference.set('user_pk', null).then(function () { console.log('done') });
                  // //DefaultPreference.set('username', null).then(function () { console.log('done username') });
                  // DefaultPreference.set('tes_user_pk', null).then(function () { console.log('done tes_user_pk') });
                  // DefaultPreference.set('emp_id', null).then(function () { console.log('done emp_id') });
                  // DefaultPreference.set('full_name', null).then(function () { console.log('done full_name') });

                  // DefaultPreference.set('sysadmin_yn', null).then(function () { console.log('done client_pass') });
                  // DefaultPreference.set('company_pk', null).then(function () { console.log('done client_pass') });
                  // DefaultPreference.set('org_pk', null).then(function () { console.log('done org_pk') });
                  // DefaultPreference.set('client_pk', null).then(function () { console.log('done client_pass') });
                  // DefaultPreference.set('client_nm', null).then(function () { console.log('done client_nm') });
                  // DefaultPreference.set('client_pass', null).then(function () { console.log('done client_nm') });
                }
              }
            ]
          )
        }
      });
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.AppContainer = createAppContainer(this.TabNavigator);
    return false;
  }

  render() {
    return <this.AppContainer />;
  }
}
