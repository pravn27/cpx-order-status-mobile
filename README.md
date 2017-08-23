# CPX Order Status Cordova App

Uses Grunt, Browserify and Ripple in a Cordova based mobile app.

Grunt is a customizable javascript task engine.  

Browserify will concatinate code written in the node style CommonJS, creating one master file from modularized javascript.  A good explaination of node style CommonJS and browserify can be found [here](https://truongtx.me/2014/03/20/browserify-bring-nodejs-modules-to-browser/). 

Ripple is a browser based emulator for mobile applications that supports multiple mobile platforms.
 

## Initial config

Install node.js v4.4.5 -> https://nodejs.org/en/

Install Cordova -> `npm install -g cordova@5.2.0`

Install Grunt -> `npm install -g grunt@0.4.5`

Install Grunt command line -> `npm install -g grunt-cli@0.1.13`

Install Ripple -> `npm install -g ripple ripple-emulator`

Install Browserify -> `npm install -g browserify@11.1.0`

## Clone the repository

`git clone https://github.hpe.com/cpx-it/cpx-order-status-mobile.git`

After cloning cd to your code directory 

Run `cordova platform add android` which will create the android platform

Run `npm install`

This will pull in all the other necessary npm modules.

Coding should be done in the **www_dev** directory.  You can use whatever editor you want, an IDE is not required.  When you are ready to see your app running enter `grunt server` at the command line.  This will build your code, start up Ripple in the browser, and start watching the files in **www_dev**.  Continue coding, and to see your changes simply save and reload the Ripple window.

## Run it using Docker

Just clone the repo with `git clone https://github.hpe.com/cpx-it/cpx-order-status-mobile.git`.

Build the Docker image with `docker build -t cpx/cpx-order-status-mobile .`.

Once you have built the image, just run it with `docker run -d --name cpx-mobile -p 4400:4400 cpx/cpx-order-status-mobile`

... Or if you want to develop you can pass your `www_dev` folder as a volume to see your changes, just run it like this while you're on the project folder:

```
docker run -it --rm -v "$PWD"/www_dev:/usr/src/app/www_dev --name cpx-mobile -p 4400:4400 cpx/cpx-order-status-mobile
``` 

## Available grunt tasks

`grunt server` -> browserifies the code, runs cordova prepare, and starts the ripple emulator

`grunt prepare:debug` -> browserifies the code with source mapping, and places the concatinated file in the **www_build** directory

`grunt prepare:device` -> browserifies the code with source mapping, copies the code to the **www** directory, and execs `cordova run` which will either start the cordova emulator, or run on a connected test device

`grunt prepare:release` -> browserifies the code without source mapping, minifies and uglifies the concatenated code, and copies the resuling file into **www\**

`grunt build` -> runs a prepare:release, then does a cordova build

`grunt emulate` -> starts the ripple emulator, displaying the application currently built in the platform directory of the selected device

`grunt device` -> runs the app on an android device connected to the workstation via USB (requires the phone to have remote debugging enabled).
