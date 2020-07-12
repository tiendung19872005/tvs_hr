import { StyleSheet } from 'react-native';
//import {vw, vh} from 'react-native-viewport-units';
import { Dimensions } from 'react-native';
import variables from './variables';
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
	container: {
		flex: 1,
		paddingLeft: 20,
		paddingRight: 20,
		backgroundColor: variables.backgroundOpactiColor,
	},
	wrapLoginLogo: {
		// height: '37%', // di khoang cach phia tren, thanh battery, wifi...
		justifyContent: 'center',
		alignItems: 'center',
	},
	wrapLoginLogoHome: {
		height: '10%', // di khoang cach phia tren, thanh battery, wifi...
		justifyContent: 'center',
		alignItems: 'center',
	},
	logo: {
		//width: '',
		//height:'30%'
	},
	logoHome: {
		//width: width/1.9,
		//height:'85%',
		//height:59,
	},
	wrapLoginLogoRight: {
		height: 0.2 * height - 25, // di khoang cach phia tren, thanh battery, wifi...
		justifyContent: 'center',
		alignItems: 'center',
	},
	wrapLoginInput: {
		width: '90%',
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
	},
	wrapLoginBottom: {
		height: 0.2 * height,
		alignItems: 'center',
		justifyContent: 'center',
	},
	wrapFlatList: {
		// width: width,
		// height: height - (0.32 * height - 25),
		backgroundColor: '#FFF',
	},
	wrapFlatList1: {
		width: width,
		height: height - (0.12 * height - 25),
		backgroundColor: '#FFF',
	},
	header: {
		paddingTop: 0.06 * height - 25,
		backgroundColor: '#1ab394',
	},
	titleHeader: {
		//fontSize: 18,
		justifyContent: 'center',
		alignItems: 'center',
	},
	iconHeader: {
		color: '#FFF',
		fontSize: 23,
		justifyContent: 'center',
		alignItems: 'center',
	},
	space: {
		height: 30,
	},
	spaceHorizontal: {
		width: 30,
	},
	spaceSmall: {
		height: 10,
	},
	spaceHorizontalSmall: {
		width: 5,
	},
	textCenter: {
		textAlign: 'center',
	},
	textLeft: {
		textAlign: 'left',
	},
	textRight: {
		textAlign: 'right',
	},
	justifyContentCenter: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	colorWhite: {
		color: '#FFF',
	},
	colorMain: {
		color: '#52BE71',
	},
	colorTitle: {
		color: '#F75205',
	},
	row: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	rowLeft: {
		marginRight: 'auto',
		marginLeft: 'auto',
		flexDirection: 'row',
		justifyContent: 'flex-start',
	},
	rowRight: {
		marginLeft: 'auto',
		marginRight: 'auto',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	row1: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	rowLeft1: {
		marginRight: 'auto',
		//marginLeft: 'auto',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	rowCenter: {
		marginHorizontal: 'auto',
		//marginLeft: 'auto',
		flexDirection: 'row',
		justifyContent: 'space-between',
		//alignSelf:'center',
		alignItems: 'center',
	},
	rowRight1: {
		marginLeft: 'auto',
		// marginRight: 'auto',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	col: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
	},
	colTop: {
		marginRight: 'auto',
		//marginLeft: 'auto',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	colCenter: {
		marginHorizontal: 'auto',
		//marginLeft: 'auto',
		flexDirection: 'column',
		justifyContent: 'space-between',
		//alignSelf:'center',
		alignItems: 'center',
	},
	colBottom: {
		marginLeft: 'auto',
		// marginRight: 'auto',
		flexDirection: 'column',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	flex1: {
		flex: 1,
	},

	fontSize13: {
		fontSize: 13,
	},
	fontSize20: {
		fontSize: 20,
	},
	inputBox: {
		paddingHorizontal: 30,
		fontSize: 18,
		color: '#ffffff',
		fontWeight: '600'
	},
	minHeight50: {
		minHeight: 50,
	},
	minHeight70: {
		minHeight: 70,
	},
	floatRightView: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	paddingHorizontal5: {
		paddingHorizontal: 5,
	},
	buttonCustom: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 16,
		backgroundColor: variables.backgroundColorTV,
		borderRadius: 25,
		borderColor: '#010d33',
		shadowColor: 'rgb(199, 93, 47)',
		shadowOffset: { width: 2, height: 3 },
		shadowOpacity: 1,
		shadowRadius: 5,
	},
	buttonCustom1: {
		//justifyContent: 'center',
		//alignItems: 'center',
		paddingHorizontal: -20,
		backgroundColor: variables.backgroundColorTV,
		borderRadius: 5,
		borderColor: '#010d33',
		shadowColor: 'rgb(199, 93, 47)',
		shadowOffset: { width: 0.5, height: 1 },
		shadowOpacity: 0.7,
		shadowRadius: 3,
	},
	paddingTop10: {
		paddingTop: 10,
	},
	line: {
		height: 1.4,
		width: '102.5%',
	},
	btnBgOranges: {
		backgroundColor: '#e69564',
	},


});
