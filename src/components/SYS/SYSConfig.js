import React, { Component } from 'react';
import { View, Image, TouchableHighlight, TouchableOpacity, SafeAreaView, Modal, StyleSheet } from 'react-native';
import {
  Container, Header, Title, Left, Icon, Right, Body, Content,
  Card, CardItem, Button, Text, Item, Input, StyleProvider, getTheme
} from "native-base";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DefaultPreference from 'react-native-default-preference';
import GlobalStyles from "../../assets/styles/GlobalStyles";
import variables from '../../assets/styles/variables';
import { OnExcute, getValueConnect, UploadImage } from "../../services/FetchData";
import { TextInput as TextInput1, Colors } from 'react-native-paper';

export default class SYSConfig extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Cấu hình hệ thống',
      headerLeft: (
        <Button
          transparent
          onPress={() => navigation.navigate('Login')} >
          <Icon style={GlobalStyles.iconHeader} name={'ios-arrow-back'} ></Icon>
        </Button >)
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      server_ip: '',
      name_api: '',
      name_db: '',
      user_db: '',
      pass_db: '',
    };
    // this.props.navigation = props.navigation;
  }


  componentDidMount() {
    console.log('--------componentDidMount -------');
    DefaultPreference.getAll().then(valueAll => {
      this.setState({
        server_ip: valueAll['serverip'],
        name_api: valueAll['nameapi'],
        name_db: valueAll['namedb'],
        user_db: valueAll['userdb'],
        pass_db: valueAll['passdb']
      });
    });
  }

  onSave = async (server_ip, name_api) => {
    DefaultPreference.set('serverip', server_ip);
    DefaultPreference.set('nameapi', name_api);
    await getValueConnect();
    await this.props.navigation.navigate('Login');
  }

  onChangeServerIP(text) {
    this.setState({ server_ip: text });
  }
  onChangeNameAPI(text) {
    this.setState({ name_api: text });
  }
  onChangeNameDB(text) {
    this.setState({ name_db: text });
  }
  onChangeUserDB(text) {
    this.setState({ user_db: text });
  }
  onChangePassDB(text) {
    this.setState({ pass_db: text });
  }

  render() {
    return (
      <StyleProvider style={getTheme(variables)}>
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} scrollEnabled keyboardShouldPersistTaps='always'>
          <View style={[GlobalStyles.container, { backgroundColor: '' }]}>
            <View style={[GlobalStyles.wrapLoginInput, {}]}>
              <Text style={{ fontWeight: 'bold', fontSize: 22, marginTop: '45%', color: 'rgba(27,31,35,0.85)' }}>Cài đặt ứng dụng</Text>
              <Item>
                <TextInput1
                  mode='outlined'
                  style={{ marginTop: 20, flex: 1 }}
                  underlineColorAndroid="transparent"
                  label='Server IP'
                  multiline={true}
                  value={this.state.server_ip || variables.ipServer.trim()}
                  theme={{
                    colors: {
                      // placeholder: variables.backgroundColorTV,
                      text: variables.textValue, primary: variables.textValue,
                      underlineColor: variables.backgroundColorTV, background: '#ffff'
                    },
                  }}
                  onChangeText={(text) => this.onChangeServerIP(text)}
                  baseColor={variables.textValue}
                  labelFontSize={variables.textValue}
                />
              </Item>
              <Item>
                <TextInput1
                  mode='outlined'
                  style={{ marginTop: 20, flex: 1 }}
                  underlineColorAndroid="transparent"
                  label='API Name'
                  multiline={true}
                  value={this.state.name_api || variables.nameApi.trim()}
                  theme={{
                    colors: {
                      // placeholder: variables.backgroundColorTV,
                      text: variables.textValue, primary: variables.textValue,
                      underlineColor: variables.backgroundColorTV, background: '#ffff'
                    },
                  }}
                  onChangeText={(text) => this.onChangeNameAPI(text)}
                  baseColor={variables.textValue}
                  labelFontSize={variables.textValue}
                />
              </Item>
              {/* <Item>
                <Input placeholder="Name db"
                  placeholderTextColor="#EEEEEE"
                  onChangeText={this.onChangeNameDB}
                  style={GlobalStyles.inputBox}
                  value={this.state.name_db}
                  textAlign={'center'} />
              </Item>
              <Item>
                <Input placeholder="User db"
                  placeholderTextColor="#EEEEEE"
                  onChangeText={this.onChangeUserDB}
                  style={GlobalStyles.inputBox}
                  value={this.state.user_db}
                  textAlign={'center'} />
              </Item>
              <Item>
                <Input placeholder="Pass db"
                  placeholderTextColor="#EEEEEE"
                  onChangeText={this.onChangePassDB}
                  style={GlobalStyles.inputBox}
                  value={this.state.pass_db}
                  textAlign={'center'} />
              </Item> */}

              {/* <Modal
                      animationType='fade'
                      transparent={true}
                      visible={this.state.isModalOpen}
                      onRequestClose={() => { }}>
                      <TouchableHighlight
                          onPress={(e) => this.setState({ isModalOpen: false })}
                          style={styles.container}>
                          <View style={[styles.container, styles.modalBackground]}>
                              <View
                                  style={[styles.innerContainer, styles.innerContainerTransparent]}>
                                  <Text>{this.state.modalText}</Text>
                              </View>
                          </View>
                      </TouchableHighlight>
                  </Modal> */}
              <View style={[GlobalStyles.row, { marginTop: 20 }]}>
                <View style={[GlobalStyles.rowRight, {}]}>
                  <Button success
                    onPress={() => this.onSave(this.state.server_ip, this.state.name_api)}
                    style={[GlobalStyles.buttonCustom1, { borderRadius: 50 }]}>
                    <Text style={{ padding: 0, fontWeight: 'bold' }}>Sao lưu  <Icon style={[GlobalStyles.iconHeader, { fontSize: 20 }]} name="ios-create" />
                    </Text>
                  </Button>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </StyleProvider>
    );
  }
}
