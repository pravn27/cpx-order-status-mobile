import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { getSavedSearchList, discardSavedSearchList, discardSavedSearchListAction } from '../actions/savedSearchActions'

//Redux Components
import { Provider } from 'react-redux'
import { createStore, bindActionCreators } from 'redux'
import { advancedSearchAction, resetFilterAndSorting } from '../actions/searchAction'
import { connect } from 'react-redux'

import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Title from 'grommet/components/Title';
import App from 'grommet/components/App';
import Tiles from 'grommet/components/Tiles';
import Tile from 'grommet/components/Tile';
import Anchor from 'grommet/components/Anchor';
import Menu from 'grommet/components/Menu';
import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';

import AlertListItem from './AlertListItem';
import LandingSidebar from './LandingSidebar';
import OrderList from './OrderList';
import SearchResult from './SearchResult';
import SearchPatternList from './SearchPatternList';
import FooterMain from './FooterMain';
import FooterPadding from './FooterPadding';
import IconHelper from './IconHelper';
import PageHeader from './PageHeader';
import { Spinner } from '../utils/commonComponents';
import Swipeout from 'rc-swipeout';

//var saveSearchList = require('../../data/savedSearchList.json');
const searchPatternTitle = (<FormattedMessage id="cpx_save_search" defaultMessage="Recent Searches" />);
const searchPatternResult = (<FormattedMessage id="cpx_alerts_result" defaultMessage="Results" />);
const noSearchPattern = (<FormattedMessage id="cpx_save_nosavepattern" defaultMessage="No searches found" />);

const mapStateToProps = (state) => ({
    reduxState: state
});

const mapDispatchToProps = (dispatch) => ({
    savedSearchActions: bindActionCreators({ getSavedSearchList, discardSavedSearchList, discardSavedSearchListAction,advancedSearchAction, resetFilterAndSorting }, dispatch)
});

