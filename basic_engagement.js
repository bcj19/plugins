/*--------------------------------------------------------------*/
/*--------------     Engagement Plugin       -------------------*/
/*--------------------------------------------------------------*/

/**
 * cross-browser eventListener logic
 */
function attachEvents(payload) {
  var element = payload.element,
    event = payload.event,
    action = payload.action;

  if (element['addEventListener']) {
    element['addEventListener'](event, action);
  } else if (element['attachEvent']) {
    element['attachEvent']('on' + event, action);
  }
}

/**
 * 
 */
function sampleTrack(payload) {
  console.info(payload);
}

/**
 *
 */
var engagementObject = 'Engagement';
window[engagementObject] = {
  // constants
  loggingEnabled: false, // set to true to view console logs / messages
  pollingInterval: 10000, // ms - check for signs of engagement every 10 seconds
  scorePerInterval: 10, // whole number, typically 1 point per second in pollingInterval
  hasScrolled: false, // default to false
  hasMoused: false, // default to false
  hasClicked: false, //default to false
  defaultEngagementScore: 0, // default engagement score to 0
  engagementScore: 0, // default engagement score to 0
  minimumEngagementScore: 1, // minimum score required to send analytics call

  /**
   * logging method
   * @param msg {string} message to log to console
   * @param type {string} type of console message to post eg// log, info, etc
   */
  logger: function (msg, type) {
    var type = type || "log";
    if (this.loggingEnabled) {
      console[type](engagementObject.toUpperCase() + " LOGGER:", msg);
    }
  },

  /**
   * set up initial watchers
   * @param {object} pv_object
   */
  initialize: function (pv_object) {
    window[engagementObject].logger('initialize');
    var that = pv_object;
    window[engagementObject].startTime = new Date().getTime();

    this.isFocused = document.hasFocus(); // current focus state (Boolean)
  },

  /**
   * what to do when the page is scrolled
   */
  doScroll: function () {
    this.isFocused = document.hasFocus();
    if (this.isFocused) {
      window[engagementObject].logger('doScroll');
      this.hasScrolled = true;
    }
  },

  /**
   * what to do when the mouse is moving/engaging with content
   */
  doMouse: function () {
    this.isFocused = document.hasFocus();
    window[engagementObject].logger('doMouse');
    if (this.isFocused) {
      this.hasMoused = true;
    }
  },

  /**
   * what to do when a click occurs
   */
  doClick: function () {
    this.isFocused = document.hasFocus();
    window[engagementObject].logger('doClick');
    if (this.isFocused) {
      this.hasClicked = true;
    }
  },

  /**
   *
   */
  getEngagementScore: function (payload) {
    var action = payload.action,
      status = payload.status,
      score = payload.score,
      retVal = (status) ? score + 1 : score;

    // remove flags after each check
    this[action] = false;

    return (retVal);
  },

  /**
   * 
   */
  getEngagementStatus: function (payload) {
    this.engagementScore = this.getEngagementScore({
      action: 'hasScrolled',
      status: this.hasScrolled,
      score: this.engagementScore
    });
    this.engagementScore = this.getEngagementScore({
      action: 'hasMoused',
      status: this.hasMoused,
      score: this.engagementScore
    });
    this.engagementScore = this.getEngagementScore({
      action: 'hasClicked',
      status: this.hasClicked,
      score: this.engagementScore
    });

    // update status
    this.status = {
      engagementScore: this.engagementScore
    }
    return (this.status);
  }
}

// set up helper variables and methods
window[engagementObject].initialize(window[engagementObject]);

var engagement_timer = setInterval(function () { // check for engagement in specified intervals
  window[engagementObject].getEngagementStatus();

  var isEngaged = (window[engagementObject].engagementScore >= window[engagementObject].minimumEngagementScore) ? true : false,
    engagementType = (isEngaged) ? 'engaged' : 'not engaged';

  if (engagementType === 'engaged') {
    window[engagementObject].logger("engagement-score_" + window[engagementObject].scorePerInterval);
    sampleTrack({
      sender: this,
      eventList: "engagementTracking",
      engagementScore: window[engagementObject].scorePerInterval,
      label: "engagement-score_" + window[engagementObject].scorePerInterval
    });

    //reset engagement score
    window[engagementObject].engagementScore = window[engagementObject].defaultEngagementScore;

  } else {
    window[engagementObject].logger("engagement-score: " + engagementType.toUpperCase());
  }
}, window[engagementObject].pollingInterval);

// monitor scrolling events for engagemnet tracking
attachEvents({
  element: window,
  event: 'scroll',
  action: function () {
    window[engagementObject].doScroll();
  }
});

// monitor mouse events for engagemnet tracking
attachEvents({
  element: window,
  event: 'mouseover',
  action: function () {
    window[engagementObject].doMouse();
  }
});

// monitor click events for engagemnet tracking
attachEvents({
  element: window,
  event: 'click',
  action: function () { 
    window[engagementObject].doClick();
  }
});
