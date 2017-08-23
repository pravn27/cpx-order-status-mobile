import React, { Component } from 'react';
import { hashHistory } from 'react-router';

//Redux Components
import { searchAction, keepResultAction, resetFilterAndSorting } from '../actions/searchAction'
import { connect } from 'react-redux'

import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Title from 'grommet/components/Title';
import App from 'grommet/components/App';
import Tiles from 'grommet/components/Tiles';
import Tile from 'grommet/components/Tile';
import Anchor  from 'grommet/components/Anchor';
import Menu from 'grommet/components/Menu';
import Section  from 'grommet/components/Section';
import LandingSidebar from './LandingSidebar';
import OrderList from './OrderList';
import LandingPage from './LandingPage';
import { FormattedMessage } from 'react-intl';
import FilterSortMenu from './FilterSortMenu';
import Box from 'grommet/components/Box';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import AdvancedSearch from './AdvancedSearch';
import IconHelper from './IconHelper';
import PageHeader from './PageHeader';
import FooterMain from './FooterMain';
import FooterPadding from './FooterPadding';
import { Spinner } from '../utils/commonComponents';

//add by yujie
import SearchTakingLongerThanExpected from './SearchTakingLongerThanExpected'
import ReactScrollPagination from './ReactScrollPagination';
var orderData = require('../../data/searchOrderList.json');
var Paragraph = require('grommet/components/Paragraph');
var Image = require('grommet/components/Image');
import apiCommunicator from '../utils/apiCommunicator';
import { userLostInternetConnection } from '../actions/userActions';

// utils
import { tracking } from '../utils/utilities';

const searchTitle = (<FormattedMessage id="cpx_search_title" defaultMessage="Search" />);
const searchTips = (<FormattedMessage id="cpx_search_tips" defaultMessage="Tips for searching:" />);
const searchSubTips = (<FormattedMessage id="cpx_search_tips_subTips" defaultMessage="Search for your HPE Orders using:" />);
const searchaSubTips = (<FormattedMessage id="cpx_search_tips_asubTips" defaultMessage="HPE Order Number" />);
const searchcSubTips = (<FormattedMessage id="cpx_search_tips_csubTips" defaultMessage="PO Number" />);
const searchpSubTips = (<FormattedMessage id="cpx_search_tips_psubTips" defaultMessage="Customer Name" />);
const searchoSubTips = (<FormattedMessage id="cpx_search_tips_osubTips" defaultMessage='If using Customer Name, include only the Primary Name of the company (e.g. "Company" not "Company Inc.")'/>);
const searchNoResult = (<FormattedMessage id="cpx_search_noSearchResult" defaultMessage="No search results found" />);
const searchPlaceholder = (<FormattedMessage id="cpx_search_placeholder" defaultMessage="Search for your order" />);
const orderNumber = (<FormattedMessage id="cpx_search_orderNumber" defaultMessage="Order Number:" />);
const orderStatus = (<FormattedMessage id="cpx_search_orderStatus" defaultMessage="Order Status:" />);
const plannedDelivery = (<FormattedMessage id="cpx_search_plannedDelivery" defaultMessage="Planned Delivery:" />);

//Redux connect
const mapStateToProps = (state) => ({
    reduxState: state
});

