import React from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';

// grommet components
import Box from 'grommet/components/Box';
import Title from 'grommet/components/Title';
import Heading from 'grommet/components/Heading';
import Headline from 'grommet/components/Headline';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Value from 'grommet/components/Value';

const AccountDetailsPref = React.createClass({
  getInitialState: function() {
    return {
      userEmail: this.props.data.userEmail,
      userCountry: this.props.data.userCountry
    }
  },
  render: function () {
    return (
    	<Box>
		  <Box pad="medium" align="start" justify="center" colorIndex="accent-2" separator="bottom">
		    <Title responsive={false}>
	          <Heading tag="h4" margin="none" strong={false}><FormattedMessage id="Account Details" defaultMessage="Account Details" /></Heading>
	        </Title>
		  </Box>
		  <Box pad="medium" align="start" justify="center" colorIndex="light-1" separator="bottom">
		  	<Title responsive={false}>
	          <Heading tag="h6" margin="none" strong={false}><FormattedMessage id="Signed-in as" defaultMessage="Signed-in as" /></Heading>
	        </Title>
	        <Title responsive={false}>
	          <Heading tag="h4" margin="none" strong={false} style={{'fontWeight':'400'}}>{ this.state.userEmail }</Heading>
	        </Title>
		    
		  </Box>
		  <Box pad="medium" align="start" justify="center" colorIndex="light-1" separator="bottom">
		    <Title responsive={false}>
	          <Heading tag="h6" margin="none" strong={false}><FormattedMessage id="Country" defaultMessage="Country" /></Heading>
	        </Title>
	        <Title responsive={false}>
	          <Heading tag="h4" margin="none" strong={false} style={{'fontWeight':'400'}}>{ this.state.userCountry }</Heading>
	        </Title>
		  </Box>
		</Box>
  		

    );
  }
  });
  export default AccountDetailsPref;