/*
 * HPE IT Mobility Framework
 * @copyright Copyright 2016 (c) Hewlett Packard Enterprise
 * 
 * Inline documentation based on JSDoc: http://usejsdoc.org
 *
 */

/**
 * JavaScript library allowing hybrid mobile applications to integrate with the Security Gateway to
 * authenticate users, provide Single Sign On between trusted mobile applications, and allow access
 * to internal web services mapped through the Security Gateway.
 * 
 * A global variable "hpeLogin" is created by including this library.
 * @namespace
 */

var hpeLogin = (function () {
  /*----------------------------------------
   * Private Variables
   */
  var _idp = null; // default
  var _env = null; // default

  var _options = {
    ssoEnabled: false // Don't enable SSO by default
  };

  var _sessionTk = null;
  var _lastUserId = null;

  // Global configuration definitions. Values will be overridden by environment-specific values.
  var _config = {
    baseURLHost: "", // Base URL of SG instance
    baseURLCertHost: "", // certificate-authentication (mutual SSL) base URL
    baseServicePath: "/gw", // Base URI path

    // decodeSessionTk: decode a session token passed as cookie or POST parameter
    // Result: {"status":"ok","sessiontk":"...","user id":"claude.villermain@hpe.com","idp id":"at_hp","class id":"ClassC","tenant id":"hp.com","issued at":"2014-11-27T17:13:11.000Z","expire at":"2014-11-27T18:13:11.000Z","touched at":"2014-11-27T17:13:11.000Z","username":"Claude Villermain","employeenumber":"00550266","ntuserdomainid":"EMEA:villerma","email":"claude.villermain@hpe.com"}
    decodeSessionTkPath: "/sec-gw/sts/decodesessiontk",

    // x509 login: used to authenticate using a client certificate (mutual SSL authentication)
    // Return: {"status": "authenticated","sessiontk": "...","certificate subject":"EMAILADDRESS=claude.villermain@hpe.com, CN=Claude Villermain, OU=WEB, O=Hewlett-Packard Company","certificate expiration":"2015-11-24T23:59:59.000Z","certificate thumpbrint":"Mil00lHvdZlFzIJrjFoYZzhvZB4="}
    x509loginPath: "/sec-gw/x509login", // Base URI path
    x509loginQuery: "interactive=0", // Query string

    // login: authentication user with credentials
    // Return: {"status": "authenticated","sessiontk": "...","target": "/sec-gw/login?idpid=at_hp&interactive=0&user=claude.villermain@hpe.com"}
    //      {"status": "error","target": "/sec-gw/login","error_code": "SG_STS_51000","reason": "Authentication failure."}
    //      {"status": "error","message": "no user id or no password provided. Unable to authenticate."}
    loginPath: "/sec-gw/login", // Login URI path
    loginQuery: "", // Query string (including "?") to use, if any

    // logout
    // Return: {"status": "success","message": "Logged off"}
    logoutPath: "/sec-gw/logout", // Logout URI path
    logoutQuery: "", // Query string (including "?") to use, if any

    mssoCustScheme: "hpmsso://authenticate" // Custom URL scheme to central login application (experimental)
  };

  // Environment-specific configuration definitions (will override global configuration if defined)
  var _env2Config = {
    "dev": {
      baseURLHost: "https://api-dev-sgw.itcs.hpecorp.net",
      baseURLCertHost: "https://api-csc-dev-sgw.itcs.hpecorp.net"
    },
    "itg": {
      baseURLHost: "https://api-itg-sgw.ext.hpe.com",
      baseURLCertHost: "https://api-csc-itg-sgw.ext.hpe.com"
    },
    "stg": {
      baseURLHost: "https://api-stg-sgw.ext.hpe.com",
      baseURLCertHost: "https://api-csc-stg-sgw.ext.hpe.com"
    },
    "pro": {
      baseURLHost: "https://api-sgw.ext.hpe.com",
      baseURLCertHost: "https://api-csc-sgw.ext.hpe.com"
    },

    "hpe_dev": {
      baseURLHost: "https://api-dev-sgw.itcs.hpecorp.net",
      baseURLCertHost: "https://api-csc-dev-sgw.itcs.hpecorp.net"
    },
    "hpe_itg": {
      baseURLHost: "https://api-itg-sgw.ext.hpe.com",
      baseURLCertHost: "https://api-csc-itg-sgw.ext.hpe.com"
    },
    "hpe_stg": {
      baseURLHost: "https://api-stg-sgw.ext.hpe.com",
      baseURLCertHost: "https://api-csc-stg-sgw.ext.hpe.com"
    },
    "hpe_pro": {
      baseURLHost: "https://api-sgw.ext.hpe.com",
      baseURLCertHost: "https://api-csc-sgw.ext.hpe.com"
    },

    "hpi_itg": {
      baseURLHost: "https://api-itg-sgw.external.hp.com",
      baseURLCertHost: "https://api-csc-itg-sgw.external.hp.com"
    },
    "hpi_stg": {
      baseURLHost: "https://api-stg-sgw.external.hp.com",
      baseURLCertHost: "https://api-csc-stg-sgw.external.hp.com"
    },
    "hpi_pro": {
      baseURLHost: "https://api-sgw.external.hp.com",
      baseURLCertHost: "https://api-csc-sgw.external.hp.com"
    }
  };

  // Private Methods

  /*
   * initialize: internal implementation of initialize API
   * 
   */
  var _initialize = function (inEnv, inIdP, inOptions, inCallback) {
    // Check Identity Provider
    _idp = inIdP.toLowerCase();
    if (!_idp) {
      _idp = null;
      (typeof inCallback === "function") && inCallback({
        status: "error",
        code: hpeLogin.config.sessionStatusEnum.WRONG_PARAMS,
        error: "Unexpected idp value: " + (inIdP || "(null)")
      });
      return;
    }
    // Check Environment
    var env2Config = {};
    if (typeof inEnv === "string") { // Most typical case in to have inEnv contain an environment name 
      _env = inEnv.toLowerCase();
      if (typeof _env2Config[_env] === "undefined") {
        _env = null;
        (typeof inCallback === "function") && inCallback({
          status: "error",
          code: hpeLogin.config.sessionStatusEnum.WRONG_PARAMS,
          error: "Unexpected env value: " + (inEnv || "(null)")
        });
        return;
      }
      env2Config = _env2Config[_env];
    } else { // check if environment is defined with all its properties (i.e. as a Java object)
      var keys = Object.keys(inEnv);
      if (keys && keys.length > 0) {
        env2Config = inEnv; // Assumes that inEnv contains custom environment definition
        _env = inEnv["env"] || "custom"; // If environment is a customization of a standard one, its name can be defined in entry with key="env"
      } else {
        (typeof inCallback === "function") && inCallback({
          status: "error",
          code: hpeLogin.config.sessionStatusEnum.WRONG_PARAMS,
          error: "Unexpected env value: " + (inEnv || "(null)")
        });
        return;
      }
    }

    // Override default configuration properties with environment-specific ones if defined
    for (var key in env2Config) {
      _config[key] = env2Config[key];
    }

    if (inOptions === 'true') { // For backward compatibility if the only option defined is the SSO flag
      _options.ssoEnabled = ((typeof NativeStoragePlugin) !== 'undefined');
    } else if (typeof inOptions === 'object') { // Copy options object
      _options = inOptions;
      _options.ssoEnabled = ((typeof NativeStoragePlugin) !== 'undefined') && (_options.ssoEnabled === true)
    }

    // TBD: check if MDM + hpmsso applications are installed

    _checkSession(inCallback);
  };

  /*
   * _getSessionInfo: Read JSON session info from shared storage
   * 
   * session info:
   *  {
   *    sessiontk: value of session token
   *    userid: value of user id (for current session or last session)
   *    ts: time at which session info was saved
   *  } 
   */
  var _getSessionInfo = function (inCallback) {
    var TAG = "_getSessionInfo() - ";
    var sessionKey = "hpmsso_" + _idp + "_" + _env;
    hpeLogin.logd(TAG + "Entry sessionKey=" + sessionKey);
    if (_options.ssoEnabled && (typeof NativeStoragePlugin !== "undefined") && NativeStoragePlugin) {
      NativeStoragePlugin.get(sessionKey,
        function (data) {
          hpeLogin.logd(TAG + "Success: " + JSON.stringify(data));
          _returnSessionInfo(data, inCallback);
        },
        function (error) {
          hpeLogin.logd(TAG + "Error: " + JSON.stringify(error));
          if (error === "APP_CATALOG_NOT_INSTALLED" || error === "NOT_SIGNED_BY_HPIT") {
            hpeLogin.logd(TAG + "Reference application not installed or centrally signed. Switching back to window.localStorage");
            var data = window.localStorage.getItem(sessionKey);
            _returnSessionInfo(data, inCallback);
          } else
          (typeof inCallback === "function") && inCallback({
              status: "error",
              code: hpeLogin.config.sessionStatusEnum.LOGIN_SESSION_NOT_FOUND,
              error: error
            });
        }
      );
    } else {
      hpeLogin.logi(TAG + "SSO not enabled. Using window.localStorage");
      var data = window.localStorage.getItem(sessionKey);
      _returnSessionInfo(data, inCallback);
    }
  };

  // Parse and return session info to callback
  var _returnSessionInfo = function (data, inCallback) {
    var JSONdata = null;
    try {
      JSONdata = JSON.parse(data);
    } catch (e) {
    }
    if (JSONdata) {
      if (typeof JSONdata.userid === "string") {
        _lastUserId = JSONdata.userid;
      }
      (typeof inCallback === "function") && inCallback({ status: "ok", data: JSONdata });
    } else {
      (typeof inCallback === "function") && inCallback({
        status: "error",
        code: hpeLogin.config.sessionStatusEnum.LOGIN_SESSION_DATA_BROKEN,
        error: "Unexpected session data: " + JSON.stringify(data)
      });
    }
  }

  /*
   * _setSessionInfo: Store stringified session info into shared storage
   */

  var _setSessionInfo = function (sessionInfo, inCallback) { // for _idp and _env
    var TAG = "_setSessionInfo - ";
    var sessionKey = "hpmsso_" + _idp + "_" + _env;
    hpeLogin.logd(TAG + "key=" + sessionKey + ",value=" + JSON.stringify(sessionInfo));
    if (_options.ssoEnabled && (typeof NativeStoragePlugin !== "undefined") && NativeStoragePlugin) {
      NativeStoragePlugin.put(sessionKey, JSON.stringify(sessionInfo),
        function (nativeStorageData) {
          hpeLogin.logd(TAG + "Success: " + JSON.stringify(nativeStorageData));
          if (nativeStorageData !== "OK") {
            (typeof inCallback === "function") && inCallback({
              status: "error",
              code: hpeLogin.config.sessionStatusEnum.LOGIN_SESSION_DATA_BROKEN,
              error: "Wrong data returned when storing session data"
            });
          } else {
            (typeof inCallback === "function") && inCallback({ status: "ok" });
          }
        },
        function (nativeStorageError) {
          hpeLogin.logd(TAG + "Error: " + JSON.stringify(nativeStorageError));
          if (nativeStorageError === "APP_CATALOG_NOT_INSTALLED" || nativeStorageError === "NOT_SIGNED_BY_HPIT") {
            hpeLogin.logi(TAG + "Reference application not installed or centrally signed. Switching back to window.localStorage");
            window.localStorage.setItem(sessionKey, JSON.stringify(sessionInfo));
            (typeof inCallback === "function") && inCallback({ status: "ok" });
          } else
          (typeof inCallback === "function") && inCallback({
              status: "error",
              code: hpeLogin.config.sessionStatusEnum.UNKNOWN_ERROR,
              error: "Error when storing session data: " + JSON.stringify(nativeStorageError)
            });
        }
      );
    } else {
      hpeLogin.logi(TAG + "SSO not enabled. Using window.localStorage");
      window.localStorage.setItem(sessionKey, JSON.stringify(sessionInfo));
      (typeof inCallback === "function") && inCallback({ status: "ok" });
    }
  };

  /*
   * _checkSession: retrieves session info from shared storage and check if session is currently active
   */
  var _checkSession = function (inCallback) {
    var TAG = "checkSession(" + _config.baseURLHost + _config.decodeSessionTkPath + ") - ";
    hpeLogin.logd(TAG + "Entry");

    // 1: Retrieve stored session information
    _getSessionInfo(function (sessionInfoData) {
      hpeLogin.logd("_checkSession getSessionInfo result:" + JSON.stringify(sessionInfoData));
      var postData = {};
      var _sessionTk;
      var _smsession;
      var _idpid;
      var _lastUserId;

      if (sessionInfoData && sessionInfoData.status === "ok" && sessionInfoData.data) {
        if (typeof sessionInfoData.data.sessiontk === "string") {
          _sessionTk = sessionInfoData.data.sessiontk;
          postData.sessionTk = _sessionTk;
        }
        if (typeof sessionInfoData.data.smsession === "string") {
          _smsession = sessionInfoData.data.smsession;
          postData.smsession = _smsession;
        }
        if (typeof sessionInfoData.data.idpid === "string") {
          _idpid = sessionInfoData.data.idpid;
        }
        if (typeof sessionInfoData.data.userid === "string") {
          _lastUserId = sessionInfoData.data.userid;
        }
      };

      // 2: call decodesessiontk with value found in shared storage or whatever implicit session (e.g. cookie) may exist already
      hpeLogin.ajax.request({
        url: _config.baseURLHost + _config.decodeSessionTkPath,
        method: "POST",
        body: postData,
        callback: {
          success: function (decodeSessionData) {
            var TAG = "checkSession success - ";
            hpeLogin.logd(TAG + "Entry");
            var dataJSON = null;
            try {
              dataJSON = decodeSessionData && hpeLogin.parseJSON(decodeSessionData.response);
            } catch (e) {
            }
            var userId = dataJSON["user id"];
            if (userId) {
              _lastUserId = userId;
              if (typeof dataJSON.sessiontk === 'string' && dataJSON.sessiontk !== _sessionTk) {
                hpeLogin.logw(TAG + "sessionTk is different from value stored");
                _sessionTk = dataJSON.sessiontk;
                // Set shared session info based on new value retrieved
                _setSessionInfo(JSON.stringify({ sessiontk: _sessionTk, userid: userId, ts: new Date() }));
              }
              (typeof inCallback === "function") && inCallback({ status: "ok", userid: userId, sessiontk: _sessionTk, idpid: _idpid });
            } else {
              (typeof inCallback === "function") && inCallback({
                status: "error",
                code: hpeLogin.config.sessionStatusEnum.LOGIN_SESSION_DATA_BROKEN,
                error: "No user id found",
                userid: _lastUserId
              });
            }
          },
          failure: function (decodeSessionError) {
            var TAG = "checkSession failure - ";
            hpeLogin.logd(TAG + "Entry");
            // Check for unautenticated status
            if (decodeSessionError && decodeSessionError.status === 401) {
              (typeof inCallback === "function") && inCallback({
                status: "error",
                code: hpeLogin.config.sessionStatusEnum.INVALID_SESSION,
                userid: _lastUserId
              });
              return;
            }
            if (decodeSessionError && decodeSessionError.status === 0) { // connection error ==> unable to check
              (typeof inCallback === "function") && inCallback({
                status: "error",
                code: hpeLogin.config.sessionStatusEnum.UNABLE_TO_CHECK,
                userid: _lastUserId
              });
              return;
            }
            // In case check isn't possible, return a warning telling that it isn't possible to check if the sessionTk is valid or not
            (typeof inCallback === "function") && inCallback({
              status: "error",
              code: hpeLogin.config.sessionStatusEnum.UNABLE_TO_CHECK,
              userid: _lastUserId
            });
          }
        }
      });
    });
  };

  /*
   * _login: internal implementation of login API
   */
  var _login = function (userid, password, inCallback) {
    var loginURL = _config.baseURLHost + _config.loginPath + _config.loginQuery;
    var postBody = {
      idpid: _idp,
      user: userid,
      password: password,
      interactive: "0"
    };

    if (typeof _options.scope === 'string') {
      postBody.scope = _options.scope;
    }

    var callbacks = {
      success: function (loginData) {
        var response = null;
        // {"status":"authenticated","sessiontk":"...","target":"/sec-gw/login?idpid=at_hp&interactive=0&user=claude.villermain@hpe.com"}
        try {
          // XMLHttpRequest returns content as "response". cordovaHTTP returns content as "data"
          response = loginData.response ? JSON.parse(loginData.response) : JSON.parse(loginData.data);
        } catch (e) {
        }
        if (response && response.status === "authenticated" && typeof response.sessiontk === "string" && response.sessiontk.length > 0) {
          hpeLogin.logi("Login success");
          hpeLogin.logd("Login success response: " + JSON.stringify(response));
          _sessionTk = response.sessiontk;
          _smsession = response.smsession;
          _idpid = response.idpid;
          _lastUserId = userid;
          // Store in shared storage, but don't wait for result
          _setSessionInfo({ sessiontk: _sessionTk, smsession: _smsession, idpid: _idpid, userid: userid, ts: new Date() });
          if (typeof inCallback === "function") {
            if (typeof cordovaHTTP !== 'undefined') {
              _checkSession(inCallback); // If using cordovaHTTP, need to set cookie in XmlHTTPRequest context
            } else {
              inCallback({ status: "ok", sessiontk: response.sessiontk, userid: userid, idpid: _idpid });
            }
          }
        } else {
          hpeLogin.logw("unexpected login response: " + JSON.stringify(loginData));
          (typeof inCallback === "function") && inCallback({
            status: "error",
            code: hpeLogin.config.loginFailureEnum.INTERNAL_ERROR,
            error: "Unexpected result from login: " + JSON.stringify(loginData)
          });
        }
      },
      failure: function (loginError) {
        hpeLogin.logw("Login failure: " + JSON.stringify(loginError));
        if (loginError && loginError.status == 401) {
          // {"statusText":"Unauthorized","status":401,"response":"{\"status\": \"error\",\"target\": \"/sec-gw/login\",\"error_code\": \"SG_STS_51000\",\"reason\": \"Authentication failure.\"}","responseType":"","responseXML":null,"responseText":"{\"status\": \"error\",\"target\": \"/sec-gw/login\",\n  \"error_code\": \"SG_STS_51000\",\"reason\": \"Authentication failure.\"}
          (typeof inCallback === "function") && inCallback({
            status: "error",
            code: hpeLogin.config.loginFailureEnum.INCORRECT_CREDENTIALS,
            error: JSON.stringify(loginError)
          });

        } else {
          (typeof inCallback === "function") && inCallback({
            status: "error",
            code: hpeLogin.config.loginFailureEnum.INTERNAL_ERROR,
            error: "Unexpected result from login: " + JSON.stringify(loginError)
          });
        }
      }
    };

    if (typeof cordovaHTTP !== 'undefined') {
      hpeLogin.logi("Login using cordovaHTTP plugin");
      cordovaHTTP.enableSSLPinning(true, function () {
        cordovaHTTP.post(loginURL, postBody, {}, callbacks.success, callbacks.failure);
      }, function () {
        hpeLogin.loge('Unable to enable SSL Pinning with cordovaHTTP plugin. Switching to Ajax call (unsafe)');
        hpeLogin.ajax.request({
          url: loginURL,
          method: "POST",
          body: postBody,
          callback: callbacks
        });
      });
    } else {
      hpeLogin.ajax.request({
        url: loginURL,
        method: "POST",
        body: postBody,
        callback: callbacks
      });
    }
  };

  /*
   * _logout: internal implementation of logout API
   */

  var _logout = function (inCallback) {
    // 1. Erase session data in shared storage
    _setSessionInfo({ sessiontk: null, userid: _lastUserId, ts: new Date() });
    // 2. Call logout endpoint
    hpeLogin.ajax.request({
      url: _config.baseURLHost + _config.logoutPath + _config.logoutQuery,
      callback: {
        success: function (logoutData) {
          (typeof inCallback === "function") && inCallback({ status: "ok" });
        },
        failure: function (logoutError) {
          (typeof inCallback === "function") && inCallback({
            status: "error",
            code: hpeLogin.config.loginFailureEnum.INTERNAL_ERROR,
            error: "Unexpected error from logout: " + JSON.stringify(logoutError)
          });
        }
      }
    });
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Public Variables and Methods
  return {
    /**
     * Return base URL to use to call an endpoint (as defined by its URN) in the current SG environment
     * 
     * @method getSRPBaseURL
     * @memberof hpeLogin
     * 
     * @param {string} urn - Optional URN (e.g. "business:sub-business:service" or "urn:hpe:business:sub-business:service"). If defined, returns the full URL to this specific URN
     * @return {string} Base URL returned
     * @example Retrieve base URL of SG instance
     * // returns "https://api-sgw.ext.hpe.com/gw"
     * getSRPBaseURL()
     * @example Retrieve base URL of specific URN
     * // returns "https://api-sgw.ext.hpe.com/gw/biz/subbiz/service"
     * getSRPBaseURL("biz:subbiz:service")
     * getSRPBaseURL("urn:hpe:biz:subbiz:service")
     */
    getSRPBaseURL: function (urn) {
      if (typeof _idp !== "string" || typeof _env !== "string") {
        return null;
      } else {
        var url_suffix = "";
        if (typeof urn === "string") {
          url_suffix = urn;
          if (url_suffix.indexOf("urn:") === 0) { // remove "urn:xyz:" prefix if there is one
            var i = url_suffix.indexOf(":", 4);
            if (i > 0) {
              url_suffix = url_suffix.substr(i + 1);
            }
          }
          url_suffix = "/" + url_suffix.replace(/:/g, "/");
        }
        return _config.baseURLHost + _config.baseServicePath + url_suffix;
      }
    },

    /**
     * Initializes hpeLogin environment. This is an asynchronous call as the validity of a possible existing session
   * token must be checked online. A callback is called when initialization is complete.
   * 
   * @method initialize 
   * @memberof hpeLogin
   * 
   * @param {string|Object} inEnv - Environment to connect to. Use environment name (e.g. "pro", "stg", "itg") or a custom environment definition as an object
   * @param {string} inIdP - Identity provider to be used for authentication
   * @param {boolean|object} options - boolean flag to define if SSO should be used or not (i.e. share session token with other trusted applications) or object with config options
   * @param {boolean} options.ssoFlag - boolean flag to define if SSO should be used or not (i.e. share session token with other trusted applications)
   * @param {boolean} options.scope - comma-separated list of URNs to restrict access to in the context of this session. The session created at login time won't be allowed to access other URNs 
   * @param {function({status, code, error, message})} inCallback - callback function called with initialization is complete
   * 
   * @return {void} This is an asynchronous call. The actual result will be sent back to the callback function
   */

    initialize: function (inEnv, inIdP, options, inCallback) {
      var TAG = "hpeLogin.initialize() - ";
      hpeLogin.logd(TAG + "Entry");
      if (typeof inIdP !== "string" || !inEnv) {
        (typeof inCallback === "function") && inCallback({ status: "error", error: "Wrong IdP and environment" })
      } else {
        _initialize(inEnv, inIdP, options, inCallback);
      }
    },

    /**
     * Check if there is an active session (e.g. still active or already created by another trusted mobile application).
     * 
   * @method checkSession 
   * @memberof hpeLogin
   * 
   * @param {function(status, code, error, message)} inCallback - callback function called with session check is complete
   * 
     * @return {void} This is an synchronous call. The actual result will be sent back to the callback function
     */
    checkSession: function (inCallback) {
      if (typeof _idp !== "string" || typeof _env !== "string") {
        (typeof inCallback === "function") && inCallback({ status: "error", error: "hpeLogin isn't initialized" });
      } else {
        _checkSession(inCallback);
      }
    },
    /**
     * Login with credentials (userId and password) provided by caller. Store SiteMinder session cookie to allow SSO between applications.
     *     
   * @method loginWithCredentials 
   * @memberof hpeLogin
     *
   * @param {string} userId - user id (e.g. email) of user
   * @param {string} password - password of user
   * @param {function({status, sessiontk, userid, idpip, error})} inCallback - callback function called with login is complete
   * 
   * @return {void} This is an asynchronous call. The actual result will be sent back to the callback function
   */
    loginWithCredentials: function (userId, password, inCallback) {
      var TAG = "hpeLogin.login: loginWithCredentials() - ";
      hpeLogin.logd(TAG + "ENTRY");

      if (typeof _idp !== "string" || typeof _env !== "string") {
        (typeof inCallback === "function") && inCallback({
          status: "error",
          code: hpeLogin.config.loginFailureEnum.WRONG_PARAMS,
          error: "hpeLogin isn't initialized"
        })
      } else {
        if (typeof userId !== "string" || typeof password !== "string") {
          (typeof inCallback === "function") && inCallback({
            status: "error",
            code: hpeLogin.config.loginFailureEnum.INCORRECT_CREDENTIALS,
            error: "Incorrect credentials passed to API"
          });
        } else {
          _login(userId, password, inCallback);
        }
      }
    },

    /**
     * Mobile Digital Badge-based login (EXPERIMENTAL)
     *  Experimental API allowing calling another mobile application (through a custom URL scheme) to trigger authentication.
     *  Once authentication is complete, the calling application will be called back using it's own custom URL scheme
     *  defined as parameter inAppURLCallback. It should then check again if a session was created by calling the checkSession API.
     *  Requires InAppBrowser Cordova plugin to be able to launch other mobile application using its custom scheme.
     *     
   * @method MDBlogin 
   * @memberof hpeLogin
     *
   * @param {string} inAppURLCallback - custom URL scheme (optional) of the mobile application to be called back when
   * external authentication is complete
   * 
     * @return {object} This call is synchronous and the result returned ("ok" or "error") is only confirming that the sso application launch
     *          was triggered. Control will be given back to the calling application using its custom scheme if it was provided as parameter.
     */
    MDBlogin: function (inAppURLCallback) {
      (typeof inAppURLCallback === 'string') && (_inAppURLCallback = inAppURLCallback);
      if (typeof _idp !== "string" || typeof _env !== "string") {
        return { status: "error", code: hpeLogin.config.loginFailureEnum.WRONG_PARAMS, error: "hpeLogin isn't initialized" };
      } else {
        if (typeof _config.mssoCustScheme !== "string") {
          return { status: "error", error: "hpmsso scheme isn't defined" };
        } else {
          var loginURL = _config.mssoCustScheme + "?env=" + _env;
          if (typeof inAppURLCallback === "string" && inAppURLCallback.length > 0) {
            loginURL = loginURL + "&target=" + encodeURIComponent(inAppURLCallback);
          }
          hpeLogin.logi("MDBlogin - launching " + loginURL);
          var ref = window.open(loginURL, "_system");
          if (ref) {
            ref.addEventListener("loaderror", function (error) {
              hpeLogin.logw("inAppBrowser: loaderror: " + JSON.stringify(error));
            });
            return { status: "ok" };
          } else {
            return { status: "error", error: "Unable to open mssologin application" }
          }
        }
      }
    },

    /**
     * Return URL to be used to authenticate using a client certificate (mutual SSL authentication)
     * 
     * @method getLoginCertURL
     * @memberof hpeLogin
     * 
     * @param {string} env - SG environment (STG, PRO...)
     * @return {string} Full URL to be used to authenticate using a client certificate
     */
    getLoginCertURL: function (env) {
      var URL = _config.baseURLCertHost + _config.x509loginPath;
      // If we need to authenticate in another environment, we need to specific its X509 login endpoint as target URL
      if (typeof env === "string" && env != _env) {
        var targetURL = (_env2Config.env && _env2Config.env.baseURLCertHost) || _config.baseURLCertHost;
        + (_env2Config.env && _env2Config.env.x509loginPath) || _config.x509loginPath;
        URL = URL + "?target=" + encodeURIComponent(targetURL) + "&interactive=1";
      } else {
        URL = URL + "?interactive=0";
      }
      return URL;
    },

    /**
     * Sign out user, delete any shared session token
     *     
   * @method logout 
   * @memberof hpeLogin
     *
   * @param {function({userId,status, code, error, message})} inCallback - callback function called with logout is complete
   * 
   * @return {void} This is an asynchronous call. The actual result will be sent back to the callback function
   */
    logout: function (inCallback) {
      var TAG = "hpeLogin.logout ";
      if (typeof _idp !== "string" || typeof _env !== "string") {
        (typeof inCallback === "function") && inCallback({
          status: "error",
          code: hpeLogin.config.loginFailureEnum.WRONG_PARAMS,
          error: "hpeLogin isn't initialized"
        })
      } else {
        _logout(inCallback);
      }
    },

    /*
     * Logging APIs
     */
    loge: function (message) {
      hpeLogin.logger.loge(message);
    },
    logw: function (message) {
      hpeLogin.logger.logw(message);
    },
    logi: function (message) {
      hpeLogin.logger.logi(message);
    },
    logd: function (message) {
      hpeLogin.logger.logd(message);
    },
    getLogs: function () {
      return hpeLogin.logger.getLogs();
    },
    getLogLevelEnum: function () {
      return hpeLogin.logger.getLogLevelEnum();
    },
    getLogAppenderEnum: function () {
      return hpeLogin.logger.getLogAppenderEnum();
    },
    getLogLevel: function () {
      return hpeLogin.logger.getLogLevel();
    },
    getLogAppenders: function () {
      return hpeLogin.logger.getLogAppenders();
    },
    setLogLevel: function (inLogLevel) {
      hpeLogin.logger.setLogLevel(inLogLevel);
    },
    setLogAppenders: function (inLogAppenders) {
      hpeLogin.logger.setLogAppenders(inLogAppenders);
    }
  }
})();

/**
 * Directly using XMLHttpRequest to do Ajax calls. The implementation is inspired by EnyoJS.
 */
hpeLogin.ajax = {
  /**
   * This is the public method for ajax calls
   * @method request
   * @param {object} inParams - Object that may contain these properties:
   *      url: The URL to request (required).
   *      method: The HTTP method to use for the request. Defaults to GET.
   *      callback: Called when request is completed.
   *      body: Specific contents for the request body for POST method.
   *      headers: Request headers.
   */
  request: function (inParams) {
    var xhr = this._getXMLHttpRequest();
    var method = inParams.method || "GET";
    xhr.open(method, inParams.url, true);
    xhr.withCredentials = true; // will have cors issue if not set this.
    this._makeReadyStateHandler(xhr, inParams.callback);

    //set headers

    if (inParams.headers) {
      if (!inParams.headers.hasOwnProperty("Content-Type")) {
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      }
      for (var key in inParams.headers) {
        xhr.setRequestHeader(key, inParams.headers[key]);
      }
    } else {
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    }
    xhr.send(typeof inParams.body === "string" ? inParams.body : this._objectToQuery(inParams.body) || null);
    return xhr;
  },

  /**
   * ---------------------------------------
   * These are private methods
   * ---------------------------------------
   */
  _getXMLHttpRequest: function () {
    try {
      return new XMLHttpRequest();
    } catch (e) {
    }
    try {
      return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
    }
    try {
      return new ActiveXObject("Microsoft.XMLHTTP");
    } catch (e) {
    }
    return null;
  },
  _makeReadyStateHandler: function (inXhr, inCallback) {
    inXhr.onreadystatechange = function () {
      if (inXhr.readyState == 4) {
        var success = inCallback.success;
        var failure = inCallback.failure;

        if (hpeLogin.ajax._isFailure(inXhr)) {
          hpeLogin.logd("_makeReadyStateHandler => Failure");
          (typeof failure === "function") && failure(inXhr, inXhr.responseText);
        } else {
          hpeLogin.logd("_makeReadyStateHandler => Success");
          typeof success === "function" && success(inXhr, inXhr.responseText);
        }
      }
    };
  },
  _objectToQuery: function (/*Object*/ map) {
    var enc = encodeURIComponent;
    var pairs = [];
    var backstop = {};
    for (var name in map) {
      var value = map[name];
      if (value != backstop[name]) {
        var assign = enc(name) + "=";
        var getType = {};
        if (value && getType.toString.call(value) == "[object Array]") { // is array?
          for (var i = 0; i < value.length; i++) {
            pairs.push(assign + enc(value[i]));
          }
        } else {
          pairs.push(assign + enc(value));
        }
      }
    }
    return pairs.join("&");
  },
  _isFailure: function (inXhr) {
    return (inXhr.status < 200 || inXhr.status >= 300);
  }
};

hpeLogin.config = {
  sessionStatusEnum: {
    APP_CATALOG_NOT_INSTALLED: 1,
    NOT_SIGNED_BY_HPIT: 2,
    LOGIN_SESSION_NOT_FOUND: 3,
    LOGIN_SESSION_DATA_BROKEN: 4,
    WRONG_PARAMS: 5,
    INVALID_SESSION: 6,
    UNABLE_TO_CHECK: 7,
    UNKNOWN_ERROR: 99
  },
  loginFailureEnum: {
    INCORRECT_CREDENTIALS: 1,
    INTERNAL_ERROR: 2,
    WRONG_PARAMS: 3
  }
};

hpeLogin.logger = (function () {
  var logLevelEnum = { ERROR: "ERROR", WARNING: "WARNING", INFO: "INFO", DEBUG: "DEBUG", DISABLED: "DISABLED" }; //static variables
  var logAppenderEnum = { WEB_CONSOLE: "WEB_CONSOLE", WEB_STORAGE: "WEB_STORAGE" }; //static variables
  var logLevel = logLevelEnum.INFO; //default level
  var logAppenders = [logAppenderEnum.WEB_CONSOLE];//default appenders

  var _log = function (message, level) {
    _appendLog({ "t": new Date().toUTCString(), "m": message, "l": level });
  };
  var _appendLog = function (msgJSON) {
    for (var i = 0; i < logAppenders.length; i++) {
      var logAppender = logAppenders[i];
      if (logAppender === logAppenderEnum.WEB_CONSOLE) {
        if (window.console) {
          console.log(msgJSON.m);
        }
      } else if (logAppender === logAppenderEnum.WEB_STORAGE) {
        _appendLogToWebStorage(msgJSON);
      }
    }
  };
  var _appendLogToWebStorage = function (msgJSON) {
    var loggedMessages = window.sessionStorage.getItem("hpeit-mobile-log");
    if (loggedMessages) {
      loggedMessages = hpeLogin.parseJSON(loggedMessages);
    } else {
      loggedMessages = [];
    }
    loggedMessages.push(msgJSON);
    window.sessionStorage.setItem("hpeit-mobile-log", hpeLogin.stringifyJSON(loggedMessages));
  };
  var _isDebugEnabled = function () {
    return logLevel === logLevelEnum.DEBUG;
  };
  var _isLogDisabled = function () {
    return logLevel === logLevelEnum.DISABLED;
  };
  var _isErrorEnabled = function () {
    return (logLevel === logLevelEnum.DEBUG || logLevel === logLevelEnum.INFO || logLevel === logLevelEnum.WARNING || logLevel === logLevelEnum.ERROR);
  };
  var _isWarningEnabled = function () {
    return (logLevel === logLevelEnum.DEBUG || logLevel === logLevelEnum.INFO || logLevel === logLevelEnum.WARNING);
  };
  var _isInfoEnabled = function () {
    return (logLevel === logLevelEnum.DEBUG || logLevel === logLevelEnum.INFO);
  };

  return {
    loge: function (message) {
      if (_isErrorEnabled()) {
        _log(message, "ERROR");
      }
    },
    logw: function (message) {
      if (_isWarningEnabled()) {
        _log(message, "WARNING");
      }
    },
    logi: function (message) {
      if (_isInfoEnabled()) {
        _log(message, "INFO");
      }
    },
    logd: function (message) {
      if (_isDebugEnabled()) {
        _log(message, "DEBUG");
      }
    },
    getLogs: function () {
      return window.sessionStorage.getItem("hpeit-mobile-log");
    },
    getLogLevelEnum: function () {
      return logLevelEnum;
    },
    getLogAppenderEnum: function () {
      return logAppenderEnum;
    },
    getLogLevel: function () {
      return logLevel;
    },
    getLogAppenders: function () {
      return logAppenders;
    },
    setLogLevel: function (inLogLevel) {
      logLevel = inLogLevel;
    },
    setLogAppenders: function (inLogAppenders) {
      logAppenders = inLogAppenders;
    }
  }
})();

/**
  * Utility functions.
 */
hpeLogin.Utils = {
  /**
   * Gets the String that is nested in between two Strings.
   * Only the first match is returned.
   * 
   * @param {string} inSession - sessionTk value to be truncated
   */
  truncateSessionTk: function (inSession) {
    if (typeof inSession == 'string') {
      // Considering security, only display first 8 and last 8 characters of session token
      return inSession.substring(0, 8) + "..." + inSession.substring(inSession.length - 8);
    } else {
      return inSession;
    }
  },
};

/**
 * Safe JSON parse (catches exceptions)
 * 
 * @param {string} inStr
 */
hpeLogin.parseJSON = function (inStr) {
  var TAG = "hpeLogin.parseJSON():";
  var jsonObject = {};
  try {
    jsonObject = JSON.parse(inStr);
  } catch (err) {
    hpeLogin.loge(TAG + " - JSON parse failed");
  }
  return jsonObject;
};

/**
 * @param  {string} inJsonObject
 */
hpeLogin.stringifyJSON = function (inJsonObject) {
  var TAG = "hpeLogin.stringifyJSON():";
  var str = "";
  try {
    str = JSON.stringify(inJsonObject);
  } catch (err) {
    hpeLogin.loge(TAG + " - JSON stringify failed");
  }

  return str;
};
