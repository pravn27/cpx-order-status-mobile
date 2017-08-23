import React from 'react';

// Grommet components
import Table from 'grommet/components/Table';
import Box from 'grommet/components/Box';

export default class DataListingTable extends React.Component {
  getRows() {
    return this.props.data.map((item, index) =>
      <tr key={index}>
        <td>{item.label}{item.label ? ':' : ''}</td>
        <td>{item.value}</td>
      </tr>
    );
  }

  render() {
    const rows = this.getRows();

    return (
      <Box direction="column" colorIndex="light-1" pad={this.props.pad} margin={this.props.margin} justify="between" separator={this.props.separator} responsive={false}>
        <Table className="data-listing-table">
          <tbody>
            {rows}
          </tbody>
        </Table>
      </Box>
      );
    }
}
