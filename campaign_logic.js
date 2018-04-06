/**
 * 1. Is there a tracking code?
 * 2. Is there a referrer?
 *    A. Is the referrer known?
 *      1. Is the referrer a search engine, social network, etc?
 *      2. Is the referrer iternal to the site?
 */

var campaignObj = "Campaign";
window[campaignObj] = {
  // config settings
  loggerEnabled: false, // set to true to view console logs / messages
  loggerPrefix: "CAMPAIGN LOGGER",

  // 
  channelAbbreviations: {
    internal: 'int',
    social: 'soc',
    referrer: 'ref'
  },
  knownDomains: {
    internal: ['example.com', 'sample.com'],
    social: ['facebook.com', 'pinterest.com', 't.co', 'twitter.com'],
    seo: ['bing.com', 'duckduckgo.com', 'google.com', 'yahoo.com']
  },

  /**
   * logging method
   * @param msg {string} message to log to console
   * @param type {string} type of console message to post eg// log, info, etc
   */
  logger: function (msg, type) {
    var type = type || "log";
    if (this.loggerEnabled) {
      if (type === 'table') {
        console[type](this.loggerPrefix + " TABLE:");
        console[type](msg);
      } else if (type === 'log' || type === 'info' || type === 'warn' || type === 'error') {
        console[type](this.loggerPrefix, msg);
      } else {
        this.logger('unsupported log type provided (' + type + ') ==> Message: ' + msg, 'warn');
      }
    }
  },

  /**
   * identifies campaign properties based on tracking code, referring domain and 
   * lists of known domains representing social networks, search engines and domains
   * internal to your website
   * @param payload {object}
   * @param payload.trackingCode {string}
   * @param payload.referringDomain {string}
   * @returns {object} => { campaign: "", channel: "", referringDomain: "" }
   */
  get: function (payload) {
    this.logger('start get()');
    var trackingCode = payload.trackingCode || '',
      referringDomain = payload.referringDomain || '';

    // explicitly provided tracking codes take priority
    if (trackingCode) {
      return ({
        campaign: trackingCode,
        channel: trackingCode.split('_')[0],
        referringDomain: referringDomain
      });

      // if no tracking code is provided, examine the referring domain for recognized domains
    } else {
      if (referringDomain) {
        // check knownDomains
        for (key in this.knownDomains) {
          if (this.knownDomains[key].indexOf(referringDomain) > -1) {
            return ({
              campaign: '',
              channel: this.channelAbbreviations[key] || key,
              referringDomain: referringDomain
            });
          }
        }
        return ({
          campaign: '',
          channel: this.channelAbbreviations.referrer || 'referrer',
          referringDomain: referringDomain
        });

        // if no tracking code AND no referring domain, it must be a direct visit
      } else {
        return ({
          campaign: '',
          channel: this.channelAbbreviations.direct || 'direct',
          referringDomain: referringDomain
        });
      }
    }
  }
}
// Campaign.loggerEnabled = true;
// var campaignInfo = Campaign.get({
//   trackingCode: 'abc_123',
//   referringDomain: 'example.com'
// });
// Campaign.logger(campaignInfo, "table");

Campaign.loggerEnabled = true;
var tests = [
  { trackingCode: '', referringDomain: '' },
  { trackingCode: 'abc_123', referringDomain: '' },
  { trackingCode: 'def_456', referringDomain: 'parzival.com' },
  { trackingCode: '', referringDomain: 'bing.com' },
  { trackingCode: '', referringDomain: 'yahoo.com' },
  { trackingCode: 'helenback', referringDomain: 'aech.com' },
  { trackingCode: '', referringDomain: 'art3mis.com' }
];

var output = [];
for(item in tests) {
  var trafficSource = Campaign.get(tests[item]);
  output.push({
    p_trackingCode: tests[item].trackingCode,
    p_referringDomain: tests[item].referringDomain,
    r_campaign: trafficSource.campaign,
    r_channel: trafficSource.channel,
    r_referringDomain: trafficSource.referringDomain
  });
}
Campaign.logger(output, "table");
