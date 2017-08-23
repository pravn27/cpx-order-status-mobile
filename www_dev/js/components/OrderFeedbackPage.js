import React from 'react';
import { FormattedMessage } from 'react-intl';
import { hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { userDeniedAccessRights } from '../actions/userActions';

// Grommet components
import App from 'grommet/components/App';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Header from 'grommet/components/Header';
import Select from 'grommet/components/Select';
import Heading from 'grommet/components/Heading';
import Section from 'grommet/components/Section';
import FormField from 'grommet/components/FormField';
import Paragraph from 'grommet/components/Paragraph';
import TextInput from 'grommet/components/TextInput';
import CommonPopup from './CommonPopup';

// Components
import LandingHeader from './LandingHeader';
import OrderDetailsBasic from './OrderDetailsBasic';
import PageHeader from './PageHeader';
import OrderDetailsInvoiceAvailability from './OrderDetailsInvoiceAvailability';
import OrderDetailsFeedback from './OrderDetailsFeedback';
import ShippingDetails from './ShippingDetails';
import ItemNotShippedList from './ItemNotShippedList';
import ShipmentList from './ShipmentList';
import OrderDetailsActions from './OrderDetailsActions';
import OrderSummary from './OrderSummary';
import AlertHistoryList from './AlertHistoryList';
import CommonSelect from './CommonSelect';

// Utils
import utilities from '../utils/utilities';
import { Spinner } from '../utils/commonComponents';
import { sendFeedback } from '../actions/orderActions';
import { getCurrentLocale } from 'grommet/utils/Locale';

// temp workaround, because <Select/> options and placeholder can only handle plain string value,
// <FormattedMessage/> returns object if passed to Select and placeholder
const locale = getCurrentLocale();
let messages;
try {
  messages = require(`../../messages/${locale}`);
} catch(e) {
  messages = require('../../messages/en-US');
}

const mapDispatchToProps = (dispatch) => {
    return ({
      _sendFeedback: (qtcuid, survey, message) => { dispatch( sendFeedback(qtcuid, survey, message) ); }
    });
}

const
  labels = {
    pageTitle: (<FormattedMessage id="order_feedback_title" defaultMessage="Feedback" />),
    pageTitleText: (<FormattedMessage id="order_feedback_title_text" defaultMessage="Rate your delivery experience" />),
    questionOne: (<FormattedMessage id="order_feedback_question_1" defaultMessage="Rate your overall satisfaction level with your Hewlett Packard Enterprise product delivery experience for this order" />),

    questionOneOptions: [
      {value: messages.order_feedback_question_1_option_1, label: messages.order_feedback_question_1_option_1},
      {value: messages.order_feedback_question_1_option_2, label: messages.order_feedback_question_1_option_2},
      {value: messages.order_feedback_question_1_option_3, label: messages.order_feedback_question_1_option_3},
      {value: messages.order_feedback_question_1_option_4, label: messages.order_feedback_question_1_option_4},
      {value: messages.order_feedback_question_1_option_5, label: messages.order_feedback_question_1_option_5},
      {value: messages.order_feedback_question_1_option_6, label: messages.order_feedback_question_1_option_6},
      {value: messages.order_feedback_question_1_option_7, label: messages.order_feedback_question_1_option_7}
    ],
    helpOne: messages.order_feedback_help_1,
    questionTwo: (<FormattedMessage id="order_feedback_question_2" defaultMessage='"Where should Hewlett Packard Enterprise focus to improve delivery experience?"' />),
    questionThree: (<FormattedMessage id="order_feedback_question_3" defaultMessage="Rate your overall satisfaction level with Order Status information provided for this order" />),
    questionFour: (<FormattedMessage id="order_feedback_question_4" defaultMessage='"Where should Hewlett Packard Enterprise focus to improve Order Status information?"' />),
    questionFourOptions: [
      {value: messages.order_feedback_question_4_option_1, label: messages.order_feedback_question_4_option_1},
      {value: messages.order_feedback_question_4_option_2, label: messages.order_feedback_question_4_option_2},
      {value: messages.order_feedback_question_4_option_3, label: messages.order_feedback_question_4_option_3},
      {value: messages.order_feedback_question_4_option_4, label: messages.order_feedback_question_4_option_4},
      {value: messages.order_feedback_question_4_option_5, label: messages.order_feedback_question_4_option_5},
      {value: messages.order_feedback_question_4_option_6, label: messages.order_feedback_question_4_option_6},
      {value: messages.order_feedback_question_4_option_7, label: messages.order_feedback_question_4_option_7}
    ],
    questionFive: (<FormattedMessage id="order_feedback_question_5" defaultMessage="Open comments section" />),
    submitButton: (<FormattedMessage id="order_feedback_buttom" defaultMessage="Submit Response" />),
    successMsg: {
      titleId: 'cpx_survey_feedback_success_msg_title',
      messageId: 'cpx_survey_feedback_success_msg_body'
    }
  },
  formStyle = { 'marginLeft': '-1px', 'marginRight': '-1px', 'marginTop': '-0.5em', 'marginBottom': '-0.5em', 'marginColor': '#000', 'width': '88%', 'border': '0' },
  textInputStype = { 'marginLeft': '-1px', 'marginRight': '-1px', 'marginTop': '-0.5em', 'marginBottom': '-0.5em', 'marginColor': '#000', 'width': '100%', 'border': '0' },
  stylo = {marginLeft: "5px", marginRight: "5px"},
  buttonStyle = { "margin": "auto" };

var starInit = [1, 2, 3, 4, 5], starDisplay = null;

class OrderFeedbackPage extends React.Component {
  constructor(props) {
    super(props);
    starDisplay = (s, b) => {
      return starInit.map((i) => {
        var
          starSelected = (<a onClick={(e) => this.generateStars(e, i, b)} style={stylo}><img src={'img/star/starSelected.png'} width="25px" height="25px"/></a>),
          starDefault = (<a onClick={(e) => this.generateStars(e, i, b)} style={stylo}><img src={'img/star/starDefault.png'} width="25px" height="25px"/></a>);
        return (i > s) ? starDefault : starSelected;
      });
    };
    this.state = {
      display: {
        inputTwo: false,
        inputFour: false
      },
      buttonFlag: false,
      qtcuid: this.props.params.qtcuid,
      deliveryExperience: messages.cpx_support_more_help_select_one,
      orderStatusInfo: messages.cpx_support_more_help_select_one,
      survey:[
        {
          question:"score_delivery_exp",
          answer:"0" //default
        },
        {
          question: "improve_delivery_exp",
          answer: ""
        },
        {
          question: "score_order_info",
          answer: "0" // default
        },
        {
          question: "improve_order_info",
          answer: ""
        },
        {
          question: "comments",
          answer: ""
        }
      ],
      errorDescription_2: "",
      errorDescription_4: "",
      errorDescription_5: "",
      starDisplayOne: starDisplay(0, 1),
      starDisplayThree: starDisplay(0, 3)
    };
    //this.state.survey[0].answer = this.props.params.rate;
    this.onSelectDescription_2 = this.onSelectDescription_2.bind(this);
    this.onSelectDescription_4 = this.onSelectDescription_4.bind(this);
    this.onSelectDescription_5 = this.onSelectDescription_5.bind(this);
    this.submitRating = this.submitRating.bind(this);
    this.deliveryExperienceChange = this.deliveryExperienceChange.bind(this);
    this.orderStatusInfoChange = this.orderStatusInfoChange.bind(this);
    this._onCancel = this._onCancel.bind(this);
  }

  generateStars(e, i, b) {
    e.preventDefault();
    var stateCpy = Object.assign({}, this.state);
    if (b == 1) {
      stateCpy.survey[0].answer = (i).toString();
      this.setState(stateCpy);
      this.setState({starDisplayOne: starDisplay(i, b)});
    } else if (b == 3) {
      stateCpy.survey[2].answer = (i).toString();
      this.setState(stateCpy);
      this.setState({starDisplayThree: starDisplay(i, b)});
    }
  }

  submitRating() {
    var error = false;
    var regExpForEmojis = (/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g); //Unicode for emojis
    var feedBackComments = document.getElementById('commentDesription').value;

    if (feedBackComments.match(regExpForEmojis) != null )  {
     document.getElementById('CommentDescriptionField').style.border="1px Solid #ff0000";
     this.setState({ errorDescription_5: messages.cpx_support_more_help_error_notvalid });
     error = true;
   }

   if (this.state.display.inputFour && (document.getElementById('inputFour').value).match(regExpForEmojis) != null )  {
     document.getElementById('inputFour').style.border="1px Solid #ff0000";
     this.setState({ errorDescription_4: messages.cpx_support_more_help_error_notvalid });
     error = true;
   }

   if (this.state.display.inputTwo && (document.getElementById('inputTwo').value).match(regExpForEmojis) != null )  {
     document.getElementById('inputTwo').style.border="1px Solid #ff0000";
     this.setState({ errorDescription_2: messages.cpx_support_more_help_error_notvalid });
     error = true;
   }
   
    if (error)
      return;
    else{
      this.setState({buttonFlag: true});
      this.props._sendFeedback(this.state.qtcuid, JSON.stringify(this.state.survey), labels.successMsg);
    }
  }

  onSelectDescription_5(e) {
    this.setState({ errorDescription_5: '' });
    document.getElementById('CommentDescriptionField').style.border="1px Solid #2ad2c9";
  }

  onSelectDescription_4(e) {
    this.setState({ errorDescription_4: '' });
    document.getElementById('inputFour').style.border="2px Solid #2ad2c9";
  }

  onSelectDescription_2(e) {
    this.setState({ errorDescription_2: '' });
    document.getElementById('inputTwo').style.border="2px Solid #2ad2c9";
  }

  handleCommentChange(e,q) {
    var stateCpy = Object.assign({}, this.state);
    stateCpy.survey[q].answer = e.target.value;
    this.setState(stateCpy);
  }

  deliveryExperienceChange(id, value){
    this.setState({ errorDescription_2: '' });
    var stateCpy = Object.assign({}, this.state);
    stateCpy.survey[1].answer = value;
    stateCpy.deliveryExperience = value;
    stateCpy.display.inputTwo = (value !== messages.order_feedback_question_1_option_7) ? false : true;
    this.setState(stateCpy);
  }

  orderStatusInfoChange(id, value){
    this.setState({ errorDescription_4: '' });
    var stateCpy = Object.assign({}, this.state);
    stateCpy.survey[3].answer = value;
    stateCpy.orderStatusInfo = value;
    stateCpy.display.inputFour = (value !== messages.order_feedback_question_1_option_7) ? false : true;
    this.setState(stateCpy);
  }

  _onCancel() {
    hashHistory.goBack();
  }

  render() {
    return (
      <App centered={true}>
        <Section pad='none' colorIndex="light-1">
          <PageHeader pageTitle={labels.pageTitle} showBackBtn={true} />
          <Box colorIndex="light-1" pad={{vertical: "medium", horizontal: "large"}} separator="none">
            <Heading strong={true} tag='h3' style={{fontSize: '32px'}}>{labels.pageTitleText}</Heading>
            <Paragraph size="large"><strong>1. </strong>{labels.questionOne}</Paragraph>
            <Box direction="row" colorIndex="light-1" pad="none" margin="none" separator="none" justify="start" responsive={false} flex="true">
              {this.state.starDisplayOne}
            </Box>
            <br />
            <hr />
            <Paragraph size="large"><strong>2. </strong>{labels.questionTwo}</Paragraph>
            <FormField style={{'padding':'0px 24px'}}>
              <CommonSelect value={this.state.deliveryExperience} list={labels.questionOneOptions} onChange={this.deliveryExperienceChange} />
            </FormField>
            {this.state.display.inputTwo ? <label style={{'font-size': '16px','color': 'red','text-align': 'right','height':'30px','padding-top':'2px'}}>{this.state.errorDescription_2}</label> : null }
            {this.state.display.inputTwo ? <textarea id="inputTwo" onSelect={this.onSelectDescription_2} placeholder={labels.helpOne} onChange={(e) => this.handleCommentChange(e,1)} /> : null }
            <br />
            <hr />
            <Paragraph size="large"><strong>3. </strong>{labels.questionThree}</Paragraph>
            <Box direction="row" colorIndex="light-1" pad="none" margin="none" separator="none" justify="start" responsive={false}>
              {this.state.starDisplayThree}
            </Box>
            <br />
            <hr />
            <Paragraph size="large"><strong>4. </strong>{labels.questionFour}</Paragraph>
            <FormField style={{'padding':'0px 24px'}}>
              <CommonSelect value={this.state.orderStatusInfo} list={labels.questionFourOptions} onChange={this.orderStatusInfoChange} />
            </FormField>
            {this.state.display.inputFour ? <label style={{'font-size': '16px','color': 'red','text-align': 'right','height':'30px','padding-top':'2px'}}>{this.state.errorDescription_4}</label> : null }
            {this.state.display.inputFour ? <textarea id="inputFour" onSelect={this.onSelectDescription_4} placeholder={labels.helpOne} onChange={(e) => this.handleCommentChange(e,3)} /> : null }
            <br />
            <hr />
            <Paragraph size="large" style={{'height':'0px'}}><strong>5. </strong>{labels.questionFive}
            </Paragraph>
            <label style={{'font-size': '16px','color': 'red','text-align': 'right','height':'30px'}}>{this.state.errorDescription_5}</label>
            <FormField id="CommentDescriptionField">
              <textarea id="commentDesription" style={{ 'height':'134px' }} onSelect={this.onSelectDescription_5} placeholder={labels.helpOne} onChange={(e) => this.handleCommentChange(e,4)}/>
            </FormField>
            <br />
            <hr />
            <Box direction="row" justify="center" pad="none" margin="none" flex="true">
              <button type="button" style={buttonStyle} className="grommetux-button grommetux-button--primary" onClick={this.submitRating} disabled={this.state.buttonFlag}>{labels.submitButton}</button>
            </Box>
          </Box>
          <CommonPopup onCloseBtnClick={this._onCancel} />
        </Section>
      </App>
    );
  }
}

export default connect(null, mapDispatchToProps) (OrderFeedbackPage);
