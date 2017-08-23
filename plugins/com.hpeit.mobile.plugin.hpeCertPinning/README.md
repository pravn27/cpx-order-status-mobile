# cordova-plugin-hpe-cert-pinning

Cordova plugin adding HPE trusted Certificate Authorities to be pinned (certificate pinning) using plugin [cordova-HTTP](https://github.com/wymsee/cordova-HTTP)
added as a dependency (i.e. it will be installed with this plugin).

Certificate Authorities included are:

* Internal CAs (for internal servers):
	* Hewlett Packard Enterprise Private Root CA
	* Hewlett Packard Enterprise Intermediate CA
* External CAs (for external-facing servers)
	* Symantec Class 3 Secure Server CA - G4
	* VeriSign Class 3 Public Primary Certification Authority - G5

When executing HTTPS requests using plugin cordova-HTTP configured for certificate pinning, connections are allowed only
to servers with an SSL server certificate issued by one of these CAs. Connections to other servers results in a failure.

Example of usage of the cordova-HTTP plugin with certificate pinning enabled (pinning has to be enabled once only
and not for every call):

```js
cordovaHTTP.enableSSLPinning(true, function() {
	cordovaHTTP.post(loginURL, postBody, {}, callbacks.success, callbacks.failure);
});
```

This adds protection to applications against Man in the Middle attacks ([MitM](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)) by ensuring
that the certificate presented by the server is one issued by a HPE trusted CA. 

## Usage

To add this plugin in a Cordova application:

```js
cordova plugin add https://github.hpe.com/SecurityGateway/cordova-plugin-hpe-cert-pinning
```

Thanks to a dependency, plugin [cordova-HTTP](https://github.com/wymsee/cordova-HTTP) will also be installed.

## See also

* [Cordova plugin SGWMobile](https://github.hpe.com/SecurityGateway/cordova-plugin-sgw-mobile) depends on this plugin when authenticating users
with the Security Gateway.

* [Server Certificate Enrollment](https://myitsupport.ext.hpe.com/myITsupport/ITSArticle?ArticleNumber=000001599) page on MyITSupport

## Warning

This code isn't actively maintained and tested for all and especially newer versions of Cordova and mobile OS (Android and iOS). This was last tested with Cordova 6.1.1 and Android 4.4.2.

Feedback and contributions are welcome! 
