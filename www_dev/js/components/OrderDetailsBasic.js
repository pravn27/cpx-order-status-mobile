import React from 'react';
import { FormattedMessage } from 'react-intl';

// Grommet components
import Box from 'grommet/components/Box';
import Table from 'grommet/components/Table';
import Heading from 'grommet/components/Heading';

// Utils
import DataListingTable from '../utils/DataListingTable';
import utilities from '../utils/utilities';
import { MultipleShipments, PreviousDate } from '../utils/commonComponents';

const labels = {
	shipTo: (<FormattedMessage id="order_shipTo" defaultMessage="Ship To" />),
	orderNo: (<FormattedMessage id="order_oderNo" defaultMessage="HPE Order No." />),
	poNo: (<FormattedMessage id="order_PoNo" defaultMessage="P.O. No." />),
	shipShippedComplete: (<FormattedMessage id="order_shipShippedComplete" defaultMessage="Ship Complete" />),
	shipShipped: (<FormattedMessage id="order_shipShipped" defaultMessage="Date Shipped" />),
	deliveryComplete: (<FormattedMessage id="order_deliveryComplete" defaultMessage="Delivery Complete" />),
	dateDelivered: (<FormattedMessage id="order_dateDelivered" defaultMessage="Date Delivered" />)
};

export default class OrderDetailsBasic extends React.Component {
	constructor() {
		super();
	}

	isNewDate(alerts, message) {
		return alerts.some((a) => {
			return a.isNew && a.message.toLowerCase().includes(message);
		});
	}
	//Edit to display proper label by adding 2 conditions
	getShipStatusLabel(status) {
		if (status === "Fully Shipped" || status === "Delivered") {
			return labels.shipShipped;
		}
		else {
			return labels.shipShippedComplete;
		}
	}

	getDelvStatusLabel(status) {
		if (status === "Delivered") {
			return labels.dateDelivered;
		}
		else {
			return labels.deliveryComplete;
		}
	}

	render() {
		const { orderDetails, alertList } = this.props.order;

		const label_shipStatus = this.getShipStatusLabel(orderDetails.ship_status);
		const label_delvStatus = this.getDelvStatusLabel(orderDetails.order_status);
		const isNewShipDate = this.isNewDate(alertList.list, "new ship complete date");
		const isNewDeliveryDate = this.isNewDate(alertList.list, "new delivery complete date");

		let listingData = [{
			label: labels.orderNo,
			value: orderDetails.order_no
		}, {
			label: labels.poNo,
			value: orderDetails.purchase_order_no
		}];

		var hideOrderDetailsPrevDate = true; //CR 292030 -- Hidden intentionally!
		if (orderDetails.order_status != "Canceled" && orderDetails.order_status != "Cancelled") {
			if (orderDetails.order_status == 'Shipped to Customer') {
				listingData.push({
					label: label_shipStatus,
					value: (
						<Box direction="row" style={{ 'display': 'inline-table' }}>
							<span className={isNewShipDate ? "bold" : ""}> {utilities.formatDate(orderDetails.overall_ship_date)} </span>
						</Box>
					)
				});
			} else {
				listingData.push({
					label: label_shipStatus,
					value: (
						<Box direction="row" style={{ 'display': 'inline-table' }}>
							<span className={isNewShipDate ? "bold" : ""}> {utilities.getOverallDate("ship", orderDetails)} </span>
							{orderDetails.order_status != "Delivered" && orderDetails.ship_status != "Fully Shipped" &&
								orderDetails.previous_planned_ship_date && orderDetails.previous_planned_ship_date != orderDetails.planned_ship_date ?
								<PreviousDate date={utilities.formatDate(orderDetails.previous_planned_ship_date)} /> : null}
						</Box>
					)
				});
			}
			listingData.push({
				label: label_delvStatus,
				value: (
					<Box direction="row" style={{ 'display': 'inline-table' }}>
						<span className={isNewDeliveryDate ? "bold" : ""}>{utilities.getOverallDate("delv", orderDetails)} </span>
                            {(orderDetails.order_status != "Delivered" &&
								(orderDetails.previous_planned_delv_date && orderDetails.previous_planned_delv_date != orderDetails.planned_delv_date) ?
								<PreviousDate date={utilities.formatDate(orderDetails.previous_planned_delv_date)} /> : null)}
					</Box>
				)
			});
		}

		if (orderDetails.ship_status === "Partially Shipped" || orderDetails.shipments.length > 1) {
			listingData.push({ label: '', value: <MultipleShipments /> });
		}

		return (
			<Box style={{ marginTop: '4px' }} >
				<Table className="data-listing-table">
					<tbody>
						<tr>
							<td className="display-block">{labels.shipTo}:</td>
							<td className="display-block"><Heading style={{ 'font-size': '24px', 'marginTop': '3%', 'marginBottom': '3%' }} strong={true} align="start">{orderDetails.ship_to_address_1}</Heading></td>
						</tr>
					</tbody>
				</Table>
				<DataListingTable data={listingData} />
			</Box>
		);
	}
}
