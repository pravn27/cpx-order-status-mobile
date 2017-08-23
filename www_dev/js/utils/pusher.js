import { hashHistory } from 'react-router';
import { updateUserInfo, userSessionRecovered, userLogout } from '../actions/userActions';
import { checkIfSessioStillActive } from '../actions/deviceActions';

// utils
import { tracking } from './utilities';

var old_aerogear_push_id = null;
var getState = null;
var dispatch = null;
var pusher = {
    // #PUSH Configurations: ITG
    /* 
    Server URL: https://c9t20521.itcs.hpecorp.net:8443/ag-push/
    */
    wso2_access_token: "777d6a9b34c4e72b0ec528221dcd5384",
    androidSenderID: "819675345904", // 819675345904: G project number
    androidVariantID: "0c4efe55-dbfe-463a-996d-243d84bacf8b", //"858c2798-3701-4dbb-9a2a-b631661a8ea8";
    androidVariantSecret: "7cb38780-0439-4bfa-b4c3-80446543cb73",// "24d53920-f395-430e-af2c-f18a1a95e555";
    iosVariantID: "bbac7929-c8d3-4f2d-89ee-b220a221f75b",
    iosVariantSecret: "023a9bb4-b662-4703-8df6-bec345abae20",

    loginEnv: 'hpe_stg', //
    //'hpe_pro',
    //idp: 'hpp', //'at_hp', // Authenticate with Security Gateway and SiteMinder
    pushEnv: '.itg', //wso2 env

    // mapDispatchToProps: (dispatch) => ({
    //     pusherActions: bindActionCreators({ appRunningInBackground }, dispatch)
    // }),
    /*
     * Determine which mobile operating system the phone is running.
     * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
     *
     * @returns {String}
     */
    getMobileOperatingSystem: function () {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
            return "Windows Phone";
        }

        if (/android/i.test(userAgent)) {
            return "Android";
        }

        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "iOS";
        }

        return "unknown";
    },

    registerPush: function (log, sessionJson, isPusherRegistered, _dispatch, _getState) {
        dispatch = _dispatch;
        getState = _getState;
        
        if (isPusherRegistered)
            return Promise.resolve(true);
        
        var TAG = "registerPush - ";
        console.log(TAG + log);
        var baseURL = hpeLogin.getSRPBaseURL();
        //var decodeSessionTkPath = "/sec-gw/sts/decodesessiontk";

        /* get cookies
        //var _env = loginEnv;
        //var _idp = this.idp;
        //var sessionKey = "hpmsso_"+_idp+"_"+_env;
        //var data =  window.localStorage.getItem(sessionKey); //"hpmsso_at_hp_hpe_stg");
        //var hpeSession = "LOGGEDOFF";
        */

        if (this.loginEnv == "hpe_pro") {
            console.log(TAG + "loginEnv is hpe_pro...");
            this.pushEnv = ''; // no .dev, .itg suffix
        }

        console.log(TAG + "pushEnv value from non-empty select value from UI (converted): " + this.pushEnv);

        var upsWebServiceURL = baseURL + "/egit/rdit/agpush" + this.pushEnv + "/agpush/1.1.0.Final"

        console.log(TAG + "Calling UPS web service at: " + upsWebServiceURL);
        // 2: call decodesessiontk with value found in shared storage or whatever implicit session (e.g. cookie) may exist already
        //console.log(TAG + "Retrieving sessionTk, explicitly, pass it to Java Push Plugin...");
        console.log(TAG , "sessionData : ", sessionJson);

        var user = "";
        var sessionTk = "";
        if (sessionJson) {
            if (getState().userInit.data) {
                user = getState().userInit.data.profile.userEmail; //** using email address instead of userId from session
            } else if ((user === "") && (typeof sessionJson.actualUserId === "string")) {
                user = sessionJson.actualUserId; //** hack
            }
            //** Still user is empty! Then assign the userId from session  
            if ((user === "") && (typeof sessionJson.userId === "string")) {
               user = sessionJson.userId;
            }
            if (typeof sessionJson.sessiontk === "string") {
                sessionTk = sessionJson.sessiontk;
            }
        }

        var cookie =
            "sessionTk=" + sessionTk + "; "
            + "user=" + user + "; "
            + "access_token=" + this.wso2_access_token
            ;

        console.log(TAG + "Cookie to be sent to push server (android): " + cookie);
        var aliasToBeSent = user + "?" + this.wso2_access_token;

        var mobiOs = this.getMobileOperatingSystem();
        console.log(TAG + "Mobile OperatingSystem is :" + mobiOs);
        if (mobiOs == "Android") { // its plugin does not get cookie(includes sessionTk) automatically in requests
            aliasToBeSent = user + "?" + cookie;
        }
        //console.log("aliasToBeSent to be sent to push plugin/server: " + aliasToBeSent);
        var pushConfig = {
            "pushServerURL": upsWebServiceURL,
            "alias": aliasToBeSent,
            "sendMetricInfo": true, //send registered user metric 
            // HPA legacy G credentials, plus
            android: {
                senderID: this.androidSenderID, // 8196753 45904: G project number
                variantID: this.androidVariantID,
                variantSecret: this.androidVariantSecret
            }
            ,
            "ios": {
                variantID: this.iosVariantID,
                variantSecret: this.iosVariantSecret
            }
        };

        console.log(TAG + "about to call this.register");
        return new Promise((resolve, reject) => {
             try {
                if (typeof window.parent.ripple === "function")
                    console.log('Will call push.register() on device!');
                else {
                    push.register(this.onNotification, resolve, reject, pushConfig);
                };

                console.log(TAG + "registering via [" + pushConfig.pushServerURL + "])");
            } catch (err) {
                var txt = "There was an error on this page.";
                txt += "Error description: " + err.message;
                reject(console.log(txt));
            }
        });
    },

    onNotification: function (e) { //pass isAppRunningInBackground
        //return new Promise((resolve, reject) => {
        //    try {
        if (e && e.payload && e.payload["aerogear-push-id"]) {
            if (old_aerogear_push_id != null && e.payload["aerogear-push-id"] === old_aerogear_push_id)
                return; //avoid multiple notifications for the same payload!
            else
                old_aerogear_push_id = e.payload["aerogear-push-id"];
        }

        //push.setContentAvailable(0); //assume it is new data always?

        // on android we could play the sound, if we add the Media plugin
        if (e.sound && (typeof Media != 'undefined')) {
            var media = new Media("/android_asset/www/" + e.sound + '.wav');
            media.play();
        }

        checkIfSessioStillActive()
            .then(res => dispatch( userSessionRecovered(res.userid, res.sessiontk, res.idpid) ))// Valid session
            .catch(() => dispatch( userLogout() ))// Invalid session
            .then(() => {// This 'then' works like a 'finally'  
                // Do not open if app is in foreground
                // get q2cuid from e.alert and traverse to orderdetails using that id...
                var q2cuid = (e.payload && e.payload["qtcuid"]) ? e.payload["qtcuid"] : "";
                dispatch( updateUserInfo() ); //** call init user info to update alert and others
                tracking('NotificationAlert', getState().userInit.data.profile.analytics); // track opening of notifications 
                var routedToOrderDetails = false;

                if (getState().pusherReducer.isAppRunningInBackground) {
                    hashHistory.push('/orderdetails/' + q2cuid);
                    routedToOrderDetails = true;
                }
                if (e.coldstart && routedToOrderDetails === false) {
                    hashHistory.push('/orderdetails/' + q2cuid);
                }
            });
        
        // only on ios
        if (e.badge) {
            this.setApplicationIconBadgeNumber(this.successHandler, e.badge);
        }
    },

    successHandler: function () {
        console.log("App icon badge number is set successfully!");
    }
};

export default pusher;
