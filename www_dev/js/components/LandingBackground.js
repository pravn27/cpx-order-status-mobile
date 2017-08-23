import React from 'react';

// [Grommet Components]
import Box from 'grommet/components/Box';
import Title from 'grommet/components/Title';
import Heading from 'grommet/components/Heading';

// [Utils]
import { FormattedMessage } from 'react-intl';
import apiCommunicator from '../utils/apiCommunicator';
import { connect } from 'react-redux';

// Redux stuff
const mapStateToProps = ({ userInit }) => {
  return ({ 
    userName: `${userInit.data.profile.userFirst}` 
  });
};

var LandingBackground = React.createClass({
  getInitialState: function() {
    const welcome_text = ( <FormattedMessage id="landing_welcome_text" defaultMessage="Welcome," /> );

    return {
      'welcome_text' : welcome_text
    };
  },

  componentDidMount: function() {
    this.setState({
      'alert_no': 12
    });
  },
  render: function() {
    return (
      <Box direction="row" colorIndex="grey-3" size="large" align="end" wrap={true}

        style={{'position': 'relative', 'backgroundImage': 'url(img/splash/welcome_image.png)', 'backgroundPositionY': 'inherit', 'height': '50vw', 'width': '100%'}} 
        pad="medium" justify="start" responsive={true}>
        <Box style={{'position': 'absolute', 'bottom': '0.8em'}}>
           <Box responsive={false} wrap={true} >
            <Heading tag="h3" margin="none" strong={false} style={{'word-break': 'break-word'}}><span style={{"padding-right":"5px"}}>{this.state.welcome_text}</span><b>{this.props.userName}</b></Heading>
            </Box>
        </Box>
      </Box>
    );
  }
});

export default connect(mapStateToProps, null)(LandingBackground);
