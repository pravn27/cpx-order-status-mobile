import React from 'react';
import Layer from 'grommet/components/Layer';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Anchor from 'grommet/components/Anchor';
import Menu from 'grommet/components/Menu';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Heading from 'grommet/components/Heading';
import Box from 'grommet/components/Box';
import { FormattedMessage } from 'react-intl';
import IconHelper from './IconHelper';
import { hashHistory } from 'react-router';
import { userLogout } from '../actions/userActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { tracking } from '../utils/utilities';

const mapStateToProps = (state) => ({
  state: state,
  analytics: state.userInit.data.profile.analytics
});

const mapDispatchToProps = (dispatch) => ({
  userLogout: bindActionCreators({ userLogout }, dispatch)
});

var LandingSidebar = React.createClass({
  getInitialState: function () {
    return {
      data: [
        { id: 1, icon: 'Home', text: 'cpx_sidebar_home', click: this.clickHome, default: 'Home' },
        { id: 2, icon: 'Actions', text: 'cpx_sidebar_preferences', click: this.clickPreferences, default: 'Preferences' },
        { id: 3, icon: 'Support', text: 'cpx_sidebar_support', click: this.clickSupport, default: 'Get Support' },
        { id: 4, icon: 'Logout', text: 'cpx_sidebar_logout', click: this.userLogout, default: 'Sign out' },
        { id: 5, icon: 'User', text: 'cpx_sidebar_simulateuser', click: this.clickSimulateUser, default: 'Simulate User' }
      ],
      about: [
        { id: 1, icon: 'Compliance', text: 'cpx_sidebar_terms', click: this.clickConditions, default: 'Terms and Conditions' },
        { id: 2, icon: 'Secure', text: 'cpx_sidebar_privacy', click: this.clickPrivacy, default: 'Privacy statement' }
      ],
      version: { text: 'cpx_sidebar_version', number: 'version' }
    };
  },
  clickHome: function () {
    this.props.close();
    hashHistory.push('/');
    //This tracking should not happen as in index.js page change is already captured
    //Keeping the code commented here so merge conflicts do not add this code again!
    //tracking('LandingPage', this.props.analytics); //auto-merge or merge conflict has added this code again! 
  },
  clickSupport: function () {
    this.props.support();
    tracking('SupportPage', this.props.analytics);
  },
  clickPrivacy: function () {
    this.props.privacy();
    tracking('PrivacyPage', this.props.analytics);
  },
  clickConditions: function () {
    this.props.conditions();
    tracking('ConditionsPage', this.props.analytics);
  },
  clickPreferences: function () {
    this.props.preferences();
    tracking('PreferencesPage', this.props.analytics);
  },
  userLogout: function () {
    this.props.userLogout.userLogout();
    tracking('LogoutPage', this.props.analytics);
  },
  clickSimulateUser: function () {
    this.props.simulateUser();
  },
  clickDefault: function () { },
  render() {
    var userType = this.props.state.userInit.data.profile.userType; //profile.userType
    const isSimulationMode = this.props.state.userInit.userSimulation.simulationMode;
    var itemNodes = this.state.data.map(function (item) {
      if (item.id == 5 && (userType == 'partner' &&  !isSimulationMode)) { // userProfile == 'Partner'
        return null
      }
      else {
        return (
          <ListItem key={item.id} onClick={item.click}>
            <Box pad="small" direction="row" align="center" justify="between" tag="aside" responsive={false}>
              <Title responsive={false}>
                <IconHelper iconName={item.icon} />
                <Heading margin="none" tag="h5"><FormattedMessage id={item.text} defaultMessage={item.default} /></Heading>
              </Title>
              <IconHelper iconName="Next" />
            </Box>
          </ListItem>
        );
      }
    });
    var itemAbout = this.state.about.map(function (item) {
      return (
        <ListItem key={item.id} onClick={item.click}>
          <Box pad="small" direction="row" align="center" justify="between" tag="aside" responsive={false}>
            <Title responsive={false}>
              <IconHelper iconName={item.icon} />
              <Heading margin="none" tag="h5"><FormattedMessage id={item.text} defaultMessage={item.default} /></Heading>
            </Title>
            <IconHelper iconName="Next" />
          </Box>
        </ListItem>
      );
    });

    return (
      <Layer closer={false} align="left" flush={true}>
        <Header className="page-header" pad="none" justify="between" fixed={true} colorIndex="neutral-1">
          <Title className="layer-page-header-title">
            <FormattedMessage id="cpx_landing_line" defaultMessage="HPE Go" />
          </Title>
          <Anchor className="layer-close-icon" onClick={this.props.close}>
            <IconHelper iconName='Close' />
          </Anchor>
        </Header>
        <List>
          {itemNodes}
        </List>
        <br />
        <Box pad={{ horizontal: "small", vertical: "none" }}><Heading tag='h3'>About</Heading></Box>
        <List>
          {itemAbout}
        </List>
        <Box pad='medium'>
          <Title responsive={false}>
            <Heading tag="h5" margin="none" className="alert-label" strong={true}>
              <FormattedMessage id={this.state.version.text} defaultMessage="Version" />:
                  </Heading>
            <Heading tag="h5" margin="none">
			{AppVersion.version}
            </Heading>
          </Title>
        </Box>
      </Layer>
    );
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LandingSidebar);