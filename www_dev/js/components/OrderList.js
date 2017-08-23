import React from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';
import AlertListItem from './AlertListItem';
import OrderListItem from './OrderListItem';


// grommet components
import Box from 'grommet/components/Box';
import Layer from 'grommet/components/Layer';
import Heading from 'grommet/components/Heading';
import Title from 'grommet/components/Title';

// icons

var OrderList = React.createClass({
  getInitialState: function() {

    return {
    };
  },
  render: function() {
		var listing = '';
		var searchType = this.props.searchType;
	    if(this.props.orderData != null){
			listing =  this.props.orderData.map((item, index) => {
					return (
						<OrderListItem key={index} orderData={item} parentSearchType = {searchType}/>
					);
			});
			
		}else {
			
			if(this.props.alertData != null){

				//alert.json is missing the attribute for alertIssuedMinutes		
				listing = this.props.alertData.list.map(function(item){
					return (
						<AlertListItem alertIssuedMinutes={1000} orderNumber={item.id} alertLabel={item.message}/>   
					);
			});

				
			}
			
			
		}



		return(
		 <Box pad="none" direction="column"  justify="between" tag="aside" responsive={false}>
			{listing}
		 </Box>	
		);
	  
  }
}
);

export default OrderList;

//<OrderList alertData={alertData}/>  
//<OrderList orderData={orderData[0]}/>  