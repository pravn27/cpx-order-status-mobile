import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { FormattedMessage } from 'react-intl';
import App from 'grommet/components/App';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Section from 'grommet/components/Section';
import Title from 'grommet/components/Title';
import FilterSortMenu from './FilterSortMenu';
import IconHelper from './IconHelper';
import LandingSidebar from './LandingSidebar';
import WatchList from './WatchList';
import PageHeader from './PageHeader';
import FooterMain from './FooterMain';
import FooterPadding from './FooterPadding';
import NoInternetConnection from './NoInternetConnection';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Spinner } from '../utils/commonComponents';
import { formatDatetime, clone } from '../utils/utilities';

var Paragraph = require('grommet/components/Paragraph');
var Image = require('grommet/components/Image');


// Redux Actions
import { getWatchList, removeWatchList, LoadingStartAction, getWatchListAfterSort,
		 toggleSortAscend, setRetainFilter, setFilterCriteria, setDefaultSort } from '../actions/watchListActions'

// Formatted messages
const
	watchlistTitle = (<FormattedMessage id="cpx_watchlist_title" defaultMessage="Watch List" />),
	watchlistTips = (<FormattedMessage id="cpx_watchlist_tips" defaultMessage="Tips for adding to your Watch List:" />),
	watchlistNoOrder = (<FormattedMessage id="cpx_watchlist_NoOrder" defaultMessage="There are no orders in your Watch List." />),
	watchlistSubTips1 = (<FormattedMessage id="cpx_watchlist_SubTips1" defaultMessage="To add an order, use the Search tool (" />),
	watchlistSubTips2 = (<FormattedMessage id="cpx_watchlist_SubTips2" defaultMessage=") to find the order and then click the Flag (" />),
	watchlistSubTips3 = (<FormattedMessage id="cpx_watchlist_SubTips3" defaultMessage=") to add to your Watch List." />),
	lastUpdatedDate = (<FormattedMessage id="cpx_watchlist_lastUpdateDate" defaultMessage="Records updated:" />),
	am = (<FormattedMessage id="datetime_am" defaultMessage="AM" />),
	pm = (<FormattedMessage id="datetime_pm" defaultMessage="PM" />),
	zeroPrefix = (<FormattedMessage id="datetime_zero_prefix" defaultMessage="0" />),
	date_separator = (<FormattedMessage id="datetime_date_separator" defaultMessage="-" />),
	yh_separator = (<FormattedMessage id="datetime_yh_separator" defaultMessage=", " />),
	hm_separator = (<FormattedMessage id="datetime_hm_separator" defaultMessage=":" />);


