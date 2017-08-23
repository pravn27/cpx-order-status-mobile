import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Title from 'grommet/components/Title';
import App from 'grommet/components/App';
import Tiles from 'grommet/components/Tiles';
import Tile from 'grommet/components/Tile';
import Section  from 'grommet/components/Section';
import LandingSidebar from './LandingSidebar';
import { FormattedMessage } from 'react-intl';
import Box from 'grommet/components/Box';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import DateTime from 'grommet/components/DateTime';
import Button from 'grommet/components/Button';
import IconHelper from './IconHelper';
import PageHeader from './PageHeader';
import FooterMain from './FooterMain';
import FooterPadding from './FooterPadding';
import SearchResult from './SearchResult';
import CalendarErrorPopUp from './CalendarErrorPopUp';
import DateErrorPopUp from './DateErrorPopUp';
import { earlierThan90, checkDateFormat } from '../utils/utilities';

//Redux Components
import { advancedSearchAction, resetFilterAndSorting } from '../actions/searchAction'
import { connect } from 'react-redux'

const searchTitle = (<FormattedMessage id="cpx_search_title" defaultMessage="Search" />);
const shipToAddress = (<FormattedMessage id="cpx_ship_to_address" defaultMessage="Customer Name or Address" />);
const hpeProductNumber = (<FormattedMessage id="cpx_hpe_product_number" defaultMessage="HPE Product Number" />);
const orderStartDate = (<FormattedMessage id="cpx_order_date_range" defaultMessage="Order Start Date" />);
const orderEndDate = (<FormattedMessage id="cpx_order_date_range" defaultMessage="Order End Date" />);
const shipStartDate = (<FormattedMessage id="cpx_ship_date_range" defaultMessage="Ship Date Range" />);
const shipEndDate = (<FormattedMessage id="cpx_ship_date_range" defaultMessage="Ship End Date" />);
const advancedSearchTitle = (<FormattedMessage id="cpx_advanced_search" defaultMessage="Advanced Search" />);
const estimatedShipDateTitle = (<FormattedMessage id="cpx_estimated_ship_dates" defaultMessage="Estimated Ship Complete Date (future dates only)" />);
const shipToAddressPld = (<FormattedMessage id="cpx_ship_to_address_placeholder" defaultMessage="Example: Company and/or Main Street and/or State" />);
const hpeProductNumberPld = (<FormattedMessage id="cpx_hpe_product_number_placeholder" defaultMessage="Example: MOS95A" />);
const dateRangePld = (<FormattedMessage id="cpx_date_ranger_placeholder" defaultMessage="MM-DD-YYYY" />);

const mapStateToProps = (state) => ({
    reduxState: state
});

var CalendarChecked = false;

