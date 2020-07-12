import React, { Component } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { Root, Container, Body, Text, StyleProvider, getTheme, Icon, Toast } from 'native-base';
import customVariables from '../../../assets/styles/variables';
import GlobalStyles from '../../../assets/styles/GlobalStyles';
import Loader from '../../SYS/Loader';
import moment, { months } from 'moment';
import 'moment/locale/vi';
import { getLoginJson, getDataJson, OnExcute } from '../../../services/FetchData';
import DefaultPreference from 'react-native-default-preference';
import variables from '../../../assets/styles/variables';
import ZocialIcons from 'react-native-vector-icons/Zocial';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity, TouchableHighlight } from 'react-native-gesture-handler';

export default class MBHRAN001 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			monthYearGetData: moment().format('YYYY'),
			data: [],
			// numberRecordRender: 15,
			checkNullData: false,
			userPk: '',
			userName: ''
		};
	}

	componentDidMount() {
		DefaultPreference.getAll().then(async (valueAll) => {
			let user_pk = valueAll['user_pk'];
			let username = valueAll['username'];
			await this.setState(
				{ userPk: user_pk, userName: username, },
				await this.getData
			)
		})
	}

	getData = (monthYearGetData = moment().format('YYYY')) => {
		this.setState({ loading: true });

		const procedure = "STV_HR_SEL_MBI_MBHRAN001_0";
		const para = `${this.state.userPk}|${monthYearGetData}|${this.state.userName}`;
		console.log("log para:---------->" + para);

		getDataJson(procedure, para, '1').then((res) => {
			console.log(res);
			let data_info = !!res.objcurdatas ? res.objcurdatas[0] : res;

			const totalrows = !!data_info ? data_info.totalrows : 0;
			let data = this.state.data;
			if (totalrows > 0) {
				data = data.concat(data_info.records);
				this.setState({ data })
			} else {
				if (!!res.error) {
					let toast = variables.toastError;
					toast.text = res.error[1].mgs;
					Toast.show(toast);
				} else {
					this.setState({ checkNullData: true })
				}
			}
			this.setState({ loading: false });
		});
	}

	updateReadStatus = (p_pk) => {
		const action = 'UPDATE'
		const procedure = 'STV_HR_UPD_MBI_MBHRAN001_0';
		const para = `${action}|${p_pk}|${this.state.userName}`
		OnExcute(action, procedure, para).then(res => {
			let data_info = res.objcurdatas[0];

			if (data_info.totalrows > 0 && data_info.records[0].status == "OK") {
				let data = this.state.data;
				const index = data.findIndex(i => i.pk == p_pk);
				data[index].read_yn = 'Y';
				this.setState({ data });
			}
		})
	}

	renderRow = ({ item, index }) => {
		const read_yn = item.read_yn;
		return (
			<TouchableOpacity onPress={() => { this.showAlert(item.pk, item.title, item.content, read_yn) }}>
				<View style={{
					paddingVertical: 5, paddingHorizontal: 7,
					borderBottomColor: '#CCCCCC', borderBottomWidth: 0.5,
					backgroundColor: read_yn == 'N' ? '#edf2fa' : 'white', flexDirection: 'row'
				}}>
					<View style={{
						alignSelf: 'flex-start', marginRight: 7,
						backgroundColor: 'red',
						borderRadius: 20,
						width: 30, height: 30,
						justifyContent: 'center',
					}}>
						{read_yn == 'N' ?
							<MaterialIcons
								name="notifications-active"
								style={{ color: 'white', alignSelf: 'center', fontSize: 23, fontWeight: 'bold', }}
							/>
							:
							<MaterialIcons
								name="notifications"
								style={{ color: 'white', alignSelf: 'center', fontSize: 23, fontWeight: 'bold', }}
							/>
						}

					</View>
					<Body style={{ backgroundColor: '', alignItems: 'flex-start' }}>
						<View style={styles.cart}>
							<Text style={[styles.textCart, { fontWeight: 'bold', },]}>
								{item.title}
							</Text>

							<View style={GlobalStyles.spaceHorizontalSmall}></View>
						</View>

						<View style={[styles.cart, { marginTop: '1%', }]}>
							<Text numberOfLines={2} style={[styles.textCart, { fontWeight: '400', fontSize: 13.5, width: '99%' },]}>
								{item.content}
							</Text>
						</View>

						<View style={[styles.cart, { marginTop: '2%' }]}>
							<Icon name="time" style={{ color: variables.listBorderColor, fontSize: 17, }} />
							<Text
								style={[
									(styles.textCart,
										{
											fontSize: 12.5,
											marginLeft: '1.5%',
											marginTop: '0.37%',
											color: variables.btnDisabledBg,
										}),
								]}
							>
								{moment(item.post_dt).format('HH:mm:ss')}
							</Text>

							<View style={GlobalStyles.spaceHorizontalSmall}></View>
							<Icon name="ios-calendar" style={{
								marginLeft: '2%',
								color: variables.listBorderColor,
								fontSize: 17,
							}}
							/>
							<Text
								style={[
									(styles.textCart,
										{
											fontSize: 12.4,
											marginLeft: '1.5%',
											marginTop: '0.6%',
											color: variables.btnDisabledBg,
										}),
								]}
							>
								{moment(item.post_dt).format('dd-MM-YYYY')}
							</Text>
						</View>

						<View style={[styles.cart, { marginTop: '1.5%' }]}>
							<ZocialIcons name="persona" style={{ color: variables.listBorderColor, fontSize: 11.5, }} />
							<Text style={[(styles.textCart, { fontSize: 12.4, marginLeft: '1.5%', marginTop: '0.2%', color: variables.btnDisabledBg, }),]}>
								Được gửi từ bởi:
						<Text style={(styles.textCart, { fontSize: 12, marginLeft: '1.5%', marginTop: '0.6%', color: variables.textValue, fontStyle: 'italic' })}>
									{` ${item.org_nm.substring(item.org_nm.indexOf('|') + 1)}`}
								</Text>
							</Text>
						</View>

						<View style={[styles.cart, { marginTop: '1.5%' }]}>
							<Icon name="ios-send" style={{ color: variables.listBorderColor, fontSize: 17, }} />
							<Text style={[(styles.textCart, { fontSize: 12.4, marginLeft: '1.5%', marginTop: '0.5%', color: variables.btnDisabledBg, }),]}>
								Được gửi từ phòng:
						<Text style={(styles.textCart, { fontSize: 12, marginLeft: '1.5%', marginTop: '0.6%', color: variables.textValue, fontStyle: 'italic' })}>
									{` ${item.org_nm.substring(0, item.org_nm.indexOf('|'))}`}
								</Text>
							</Text>
						</View>

					</Body>
				</View>

			</TouchableOpacity>
		)
	}

	handleLoadMore = () => {
		if (!this.state.checkNullData) {
			const monthYearGetData = this.state.monthYearGetData;
			const monthBefore = moment(monthYearGetData, 'YYYY').subtract(1, 'months').format('YYYY');
			this.setState({ monthYearGetData: monthBefore })
			this.getData(monthBefore)
		}
	}

	showAlert(p_pk, title, body, read_yn) {
		Alert.alert(title, body, [{ text: 'OK', onPress: () => console.log('OK Pressed') }], {
			cancelable: false,
		});
		if (read_yn == 'N') {
			this.updateReadStatus(p_pk);
		}
	}

	render() {
		// const lengthData = this.state.data.length;

		return (
			<StyleProvider style={getTheme(customVariables)}>
				<Root>
					<Container>
						<Loader loading={this.state.loading} />

						<FlatList style={[{ flex: 1, }]}
							extraData={this.state}
							// data={this.state.data.slice(0, this.state.numberRecordRender)}
							data={this.state.data}
							keyExtractor={(item, index) => { item.pk }}
							renderItem={this.renderRow}
							onEndReached={() => this.handleLoadMore()}
							onEndReachedThreshold={0}
							refreshControl={
								<RefreshControl
									progressViewOffset={40}
									refreshing={this.state.loading}
									onRefresh={() => {
										this.setState({
											monthYearGetData: moment().format('YYYY'),
											data: [],
											// numberRecordRender: 15,
											checkNullData: false,
										}, this.getData())
									}}
								/>
							} />

					</Container>
				</Root>
			</StyleProvider>
		);
	}
}

const styles = StyleSheet.create({
	cart: {
		flexDirection: 'row',
		//borderTopWidth: 0.5,
		//borderColor: '#d9e1e8',
		//marginLeft: 10,
		//marginRight: 10,
	},
	textCart: {
		marginTop: 1,
		marginBottom: 1,
		//fontWeight: 'bold',
		fontSize: 14.5,
		fontWeight: '300',
	},
});
