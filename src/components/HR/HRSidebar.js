import React, { Component } from "react";
import { AppRegistry, Animated, Alert, Image, StatusBar, View, StyleSheet, YellowBox, FlatList, Easing, TouchableOpacityBase } from "react-native";
import { Container, Item, Content, Text, ListItem, Separator, Footer, Button, Right, Left, Body, StyleProvider, getTheme, Root } from "native-base";
import variables from '../../assets/styles/variables';
import GlobalStyles from "../../assets/styles/GlobalStyles";
import DefaultPreference from 'react-native-default-preference';
import { OnExcute, getDataJson, UploadImage } from '../../services/FetchData';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity, TouchableHighlight } from "react-native-gesture-handler";
import DeviceInfo from 'react-native-device-info';


export default class HRSidebar extends Component {

  handleButton(navigate, titleHeaderParam) {
    console.log(navigate)
    this.props.navigation.closeDrawer();
    this.props.navigation.navigate(navigate, { titleHeader: titleHeaderParam });
  }

  constructor(props) {
    super(props);
    this.state = {
      // menuHide: [],
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.navigation != this.props.navigation) {
      const { navigation } = this.props;
      let dataMenu = navigation.state.routes[0].routes[0].params.dataMenu;
      this.setState({ dataMenu })
    }
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

  render() {
    const dataMenu = this.state.dataMenu;
    // const buildNumber = DeviceInfo.getBuildNumber();
    const buildVersion = DeviceInfo.getVersion();
    const { navigation } = this.props;

    return (
      <Root>
        <Container style={{ marginTop: '10.5%' }}>
          <View style={[GlobalStyles.wrapLoginLogo, { height: 80, }]}>
            <Image
              style={{
                flex: 1,
                resizeMode: 'contain',
                marginTop: 25,
                marginBottom: 5,
              }}
              source={variables.images.logo} />
            <Image style={[GlobalStyles.line, { height: 1.6, width: '96%' }]} source={require('../../assets/images/line.png')} />
          </View>

          <FlatList
            showsVerticalScrollIndicator={false}
            style={{ marginHorizontal: '0%', backgroundColor: '#FFF', marginTop: '3%' }}
            data={dataMenu}
            renderItem={({ item }) =>
              <Collapse>
                <CollapseHeader>
                  <TouchableOpacity activeOpacity={0}
                    onPress={() =>
                      item.form_url.length > 6 ?
                        this.handleButton(item.form_url, item.title) : null
                    }
                  >
                    <Separator bordered style={{ flexDirection: 'row', height: 40, paddingTop: 0, paddingBottom: 0, backgroundColor: 'rgb(246,246,246)', paddingLeft: 10, alignItems: 'center', }}>
                      <MaterialCommunityIcons name={`${item.icon}`} style={[styles.iconList, { color: item.bgcolor, }]} />
                      <Text style={[styles.textList, { color: 'black', width: '82%' }]}>{item.title}</Text>
                      <Right style={{}} >
                        {!!item.childMenu ?
                          // <Animated.Image
                          //   style={{
                          //     width: 17,
                          //     height: 17,
                          //   }}
                          //   source={require('../../assets/icons/right-chevron.png')}
                          // />
                          <MaterialCommunityIcons name={'chevron-down'} style={[, { fontSize: 30, color: 'gray', paddingRight: 35 }]} />
                          :
                          <MaterialCommunityIcons name={'chevron-right'} style={[, { fontSize: 30, color: 'gray', paddingRight: 35 }]} />
                          // <Animated.Image
                          //   style={{
                          //     width: 17,
                          //     height: 17,
                          //     transform: [{
                          //       rotate: '-90deg'
                          //     }]
                          //   }}
                          //   source={require('../../assets/icons/right-chevron.png')}
                          // />
                        }
                      </Right>
                    </Separator>
                  </TouchableOpacity>
                </CollapseHeader>
                <CollapseBody>
                  {
                    !!item.childMenu ?
                      item.childMenu.map(item => {
                        return (
                          <View style={{ backgroundColor: 'rgb(248,249,249)', }}>
                            {/* <TouchableOpacity onPress={() => item.form_url == 'MBHRAN003' ? this.confirmLogOut(navigation) : this.handleButton(item.form_url, item.title)}> */}
                            <Item key={item.pk} style={{ marginLeft: 16, paddingVertical: 7, alignItems: 'center', }}
                              onPress={() => item.form_url == 'MBHRAN003' ? this.confirmLogOut(navigation) : this.handleButton(item.form_url, item.title)} >
                              <MaterialCommunityIcons name={`${item.icon}`} style={[styles.iconList, { color: item.bgcolor, paddingLeft: 5, }]} />
                              <Text style={[styles.textList, { color: 'black', }]}>{item.title}</Text>
                              <Right style={{ marginRight: 10, }} >
                                {item.form_url == 'MBHRAN003' ?
                                  <EntypoIcons name={'log-out'} size={15} color={'gray'} />
                                  :
                                  <EntypoIcons name={'chevron-thin-right'} size={15} color={"gray"} />
                                }
                              </Right>
                            </Item>
                            {/* </TouchableOpacity> */}
                          </View>
                        )
                      })
                      : null
                  }
                </CollapseBody>
              </Collapse>
            }
            keyExtractor={item => item.pk}
          />
          <Text style={{ textAlign: 'right', fontSize: 15, marginRight: 10, }}>Phiên bản: {buildVersion}</Text>
        </Container>
      </Root>
    );
  }
}

const styles = StyleSheet.create({

  itemList1: {
    //marginHorizontal: 20,
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottomColor: '#DADDE1',
    borderBottomWidth: 0.5,
    marginLeft: '3%',
    paddingRight: '1%'
  },
  iconList: {
    // marginHorizontal: 10,
    fontSize: 22
  },
  textList: {
    fontWeight: '500',
    fontSize: 14.5,
    marginLeft: '3.4%'
  }
})
