import React from 'react';
import { FormattedMessage } from 'react-intl';
import { hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { userDeniedAccessRights } from '../actions/userActions';

// Grommet components
import App from 'grommet/components/App';
import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';

// Components
import LandingHeader from './LandingHeader';
import OrderDetailsBasic from './OrderDetailsBasic';
import PageHeader from './PageHeader';
import FooterPadding from './FooterPadding';
import FooterMain from './FooterMain';
import OrderDetailsInvoiceAvailability from './OrderDetailsInvoiceAvailability';
import OrderDetailsFeedback from './OrderDetailsFeedback';
import ShippingDetails from './ShippingDetails';
import ItemNotShippedList from './ItemNotShippedList';
import ShipmentList from './ShipmentList';
import OrderDetailsActions from './OrderDetailsActions';
import OrderSummary from './OrderSummary';
import AlertHistoryList from './AlertHistoryList';
import OrderLatestAlert from './OrderLatestAlert';
import EmailNotAvailablePopup from './EmailNotAvailablePopup';


// Utils
import apiCommunicator from '../utils/apiCommunicator';
import utilities from '../utils/utilities';
import { Spinner } from '../utils/commonComponents';

const labels = {
	pageTitle: (<FormattedMessage id="order_pageTitle" defaultMessage="Order details" />),
    deliveredItems: (<FormattedMessage id="order_delivered_items" defaultMessage="Delivered Items" />),
    dateDelivered: (<FormattedMessage id="order_dateDelivered" defaultMessage="Date Delivered" />),
    shippedItems: (<FormattedMessage id="Shipped Items" defaultMessage="Shipped Items" />),
    dateShipped: (<FormattedMessage id="Date Shipped" defaultMessage="Date Shipped" />)
};

const mapStateToProps = function(state){
  return {state};
}

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators({
    showUserDeniedAccessRights: userDeniedAccessRights
  }, dispatch)
}

class OrderDetailsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {order: null};
    }

    componentDidMount() {
        var doAsUser = this.props.state.userInit.userSimulation.simulatedUser;

        apiCommunicator
            .getOrderDetails(this.props.params.id, doAsUser)
            .then( resp => this.setState({order: resp.body}) )
            .catch(() => hashHistory.goBack());
    }

    componentWillUnmount() {
    }

    render() {
        let order = this.state.order;
        if (order) {
             //order = require("../../data/orderDetails.json"); // to test from mock data
            const notShippedShipmentList = utilities.getNotShippedList(order.orderDetails.items, ["Accepted", "Submited", "Production", "Canceled", "Cancelled"]);
            const shippedShipmentList = utilities.getShipmentList(order.orderDetails.shipments, order.orderDetails.items, "Shipped to Customer");
            const deliveredShipmentList = utilities.getShipmentList(order.orderDetails.shipments, order.orderDetails.items, "Delivered");
            const alertHistoryList = order.alertList.list.sort((a, b) =>  new Date(b.creationDate) - new Date(a.creationDate));

            return (
            <App centered={true}>
                <EmailNotAvailablePopup />
                <Section pad='none'>
                    <PageHeader pageTitle={labels.pageTitle} showBackBtn={true} />
                    <Box>
                        <OrderLatestAlert latestAlert={alertHistoryList} />

                        <Box direction="column" colorIndex="light-1" pad="medium" separator="horizontal" justify="between" responsive={false}>
                            <OrderDetailsActions isWatched={order.isWatched} qtcuid={order.orderDetails.qtcuid} order={order} itemsNotYetShipped={notShippedShipmentList} shippedItems={shippedShipmentList} deliveredItems={deliveredShipmentList}/>
                            <OrderDetailsBasic order={order} />
                        </Box>
                        <OrderSummary orderData={order}/>
                        <OrderDetailsInvoiceAvailability hasInvoices={order.orderDetails.invoice_status !== "Nothing Invoiced"} />
                        <OrderDetailsFeedback isAvailable={order.isRatingAvailable} qtcuid={order.orderDetails.qtcuid} />
                        <ShippingDetails order={order} />
                        { (notShippedShipmentList && notShippedShipmentList.length > 0) ? <ItemNotShippedList data={notShippedShipmentList} /> : null}
                        { (shippedShipmentList && shippedShipmentList.length > 0) ? <ShipmentList items={shippedShipmentList} accordionHeading={labels.shippedItems} typeLabel={labels.dateShipped} /> : null}
                        { (deliveredShipmentList && deliveredShipmentList.length > 0) ? <ShipmentList items={deliveredShipmentList} accordionHeading={labels.deliveredItems} typeLabel={labels.dateDelivered} /> : null}
                        { (alertHistoryList.length > 0) ? <AlertHistoryList alerts={alertHistoryList} isAlertsSubscribed={order.isAlertsSubscribed} qtcuid={order.orderDetails.qtcuid} /> : null }
                    </Box>
                    <FooterPadding />
					<FooterMain />
                </Section>
            </App>
            );
        } else {
            return (
            <App centered={true}>
                <Section pad='none' colorIndex="light-1">
                    <PageHeader pageTitle={labels.pageTitle} showBackBtn={true} />
                    <Spinner />
                    <FooterPadding />
					<FooterMain />
                </Section>
            </App>
            );
        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailsPage)