var SearchResult = React.createClass({
    //add by yujie, for pagination
    isolate: {
        pageNo: 0,
        isRequesting: false,
        totalPages: 20 //this is a default number and not for pagination limitation use
    },

	getInitialState: function(){
		return{
            isAdvancedSearch: false, //is advanced search action
            isSortAndFilter: false, // is sort or filter action
			query: "",
			filteredData: null,
            searchPatternFilter: [],
            searchPatternSort: [],
			showMenu: false,
			showFilterSortMenu: false,
			showDescend: true,
            //add by yujie, for pagination
            total: 0, //for pagination old logic use
            totalNum: 0, //  for display total number in page use
            nextPageData: null,
            //timeout
            timeout: false
		}
	},

    buildAdvancedSearchTerm(searchString) {
        return {
            shipToAddress: searchString.advancedSearch_shipToAddressString||null,
            hpeProductNumber: searchString.advancedSearch_hpeProductNumberString||null,
            orderDateIsUsed: (searchString.advancedSearch_orderStartDate||searchString.advancedSearch_orderEndDate)?true:false,
            shipmentDateIsUsed: (searchString.advancedSearch_shipStartDate||searchString.advancedSearch_shipEndDate)?true:false,
            deliveryDateIsUsed: (searchString.advancedSearch_deliveryStartDate||searchString.advancedSearch_deliveryEndDate)?true:false,
        };
    }, 

    //Get first page
    _onSearchResponse(res) {
        var result = res.body;
        var filteredData = result.list;

        var searchObject = 
            {
                searchType: this.props.params.type, 
                searchedString: this.state.query !== "" ? this.state.query : //check for empty string
                    (
                        this.props.params.keyword || JSON.stringify(this.buildAdvancedSearchTerm(this.props.reduxState.advancedSearch))
                    ),
                searchResultCount: result.total
            };
        var totalNum = result.total;
        
        tracking('SearchResult', this.props.reduxState.userInit.data.profile.analytics, searchObject);

        this.setState({
            filteredData: filteredData,
            timeout: false,
            totalNum: totalNum
        }, () => {
            this._paginationOrNot();
            if (this.props.params.filter ) {
                var filterArray = [];
                filterArray = this.props.params.filter.split(",");
                this.filterSortApply(filterArray, this.props.params.sort);
            }
        });
    },
    
    //Get the next page
    _onSearchResponseNextPage(res) {
        var result = res.body;
        var filteredData = result.list;
        var totalNum = result.total;
        
        if(filteredData.length > 0) {
            let newData = this.state.filteredData.concat(filteredData);
            this.setState({
                filteredData: newData,
                timeout: false,
                totalNum: totalNum
            }, ()=> this._paginationOrNot());
        } else {
            //if length ==0; it means no more page again.
            this.setState({
                timeout: false
            });
        }
    },
    
    _paginationOrNot() {
        //console.log("yujietest: _paginationOrNot");
        this.setState({
            total: this.state.filteredData.length
        }, ()=> {
            if( this.state.total % 20 > 0  ) {
                this.isolate.isRequesting = true; //no need pagination
                //console.log("yujietest:_paginationOrNot: no pagination");
            } else {
                this.isolate.isRequesting = false;
                //console.log("yujietest:_paginationOrNot: need pagination");
            }
        }
        );        
        //console.log("yujietest:total:"+this.state.filteredData.length);
        
        //keep sort and filter status
        var currentState = {
            filterText: this.state.filterText,
            sortText: this.state.sortText,
            sortOrder: this.state.showDescend == true ? 'desc': 'asc'
        };
        let { dispatch } = this.props;
        dispatch(keepResultAction(currentState));   
    },
    
    _nextPage: function(isAdvanced, isNext) {
        //console.log("yujietest: _nextPage");
        //console.log("yujietest:"+this.state.query);
        var filter = null, sort = null;
        
        //var filterItems = ["Submitted", "Accepted", "In Production", "Shipped", "Delivered", "Cancelled"];
		//var sortItems = ["Ship To Name", "Ship Date"];
        //Map to ["Submitted", "Accepted", "Production", "Shipped", "Delivered", "Cancelled"];
		//Map to ["customer_name", "ship_date"];
        
        //{ "criteria":   {  key: "term", type: "TERM", value: "Ingram Micro" } , 
        //filters: [{ key:"order_status", type: "ARRAY’", value: ["Submitted","Accepted"]}], sort: {field: "customer_name", direction: "asc"} }

        var filterText = null, sortText = null;
        var keepState = this.props.reduxState.keepResultReducer;
        //if(keepState) {
        //    console.log("yujietest:keepState:"+JSON.stringify(keepState));
        //} else {
        //    console.log("yujietest:nothing:"+JSON.stringify(keepState));
        //}
        if( this.state.filterText ){
            //Get current
            filterText = JSON.stringify(this.state.filterText);
            filterText = filterText.replace("In Production","Production");
            filterText = filterText.replace("Shipped","\\\"Shipped to Customer\\\"");
            filterText = filterText.replace("Cancelled","Canceled");
            filterText = JSON.parse(filterText);
        } else {
            //if current not here, get from redux
            if( keepState.filterText ) {
                filterText = JSON.stringify(keepState.filterText);
                filterText = filterText.replace("In Production","Production");
                filterText = filterText.replace("Shipped","\\\"Shipped to Customer\\\"");
                filterText = filterText.replace("Cancelled","Canceled");
                filterText = JSON.parse(filterText);
                this.setState({
                    filterText: keepState.filterText,
                });
            }
        }
        if(this.state.sortText ) {
            sortText = JSON.stringify(this.state.sortText);
            sortText = sortText.replace("Ship To Name","ship_to_name");
            sortText = sortText.replace("Ship Date","ship_date");
            sortText = sortText.replace("\"","");
            sortText = sortText.replace("\"","");
        } else {
            //if current not here, get from redux
            if( keepState.sortText ) {
                sortText = JSON.stringify(keepState.sortText);
                sortText = sortText.replace("Ship To Name","ship_to_name");
                sortText = sortText.replace("Ship Date","ship_date");
                sortText = sortText.replace("\"","");
                sortText = sortText.replace("\"","");
                this.setState({
                    sortText: keepState.sortText,
                });
            }
        }
        
        //console.log("yujietest:sortText:"+this.state.sortText+":filterText:"+this.state.filterText);
        
        if (filterText == null ) {        
            //Do nothing
        } else {
            filter = [{ key:"order_status", type: "ARRAY", value: filterText}]
        }
        
        if(sortText == null ) {
            //Do nothing
        } else {
            sort = {field: sortText, direction: this.state.showDescend == true ? 'desc': 'asc'}
        }        
        
        var start = (this.isolate.pageNo ) * 20;
        var end =  (this.isolate.pageNo ) * 20 + 19;
        

        let thenFn = isNext ? 
            this._onSearchResponseNextPage // next page
            : this._onSearchResponse; // first page
        
        var doAsUser = this.props.reduxState.userInit.userSimulation.simulatedUser;

        if(isAdvanced == false) {
            apiCommunicator
                .searchOrders(this.state.query, filter, sort, start, end, doAsUser)
                .then(thenFn)
                .catch( (e) => {
                    this.setState({ timeout: true }) 
                });
        } else {
            var advancedSearch  = this.props.reduxState.advancedSearch;
            apiCommunicator
                .advancedSearchOrders(advancedSearch,filter, sort, start, end, doAsUser)
                .then(thenFn)
                .catch( () => { 
                    this.setState({ timeout: true }) 
                });
        }
    },

    //add by yujie
    getNextPage: function () {
        //console.log("yujietest: getNextPage");
        //console.log("yujietest:"+this.state.query);
        //if (this.isolate.isRequesting || (this.isolate.pageNo > 0 && this.isolate.pageNo >= this.isolate.totalPages-1 )) {
        if (this.isolate.isRequesting) {
          // if requested or page number is to the last page, it will not request again.
          return;
        } 
        
        //means current action not sort and filter
        //it used for display loading screen
        this.setState({
            isSortAndFilter: false
        });
        
        this.isolate.isRequesting = true; //avoid call getNextPage multiple at the same time
        
        setTimeout( ()=> {
            this.setState({
                timeout: true
            });
        }, 10);
        
        this.isolate.pageNo ++;
        
        if (this.state.isAdvancedSearch == false) {
            //console.log("yujietest:getNextPage:isAdvancedSearch:"+this.state.isAdvancedSearch);
            this._nextPage(false, true);
		} else {
            //console.log("yujietest:getNextPage:isAdvancedSearch:"+this.state.isAdvancedSearch);
            this._nextPage(true, true);
		}
    },

    _checkEmpty: function (map) {
        //console.log("yujietest: _checkEmpty");
        //console.log("yujietest:"+this.state.query);
        for(var key in map) {
            if (map.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    },
    
    //entry from componentDidMount or sortby or filter
    _componentDidMount: function() {
        if (this.state.isAdvancedSearch == false) {
            //basic search
			this.search(this.props.params.keyword);
		} else {
            //If no advancedSearch criteria, it means the page is started from back, or footer or other functions
            //So no need action to WS api
            var advancedSearch  = this.props.reduxState.advancedSearch;
            //console.log("yujietest:" + JSON.stringify(advancedSearch));
            if(this._checkEmpty(advancedSearch) == true) {
                return;
            } /*else {
                if(advancedSearch.advancedSearch_searched == true) {
                    //new advanced search
                    advancedSearch.advancedSearch_searched = false;
                } else {
                    //back
                    return;
                }
            }*/
            
            setTimeout( ()=> {
                this.setState({
                    timeout: true
                });
            }, 10);

            //total record is 0 and pageNo is 0
            this.setState({
                total: 0
            });
            this.isolate.pageNo=0;
            this.isolate.isRequesting = true;
            this._nextPage(true, false);
            
            if (this.props.params.filter != "") {
                this.setState({
                    searchPatternFilter: this.props.params.filter
                });
            }
            if (this.props.params.sort != "") {
                this.setState({
                    searchPatternSort: this.props.params.sort
                });
            }
		}
    },
    
    //entry from landing page or advanced page or recent page
	componentDidMount: function() {
         if (this.props.params.keyword) {
            //landing page or recent page or footer
            if(this.props.params.keyword == 'footeraction') {
                //if from footer, no action need
                return;
            }
            this.setState({
                isAdvancedSearch: this.props.params.type == "advanced" || (this.props.params.type == "recentsearch" && !this.props.params.keyword),
                isSortAndFilter: false,
                showDescend: this.props.reduxState.keepResultReducer.sortOrder && this.props.reduxState.keepResultReducer.sortOrder === 'desc'
            }, ()=> this.search(this.props.params.keyword));
		} else {
            //advanced page or recent page
            this.setState({
                isAdvancedSearch: this.props.params.type == "advanced" || (this.props.params.type == "recentsearch" && !this.props.params.keyword),
                isSortAndFilter: false,
                showDescend: this.props.reduxState.keepResultReducer.sortOrder && this.props.reduxState.keepResultReducer.sortOrder === 'desc'
            }, ()=> this._componentDidMount());            
        }
	},
    
    // entry from search result click button
    doSearch: function(e) {
        this.resetFilter();
		let queryText = this.state.query;
		if ( queryText ) {
            this.setState({
                isAdvancedSearch: false,
                isSortAndFilter: false
            }, ()=> this.search(queryText));
            //this.props.params.keyword = queryText;
            hashHistory.push('/SearchResult/basic/' + queryText); // add search history for goback using.
		}        
	},

	search: function(queryText) {
        if(this.state.isSortAndFilter == false) {
            if (queryText) {
            } else {
                //queryText is empty 
                this.setState({
                    query: queryText,
                    filteredData: []
                });
                return;
            }
        } else {
            //for sort and filter, it from _component and not params.keyword so queryText will be empty
            queryText = this.state.query;
        }
        
        setTimeout( ()=> {
            this.setState({
              timeout: true
            });
        }, 10);
      
        this.isolate.pageNo=0;
        this.isolate.isRequesting = true;
        this.setState({
            query: queryText,
            total: 0
        }, ()=> this._nextPage(false, false));
	},
    
    sortBy: function(sortText) {
        //console.log("yujietest: sortBy");
        //console.log("yujietest:"+this.state.query);
        if(sortText) {
            //do nothing
        } else {
            sortText = "Ship To Name"; //default
        }
        if(this.state.showDescend){
            this.setState({
                showDescend: false,
                isSortAndFilter: true,
                sortText: sortText
            },()=>this._componentDidMount());
        }else{
            this.setState({
                showDescend: true,
                isSortAndFilter: true,
                sortText: sortText
            }, ()=>this._componentDidMount());
        }
	},
    
    filterSortApply: function (filterText,sortText) {
        //console.log("yujietest: filterSortApply");
        //console.log("yujietest:"+this.state.query);
        this.setState({			
			filterText:filterText,
			sortText:sortText,
            isSortAndFilter: true
		}, ()=>this._componentDidMount());
	},

    resetFilter: function () {
       let { dispatch } = this.props;
        dispatch(resetFilterAndSorting());
        let currentState = {
            filterText: undefined,
            sortText: undefined,
            showDescend: undefined
        }
        dispatch(keepResultAction(currentState));
        this.setState(currentState);
    },

	goMenu: function() {
		if(this.state.showMenu){
            this.setState({showMenu: false});
        }else{
            this.setState({showMenu: true});
        }
	},

	goFilterSortMenu: function() {
		if(this.state.showFilterSortMenu){
            this.setState({showFilterSortMenu: false});
        }else{
            this.setState({showFilterSortMenu: true});
        }
	},

	goBack: function(){
		// hashHistory.goBack();
		hashHistory.push('/LandingPage');
	},

	handleChange: function(e){
		var query = e.target.value
		this.setState({
			query,
			filteredData: null
		});
	},
    
    handleReturn: function(e) {        
        if(e.which && e.which === 13) {
            this.doSearch(e);
            this.hideKeyboard();
        }
	},
    
    hideKeyboard: function(e) {        
        var field = document.createElement('input');
        field.setAttribute('type', 'text');
        //field.setAttribute('style', 'width:1px');
        //field.style['width'] = '1px';
        field.setAttribute('style', 'width:1px;position:absolute; top: 0px; opacity: 0; -webkit-user-modify: read-write-plaintext-only; left:0px;');
        //var fieldfather = document.getElementById('searchboxdiv');
        //fieldfather.appendChild(field);
        document.body.appendChild(field);

        setTimeout(function() {
            field.focus();
            setTimeout(function() {
                field.setAttribute('style', 'display:none;');
                setTimeout(function() {
                    //fieldfather.removeChild(field);
                    document.body.removeChild(field);
                }, 1);
            }, 1);
        }, 1);
	},

	clear: function() {
		this.setState({
			query:"",
			filteredData: null
		});
	},

	render:function() {
		var searchResult;
		var resultString;
        var nextPageWaiting;
		var showX;
        var showY;
		var showMenu;
		var style = {
			fontWeight: 'bold',
			color: '#000000'
		};
        var kStyle = {
            fontWeight: 'bold',
            color: '#000000',
            width: 144
        };
		var pStyle = {
			color: '#000000'
		};

        var filterItems = ["Submitted", "Accepted", "In Production", "Shipped", "Delivered", "Cancelled"];
		var sortItems = ["Ship To Name", "Ship Date"];

		let {
			filteredData
		} = this.state;

        let {
            timeout
        } = this.state;
        
        let {
            isSortAndFilter
        } = this.state;
        
        let {
            isAdvancedSearch
        } = this.state;

        // "Ingram"
        // Advanced Search
        var recordCountContent = "";
        
        if( isAdvancedSearch ) {
            recordCountContent = "";
        } else {    
            recordCountContent =  <span>&nbsp;{"for"}&nbsp;<span style={style}>{this.state.query}</span></span>
        }
		if (filteredData == null) {
            if(timeout==false) {
                searchResult = <Box pad="medium" colorIndex="light-1">
                    <Heading margin="small" tag="h3" style={{lineHeight:1.5}}>{searchTips}</Heading>
                    <Box pad="none" colorIndex="light-1" className="list">
                        <Heading tag="h5" margin="none" strong={true}>{searchSubTips}</Heading>
                        <List>
                            <ListItem>
                                <Heading tag="h5" margin="none"><span style={{marginRight:10}}>{String.fromCharCode(9679)}</span>{searchaSubTips}</Heading>
                                <Heading tag="h5" margin="none"><span style={{marginRight:10}}>{String.fromCharCode(9679)}</span>{searchcSubTips}</Heading>
                                <Heading tag="h5" margin="none"><span style={{marginRight:10}}>{String.fromCharCode(9679)}</span>{searchpSubTips}</Heading>
                            </ListItem>
                        </List>
                            <Heading tag="h5" margin="none">{searchoSubTips}</Heading>
                    </Box>
                </Box>
            } else {
                //for not data
                searchResult = <Spinner />
            }
		} else if (filteredData.length == 0) {
            if (isAdvancedSearch) {
                searchResult = <Box colorIndex="light-1" pad="medium" ><Heading tag="h3" align="start" style={pStyle}>{searchNoResult}</Heading></Box>;
                resultString =  <div className="resultContainer">            
                <div>
                    <div className="result">
                        <span style={style}>{this.state.totalNum}&nbsp;</span>
                        <span style={pStyle}>Results</span>
                        {recordCountContent}
                    </div>
                    <div className="icon">
                        <span className="filter" onClick={this.goFilterSortMenu} ><IconHelper iconName="Filter" /></span>
                            { this.state.showFilterSortMenu ? <FilterSortMenu close={this.goFilterSortMenu} apply={ this.filterSortApply} filterBy={this.state.filterText} filters={filterItems} sort={sortItems} reset={this.resetFilter} /> : null }
                            { this.state.showDescend ? <span className="descend" onClick={() => this.sortBy(this.state.sortText) }><IconHelper className="descend" iconName="Descend" /></span> : <span className="ascend" onClick={ () => this.sortBy(this.state.sortText) }><IconHelper className="ascend" iconName="Ascend" /></span>}
                    </div>
                    </div>
                 </div>
            } else {
                resultString =  <div className="resultContainer">            
                <div>
                    <div className="result elip" style={{width:250}}>
                        <span style={style}>{this.state.totalNum}&nbsp;</span>
                        <span style={pStyle}>Results</span>
                        {recordCountContent}
                    </div>
                    <div className="icon">
                        <span className="filter" onClick={this.goFilterSortMenu} ><IconHelper iconName="Filter" /></span>
                            { this.state.showFilterSortMenu ? <FilterSortMenu close={this.goFilterSortMenu} apply={ this.filterSortApply} filterBy={this.state.filterText} filters={filterItems} sort={sortItems} reset={this.resetFilter} /> : null }
                            { this.state.showDescend ? <span className="descend" onClick={() => this.sortBy(this.state.sortText) }><IconHelper className="descend" iconName="Descend" /></span> : <span className="ascend" onClick={ () => this.sortBy(this.state.sortText) }><IconHelper className="ascend" iconName="Ascend" /></span>}
                    </div>
                    </div>
                 </div>
                searchResult = <Box colorIndex="light-1" pad="medium" ><Heading tag="h3" align="start" style={pStyle}>{searchNoResult}</Heading></Box>;
            }
		} else {
            if( timeout ) {
                if(isSortAndFilter) {
                    //for  filter and sort
                    searchResult = <Spinner />
                    nextPageWaiting ='';
                } else {
                    //for next page
                    searchResult = <OrderList orderData={this.state.filteredData} searchType = {this.props.params.type}/>
                    nextPageWaiting = <Spinner />
                }
            } else {
                searchResult = <OrderList orderData={this.state.filteredData} searchType = {this.props.params.type}/>
                nextPageWaiting ='';
            }           
			resultString =  <div className="resultContainer">            
			<div>
					<div className="result">
						<span style={style}>{this.state.totalNum}&nbsp;</span>
						<span style={pStyle}>Results</span>
                        {recordCountContent}
					</div>
					<div className="icon">
						<span className="filter" onClick={this.goFilterSortMenu} ><IconHelper iconName="Filter" /></span>
							{ this.state.showFilterSortMenu ? <FilterSortMenu close={this.goFilterSortMenu} apply={ this.filterSortApply} filterBy={this.state.filterText} filters={filterItems} sort={sortItems} reset={this.resetFilter} /> : null }
							{ this.state.showDescend ? <span className="descend" onClick={() => this.sortBy(this.state.sortText) }><IconHelper className="descend" iconName="Descend" /></span> : <span className="ascend" onClick={ () => this.sortBy(this.state.sortText) }><IconHelper className="ascend" iconName="Ascend" /></span>}
					</div>
				</div>
			</div>
		}

		if (this.state.query ){
			showX = <Box className="input-group-btn" style={{cursor:"pointer"}} onClick={this.clear}><img src="img/icons/clear.png" height="16" width="16" /></Box>;
		} else {
			showX = null;
		}

		if (this.state.showMenu) {
			showMenu = <LandingSidebar close={this.goMenu} />;
		} else {
			showMenu = null;
		}

		return(
			<App centered={true}>
                <PageHeader pageTitle={searchTitle} showBackBtn={true} />
				<Section pad='none' className="search-result">
					<div className="input-group" style={{borderBottom: "1px solid #000000"}}>
						<input type="text" className="form-control"
						value={this.state.query} placeholder={searchPlaceholder.props.defaultMessage} onChange={this.handleChange} onKeyPress={this.handleReturn}/>
						{showX}
                        <div className="input-group-btn" onClick={this.doSearch}><IconHelper iconName="Search" /></div>
                        {/*<div className="input-group-btn"><IconHelper iconName="Microphone" /></div>*/}
					</div>
					{resultString}
                	<AdvancedSearch />
                    <div>
					{searchResult}
                    {nextPageWaiting}
                    <Box colorIndex="light-1" direction="column">
                        <br/>
                        <br/>
                        <br/>
                    </Box>
                    <ReactScrollPagination
                        fetchFunc={this.getNextPage}
                      totalPages={this.isolate.totalPages}
                    />
                    </div>                    
                    {/*<FooterPadding />*/}
					<FooterMain Source={searchTitle.props.defaultMessage} />
				</Section>
			</App>
		);
	}
});


//export default SearchResult;
export default connect(mapStateToProps)(SearchResult);
