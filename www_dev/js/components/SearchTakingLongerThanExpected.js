import React from 'react';
import { FormattedMessage } from 'react-intl';
import Box  from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';
import Image from 'grommet/components/Image';
import Spinning from 'grommet/components/icons/Spinning';

const SearchTakingLongerThanExpected = React.createClass({
    getInitialState: () => {
        return {};
    },

    componentDidMount: () => {
    },

    render: () => {


        return (
            <Box align="center" alignContent="center" colorIndex="light-1" full={true}>
                <br />
                <Spinning />
                <Heading tag="h6">
                    <b><FormattedMessage id="search_taking_longer" defaultMessage="Active search is taking longer than expected" /></b>
                </Heading>
                <br />
            </Box>
        )
    }


}); 


export default SearchTakingLongerThanExpected;
