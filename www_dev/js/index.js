// ++++++++++++++
//   Imports
// ++++++++++++++
import React, { Component } from 'react';
import { Router, Route, hashHistory } from 'react-router';
import ApiComm from './utils/apiCommunicator';
import { initializeEvents } from './cordovaEventHandlers';

// Components
import App from 'grommet/components/App';
import LoginPage from './components/LoginPage';
import DeniedAccessRights from './components/DeniedAccessRights';
import NoInternetConnectionPopup from './components/NoInternetConnectionPopup';
import ServiceErrorPopup from './components/ServiceErrorPopup';
import SplashScreen from './components/SplashScreen';
import LandingPage from './components/LandingPage';
import SearchBox from './components/SearchBox';
import SearchResult from './components/SearchResult';
import Alerts from './components/Alerts';
import WatchListPage from './components/WatchListPage';
import OrderDetailsPage from './components/OrderDetailsPage';
import Preferences from './components/Preferences';
import AdvancedSearchPage from './components/AdvancedSearchPage';
import SearchPattern from './components/SearchPattern';
import TermsConditions from './components/TermsConditions';
import OrderFeedbackPage from './components/OrderFeedbackPage';
import { tracking } from './utils/utilities';
import Tutorial from './components/Tutorial';
import ContactSupport from './components/ContactSupport';

// internationalization
import { IntlProvider, addLocaleData } from 'react-intl';
import { getCurrentLocale, getLocaleData } from 'grommet/utils/Locale';
import en from 'react-intl/locale-data/en';
import de from 'react-intl/locale-data/de';

// Redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { connect } from 'react-redux';

// +++++++++++++++++++++++++++++++++++++++
//   Set up for internationalization
// +++++++++++++++++++++++++++++++++++++++
const locale = getCurrentLocale();

// Set up an array of languages by reading in the language files.  We have to do it this way
// because browserify can't dynamically require files.
// TODO: Possbily move the language loading to a method that reads all the files in the messages directory
const languages = {};
languages['en-US'] = require('../messages/en-US');
languages['de-DE'] = require('../messages/de-DE');

addLocaleData(en);
addLocaleData(de);

// We're only supporting english currently, but this sets up the message files based on locale
let messages;
if (languages[locale] !== undefined) {
    messages = languages[locale];
} else {
    messages = languages['en-US'];
}

const localeData = getLocaleData(messages, locale);

// ++++++++++++++++
//   Redux set up
// ++++++++++++++++

//Redux thunk middleware for async actions
var ReduxThunk = require('redux-thunk').default

//Redux Reducers
import appReducer from './reducers'

//Redux middleware thunk
const middleWare = [ReduxThunk];
const store = createStore(appReducer, applyMiddleware(...middleWare));

// Sets dispatch object on Api communicator
ApiComm.setDispatch(store.dispatch);

// ++++++++++++++++++
//   Components definition
// ++++++++++++++++++
class LandingPageRouting extends Component {

  componentWillMount() {
    var route = {location: {pathname: 'SplashScreen'}};
    this.onEnter(route, this.props);
  }

  onEnter(route, props) {
    let {analytics} = props.profile || props.userProfile.profile;
    var pageName = (route.location.pathname === "/") ? "LandingPage" : route.location.pathname.split("/").length > 1 ? route.location.pathname.split("/")[1] : route.location.pathname.split("/")[0];
    tracking(pageName, analytics);
  }

