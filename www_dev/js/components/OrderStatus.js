import React, { Component } from 'react';
import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';
import { FormattedMessage } from 'react-intl';
import App from 'grommet/components/App';
import LandingHeader from './LandingHeader';
import SearchBox from './SearchBox';

export default class OrderStatus extends Component {
	render () {
		const appTitle = (
			<FormattedMessage id="cpx_title_line" defaultMessage="CPX Order Status" />	
		);
		return (
			<App centered={true}>
                <LandingHeader />
                <Box direction="row" align="center">
                </Box>
                <SearchBox />
			</App>
		);
	}
};