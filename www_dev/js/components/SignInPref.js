import React from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { userLogout } from '../actions/userActions';

// utils
import { FormattedMessage } from 'react-intl';
import { hashHistory } from 'react-router';

// grommet components
import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';

// component
import CheckBoxesPref from './CheckBoxesPref';

// icon
const NextIcon = require('grommet/components/icons/base/Next');

const mapStateToProps = function(state){
  return {state};
};

const mapDispatchToProps = (dispatch) => ({
  userLogout: bindActionCreators({ userLogout }, dispatch)
});

var SignInPref = React.createClass({
  getInitialState: function() {
    return {
      keepMeLoggedIn: "false"
    };
  },
  userLogout: function() {
    this.props.userLogout.userLogout();
  },
  handleKeepMeLoggedIn: function() {
    if (this.state.keepMeLoggedIn == "true")
      this.state.keepMeLoggedIn = "false";
    else
      this.state.keepMeLoggedIn = "true";

    console.log("Keep me logged is clicked : ", this.state.keepMeLoggedIn);
    // todo save the keep me logged in option somewhere in the app
  },
	render: function() {
    return (
      <div>
        <Box direction="row" colorIndex="accent-2" pad="medium" justify="start">
          <Heading tag="h4" margin="none" strong={false}><FormattedMessage id="Sign In" defaultMessage="Sign In" /></Heading>
        </Box>
        <Box direction="row" colorIndex="light-1" pad="medium" justify="between" responsive={false} onClick={this.userLogout}>
          <FormattedMessage id="Sign Out" defaultMessage="Sign Out" />
          <div className="input-group-btn"> <NextIcon /> </div>
        </Box>
      </div>
    );
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SignInPref);