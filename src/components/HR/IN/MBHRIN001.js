import React, { Component } from "react";
import {
  AppRegistry, View, Image,
  ImageBackground, StatusBar, StyleSheet, Platform, Dimensions, TouchableOpacity, ScrollView
} from "react-native";
import {
  Root, Toast, Container, Body, Content, Header, Left, Right, Picker, Spinner,
  Icon, Title, Input, Item, Label, Button, StyleProvider, getTheme
} from "native-base";
import variables from '../../../assets/styles/variables';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import { TextField } from 'react-native-material-textfield';
import { OnExcute, getUserInfo, getDataJson } from '../../../services/FetchData';
import Loader from '../../SYS/Loader';
import DefaultPreference from 'react-native-default-preference';
import { Avatar, colors } from 'react-native-elements';
import { Block, Text, theme } from "galio-framework";
import moment from "moment";
const { width, height } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;


class MBHRIN001 extends Component {

  // static navigationOptions = ({ navigation }) => {
  //   if (navigation.state.params != undefined) {
  //     return {
  //       headerTitle: navigation.state.params.myTitle
  //     }
  //   }
  // };

  handleButton(navigate) {
    this.props.navigation.navigate(navigate);
  }
  constructor(props) {
    console.disableYellowBox = true
    super(props);
    //this.props.navigation.setParams({ myTitle: this.props.navigation.getParam('titleHeader') });
    this.state = {
      loading: false,
      dataInfo: {},

      //org_pk: '',
      user_pk: '',
      emp_id: '',
      full_name: '',

    }
  }