const
	itemPropsToSortDictionary = {
		'Ship To': 'ship_to_name',
		'PO Number': 'poNum',
		'Order Number': 'orderId'
	},

	defaultFilterItems = ["Submitted", "Accepted", "In Production", "Shipped to Customer", "Delivered", "Cancelled"],

	isOrderStatusInFilter = (status, filterArray) => filterArray.find(filter => {
		switch (filter) {

			case 'In Production':
				return status === 'Production';

			case 'Cancelled':
			case 'Canceled':
				return status === 'Cancelled' || status === 'Canceled';

			default:
				return status === filter;
		}
	}),


	filterAndSortWatchListArray = (data, ascendingSort, filterCriteria, defaultSort) => {

		// Filter Logic
		var result = data.filter(order => isOrderStatusInFilter(order.asset.orderStatus, filterCriteria) );

		// Sorting logic
		if(!defaultSort)
		{
			result = result.sort(
				(a, b) => b.asset.ship_to_name.localeCompare(a.asset.ship_to_name)
			);

			// Ascending/Descending sort logic
			return ascendingSort ? result : result.reverse();
		}

		else {
			result = result.sort(
				(a, b) => b.asset.orderStatus.localeCompare(a.asset.orderStatus)
			);

			var deliveredOrders = result.splice(result.findIndex(x => x.asset.orderStatus == 'Delivered'), result.filter(x => x.asset.orderStatus == 'Delivered').length);

			result = result.sort(
				(a, b) => new Date(b.asset.plannedShipDate == undefined ? '01/01/1950' : b.asset.plannedShipDate) -
						  new Date(a.asset.plannedShipDate == undefined ? '01/01/1950' : a.asset.plannedShipDate)
			);

			var shippedOrders = result.splice(result.findIndex(x => x.asset.orderStatus == 'Shipped to Customer'), result.filter(x => x.asset.orderStatus == 'Shipped to Customer').length);
			var plannedShippedOrders = result.splice(result.findIndex(x => x.asset.plannedShipDate != undefined), result.filter(x => x.asset.plannedShipDate != undefined).length);
            var otherOrders = result;

            //Sort array by ship date

            deliveredOrders.sort(function(a, b) {
                return new Date(b.asset.shipDate == undefined ? '01/01/1950' : b.asset.shipDate) - new Date(a.asset.shipDate == undefined ? '01/01/1950' : a.asset.shipDate);
            });

            shippedOrders.sort(function(a, b) {
                return new Date(b.asset.shipDate == undefined ? '01/01/1950' : b.asset.shipDate) - new Date(a.asset.shipDate == undefined ? '01/01/1950' : a.asset.shipDate);
            });

            plannedShippedOrders.sort(function(a, b) {
                return new Date(b.asset.plannedShipDate) - new Date(a.asset.plannedShipDate);
            });

            otherOrders.sort(function(a, b) {
                return new Date(b.asset.shipDate == undefined ? '01/01/1950' : b.asset.shipDate) - new Date(a.asset.shipDate == undefined ? '01/01/1950' : a.asset.shipDate);
            });

            result = deliveredOrders.concat(shippedOrders, plannedShippedOrders, otherOrders);
			return result;
        }
	},

	mapStateToProps = (state) => {
		let { data, IsLoading, ascendingSort, retainFilter, filterCriteria, watchlistLastUpdated, defaultSort } = state.watchList;
		return {
			IsLoading,
			ascendingSort,
			retainFilter,
			filterCriteria,
			watchlistLastUpdated,
			watchListArray: filterAndSortWatchListArray(data, ascendingSort, filterCriteria, defaultSort),
			unfilteredWatchListData: data
		}
	},

	mapDispatchToProps = (dispatch) => ({
		_toggleAscendingSort: () => {
			dispatch( toggleSortAscend() );
			dispatch( setDefaultSort(false) );
		},
		_resetFilters: () =>{
			dispatch( setDefaultSort(true) );
		},
		_setRetainFilter: (flag) => {
			dispatch( setRetainFilter(flag) );
		},
		_filterAndSortCriteria: (filter) => {
			dispatch( setFilterCriteria(filter) );
		},

		_initialWatchListFetch: () => {
			dispatch ( getWatchList() );
		},
		_clickOnApply:()=>{
			dispatch(setDefaultSort(false));
		}
	});



