import React from 'react';
import { FlatList, AppRegistry, RefreshControl, View, TouchableWithoutFeedback, TextInput, Image, StatusBar, Alert, StyleSheet, Platform, Modal, TouchableHighlight, Dimensions, TouchableOpacity } from "react-native";
import {
	Root, Toast, Container, ListItem, Body, Content, Header, Left, Right, Picker, Spinner,
	Title, Input, Item, Label, Text, StyleProvider, getTheme, Icon, List, ListView, Tab, Tabs, TabHeading, ScrollableTab
} from "native-base";
import { Badge, withBadge } from 'react-native-elements'
import variables from '../../../assets/styles/variables';
import GlobalStyles from '../../../assets/styles/GlobalStyles';
import { PieChart, StackedBarChart, BarChart, Grid, XAxis, YAxis, StackedAreaChart, LineChart } from 'react-native-svg-charts'
import { LinearGradient, Stop, Defs, Text as Text1 } from 'react-native-svg'
import * as scale from 'd3-scale'
import Loader from '../../SYS/Loader';
import DefaultPreference from 'react-native-default-preference';
import { OnExcute, getUserInfo, getDataJson } from '../../../services/FetchData';
import moment from 'moment';
import MonthSelectorCalendar from 'react-native-month-selector'; //add this import line
import { Dropdown } from 'react-native-material-dropdown';

