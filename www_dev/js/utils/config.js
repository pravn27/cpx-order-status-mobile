let isDebug = false;

module.exports = {
	getIsDebug:() => isDebug,
    setIsDebug:(b) => isDebug = b,

    // Set this to true in order to show more 
    // detailed error messages
    showDebugMessages: true,

    // Name of the file were error logs are stored
    ERROR_LOGS_FILE_NAME: 'cpx-error.logs',

    // Time in milliseconds to try to fetch user data again
    TIME_FOR_USER_DATA_UPDATE: 780000,// 13 minutes

    //Time in milliseconds for the user/init rest call.  Increasing this due to OSS issues.
    USER_INIT_REST_TIMEOUT: 17000,  // 17 seconds

    //Go To Feedback Page
    ALERTS_RATE_APP_TERMS: "https://mobilitycat-stg.itcs.hpe.com/catalog/?apppackage=com.hpe.cpx.prmobile",
	
    // Provisional userId & password for prototype
    userId: 'bd1_hpq_hpe_sit_user6@pproap.com',
    password: 'Passport_2!',
	
	// variables for login
	defaultStgEnv: 'hpe_stg',
	defaultProEnv: 'hpe_pro',
	defaultIdp: 'sm.hpe.hpp',
	defaultScope: {ssoEnabled: false},
	simulatorIdp: 'at_hp',
	rememberScopeStg: { scope: "urn:hpe:hpeit:cpx:hpeit.cpx.prmobile.itg, urn:hpe:egit:rdit:agpush.itg", 
				        ssoEnabled: false
					  },
    rememberScopePro: { scope: "urn:hpe:hpeit:cpx:hpeit.cpx.prmobile", 
				        ssoEnabled: false
					  }

};
