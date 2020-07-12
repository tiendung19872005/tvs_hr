import React, { Component } from "react";
import { FlatList, StyleSheet, RefreshControl, ImageBackground, ScrollView, View, Alert, Image, Dimensions } from "react-native";
import { Title, Input, Item, Label, Button, Content, StyleProvider, getTheme, Root, Container, } from "native-base";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import DefaultPreference from "react-native-default-preference";
import { OnExcute, getDataJson, UploadImage } from "../../services/FetchData";
import Loader from "../SYS/Loader";
import GlobalStyles from "../../assets/styles/GlobalStyles";
import variables from "../../assets/styles/variables";
import NetInfo from "@react-native-community/netinfo";
import { variance } from "@babel/types";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Block, Text, theme } from "galio-framework";

const { width, height } = Dimensions.get('window');
export default class MainNaivigation extends Component {
  static navigationOptions = ({ navigation }) => {
    if (navigation.state.params != undefined) {
      return {
        headerTitle: navigation.state.params.myTitle,
        headerTitle: 'Trang chủ',
        headerStyle: {
          backgroundColor: variables.backgroundColorTV,
        },
        headerTitleStyle: {
          fontWeight: "bold"
        },
        headerLeft: (
          <Button transparent onPress={() => navigation.openDrawer()} >
            <Icon style={[GlobalStyles.iconHeader, { paddingHorizontal: 10 }]} name="md-menu" />
          </Button >
        ),
        headerRight: (
          <Button transparent >
            <Icon style={[GlobalStyles.iconHeader, { paddingHorizontal: 10 }]} name="ios-help-circle-outline" />
          </Button>
        )
      };
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      dataMenuMBHR: [],
      dataMenu: [],
      loading: false,
      avatar: '',
      gender: '',
      fullName: '',
      homeTown: '',
    };
    this.getData();
    this.props.navigation.setParams({ myTitle: "Trang chủ" });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.dataMenu !== this.state.dataMenu) {
      let dataMenu = this.state.dataMenu;
      let dataMenuMBHR = this.state.dataMenuMBHR;

      dataMenu.map(item => {
        if (item.menu_cd.length > 6) {
          const indexParentMenu = dataMenuMBHR.findIndex(i => i.pk == item.p_pk);
          if (indexParentMenu != -1) {
            if (!!!dataMenuMBHR[indexParentMenu].childMenu) {
              dataMenuMBHR[indexParentMenu].childMenu = [item]
            } else {
              dataMenuMBHR[indexParentMenu].childMenu.push(item);
            }
          }
        }
      })
      // console.log(dataMenuMBHR);
      this.props.navigation.setParams({ dataMenu: dataMenuMBHR });
    }
  }

  getData() {
    let isThis = this;
    isThis.setState({ loading: true })
    DefaultPreference.getAll().then(function (valueAll) {
      const avatar = valueAll["avatar"];
      const gender = valueAll["gender"];
      const fullName = valueAll["full_name"];
      const homeTown = valueAll["home_town"];
      isThis.setState({ avatar, gender, fullName, homeTown });

      const p_tes_user_pk = valueAll["tes_user_pk"];
      const p_emp_pk = valueAll["user_pk"];
      const p_crt_by = valueAll["username"];
      const procedure = "STV_HR_SEL_MBI_MBHRMENU";
      const para = p_tes_user_pk + "|" + p_emp_pk + "|" + p_crt_by;
      console.log("log para:---------->" + para);

      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          getDataJson(procedure, para, "1").then(res => {
            console.log(res);
            var data_info = res.objcurdatas[0];
            let dataMenuMBHR = [];

            if (data_info.totalrows > 0) {
              data_info.records.map(item => {
                if (item.menu_cd.length == 6) {
                  dataMenuMBHR.push(item);
                }
              })
            }
            isThis.setState({ loading: false, dataMenuMBHR, dataMenu: data_info.records, });

          }).catch(err => {
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

                }
              }
            ]
          )
        }
      });
    });
  }

  navigationScreens = (form_url, menu_nm, navigation) => {
    console.log(form_url);
    if (form_url.length == 6) {
      const dataMenu = this.state.dataMenu.filter(i => i.menu_cd == form_url);
      navigation.navigate('MBHRMN', { titleHeader: menu_nm, dataMenu: dataMenu });
    } else {
      navigation.navigate(form_url, { titleHeader: menu_nm });
    }
  }

  render() {
    const { navigation } = this.props;
    let avatar = this.state.avatar;
    let gender = this.state.gender;
    let fullName = this.state.fullName;
    let homeTown = this.state.homeTown;
    return (
      <StyleProvider style={getTheme(variables)}>
        <Root>
          <Container style={{}}>
            <Loader loading={this.state.loading} />

            <ImageBackground
              source={variables.images.backgroundHome}
              style={styles.profileContainer}
              imageStyle={[styles.profileBackground,]}
            >
              <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                <Block middle style={styles.avatarContainer}>
                  {avatar.length > 13 ?
                    <Image
                      source={{ uri: avatar }}
                      style={styles.avatar}
                    />
                    :
                    gender == 'F' || gender == 'Nữ' ?
                      <Image
                        source={variables.images.avataDefaultF}
                        style={styles.avatar}
                      />
                      :
                      <Image
                        source={variables.images.avataDefaultM}
                        style={styles.avatar}
                      />
                  }

                </Block>

                <Block middle style={styles.nameInfo}>
                  <Text bold size={width / 24} color="white">Xin chào, {fullName}</Text>
                </Block>
                {!!homeTown ?
                  <Block middle style={[styles.nameInfo, { flexDirection: 'row' }]}>
                    <MaterialCommunityIcons style={[GlobalStyles.iconHeader, { fontSize: 18, paddingTop: 1.25 }]} name="map-marker-radius" />
                    <Text bold size={width / 26} color="white">{` ${homeTown}`}</Text>
                  </Block>
                  : null
                }
                <Image style={[GlobalStyles.line, { marginVertical: 7, height: 2, }]} source={require('../../assets/images/line.png')} />
              </View>
            </ImageBackground>

            {/* <View style={[styles.parent, {}]}> */}
            <FlatList
              style={{ marginTop: 3 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{}}
              extraData={this.state}
              data={this.state.dataMenuMBHR}
              numColumns={3}
              keyExtractor={(item, index) => { item.pk }}
              renderItem={({ item, index }) => {
                return (
                  <View key={index} style={[styles.child, {}]}>
                    <TouchableOpacity
                      key={index} onPress={() => this.navigationScreens(item.form_url, item.title, navigation)} >
                      <MaterialCommunityIcons name={item.icon} style={{ fontSize: 35, color: item.bgcolor, alignSelf: 'center' }}></MaterialCommunityIcons>
                      <Text style={{ fontWeight: '400', color: 'black', fontSize: 13.5, textAlign: 'center', marginTop: 4 }}>{item.title}</Text>
                    </TouchableOpacity>
                  </View>
                )
              }}
              refreshControl={
                <RefreshControl
                  progressViewOffset={40}
                  refreshing={this.state.loading}
                  onRefresh={() => { this.getData() }}
                />
              }
            />

            {/* </View> */}
          </Container>
        </Root>
      </StyleProvider>
    )
  }
}


