import React from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';
import Modal from 'react-modal';


// grommet components
import App from 'grommet/components/App';
import Layer from 'grommet/components/Layer';
import Header from 'grommet/components/Header';
import Section from 'grommet/components/Section';
import Paragraph from 'grommet/components/Paragraph';
import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import Title from 'grommet/components/Title';
import Tiles from 'grommet/components/Tiles';
import Tile from 'grommet/components/Tile';
import Heading from 'grommet/components/Heading';
import Columns from 'grommet/components/Columns';
import Button from 'grommet/components/Button';
import RadioButton from 'grommet/components/RadioButton';
import { Spinner } from '../utils/commonComponents';

// app components
import IconHelper from './IconHelper';
import apiCommunicator from '../utils/apiCommunicator';

//separating the confirmation page(s) for the watch flag.

//separating the confirmation page(s) for the watch flag.
export const MODAL_NAME = 'UnwatchConfirmation';

// Component
const 
    modalStyle = {
        overlay: {
            zIndex            : 200,
            backgroundColor   : 'rgba(62, 62, 62, 0.75)'
        },
        content: {
			top					  : '50%',
            left                  : '30%',
            right                 : 'auto',
            bottom                : 'auto',
            marginRight           : '-50%',
            padding               : '5px 10px',
            transform             : 'translate(-28%, -50%)',
            boxShadow             : '10px 10px 80px -17px rgba(0,0,0,0.75)'
        }
		
    };


var UnwatchConfirmation = React.createClass({
  getInitialState: function() {
	const flagOn = false ,
	watch_confirmation_label_1 = ( <FormattedMessage id="watch_confirmation_label_1" defaultMessage="Are you sure you want to" /> ),
	watch_confirmation_label_2 = ( <FormattedMessage id="watch_confirmation_label_2" defaultMessage="remove this item from your" /> ),
	watch_confirmation_label_3 = ( <FormattedMessage id="watch_confirmation_label_3" defaultMessage="Watch List?" /> ),
	alert_label_1 = ( <FormattedMessage id="alert_label_1" defaultMessage="Note that if you choose to remove it, you will no" /> ),
	alert_label_2 = ( <FormattedMessage id="alert_label_2" defaultMessage="longer receive alerts on this order." /> ),
	cancel = ( <FormattedMessage id="Cancel" defaultMessage="Cancel" /> ),
	remove = ( <FormattedMessage id="Remove" defaultMessage="Remove" /> )

    return {
	  'flagOn': flagOn,
	  'watch_confirmation_label_1': watch_confirmation_label_1,
	  'watch_confirmation_label_2': watch_confirmation_label_2,
	  'watch_confirmation_label_3': watch_confirmation_label_3,
	  'alert_label_1': alert_label_1,
	  'alert_label_2': alert_label_2,
	  'cancel': cancel,
	  'remove': remove,
	  modalIsOpen: true
    };
  },
  openModal: function() {
    this.setState({modalIsOpen: true});
  },

  afterOpenModal: function() {
    // references are now sync'd and can be accessed.
    this.refs.subtitle.style.color = '#f00';
  },

  closeModal: function() {
    this.setState({modalIsOpen: false});
	this.props.cancel(); //redraw the flag without remove the alert.
  },
  sendUnWatchReq: function(qtcuid,unwatch){
	//send the unwatch request api.  
	if(unwatch)	
		unwatch();
  },
  
  watchOrderConfirmation: function(order){
	  
	  //need to display the confirmation page
	  this.setState({flagOn: true});
  },
  unwatchOrderConfirmation:function(order){
  
	  //need to display the notification page
	  this.setState({flagOn: false});
  },
  render: function() {
	
	//determine if there is a need to watch the order id.
	
    return (
	<Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={modalStyle}
          contentLabel={this.MODAL_NAME}
        >
		<App>
            <Box flex={true}>
		
			<Box  pad="none">
				<Header style={{'min-height':'0px','padding-bottom':'10px','padding-left':'14px','width':'90%'}}>
					<Heading margin="none" tag="h3" strong="true">
					Alert 
					</Heading>
				</Header>
			</Box>	

			<Box style={{'padding-bottom':'40px'}} direction="column" pad="medium" justify="between" responsive={false}>
				<Title responsive={false} justify="between">
				   <Heading style={{'height':'30px'}} tag="h3"  margin="none" className="alert-label">{this.state.watch_confirmation_label_1}</Heading>
				</Title>
				<Title responsive={false} justify="between">
				   <Heading style={{'height':'30px'}} tag="h3"  margin="none" className="alert-label">{this.state.watch_confirmation_label_2}</Heading>
				</Title>
				<Title responsive={false} justify="between">
				   <Heading style={{'height':'30px'}} tag="h3"  margin="none" className="alert-label">{this.state.watch_confirmation_label_3}</Heading>
				</Title>
				
			</Box>
			
			<Box direction="column" pad="medium" separator="top" justify="between" responsive={false}>
				<Title responsive={false} justify="between">
				   <Heading style={{'padding-top':'1px','color':'rgb(0,0,0)','font-size':'14px','font-weight':'normal'}} tag="h6"  margin="none" className="alert-label">{this.state.alert_label_1}</Heading>
				</Title>
				<Title responsive={false} justify="between" style={{'height':'14px'}} >
				   <Heading style={{'color':'rgb(0,0,0)','font-size':'14px','font-weight':'normal'}} tag="h6"  margin="none" className="alert-label">{this.state.alert_label_2}</Heading>
				</Title>
			</Box>
			
			<Tiles direction="row" colorIndex="light-1" justify="center" responsive={false} fill={true}>
				<Tile pad="medium">
				   <Button label={this.state.cancel} fill={true} onClick={this.props.cancel } />
				</Tile>
				<Tile pad="medium">
				   <Button label={this.state.remove} fill={true} primary={true} onClick={() => this.sendUnWatchReq(this.props.qtcuid,this.props.unwatch)} />
				</Tile>
			</Tiles>
			</Box>
		</App>
	</Modal>	
	
	
    );
	
	
  }
});

export default UnwatchConfirmation;
//<UnwatchConfirmation order={xxx} /> 



