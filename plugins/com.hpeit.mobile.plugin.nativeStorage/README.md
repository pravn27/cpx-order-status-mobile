# cordova-plugin-native-storage

Cordova plugin allowing data sharing and storage between trusted applications.

In **Android**, this is based on storing data to be shared in a SQLite database linked to a reference mobile application (*com.hpeit.mobile.peoplefinder*).
Only applications running under the same Android shared user id (as defined in the [application manifest](http://developer.android.com/guide/topics/manifest/manifest-element.html)) are allowed to access this data. Only applications signed with the same
developer certificate can run under the same shared user id. Therefore, this is what defines the scope of trusted applications.

In **iOS**, this is based on a shared Keychain (*88WXQY4ZSU.com.hpeit.mobile* as used by the
[HPE Enterprise Mobility](http://cas.corp.hp.com/site/cas/enterprisemobility/) program).
Only applications published by the same developer account can access this shared keychain. This is what defines the scope of trusted applications.

The above configuration allowing data sharing is usually only possible for application ready for production deployment.
 
In development mode, applications are usually not signed by a central authority and data sharing isn't possible. 

## Usage

To add this plugin in a Cordova application:

```sh
cordova plugin add https://github.hpe.com/SecurityGateway/cordova-plugin-native-storage
```

## Warning

This code isn't actively maintained and tested for all and especially newer versions of Cordova and mobile OS (Android and iOS). This was last tested with Cordova 6.1.1 and Android 4.4.2.

Feedback and contributions are welcome! 