  render() {

    return (
      <App>
        <NoInternetConnectionPopup/>
        <Router history={hashHistory}>
          <Route path="/" component={LandingPage} onEnter={(route) => this.onEnter(route, this.props)}></Route>

          <Route path="/SearchBox" component={SearchBox} onEnter={(route) => this.onEnter(route, this.props)}></Route>
          <Route path="/SearchResult/:type/:keyword" component={SearchResult}></Route>
          <Route path="/SearchResult/:type/:keyword/:filter/:sort" component={SearchResult}></Route>
          <Route path="/SearchResult/:type" component={SearchResult}></Route>
          <Route path="/Alerts" component={Alerts} onEnter={(route) => this.onEnter(route, this.props)}></Route>
          <Route path="/WatchListPage" component={WatchListPage} onEnter={(route) => this.onEnter(route, this.props)}></Route>
          <Route path="/OrderDetails/:id" component={OrderDetailsPage} onEnter={(route) => this.onEnter(route, this.props)}></Route>
          <Route path="/Preferences" component={Preferences} onEnter={(route) => this.onEnter(route, this.props)}></Route>
          <Route path="/AdvancedSearchPage" component={AdvancedSearchPage} onEnter={(route) => this.onEnter(route, this.props)}></Route>
          <Route path="/LandingPage" component={LandingPage} onEnter={(route) => this.onEnter(route, this.props)}></Route>
          <Route path="/SearchPattern" component={SearchPattern} onEnter={(route) => this.onEnter(route, this.props)}></Route>
          <Route path="/OrderFeedbackPage/:qtcuid" component={OrderFeedbackPage}></Route>
          <Route path="/ContactSupport" component={ContactSupport} onEnter={(route) => this.onEnter(route, this.props)}></Route>
          <Route path="/Tutorial" component={Tutorial} onEnter={(route) => this.onEnter(route, this.props)}></Route>
        </Router>
      </App>
    )
  }
}

class AppMain extends Component {

  render() {

    let currentView = getCorrectViewToRender(this.props);

    return (
      <App>
        <DeniedAccessRights/>
        <ServiceErrorPopup />
        { currentView }
      </App>
    );
  }
};

localeData.locale = "en"; // the value for localeData.locale was 'en-US'' which is causing the error messages
class AppBody extends Component {
  render() {
      return (
        <Provider store={store}>
            <IntlProvider locale={localeData.locale} messages={localeData.messages}>
                <AppMainConnectedToRedux />
            </IntlProvider>
        </Provider>
    )
  }
}



// ++++++++++++++++++
//   Utils
// ++++++++++++++++++
const
    // Redux stuff
    mapStateToProps = ({ userInit }) => {
        return ({
            isUserLoginReady: userInit.isUserLoginReady,
            isUserLoggedin: userInit.isUserLoggedin,
            isUserInfoReady: userInit.isUserInfoReady,
            isUserInfoFetching: userInit.isUserInfoFetching,
            userHasAcceptedTermsAndConditions: userInit.userHasAcceptedTermsAndConditions,
            userProfile: userInit.data,
            userHasSkippedOrDoneTutorial: userInit.userHasSkippedOrDoneTutorial
        });
    },

    AppMainConnectedToRedux = connect(mapStateToProps, null)(AppMain),

    getCorrectViewToRender = ({ isUserLoginReady, isUserLoggedin, isUserInfoReady, isUserInfoFetching, userHasAcceptedTermsAndConditions, userProfile, userHasSkippedOrDoneTutorial }) => {
        if (isUserLoggedin) {
          if (!userHasAcceptedTermsAndConditions) {
            return ( <TermsConditions /> );
          }

          if (isUserInfoReady && userHasSkippedOrDoneTutorial) {
            return ( <LandingPageRouting userProfile={userProfile}/> );
          }

          if (userHasAcceptedTermsAndConditions && !userHasSkippedOrDoneTutorial) {
            return (<Tutorial/>);
          }

          return ( <SplashScreen url={"img/splash/splash_screen_xhdpi.png"} /> );

        } else if (isUserLoginReady) {
          return ( <LoginPage /> );
        }
        return ( <SplashScreen url={"img/splash/splash_screen_xhdpi.png"} /> );
    };



// ++++++++++++++++++
//   Cordova set up
// ++++++++++++++++++
initializeEvents( (<AppBody />), store.dispatch );