var WatchListPage = React.createClass({

	getInitialState: function () {
		return {
			showMenu: false,
			showFilterSortMenu: false
		}
	},

	goBack: function () {
		hashHistory.goBack();
	},

	goMenu: function () {
		this.setState({ showMenu: !this.state.showMenu });
	},

	goFilterSortMenu: function () {
		this.setState({ showFilterSortMenu: !this.state.showFilterSortMenu });
	},

	componentDidMount: function () {

		// reset the filters when the page loads, except if it came from order details page
		if(!this.props.retainFilter) {
			var resetFilter = clone(defaultFilterItems);
			this.props._filterAndSortCriteria(resetFilter);
		}
		this.props._setRetainFilter(false);

		this.props._initialWatchListFetch();
	},

	render: function () {

		const
			{ IsLoading, ascendingSort, _toggleAscendingSort, watchListArray,
			  _filterAndSortCriteria, filterCriteria, watchlistLastUpdated, _resetFilters, unfilteredWatchListData,_clickOnApply } = this.props,
			sortTypeClassName = ascendingSort ? 'descend' : 'ascend',
			sortTypeIconName = ascendingSort ? 'Descend' : 'Ascend';

		var resultString, watchlistResult;

		if (IsLoading) {
			resultString = null;
			watchlistResult = <Spinner />;
		}
		else {
			var showMenu;


			var style = {
				fontWeight: 'bold',
				color: '#000000'
			};
			var pStyle = {
				color: '#000000'
			};
			var filterItems = clone(defaultFilterItems);

			var _watchListCount = watchListArray.length;

			if (this.state.showMenu) {
				showMenu = <LandingSidebar close={this.goMenu} />
			} else {
				showMenu = null
			}

			if(unfilteredWatchListData && unfilteredWatchListData.length > 0 ) {
				watchlistResult = <WatchList retainFilter={this.props._setRetainFilter} watchlistData={watchListArray} />
				resultString =
				 <Box pad="medium" direction="column" colorIndex="light-1">
					<Box direction="row" colorIndex="light-1" justify="between" responsive={false}>
						<Box direction="column" colorIndex="light-1" justify="between" responsive={false}>
							<Box direction="row" colorIndex="light-1" justify="between" responsive={false}>
								<Title responsive={false} justify="between">
									<Heading className="default-result-count-text" margin="none" strong={true} align="start">{_watchListCount}{" "}Results</Heading>
								</Title>
							</Box>
							<Box direction="row" colorIndex="light-1" justify="between" responsive={false}>
								<Title responsive={false} justify="between">
									<Heading className="default-text" margin="none" align="start">{lastUpdatedDate}{" "}{formatDatetime(watchlistLastUpdated)}</Heading>
								</Title>
							</Box>
						</Box>
						<Box direction="row" colorIndex="light-1" justify="between" responsive={false}>
							<Heading tag="h6" margin="none" align="end">
								<span className="filter" onClick={this.goFilterSortMenu} ><IconHelper iconName="Filter" /></span>
								{this.state.showFilterSortMenu ? <FilterSortMenu  defaultSort={_clickOnApply} reset={_resetFilters} close={this.goFilterSortMenu} apply={_filterAndSortCriteria} filterBy={filterCriteria /*this.state.filterText*/} filters={filterItems}/> : null}
								<span className={sortTypeClassName} onClick={_toggleAscendingSort}>
									<IconHelper className={sortTypeClassName} iconName={sortTypeIconName} />
								</span>
							</Heading>
						</Box>
					</Box>
				</Box>
			}
			else {
					watchlistResult =
					<Box pad="medium" colorIndex="light-1">
						<Box pad="medium" colorIndex="light-1"></Box>
						<Box pad="medium" colorIndex="light-1"></Box>
						<Heading margin="none" tag="h3" style={{ lineHeight: 1.5 }}>{watchlistTips}</Heading>
						<Box pad="none" colorIndex="light-1">
							<br />
							<Heading tag="h4">{watchlistNoOrder}</Heading>
							<Heading tag="h4">{watchlistSubTips1} 
								<img src="./img/icons/search_grey.png" height='16' width='16'/>
								{watchlistSubTips2} 
								<img src="./img/icons/flag.png" height='16' width='16'/>
								{watchlistSubTips3}
							</Heading>
						</Box>
					</Box>

			}
		}
		return (
			<App centered={true}>
				<PageHeader pageTitle={watchlistTitle} showBackBtn={true} />
				<Section pad='none'>
					{resultString}
					{watchlistResult}
				</Section>
				<FooterPadding />
				<FooterMain Source={watchlistTitle.props.defaultMessage} />
			</App>
		);
	}
});


export default connect(mapStateToProps, mapDispatchToProps)(WatchListPage);