var AdvancedSearchPage = React.createClass({

	getInitialState: function(){
		return{
			showMenu: false,
			shipToAddressString: null,
		 	displayConfirmation: false,
            displayDateError: false,
		}
	},

	goMenu: function() {
		if(this.state.showMenu){
            this.setState({showMenu: false});
        }else{
            this.setState({showMenu: true});
        }
	},

	goBack: function(){
		hashHistory.goBack();
	},

	toggleErrorCheckCalendar: function () {
		if (this.state.displayConfirmation) {
			this.setState({ displayConfirmation: false });
		} else {
			this.setState({ displayConfirmation: true });
		}
	},

    toggleErrorCheckDate: function () {
		if (this.state.displayDateError) {
			this.setState({ displayDateError: false });
		} else {
			this.setState({ displayDateError: true });
		}
	},

	handleShipToAddress: function(e) {
		let shipToAddressString = e.target.value
		this.setState({
			shipToAddressString
		});
		//console.log(this.state.shipToAddressString);
	},

	handleHpeProductNumber: function(e) {
		let hpeProductNumberString = e.target.value
		this.setState({
			hpeProductNumberString
		});
		//console.log(this.state.hpeProductNumberString);
	},

	handleStartOrderDate: function(e) {
		if(typeof e.format === "function") {
			let startOrderDate = e.format("MM-DD-YYYY");
			this.setState({
				startOrderDate
			});
		} else if(typeof e === 'string') {
            //if(this.earlierThan90(e) == false ) {
                this.setState({
                    startOrderDate: e
                });
            //} else {
            //    return;
            //}
		}
	},

	handleEndOrderDate: function(e) {
		if(typeof e.format === "function") {
			let endOrderDate = e.format("MM-DD-YYYY");
			this.setState({
				endOrderDate
			});
		} else if(typeof e === 'string') {
			this.setState({
				endOrderDate: e
			});
		}
	},

	handleStartShipDate: function(e) {
		if(typeof e.format === "function") {
			let startShipDate = e.format("MM-DD-YYYY");
			this.setState({
				startShipDate
			});
		} else if(typeof e === 'string') {
            //if(this.earlierThan90(e) == false ) {
                this.setState({
                    startShipDate: e
                });
            //} else {
            //    return;
            //}
		}
	},

	handleEndShipDate: function(e) {
		if(typeof e.format === "function") {
			let endShipDate = e.format("MM-DD-YYYY");
			this.setState({
				endShipDate
			});
		} else if(typeof e === 'string') {
			this.setState({
				endShipDate: e
			});
		}
	},

	_onSubmit: function(event) {
		event.preventDefault();

		let shipToAddressString = this.state.shipToAddressString;
		let hpeProductNumberString = this.state.hpeProductNumberString;

		let orderStartDate = this.state.startOrderDate;
		let orderEndDate = this.state.endOrderDate;
		let shipStartDate = this.state.startShipDate;
		let shipEndDate = this.state.endShipDate;

		let shipDateField = "planned_ship_date"; 
		
		if ( ! orderStartDate ) {
			//Do nothing because date can be empty
		} else if ( !checkDateFormat(orderStartDate) ){
            this.setState({
                displayDateError: true,
                startOrderDate: ""
            })
            return;
        } else if( earlierThan90(orderStartDate) ) {
			this.setState({
                displayConfirmation: true,
                startOrderDate: ""
            })
            return;
		} else {
            this.setState({
				startOrderDate: orderStartDate
			})
		}

        if ( ! orderEndDate ) {
			//Do nothing because date can be empty
		} else if ( !checkDateFormat(orderEndDate) ){
            this.setState({
                displayDateError: true,
                endOrderDate: ""
            })
            return;
        } else if(earlierThan90(orderEndDate) ) {
            this.setState({
                displayConfirmation: true,
                endOrderDate: ""
            })
            return;
		} else {
			this.setState({
				endOrderDate: orderEndDate
			})
		}

		if ( ! shipStartDate ) {
			//Do nothing because date can be empty
		} else if ( !checkDateFormat(shipStartDate) ){
            this.setState({
                displayDateError: true,
                startShipDate: ""
            })
            return;
        } else if(earlierThan90(shipStartDate)) {
			this.setState({
                displayConfirmation: true,
                startShipDate: ""
            })
            return;
		} else {
			this.setState({
				startShipDate: shipStartDate
			})
		}

        if ( ! shipEndDate ) {
			//Do nothing because date can be empty
		} else if ( !checkDateFormat(shipEndDate) ){
            this.setState({
                displayDateError: true,
                endShipDate: ""
            })
            return;
        } else if(earlierThan90(shipEndDate) ) {
            this.setState({
                displayConfirmation: true,
                endShipDate: ""
            })
            return;
		} else {
			this.setState({
				endShipDate: shipEndDate
			})
		}

		var query = {
			advancedSearch_shipToAddressString: shipToAddressString,
			advancedSearch_hpeProductNumberString: hpeProductNumberString,
			advancedSearch_orderStartDate: orderStartDate,
			advancedSearch_orderEndDate: orderEndDate,
			advancedSearch_shipDateField:  shipDateField,
			advancedSearch_shipStartDate: shipStartDate,
			advancedSearch_shipEndDate: shipEndDate,
		}

		let { dispatch } = this.props;
		dispatch(resetFilterAndSorting());
		dispatch(advancedSearchAction(query));
		hashHistory.push('/SearchResult/advanced');
	},

	calendarCalled:function(cb){ //resolve issue reported in CR298613
		if($('#AdvancedSearchPage').length > 0)
		{
			if($('.grommetux-date-time-drop__grid').length > 0 && CalendarChecked == false)		
			{
				CalendarChecked = true;

				var p = $('.grommetux-date-time-drop__grid').first().parent().parent().parent();
				p.css('max-height',''); //remove max height
				var newLeft = (p.parent().width() - p.width()) / 2;
				var newTop = (p.parent().height() - 30 - 380) / 2;
				if (newTop < 10) {newTop = 10;}
				p.offset({ top: newTop, left : newLeft });

				//make sure keyboard is hide
				if (Keyboard.isVisible) {
					Keyboard.hide();
				}
			}else{
				CalendarChecked = false;
			}
			setTimeout(function(){cb(cb)}, 300);
		}else{
			CalendarChecked = false;
			//end the loop after leaving the page.
		}
	},
	componentDidMount:function(){
		this.calendarCalled(this.calendarCalled);//resolve issue reported in CR298613
	},
	render:function() {
		let showMenu;
		let showButton;
		let {
			shipToAddressString,
			hpeProductNumberString,
			startOrderDate,
			endOrderDate,
			startShipDate,
			endShipDate,
			} = this.state;

		if (this.state.showMenu) {
			showMenu = <LandingSidebar close={this.goMenu} />
		} else {
			showMenu = null
		}

		if (shipToAddressString || hpeProductNumberString || startOrderDate || endOrderDate || startShipDate || endShipDate ) {
			showButton = <Box className="btn-outline" colorIndex="light-1" responsive={true} align="center"
              					pad={{horizontal: "large", vertical: "large"}} margin="none">
                				<Button label={searchTitle} primary={true} fill={true} type="submit" onClick={this._onSubmit}/>
              			</Box>
		} else {
			showButton = <Box className="btn-outline" colorIndex="light-1" responsive={true} align="center"
              					pad={{horizontal: "large", vertical: "large"}} margin="none">
                				<Button label={searchTitle} primary={true} fill={true} type="submit" />
              			</Box>
		}

		return(
			<App centered={true}>
				<Section className="btn-outline" pad='none' style={{'overflow-x':'hidden'}}>
                    <PageHeader pageTitle={searchTitle} showBackBtn={true} />
					<Box className="searchBar" colorIndex="accent-2" pad="medium" direction="row" align="center" justify="between" tag="aside" responsive={false}>
						<Title strong={true} responsive={false}>
	                        <Heading margin="none" tag="h4" style={{'fontWeight':'400'}}>{advancedSearchTitle}</Heading>
	                    </Title>
	                </Box>
	                <Form pad="none" onSubmit={this._onSubmit} className="search-item" style={{'width':'100%','border':'0px'}}>
	                	<FormField label={shipToAddress} htmlFor={shipToAddress.props.defaultMessage}>
    							<input id={shipToAddress.props.defaultMessage} placeholder={shipToAddressPld.props.defaultMessage} type="text" value={this.state.shipToAddressString} onChange={this.handleShipToAddress} />
  							</FormField>
  							<FormField label={hpeProductNumber} htmlFor={hpeProductNumber.props.defaultMessage}>
    							<input id={hpeProductNumber.props.defaultMessage} placeholder={hpeProductNumberPld.props.defaultMessage} type="text" value={this.state.hpeProductNumberString} onChange={this.handleHpeProductNumber} />
  							</FormField>
							<FormField label={orderStartDate} htmlFor={orderStartDate.props.defaultMessage}>
								<Box colorIndex="light-1" className="formSize" direction="row" justify="center" responsive={false} style={{'padding':'0px 12px'}}>
									<FormField htmlFor={orderStartDate.props.defaultMessage} style={{'paddingTop':'10px','paddingBottom':'10px','borderTopColor':'white','borderBottomColor':'white','borderLeftColor':'white'}}>
										<DateTime id={orderStartDate.props.defaultMessage} name={dateRangePld.props.defaultMessage} format="MM-DD-YYYY" value={this.state.startOrderDate} onChange={ this.handleStartOrderDate }/>
										{ this.state.displayConfirmation ? <CalendarErrorPopUp cancel={this.toggleErrorCheckCalendar} /> : null }
										{ this.state.displayDateError ? <DateErrorPopUp cancel={this.toggleErrorCheckDate} /> : null }	
									</FormField>	
									<FormField className="formSizeField" htmlFor={orderEndDate.props.defaultMessage} style={{'paddingTop':'10px','paddingBottom':'10px','borderTopColor':'white','borderBottomColor':'white','borderRightColor':'white'}}>
										<DateTime id={orderEndDate.props.defaultMessage} name={dateRangePld.props.defaultMessage} format="MM-DD-YYYY" value={this.state.endOrderDate} onChange={ this.handleEndOrderDate }/>
									</FormField>
								</Box>
							</FormField>
						<FormField label={estimatedShipDateTitle} htmlFor={estimatedShipDateTitle.props.defaultMessage}>
  							<Box colorIndex="light-1" className="formSize" direction="row" justify="center" responsive={false} style={{'padding':'0px 12px'}}>
	  							<FormField htmlFor={shipStartDate.props.defaultMessage} style={{'paddingTop':'10px','paddingBottom':'10px','borderTopColor':'white','borderBottomColor':'white','borderLeftColor':'white'}}>
	    							<DateTime id={shipStartDate.props.defaultMessage} name={dateRangePld.props.defaultMessage} format="MM-DD-YYYY" value={this.state.startShipDate} onChange={ this.handleStartShipDate } />
	    							{ this.state.displayConfirmation ? <CalendarErrorPopUp cancel={this.toggleErrorCheckCalendar} /> : null }
                                    { this.state.displayDateError ? <DateErrorPopUp cancel={this.toggleErrorCheckDate} /> : null }
	  							</FormField>
	  							<FormField className="formSizeField" htmlFor={shipEndDate.props.defaultMessage} style={{'paddingTop':'10px','paddingBottom':'10px','borderTopColor':'white','borderBottomColor':'white','borderRightColor':'white'}}>
	    							<DateTime id={shipEndDate.props.defaultMessage} name={dateRangePld.props.defaultMessage} format="MM-DD-YYYY" value={this.state.endShipDate} onChange={ this.handleEndShipDate } />
	  							</FormField>
  							</Box>
						</FormField>
							{showButton}
							<Box colorIndex="light-1" className="formSize" direction="row" justify="center" responsive={false} style={{'height':'15vw'}} > </Box>
							<input type="hidden" name="AdvancedSearchPage" id="AdvancedSearchPage" value="calendar" /> {/*  resolve issue report on CR298613*/}
	                	</Form>
				</Section>
				<FooterMain Source={searchTitle.props.defaultMessage} />
			</App>
		);
	}
});

//export default AdvancedSearchPage;
export default connect(mapStateToProps)(AdvancedSearchPage);
