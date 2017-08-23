import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';
import { hashHistory } from 'react-router';

//Grommet Components
import Box from 'grommet/components/Box';
import History from 'grommet/components/icons/base/History';

//Text
const SectionTitles = {
    saved_searches: (<FormattedMessage id="footer_saved_searches" defaultMessage="Recent Searches" />),
};

export default class FooterSavedSearches extends Component {

    _gotoSavedSearches(e) {
       hashHistory.push('/SearchPattern');
    }

    render() {

        var filled = "img/icons/recent_green.png";
        var grey = "img/icons/recent_grey.png"

        return (
            <Box pad="none" align="center" justify="center" onClick={this._gotoSavedSearches} basis="small">
                <Box direction = "column" justify="center">
                    { this.props.Source == "Recent Searches" ? <div className="input-group-btn"><img src={filled} height="23" width="24" /></div> : <div className="input-group-btn"><img src={grey} height="23" width="24" /></div> }
                </Box>
                {this.props.Source == "Recent Searches" ? <div className="brand-color">{SectionTitles.saved_searches}</div> : <div className="footer-normal">{SectionTitles.saved_searches}</div>}
            </Box>
        );
    }
}