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
import Anchor  from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import Title from 'grommet/components/Title';
import Heading from 'grommet/components/Heading';
import Columns from 'grommet/components/Columns';
import Button from 'grommet/components/Button';
import RadioButton from 'grommet/components/RadioButton';
import Tiles from 'grommet/components/Tiles';
import Tile from 'grommet/components/Tile';
import CheckBox from 'grommet/components/CheckBox';
import { Spinner } from '../utils/commonComponents';
import Label from 'grommet/components/Label';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';

// app components
import IconHelper from './IconHelper';
import apiCommunicator from '../utils/apiCommunicator';

//separating the confirmation page(s) for the watch flag.
export const MODAL_NAME = 'WatchConfirmation';

// Component
const 
    modalStyle = {
        overlay: {
            zIndex            : 1000,// To avoid themenu showing on top of the popup
            backgroundColor   : 'rgba(62, 62, 62, 0.75)'
        },
        content: {
			top                   : '50%',
            left                  : '30%',
            right                 : '30%',
            bottom                : 'auto',
            marginRight           : '-50%',
            padding               : '10px 20px',
            transform             : 'translate(-28%, -50%)',
            boxShadow             : '10px 10px 80px -17px rgba(0,0,0,0.75)'
        }
    };



var WatchConfirmation = React.createClass({
	getInitialState: function () {
		const flagOn = false,
			isAlertsSubscribed = true,
			save = (<FormattedMessage id="Save" defaultMessage="Save" />)


		return {
			'flagOn': flagOn,
			'isAlertsSubscribed': isAlertsSubscribed,
			'save': save,
			modalIsOpen: true
		};
	},


	openModal: function () {
		this.setState({ modalIsOpen: true });
	},

	afterOpenModal: function () {
		// references are now sync'd and can be accessed.
		this.refs.subtitle.style.color = '#f00';
	},

	closeModal: function () {
		this.setState({ modalIsOpen: false });
		this.props.redraw(); //redraw the flag without watching it.
	},

	sendWatchReq: function (qtcuid, watch, cancel) {
		let isAlertsSubscribed = this.state.isAlertsSubscribed;
		apiCommunicator.addWatchList(qtcuid)
			.then(response => {
				if (200 === response.statusCode) {
					apiCommunicator.alertOnWatchList(qtcuid, 'com.hpe.prp.cpx.model.Order', isAlertsSubscribed);
				}
			})
		if (isAlertsSubscribed) // Add alert track action
			ADB.trackAction('e.orderAlertAdd', {'qtcuid': qtcuid});
		// Add watchlist item
		ADB.trackAction('e.orderWatchAdd', {'qtcuid': qtcuid} )
		watch();

	},
	subscribeAlerts: function (flag) {

		//need to display the confirmation page
		//this.state.watchOn = flag;
		this.setState({ isAlertsSubscribed: flag });
	},
	render: function () {

		//determine if there is a need to watch the qtcuid id.

		return (
			<Modal

				isOpen={this.state.modalIsOpen}
				onRequestClose={this.closeModal}
				style={modalStyle}
				contentLabel={this.MODAL_NAME}
				>
				<App>
                    <Box flex={true}>
                        <Header>
                            <Heading tag="h3">
                                <b><FormattedMessage id="none" defaultMessage="Alert options" /></b>
                            </Heading>
                        </Header>

                        <Box justify="start">
                            <Paragraph size="large">
								<FormattedMessage id="add_alert_label_1" defaultMessage="You've added this order to your Watch List. Would you like to receive alerts for this order?" />
                            </Paragraph>
                        </Box>


						<Box direction="row" align="start" responsive={false}>
							<Label >
								<FormattedMessage id="yes" defaultMessage="Yes" />&ensp;
								<RadioButton id="Alertid-yes" label=" " checked={this.state.isAlertsSubscribed} onChange={() => this.subscribeAlerts(true)} />
							</Label>
							<Label>
								<FormattedMessage id="no" defaultMessage="No" />&ensp;
                            	<RadioButton id="Alertid-no" label=" " checked={!this.state.isAlertsSubscribed} onChange={() => this.subscribeAlerts(false)} />
							</Label> 
                        </Box>


                        <Box separator="top">
                            <Paragraph size="small">
								<FormattedMessage id="preference_label_1" defaultMessage="To change alert settings, go to Preferences from the Main Menu" />
                            </Paragraph>
                        </Box>
                

                        <Box direction="row" alignSelf="center" responsive={false}>
                            <Box pad="small">
                                <Button primary={true} label={this.state.save} onClick={() => this.sendWatchReq(this.props.qtcuid, this.props.watch, this.props.cancel)}  />
                            </Box>
                        </Box>
                    </Box>
                </App>
			</Modal>

		)
	}
});

export default WatchConfirmation;

//<WatchConfirmation qtcuid={xxx} /> 
