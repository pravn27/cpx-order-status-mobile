import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';
import { hashHistory } from 'react-router';

//Grommet Components
import Box from 'grommet/components/Box';
import Search from 'grommet/components/icons/base/Search';
import Paragraph from 'grommet/components/Paragraph';

//Text
const SectionTitles = {
    search: (<FormattedMessage id="footer_search" defaultMessage="Search"/>)
};

var FooterSearch = React.createClass({
    
    searchredirect: function () {
        hashHistory.push('/SearchResult/basic/footeraction');
        //console.log(this.props.source);
    },

    render: function () {

        var filled = "img/icons/search_green.png";
        var grey = "img/icons/search_grey.png"

        return (
            <Box pad="none" align="center" justify="center" onClick={this.searchredirect} basis="small">
                <Box direction = "column" justify="center">
                    { this.props.Source == "Search" ? <div className="input-group-btn"><img src={filled} height="23" width="24" /></div> : <div className="input-group-btn"><img src={grey} height="23" width="24" /></div> }
                </Box>
                {this.props.Source == "Search" ? <div className="brand-color">{SectionTitles.search}</div> : <div className="footer-normal">{SectionTitles.search}</div>}
            </Box>
        );
    }
});

export default FooterSearch;