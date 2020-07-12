import React, { Component } from "react";
import { StyleSheet, Text, View, Alert, AppRegistry, Image, StatusBar, YellowBox, FlatList, TouchableOpacity } from 'react-native';
import {
  Container, Content, ListItem, Footer, Button, Body, StyleProvider, getTheme, Root, Header, RightPicker, Spinner, Left, Right,
  Title, Input, Item, Label
} from "native-base";
import customVariables from '../../../assets/styles/variables';
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import DefaultPreference from 'react-native-default-preference';
import Icon from 'react-native-vector-icons/Ionicons';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import Loader from '../../SYS/Loader';
import variables from "../../../assets/styles/variables";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getLoginJson, getDataJson } from '../../../services/FetchData'
import { Badge, withBadge } from 'react-native-elements'

export default class MBHRMN extends Component {

  handleButton(navigate, titleHeaderParam) {
    this.props.navigation.navigate(navigate, { titleHeader: titleHeaderParam });
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,

      numberWaitApproved_MBHRRE: 0,

      numberWaitApproved_MBHRAP1: 0,
      numberWaitApproved_MBHRAP2: 0,

      numberWaitApproved_MBHRAN: 0,
    };
  }

  logOut = async (navigation) => {
    this.setState({ loading: true });
    DefaultPreference.clearAll();
    await setTimeout(async () => { await this.setState({ loading: false }), await navigation.navigate('Login') }, 500)
  }

  confirmLogOut = (navigation) => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'OK', onPress: () => { this.logOut(navigation); } },
      ],
      { cancelable: false }
    )
  }

  componentDidMount() {
    DefaultPreference.getAll().then(async (valueAll) => {
      const user_pk = valueAll['user_pk'];
      // const full_name = valueAll['full_name'];
      const emp_id = valueAll['emp_id'];
      this.setState({ emp_id, user_pk })
    });

    this.focusListener = this.props.navigation.addListener('didFocus', async () => {
      const user_pk = this.state.user_pk;
      const emp_id = this.state.emp_id;
      const dataMenu = this.props.navigation.getParam('dataMenu')[0];

      if (dataMenu.menu_cd == 'MBHRRE') {
        const procedure = "STV_HR_SEL_MBI_MBHRMN_1";
        const para = user_pk + "|" + emp_id;
        console.log("log para:---------->" + para);
        await getDataJson(procedure, para, '1')
          .then((res) => {
            let data = res.objcurdatas[0];
            this.setState({ numberWaitApproved_MBHRRE: data.records[0].wait_approved })
          }).catch(() => {
            // that.setState({ loading: false })
          })
      } else if (dataMenu.menu_cd == 'MBHRAP') {
        const procedure = "STV_HR_SEL_MBI_MBHRMN_2";
        const para = user_pk + "|" + '1' + '|' + emp_id;
        console.log("log para:---------->" + para);
        await getDataJson(procedure, para, '1')
          .then((res) => {
            let data = res.objcurdatas[0];
            this.setState({
              numberWaitApproved_MBHRAP1: data.records[0].wait_approved_ap01,
              numberWaitApproved_MBHRAP2: data.records[1].wait_approved_ap01,
            })
          }).catch(() => {
            // that.setState({ loading: false })
          })
      } else if (dataMenu.menu_cd == 'MBHRAN') {
        const procedure = "STV_HR_SEL_MBI_MBHRMN_3";
        const para = user_pk + "|" + emp_id;
        console.log("log para:---------->" + para);
        await getDataJson(procedure, para, '1')
          .then((res) => {
            let data = res.objcurdatas[0];
            this.setState({
              numberWaitApproved_MBHRAN: data.records[0].number_notification,
            })
          }).catch(() => {
            // that.setState({ loading: false })
          });
      }
    });
  }

  render() {
    const { navigation } = this.props;
    const dataMenu = navigation.getParam('dataMenu')[0] || this.props.dataMenu[0];
    return (
      <StyleProvider style={getTheme(customVariables)}>
        <Root>
          <Container>
            <Loader loading={this.state.loading} />
            {/* <Header style={GlobalStyles.header} iosStatusbar="light-content" androidStatusBarColor=variables.backgroundColorTV >
              <Left>
                <Button
                  transparent
                  onPress={() => this.props.navigation.openDrawer()}>
                  <Icon style={GlobalStyles.iconHeader} name='menu' />
                </Button>
              </Left>
              <View style={{ marginRight: '20%' }}>
                <Body style={{ justifyContent: 'center' }}>
                  <Title style={GlobalStyles.titleHeader}>{this.props.titleHeader}</Title>
                </Body>
              </View>

              <Right>
                <Button
                  transparent
                  onPress={() => this.props.navigation.openDrawer()}>
                  <Icon style={GlobalStyles.iconHeader} name='ios-help-circle-outline' />
                </Button>
              </Right>
            </Header> */}
            <View style={[GlobalStyles.wrapLoginLogoHome, { backgroundColor: variables.cardCustomBg0 }]}>
              <Image
                style={{
                  flex: 1,
                  resizeMode: 'contain',
                  marginVertical: 10
                }}
                source={variables.images.logo} />
            </View>

            <Item icon button style={{ backgroundColor: '#FFF' }}
              onPress={() => this.handleButton(dataMenu.menu_cd, dataMenu.title)} >
              <Body style={[style.itemList, { flexDirection: 'column', justifyContent: 'center', borderBottomWidth: 0, }]}>
                <Text style={[style.textList, { color: variables.textValue, fontWeight: "bold", paddingVertical: 12 }]}>{dataMenu.title}</Text>
                <Image style={GlobalStyles.line} source={require('../../../assets/images/line.png')} />
              </Body>
            </Item>

            <FlatList
              showsVerticalScrollIndicator={false}
              style={{ paddingRight: '4%', backgroundColor: '#FFF' }}
              data={dataMenu.childMenu}
              renderItem={({ item }) =>
                <Item icon button
                  onPress={() => item.menu_cd == 'MBHRAN003' ?
                    this.confirmLogOut(navigation) : this.handleButton(item.form_url, item.title)} >
                  <Body style={[style.itemList, {}]}>
                    <MaterialCommunityIcons name={`${item.icon}`} style={[style.iconList, { color: item.bgcolor, marginVertical: 3, fontSize: 25 }]} />
                    <Text style={[style.textList, { color: item.bgcolor }]}>{item.title}</Text>

                    <Right style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                      {item.menu_cd == 'MBHRRE007' ?
                        <Badge value={this.state.numberWaitApproved_MBHRRE} status='warning' textStyle={{ fontSize: 13, fontWeight: 'bold', }} containerStyle={{ width: 35, marginRight: 5 }} />
                        : item.menu_cd == 'MBHRAP001' ?
                          <Badge value={this.state.numberWaitApproved_MBHRAP1} status='warning' textStyle={{ fontSize: 13, fontWeight: 'bold', }} containerStyle={{ width: 35, marginRight: 4 }} />
                          : item.menu_cd == 'MBHRAP002' ?
                            <Badge value={this.state.numberWaitApproved_MBHRAP2} status='warning' textStyle={{ fontSize: 13, fontWeight: 'bold', }} containerStyle={{ width: 35, marginRight: 4 }} />
                            : item.menu_cd == 'MBHRAN001' ?
                              <Badge value={this.state.numberWaitApproved_MBHRAN} status='warning' textStyle={{ fontSize: 13, fontWeight: 'bold', }} containerStyle={{ width: 35, marginRight: 4 }} />
                              : null
                      }
                      {item.menu_cd == 'MBHRAN003' ?
                        <EntypoIcons name={'log-out'} size={15} color={item.bgcolor} />
                        :
                        <EntypoIcons name={'chevron-thin-right'} size={15} color={"#DADDE1"} />
                      }
                    </Right>
                  </Body>
                </Item>
              }
              keyExtractor={item => item.pk}
            />
          </Container>
        </Root>
      </StyleProvider>
    );
  }
}
const style = StyleSheet.create({
  itemList: {
    //marginHorizontal: 20,
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottomColor: '#DADDE1',
    borderBottomWidth: 0.5,
    marginLeft: '3%',
    paddingRight: '1%'
  },
  iconList: {
    marginHorizontal: 10,
    fontSize: 29
  },
  textList: {
    fontWeight: '500',
    fontSize: 15.5,
    marginLeft: '2%'
  }
})
