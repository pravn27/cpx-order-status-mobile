import React, { Component } from 'react';
import ReactDOM from 'react-dom';

//Grommet Components
import Box from 'grommet/components/Box';

export default class Footer extends Component {

    render() {
        
        return (
            <Box direction="column" colorIndex="light-1" responsive={false} separator="top" pad={{ horizontal: "none", vertical: "small" }} style={{'height': '12vh'}}>
                <Box direction="row" colorIndex="light-1" responsive={false} justify="between" pad="small">
                    
                </Box>
            </Box>

        );
    }
}

