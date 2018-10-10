/**
 * 1. Is there a tracking code?
 * 2. Is there a referrer?
 *    A. Is the referrer known?
 *      1. Is the referrer a search engine, social network, etc?
 *      2. Is the referrer iternal to the site?
 */

var pluginObj = "Campaign";
window[pluginObj] = {
  // config settings
  loggerEnabled: false, // set to true to view console logs / messages
  loggerPrefix: "CAMPAIGN LOGGER",

  channelAbbreviations: { // if a shorter channel name is needed, add an abbreviation here
    internal: 'int',
    social: 'soc',
    referrer: 'ref'
  },
  knownDomains: { // adding a known domain category (array) automatically creates a channel with that name
    internal: ['sample.com'],
    seo: [
      'ask.com', 'baidu.com', 'bing.com', 'dogpile.com', 'duckduckgo.com', 'google.', 'search-results.com', 'searchalot.com',
      'yahoo.', 'yandex.com', 'yandex.ru'
    ],
    social: [ // https://helpx.adobe.com/analytics/kb/list-social-networks.html
      '12seconds.tv', '4travel.jp', 'advogato.org', 'ameba.jp', 'anobii.com', 'asmallworld.net', 'backtype.com', 'badoo.com',
      'bebo.com', 'bigadda.com', 'bigtent.com', 'biip.no', 'blackplanet.com', 'blog.seesaa.jp', 'blogspot.com', 'blogster.com',
      'blomotion.jp', 'bolt.com', 'brightkite.com', 'buzznet.com', 'cafemom.com', 'care2.com', 'classmates.com', 'cloob.com',
      'collegeblender.com', 'cyworld.co.kr', 'cyworld.com.cn', 'dailymotion.com', 'delicious.com', 'deviantart.com', 'digg.com',
      'diigo.com', 'disqus.com', 'draugiem.lv', 'facebook.com', 'faceparty.com', 'fc2.com', 'flickr.com', 'flixster.com',
      'fotolog.com', 'foursquare.com', 'friendfeed.com', 'friendsreunited.com', 'friendster.com', 'fubar.com', 'gaiaonline.com',
      'geni.com', 'goodreads.com', 'grono.net', 'habbo.com', 'hatena.ne.jp', 'hi5.com', 'hotnews.infoseek.co.jp', 'hyves.nl',
      'ibibo.com', 'identi.ca', 'imeem.com', 'intensedebate.com', 'irc-galleria.net', 'iwiw.hu', 'jaiku.com', 'jp.myspace.com',
      'kaixin001.com', 'kaixin002.com', 'kakaku.com', 'kanshin.com', 'kozocom.com', 'last.fm', 'linkedin.com', 'livejournal.com',
      'matome.naver.jp', 'me2day.net', 'meetup.com', 'mister-wong.com', 'mixi.jp', 'mixx.com', 'mouthshut.com', 'multiply.com',
      'myheritage.com', 'mylife.com', 'myspace.com', 'myyearbook.com', 'nasza-klasa.pl', 'netlog.com', 'nettby.no', 'netvibes.com',
      'nicovideo.jp', 'ning.com', 'odnoklassniki.ru', 'orkut.com', 'pakila.jp', 'photobucket.com', 'pinterest.com', 'plaxo.com',
      'plurk.com', 'plus.google.com', 'reddit.com', 'renren.com', 'skyrock.com', 'slideshare.net', 'smcb.jp', 'smugmug.com',
      'sonico.com', 'studivz.net', 'stumbleupon.com', 't.163.com', 't.co', 't.hexun.com', 't.ifeng.com', 't.people.com.cn',
      't.qq.com', 't.sina.com.cn', 't.sohu.com', 'tabelog.com', 'tagged.com', 'taringa.net', 'thefancy.com', 'tripit.com',
      'trombi.com', 'trytrend.jp', 'tuenti.com', 'tumblr.com', 'twine.com', 'twitter.com', 'uhuru.jp', 'viadeo.com', 'vimeo.com',
      'vk.com', 'vox.com', 'wayn.com', 'weibo.com', 'weourfamily.com', 'wer-kennt-wen.de', 'wordpress.com', 'xanga.com',
      'xing.com', 'yammer.com', 'yaplog.jp', 'yelp.com', 'youku.com', 'youtube.com', 'yozm.daum.net', 'yuku.com', 'zooomr.com'
    ]
  },
  exclusionDomains: { // if specific domains are to be excluded from a channel, add them here (this is typically a subdomain, most common with seo)
    internal: [],
    seo: ['mail.google.com', 'plus.google.com', 'mail.yahoo.com'],
    social: []
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
   * replaces special regex characters so they are escaped when building regex from a string
   * @param string {string}
   * @returns {string} 
   */
  regExpEscape: function (string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
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
  getCampaign: function (payload) {
    this.logger(payload);
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
        var domainInfo = (function (domain) {
          var originalRefDomain = domain;

          // account for google uniqueness
          domain = /^com\.google$/i.test(domain) ? 'google.com' : domain;

          return {
            refDomain: originalRefDomain,
            modifiedRefDomain: domain
          };
        })(referringDomain);

        // check knownDomains
        for (key in this.knownDomains) {
          var keyDomains = this.knownDomains[key];

          // loop through known domains, looking for the current refDomain
          for (var i = 0, max = keyDomains.length; i < max; i++) {
            var patt = new RegExp(this.regExpEscape(keyDomains[i]), "i"); // case insensitive regex

            if (patt.test(domainInfo.refDomain)) {
              // if no exclusion domains exist for the keyDomain (channel) type, or the refDomain is in the keyDomain array and not explicitly excluded, return the channel information
              if ((typeof (this.exclusionDomains[key]) === 'undefined') || (typeof (this.exclusionDomains[key]) != 'undefined' && this.exclusionDomains[key].indexOf(domainInfo.refDomain) < 0)) {
                return ({
                  campaign: '',
                  channel: this.channelAbbreviations[key] || key,
                  referringDomain: domainInfo.refDomain
                });
              }
            }
          }
        }

        // default to 'referrer' channel if a referring domain exists, but is not otherwise assigned to a channel
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
// var campaignInfo = Campaign.getCampaign({
//   trackingCode: 'abc_123',
//   referringDomain: 'example.com'
// });
// Campaign.logger(campaignInfo, "table");

Campaign.loggerEnabled = true;
var tests = [];
tests.push({
    trackingCode: '',
    referringDomain: '',
    expectedChannel: 'direct'
  }); // direct, no referrer or campaign info
tests.push({
    trackingCode: 'abc_123',
    referringDomain: '',
    expectedChannel: 'abc'
  });
tests.push({
    trackingCode: 'def_456',
    referringDomain: 'parzival.com',
    expectedChannel: 'def'
  });
tests.push({
  trackingCode: 'helenback',
    referringDomain: 'aech.com',
    expectedChannel: 'helenback'
  });
tests.push({
  trackingCode: '',
    referringDomain: 'bing.com',
    expectedChannel: 'seo'
  });
tests.push({
  trackingCode: '',
    referringDomain: 'yahoo.com',
    expectedChannel: 'seo'
  });
tests.push({    trackingCode: '',
    referringDomain: 'art3mis.com',
    expectedChannel: 'ref'
  });

var output = [];
for (item in tests) {
  var trafficSource = Campaign.getCampaign(tests[item]);
  output.push({
    p_trackingCode: tests[item].trackingCode,
    p_referringDomain: tests[item].referringDomain,
    p_expected: tests[item].expectedChannel,
    r_campaign: trafficSource.campaign,
    r_channel: trafficSource.channel,
    r_referringDomain: trafficSource.referringDomain
  });
}
Campaign.logger(output, "table");
