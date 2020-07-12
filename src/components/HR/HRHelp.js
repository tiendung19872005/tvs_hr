import React, { Component } from "react";
import { AppRegistry, View, Image, StatusBar, StyleSheet, Platform, Dimensions, TouchableOpacity } from "react-native";
import {Root,Toast, Container, Body, Content, Header, Left, Right,Picker,Spinner,
        Icon, Title, Input, Item, Label, Button, Text, StyleProvider, getTheme } from "native-base";
import customVariables from '../../assets/styles/variables';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import GlobalStyles from "../../assets/styles/GlobalStyles";
import { TextField} from 'react-native-material-textfield';
import { Dropdown } from 'react-native-material-dropdown';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';


export default class HRHelp extends Component {
  handleButton(navigate) {
          this.props.navigation.navigate(navigate);
  }
  constructor(props) {
        super(props);
        this.state = {
            //urlavatar: 'https://teegoe.com/UploadFiles/Translation/Avartar/gianghnd.it@gmail.com/20181120-115902BeeMafia.jpg',

            description:'',
            dt_fromdate:'',
            dt_todate:'',
            secureTextEntry: true,
            loading: false,

        }

    }
  componentDidMount() {

      console.log("------componentDidMount------");

    }


    render() {
        const { navigate } = this.props.navigation;
        let { errors = {}, secureTextEntry, ...data } = this.state;
        return (
          <StyleProvider style={getTheme(customVariables)}>
          	<Root>
              <Container style={styles.container} >
                  <Header style={styles.header} iosStatusbar="light-content" androidStatusBarColor='#374C5F'>
                      <Left>
                          <Button
                              transparent
                              onPress={() => this.props.navigation.openDrawer()}>
                              <Icon name="menu" />
                          </Button>
                      </Left>
                      <Body>
                          <Title style={GlobalStyles.colorMain}>Trợ giúp</Title>
                      </Body>
                          <Right>
                              <Button
                                  transparent
                                  onPress={() => this.props.screenProps.drawerNavigation.openDrawer()}>
                                  <Icon name="grid" />
                              </Button>
                          </Right>
                  </Header>
                  <Content padder>
                  
                        <View style={styles.headerColumn}>

                            <View style={styles.userAddressRow}>
                                <Text style={styles.userWelcomeText}>
                                  Liên hệ admin để được trợ giúp !!!
                                </Text>
                            </View>
                        </View>
                  </Content>
              </Container>
            </Root>
          </StyleProvider>
        );
    }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    height: null,
    backgroundColor: "#374C5F"
  },
  header: {
    backgroundColor: "#4b5d6f"
  },
  headerColumn: {
    backgroundColor: 'transparent',
    marginTop: 10,
    ...Platform.select({
      ios: {
        alignItems: 'center',
        elevation: 1,
        marginTop: -1,
      },
      android: {
        alignItems: 'center',
      },
    }),
  },
  userImage: {
    borderColor: '#d1d2d3',
    borderRadius: 85,
    borderWidth: 3,
    height: 170,
    marginBottom: 15,
    width: 170,
  },
  userNameText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    paddingBottom: 8,
    textAlign: 'center',
    marginTop: -10
  },
  userAddressRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  userWelcomeText: {
    color: '#A5A5A5',
    fontSize: 15,
    textAlign: 'center',
    marginTop: -10
  },
  grid: {
    marginTop: 20,
  },
  buttonColumn: {
    backgroundColor: 'transparent',
    marginTop: 0,
  },
  col: {
    alignItems: "center",
    paddingHorizontal: 7,
  },
  row: {
    paddingVertical: 7
  },
  iconText: {
    fontSize: 30
  },
  buttonIcon: {
    width: "100%",
    height: Dimensions.get("window").width * 0.3,
    flex: 1,
    flexDirection: 'column'
  },
  buttonIconFull: {
    width: "100%",
    height: 50,
    flex: 1,
    flexDirection: 'column'
  },
  buttonEven: {
    backgroundColor: '#5b6b7b',
  },
  buttonOdd: {
    backgroundColor: '#495b6d',
  },
  iconRight: {
    width: '100%',
    height: '100%',
  }
});
