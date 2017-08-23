// React Imports
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { hashHistory } from 'react-router';

// Grommet Components
import Box from 'grommet/components/Box';
import Title from 'grommet/components/Title';
import Image from 'grommet/components/Image';
import Heading from 'grommet/components/Heading';

// Grommet Icons
// icons
const NextIcon = require('grommet/components/icons/base/Next');

// Custom Compnents
import IconHelper from './IconHelper';

// Utils
const 
  starInit = [0, 1, 2, 3, 4],
  starDefault = 'img/star/starDefault.png',
  stylo = {marginLeft: "5px", marginRight: "5px"},
  stylisto = {margin: "auto"};

var OrderDetailsFeedback = React.createClass({
  routeToOrderFeedbackPage: function (e, qtcuid) {
    e.preventDefault();
    hashHistory.push(`/OrderFeedbackPage/${qtcuid}`);
  },
  starDisplay: function() { 
    return starInit.map((i) => <img src={starDefault} width="20px" height="20px"/>);
  },
  displayContent : function() {
    return (
      <Box pad="medium" direction="row" align="center" separator="top"
        justify="between" tag="aside" responsive={false} colorIndex="light-1"
        onClick={(e) => this.routeToOrderFeedbackPage(e, this.props.qtcuid)}>
        <Box colorIndex="light-1" pad={{horizontal: "none", vertical: "none"}} margin={{horizontal: "none", vertical: "none"}} 
          flex="grow" separator="none" justify="center" responsive={false}>
          <Title responsive={false}>
            <Heading style={stylisto} tag="h3">
              <FormattedMessage id='order_details_feedback_text' defaultMessage="Rate your delivery experience" />
              <Box direction="row" colorIndex="light-1" pad="none" margin="none" separator="none" justify="center" responsive={false}>
                {this.starDisplay()}
              </Box>
            </Heading>
          </Title>
        </Box>
        <Title responsive={false}>
          <div className="input-group-btn"> <NextIcon /> </div>
        </Title>
      </Box>
    );
  },
	render() { return this.props.isAvailable ? this.displayContent() : null; }
});
export default OrderDetailsFeedback;