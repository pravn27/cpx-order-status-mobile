import React from 'react';
import ReactDOM from 'react-dom';

// utils
import { FormattedMessage } from 'react-intl';

// grommet components
import Box from 'grommet/components/Box';

//Redux Components
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { subscribeAlerts } from '../actions/alertActions'
// required component
import CommonAccordion from './CommonAccordion';
import AlertHistoryListItem from './AlertHistoryListItem';
import Label from 'grommet/components/Label';
import RadioButton from 'grommet/components/RadioButton';
import Title from 'grommet/components/Title';
import Heading from 'grommet/components/Heading';


const labels = {
    yes: (<FormattedMessage id={"yes"} defaultMessage={"Yes"} />),
    no: (<FormattedMessage id={"no"} defaultMessage={"No"} />),
    alerts_yes_no: (<FormattedMessage id={"alerts_yes_no"} defaultMessage={"Would you like to receive alerts for this order?"} />),
};


const mapDispatchToProps = (dispatch) => ({
    alertActions: bindActionCreators({ subscribeAlerts }, dispatch)
});

var AlertHistoryList = React.createClass({

    getInitialState: function () {
        const
            isAlertsSubscribed = this.props.isAlertsSubscribed;
        return {

            'isAlertsSubscribed': isAlertsSubscribed
        };
    },

    getAlertHistoryItems: function (alertList) {
        return alertList.map((alert, j) =>
            <Box key={j} className="list-item-border" pad="medium" colorIndex="light-1" justify="between" responsive={false} >
                <AlertHistoryListItem item={alert} />
            </Box>
        );
    },

    subscribeAlerts: function (flag) {
        this.setState({ isAlertsSubscribed: flag });
        let qtcuid = this.props.qtcuid;
        this.props.alertActions.subscribeAlerts(qtcuid, 'com.hpe.prp.cpx.model.Order', flag);

    },
    render: function () {
        var alertList = this.props.alerts;
        var alertHistoryItems = this.getAlertHistoryItems(alertList);
        var alertSubscription =
            <Box colorIndex="light-1" pad="medium" justify="between" responsive={false} className="list-item-border" >
                <Box colorIndex="light-1" justify="between" responsive={false} full="horizontal">
                    <Title responsive={false} justify="between">
                        <Heading className="alerts-text four_pad" margin="none" strong={false} align="start"  >
						    
                            {labels.alerts_yes_no}
                        </Heading>
                    </Title>
                </Box>
                <Box direction="row" responsive={false} className="four_pad">
                    <table className="tableStyle">
                        <tr>
                        <td>
                        <Label className="radio-button-width" > {labels.yes}&ensp;
				        <RadioButton id="Alertid-yes" label=" " checked={this.state.isAlertsSubscribed} onChange={() => this.subscribeAlerts(true)} />
                        </Label></td>
                    
                    <td>
                        <Label className="radio-button-width">{labels.no}&ensp;
                         <RadioButton id="Alertid-no" label=" " checked={!this.state.isAlertsSubscribed} onChange={() => this.subscribeAlerts(false)} />
                        </Label>
                    </td></tr>
                </table>
                </Box>
            </Box>


        return (
		    <CommonAccordion heading={<FormattedMessage id={"alert_history_label"} defaultMessage={"Alert History"} />} >
				<a id="top"></a>
                {alertSubscription}
                {alertHistoryItems}
            </CommonAccordion>
        );
    }
});

export default connect(null, mapDispatchToProps)(AlertHistoryList);
