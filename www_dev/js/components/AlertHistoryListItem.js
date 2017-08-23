import React from 'react';
import ReactDOM from 'react-dom';

// grommet components
import Box from 'grommet/components/Box';
import Table from 'grommet/components/Table';
import Label from 'grommet/components/Label';
import Heading from 'grommet/components/Heading';

// utils
import { FormattedMessage } from 'react-intl';
import DataListingTable from '../utils/DataListingTable';
import Utilities from '../utils/utilities';

//Markdown
var showdown = require('showdown');

const labels = {
    alert_history_date_received: (<FormattedMessage id={"alert_history_date_received"} defaultMessage={"Date Received"} />),
    alert_history_message: (<FormattedMessage id={"alert_history_message"} defaultMessage={"Message"} />)
};

var AlertHistoryListItem = React.createClass({
    getInitialState: function () {
        return {
            alertHistoryItem: this.props.item
        };
    },

    getAlertHistoryData: function (alertItem) {
        var alertCreationDate = (<strong>{Utilities.formatDate(alertItem.creationDate)}</strong>);
        var alertMessage = (<Heading className="alerts-text" margin="none" strong={false} align="start" dangerouslySetInnerHTML={{ __html: this.applyMarkDown(alertItem.message) }} ></Heading>);
        return [
            { label: labels.alert_history_date_received, value: alertCreationDate },
            { label: labels.alert_history_message, value: alertMessage }
        ];
    },

    applyMarkDown: function (text) {
        var converter = new showdown.Converter();
        var _markDownHtml = converter.makeHtml(text).replace("<p>", "").replace("</p>", "");
        return _markDownHtml;

    },

    render: function () {
        return (
            <DataListingTable data={this.getAlertHistoryData(this.state.alertHistoryItem)}/>
        );
    }
});

export default AlertHistoryListItem;