const styles = StyleSheet.create({
  parent: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    backgroundColor: 'white',
    // padding: 16,
  },
  child: {
    width: '33.333333333333333333333333333333333333333333333333333333333333333333333333333333333333%',
    padding: 10,
    aspectRatio: 1.5,
    borderColor: 'rgba(100,121,143,0.2)',
    borderWidth: 0.2,
    // borderRadius: 5,
    // flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#FFF',
  },

  profileContainer: {
    width: width,
    padding: 0,
    zIndex: 1
  },
  profileBackground: {
    width: width,
    // height: height / 3.3
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
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 0,
    borderWidth: 3,
    borderColor: 'rgb(235, 236,235)',
    marginTop: 10,
  },
  nameInfo: {
    marginTop: 2
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF"
  },
});

// import variables from "../../assets/styles/variables";
// import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import { Animated } from 'react-native'


// class Icon extends Component {
//   constructor(props) {
//     super(props)
//     this.rotation = new Animated.Value(0)
//   }

//   componentDidMount() {
//     Animated.spring(this.rotation, {
//       toValue: 1,
//       tension: 150,
//       friction: 5,
//       useNativeDriver: true,
//     }).start()
//   }

//   render() {
//     const { style, rotation, ...other } = this.props
//     const rotate = this.rotation.interpolate({
//       inputRange: [0, 1],
//       outputRange: [`500deg`, `0deg`],
//     })
//     return (
//       <Animated.Image
//         {...other}
//         source={variables.images.avataDefaultF}
//         style={[style, { transform: [{ rotate }] }]}
//       />
//     )
//   }
// }

// export default Icon