  componentWillMount = async () => {
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

  getData = async () => {
    let that = this;
    this.setState({ loading: true });

    let procedure = "STV_HR_SEL_MBI_MBHRIN001_0";
    let para = this.state.user_pk + "|" + this.state.full_name;
    getDataJson(procedure, para, '1')
      .then(async (res) => {
        console.log(res);
        let data_info = res.objcurdatas[0];
        if (data_info.totalrows > 0) {
          that.setState({ dataInfo: data_info.records[0] });
        }
        that.setState({ loading: false });
      });
  }


  render() {
    let { dataInfo } = this.state;
    return (
      <StyleProvider style={getTheme(variables)}>
        <Root>
          <Container>
            {/* <Header style={GlobalStyles.header} iosStatusbar="light-content" androidStatusBarColor=variables.backgroundColorTV >
              <Left >
                <Button
                  transparent
                  onPress={() => goBack()}>
                  <Icon style={GlobalStyles.iconHeader} name={'ios-arrow-back'} />
                </Button>
              </Left>

              <View style={{ marginRight: '20%' }}>
                <Body style={{ justifyContent: 'center' }}>
                  <Title>{this.props.navigation.getParam('titleHeader')}</Title>
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
            <Loader loading={this.state.loading} />

            <Block flex style={styles.profile}>
              <Block flex>
                <ImageBackground
                  source={variables.images.background}
                  style={styles.profileContainer}
                  imageStyle={[styles.profileBackground,]}
                >
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ width, paddingTop: '1%' }}
                  >
                    <Block flex style={[styles.profileCard, {}]}>
                      <Block middle style={styles.avatarContainer}>
                        {dataInfo.avatar != '' ?
                          <Image
                            source={{ uri: dataInfo.avatar }}
                            style={styles.avatar}
                          />
                          :
                          //this.state.tv_gioitinh == 'Nam' ?
                          <Image
                            source={variables.images.avataDefault}
                            style={styles.avatar}
                          />

                        }

                      </Block>

                      <Block style={[styles.info, {}]}>
                        <Block middle row space="evenly" style={{ marginTop: 0, paddingBottom: 5 }} ></Block>
                        <Block flex>
                          <Block middle>
                            <Text bold size={12} style={{ marginBottom: 4, color: variables.textValue }}>{dataInfo.manv_val}</Text>
                          </Block>
                          {/* <Block middle>
                            <Text bold color="#525F7F" size={12} style={{ marginBottom: 4 }}  > 10 </Text>
                            <Text size={12}>Photos</Text>
                          </Block>
                          <Block middle>
                            <Text bold color="#525F7F" size={12} style={{ marginBottom: 4 }}  > 89   </Text>
                            <Text size={12}>Comments</Text>
                          </Block> */}
                        </Block>
                      </Block>

                      <Block flex>
                        <Block middle style={styles.nameInfo}>
                          <Text bold size={width / 17} color="#32325D">{dataInfo.hoten_val != null ? dataInfo.hoten_val : 'Họ và tên'}, {dataInfo.ngaysinh_val != null ? moment().diff((moment(dataInfo.ngaysinh_val, 'DD-MM-YYYY').format('YYYY-MM-DD')), 'years') : '--'}</Text>
                          {/* <Text size={16} color="#32325D" style={{ marginTop: 10 }}>{dataInfo.noisinh != '' ? dataInfo.noisinh + ',' : null} {dataInfo.quoctich}</Text> */}
                        </Block>
                        {/* <Block middle style={{ marginTop: 10, marginBottom: 10 }}>
                          <Block style={styles.divider} />
                        </Block> */}
                        <Image style={[GlobalStyles.line, { marginVertical: 10 }]} source={require('../../../assets/images/line.png')} />

                        <Block middle>
                          <Text size={16} color={variables.backgroundColorTV} style={{ textAlign: "center" }} >
                            {dataInfo.trangthai_val} ...
                          </Text>
                        </Block>
                        {/* <Block row style={{ paddingBottom: 5, justifyContent: "flex-end" }} /> */}
                      </Block>

                    </Block>
                  </ScrollView>
                </ImageBackground>
              </Block>
            </Block>


            <Content padder style={{ marginHorizontal: 15, }} showsVerticalScrollIndicator={false}>
              <Block style={{ borderWidth: 0.7, borderColor: '#d9e1e8', borderRadius: 10, backgroundColor: '#fff' }}>
                <View style={[styles.cart, { borderTopWidth: 0 }]}>
                  <Left>
                    <Text style={styles.textCart}>Phòng ban: </Text>
                  </Left>
                  <Right style={styles.borderLeft}>
                    <Text style={[styles.textCart, { color: variables.textValue, fontWeight: 'bold' }]}>{dataInfo.phongban_val}</Text>
                  </Right>
                </View>
                <View style={styles.cart}>
                  <Left>
                    <Text style={styles.textCart}>Ngày sinh: </Text>
                  </Left>
                  <Right style={styles.borderLeft}>
                    <Text style={[styles.textCart, { color: variables.textValue, fontWeight: 'bold' }]}>{dataInfo.ngaysinh_val}</Text>
                  </Right>
                </View>
                <View style={styles.cart}>
                  <Left>
                    <Text style={styles.textCart}>Giới tính: </Text>
                  </Left>
                  <Right style={styles.borderLeft}>
                    <Text style={[styles.textCart, { color: variables.textValue, fontWeight: 'bold' }]}>{dataInfo.gioitinh_val}</Text>
                  </Right>
                </View>
                <View style={styles.cart}>
                  <Left>
                    <Text style={styles.textCart}>Quốc tịch: </Text>
                  </Left>
                  <Right style={styles.borderLeft}>
                    <Text style={[styles.textCart, { color: variables.textValue, fontWeight: 'bold' }]}>{dataInfo.quoctich_val}</Text>
                  </Right>
                </View>
                <View style={styles.cart}>
                  <Left>
                    <Text style={styles.textCart}>Nơi sinh: </Text>
                  </Left>
                  <Right style={styles.borderLeft}>
                    <Text style={[styles.textCart, { color: variables.textValue, fontWeight: 'bold' }]}>{dataInfo.noisinh_val}</Text>
                  </Right>
                </View>
                <View style={styles.cart}>
                  <Left>
                    <Text style={styles.textCart}>Số CMND: </Text>
                  </Left>
                  <Right style={styles.borderLeft}>
                    <Text style={[styles.textCart, { color: variables.textValue, fontWeight: 'bold' }]}>{dataInfo.cmnd_val}</Text>
                  </Right>
                </View>
                <View style={styles.cart}>
                  <Left>
                    <Text style={styles.textCart}>Ngày cấp: </Text>
                  </Left>
                  <Right style={styles.borderLeft}>
                    <Text style={[styles.textCart, { color: variables.textValue, fontWeight: 'bold' }]}>{dataInfo.ngaycap_val}</Text>
                  </Right>
                </View>
                <View style={styles.cart}>
                  <Left>
                    <Text style={styles.textCart}>Nơi cấp: </Text>
                  </Left>
                  <Right style={styles.borderLeft}>
                    <Text style={[styles.textCart, { color: variables.textValue, fontWeight: 'bold' }]}>{dataInfo.noicap_val}</Text>
                  </Right>
                </View>
                <View style={styles.cart}>
                  <Left>
                    <Text style={styles.textCart}>Số điện thoại: </Text>
                  </Left>
                  <Right style={styles.borderLeft}>
                    <Text style={[styles.textCart, { color: variables.textValue, fontWeight: 'bold' }]}>{dataInfo.sdt_val}</Text>
                  </Right>
                </View>
                <View style={styles.cart}>
                  <Left>
                    <Text style={styles.textCart}>Địa chỉ Email: </Text>
                  </Left>
                  <Right style={styles.borderLeft}>
                    <Text style={[styles.textCart, { color: variables.textValue, fontWeight: 'bold' }]}>{dataInfo.email_val}</Text>
                  </Right>
                </View>
                <View style={styles.cart}>
                  <Left>
                    <Text style={styles.textCart}>Quê quán: </Text>
                  </Left>
                  <Right style={styles.borderLeft}>
                    <Text style={[styles.textCart, { color: variables.textValue, fontWeight: 'bold' }]}>{dataInfo.quequan_val}</Text>
                  </Right>
                </View>
                <View style={styles.cart}>
                  <Left>
                    <Text style={styles.textCart}>Dân tộc: </Text>
                  </Left>
                  <Right style={styles.borderLeft}>
                    <Text style={[styles.textCart, { color: variables.textValue, fontWeight: 'bold' }]}>{dataInfo.dantoc_val}</Text>
                  </Right>
                </View>
                <View style={styles.cart}>
                  <Left>
                    <Text style={styles.textCart}>Tôn giáo: </Text>
                  </Left>
                  <Right style={styles.borderLeft}>
                    <Text style={[styles.textCart, { color: variables.textValue, fontWeight: 'bold' }]}>{dataInfo.tongiao_val}</Text>
                  </Right>
                </View>
                <View style={styles.cart}>
                  <Left style={styles.borderRight}>
                    <Text style={styles.textCart}>Số tài khoản ngân hàng: </Text>
                  </Left>
                  <Right style={{}}>
                    <Text style={[styles.textCart, { color: variables.textValue, fontWeight: 'bold' }]}>{dataInfo.sotaikhoan_val}</Text>
                  </Right>
                </View>
                <View style={styles.cart}>
                  <Left>
                    <Text style={styles.textCart}>Tên ngân hàng: </Text>
                  </Left>
                  <Right style={styles.borderLeft}>
                    <Text style={[styles.textCart, { color: variables.textValue, fontWeight: 'bold' }]}>{dataInfo.nganhang_val}</Text>
                  </Right>
                </View>
                <View style={styles.cart}>
                  <Left>
                    <Text style={styles.textCart}>Chi nhánh: </Text>
                  </Left>
                  <Right style={styles.borderLeft}>
                    <Text style={[styles.textCart, { color: variables.textValue, fontWeight: 'bold' }]}>{dataInfo.nganhang_cn_val}</Text>
                  </Right>
                </View>
                <View style={styles.cart}>
                  <Left>
                    <Text style={styles.textCart}>Địa chỉ tạm trú: </Text>
                  </Left>
                  <Right style={styles.borderLeft}>
                    <Text style={[styles.textCart, { color: variables.textValue, fontWeight: 'bold' }]}>{dataInfo.diachi_tamtru_val}</Text>
                  </Right>
                </View>
                <View style={styles.cart}>
                  <Left >
                    <Text style={styles.textCart}>Địa chỉ thường trú: </Text>
                  </Left>
                  <Right style={styles.borderLeft}>
                    <Text style={[styles.textCart, { color: variables.textValue, fontWeight: 'bold' }]}>{dataInfo.diachi_thuongtru_val}</Text>
                  </Right>
                </View>
              </Block>
            </Content>
          </Container>
        </Root>

      </StyleProvider>
    );
  }
}


export default MBHRIN001;


const styles = StyleSheet.create({
  profile: {
    //marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 0.6
  },
  profileContainer: {
    width: width,
    //height: height / 3.3,
    padding: 0,
    zIndex: 1
  },
  profileBackground: {
    width: width,
    height: height / 3.3
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
    marginBottom: 35,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderRadius: 10,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2
  },
  info: {
    paddingHorizontal: 40
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0
  },
  nameInfo: {
    marginTop: 0
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF"
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure
  },
  cart: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderColor: '#d9e1e8',
    //marginLeft: 10,
    // marginRight: 10,
  },
  textCart: {
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    //fontWeight: 'bold',
    fontSize: 15,
    fontWeight: '300',
  },
  borderLeft: {
    borderLeftColor: '#d9e1e8', borderLeftWidth: 0.8
  },
  borderRight: {
    borderRightColor: '#d9e1e8', borderRightWidth: 0.8
  }
});