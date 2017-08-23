import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';
import { FormattedMessage } from 'react-intl';
import OrderList from './OrderList';
import SearchResult from './SearchResult';
import { formatDatetime } from '../utils/utilities';
import { connect } from 'react-redux'

// grommet components
import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import Title from 'grommet/components/Title';
import Heading from 'grommet/components/Heading';
import Layer from 'grommet/components/Layer';
import Tiles from 'grommet/components/Tiles';
import Tile from 'grommet/components/Tile';
import Headline from 'grommet/components/Headline';
import Timestamp from 'grommet/components/Timestamp';
import Close from 'grommet/components/icons/base/Close';

import Swipeout from 'rc-swipeout';

// icons
import IconHelper from './IconHelper';

var filterBy = [];
var sortBy;
var sortByAsc;
var sortByDesc;
var advancedSearch = "img/icons/advancedSearch.png";

const mapStateToProps = (state) => ({
    reduxState: state
});

var SearchPatternList = React.createClass({
    getInitialState: function () {
        return (
            {
            }
        );
    },

	deleteSearchItem : function () {
		this.props.deleteSearch();
	},

	render() {
		const isSimulationMode = this.props.reduxState.userInit.userSimulation.simulationMode;

		return (
			<Swipeout autoClose= {true} right= { isSimulationMode ? [] : [{ text: 'Remove', onPress: () => {this.deleteSearchItem()}, style: { backgroundColor: 'red', color: 'white', 'font-size': '17px' } }]}>
				<Box direction="row" colorIndex="light-1" pad="small" separator="horizontal" justify="between" responsive={false} style={{ cursor: "pointer" }} onClick={this.props.handleSearch}>
					<Box direction="row" basis="1/2" colorIndex="light-1" pad="small" justify="start" responsive={false} style={{width:"6em"}}>
							<Heading tag="h2" margin="none" className="alert-label-bold elip" align="start">
								{this.props.patternName == '' ? '' : this.props.patternName}
							</Heading>
					</Box>
					<Box direction="row" basis="1/2" colorIndex="light-1" pad="small" justify="between" responsive={false}>
						<Box basis="xlarge" direction="row" colorIndex="light-1" pad="none" justify="start" responsive={false} >
							<Title responsive={false} justify="end">
								<Heading className="default-text recentSearchDatetime" margin="none" align="start">
									{formatDatetime(this.props.creationDate)}
								</Heading>
							</Title>
						</Box>
						<Box basis="xsmall" direction="row" colorIndex="light-1" pad="none" justify="center" align="start" responsive={false} >
							<Title responsive={false} justify="between">
								<Heading tag="h6" margin="none" align="start">
									{this.props.advancedSearch ? <div className="input-group-btn"> <img src={advancedSearch} height="24" width="24" /> </div> : ' '}
								</Heading>
							</Title>
						</Box>
					</Box>
				</Box>
			</Swipeout>
		);
	}
});

export default connect(mapStateToProps, null)(SearchPatternList);