export default class MBHRAN0002_1 extends React.PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			data: [],
			dataYAxis: [],
			selectedSlice: {
				label: '',
				value: ''
			},
			labelWidth: 0,

			isModalOpen: false,
			month: moment(),

			isModalOpen1: false,
			month1: moment(),

			emp_id: '',
			org_pk: '',

			cb_org: [],
			orgValue: '',
		}
	}

	componentDidMount = async () => {
		DefaultPreference.getAll().then(async (valueAll) => {
			// user_pk = valueAll['user_pk'];
			username = valueAll['username'];
			emp_id = valueAll['emp_id'];
			org_pk = valueAll['org_pk'];

			await this.setState({ emp_id, org_pk });
			let procedure = "STV_HR_SEL_MBI_MBHRAN002_1";
			let para = `ALL|${username}`;
			getDataJson(procedure, para, '1')
				.then(async (res) => {
					let cb_org = res.objcurdatas[0].records;
					await this.setState({ cb_org, orgValue: cb_org[0].value },
						await this.getData(moment(), moment(), cb_org[0].value))
				})
		})
	}

	getData = (fMonth, tMonth, orgValue = this.state.orgValue) => {
		// this.setState({ loading: true })
		let that = this;
		console.log(this.state.month.format('YYYYMM'));
		const procedure = "STV_HR_SEL_MBI_MBHRAN002_0";
		const para = `${this.state.emp_id}|${fMonth.format('YYYYMM')}|${tMonth.format('YYYYMM')}|${orgValue}|`;
		console.log("log para:---------->" + para);
		getDataJson(procedure, para, '1')
			.then((res) => {
				console.log(res);
				let data_info = res.objcurdatas[0];
				let data = [];
				if (data_info.totalrows > 0) {
					data_info.records.forEach((item, index) => {
						data.push(item.gross_atm);
						// if (index == moment(new Date()).format('M')) {
						// 	that.setState({ selectedSlice: { label: 'Tháng ' + item.work_month.substr(3) + item.work_month.substr(0, 3), value: item.net_atm } })
						// }
					})
				}
				this.setState({
					data,
					dataYAxis: [Math.max(...data), 0],
					loading: false
				});
			});

	}

	onMonthTapped = (month) => {
		const startMonth = this.getAbsoluteMonths(this.state.month);
		const endMonth = this.getAbsoluteMonths(month);
		const monthDifference = endMonth - startMonth;
		if (monthDifference > 12) {
			let toast = variables.toastError;
			toast.text = 'Chọn tối đa là 12 tháng!';
			Toast.show(toast);
		}

		if (this.state.month1 < month) {
			let toast = variables.toastError;
			toast.text = 'Từ ngày phải nhỏ hơn đến ngày!';
			Toast.show(toast);
		} else {
			this.setState({
				month: month,
				isModalOpen: false,
			});
			this.getData(month, this.state.month1);
		}
	}

	onMonthTapped1 = (month) => {
		const startMonth = this.getAbsoluteMonths(this.state.month);
		const endMonth = this.getAbsoluteMonths(month);
		const monthDifference = endMonth - startMonth;
		if (monthDifference > 12) {
			let toast = variables.toastError;
			toast.text = 'Chọn tối đa là 12 tháng!';
			Toast.show(toast);
		}

		if (month < this.state.month) {
			let toast = variables.toastError;
			toast.text = 'Đến ngày phải lớn hơn từ ngày!';
			Toast.show(toast);
		} else {
			this.setState({
				month1: month,
				isModalOpen1: false,
			});
			this.getData(this.state.month, month);
		}

	}

	getAbsoluteMonths(momentDate) {
		const months = Number(momentDate.format("MM"));
		const years = Number(momentDate.format("YYYY"));
		return months + (years * 12);
	}

	onChangeORG = async (value, index) => {
		await this.setState({ orgValue: value },
			await this.getData(this.state.month, this.state.month1, value)
		);
		// console.log(this.state.orgLable)
	}

	render() {
		const nextIcon = React.createElement(Icon, { name: 'ios-arrow-forward', style: [GlobalStyles.iconHeader, { paddingHorizontal: 16, color: variables.textValue }] });
		const prevIcon = React.createElement(Icon, { name: 'ios-arrow-back', style: [GlobalStyles.iconHeader, { paddingHorizontal: 16, color: variables.textValue }] });

		// console.log(this.state.data);
		const CUT_OFF = Math.max(...this.state.dataYAxis)
		const Labels = ({ x, y, bandwidth, data }) => (
			data.map((value, index) => (
				<Text1
					key={index}
					x={x(index) + (bandwidth / 2)}
					y={value < CUT_OFF ? y(value) - 10 : y(value) + 12}
					fontSize={9}
					fontWeight='700'
					fill={value >= CUT_OFF ? 'white' : 'gray'}
					alignmentBaseline={'middle'}
					textAnchor={'middle'}
				>
					{value}
				</Text1>
			))
		)
		const Gradient = () => (
			<Defs key={'gradient'}>
				<LinearGradient id={'gradient'} x1={'0%'} y={'0%'} x2={'15%'} y2={'100%'}>
					<Stop offset={'0%'} stopColor={variables.textValue} />
					<Stop offset={'100%'} stopColor={variables.backgroundColorTV} />
					{/* <Stop offset={'0%'} stopColor={'rgb(134, 65, 244)'} />
					<Stop offset={'100%'} stopColor={'rgb(66, 194, 244)'} /> */}
				</LinearGradient>
			</Defs>
		)

		// const { labelWidth, selectedSlice } = this.state;
		// const { label, value } = selectedSlice;
		// const keys = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',];
		// const shortKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
		// const values = this.state.data;
		// const colors = ['#600080', '#9900cc', '#c61aff', '#d966ff', '#ecb3ff', '#ecb3ff', '#d966ff', '#c61aff', '#9900cc', '#600080', '#c61aff', '#9900cc',]
		// const data = keys.map((key, index) => {
		// 	return {
		// 		key,
		// 		month: shortKeys[index],
		// 		value: values[index],
		// 		svg: { fill: colors[index] },
		// 		//arc: { outerRadius: (70 + values[index]/100) + '%', padAngle: label === key ? 0.1 : 0 },
		// 		arc: {
		// 			innerRadius: '45%', outerRadius: label === key ? '123%' + '%' : '113%', padAngle: label === key ? 0.08 : 0.025,
		// 		},
		// 		onPress: () => this.setState({ selectedSlice: { label: key, value: values[index] } })
		// 	}
		// })
		// const deviceWidth = Dimensions.get('window').width;
		// const Labels2 = ({ slices, height, width }) => {
		// 	return slices.map((slice, index) => {
		// 		const { labelCentroid, pieCentroid, data } = slice;
		// 		return (
		// 			<Text1
		// 				key={index}
		// 				x={pieCentroid[0]}
		// 				y={pieCentroid[1]}
		// 				fill={'white'}
		// 				textAnchor={'middle'}
		// 				alignmentBaseline={'middle'}
		// 				fontSize={12}
		// 				stroke={'white'}
		// 				strokeWidth={0.2}
		// 			>
		// 				{data.month}
		// 			</Text1>
		// 		)
		// 	})
		// }

		return (
			<StyleProvider style={getTheme(variables)}>
				<Root>
					<Container>
						<Loader loading={this.state.loading} />
						<Dropdown
							itemCount={8}
							baseColor={'gray'}
							selectedItemColor="black"
							textColor={variables.textValue}
							label={'Phòng ban'}
							value={this.state.cb_org.length > 0 ? this.state.cb_org[0].label : ''}
							data={this.state.cb_org}
							dropdownOffset={{ top: 20, }}
							rippleInsets={{ top: 0, bottom: -12, right: 0, left: 0, }}
							dropdownPosition={-9.2}
							containerStyle={{ backgroundColor: 'white', overflow: 'hidden', borderRadius: 5, borderWidth: 0.5, borderColor: 'gray', height: 53, marginTop: 5, paddingLeft: 5, marginHorizontal: 5 }}
							pickerStyle={{ backgroundColor: variables.cardDefaultBg, borderRadius: 5, }}
							style={{ fontSize: 15, fontWeight: '500', fontSize: 16 }} //for changed text color
							onChangeText={(text, index) => this.onChangeORG(text, index)}
						// renderAccessory={() => {
						//     return (
						//         <Icon style={[GlobalStyles.iconHeader, { color: 'black', marginTop: 2, marginRight: 10, color: variables.textValue }]} name="arrow-dropdown" />
						//     )
						// }}
						/>
						<View ref={(ref) => { this.marker = ref }}
							onLayout={({ nativeEvent }) => {
								if (this.marker) {
									this.marker.measure((x, y, width, height, pageX, pageY) => {
										this.setState({ pageX, pageY, heightOfCld: height });
									})
								}
							}}
							style={[, { flexDirection: 'row', backgroundColor: 'white', borderColor: variables.cardBorderColor, borderWidth: 0.7, borderRadius: 10, marginVertical: 5, marginHorizontal: 5 }]}>
							<View style={[GlobalStyles.rowLeft1, {}]}>
								<Icon style={[GlobalStyles.iconHeader, { color: 'black', fontSize: 19, color: 'black', marginLeft: 5 }]} name="calendar" />
								<Text style={{ fontSize: 14, marginLeft: 5 }}>Từ tháng: </Text>
								<View style={[styles.dropDownDay,]} >
									<TouchableOpacity success onPress={() => this.setState({ isModalOpen: true })} style={[{ flexDirection: 'row', alignSelf: 'center', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }]} >
										<Text style={{ marginHorizontal: 'auto', marginVertical: 'auto', marginLeft: 6, marginRight: 6, marginTop: '0.5%', color: 'black', fontSize: 15 }}>{moment(this.state.month).format("MM-YYYY")}</Text>
										<Icon style={[GlobalStyles.iconHeader, { color: 'black', marginTop: 4 }]} name="arrow-dropdown" />
									</TouchableOpacity>
								</View>
								<View style={[GlobalStyles.rowLeft1, {}]}>
									{/* <Icon style={[GlobalStyles.iconHeader, { color: 'black', fontSize: 19, color: 'black', marginLeft: 5 }]} name="calendar" /> */}
									<Text style={{ fontSize: 14, marginLeft: 10 }}>Đến tháng: </Text>
								</View>
								<View style={[styles.dropDownDay,]} >
									<TouchableOpacity success onPress={() => this.setState({ isModalOpen1: true })} style={[{ flexDirection: 'row', alignSelf: 'center', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }]} >
										<Text style={{ marginHorizontal: 'auto', marginVertical: 'auto', marginLeft: 6, marginRight: 6, marginTop: '0.5%', color: 'black', fontSize: 15 }}>{moment(this.state.month1).format("MM-YYYY")}</Text>
										<Icon style={[GlobalStyles.iconHeader, { color: 'black', marginTop: 4 }]} name="arrow-dropdown" />
									</TouchableOpacity>
								</View>
							</View>

							<View style={[, {}]}>


								<Modal
									presentationStyle='overFullScreen'
									animationType="fade"
									transparent={true}
									visible={this.state.isModalOpen}
									onRequestClose={() => { this.setState({ isModalOpen: false }) }}
								>
									<TouchableOpacity
										style={[styles.container]}
										activeOpacity={1}
										onPressOut={() => { this.setState({ isModalOpen: false }) }}
									>
										<TouchableWithoutFeedback>
											<View style={[styles.modalBackground, { position: 'absolute', top: this.state.pageY + this.state.heightOfCld, left: '2%', borderRadius: 5, width: '85%', }]}>
												<MonthSelectorCalendar
													nextIcon={nextIcon}
													prevIcon={prevIcon}
													nextText='Next'
													prevText='Prev'
													selectedBackgroundColor={variables.backgroundColorTV}
													seperatorHeight={1}
													monthFormat='M'
													seperatorColor='#d9e1e8'
													swipable={true}
													selectedDate={this.state.month}
													currentDate={this.state.month}
													initialView={this.state.month}
													velocityThreshold={0.1}
													directionalOffsetThreshold={60}
													gestureIsClickThreshold={3}
													yearTextStyle={{ color: variables.backgroundColorTV, fontSize: 14, fontWeight: 'bold' }}
													monthTextStyle={{ fontSize: 13, fontWeight: 'bold' }}
													currentMonthTextStyle={{ color: variables.textValue, fontWeight: 'bold' }}
													localeLanguage='vi'
													localeSettings={moment.locale('vi')}
													onMonthTapped={this.onMonthTapped}
												//onYearChanged={this.onYearChanged}
												/>
											</View>
										</TouchableWithoutFeedback>
									</TouchableOpacity>
								</Modal>
							</View>
						</View>

						<View ref={(ref) => { this.marker1 = ref }}
							onLayout={({ nativeEvent }) => {
								if (this.marker1) {
									this.marker1.measure((x, y, width, height, pageX, pageY) => {
										this.setState({ pageX1: pageX, pageY1: pageY, heightOfCld1: height });
									})
								}
							}}
							style={[, { flexDirection: 'row', backgroundColor: 'white', borderColor: variables.cardBorderColor, borderWidth: 0.7, borderRadius: 10, marginHorizontal: 5 }]}>
							<View style={[, {}]}>

								<Modal
									presentationStyle='overFullScreen'
									animationType="fade"
									transparent={true}
									visible={this.state.isModalOpen1}
									onRequestClose={() => { this.setState({ isModalOpen1: false }) }}
								>
									<TouchableOpacity
										style={[styles.container]}
										activeOpacity={1}
										onPressOut={() => { this.setState({ isModalOpen1: false }) }}
									>
										<TouchableWithoutFeedback>
											<View style={[styles.modalBackground, { position: 'absolute', top: this.state.pageY1 + this.state.heightOfCld1, right: '2%', borderRadius: 5, width: '85%', }]}>
												<MonthSelectorCalendar
													nextIcon={nextIcon}
													prevIcon={prevIcon}
													nextText='Next'
													prevText='Prev'
													selectedBackgroundColor={variables.backgroundColorTV}
													seperatorHeight={1}
													monthFormat='M'
													seperatorColor='#d9e1e8'
													swipable={true}
													selectedDate={this.state.month1}
													currentDate={this.state.month1}
													initialView={this.state.month1}
													velocityThreshold={0.1}
													directionalOffsetThreshold={60}
													gestureIsClickThreshold={3}
													yearTextStyle={{ color: variables.backgroundColorTV, fontSize: 14, fontWeight: 'bold' }}
													monthTextStyle={{ fontSize: 13, fontWeight: 'bold' }}
													currentMonthTextStyle={{ color: variables.textValue, fontWeight: 'bold' }}
													localeLanguage='vi'
													localeSettings={moment.locale('vi')}
													onMonthTapped={this.onMonthTapped1}
												//onYearChanged={this.onYearChanged}
												/>
											</View>
										</TouchableWithoutFeedback>
									</TouchableOpacity>
								</Modal>
							</View>
						</View>


						<Content>
							<View style={{ flexDirection: 'row' }}>
								<YAxis
									style={{ height: '96%', backgroundColor: ' ', marginLeft: 4, }}
									data={this.state.dataYAxis}
									contentInset={{ top: 15, bottom: 15 }}
									svg={{
										fill: variables.textValue,
										fontSize: 9,
										fontWeight: '500',

									}}
									numberOfTicks={8}
									formatLabel={(value) => `${value}`}
								/>
								<View style={{ flex: 1, marginHorizontal: 2 }}>
									<BarChart
										style={{ height: '96%', }}
										data={this.state.data}
										svg={{
											fill: 'url(#gradient)',
										}}
										yAccessor={({ item }) => Number(item)}
										animate={true}
										animationDuration={200}
										numberOfTicks={20}
										contentInset={{ top: 15, bottom: 15 }}
										gridMin={0}
									// spacing={0.5}
									>
										<Grid direction={Grid.Direction.HORIZONTAL} />
										<Gradient />
										<Labels />

									</BarChart>
									{/* <XAxis
										// xAccessor={({ item }) => item.title}
										// style={{ marginHorizontal: -10, marginTop: 10 }}
										data={this.state.data}
										formatLabel={(value, index) => 'T' + (index + 1)}
										contentInset={{ top: 35, left: 30, }}
										scale={scale.scaleBand}
										svg={{
											fill: variables.backgroundColorTV,
											fontSize: 11,
											fontWeight: '500'
										}}
									/> */}
									<XAxis
										contentInset={{ left: 10, right: 10 }}
										// style={{ justifyContent: 'space-around' }}
										data={this.state.data}
										// scale={scale.scaleBand}
										formatLabel={(value, index) => 'T' + (index + 1)}
										// spacingInner={20}
										svg={{
											fill: variables.backgroundColorTV,
											fontSize: 15,
											fontWeight: 'bold',
											// rotation: 30
										}}
									// labelStyle={{ color: 'red' }}
									/>
								</View>



							</View>

							{/* <View style={{ justifyContent: 'center', flex: 1 }}>
								<PieChart
									style={{ height: 200 }}
									animate={true}
									animationDuration={300}
									valueAccessor={({ item }) => item.value}
									outerRadius={'82%'}
									spacing={0}
									innerRadius={'45%'}
									data={data}
								>
									<Labels2 />

								</PieChart>

								<Text
									onLayout={({ nativeEvent: { layout: { width } } }) => {
										this.setState({ labelWidth: width });
									}}
									style={{
										position: 'absolute',
										left: deviceWidth / 2 - labelWidth / 2,
										textAlign: 'center',
										fontSize: 15, color: 'gray'
									}}>
									{`${label} \n ${value}`}
								</Text>
							</View> */}

						</Content>
					</Container>
				</Root>
			</StyleProvider >
		);
	}
}


const styles = StyleSheet.create({

	container: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.15)',

	},
	modalBackground: {
		backgroundColor: 'white',
	},
	container1: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.15)',
		// justifyContent: 'center',
		// alignItems: 'stretch',
	},
	dropDownDay: {
		alignSelf: 'flex-start',
		padding: 3,
		margin: 7,
		// borderBottomLeftRadius: 6,
		// borderTopRightRadius: 6,
		borderRadius: 10,
		backgroundColor: 'white',
		shadowColor: "black",
		shadowOffset: { width: 0, height: 0 },
		shadowRadius: 4,
		shadowOpacity: 0.2,
		zIndex: 2
	},
});