var SearchPattern = React.createClass({
    getInitialState: function () {

        return (
            {
                showMenu: false,
                searchPatternData: null
            }
        );
    },

    componentDidMount() {
        //console.log('Getting searchPatterns');
        var searchPatternData = this.getData();
        this.setState({ searchPatternData: searchPatternData });

    },

    componentWillReceiveProps: function (nextProps) {
        var { userSavedSearchList } = nextProps.reduxState;
        this.setState({ searchPatternData: userSavedSearchList.data });
    },

    getData: function () {
        let { savedSearchActions } = this.props;
        //console.log('this.props.reduxState.userInit', this.props.reduxState.userInit.data);
        let { recentSearchList } = this.props.reduxState.userInit.data;
        savedSearchActions.getSavedSearchList(recentSearchList.list);
        return this.props.reduxState.userSavedSearchList.data;
    },

    goMenu: function () {
        if (this.state.showMenu) {
            this.setState({ showMenu: false });
        } else {
            this.setState({ showMenu: true });
        }
    },

    goBack: function () {
        hashHistory.goBack();
    },

    handleSearch: function (index, searchQuery) {

        //console.log("searchQuery:"+searchQuery);
        var searchQ = JSON.parse(searchQuery);
        var searchType = 'basic';
        var searchTerm = '';
        /*
        //basic
        {"criteria":{"value":"24Z187669003","type":"TERM","key":"term"}} //
        {"criteria":[{"value":"Ingram","type":"TERM","key":"term"}]}
        */
        /*
        // advanced no filter no sort
        {"criteria":[{"value":"Ingram","type":"TEXT","key":"customer_name"},
                      {"value":{"from":"12-22-2016"},"type":"DATE_RANGE","key":"creation_date"}]}
        */
        /*
        // advamced with filter and sort
          {"criteria":[{"key":"customer_name","type":"TEXT","value":"Ingram"}],
           "filters":[{"key":"order_status","type":"ARRAY","value":["Production","Shipped","Delivered","Cancelled"]}],
           "sort":{"field":"ship_date","direction":"desc"}}
        */
        var _this = this;
        if (Object.prototype.toString.call(searchQ.criteria) === '[object Array]' 
            && searchQ.criteria.length > 0 
            && (searchQ.criteria[0].key && searchQ.criteria[0].key !== 'term')) {
            //Advanced search
            searchType = 'advanced';
            var query = {
                advancedSearch_shipToAddressString: null,
                advancedSearch_hpeProductNumberString: null,
                advancedSearch_orderStartDate: null,
                advancedSearch_orderEndDate: null,
                advancedSearch_shipDateField: null,
                advancedSearch_shipStartDate: null,
                advancedSearch_shipEndDate: null,
            };
            var _keyword, _filterBy, _sortBy;
            searchQ.criteria.forEach(function (item) {
                if (item.key == "term") {
                    //only here is basic and below others are all for advanced search
                    _keyword = item.value;
                } else if (item.key == "ship_to_address") {
                    query.advancedSearch_shipToAddressString = item.value;
                } else if (item.key == "product_no") {
                    query.advancedSearch_hpeProductNumberString = item.value;
                } else if (item.key == "creation_date") {
                    if(item.value.from) {
                        query.advancedSearch_orderStartDate = item.value.from;
                    } 
                    if(item.value.to) {
                        query.advancedSearch_orderEndDate = item.value.to;
                    }
                } else if (item.key == "planned_ship_date") {
                    query.advancedSearch_shipDateField = item.key;
                    if(item.value.from) {
                        query.advancedSearch_shipStartDate = item.value.from;
                    } 
                    if(item.value.to) {
                        query.advancedSearch_shipEndDate = item.value.to;
                    }
                }  else if (item.key == "ship_date") {
                    query.advancedSearch_shipDateField = item.key;
                    if(item.value.from) {
                        query.advancedSearch_shipStartDate = item.value.from;
                    } 
                    if(item.value.to) {
                        query.advancedSearch_shipEndDate = item.value.to;
                    }
                } 
                 else if (item.key == "delv_date") {
                    query.advancedSearch_shipDateField = item.key;
                    if(item.value.from) {
                        query.advancedSearch_shipStartDate = item.value.from;
                    } 
                    if(item.value.to) {
                        query.advancedSearch_shipEndDate = item.value.to;
                    }
                } 
            });
            let { savedSearchActions } = this.props;
            savedSearchActions.advancedSearchAction(query); 
            searchTerm = JSON.stringify( {
                    shipToAddress: query.advancedSearch_shipToAddressString||null,
                    hpeProductNumber: query.advancedSearch_hpeProductNumberString||null,
                    orderDateIsUsed: (query.advancedSearch_orderStartDate||query.advancedSearch_orderEndDate)?true:false,
                    planShipDateIsUsed: (query.advancedSearch_shipDateField == 'planned_ship_date'),
                    shipmentDateIsUsed: (query.advancedSearch_shipDateField == 'ship_date'),
                    deliveryDateIsUsed: (query.advancedSearch_shipDateField == 'delv_date')
                });
         _this.redirectToSearch(_keyword, _filterBy, _sortBy);
        } else {
            //basic search? by now, looks code not go to here
            _keyword = searchQ.criteria && searchQ.criteria.length == 1 ? searchQ.criteria[0].value : searchQ.criteria.value;
            searchTerm = _keyword;
            this.redirectToSearch(_keyword);
        }
        ADB.trackAction('e.recentSearchClick', {'searchTerm': searchTerm, 'searchType': searchType});
    },

    redirectToSearch: function (keyword, filterBy, sortBy) {
        let { savedSearchActions } = this.props;

        savedSearchActions.resetFilterAndSorting();
        //hashHistory.push('/SearchResult/' + _keyword + '/' + _filterBy + '/' + _sortBy);
        if (keyword) {
            //basic search
            hashHistory.push('/SearchResult/recentsearch/' + keyword);
        } else {
            //Advanced search
            hashHistory.push('/SearchResult/recentsearch');
        }
        
        this.setState({ searchPatternData: this.props.reduxState.userSavedSearchList.data });
    },

    clearSavedSearchList: function (searchId) {
        let { savedSearchActions } = this.props;
        var recentSearchList = this.state.searchPatternData;
        var index = recentSearchList.findIndex(x => x.id == searchId);
        recentSearchList.splice(index, 1);

        this.setState({ searchPatternData: recentSearchList });
        savedSearchActions.discardSavedSearchList(searchId);
    },

   render: function () {
        var searchPatternContent;
        const searchPatternData = this.state.searchPatternData;
        const IsLoading = this.props.reduxState.userSavedSearchList.IsLoading;

        if (IsLoading) {
            searchPatternContent = <Spinner />;
        }
        else {
            if (searchPatternData == null || searchPatternData.length == 0) {
                searchPatternContent = <Box pad="medium" ><Heading tag="h3" align="start" style={pStyle}>{noSearchPattern}</Heading></Box>;
            }
            else {
                var searchPatternCount = searchPatternData.length;
                var showMenu;

                var pStyle = {
                    color: '#000000'
                };


                if (this.state.showMenu) {
                    showMenu = <LandingSidebar close={this.goMenu} />
                } else {
                    showMenu = null;
                }

                searchPatternContent =
                    searchPatternData.map((item, i) =>
                        <SearchPatternList key={item.id}
                            patternName={item.name}
                            searchQuery={item.searchQuery}
                            creationDate={item.creationDate}
                            advancedSearch={item.advanced}
                            handleSearch={() => this.handleSearch(i, item.searchQuery)}
                            deleteSearch={() => this.clearSavedSearchList(item.id)}
                            {...item}
                            />
                    );

            }


        }

        return (
            <App centered={true}>
                <PageHeader pageTitle={searchPatternTitle} showBackBtn={true} />
                <Section pad='none'>
                    {searchPatternContent}
                </Section>
                <FooterPadding />
                <FooterMain Source={searchPatternTitle.props.defaultMessage} />
            </App >


        );

    }

});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPattern);