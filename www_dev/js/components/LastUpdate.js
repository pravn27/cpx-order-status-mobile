import React from 'react';

// [Grommet Components]
import Box  from 'grommet/components/Box';
import Title  from 'grommet/components/Title';
import Heading  from 'grommet/components/Heading';
import Paragraph from 'grommet/components/Paragraph';

// [Utils]
import { FormattedMessage } from 'react-intl';

var LastUpdate = React.createClass({
  getInitialState: function() {
    return {
      title: (<FormattedMessage id="cpx_last_updated_title" defaultMessage="Order Status" />),
      subtitle: (<FormattedMessage id="cpx_powered_subtitle" defaultMessage="powered by HPE OSS" />)
    };
  },
  render() {
    return (
      <Box direction="row" colorIndex="accent-2" pad={{horizontal: "medium", vertical: "small"}} separator="horizontal" justify="between" responsive={true}>
        <Title responsive={false} style={{ alignItems: 'baseline' }}>
          <Heading tag="h3" margin="none" strong={true}>{this.state.title}</Heading>
          <Paragraph margin="none" size="small" style={{'marginBottom':'-0.5em'}}><i>{this.state.subtitle}</i></Paragraph>
        </Title>
      </Box>
    );
  }
});

export default LastUpdate;