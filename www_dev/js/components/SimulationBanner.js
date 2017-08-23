// imports
import React from 'react';
import { hashHistory } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux'

// components
import Box from 'grommet/components/Box';
import Title from 'grommet/components/Title';
import Heading from 'grommet/components/Heading';
// CPX components
import IconHelper from './IconHelper';

import { exitSimulation } from '../actions/userActions';

var signOut = "img/icons/signout.png";

// Texts
const infoText = {
    title: (<FormattedMessage id='cpx_simulate_mode' defaultMessage="Simulation Mode" />),
    simulateExit: (<FormattedMessage id="cpx_simulate_exit" defaultMessage="Exit" />)
};

const mapDispatchToProps = (dispatch) => ({

  _exitSimulation: () => {
    dispatch( exitSimulation() );
    hashHistory.push('/');
    }
});


var SimulationBanner = React.createClass({
   
    render() {
        var {_exitSimulation} = this.props;

        return (
            <Box direction="row" colorIndex="accent-3" pad="medium" separator="horizontal" justify="between" responsive={false} >
                <Box direction="row"  pad="none" justify="start" responsive={false} >
                    <Title responsive={false} justify="start">
                        <Heading tag="h4" margin="none" align="start" style= {{ 'font-size': '20px'}}>
                            {infoText.title}
                        </Heading>
                    </Title>
                </Box>
                <Box direction="row"  pad="none" justify="end" responsive={false} >
                    <Title responsive={false} justify="end">
                        <Heading tag="h4" margin="none" align="end" style= {{ 'font-size': '20px'}}>
                            {infoText.simulateExit}
                        </Heading>
                        <Heading tag="h6" margin="none" align="start">
                            <Box onClick={_exitSimulation}>
                            <div className="input-group-btn" > <img src={signOut} height="24" width="24" /> </div>
                            </Box>
                        </Heading>
                    </Title>
                </Box>
            </Box>
        );
    }
});

export default connect(null, mapDispatchToProps)(SimulationBanner);