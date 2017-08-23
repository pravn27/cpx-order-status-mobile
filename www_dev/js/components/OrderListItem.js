import React from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// grommet components
import Box from 'grommet/components/Box';
import Title from 'grommet/components/Title';
import Heading from 'grommet/components/Heading';
import Layer from 'grommet/components/Layer';
import Tiles from 'grommet/components/Tiles';
import Tile from 'grommet/components/Tile';
import Headline from 'grommet/components/Headline';
import Anchor  from 'grommet/components/Anchor';
import WatchFlag from './WatchFlag';
import { formatDate } from '../utils/utilities';
import { removeWatchList } from '../actions/watchListActions';

//import OrderDetailsPage from './OrderDetailsPage';
// icons

// Utils
// ############################################################
/*const getFormattedStatusText = (order) => {
	var finalStatus = order.status;

	
	if (order.multiShipments) {// Checks if status is "Multiple"

		var tmpStatus = order.shipmentList[0].status;
		for (var index = 1; index < order.shipmentList.length; index++) {
			if (tmpStatus !== order.shipmentList[index].status) {
				finalStatus = "Multiple";
				break;
			}
		}
	}

	return ( <FormattedMessage id={finalStatus} defaultMessage={finalStatus} /> );
};*/

const assetType = 'com.hpe.prp.cpx.model.Order';
const mapDispatchToProps = (dispatch) => ({
    watchListActions: bindActionCreators({ removeWatchList }, dispatch)
});

