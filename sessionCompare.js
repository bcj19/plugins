var simulator = {
  simHistory: [],
  runningStatus: {},

  // adobe analytics functions / logic
  countAAVisitors: function (inputs, totals) {
    return (inputs.isNewVisitor) ? this.runningStatus.AA.visitors + 1 : this.runningStatus.AA.visitors;
  },

  countAAVisits: function (inputs, totals) {
    return (inputs.isNewVisit) ? this.runningStatus.AA.visits + 1 : this.runningStatus.AA.visits;
  },

  countAAConversions: function (inputs, totals) {
    return (inputs.isConversion) ? this.runningStatus.AA.conversions + 1 : this.runningStatus.AA.conversions;
  },

  countAAPageViews: function (inputs, totals) {
    return (inputs.callType != 'link') ? this.runningStatus.AA.pageViews + 1 : this.runningStatus.AA.pageViews;
  },

  countAALinkEvents: function (inputs, totals) {
    return (inputs.callType === 'link') ? this.runningStatus.AA.linkEvents + 1 : this.runningStatus.AA.linkEvents;
  },

  countAAInstances: function (inputs, totals) {
    return this.runningStatus.AA.instances + 1;
  },

  // google analytics functions / logic
  countGAVisitors: function (inputs, totals) {
    return (inputs.isNewVisitor) ? this.runningStatus.GA.visitors + 1 : this.runningStatus.GA.visitors;
  },

  countGAVisits: function (inputs, totals) {
    return (inputs.isNewVisit) ? this.runningStatus.GA.visits + 1 : this.runningStatus.GA.visits;
  },

  countGAConversions: function (inputs, totals) {
    return (inputs.isConversion) ? this.runningStatus.GA.conversions + 1 : this.runningStatus.GA.conversions;
  },

  countGAPageViews: function (inputs, totals) {
    return (inputs.callType != 'link') ? this.runningStatus.GA.pageViews + 1 : this.runningStatus.GA.pageViews;
  },

  countGALinkEvents: function (inputs, totals) {
    return (inputs.callType === 'link') ? this.runningStatus.GA.linkEvents + 1 : this.runningStatus.GA.linkEvents;
  },

  countGAInstances: function (inputs, totals) {
    return this.runningStatus.GA.instances + 1;
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
        visitors: this.countAAVisitors(inputs, totals),
        visits: this.countAAVisits(inputs, totals),
        conversions: this.countAAConversions(inputs, totals),
        pageViews: this.countAAPageViews(inputs, totals),
        linkEvents: this.countAALinkEvents(inputs, totals),
        instances: this.countAAInstances(inputs, totals)
      },
      GA: {
        visitors: this.countGAVisitors(inputs, totals),
        visits: this.countGAVisits(inputs, totals),
        conversions: this.countGAConversions(inputs, totals),
        pageViews: this.countGAPageViews(inputs, totals),
        linkEvents: this.countGALinkEvents(inputs, totals),
        instances: this.countGAInstances(inputs, totals)
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
