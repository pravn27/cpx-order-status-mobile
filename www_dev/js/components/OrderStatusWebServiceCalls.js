// Quick and dirty web service calls that can be pulled into the views, or 
// made into an API.  All calls are tested to work and return expected data.
// Note that filter parameters do not use symbols, but use the English equivalent. 

import React, { Component } from 'react';
import Rest from 'grommet/utils/Rest';

var apiUrl = "http://hanahet-ent.sapnet.hpecorp.net:8000/odata/cpx/ams/v1/myorders.xsodata/ordersummary?$format=json&";

export default class OrderStatus extends Component {
	
	constructor() {
		super();
		this.state = {
			data: []
		};
	}
	
	componentDidMount() {
		// Example service calls
		//this._getOrderSummary("LL8");
		//this._getOrdersByOrderStatus("LL8","OPENSTATUS");
		this._getOrderDetails("DCMTKAN7666")
	}
	
	// Get the orders summary data for a user.  User is currently hard coded, but
	// will eventually be cross referenced from the user login.  This is used in the 
	// first screen, for Open, Closed, Delayed, etc orders.
	_getOrderSummary(ssid) {
		var queryString = encodeURI("$filter=SALESREPID eq '" + ssid + "' and SEARCHPERIOD lt 120&$select=OPENQTY,PARTIALQTY,CLOSEDQTY,HOLDQTY");
		var url = apiUrl + queryString;
		var auth = this._getBasicAuth();
		Rest.setHeader("Authorization", auth);
		Rest.get(url)
			.end(this._onOrderSummaryResponse);
	}
	
	// Need to add error handling, etc to all of these 
	_onOrderSummaryResponse(err, result) {
		var res = result.body.d;
	}
	
	// Get orders for a given order status and (Open) ofr the given user.  Order status 
	// is passed by touching the a summary line on the summary screen and will need to be 
	// interpreted.  Status' are OPENSTATUS, PARTIALSTATUS, CLOSEDSTATUS, and HOLDSTATUS
	_getOrdersByOrderStatus(ssid, orderStatus) {
		var queryString = encodeURI("$filter=SALESREPID eq '" + ssid + "' and SEARCHPERIOD lt 120&" + orderStatus + " eq 'Y'&$select=POID,CUSTNAME");
		var url = apiUrl + queryString;
		var auth = this._getBasicAuth();
		Rest.setHeader("Authorization", auth);
		Rest.get(url)
			.end(this._onOrderStatusResponse);
	}
	
	_onOrderStatusResponse(err, result) {
		var res = result.body.d;
	}
	
	// Get the details for a specific order, takes the poid value from the OrdersByOrderStatus list
	_getOrderDetails(poid) {
		var queryString = encodeURI("$filter=POID eq '" + poid + "'");
		var url = apiUrl + queryString;
		var auth = this._getBasicAuth();
		Rest.setHeader("Authorization", auth);
		Rest.get(url)
			.end(this._onOrderDetailResponse);
	}
	
	_onOrderDetailResponse(err, result) {
		var res = result.body.d;
	}
	
	_getBasicAuth() {
		var var1 = "SRVC_CPX";
    	var var2 = "HET@ServiceAc1";
  	  	var tok = var1 + ':' + var2;
  	  	var hash = btoa(tok);
  	  	return "Basic " + hash;
	}
	
	render () {
	
		return (

		);
	}
};