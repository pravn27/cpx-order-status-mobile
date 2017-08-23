import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Box from 'grommet/components/Box';
import Section from 'grommet/components/Section';
import Flag from 'grommet/components/icons/base/Flag';
import Next from 'grommet/components/icons/base/Next';
import apiCommunicator from '../utils/apiCommunicator';


var AlertsControl = React.createClass({
	getInitialState: function() {
		return {
			watchListMsg: (<FormattedMessage id="main_alert_bar_text" defaultMessage="Watch List" />),
			newAlertsMsg: (<FormattedMessage id="main_alert_bar_label" defaultMessage="New Alerts" />),
			alertsCount: apiCommunicator.getAlertsCount()
		};
	},
	render () {
		return (
			<Section direction="row" colorIndex="light-1" align="center" justify="between" pad="medium" responsive={false}>
				<Box align="center" direction="row" responsive={false}>
					<Flag colorIndex="brand"/>&emsp;
					<Box>{this.state.watchListMsg}</Box>
				</Box>
				<Box align="center" direction="row" responsive={false}>
					<Box>{this.state.newAlertsMsg}</Box>:&ensp;
					<Box>{this.state.alertsCount}</Box>&emsp;
					<Next colorIndex="grey-4"/>
				</Box>
			</Section>
		);
	}
});

export default AlertsControl;