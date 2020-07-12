import color from "color";

import { Platform, Dimensions, PixelRatio } from "react-native";
import { variance } from "@babel/types";
import NetInfo from "@react-native-community/netinfo";
import DefaultPreference from 'react-native-default-preference';

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;
const platformStyle = "material";
const isIphoneX = platform === "ios" &&
	(deviceHeight == 812 || deviceHeight == 896) &&
	(deviceWidth == 375 || deviceWidth == 414);
const checkStyleHome = DefaultPreference.get('home_style').then(i => i);


// const ipServer = '14.241.235.252:8484';
// const nameApi = 'TINVIET_API';
// const client_id = 'TVSC';
// const backgroundColorTV = "#1ab394"
// const activeBackgroundColorTV = "#2783710f"
// const backgroundOpactiColor = "rgba(0,0,0,0.28)"
// const images = {
// 	logo: require(`../logo/logo_smTV.png`),
// 	background: require('../images/backgroundTV.jpg'),
// 	backgroundHome: require('../images/bgHome.jpg'),
// 	avataDefaultM: require('../images/male_avata.png'),
// 	avataDefaultF: require('../images/female_avata.jpg'),
// }

const ipServer = '14.241.235.252:8484/tvs';
const nameApi = 'TsMobileAPI.asmx';
const client_id = 'TVS';
const backgroundColorTV = "rgba(26, 179, 148, 1)"
const activeBackgroundColorTV = "#2783710f"
const backgroundOpactiColor = "rgba(0,0,0,0.28)"
const images = {
	logo: require(`../logo/logo_smTV.png`),
	background: require('../images/backgroundTV.jpg'),
	backgroundHome: require('../images/bgHome.jpg'),
	avataDefaultM: require('../images/male_avata.png'),
	avataDefaultF: require('../images/female_avata.jpg'),
}

// const ipServer = '14.241.235.252:8484/tvs_hpdq';
// const nameApi = 'TsMobileAPI.asmx';
// const client_id = 'HPDQ';
// const backgroundColorTV = "#0063af"
// const activeBackgroundColorTV = "#0063af1c"
// const backgroundOpactiColor = "rgba(0,0,0,0.28)"
// const images = {
// 	logo: require(`../logo/logo_smHP.png`),
// 	background: require('../images/backgroundHP.jpg'),
// 	backgroundHome: require('../images/bgHome.jpg'),
// 	avataDefaultM: require('../images/male_avata.png'),
// 	avataDefaultF: require('../images/female_avata.jpg'),
// }

// const ipServer = '117.2.160.69:91';
// const nameApi = 'TsMobileAPI.asmx';
// const client_id = 'HPDQ';
// const backgroundColorTV = "#0063af"
// const activeBackgroundColorTV = "#0063af1c"
// const backgroundOpactiColor = "rgba(0,0,0,0.2)"
// const images = {
// 	logo: require(`../logo/logo_smHP.png`),
// 	background: require('../images/backgroundHP.jpg'),
// 	backgroundHome: require('../images/bgHome.jpg'),
// 	avataDefaultM: require('../images/male_avata.png'),
// 	avataDefaultF: require('../images/female_avata.jpg'),
// }


const textValue = "rgba(152, 119, 16, 1)"
const textNullValue = "Chưa có dữ liệu !!!";


const toastError = {
	text: '',
	buttonText: 'Lỗi',
	duration: 4000,
	position: "bottom",
	style: { backgroundColor: '#eeee', borderRadius: 5 },
	textStyle: { color: textValue },

	buttonTextStyle: { color: "white" },
	buttonStyle: { backgroundColor: 'red' },
};
const toastSuccessful = {
	text: '',
	buttonText: 'Okay',
	position: "bottom",
	duration: 4000,
	style: { backgroundColor: '#eeee', borderRadius: 5 },
	textStyle: { color: textValue },

	buttonTextStyle: { color: "white" },
	buttonStyle: { backgroundColor: backgroundColorTV }
};

