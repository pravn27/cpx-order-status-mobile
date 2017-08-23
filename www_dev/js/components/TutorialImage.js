import { connect } from 'react-redux';
import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import Title from 'grommet/components/Title';
import Heading from 'grommet/components/Heading';
// grommet
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Image from 'grommet/components/Image';
// userActions
import { skipOrDone } from '../actions/userActions';

const
	mapStateToProps = ({ userInit }) => {
		return({
 			userHasSkippedOrDoneTutorial: userInit.userHasSkippedOrDoneTutorial
		})
	},

	mapDispatchToProps = (dispatch) => {
			return ({
				onSkipOrDone: () => { dispatch( skipOrDone() ); }
			});
	},

	buttonStyle = {'font-size':'22px', 'padding-right':'15px','position':'relative','padding-bottom':'25px'};

class TutorialImage extends Component {
	render() {
    var onSkipOrDone = this.props.userHasSkippedOrDoneTutorial ? hashHistory.goBack : this.props.onSkipOrDone;
	const showDone = <Box align="center" style={{'margin-top':'-30px'}}>
						<Button className="tutorial-done-button" onClick={onSkipOrDone} primary={false} label="Done"/>
					</Box>;
	const showSkip = <Box align="end">
						<Button style={buttonStyle} fill={false} primary={false} accent={false} plain={true} onClick={onSkipOrDone} label="Skip"/>
					 </Box>;
		return(

			<div className="image-wrapper">
				<Image src={this.props.img} full={true} />
      			<div className="image-wrapper-header">
				  <Heading tag="h4" margin="none" strong={false}>{this.props.imgCaption1}</Heading>
				  <Heading tag="h4" margin="none" strong={false}>{this.props.imgCaption2}</Heading>
				</div>
				<div className="image-wrapper-footer">
				  <Heading tag="h4" margin="none" strong={true}>{this.props.footer}</Heading>
				</div>
       			{ this.props.lastImage ? showDone : showSkip }
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TutorialImage);
