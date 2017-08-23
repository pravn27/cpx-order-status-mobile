import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';
import WatchListItem from './WatchListItem';
import { hashHistory } from 'react-router';
import { getWatchList, removeWatchList } from '../actions/watchListActions'
import { Spinner } from '../utils/commonComponents';

//Redux Components
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// grommet components
import Box from 'grommet/components/Box';
import Layer from 'grommet/components/Layer';
import Heading from 'grommet/components/Heading';
import Title from 'grommet/components/Title';

const assetType = 'com.hpe.prp.cpx.model.Order';
const mapStateToProps = (state) => ({
    reduxState: state
});

const mapDispatchToProps = (dispatch) => ({
    watchListActions: bindActionCreators({ getWatchList, removeWatchList }, dispatch)
});

var thisWatchList = this;

const WatchList = React.createClass({
    getInitialState: function () {
        return (
            {
                watchListData: null
            }
        )
    },

    componentDidMount() {

        var watchListData = this.props.watchlistData;
        this.setState({ watchListData: watchListData });
    },

    componentWillReceiveProps: function (nextProps) {

        var watchListData = this.props.watchlistData;
        this.setState({ watchListData: watchListData });

    },

    goToOrderDetails: function (watchListId) {
        this.props.retainFilter(true);
        hashHistory.push('/orderdetails/' + watchListId);
    },

    listing: function () {
        const watchlistData = this.props.watchlistData;
        if (watchlistData != undefined) {
            var that = this;
            return watchlistData.map(function (watchlistItem, i) {
                return <WatchListItem key={watchlistItem.asset.qtcuid}
                    watchlistData={watchlistItem.asset}
                    toggleFlag={() => { that.deleteItem(watchlistItem.asset.qtcuid); } } 
                    onWatchListClick={() => that.goToOrderDetails(watchlistItem.asset.qtcuid)}/>;
            });
        }
        else
            return null;
    },

    
    deleteItem: function (assetId) {
        let { watchListActions } = this.props;
        watchListActions.removeWatchList(assetId, assetType);
    },

    render: function () {

        return (
            <Box pad="none" direction="column" justify="between" tag="aside" responsive={false}>
                {this.listing()}
            </Box>
        );
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(WatchList);