export default {
	"platformStyle": "material",
	//"platform":"ios",
	"androidRipple": false,
	"androidRippleColor": "rgba(256, 256, 256, 0.3)",
	"androidRippleColorDark": "rgba(0, 0, 0, 0.15)",
	"btnUppercaseAndroidText": false,
	"badgeBg": "#ED1727",
	"badgeColor": "#fff",
	"badgePadding": 3,
	"btnFontFamily": platform === "ios" ? "System" : "Roboto_medium",
	"btnDisabledBg": "#b5b5b5",
	"buttonPadding": 6,
	"btnPrimaryBg": "#3F51B5",
	"btnPrimaryColor": "#fff",
	"btnInfoBg": "#3F57D3",
	"btnInfoColor": "#fff",
	"btnSuccessBg": "#5cb85c",
	"btnSuccessColor": "#fff",
	"btnDangerBg": "#d9534f",
	"btnDangerColor": "#fff",
	"btnWarningBg": "#f0ad4e",
	"btnWarningColor": "#fff",
	"btnTextSize": 16.5,
	"btnTextSizeLarge": 22.5,
	"btnTextSizeSmall": 12,
	"borderRadiusLarge": 57,
	"iconSizeLarge": 45,
	"iconSizeSmall": 18,
	"cardDefaultBg": "#fff",
	"cardCustomBg0": "#F8F8F8",
	"cardCustomBg1": "#fdfcfc",
	"cardBorderColor": "#ccc",
	"CheckboxRadius": 0,
	"CheckboxBorderWidth": 2,
	"CheckboxPaddingLeft": 2,
	"CheckboxPaddingBottom": 0,
	"CheckboxIconSize": 18,
	"CheckboxFontSize": 21,
	"DefaultFontSize": 17,
	"checkboxBgColor": "#039BE5",
	"checkboxSize": 20,
	"checkboxTickColor": "#fff",
	"brandPrimary": "#3F51B5",
	"brandInfo": "#3F57D3",
	"brandSuccess": "#5cb85c",
	"brandDanger": "#d9534f",
	"brandWarning": "#f0ad4e",
	"brandDark": "rgba(255,255,255,1)",
	"brandLight": "rgba(84,84,84,1)",
	"fontFamily": platform === "ios" ? "System" : "Roboto",
	"fontSizeBase": 15,
	"fontSizeH1": 27,
	"fontSizeH2": 24,
	"fontSizeH3": 21,
	"footerHeight": 55,
	"footerDefaultBg": "rgba(238,238,238,1)",
	"footerPaddingBottom": 0,
	"tabBarTextColor": "rgba(82,190,113,1)",
	"tabBarTextSize": 14,
	"activeTab": "#fff",
	"sTabBarActiveTextColor": "#007aff",
	"tabBarActiveTextColor": "#fff",
	"tabActiveBgColor": "rgba(82,190,113,1)",
	"toolbarBtnColor": "#fff",
	"toolbarDefaultBg": "rgba(82,190,113,1)",
	"toolbarHeight": platform === "ios" ? 64 : 56,
	"toolbarSearchIconSize": platform === "ios" ? 20 : 23,
	"toolbarInputColor": "#fff",
	"searchBarHeight": platform === "ios" ? 30 : 40,
	"searchBarInputHeight": platform === "ios" ? 30 : 50,
	"toolbarBtnTextColor": "#fff",
	"toolbarDefaultBorder": "rgba(82,190,113,1)",
	"iosStatusbar": "light-content",
	"statusBarColor": "rgba(82,190,113,1)",
	"darkenHeader": "#F0F0F0",
	"iconFamily": "Ionicons",
	"iconFontSize": platform === "ios" ? 30 : 28,
	"iconHeaderSize": platform === "ios" ? 33 : 24,
	"inputFontSize": 17,
	"inputBorderColor": "rgba(255, 255,255,.5)",
	"inputSuccessBorderColor": "#2b8339",
	"inputErrorBorderColor": "#ed2f2f",
	"inputHeightBase": 50,
	"inputColor": "#000",
	"inputColorPlaceholder": "#575757",
	"btnLineHeight": 19,
	"lineHeightH1": 32,
	"lineHeightH2": 27,
	"lineHeightH3": 22,
	"lineHeight": 20,
	"listBg": "#FFF",
	"listBorderColor": "#c9c9c9",
	"listDividerBg": "#f4f4f4",
	"listBtnUnderlayColor": "#DDD",
	"listItemPadding": platform === "ios" ? 10 : 12,
	"listNoteColor": "#808080",
	"listNoteSize": 13,
	"defaultProgressColor": "#E4202D",
	"inverseProgressColor": "#1A191B",
	"radioBtnSize": 25,
	"radioSelectedColorAndroid": "#5067FF",
	"radioBtnLineHeight": 29,
	"segmentBackgroundColor": "#3F51B5",
	"segmentActiveBackgroundColor": "#fff",
	"segmentTextColor": "#fff",
	"segmentActiveTextColor": "#3F51B5",
	"segmentBorderColor": "#fff",
	"segmentBorderColorMain": "#3F51B5",
	"defaultSpinnerColor": "#45D56E",
	"inverseSpinnerColor": "#1A191B",
	"tabDefaultBg": "#3F51B5",
	"topTabBarTextColor": "#b3c7f9",
	"topTabBarActiveTextColor": "#fff",
	"topTabBarBorderColor": "#fff",
	"topTabBarActiveBorderColor": "#fff",
	"tabBgColor": "#fdf9f9",
	"tabFontSize": 15,
	"textColor": "#000",
	"inverseTextColor": "#fff",
	"noteFontSize": 14,
	"defaultTextColor": "#000",
	"titleFontfamily": "System",
	"titleFontSize": 19,
	"subTitleFontSize": 14,
	"subtitleColor": "#FFF",
	"titleFontColor": "#FFF",
	"borderRadiusBase": 2,
	"borderWidth": 0,
	"contentPadding": 5,
	"dropdownLinkColor": "#414142",
	"inputLineHeight": 24,
	"deviceWidth": deviceWidth,
	"deviceHeight": deviceHeight,
	"isIphoneX": isIphoneX,
	"inputGroupRoundedBorderRadius": 30,
	"backgroundColorTV": backgroundColorTV,
	"activeBackgroundColorTV": activeBackgroundColorTV,
	"backgroundOpactiColor": backgroundOpactiColor,
	"textValue": textValue,
	"textNullValue": textNullValue,

	'ipServer': ipServer,
	'nameApi': nameApi,
	'client_id': client_id,
	'images': images,

	'toastError': toastError,
	'toastSuccessful': toastSuccessful,

	'checkStyleHome': checkStyleHome,

}