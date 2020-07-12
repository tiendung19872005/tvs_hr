/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, YellowBox, AsyncStorage, Alert } from 'react-native';
import MainStack from './src/components/SYS/MainStack';
import firebase from 'react-native-firebase';

const instructions = Platform.select({
	ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
	android: 'Double tap R on your keyboard to reload,\n' + 'Shake or press menu button for dev menu',
});

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
		// YellowBox.ignoreWarnings([
		// 	'Warning: componentWillMount is deprecated',
		// 	'Warning: componentWillReceiveProps is deprecated',
		// ]);
	}

	async componentDidMount() {
		this.checkPermission();
		this.createNotificationListeners(); //add this line
	}

	//1
	async checkPermission() {
		const enabled = await firebase.messaging().hasPermission();
		if (enabled) {
			this.getToken();
		} else {
			this.requestPermission();
		}
	}

	//3
	async getToken() {
		let fcmToken = await AsyncStorage.getItem('fcmToken');
		if (!fcmToken) {
			fcmToken = await firebase.messaging().getToken();
			if (fcmToken) {
				// user has a device token
				await AsyncStorage.setItem('fcmToken', fcmToken);
			}
		}
	}

	//2
	async requestPermission() {
		try {
			await firebase.messaging().requestPermission();
			// User has authorised
			this.getToken();
		} catch (error) {
			// User has rejected permissions
			console.log('permission rejected');
		}
	}

	//Remove listeners allocated in createNotificationListeners()
	componentWillUnmount() {
		this.notificationListener();
		this.notificationOpenedListener();
	}

	async createNotificationListeners() {
		/*
		 * Triggered when a particular notification has been received in foreground
		 * */
		this.notificationListener = firebase.notifications().onNotification(notification => {
			const { title, body } = notification;
			firebase.notifications().setBadge(0);
			this.showAlert(title, body);
		});

		/*
		 * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
		 * */
		this.notificationOpenedListener = firebase.notifications().onNotificationOpened(notificationOpen => {
			const { title, body } = notificationOpen.notification;
			firebase.notifications().setBadge(0);
			this.showAlert(title, body);
		});

		/*
		 * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
		 * */
		const notificationOpen = await firebase.notifications().getInitialNotification();
		if (notificationOpen) {
			const { title, body } = notificationOpen.notification;
			firebase.notifications().setBadge(0);
			this.showAlert(title, body);
		}
		/*
		 * Triggered for data only payload in foreground
		 * */
		this.messageListener = firebase.messaging().onMessage(message => {
			//process data message
			firebase.notifications().setBadge(0);
			console.log(JSON.stringify(message));
		});

		// this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
		// 	firebase.notifications().getBadge()
		// 		.then(count => {
		// 			console.log(notification)
		// 			count++
		// 			firebase.notifications().setBadge(count)
		// 		})
		// 		.then(() => {
		// 			console.log('Doing great')
		// 		})
		// 		.catch(error => {
		// 			console.log('fail to count')
		// 		})

		// })
	}

	showAlert(title, body) {
		Alert.alert(title, body, [{ text: 'OK', onPress: () => console.log('OK Pressed') }], {
			cancelable: false,
		});
	}

	render() {
		return <MainStack />;
	}
}

/*
type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
         <MainStack />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
*/
