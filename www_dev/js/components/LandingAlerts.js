import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl';
import { hashHistory } from 'react-router';
// grommet components
import Box from 'grommet/components/Box';
import Title from 'grommet/components/Title';
import Heading from 'grommet/components/Heading';

// actions
import { updateWatchListCount } from '../actions/userActions';

// icons
const NextIcon = require('grommet/components/icons/base/Next');

const mapStateToProps = ({ watchList }) => ({
  watchListCount: watchList.data.length
});

const LandingAlerts = React.createClass({
  getInitialState: function () {
    const alert_text = (<FormattedMessage id="main_alert_bar_text" defaultMessage="Watch List" />)
      , alert_label = (<FormattedMessage id="main_alert_bar_label" defaultMessage="New Alerts" />);

    return {
      'alert_text': alert_text,
      'alert_label': alert_label,
      'alertCount': 0
    };
  },
  
  componentWillMount: function() {
    let { dispatch } = this.props;
    dispatch ( updateWatchListCount() );
  }, 

  routeToWatchlist: function () {
    hashHistory.push('/WatchListPage');
  },

  routeToAlertlist: function () {
    hashHistory.push('/Alerts');
  },

  render: function () {

    const watchListCountText = this.props.watchListCount > 0 ? `(${this.props.watchListCount})` : '';

    return (
      <Box direction="row" colorIndex="light-1" pad="medium" separator="horizontal" justify="between" responsive={false} onClick={this.routeToWatchlist}>
        <Title responsive={false}>
          <img src={"img/icons/flagged.png"} className="alert-icon"/>
          <Heading tag="h4" margin="none" strong={false}>{this.state.alert_text} {watchListCountText}</Heading>
        </Title>
        <Title responsive={false}>
          <div className="input-group-btn"> <NextIcon /> </div>
        </Title>
      </Box>
    );
  }
});

export default connect(mapStateToProps)(LandingAlerts);