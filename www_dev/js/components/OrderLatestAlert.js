import React from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';


// grommet components
import Box from 'grommet/components/Box';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import Heading from 'grommet/components/Heading';
import Anchor  from 'grommet/components/Anchor';

import apiCommunicator from '../utils/apiCommunicator';
import utilities from '../utils/utilities';

const labels = {
	new_ship_complete : ( <FormattedMessage id="New Ship Complete" defaultMessage="New Ship Complete" /> )
};


var OrderLatestAlert = React.createClass({
  getInitialState: function() {
	const order_latest_alert = true
	
	
    return {
	  'order_latest_alert': order_latest_alert
    };
  },
  clearAlert: function(alertId){
	  apiCommunicator.updateAlert(alertId,false);		//disable the api.
	  this.setState({ 'order_latest_alert': false });	//the state is false.
  }
  ,
  
  
  render: function() {
		var clear = "img/icons/clear.png";
		var triangle = "img/icons/triangle.png";
		var alert = null;
		
		//need to scan through the list of alerts in the alertList. Check if the latest creation_date isnew alert and display it.
		this.props.latestAlert.map((x) => {
			if(x.isNew) {
				//if alert is null then take that value
				if(alert == null)
					alert = x;
				else{
					if(new Date(alert.creationDate).getTime() < new Date(x.creationDate).getTime()){
						alert = x;
					}
				}
			}
			return x;
		}); 

		
		if(alert && this.state.order_latest_alert ){
			return (
		    <Box direction="column" style={{'background-color':'papayawhip'}} pad="medium" separator="horizontal" justify="between" responsive={false}>

			  <Box direction="row"  pad="none" justify="between" responsive={false} style={{'background-color':'papayawhip'}}>
				  <Box direction="row"  pad="none" justify="start" responsive={false} style={{'background-color':'papayawhip'}}>
						<img src={triangle} height="18" width="18" />
						<Anchor href="#top" className="anchor-underline-disable" >
							<Heading tag="h4" margin="none" strong={false} align="start" style={{'margin-top':'0px','margin-left':'10px'}} >
								{alert.message} 
							</Heading>
						</Anchor>
				  </Box>
				  
				  <Anchor onClick={() => this.clearAlert(alert.id)} ><img src={clear} height="18" width="18" /> </Anchor>
				
			  </Box>	
			</Box>
			);		
		}
		else{
			
			return null;
			
		}
		
	}
		
});

export default OrderLatestAlert;
//it will scan through the list of alerts in the list to determine which isNew is "true"
//<OrderLatestAlert latestAlert={alertList}/>