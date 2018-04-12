var simulator = {
  simHistory: [],
  runningStatus: {},

  // adobe analytics functions / logic
  countVisitors: function (inputs, totals, tool) {
    tool = tool.toUpperCase();

    if(tool === 'AA') {
      return (inputs.isNewVisitor) ? this.runningStatus[tool].visitors + 1 : this.runningStatus[tool].visitors;
    } else if(tool === 'GA') {
      return (inputs.isNewVisitor) ? this.runningStatus[tool].visitors + 1 : this.runningStatus[tool].visitors;
    } else {
      return 'tool not specified'
    }
  },

  countVisits: function (inputs, totals, tool) {
    tool = tool.toUpperCase();

    if(tool === 'AA') {
      return (inputs.isNewVisit) ? this.runningStatus[tool].visits + 1 : this.runningStatus[tool].visits;
    } else if(tool === 'GA') {
      // increment ga on new visit AND new campaign
      return (inputs.isNewVisit || (inputs.campaign && inputs.campaign != '')) ? this.runningStatus[tool].visits + 1 : this.runningStatus[tool].visits;
    } else {
      return 'tool not specified'
    }
  },

  countConversions: function (inputs, totals, tool) {
    tool = tool.toUpperCase();

    if(tool === 'AA') {
      return (inputs.isConversion) ? this.runningStatus[tool].conversions + 1 : this.runningStatus[tool].conversions;
    } else if(tool === 'GA') {
      return (inputs.isConversion) ? this.runningStatus[tool].conversions + 1 : this.runningStatus[tool].conversions;
    } else {
      return 'tool not specified'
    }
  },

  countPageViews: function (inputs, totals, tool) {
    tool = tool.toUpperCase();

    if(tool === 'AA') {
      return (inputs.callType != 'link') ? this.runningStatus[tool].pageViews + 1 : this.runningStatus[tool].pageViews;
    } else if(tool === 'GA') {
      return (inputs.callType != 'link') ? this.runningStatus[tool].pageViews + 1 : this.runningStatus[tool].pageViews;
    } else {
      return 'tool not specified'
    }
  },

  countLinkEvents: function (inputs, totals, tool) {
    tool = tool.toUpperCase();

    if(tool === 'AA') {
      return (inputs.callType === 'link') ? this.runningStatus[tool].linkEvents + 1 : this.runningStatus[tool].linkEvents;
    } else if(tool === 'GA') {
      return (inputs.callType === 'link') ? this.runningStatus[tool].linkEvents + 1 : this.runningStatus[tool].linkEvents;
    } else {
      return 'tool not specified'
    }
  },

  countInstances: function (inputs, totals, tool) {
    tool = tool.toUpperCase();

    if(tool === 'AA') {
      return this.runningStatus[tool].instances + 1;
    } else if(tool === 'GA') {
      return this.runningStatus[tool].instances + 1;
    } else {
      return 'tool not specified'
    }
  },

  updateTotals: function (inputs) {
    var totals = this.runningStatus;

    /** begin pre-calculation modifications */
    /** begin pre-calculation modifications */
    /** begin pre-calculation modifications */

    // force new visit AND new visitor if current visit count is 0
    if (this.runningStatus.visits === 0) {
      inputs.isNewVisitor = true;
      inputs.isNewVisit = true;
    }

    // force new visit for a new visitor
    if (inputs.isNewVisitor) {
      inputs.isNewVisit = true;
    }

    /** end pre-calculation modifications */
    /** end pre-calculation modifications */
    /** end pre-calculation modifications */

    var output = {
      AA: {
        visitors: this.countVisitors(inputs, totals, 'aa'),
        visits: this.countVisits(inputs, totals, 'aa'),
        conversions: this.countConversions(inputs, totals, 'aa'),
        pageViews: this.countPageViews(inputs, totals, 'aa'),
        linkEvents: this.countLinkEvents(inputs, totals, 'aa'),
        instances: this.countInstances(inputs, totals, 'aa')
      },
      GA: {
        visitors: this.countVisitors(inputs, totals, 'ga'),
        visits: this.countVisits(inputs, totals, 'ga'),
        conversions: this.countConversions(inputs, totals, 'ga'),
        pageViews: this.countPageViews(inputs, totals, 'ga'),
        linkEvents: this.countLinkEvents(inputs, totals, 'ga'),
        instances: this.countInstances(inputs, totals, 'ga')
      }
    }

    this.simHistory.push({
      modifiedInputs: inputs,
      output: output
    });
    this.runningStatus = output;
    return output;
    //return output;
  },

  reset: function () {
    this.simHistory = [];
    this.runningStatus = {
      AA: {
        visits: 0,
        visitors: 0,
        conversions: 0,
        pageViews: 0,
        linkEvents: 0,
        instances: 0
      },
      GA: {
        visits: 0, // sessions
        visitors: 0, // 
        conversions: 0,
        pageViews: 0,
        linkEvents: 0,
        instances: 0
      }
    };
  },

  init: function() {
    this.reset();
  }
}

var inputs = {
  isNewVisitor: true, // simulate new visitor 
  isNewVisit: false, // simulate new visit with or without new visitor
  isConversion: false, // simulate purchase/conversion
  campaign: '',
  campaignAllocation: 'last', // first, last, linear
  campaignExpiration: 'visit', // visit, purchase, week, 7 days, 30 days (custom?)
  pageName: '/home', // page name
  callType: 'page', // page (s.t) or link (s.tl)
};

simulator.init();
var x = simulator.updateTotals(inputs);
console.log(x);
