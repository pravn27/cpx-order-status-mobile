import React from 'react';

var IconHelper = React.createClass({
    requireHolder : function(){
        //include all icons here
        var IconClose = require('grommet/components/icons/base/Close');
        var IconHome = require('grommet/components/icons/base/Home');
        var IconFlag = require('grommet/components/icons/base/Flag');
        var IconActions = require('grommet/components/icons/base/Actions');
        var IconSupport = require('grommet/components/icons/base/Support');
        var IconInformation = require('grommet/components/icons/base/Info');
        var IconSecure = require('grommet/components/icons/base/Secure');
        var IconOverview = require('grommet/components/icons/base/Overview');
        var IconNext = require('grommet/components/icons/base/Next');
        var IconMenu = require('grommet/components/icons/base/Menu');
        var IconPrevious = require('grommet/components/icons/base/Previous');
        var IconMicrophone = require('grommet/components/icons/base/Microphone');
        var IconSearch = require('grommet/components/icons/base/Search');
        var IconDescend = require('grommet/components/icons/base/Descend');
        var IconAscend = require('grommet/components/icons/base/Ascend');
        var IconFilter = require('grommet/components/icons/base/Filter');
        var IconLogout = require('grommet/components/icons/base/Logout');
        var IconCompliance = require('grommet/components/icons/base/Compliance');
        var IconSearchAdvanced = require('grommet/components/icons/base/SearchAdvanced');
        var IconSimulateUser = require('grommet/components/icons/base/User');

        var Notes = require('grommet/components/icons/base/Notes');
        var Checkmark = require('grommet/components/icons/base/Checkmark');
        var IconSocialEmail = require('grommet/components/icons/base/SocialMail');
        var Mail = require('grommet/components/icons/base/Mail');

        return {data: []};
    },
    render(){
        var name = 'grommet/components/icons/base/' + this.props.iconName;
        var TIcon = require(name);
        return <TIcon />
    }
});

export default IconHelper;
