import React, { Component } from 'react';
import SearchResult from './SearchResult';
import { hashHistory } from 'react-router';
import { FormattedMessage } from 'react-intl';
import Box from 'grommet/components/Box';
import IconHelper from './IconHelper';
import SearchInput from 'grommet/components/SearchInput';
import { connect } from 'react-redux'
import { resetFilterAndSorting } from '../actions/searchAction'
// var Search = require('grommet/components/icons/base/Search');
// var Close = require('grommet/components/icons/base/Close');
// var Microphone = require('grommet/components/icons/base/Microphone');
const searchPlaceholder = (<FormattedMessage id="cpx_search_placeholder" defaultMessage="Search for your order" />);

class SearchBox extends Component  {

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
        this.handleReturn = this.handleReturn.bind(this);

		this.state = {
			keyword: ""
		}
	}

	handleChange(e) {
		this.setState({keyword: e.target.value});
	}
    
    handleReturn(e) {        
        if(e.which && e.which === 13) {
            this.handleSearch(e);
        }
	}

	handleSearch(e){
		let {dispatch} = this.props;
		dispatch(resetFilterAndSorting());
		if (this.state.keyword && this.state.keyword.trim() != "") {
		    hashHistory.push('/SearchResult/basic/' + this.state.keyword);
			//console.log(this.state.keyword);
		}
	}

	render(){
		return (
			<div className="input-group" style={{borderBottom: "1px solid #767676"}}>
				<input type="text" className="form-control"
				value={this.state.query} placeholder={searchPlaceholder.props.defaultMessage} onChange={this.handleChange} onKeyPress={this.handleReturn}/>
				<div className="input-group-btn" onClick={this.handleSearch}><IconHelper iconName="Search" /></div>
				{/*<div className="input-group-btn"><IconHelper iconName="Microphone" /></div>*/}
			</div>
		);
	}
};

export default connect(null)(SearchBox);
