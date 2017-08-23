import React from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';


// grommet components
import Box from 'grommet/components/Box';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import Heading from 'grommet/components/Heading';


//separating the logic out for the watch flag. Need code to add into the component to communicate with the backend.
//owing values "Submitted", "Accepted", "Production", "Shipped to Customer", "Delivered", "Cancelled"


const labels = {
	canceledStatus: (<FormattedMessage id="canceledStatus" defaultMessage="Order successfully canceled" />),
    acceptedStatus: (<FormattedMessage id="acceptedStatus" defaultMessage="Accepted" />),
    shippedStatus: (<FormattedMessage id="shippedStatus" defaultMessage="Shipped" />),
    submittedStatus: (<FormattedMessage id="submittedStatus" defaultMessage="Submitted" />),
	productionStatus: (<FormattedMessage id="productionStatus" defaultMessage="Production" />),
	deliveredStatus: (<FormattedMessage id="deliveredStatus" defaultMessage="Delivered" />)
	
};


var OrderSummary = React.createClass({
  getInitialState: function() {
	const order_summary = ( <FormattedMessage id="order_summary" defaultMessage="Order Summary" /> ),
	order_summary_text = ( <FormattedMessage id="order_summary_text" defaultMessage="Detailed status information below" /> )
	
    return {
	  'order_summary': order_summary,
	  'order_summary_text': order_summary_text
    };
  },
  render: function() {
	var orderStatus = this.props.orderData.orderDetails.order_status ;
	 var customTd={
		submitted:<td className="tdCellStatus" style={orderStatus == 'Submitted' ? {'fontWeight' : 'bold','textAlign' : 'center'} :  {'textAlign' : 'center','paddingLeft':'3.5%','paddingRight':'3.5%'}}>{labels.submittedStatus}</td>,
		accepted:<td className="tdCellStatus" style={orderStatus == 'Accepted' ? {'fontWeight' : 'bold','textAlign' : 'center'} : {'textAlign' : 'center'}}>{labels.acceptedStatus}</td>,
		inProduction:<td className="tdCellStatus" style={orderStatus == 'Production' ? {'fontWeight' : 'bold','textAlign' : 'center'}:{'textAlign' : 'center'}}>{labels.productionStatus}</td>,
		shipped:<td className="tdCellStatus" style={orderStatus == 'Shipped to Customer' ? {'fontWeight' : 'bold','textAlign' : 'center'} : {'textAlign' : 'center'}}>{labels.shippedStatus}</td>,
		delivered:<td className="tdCellStatus" style={orderStatus == 'Delivered' ? { 'fontWeight' : 'bold','textAlign' : 'center'} : {'textAlign' : 'center','paddingRight':'3.5%','paddingLeft':'3.5%'}}>{labels.deliveredStatus}</td>
	 };
	
	 var img = "img/status/status_bar_accepted.png";
	
	if(orderStatus == 'Submitted'){
		img = 'img/status/status_bar_submitted.png';
	}
	else if(orderStatus == 'Accepted'){
		img = 'img/status/status_bar_accepted.png';
	}
	else if(orderStatus == 'Production'){
		img = 'img/status/status_bar_in_production.png';
	}
	else if(orderStatus == 'Shipped to Customer'){
		img = 'img/status/status_bar_shipped.png';
	}
	else if(orderStatus == 'Delivered'){
		img = 'img/status/status_bar_delivered.png';
	}
	else if(orderStatus == 'Cancelled' || orderStatus == 'Canceled'){
		img = 'img/status/canceled.png';
	}
	else {
		
	}

	
	//this change is added as the Cancelled status will change the layout of the screen.
	if(orderStatus == 'Cancelled' || orderStatus == 'Canceled'){

		return (
		  <Box direction="column" colorIndex="light-1" pad="none" justify="between" responsive={false}>
				<div className="tdCustomNv"> {this.state.order_summary}</div>				
				<div className="tdCustom">{this.state.order_summary_text}</div>
				<div className="tdCustom" style={{fontWeight:'600'}}>{labels.canceledStatus}</div>			
			 
			
			<Table className="tableCustom" style={{'margin-bottom':'15px'}}>
			  <tbody>				
				<TableRow>
				  <td className="tdCell"></td>
				  <td className="tdCell"></td>
				  <td className="tdCellStatusEmpty"></td>
				  <td className="tdCellStatusEmpty"></td>
				  <td className="tdCellStatusFull"><img src={img} width="90%"/></td>
				  <td className="tdCellStatusEmpty"></td>
				  <td className="tdCellStatusEmpty"></td>
				</TableRow>
			  </tbody>
			</Table>
			
			<Table className="tableCustom">
			  <tbody>				
				<TableRow >
				</TableRow>
			  </tbody>
			</Table>			
			
		  </Box>	
		);		
	
		
	}
	else {
		
		return (
		  <Box direction="column" colorIndex="light-1" pad="none" justify="between" responsive={false}>
				<div className="tdCustomNv" style={{'fontSize':'18px'}}> {this.state.order_summary}</div>				
				<div className="tdCustom">{this.state.order_summary_text}</div>
							
			<Table className="tableCustom">
			  <tbody>				
				<TableRow>
					<td style={{'width':'20%'}}></td>		  
				  {customTd.accepted}
					<td style={{'width':'18%'}}></td>
					{customTd.shipped}
					<td style={{'width':'20%'}}></td>
				</TableRow>
			  </tbody>
			</Table>
			<Table className="tableCustom">
			  <tbody>				
				<TableRow>
				  <td className="orderSummaryImg"> <img src={img} style={{'width':'100%'}}/></td>
				</TableRow>
			  </tbody>
			</Table>
			<Table className="tableCustom" style={{'marginBottom':'4%'}}>
			  <tbody>				
				<TableRow>
			    {customTd.submitted}	 
					<td style={{'width':'19%'}}></td>	
			    {customTd.inProduction}
					<td style={{'width':'19%'}}></td>	
			   	{customTd.delivered}	  
				</TableRow>
			  </tbody>
			</Table>			
		  </Box>	
		);		
		
	}  
  }
});

export default OrderSummary;
//<OrderSummary order={orderData}/>