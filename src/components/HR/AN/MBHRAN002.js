import React from 'react';
import { FlatList, AppRegistry, RefreshControl, View, TouchableWithoutFeedback, TextInput, Image, StatusBar, Alert, StyleSheet, Platform, Modal, TouchableHighlight, Dimensions, TouchableOpacity } from "react-native";
import {
	Root, Toast, Container, ListItem, Body, Content, Header, Left, Right, Picker, Spinner,
	Title, Input, Item, Label, Text, StyleProvider, getTheme, List, ListView, Tab, Tabs, TabHeading, ScrollableTab
} from "native-base";
import { Badge, withBadge } from 'react-native-elements'
import variables from '../../../assets/styles/variables';
import GlobalStyles from '../../../assets/styles/GlobalStyles';
import Loader from '../../SYS/Loader';
import MBHRAN002_1 from "./MBHRAN002_1";
import MBHRAN002_2 from "./MBHRAN002_2";
import MBHRAN002_3 from "./MBHRAN002_3";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class MBHRAN0002 extends React.PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			loading: false,
		}
	}

	render() {
		return (
			<StyleProvider style={getTheme(variables)}>
				<Root>
					<Container>
						<Loader loading={this.state.loading} />
						<Tabs
							renderTabBar={() => <ScrollableTab />}
							style={{}}
							tabBarActiveTextColor={variables.backgroundColorTV}
							tabBarUnderlineStyle={{ backgroundColor: variables.backgroundColorTV }}
							initialPage={0}
							scrollWithoutAnimation={false}
							tabBarPosition='top'
						// onChangeTab={({ i }) => this.onChangeTab(i)}
						>
							<Tab
								heading={
									<TabHeading style={{ backgroundColor: variables.tabBgColor, borderBottomColor: 'gray', paddingLeft: 10, paddingRight: 5 }}>
										<Text style={{ fontSize: 15, color: 'black', marginRight: 2 }}>Tổng thu nhập</Text>
										<MaterialIcons style={[GlobalStyles.iconHeader, { color: 'black', fontSize: 20 }]} name="attach-money" />
									</TabHeading>
								}>
								<MBHRAN002_1
								// callback={this.getResponse.bind(this)}
								// startingDay={this.state.startingDay} endingDay={this.state.endingDay}
								// data={this.state.dataChoPD}
								// tabLabel={"Chờ phê duyệt " + '(' + this.state.choduyet + ')'} 
								/>

							</Tab>
							<Tab
								heading={
									<TabHeading style={{ backgroundColor: variables.tabBgColor, borderColor: 'gray', borderLeftWidth: 0.5, paddingLeft: 10, paddingRight: 5 }}>
										<Text style={{ fontSize: 15, color: 'black', marginRight: 2 }}>Lương thực lãnh</Text>
										<MaterialIcons style={[GlobalStyles.iconHeader, { color: 'black', fontSize: 20 }]} name="attach-money" />
									</TabHeading>
								}>
								<MBHRAN002_2
								// callback={this.getResponse.bind(this)}
								// startingDay={this.state.startingDay} endingDay={this.state.endingDay}
								// data={this.state.dataDaPD}
								//  tabLabel={"Đã phê duyệt " + '(' + this.state.dapheduyet + ')'}
								/>

							</Tab>
							<Tab
								heading={
									<TabHeading style={{ backgroundColor: variables.tabBgColor, borderColor: 'gray', borderLeftWidth: 0.5, borderLeftWidth: 0.5, paddingLeft: 10, paddingRight: 5 }}>
										<Text style={{ fontSize: 15, color: 'black', marginRight: 2 }}>Tiền bảo hiểm</Text>
										<MaterialIcons style={[GlobalStyles.iconHeader, { color: 'black', fontSize: 20 }]} name="attach-money" />
									</TabHeading>
								}>
								<MBHRAN002_3
								// callback={this.getResponse.bind(this)}
								// startingDay={this.state.startingDay} endingDay={this.state.endingDay}
								// data={this.state.dataKhongPD}
								// tabLabel={"Không phê duyệt " + '(' + this.state.khongpheduyet + ')'} 
								/>
							</Tab>
						</Tabs>
					</Container>
				</Root>
			</StyleProvider >
		);
	}
}


const styles = StyleSheet.create({

});


