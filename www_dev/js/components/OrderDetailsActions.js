import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// Grommet components
import Box from 'grommet/components/Box';

// Components
import IconHelper from './IconHelper';
import WatchFlag from './WatchFlag';
import { removeWatchList } from '../actions/watchListActions';
import OrderDetailsSharing from './OrderDetailsSharing';


const assetType = 'com.hpe.prp.cpx.model.Order';
const mapDispatchToProps = (dispatch) => ({
	watchListActions: bindActionCreators({ removeWatchList }, dispatch)
});

class OrderDetailsActions extends React.Component {
	constructor() {
		super();
	}
	
	deleteItem(assetId) {
		let { watchListActions } = this.props;
		watchListActions.removeWatchList(assetId, assetType);
	}
	
	render() {
		const { isWatched } = this.props;
		return (
				<Box className="order-action-items" style={{width: '77px'}} direction="row" justify="between" responsive={false}>
					<OrderDetailsSharing order={this.props.order} itemsNotYetShipped={this.props.itemsNotYetShipped} shippedItems={this.props.shippedItems} deliveredItems={this.props.deliveredItems}/>
					<WatchFlag flagOn={isWatched} qtcuid={this.props.qtcuid} unwatchItem={() => this.deleteItem(this.props.qtcuid)} />
				</Box>
			);
    }
}

export default connect(null, mapDispatchToProps)(OrderDetailsActions)