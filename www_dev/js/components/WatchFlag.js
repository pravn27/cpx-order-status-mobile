import React from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

// grommet components
import Anchor from 'grommet/components/Anchor';
import WatchConfirmation from './WatchConfirmation';
import UnwatchConfirmation from './UnwatchConfirmation';



//utils
import apiCommunicator from '../utils/apiCommunicator';
//separating the logic out for the watch flag. Need code to add into the component to communicate with the backend.

const mapStateToProps = (state) => ({
	userSimulation: state.userInit.userSimulation
});

var WatchFlag = React.createClass({

	getInitialState: function () {
		const displayConfirmation = false
		return {
			'flagOn': this.props.flagOn
		};
	},

	watchOrder: function () {

		//apiCommunicator.addWatchList(qtcuid);

		//need to display the confirmation page
		this.setState({ flagOn: true });
		this.setState({ displayConfirmation: true });
	},

	unwatchOrder: function () {

		//need to display the notification page
		this.setState({ flagOn: false });
		this.setState({ displayConfirmation: true });

	},

	toggleWatchConfirmation: function () {
		if (this.state.displayConfirmation) {
			this.setState({ displayConfirmation: false });
		} else {
			this.setState({ displayConfirmation: true });
		}
	},

	cancelUnwatch: function () {
		this.setState({ flagOn: true });
		this.toggleWatchConfirmation();
	},

	removeWatchedItem: function () {
		this.toggleWatchConfirmation();
		this.setState({ flagOn: false });
		if (this.props.unwatchItem)
			this.props.unwatchItem();
		else {
			apiCommunicator.removeWatchList(this.props.qtcuid).end(function (err, res) {
				if (err)
					console.log(err);
			});
		// remove watchlist item
		ADB.trackAction('e.orderWatchRemove', {'qtcuid': this.props.qtcuid} );
		}
	},

	watchFlagNotActive: function(){
		this.setState({ flagOn: false });
		this.toggleWatchConfirmation();
	},

	toggleFlag: function (simulationMode) {
		if (!simulationMode) {
			this.setState({ displayConfirmation: true });


			if (!this.state.flagOn) {
				//TODO need to add the code to the watch list.
				this.watchOrder();

			}
			else {
				//TODO need to add the code to the unwatch the qtcuid.
				this.unwatchOrder();
				//this.props.unwatchItem(); --> does not work here!
			}
		}

	},
	
	componentDidMount() {
		this.setState({ flagOn: this.props.flagOn });
	},
	
	render: function () {
		var {  userSimulation } = this.props;

		var flagSrc = (this.state.flagOn) ? "img/icons/flagged.png" : "img/icons/flag_grey.png";
		var flag = <Anchor onClick={this.toggleFlag}> <img src={flagSrc} height="23" width="24" /> </Anchor>
		var confirmation = <WatchConfirmation qtcuid={555} />
		var flagOrConfirmation = true ? flag : confirmation;


		if (this.state.displayConfirmation && !this.state.flagOn) {
			return (
				<UnwatchConfirmation qtcuid={this.props.qtcuid} cancel={this.cancelUnwatch} unwatch={this.removeWatchedItem} />

			);


		}
		else if (this.state.displayConfirmation && this.state.flagOn) {
			return (
				<WatchConfirmation qtcuid={this.props.qtcuid} cancel={this.removeWatchedItem} watch={this.toggleWatchConfirmation} redraw={this.watchFlagNotActive} />

			);
		}
		else {
			return (
				<Anchor onClick={() => this.toggleFlag(userSimulation.simulationMode)}> <img src={flagSrc} height="23" width="24" /> </Anchor>
			);
		}

	}
});

export default connect(mapStateToProps)(WatchFlag);

