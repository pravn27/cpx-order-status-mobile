import React, { Component } from 'react';
import PageHeader from './PageHeader';
import { FormattedMessage } from 'react-intl';
import Carousel from 'grommet/components/Carousel';
import App from 'grommet/components/App';
import TutorialImage from './TutorialImage';
import MyCarousel from './MyCarousel';

const tutorialTitle = (<FormattedMessage id='cpx_support_tutorial' defaultMessage="Tutorial" />);
const img1Caption1 = (<FormattedMessage id='img1Caption1' defaultMessage="Learn how to use HPE Go Order Status" />);
const img1Caption2 = (<FormattedMessage id='img1Caption2' defaultMessage="in just a few easy steps." />);
const img2Caption1 = (<FormattedMessage id='img2Caption1' defaultMessage="Search for an order using PO Number," />);
const img2Caption2 = (<FormattedMessage id='img2Caption2' defaultMessage="in just a few easy steps." />);
const img3Caption1 = (<FormattedMessage id='img3Caption1' defaultMessage="Tap the flag to add or remove an" />);
const img3Caption2 = (<FormattedMessage id='img3Caption2' defaultMessage="order to Watch List." />);
const img4Caption1 = (<FormattedMessage id='img4Caption1' defaultMessage="Tap the email icon to share Order Details." />);
const img4Caption2 = (<FormattedMessage id='img4Caption2' defaultMessage=" " />);
const img5Caption1 = (<FormattedMessage id='img5Caption1' defaultMessage="Go to main menu in top left of screen" />);
const img5Caption2 = (<FormattedMessage id='img5Caption2' defaultMessage="to change your alert preferences." />);
const img1Footer = (<FormattedMessage id='img1Footer' defaultMessage="Swipe to Get Started" />);
const img2Footer = (<FormattedMessage id='img2Footer' defaultMessage="Swipe to see more" />);

class Tutorial extends Component {
	render(){
  	return(
				<App>
					<PageHeader pageTitle={tutorialTitle} showBackBtn={false} hideMenuBtn={true}/>
					<MyCarousel autoplay={false} style={{'background-color':'#f0f0f0'}} infinite={false}  slideInfinite={false} >
						<TutorialImage img='./img/tutorial/img1.png' imgCaption1={img1Caption1} imgCaption2={img1Caption2} footer={img1Footer} lastImage={false}/>
						<TutorialImage img='./img/tutorial/img2.png' imgCaption1={img2Caption1} imgCaption2={img2Caption2} footer={img2Footer} lastImage={false}/>
						<TutorialImage img='./img/tutorial/img3.png' imgCaption1={img3Caption1} imgCaption2={img3Caption2} footer={img2Footer} lastImage={false}/>
						<TutorialImage img='./img/tutorial/img4.png' imgCaption1={img4Caption1} imgCaption2={img4Caption2} footer={img2Footer} lastImage={false}/>
						<TutorialImage img='./img/tutorial/img5.png' imgCaption1={img5Caption1} imgCaption2={img5Caption2} lastImage={true}/>
					</MyCarousel>
				</App>
    	);
    }
}

export default Tutorial;
