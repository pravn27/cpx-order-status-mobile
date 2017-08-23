import React from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';


// grommet components
import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import Title from 'grommet/components/Title';
import Heading from 'grommet/components/Heading';
import Layer from 'grommet/components/Layer';
import Tiles from 'grommet/components/Tiles';
import Tile from 'grommet/components/Tile';
import Headline from 'grommet/components/Headline';
import Close from 'grommet/components/icons/base/Close';

//Markdown
var showdown = require('showdown');


var RateThisAppListItem = React.createClass({
	getInitialState: function () {
		const alert_item_order_text = (<FormattedMessage id="alert_item_order_text" defaultMessage="Order" />),
			alert_end_customer_text = (<FormattedMessage id="alert_end_customer_text" defaultMessage="End Customer:" />),
			alert_item_days = (<FormattedMessage id="alert_item_days_text" defaultMessage="day(s) ago" />),
			alert_item_hours_text = (<FormattedMessage id="alert_item_hours_text" defaultMessage="hour(s) ago" />),
			alert_item_minutes = (<FormattedMessage id="alert_item_minutes_text" defaultMessage="minutes ago" />),
			alert_rate_text = (<FormattedMessage id="alert_rate_text" defaultMessage="Rate this app" />);

		return {
			'alert_item_order_text': alert_item_order_text,
			'alert_end_customer_text': alert_end_customer_text,
			'alert_item_days': alert_item_days,
			'alert_item_hours_text': alert_item_hours_text,
			'alert_item_minutes': alert_item_minutes,
			'alert_rate_text': alert_rate_text,
			'alert_item_no': 0
		};
	},

	applyMarkDown: function (text) {
		var converter = new showdown.Converter();
		var _markDownHtml = converter.makeHtml(text).replace("<p>", "").replace("</p>", "");
		return _markDownHtml;

	},

	applyCss: function (objectId) {
		var cssName = objectId != "" ? "list-item-border" : "list-item-feedback-border";
		return cssName;
	},

	render: function () {
		var alertIssuedMinutes;
		var alertDateTimeStamp = this.props.alertDateTimeStamp;
		var orderNumber = this.props.orderNumber;
		var orderStatus = this.props.orderStatus;
		var alertOrder, alertCustomerName;

		var today = (new Date()).toISOString();
		alertIssuedMinutes = parseInt((new Date(today) - new Date(alertDateTimeStamp)) / (1000 * 60));

		var alertTimeRange = this.state.alert_item_minutes;
		if ((alertIssuedMinutes / (60 * 24)) > 1) {
			alertTimeRange = this.state.alert_item_days;
			alertIssuedMinutes = alertIssuedMinutes / (60 * 24);
		}
		else {
			if ((alertIssuedMinutes / (60)) > 1) {
				alertTimeRange = this.state.alert_item_hours_text;
				alertIssuedMinutes = alertIssuedMinutes / (60);
			}
			else {
				//else it takes minutes by default	
				alertTimeRange = this.state.alert_item_minutes;
			}

		}

		alertIssuedMinutes = Math.floor(alertIssuedMinutes);

		return (

			<Box direction="row" colorIndex="light-1" pad="medium" justify="between" responsive={false} className={this.applyCss(this.props.objectId)} >
				<Box direction="row" colorIndex="light-1" align="stretch" pad="none" justify="between" responsive={false} flex="grow" className="background-color-transparent" onClick={this.props.onAlertClick}   >
					<Box className="background-color-transparent" style={{"width":"100%"}}>
						<Box direction="row" colorIndex="light-1" pad="none" justify="between" responsive={false} className="background-color-transparent">
							<Title responsive={false} justify="between">
								<Box basis="3/4" direction="row" colorIndex="light-1" pad="none" justify="between" responsive={false} className="background-color-transparent" full="horizontal">
									<Heading className="alerts-text" margin="none" strong={false} align="start" dangerouslySetInnerHTML={{ __html: this.applyMarkDown(this.props.alertTitle) }} >
									</Heading>
								</Box>
								<Box basis="1/4" direction="row" colorIndex="light-1" pad="none" justify="between" responsive={false} className="background-color-transparent" full="horizontal">
									<Heading className="alerts-sub-text" margin="none" strong={false} align="start">
										{alertIssuedMinutes} {alertTimeRange}
									</Heading>
								</Box>
							</Title>
						</Box>
						<Box direction="row" colorIndex="light-1" pad="none" justify="between" responsive={false} wrap={true} className="background-color-transparent" full={false} >
							<Box responsive={false} justify="between" wrap={true} basis="3/4">
								<Heading className="alerts-text" margin="none" align="start" dangerouslySetInnerHTML={{ __html: this.applyMarkDown(this.props.alertMessage) }}>
								</Heading>
							</Box>
						</Box>
					</Box>
				</Box>
				<Box direction="row" colorIndex="light-1" pad="small" justify="end" responsive={false} align="center" className="background-color-transparent" style={{paddingLeft:12,paddingRight:12}}>
					<Anchor onClick={this.props.onClear}>	<img src="img/icons/clear.png" height="18" width="18" /> </Anchor>
				</Box>
			</Box >


		);
	}
});

export default RateThisAppListItem;

