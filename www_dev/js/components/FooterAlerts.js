import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';
import { hashHistory } from 'react-router';

//Grommet Components
import Alert from 'grommet/components/icons/base/Alert';
import Box from 'grommet/components/Box';

//Components
import FooterAlertsBadger from './FooterAlertsBadger';
import FooterAlertsNonBadger from './FooterAlertsNonBadger';

//Text
const SectionTitles = {
    alerts: (<FormattedMessage id="cpx_alerts_title" defaultMessage="Alerts" />)
};

var FooterAlerts = React.createClass({

    alertsredirect: function () {
        hashHistory.push('/Alerts');
    },

    render: function () {

        return (
           <Box direction = "row" pad="none" align="center" justify="center" onClick={this.alertsredirect} basis="small">
                <Box direction="row" responsive={false} justify="between" pad="none">
                    <div>
                        {this.props.Count > 0 ? <FooterAlertsBadger Source = {this.props.Source} Count = {this.props.Count}/> : <FooterAlertsNonBadger Source = {this.props.Source}/>}
                    </div>
                </Box>
                {this.props.Source == "Alerts" ? <div className="brand-color">{SectionTitles.alerts}</div> : <div className="footer-normal">{SectionTitles.alerts}</div>}
            </Box>
        );
    }
});

export default FooterAlerts;