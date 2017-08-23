import React from 'react';
import { FormattedMessage } from 'react-intl';
import { hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { userDeniedAccessRights } from '../actions/userActions';

// Grommet components
import Anchor  from 'grommet/components/Anchor';
import App from 'grommet/components/App';
import Box from 'grommet/components/Box';
import Form from 'grommet/components/Form';
import Title from 'grommet/components/Title';
import Label from 'grommet/components/Label';
import Button from 'grommet/components/Button';
import Header from 'grommet/components/Header';
import Search from 'grommet/components/Search';
import Select from 'grommet/components/Select';
import Heading from 'grommet/components/Heading';
import Section from 'grommet/components/Section';
import FormField from 'grommet/components/FormField';
import Paragraph from 'grommet/components/Paragraph';
import SearchInput from 'grommet/components/SearchInput';

// Components
import FooterMain from './FooterMain';
import IconHelper from './IconHelper';
import PageHeader from './PageHeader';
import CommonSelect from './CommonSelect';
import FooterPadding from './FooterPadding';
import CommonPopup from './CommonPopup';

// Utils
import apiCommunicator from '../utils/apiCommunicator';
import utilities from '../utils/utilities';
import { Spinner } from '../utils/commonComponents';
import { getCurrentLocale } from 'grommet/utils/Locale';
import { submitSupportForm } from '../actions/contactActions';

const locale = getCurrentLocale();
let messages;
try {
  messages = require(`../../messages/${locale}`);
} catch (e) {
  messages = require('../../messages/en-US');
}

// Redux stuff
const mapStateToProps = ({ userInit }) => ({
  fullname: `${userInit.data.profile.userFirst} ${userInit.data.profile.userLast}`,
  email: `${userInit.data.profile.userEmail}`
}),
  mapDispatchToProps = (dispatch) => ({

    _onSubmit: (contactSupport, message) => {
      dispatch(submitSupportForm(contactSupport, message));
    }
  }),
  labels = {
    pageTitle: (<FormattedMessage id="cpx_sidebar_support" defaultMessage="Get Support" />),
    pageHeading: (<FormattedMessage id='cpx_support_more_help_text' defaultMessage="Contact Us" />),
    fullName: (<FormattedMessage id="cpx_support_more_help_fullname" defaultMessage="Full Name" />),
    email: (<FormattedMessage id="cpx_support_more_help_email" defaultMessage="Email" />),
    orderDestination: (<FormattedMessage id="cpx_support_more_help_order_destination" defaultMessage="Order Destination Country" />),
    countryHere: (<FormattedMessage id="cpx_support_more_help_order_destination_place" defaultMessage="Country here" />),
    poNumber: (<FormattedMessage id="cpx_support_more_help_po_number" defaultMessage="PO Number" />),
    hpeOrder: (<FormattedMessage id="cpx_support_more_help_hpe_order_number" defaultMessage="HPE Order Number" />),
    tellIssue: (<FormattedMessage id="cpx_support_more_help_tell_issue" defaultMessage="Tell us about the issue your having" />),
    valueVolume: (<FormattedMessage id="cpx_support_more_help_hpe_value_volume" defaultMessage="Is this a value or volume order?" />),
    category: (<FormattedMessage id="cpx_support_more_help_category" defaultMessage="Category" />),
    subCategory: (<FormattedMessage id="cpx_support_more_help_sub_category" defaultMessage="Sub-Category" />),
    describe: (<FormattedMessage id="cpx_support_more_help_describe_issue" defaultMessage="Please describe your issue or question" />),
    subject: (<FormattedMessage id="cpx_support_more_help_subject" defaultMessage="Subject" />),
    description: (<FormattedMessage id="cpx_support_more_help_description" defaultMessage="Description" />),
    submit: (<FormattedMessage id="cpx_support_more_help_submit" defaultMessage="Submit" />),
    cancel: (<FormattedMessage id="cpx_support_more_help_cancel" defaultMessage="Cancel" />),
    valueVolumeOptions: [{ "value": "Value", "label": "Value" }, { "value": "Volume", "label": "Volume" }],
    successMsg: {
      titleId: 'cpx_support_more_help_success_msg_title',
      messageId: 'cpx_support_more_help_success_msg_body'
    },
    categoryOptions: [
      { "value": messages.cpx_support_more_help_select_one, "label": messages.cpx_support_more_help_select_one },
      { "value": messages.cpx_support_more_help_category_select_1, "label": messages.cpx_support_more_help_category_select_1 },
      { "value": messages.cpx_support_more_help_category_select_2, "label": messages.cpx_support_more_help_category_select_2 }
    ],
    subCategoryOptionsOrderChange: [
      { "value": messages.cpx_support_more_help_select_one, "label": messages.cpx_support_more_help_select_one },
      { "value": messages.cpx_support_more_help_subcategory_change_1, "label": messages.cpx_support_more_help_subcategory_change_1 },
      { "value": messages.cpx_support_more_help_subcategory_change_2, "label": messages.cpx_support_more_help_subcategory_change_2 },
      { "value": messages.cpx_support_more_help_subcategory_change_3, "label": messages.cpx_support_more_help_subcategory_change_3 },
      { "value": messages.cpx_support_more_help_subcategory_change_4, "label": messages.cpx_support_more_help_subcategory_change_4 },
      { "value": messages.cpx_support_more_help_subcategory_change_5, "label": messages.cpx_support_more_help_subcategory_change_5 }
    ],
    subCategoryOptionsOrderQuery: [
      { "value": messages.cpx_support_more_help_select_one, "label": messages.cpx_support_more_help_select_one },
      { "value": messages.cpx_support_more_help_subcategory_order_1, "label": messages.cpx_support_more_help_subcategory_order_1 },
      { "value": messages.cpx_support_more_help_subcategory_order_2, "label": messages.cpx_support_more_help_subcategory_order_2 },
      { "value": messages.cpx_support_more_help_subcategory_order_3, "label": messages.cpx_support_more_help_subcategory_order_3 },
      { "value": messages.cpx_support_more_help_subcategory_order_4, "label": messages.cpx_support_more_help_subcategory_order_4 },
    ]
  },
  formStyle = { 'width':'100%', 'borderLeftColor':'white', 'borderRightColor':'white' },
  labelStyle = {'fontSize':'14px','marginLeft':'1.7em'},
  stylo = { 'marginTop': '-0.5em', 'marginBottom': '-0.0em', 'marginColor': '#000' ,'fontSize': '18px','fontWeight':'normal'},
  styleTextArea = { 'marginTop': '0em', 'marginBottom': '-0.0em', 'marginColor': '#000' ,'fontSize': '18px','fontWeight':'normal'},
  styleSearch = { 'marginTop': '0', 'marginBottom': '0', 'marginColor': '#fff', 'margin': "auto" },
  country = require('../../data/countryList.json'),
  textStyle = { color: '#333333', 'fontSize': '18px', marginTop:'10px', marginBottom:'10px' };

class ContactSupport extends React.Component {

  constructor(props) {
    super(props);
    this.onSelectCountry = this.onSelectCountry.bind(this);
    this.onSelectValueVolume = this.onSelectValueVolume.bind(this);
    this.onSelectCategory = this.onSelectCategory.bind(this);
    this.onSelectSubCategory = this.onSelectSubCategory.bind(this);
    this.onSelectSubject = this.onSelectSubject.bind(this);
    this.onSelectDescription = this.onSelectDescription.bind(this);
    this.onSelectPoNumber = this.onSelectPoNumber.bind(this);
    this.onSelectHpeNumber = this.onSelectHpeNumber.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
    this._onCancel = this._onCancel.bind(this);

    this.state = {
      country: country.data.sort((a, b) => a.label.localeCompare(b.label)),
      countryCode: "",
      countrySelected: "",
      ValueVolumeSelected: "Value",
      categorySelected: messages.cpx_support_more_help_select_one,
      subCategorySelected: messages.cpx_support_more_help_select_one,
      subCategoryOptions: [],
      subject: "",
      description: "",
      userFullname: this.props.fullname,
      userEmail: this.props.email,
      labels: labels,
      errorCountry: "",
      errorCategory: "",
      errorSubCategory: "",
      errorSubject: "",
      errorDescription: "",
      errorPoNumber: "",
      errorHpeNumber: ""
    }
  }

 _onSubmit() {
    var error = false;
    var regExpForEmojis = (/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g); //Unicode for emojis
    var poNumber = document.getElementById('poNumber').value;
    var hpeOrderNumber = document.getElementById('hpeNumber').value;
    var countryOfSubmitter = this.state.countrySelected;
    var valueVolume = this.state.ValueVolumeSelected;
    var caseReason = this.state.categorySelected;
    var scenario = this.state.subCategorySelected;
    var subject = document.getElementById('subject').value;
    var description = document.getElementById('description').value;
    var deviceDescRequired = false;
    
    if (countryOfSubmitter == '') {
      this.setState({ errorCountry: messages.cpx_support_more_help_error_country });
      error = true;
    }

     if (subject == '') {
      this.setState({ errorSubject: messages.cpx_support_more_help_error_subject });
      error = true;
    }

     if (description == '') {
      this.setState({ errorDescription: messages.cpx_support_more_help_error_description });
      error = true;
    }

    if (caseReason == messages.cpx_support_more_help_select_one) {
      this.setState({ errorCategory: messages.cpx_support_more_help_error_category });
      error = true;
    }

    if (scenario == messages.cpx_support_more_help_select_one) {
      this.setState({ errorSubCategory: messages.cpx_support_more_help_error_subcategory });
      error = true;
    }

     if (description.match(regExpForEmojis) != null )  {
      this.setState({ errorDescription: messages.cpx_support_more_help_error_notvalid });
      error = true;
    }

     if (subject.match(regExpForEmojis) != null ) {
      this.setState({ errorSubject: messages.cpx_support_more_help_error_notvalid });
      error = true;
    }

    if (poNumber.match(regExpForEmojis) != null ) {
      this.setState({ errorPoNumber: messages.cpx_support_more_help_error_notvalid });
      error = true;
    }

    if (hpeOrderNumber.match(regExpForEmojis) != null ) {
      this.setState({ errorHpeNumber: messages.cpx_support_more_help_error_notvalid });
      error = true;
    }

    if (countryOfSubmitter.match(regExpForEmojis) != null ) {
      this.setState({ errorCountry: messages.cpx_support_more_help_error_notvalid });
      error = true;
    }

    if(this.state.countryCode == ""){
      this.setState({ errorCountry: messages.cpx_support_more_help_error_notvalid_country });
      error = true;
    }

    if (error)
      return;
    
   
    var contactSupport = {
      poNumber: poNumber,
      hpeOrderNumber: hpeOrderNumber,
      countryOfSubmitter: this.state.countryCode,
      valueVolume: valueVolume,
      caseReason: caseReason,
      scenario: scenario,
      subject: subject,
      description:  description + this._getDeviceInfo(scenario) 
    };
    this.props._onSubmit(contactSupport, labels.successMsg);
  }

 _getDeviceInfo(scenario)
 {
   var deviceDescription = '';
    if(scenario == messages.cpx_support_more_help_subcategory_order_3 || scenario == messages.cpx_support_more_help_subcategory_order_4 )
    {
      var deviceDescription = " Device Type: " + device.model + " | " + 
                              " Device Platform: " + device.platform + " | " + 
                              " App Version: " + AppVersion.version;
    }
    return deviceDescription;
 }
  _onCancel() {
    this.props.close();
  }

  onSelectCountry(e) {
    this.setState({ countrySelected: e.suggestion.label });
    this.setState({ countryCode: e.suggestion.value });
    this.setState({ errorCountry: '' });
  }

  onSelectSubject(e) {
    this.setState({ errorSubject: '' });
  }

  onSelectDescription(e) {
    this.setState({ errorDescription: '' });
  }

  onSelectPoNumber(e) {
    this.setState({ errorPoNumber: '' });
  }

  onSelectHpeNumber(e) {
    this.setState({ errorHpeNumber: '' });
  }

  onSelectValueVolume(e, value) {
    this.setState({ ValueVolumeSelected: value });
  }

  onSelectCategory(e, value) {

    if (value == messages.cpx_support_more_help_category_select_1) //Order Change 
      this.setState({ categorySelected: value, errorCategory: '', subCategoryOptions: labels.subCategoryOptionsOrderChange, subCategorySelected: messages.cpx_support_more_help_select_one });
    else if (value == messages.cpx_support_more_help_category_select_2) //Order Query
      this.setState({ categorySelected: value, errorCategory: '', subCategoryOptions: labels.subCategoryOptionsOrderQuery, subCategorySelected: messages.cpx_support_more_help_select_one });
    else
      this.setState({ categorySelected: value, errorCategory: '', subCategoryOptions: [], subCategorySelected: messages.cpx_support_more_help_select_one });
  }

  onSelectSubCategory(e, value) {
    this.setState({ subCategorySelected: value, errorSubCategory: '' });
  }

  handleSearch(e) {
    this.setState({ errorCountry: "" });
    let cl = country.data.filter((i) => i.label.toLowerCase().startsWith(e.srcElement.value.toLowerCase()));
    this.setState({ country: cl, countrySelected: e.srcElement.value });
    var countryLabels=[];
    country.data.forEach(function(i){
	    countryLabels.push(i.label.toLowerCase());
    });
    if(countryLabels.indexOf(e.srcElement.value.toLowerCase()) >= 0){
      this.setState({ countryCode : country.data[countryLabels.indexOf(e.srcElement.value.toLowerCase())].value });
    }
    else{
      this.setState({ countryCode : ""});
    }
  }

  render() {
    
    return (
        <Box>
          <Header className="page-header" pad="none" justify="start" fixed={true} style={{ 'position': 'absolute', 'width': '100%', 'top': '0' }} colorIndex="neutral-1">
            <Box className="menu-items" direction="row" justify="start" responsive={false}>
              <Anchor className="page-header-back-btn" icon={<IconHelper iconName="Previous" />} onClick={this.props.close}></Anchor>
              <Anchor icon={<IconHelper iconName="Menu" />} onClick={this.props.menu}></Anchor>
            </Box>
            <Title className="page-header-title-text"><FormattedMessage id='cpx_support_menu' defaultMessage="Get Support" /></Title>
          </Header>
          <Header size="medium" justify="between" colorIndex="accent-2">
            <Box direction="row" colorIndex="accent-2" pad={{ horizontal: "medium", vertical: "none" }} justify="between" responsive={true}>
              <Title responsive={false}>
                <Heading tag="h3" margin="none" style={{'marginLeft': '0.45em' }}>{labels.pageHeading}</Heading>
              </Title>
            </Box>
          </Header>
            <Form onSubmit={this._onSubmit} style={{ 'width':'100%' }}>
              <Box colorIndex="light-1" responsive={true} align="start" margin="none" pad={{ horizontal: "none", vertical: "none" }} direction="column"   >
                <FormField style={formStyle}>
                  <Label className="required" style={labelStyle} htmlFor="fullname">{labels.fullName} </Label> 
                  <input id="fullname" type="text" placeholder="Enter Full Name" style={stylo} value={this.state.userFullname} />
                </FormField>
                <FormField style={formStyle}>
                  <Label className="required" style={labelStyle} htmlFor="email">{labels.email} </Label>
                  <input id="email" type="email" placeholder="First.Last@Company.com" style={stylo} value={this.state.userEmail} />
                </FormField>
                <FormField style={formStyle} error={this.state.errorCountry}>
                  <Label className="required" style={labelStyle} htmlFor="destination">{labels.orderDestination}</Label>
                  <SearchInput onDOMChange={this.handleSearch} placeHolder='Country here' value={this.state.countrySelected}
                    onSelect={this.onSelectCountry} id="destination" suggestions={this.state.country} />
                </FormField>
                <FormField label={labels.poNumber} htmlFor="poNumber" style={formStyle} error={this.state.errorPoNumber}>
                  <input id="poNumber" type="text" placeholder="0000000000" style={stylo} onSelect={this.onSelectPoNumber} />
                </FormField>
                <FormField label={labels.hpeOrder} htmlFor="hpeNumber" style={formStyle} error={this.state.errorHpeNumber}>
                  <input id="hpeNumber" type="text" placeholder="000000000000" style={stylo} onSelect={this.onSelectHpeNumber} />
                </FormField>
              </Box>
              <Box direction="column" className="customBarContact" margin="none" pad="none" justify="start" >
                <Paragraph size="small" style={textStyle} ><strong>{labels.tellIssue}</strong></Paragraph>
              </Box>
              <Box colorIndex="light-1" responsive={true} align="start" margin="none" pad={{ horizontal: "none", vertical: "none" }} direction="column" >
              
                  <CommonSelect  title={labels.valueVolume} id='valueVolumePullDown' value={this.state.ValueVolumeSelected} list={labels.valueVolumeOptions} onChange={this.onSelectValueVolume} required={true} />
                  <CommonSelect  title={labels.category} value={this.state.categorySelected} list={labels.categoryOptions} onChange={this.onSelectCategory}  error={this.state.errorCategory} required={true}  />
                  <CommonSelect  title={labels.subCategory} value={this.state.subCategorySelected} list={this.state.subCategoryOptions} onChange={this.onSelectSubCategory} error={this.state.errorSubCategory} required={true}  />
                
              </Box>
              <Box direction="column" className="customBarContact" margin="none" pad="none" justify="start" >
                <Paragraph size="small" style={textStyle} ><strong>{labels.describe}</strong></Paragraph>
              </Box>
              <Box colorIndex="light-1" responsive={true} align="start" margin="none" pad={{ horizontal: "none", vertical: "none" }} direction="column" >
                <FormField style={formStyle} error={this.state.errorSubject}>
                  <Label className="required" style={labelStyle}  htmlFor="subject">{labels.subject} </Label>
                  <input id="subject" type="text" placeholder="Topic here" style={stylo} onSelect={this.onSelectSubject} />
                </FormField>
                <FormField style={formStyle} error={this.state.errorDescription}>
                <Label className="required" style={labelStyle}  htmlFor="description" >{labels.description} </Label>
                  <textarea id="description" type="text" rows = '4' onSelect={this.onSelectDescription} placeholder="Please try to provide as many details as you can" style={styleTextArea} />
                </FormField>
                <Box direction="row" alignSelf="center" responsive={false} full="horizontal">
                  <Box flex={true} pad="small">
                    <Button fill={true} secondary={true} onClick={this._onCancel} label={labels.cancel} />
                  </Box>
                  <Box flex={true} pad="small">
                    <Button label={labels.submit} primary={true} fill={true} onClick={this._onSubmit}  />
                  </Box>
                </Box>
              </Box>
            </Form>
          <CommonPopup onCloseBtnClick={this._onCancel} />
      </Box>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactSupport);