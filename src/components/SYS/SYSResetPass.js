import React, {Component} from 'react';
import { View, Image, KeyboardAvoidingView } from 'react-native';
import {Root, Container, Header, Content, Toast, Button, Text, Item, Input,
  StyleProvider, getTheme } from 'native-base';
import customVariables from '../../assets/styles/variables';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import GlobalStyles from "../../assets/styles/GlobalStyles";

export default class SYSResetPass extends Component {
	static navigationOptions = {
		headerTitle: 'Lấy lại mật khẩu',
	}
	updateProfile (){

			alert('Please check email..')
			/*
			const {firstname,lastname,country,id_passport,phone,address,birthday,
							work_addr, emergency_contact,emergency_email,city}= this.state;
			if(firstname ==""){
					Toast.show({
							text: 'First Name should not be empty!',
							buttonText: 'Error',
							position: "bottom"
						})
					return;
			}
			if(lastname ==""){
					Toast.show({
							text: 'Last Name should not be empty!',
							buttonText: 'Error',
							position: "bottom"
						})
					return;
			}
			if(country ==""){
					Toast.show({
							text: 'Country should not be empty!',
							buttonText: 'Error',
							position: "bottom"
						})
					return;
			}
			if(phone ==""){
					Toast.show({
							text: 'Phone number should not be empty!',
							buttonText: 'Error',
							position: "bottom"
						})
					return;
			}
			if(address ==""){
					Toast.show({
							text: 'Address should not be empty!',
							buttonText: 'Error',
							position: "bottom"
						})
					return;
			}
			if(birthday ==""){
					Toast.show({
							text: 'Birthday should not be empty!',
							buttonText: 'Error',
							position: "bottom"
						})
					return;
			}
				var isThis=this;
			 DefaultPreference.get('usernameid').then(function(value) {
					 let p_username_id=value;
					 let p_emailaddress="email";
					 let p_password=getMD5("1234");
					 let p_firstname=firstname;
					 let p_lastname=lastname;
					 let p_datebirthday=birthday;
					 let p_addresshome=address;
					 let p_addresswork=city;
					 let p_phonenumber=phone;
					 let p_identifynumber=id_passport;
					 let p_emagencycontactaddress=emergency_contact;
					 let p_emagencycontactemail=emergency_email;
					 let p_logintype_id="web";
					 let p_country=country;
					 let p_translater_type="";
					 let p_client_type="";
					 let p_del_if="0";
					 let para="p_username_id|p_emailaddress|p_password|p_firstname|p_lastname|p_datebirthday|p_addresshome|p_addresswork|p_phonenumber"+
									 "|p_identifynumber|p_emagencycontactaddress|p_emagencycontactemail|p_logintype_id|p_country|p_translater_type|p_client_type|p_del_if";
						console.log("log p_country:---------->"+p_country);
					 let key=".";
					 let action="EDIT";
					 let procedure="mob_upd_translater_info";
					 console.log("log procedure:---------->"+procedure);
					 let val=p_username_id+"|"+p_emailaddress+"|"+p_password+"|"+p_firstname+"|"+p_lastname+"|"+p_datebirthday+"|"+p_addresshome+"|"+p_addresswork+"|"+
					 p_phonenumber+"|"+p_identifynumber+"|"+p_emagencycontactaddress+"|"+p_emagencycontactemail+"|"+p_logintype_id+"|"+p_country+"|"+p_translater_type+"|"+p_client_type+"|"+ p_del_if;
					 console.log("log val:---------->"+val);
					 OnExcute(key,action,procedure,para,val).then((res) => {
										console.log("log:---------->"+res);
										var json_obj = JSON.parse(res);
										console.log("results: " + json_obj.results);
										console.log("totals: " + json_obj.totals);
										var data_info=json_obj.objcurdatas[0];
										console.log("data_info:columns-> " + data_info.columns);
										console.log("totalrows: " + data_info.totalrows);
										if(data_info.totalrows>0)
										{
												Toast.show({
														text: 'Update successful!',
														buttonText: 'Okay',
														position: "bottom"
													})
												console.log("Update OK. ");
										}
										else {
												console.log("Login failed");
												isThis.setState({ isModalOpen: true, modalText: 'Failed to connect, check internet settings' });
										}
								});
				});
				*/
	}

	render() {
		return (
            <StyleProvider style={getTheme(customVariables)}>
    			<KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} scrollEnabled keyboardShouldPersistTaps='always'>
                    <View style={GlobalStyles.container}>
                        <View style={[GlobalStyles.wrapLoginLogo]}>
                            <Image style={GlobalStyles.logo} source={require('../../assets/icons/logo_sm.png')}/>
                        </View>
                        <View style={[GlobalStyles.wrapLoginInput]}>
                            <Item>
                              <Input placeholder="E-mail" placeholderTextColor="#EEEEEE" style={GlobalStyles.inputBox} textAlign={'center'} />
                            </Item>
                            <Image style={GlobalStyles.line} source={require('../../assets/images/line.png')}/>
                            <View style={GlobalStyles.space}></View>
                            <View style={[GlobalStyles.row, GlobalStyles.minHeight70]}>
                                <Button success onPress={() => this.updateProfile()}>
                                    <Text>Reset Password</Text>
                                </Button>
                            </View>
                            <View style={GlobalStyles.spaceSmall}></View>
                        </View>
                        <View style={[GlobalStyles.wrapLoginBottom]}>
                            <Text style={[GlobalStyles.colorWhite, GlobalStyles.fontSize13]}>Already have an account?</Text>
                            <Text style={[GlobalStyles.colorMain, GlobalStyles.fontSize20]}
                             onPress={() => this.props.navigation.navigate('Login')}>LOG IN</Text>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </StyleProvider>
		);
	}
}
