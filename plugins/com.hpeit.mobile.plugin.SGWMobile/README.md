# sgw-mobility-library
Cordova plugin facilitating integration of Cordova hybrid mobile applications with the
[Security Gateway](https://ent302.sharepoint.hpe.com/teams/SecurityGateway/SitePages/Home.aspx) (*SG*) by:

- facilitating user authentication by calling the SG login API, using certificate pinning (i.e. ensure that server certificate was issued by an HPE
trusted certificate authority, to prevent Man-in-the-Middle attacks), for additional security
- retrieving the SG base URL based on the SG environment (PRO, STG)
- allowing Single-Sign On (SSO) between several mobile applications integrated with the SSO library and published (signed) by the same publisher.
This is based on sharing the SG session identifier between trusted mobile applications. All applications using this plugin and configured for SSO
will always start by checking if there is an existing active session that they can share, without asking the end user to authenticate.

See [SSO-mobility-integration.docx](https://ent302.sharepoint.hpe.com/teams/SecurityGateway/Shared%20Documents/Integration/SSO-mobility-integration.docx)
for more information about use cases.

For simple development activities (no SSO, no certificate pinning...), it is also possible to copy directly the main JavaScript file *hpeit.mobile.js*
(defining scope `hpeLogin` and its APIs) into the application, without adding this whole plugin and dependent plugins (i.e. without SSO
and certificate pinning).

## Usage

To add this plugin into a Cordova application:

```sh
cordova plugin add https://github.hpe.com/SecurityGateway/cordova-plugin-sgw-mobile
```

This imports the main JavaScript file `hpeit.mobile.js` (containing the definition of `hpeLogin`) in application subfolder `www/js`
(in each platform folder) and imports dependent plugins:

* [cordova-plugin-native-storage](https://github.hpe.com/SecurityGateway/cordova-plugin-native-storage): allow trusted mobile applications
to share data (SG session identifier), used to implement SSO by sharing the SG *sessionTk* session cookie value

* [cordova-plugin-hpe-cert-pinning](https://github.hpe.com/SecurityGateway/cordova-plugin-hpe-cert-pinning): add list of trusted
HPE Certificate Authorities into application and include dependency with external plugin [cordova-HTTP](https://github.com/wymsee/cordova-HTTP)
allowing certificate pinning (i.e. connection is allowed only to servers with a server certificate issued by one of these trusted CAs).

Note that certificate pinning is used by *hpeLogin* only when authenticating a user (when sending credentials to the SG login API). All other requests
are based on simple Ajax (XMLHttpRequest) requests. However, it is possible for applications to use plugin *cordova-HTTP* and CA certificates pinned for
its other requests.

**An example application using this mobility library can be found at
[sgw-mobility-sample-app](https://github.hpe.com/SecurityGateway/sgw-mobility-sample-app)**

## Create your own test application

Create an empty Cordova application:

```sh
cordova create sgw-mobility-test-app com.hpeit.mobile.sgwmobilitytesapp SGWTestApp
```

Add [SGWMobile plugin](https://github.hpe.com/SecurityGateway/cordova-plugin-sgw-mobile) from HPE Github:

```sh
cd sgw-mobility-test-app
cordova plugin add https://github.hpe.com/SecurityGateway/cordova-plugin-sgw-mobile --save
```

Option `--save` saves the dependency with plugin SGWMobile so that builds in a new environment will automatically add it.

Add a platform (e.g. Android):

```sh
cordova platform add android
```

Refer to JavaScript file `hpeit.mobile.js` in the main application file (note that this file is copied automatically by Cordova in each 
platform-specific `js` subfolder):

```html
<script type="text/javascript" src="js/hpeit.mobile.js"></script>
```

Object `hpeLogin` can then be used in the application JavaScript code to call APIs.

## hpeLogin API Description

A JavaScript scope `hpeLogin` is available to call APIs.
See [API section of Wiki](../../wiki/APIs) for more information about how to use these APIs.

The following APIs are defined:

* [hpeLogin.initialize](../../wiki/initialize)
* [hpeLogin.checkSession](../../wiki/checkSession)
* [hpeLogin.loginWithCredentials](../../wiki/loginWithCredentials)
* [hpeLogin.logout](../../wiki/logout)
* [hpeLogin.getSRPBaseURL](../../wiki/getSRPBaseURL)
* [Additional support APIs](SupportAPIs)


## Mobile Platform-Specific Considerations

Although several platform-specific configurations are already applied to the application when adding the NativeStorage Cordova plugin,
several checks and actions remain to be done for each supported platform, Android or iOS.

### Android

Although this must be already defined by the Cordova NativeStorage plugin, check that the following
2 **permissions** (*INTERNET* and *WRITE_EXTERNAL_STORAGE*) are added in the Android manifest.
Note that the *WRITE_EXTERNAL_STORAGE* permission isn't actually required and used, but this is a dependency of the *cordova-HTTP* plugin.

SSO (i.e. data sharing between applications) can work on Android devices only if the reference HPE trusted application
**PeopleFinder mobile** (application id = **com.hpeit.mobile.peoplefinder**) is:

1. installed,
2. signed by the same publisher key,
3. and defined to run under the same "shared user id" (what requires #2 to be true too)

For test purposes (e.g. during development and integration test), it is possible to define an alternate reference application
(e.g. the test application itself) in the application manifest as meta data **hpmssoRefApp**:

```xml
<application>
  	<meta-data android:name="hpmssoRefApp" android:value="com.hpeit.mobile.myrefapp" />
</application>
```

To enable Single-Sign-On between HPE IT internal mobile applications, a specific *Shared user id*,
(`android:sharedUserId="com.hpeit.mobile"`) must be defined in the [Android manifest element](http://developer.android.com/guide/topics/manifest/manifest-element.html).

This should be enabled only before creating the application package to be signed for distribution in the HPE IT Catalog
(see http://mobility.hpecorp.net/ for more information). Defining this shared user id when testing
the application is likely to result in an error to install it, as Android is checking that only applications
signed with the same publisher certificate key can run under the same *Shared user id*.
This is what is defining the scope of trusted applications that can share a same session (i.e. what enables SSO).

A typical conflict would be to have the mobile PeopleFinder application installed on the device with this
shared user id and signed by the HPE IT catalog manager and your test application using the same shared user id,
but signed with a development certificate key. 

When testing the application, this field can be left empty. This won't enable SSO with other applications,
but it will allow testing authentication anyway.

### iOS

#### Development Setup

Getting set up for developing iOS applications requires the following:
-	Create an Apple ID from https://developer.apple.com/programs/register/ using your HPE email
-	Use a Mac with Xcode installed for development
-	Register as a developer for HPE IT Enterprise Development account: ask the HPE IT Catalog Manager
(check for contact at http://mobility.hpecorp.net/) to be invited as a developer in the HPE IT Developer Enterprise Program
-	Once registered, go to the [iOS Provisioning Portal](https://developer.apple.com/ios/manage/overview/index.action)
to continue the setup, including the creation of a developer certificate and optionally, registering test devices.

Each application requires a specific application bundle id and provisioning profile. Note that the bundle id prefix
of HPE IT applications should rather use the following prefix: **88WXQY4ZSU.com.hpeit.mobile** 

#### Application configuration

The following checks or configurations must be executed in XCode:

1. Edit the *Keychain Sharing* section of the Project Target "Capabilities" tab to Enable *Keychain Sharing* and
input **com.hpeit.mobile** as Keychain Access Group name
2. Although this must have been added automatically by the Cordova plugin, check that file **sso-keychain.plist** was added
into the **Resources** folder of the application, or add it manually from the plugin folder otherwise
3. To test the application, it must be signed using a developer account created in the HPE IT Apple Enterprise Distribution account.
Ask the HPE IT Catalog Manager to be registered as a developer. Once registered with your developer certificate imported
into your development environment, edit the **Build Settings** by selecting **Automatic / iOS Developer**
in the **Code Signing Identity** properties group

## Difference with old hpLogin mobility library

As compared to the previous version of the library, the installation of this new version is more automated and simplified.

The most significant difference in installation and usage are:

* File `hpeit.mobile.js` is copied directly in folder `js`. There is no need to copy the file manually.
* Old JavaScript scope `hpLogin` is renamed to `hpeLogin`
* Addition of a new plugin adding certificate pinning capability for compliance with Cyber Security policies
(when credentials and sent for authentication). This is seamless and doesn't require any specific action.
This plugin can be leveraged, if needed, by the application for other call if very sensitive data is transferred. 

## Warning

This code isn't actively maintained and tested for all and especially newer versions of Cordova and mobile OS (Android and iOS).
This was last tested with Cordova 6.1.1 and Android 4.4.2.

Feedback and contributions are welcome! 
