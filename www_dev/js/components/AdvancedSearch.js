import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import Heading from 'grommet/components/Heading';
import Title from 'grommet/components/Title';
import { FormattedMessage } from 'react-intl';
import Box from 'grommet/components/Box';
import AdvancedSearchPage from './AdvancedSearchPage';
import IconHelper from './IconHelper';

const advancedSearch = (<FormattedMessage id="cpx_advanced_search" defaultMessage="Advanced Search" />);

var AdvancedSearch = React.createClass({

	getInitialState: function(){
		return{
			showMenu: false
		}
	},

	handleAdvancedSearch: function() {
		hashHistory.push('/AdvancedSearchPage');
	},

                        // <Heading margin="none" tag="h4"><strong>{advancedSearch}</strong></Heading>
	render:function() {
		return(
			<Box className="advancedTitle" onClick={this.handleAdvancedSearch} pad="medium" direction="row" align="center" justify="between" tag="aside" responsive={false} colorIndex="light-1" >
                    <Title responsive={false}>
                    	<Heading margin="none" tag="h4" strong={true}>{advancedSearch}</Heading>
                    </Title>
                	<IconHelper iconName="Next" />
            </Box>
		);
	}
});


export default AdvancedSearch;
