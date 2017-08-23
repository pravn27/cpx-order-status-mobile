import React from 'react';
import ReactDOM from 'react-dom';

// grommet components
import Box from 'grommet/components/Box';
import Table from 'grommet/components/Table';
import Label from 'grommet/components/Label';

// utils
import { FormattedMessage } from 'react-intl';
import DataListingTable from '../utils/DataListingTable';
import Utilities from '../utils/utilities';

const labels = {
	product_name: (<FormattedMessage id={"Product Name"} defaultMessage={"Product Name"} />),
	item_no: (<FormattedMessage id={"Product Id"} defaultMessage={"Product ID"} />),
	order_qty: (<FormattedMessage id={"Open Quantity"} defaultMessage={"Open Quantity"} />),
	planned_ship_date: (<FormattedMessage id={"Planned Ship Date"} defaultMessage={"Ship Complete"} />),
	item_status: (<FormattedMessage id={"Order Status"} defaultMessage={"Order Status"} />)
};

var ItemNotShippedListItem = React.createClass({
	getInitialState: function() {
		return {
      itemNotYetShipped: this.props.item
    };
	},
	getProductData(product) {
		var plannedShipDateText = (<strong>{ (product.planned_ship_date ? Utilities.formatDate(product.planned_ship_date) : "TBD") }</strong>);
		var orderListItems = [
			{label: labels.product_name, value: product.product_name},
			{label: labels.item_no, value: product.product_no},
			{label: labels.order_qty, value: product.order_qty},
			{label: labels.item_status, value: product.item_status} 
		];
		if (!(product.item_status === 'Canceled' || product.item_status === 'Cancelled'))
			orderListItems.splice(3, 0, {label: labels.planned_ship_date, value: plannedShipDateText});
		
		return orderListItems;
	},
	render: function() {
		return (
      <DataListingTable data={this.getProductData(this.state.itemNotYetShipped)} pad={{vertical:'medium'}} />
		);
	}
});

export default ItemNotShippedListItem;

// Implementation Note

// Properties needed:
//   1 data
//       The individual itemNotYetShipped details, please loop and pass the individual object to this component
//   2 plannedDeliveryDate
//       The planned delivery date, because from swagger spec v2, it is not included in the itemNotYetShipped object, it is outside of it

// Example
//   import ItemNotShippedListItem from 'ItemNotShippedListItem';
//   [Loop the notShippedProductList *check swagger spec v1] {
//     <ItemNotShippedListItem data={[itemNotYetShipped Details]} plannedDeliveryDate={[plannedDeliveryDate]} >
//   }
