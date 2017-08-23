import React from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';
import WatchFlag from './WatchFlag';

// grommet components
import Box from 'grommet/components/Box';
import Title from 'grommet/components/Title';
import Heading from 'grommet/components/Heading';
import Layer from 'grommet/components/Layer';
import Tiles from 'grommet/components/Tiles';
import Tile from 'grommet/components/Tile';
import Headline from 'grommet/components/Headline';
import Anchor from 'grommet/components/Anchor';
// icons

import utilities from '../utils/utilities';

var WatchListItem = React.createClass({
	getInitialState: function () {
		const shipToName = (<FormattedMessage id="cpx_watchlist_shipto" defaultMessage="Ship To" />),
			status = (<FormattedMessage id="cpx_watchlist_status" defaultMessage="Status:" />),
			poNumber = (<FormattedMessage id="cpx_watchlist_poNumber" defaultMessage="P.O. No.:" />),
			hpeOrderNumber = (<FormattedMessage id="cpx_watchlist_hpeOrderNumber" defaultMessage="HPE Order No.:" />),
			plannedShipDate = (<FormattedMessage id="cpx_watchlist_plannedShipDate" defaultMessage="Ship Complete:" />),
			plannedDeliveryDate = (<FormattedMessage id="cpx_watchlist_plannedDeliveryDate" defaultMessage="Date Shipped:" />),
			orderDeliveredDate = ( <FormattedMessage id="order_dateDelivered" defaultMessage="Date Delivered" /> ),
			previousDate = (<FormattedMessage id="cpx_watchlist_previousDate" defaultMessage="Previously" />),
			flagOn = true;

		return {
			'shipToName': shipToName,
			'status': status,
			'poNumber': poNumber,
			'hpeOrderNumber': hpeOrderNumber,
			'plannedShipDate': plannedShipDate,
			'plannedDeliveryDate': plannedDeliveryDate,
			'orderDeliveredDate': orderDeliveredDate,
			'previousDate': previousDate,
			'flagOn': flagOn
		};
	},

	applyPadding: function (text) {
		return text.toString().length == 1 ? '0' + text : text
	},

	determineDate: function() {
		var previousDateData, dateToDisplay; //deliveryDateData, shipDateData,
		var displayPlannedShipDate = false, displayShipDate = false, displayOrderDeliveredDate = false;
		var orderStatus = this.props.watchlistData.orderStatus;
		var shipmentStatus = this.props.watchlistData.shipmentStatus;
		switch(orderStatus){
			case "Accepted": 
				displayOrderDeliveredDate = displayShipDate = false;
				displayPlannedShipDate = (shipmentStatus == "Nothing Shipped" || shipmentStatus == "Partially Shipped");
				break;
			case "Delivered":
				displayShipDate = displayPlannedShipDate = false;
				displayOrderDeliveredDate = (shipmentStatus == "Fully Shipped");
				break;
			case "Production":
				displayOrderDeliveredDate = displayShipDate = false;
				displayPlannedShipDate = (shipmentStatus == "Nothing Shipped" || shipmentStatus == "Partially Shipped");
				break;
			case "Shipped to Customer":
				displayOrderDeliveredDate = displayPlannedShipDate = false;
				displayShipDate = (shipmentStatus == "Fully Shipped");
				break;
			case "Submitted":
				displayOrderDeliveredDate = displayShipDate = false;
				displayPlannedShipDate = (shipmentStatus == "Nothing Shipped");
				break;
			case "Canceled":
				displayOrderDeliveredDate = displayShipDate = displayPlannedShipDate = false;
				break;
			default: 
				displayOrderDeliveredDate = displayShipDate = displayPlannedShipDate = false;
				break;
		}

		if (displayPlannedShipDate) {
			if (this.props.watchlistData.previousPlannedShipDate) {
				previousDateData = <span className="italic">({this.state.previousDate}&nbsp;{utilities.formatDate(this.props.watchlistData.previousPlannedShipDate)}) </span>
			}
			dateToDisplay = <span><span className="labelSize">{this.state.plannedShipDate}&nbsp;</span>
				<span className="blod">{utilities.formatDate(this.props.watchlistData.plannedShipDate ? this.props.watchlistData.plannedShipDate : "TBD")} </span>
				{previousDateData}</span>
		}
		
		if (displayShipDate) {
			dateToDisplay = <span><span className="labelSize">{this.state.plannedDeliveryDate}&nbsp;</span>
				<span className="blod"> {utilities.formatDate(this.props.watchlistData.shipDate ? this.props.watchlistData.shipDate : "TBD")} </span>
				</span>
		}

		if (displayOrderDeliveredDate) {
			dateToDisplay = <span><span className="labelSize">{this.state.orderDeliveredDate}&nbsp;</span>
				<span className="blod"> {utilities.formatDate(this.props.watchlistData.deliveryDate ? this.props.watchlistData.deliveryDate : "TBD")} </span>
				</span>
		}

		return dateToDisplay;
	},

	render: function () {

		var flag = (this.state.flagOn) ? "img/icons/flagged.png" : "img/icons/flag_grey.png";
		var visibleDate = this.determineDate();

		var that = this;
		return (
			<Box className="list-item-border" direction="column" colorIndex="light-1" pad="medium" separator="bottom" justify="between" responsive={false}>
				<Box direction="row" colorIndex="light-1" pad="none" justify="start" responsive={false} onClick={this.props.onWatchListClick}>
					<span className="labelSize elip">{this.state.shipToName}:</span>
					<span className="blod">{""}</span>
					<span className="labelSize elip">{this.state.status}&nbsp;</span>
					<span className="blod elip">{this.props.watchlistData.shipmentStatus && this.props.watchlistData.shipmentStatus == "Partially Shipped"  ? "Multiple" : this.props.watchlistData.orderStatus}</span>
				</Box>
				<Box direction="row" colorIndex="light-1" pad="none" justify="between" responsive={false} >
					<Box onClick={this.props.onWatchListClick} className="searchShipToName">
						<Title responsive={false} justify="between" >
							<Heading tag="h3" strong={true} margin="none" className="alert-label elip">{this.props.watchlistData.ship_to_name}</Heading>
						</Title>
					</Box>
					<Box><WatchFlag flagOn={true} unwatchItem={this.props.toggleFlag} qtcuid={this.props.watchlistData.qtcuid} /></Box>
				</Box>
				<Box direction="row" colorIndex="light-1" pad="none" justify="start" responsive={false} onClick={this.props.onWatchListClick}>
					<div className="searchPoValue elip">
						<span className="labelSize">{this.state.poNumber}&nbsp;</span>
						<span className="blodOrderList">{this.props.watchlistData.poNum}</span>
					</div>
					<div className="hpeValueSize space">
						<span className="labelSize">{this.state.hpeOrderNumber}&nbsp;</span>
						<span className="blodOrderList">{this.props.watchlistData.orderId}</span>
					</div>
				</Box>
				<Box direction="row" colorIndex="light-1" pad="none" justify="between" responsive={false} onClick={this.props.onWatchListClick}>
					{visibleDate}
				</Box>
			</Box>

		);
	}
});

export default WatchListItem;

//<WatchListItem orderData={orderData[0].order_list[0]} />
