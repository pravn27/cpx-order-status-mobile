import React from 'react';
import ReactDOM from 'react-dom';

// utils
import { FormattedMessage } from 'react-intl';

// grommet components
import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';

// component
import CheckBoxesPref from './CheckBoxesPref';

var WatchListAlertPref = React.createClass({
  getInitialState: function() {
    return {
      alertPrefs: this.props.data
    };
  },
  createToggleList: function(toggleList) {
    return toggleList.map((toggle, i) =>
      <CheckBoxesPref key={i} id={"Alerts" + i} label={toggle.name} value={toggle.value} handleToggleChange={this.props.handleToggleChange}/>
    );
  },
  render: function() {
    return (
      <div>
        <Box direction="row" colorIndex="accent-2" pad="medium" justify="start">
          <Heading tag="h4" margin="none" strong={false}><FormattedMessage id="Watch List Alerts" defaultMessage="Watch List Alerts" /></Heading>
        </Box>
        { this.createToggleList(this.state.alertPrefs.list) }
      </div>
    );
  }
});

export default WatchListAlertPref;