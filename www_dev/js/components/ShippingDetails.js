import React from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';


// grommet components
import Box from 'grommet/components/Box';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import Accordion from 'grommet/components/Accordion';
import AccordionPanel from 'grommet/components/AccordionPanel';
import DataListingTable from '../utils/DataListingTable';
import utilities from '../utils/utilities';

import CommonAccordion from './CommonAccordion';


//separating the logic out for the watch flag. Need code to add into the component to communicate with the backend.

const labels = {
	ship_To : ( <FormattedMessage id="ship_To" defaultMessage="Ship To" /> ),
	ship_info_label : ( <FormattedMessage id="ship_info_label" defaultMessage="Shipping Information" /> )
};




var ShippingDetails = React.createClass({
  getInitialState: function() {
	const flagOn = false
    return {
	  'flagOn': flagOn
    };
  },
  buildAddrLine(addr) {
  	if(addr && addr.trim().length > 0)
	  	return (<span>{addr} <br/></span>);
	else
	 	return null;
  },
  getShippingDetails(order) {
	const val = (
		<span>
			{this.buildAddrLine(order.orderDetails.ship_to_address_1)}
			<div className="shipping-information-separator"></div>
			{this.buildAddrLine(order.orderDetails.ship_to_addr[1])}
			{this.buildAddrLine(order.orderDetails.ship_to_addr[2])}
			{this.buildAddrLine(order.orderDetails.ship_to_addr[3])}
			{this.buildAddrLine(order.orderDetails.ship_to_addr[4])}
			{this.buildAddrLine(order.orderDetails.ship_to_addr[5])}
		</span>
	);
	
	return [
	  {label: labels.ship_To, value: val }
	];
  },
  
  
  render: function() {
	  
	  if(this.props.order.orderDetails.order_status=='Canceled'){
			//do not return back a component.
			return (null);
	  }
	  else{
		return (
		<CommonAccordion active={0} heading={labels.ship_info_label}>
			<Box margin={{horizontal:'medium'}}>
				<DataListingTable data={this.getShippingDetails(this.props.order)} pad={{vertical:'medium'}} />
			</Box>
        </CommonAccordion>			  
		);
	  }
	  
	
  }
});

export default ShippingDetails;
//<ShippingDetails order={orderData}/>
