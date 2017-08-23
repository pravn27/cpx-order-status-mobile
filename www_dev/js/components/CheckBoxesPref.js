import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'

// utils
import { FormattedMessage } from 'react-intl';

// grommet components
import Box from 'grommet/components/Box';
import CheckBox from 'grommet/components/CheckBox';

const defaultLabels = {
  ORDER_STATUS_CHANGE: "Order Status Changes",
  ORDER_CANCELED: "Order Cancellation",
  SHIPPING_UPDATE: "Shipping Updates",
  INVOICE_AVAILABLE: "Invoice Available"
};


const mapStateToProps = (state) => ({
    reduxState: state
});

var CheckBoxesPref = React.createClass({
  getInitialState: function() {
    return {
      id: this.props.id,
      label: this.props.label,
      value: this.props.value
    };
  },
  onChange : function() {
    if(this.state.value == "true")
      this.state.value = "false";
    else
      this.state.value = "true";

    this.props.handleToggleChange(this.state.label, this.state.value);
  },
  checkDefaultChecked: function(checked) {
    if (checked == "true")
      return true;
    else
      return false;
  },
  render: function() {
    const isSimulationMode = this.props.reduxState.userInit.userSimulation.simulationMode;
    var label = (<FormattedMessage id={this.state.label} defaultMessage={defaultLabels[this.state.label]} />);
    return (
      <Box pad="medium" colorIndex="light-1" justify="between" separator="bottom">
        <CheckBox id={this.state.id} defaultChecked={this.checkDefaultChecked(this.state.value)} onChange={this.onChange} label={label} toggle={true} reverse={true} disabled={isSimulationMode} />
      </Box>
    );
  }
});

export default connect(mapStateToProps, null)(CheckBoxesPref);