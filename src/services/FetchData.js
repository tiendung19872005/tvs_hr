import DefaultPreference from 'react-native-default-preference';
import customVariables from '../assets/styles/variables';
import { Alert, } from 'react-native';

var p_ipserver;
var p_nameapi;
var p_dbname;
var p_dbuser;
var p_dbpass;

DefaultPreference.getAll().then(function (valueAll) {
    p_ipserver = valueAll['serverip'] || customVariables.ipServer;
    p_nameapi = valueAll['nameapi'] || customVariables.nameApi.trim();
    p_dbname = valueAll['namedb'];
    p_dbuser = valueAll['userdb'];
    p_dbpass = valueAll['passdb'];
    // console.log("log v_ipserver:---------->" + p_nameapi);
});

export const getValueConnect = () => {
    try {
        DefaultPreference.getAll().then(function (valueAll) {
            p_ipserver = valueAll['serverip'] || customVariables.ipServer;
            p_nameapi = valueAll['nameapi'] || customVariables.nameApi.trim();
            p_dbname = valueAll['namedb'];
            p_dbuser = valueAll['userdb'];
            p_dbpass = valueAll['passdb'];
            // console.log("log v_ipserver:---------->" + p_ipserver);
        });
    } catch (error) {
        console.log("ERROR FETCH--->:" + error);
    }
}

export const getLoginJson = async (procedure, username, password, para) => {
    try {
        let p_prod = procedure.trim();
        let p_username = username.trim();
        let p_password = password.trim();
        let p_para = para.trim();
        let token = 'token_null'
        const URL = 'http://' + p_ipserver + '/' + p_nameapi + '/Login?Procedure=' + p_prod + '&username=' + p_username + '&pass=' + p_password + '&para=' + p_para + '&dbName=' + p_dbname + '&dbUser=' + p_dbuser + '&dbPwd=' + p_dbpass + '&token=' + token;
        console.log("---getLoginJson----URL---------" + URL);

        return await fetch(URL)
            .then((res) => res.json())
            .catch((error) => {
                console.error(error);
            });

    } catch (error) {
        console.log("ERROR FETCH--->:" + error);
        return error;
    }
}

export const getDataJson = (procedure, para, numcurr) => {
    try {
        let p_prod = procedure.trim();
        let p_para = para.trim();
        let p_numcurr = numcurr.trim();
        let token = 'token_null'
        const URL = 'http://' + p_ipserver + '/' + p_nameapi + '/GetDataJson?Procedure=' + p_prod + '&para=' + p_para + '&numcurr=' + p_numcurr + '&token=' + token;
        console.log("---getDataJson----URL---------" + URL);

        return fetchWithTimeout(URL,
            { headers: { Accept: 'application/json' } },
            10000
        ).then(response => response.json())
            .catch(error => {
                console.log(error.message)
                // Alert.alert(
                //     'Không thể kết nối tới server',
                //     'Vui lòng thử lại sau!',
                //     [
                //         //{ text: 'Hủy', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                //         {
                //             text: 'OK', onPress: async () => {
                //             }
                //         }
                //     ]
                // )
            })
    } catch (error) {
        console.log("ERROR FETCH--->:" + error);
        return error;
    }
}

export const OnExcute = (action, procedure, para) => {
    let p_action = action.trim();
    let p_prod = procedure.trim();
    let p_para = para.trim();
    let token = 'token_null'
    const URL = 'http://' + p_ipserver + '/' + p_nameapi + '/Excute?pAction=' + p_action + '&Procedure=' + p_prod + '&para=' + p_para + '&token=' + token;
    console.log("---OnExcute----URL---------" + URL);

    return fetch(URL)
        .then((res) => res.json());
}

export const UploadImage = async (action, procedure, para, filetype, base64Data01, base64Data02) => {
    let p_action = action.trim();
    let p_prod = procedure.trim();

    // let p_table_name ='';
    // let p_master_pk = '';
    // let p_tc_fsbinary_pk=tc_fsbinary_pk.trim();
    // let p_filename = filename.trim();
    // let p_filesize = '';
    // let p_crt_by = crt_by.trim();

    let p_para = para.trim();
    let p_filetype = filetype.trim();
    let token = 'token_null';

    let p_data01 = base64Data01.trim();
    let p_data02 = base64Data02.trim();

    const URL = 'http://' + p_ipserver + '/' + p_nameapi + '/UploadImg';
    console.log("---fetch URL----------------------" + URL);

    return await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pAction: p_action,
            Procedure: p_prod,
            para: p_para,
            base64Data: {
                Image01: p_data01,
                Image02: p_data02
            },
            filetype: p_filetype,
            token: token
        }),
    }).then((res) => res.json()).then(response => JSON.parse(response.d));
}




const fetchWithTimeout = (uri, options = {}, time = 5000) => {
    // Lets set up our `AbortController`, and create a request options object
    // that includes the controller's `signal` to pass to `fetch`.
    const controller = new AbortController()
    const config = { ...options, signal: controller.signal }
    // Set a timeout limit for the request using `setTimeout`. If the body of this
    // timeout is reached before the request is completed, it will be cancelled.
    const timeout = setTimeout(() => {
        controller.abort()
    }, time)
    return fetch(uri, config)
        .then(response => {
            // Because _any_ response is considered a success to `fetch`,
            // we need to manually check that the response is in the 200 range.
            // This is typically how I handle that.
            if (!response.ok) {
                throw new Error(`${response.status}: ${response.statusText}`)
            }
            return response
        })
        .catch(error => {
            // When we abort our `fetch`, the controller conveniently throws a named
            // error, allowing us to handle them separately from other errors.
            if (error.name === 'AbortError') {
                throw new Error('Response timed out')
            }
            throw new Error(error.message)

        })
}
