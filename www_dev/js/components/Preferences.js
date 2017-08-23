import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

// utils
import { FormattedMessage } from 'react-intl';
import apiCommunicator from '../utils/apiCommunicator';
import { Spinner } from '../utils/commonComponents';

// grommet components
import Layer from 'grommet/components/Layer';
import Section from 'grommet/components/Section';
import Header from 'grommet/components/Header';
import Box from 'grommet/components/Box';
import Title from 'grommet/components/Title';
import Anchor from 'grommet/components/Anchor';

// components
import WatchListAlertPref from './WatchListAlertPref';
import AccountDetailsPref from './AccountDetailsPref';

// icons for header
import IconHelper from './IconHelper';
var IconMenu = require('grommet/components/icons/base/Menu');

const mapStateToProps = (state) => ({
  userInit: state.userInit.data,
  userSimulation: state.userInit.userSimulation
});


var Preferences = React.createClass({
  getInitialState: function() {
    var { userInit } = this.props;

    return {
      userAccountDetails: {
        userEmail: userInit.profile.userEmail,
        userCountry: userInit.profile.analytics.country ? userInit.profile.analytics.country.split('|')[0] : ''
      },
      userPreferences: []
    };
  },
  componentDidMount: function() {
    var doAsUser = this.props.userSimulation.simulatedUser;

    apiCommunicator.getPreferences(doAsUser).then(response => {
      if (response.statusCode === 200) {
        var preferences = response.body;
        this.setState({userPreferences: preferences});
      }
    }).catch(err => {
      this.props.close();
    });
  },
  handleToggleChange: function(label, checked) {
    apiCommunicator.postPreferences(label, checked);
  },
  buildPreferenceSections: function() {
    var userPreferences = this.state.userPreferences;
    var preferencesSections = userPreferences.map(function(preferences, i) {
      if (preferences.group == "ORDER_ALERTS")
        return (
          <WatchListAlertPref key={i} data={preferences} handleToggleChange={this.handleToggleChange}/>
        );
      else return null;
    }, this);
    return preferencesSections;
  },
  buildHeader: function() {
    return (
      <Header className="page-header" pad="none" justify="start" fixed={true} style={{ 'position': 'fixed', 'width': '100%', 'top': '0' }} colorIndex="neutral-1">
        <Box className="menu-items" direction="row" justify="start" responsive={false}>
          <Anchor className="page-header-back-btn" icon={<IconHelper iconName="Previous" />} onClick={this.props.close}></Anchor>
          <Anchor icon={<IconMenu />} onClick={this.props.close}></Anchor>
        </Box>
        <Title className="page-header-title-text"><FormattedMessage id="Preferences" defaultMessage="Preferences" /></Title>
      </Header>
    );
  },
	render: function() {
    if(this.state.userPreferences.length <= 0)
      return (
        <Layer closer={false} align="left" flush={true}>
          { this.buildHeader() }
          <Spinner />
        </Layer>
      );
    else
      return (
        <Layer closer={false} align="left" flush={true}>
          { this.buildHeader() }
          <AccountDetailsPref data={this.state.userAccountDetails} />
          { this.buildPreferenceSections() }
        </Layer>
      );
  }
});

export default connect(mapStateToProps, null)(Preferences);