var OrderListItem = React.createClass({
  getInitialState: function() {
    const order_item_text = ( <FormattedMessage id="order_search_item_text" defaultMessage="Ship To" /> ),
    order_po_text = ( <FormattedMessage id="order_search_po_text" defaultMessage="P.O.No." /> ),
    order_hpe_no_text = ( <FormattedMessage id="order_search_hpe_no_text" defaultMessage="HPE Order No." /> ),
    order_status_item_label = ( <FormattedMessage id="order_search_status_item_label" defaultMessage="Status" /> ),
	order_shipComplete_label = ( <FormattedMessage id="order_search_shipComplete_label" defaultMessage="Ship Complete" /> ),
    order_dateShipped_label = ( <FormattedMessage id="order_search_dateShipped_label" defaultMessage="Date Shipped" /> ),
    order_dateDelivered_label = ( <FormattedMessage id="order_dateDelivered" defaultMessage="Date Delivered" /> ),
	order_previous_label = (<FormattedMessage id="order_search_previous_label" defaultMessage="Previously" /> )
    return {
      'order_item_text' : order_item_text,
      'order_po_text': order_po_text,
      'order_hpe_no_text': order_hpe_no_text,
      'order_status_item_label' : order_status_item_label,
	  'order_shipComplete_label' : order_shipComplete_label,
      'order_dateShipped_label' : order_dateShipped_label,
      'order_dateDelivered_label': order_dateDelivered_label,
	  'order_previous_label' : order_previous_label,
	  flagOn: this.props.orderData.inWatchList
    };
  },
  
  /*
    g	Items Not Yet Shipped -> plannedShipDate -> TBD
    a	Partially Shipped Items -> plannedShipDate -> TBD
    b	Partially Shipped Partially Delivered -> plannedShipDate -> TBD
    c	Fully Shipped Not Yet Delivered -> shipDate -> TBD
    d	Fully Shipped Partially Delivered -> shipDate -> TBD
    e	Fully Shipped Fully Delivered -> deliveryDate -> TBD
    f	Cancelled Status -> hide
    
                Nothing Shipped	Partially Shipped	Fully Shipped
    Submitted	g	            a	                ???
    Accepted	g	            a	                NA
    Production	g	            a	                NA
    Shipped     NA    	 	    ???                 c, d
    Delivered	NA 	            b	                e 
    Canceled	f	 	        NA                  NA
  */
  
  _getDate() {
    var orderStatus  = this.props.orderData.orderStatus;
    var shipStatus = this.props.orderData.shipmentStatus;    
    var returnDates = {date: null, previousDate: null, label: null};
    if ( ! orderStatus) {
        returnDates.date = this.props.orderData.plannedShipDate;
        returnDates.previousDate = this.props.orderData.previousPlannedShipDate;
    }
    if( orderStatus == "Submitted" || orderStatus == "Accepted" || orderStatus == "Production" ) {
        returnDates.date = this.props.orderData.plannedShipDate;
        returnDates.previousDate = this.props.orderData.previousPlannedShipDate;
    }
    if ( orderStatus.indexOf("Shipped") != -1) {
        if( shipStatus == "Fully Shipped") {
            returnDates.date = this.props.orderData.shipDate;
        } else {
            returnDates.date = this.props.orderData.plannedShipDate;
        }
    } 
    if ( orderStatus == "Delivered"   ) {
        if( shipStatus == "Fully Shipped") {
            returnDates.label = this.state.order_dateDelivered_label;
            returnDates.date = this.props.orderData.deliveryDate;
        } else {
            returnDates.date = this.props.orderData.plannedShipDate;
        }
    }
    return returnDates;
    // if orderStatus is Canceled, hide the label
  },
  
  toggleFlag: function(src){
	if (this.state.flagOn) {
		this.setState({flagOn: false});
	} else {
		this.setState({flagOn: true});
	}
  },

  //TODO orderlist go to order detail page
  handleOrderDetailPage: function(e){
    // click search result
    ADB.trackAction('e.searchResultClick', {'qtcuid' : this.props.orderData.qtcuid, 'searchType' : this.props.parentSearchType});
  	hashHistory.push('/orderdetails/'+this.props.orderData.qtcuid);
  },

   deleteItem: function (assetId) {
        let { watchListActions } = this.props;
        watchListActions.removeWatchList(assetId, assetType);
    },

  render: function() {

	var flag =  this.state.flagOn ? <img src='img/icons/flagged.png' height="23" width="24"/> : <img src='img/icons/flag_grey.png' height="23" width="24"/>;
	var alertOn = (this.props.orderData.new_alert_num>0)?<img src='img/icons/triangle.png' height="24" width="24"/>:'';
    var searchDates = this._getDate();
    var shipComplete = searchDates.date;
	var previousDateContent = searchDates.previousDate ? <span className="italic" >({this.state.order_previous_label}&nbsp;{formatDate(searchDates.previousDate) || 'TBD'})&nbsp;&nbsp;</span>: '';
    var poNum = this.props.orderData.poNum;
    //if ( poNum && poNum.length > 12) {
    //    poNum = poNum.substring(0,12) + "...";
    //}
    
    var dateDiv = '';
    if (this.props.orderData.orderStatus == "Canceled" || this.props.orderData.orderStatus == "Cancelled") {
        //if Canceled, hide the date row

        //CR298267 "Cancelled item in search results has an extra space 
        //this set empty space on the row so that no extra space causing by missing row.
        dateDiv = <span className="labelSize">&nbsp;</span>; 
    } else {
        //if shipStatus is Fully Shipped, then label is Date Shipped; or it is Ship Complete
        if(this.props.orderData.shipmentStatus == "Fully Shipped" ) {
            dateDiv = <Box direction="row" colorIndex="light-1" pad="none" justify="start" responsive={false} onClick={this.handleOrderDetailPage}>
				<span className="labelSize">{searchDates.label||this.state.order_dateShipped_label}:&nbsp;</span>
				<span className="blodNoWidth">{formatDate(shipComplete) || 'TBD'}&nbsp;</span>
                {this.props.orderData.orderStatus!="Delivered" ? previousDateContent:null}
                </Box>            
        } else {
            
            dateDiv = <Box direction="row" colorIndex="light-1" pad="none" justify="start" responsive={false} onClick={this.handleOrderDetailPage}>
				<span className="labelSize">{this.state.order_shipComplete_label}:&nbsp;</span>
				<span className="blodNoWidth">{formatDate(shipComplete) || 'TBD'}&nbsp;</span>
                {previousDateContent}
                </Box>
        }
    }

    return (
	  
 
	  //need more info on the flag,triangle and layer icon.
	  //not sure on the intent
	  <Box direction="column" colorIndex="light-1" pad="medium" separator="bottom" justify="between" className="search-item" responsive={false} style={{'height':'119px'}}  >
		  <Box direction="row" colorIndex="light-1" pad="none" justify="start" responsive={false} onClick={this.handleOrderDetailPage}>
			  <span className="searchHeadingSize">{this.state.order_item_text}:</span>
			  <span className="labelSize space">{this.state.order_status_item_label}:&nbsp;</span>
			  <span className="blodOrderList">{this.props.orderData.shipmentStatus && this.props.orderData.shipmentStatus == "Partially Shipped"  ? "Multiple" : this.props.orderData.orderStatus}</span>
		  </Box>
		  <Box direction="row" colorIndex="light-1" pad="none" justify="between" responsive={false}>
			<Box onClick={this.handleOrderDetailPage} className="searchShipToName" >
	            <Title responsive={false} justify="between" >
				   <Heading tag="h3" strong={true} margin="none" className="alert-label elip">{this.props.orderData.ship_to_name}</Heading>
				</Title>
            </Box>
           	<Box><WatchFlag qtcuid={this.props.orderData.qtcuid} flagOn={this.props.orderData.inWatchList} unwatchItem={() => this.deleteItem(this.props.orderData.qtcuid)} /></Box> 
		  </Box>
		  <Box direction="row" colorIndex="light-1" pad="none" justify="start" responsive={false} onClick={this.handleOrderDetailPage}>
			<div className="searchPoValue elip">
				<span className="labelSize">{this.state.order_po_text}:&nbsp;</span>
				<span className="blodOrderList">{poNum}</span>
			</div>
			<div className="hpeValueSize space">
				<span className="labelSize">{this.state.order_hpe_no_text}:&nbsp;</span>
				<span className="blodOrderList">{this.props.orderData.orderId}</span>
			</div>
		  </Box>
		  {dateDiv}
      </Box>
    );
  }
});

export default connect(null, mapDispatchToProps)(OrderListItem);

//<OrderListItem orderData={orderData[0].order_list[0]} /> 
