import React from 'react';
import ReactDOM from 'react-dom';

// grommet components
import Anchor from 'grommet/components/Anchor';

// utils
import { FormattedMessage } from 'react-intl';
import IconHelper from './IconHelper';
import Utils from '../utils/utilities';
import { getCurrentLocale } from 'grommet/utils/Locale';

// redux stuffs
import { connect } from 'react-redux';
import { emailNotAvailable } from '../actions/userActions';

const locale = getCurrentLocale();
let messages;
try {
    messages = require(`../../messages/${locale}`);
} catch (e) {
    messages = require('../../messages/en-US');
}

// redux stuff again
const
  mapStateToProps = (state) => {
    return {state};
  },
  mapDispatchToProps = (dispatch, ownProps) => ({
    triggerEmailNotAvailablePopup: () => {
      dispatch(emailNotAvailable());
    }
  });


var OrderDetailsSharing = React.createClass({
  getShipStatusLabel: function(status) {
    if (status === "Fully Shipped" || status === "Delivered")
      return messages.order_shipShipped;
    else
      return messages.order_shipShippedComplete;
  },
  getDelvStatusLabel: function(status) {
    if (status === "Delivered")
      return messages.order_dateDelivered;
    else
      return messages.order_deliveryComplete;
  },
  buildAddrLine(addr) {
    if(addr && addr.trim().length > 0)
      return addr + " <br/>";
  else
    return "";
  },
  populateEmailBody: function() {
    var order = this.props.order.orderDetails;
    var emailBody = "";

    // end customer
    emailBody += messages.order_shipTo+ ": <br>" + order.customer_name + "<br><br>";

    // hpe order, po number
    emailBody += messages.order_oder + ": " + order.order_no + "<br>";
    emailBody += messages.order_Po + ": " + order.purchase_order_no + "<br><br>";

    // order summary
    emailBody += messages.order_status_item_label + " <br>" + order.order_status + "<br><br>";

    if(order.order_status != "Canceled" && order.order_status != "Cancelled") {

      // date shipped/ship complete
      emailBody += this.getShipStatusLabel(order.ship_status) + ": ";
      emailBody += Utils.getOverallDate("ship", order);
      emailBody += order.order_status != "Delivered" && order.ship_status != "Fully Shipped" &&	
        order.previous_planned_ship_date && order.previous_planned_ship_date != order.planned_ship_date 
        ? " (" + messages.order_search_previous_label + " " + Utils.formatDate(order.previous_planned_ship_date) + ")"
        : "";
      emailBody += "<br><br>";

      // date delivered/delivery complete
      emailBody += this.getDelvStatusLabel(order.ship_status) + ": ";
      emailBody += Utils.getOverallDate("delv", order);
      emailBody += order.order_status != "Delivered" && 
        (order.previous_planned_delv_date && order.previous_planned_delv_date != order.planned_delv_date) 
        ? " (" + messages.order_search_previous_label + " " + Utils.formatDate(order.previous_planned_delv_date) + ")"
        : "";
      emailBody += "<br><br>";

      emailBody += messages.ship_info_label + " <br><br>";

      // ship to
      emailBody += messages.ship_To + ": <br>";
      emailBody += this.buildAddrLine(order.ship_to_addr[1]);
      emailBody += this.buildAddrLine(order.ship_to_addr[2]);
      emailBody += this.buildAddrLine(order.ship_to_addr[3]);
      emailBody += this.buildAddrLine(order.ship_to_addr[4]);
      emailBody += this.buildAddrLine(order.ship_to_addr[5]);
      emailBody += this.buildAddrLine(order.ship_to_addr[6]);
      emailBody += "<br>";

      // item not yet shipped
      if(this.props.itemsNotYetShipped.length <= 0) {
        emailBody += messages['Items Not Yet Shipped'] + ": <br><br>";
        if(order.ship_status == "Delivered")
          emailBody += messages.all_item_delivered + " <br><br>";
        else
          emailBody += messages.all_item_shipped + " <br><br>";
      }
      else {
        emailBody += messages['Items Not Yet Shipped'] + ": <br><br>";
        var itemNotYetShipped;
        for(var i=0; i<this.props.itemsNotYetShipped.length; i++) {
          itemNotYetShipped = this.props.itemsNotYetShipped[i];
          emailBody += messages.order_productName + ": <br>";
          emailBody += itemNotYetShipped.product_name + " <br>";
          emailBody += messages.order_productId + ": " + itemNotYetShipped.product_no + " <br>";
          emailBody += messages['Quantity'] + ": " + itemNotYetShipped.order_qty + " <br>";
          emailBody += messages.order_shipComplete + ": " + Utils.formatDate(itemNotYetShipped.planned_ship_date) + " <br>";
          emailBody += messages.order_status_item_label + ": " + itemNotYetShipped.item_status + " <br><br>";
        }
      }

      // shipped items
      if(this.props.shippedItems.length <= 0) {
        if(order.ship_status == "Delivered") {
          emailBody += messages['Shipped Items'] + ": <br><br>";
          emailBody += messages.all_item_delivered + " <br><br>";
        }
      }
      else {
        emailBody += messages['Shipped Items'] + ": <br><br>";
        var shipment, shippedItem;
        for(var i=0; i<this.props.shippedItems.length; i++) {
          shipment = this.props.shippedItems[i];
          emailBody += messages.order_shipment + " " + (i+1) + ": <br>";
          emailBody += messages['Delivery Date'] + ": " + Utils.formatDate(shipment.date) + "<br>";
          emailBody += messages.order_carrier + ": " + shipment.carrier_name + "<br>";
          emailBody += messages.order_tracking + ": " + shipment.tracking_no + "<br><br>";

          for(var j=0; j<shipment.productList.length; j++) {
            shippedItem = shipment.productList[j];
            emailBody += messages.order_productName + ": <br>";
            emailBody += shippedItem.product_name + " <br>";
            emailBody += messages.order_productId + ": " + shippedItem.product_no + " <br>";
            emailBody += messages['Quantity'] + ": " + shippedItem.order_qty + " <br>";
            emailBody += messages.order_status_item_label + ": " + shippedItem.item_status + " <br><br>";
          }
        }
      }

      // delivered items
      if(this.props.deliveredItems.length > 0) {
        emailBody += messages.order_delivered_items + ": <br><br>";
        var delv, deliveredItem;
        for(var i=0; i<this.props.deliveredItems.length; i++) {
          delv = this.props.deliveredItems[i];
          emailBody += messages.order_shipment + " " + (i+1) + ": <br>";
          emailBody += messages.order_dateDelivered + ": " + Utils.formatDate(delv.date) + "<br>";
          emailBody += messages.order_carrier + ": " + delv.carrier_name + "<br>";
          emailBody += messages.order_tracking + ": " + delv.tracking_no + "<br><br>";

          for(var j=0; j<delv.productList.length; j++) {
            deliveredItem = delv.productList[j];
            emailBody += messages.order_productName + ": <br>";
            emailBody += deliveredItem.product_name + " <br>";
            emailBody += messages.order_productId + ": " + deliveredItem.product_no + " <br>";
            emailBody += messages['Quantity'] + ": " + deliveredItem.order_qty + " <br>";
            emailBody += messages.order_status_item_label + ": " + deliveredItem.item_status + " <br><br>";
            
          }
        }
      }
    }

    return emailBody;
  },
	shareEmail: function() {
    var emailBody = this.populateEmailBody();
      cordova.plugins.email.isAvailable( (isAvailable) => {
        if(isAvailable) {
          cordova.plugins.email.open({
            subject: messages.share_subject,
            body: emailBody,
            isHtml: true
          });
        }
        else
          this.props.triggerEmailNotAvailablePopup();
      });
	},
	render: function() {
		return (
      <Anchor onClick={this.shareEmail}>
        <IconHelper iconName="Mail" />
      </Anchor>
		);
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailsSharing);