var compareObj = 'compare'
window[compareObj] = {
  getHostInfo: function (payload) {
    var hostInfo = payload || '';

    var hpData = {}; // host-path data
    if (hostInfo && hostInfo != '') {
      hpData["hp-full"] = hostInfo;

      hostInfo = hostInfo.split('/');

      // add each level of the protocol/host/path to the results
      for (var i = 0, maxi = hostInfo.length; i < maxi; i++) {
        if (hostInfo[i] && hostInfo[i] != '') {
          hpData['hp' + i] = hostInfo[i];
        }
      }
    }

    return (hpData);
  },

  getParamInfo: function (payload) {
    var params = payload || '';

    params = payload.split('&');

    var output = {};
    for (var i = 0, maxi = params.length; i < maxi; i++) {
      var tmp = params[i].split('=');
      if (!(tmp[0] === '' && tmp[1] === '')) {
        output[tmp[0]] = decodeURIComponent(tmp[1]);
      }
    }
    return (output);
  },

  doCompare: function (key, first, second) {
    var compareType = '';

    if (first == second) {
      compareType = 'exact'; // both are present, match exactly
    } else if (first.toLowerCase() == second.toLowerCase()) {
      compareType = 'similar'; // same, but different cases
    } else if (first && second) {
      compareType = 'exist'; // both exist, but are not the same
    } else if (!first && second) {
      compareType = 'only-challenge'; // only present in challenger
    } else {
      compareType = 'only-control'; // only present in control
    }

    return (compareType);
  },

  doMerge: function (controlHost, challengeHost, controlParams, challengeParams) {
    var output = {};

    for (var key in controlHost) {
      var ctrl = (controlHost[key] && controlHost[key] != null) ? controlHost[key] : '',
        chal = (challengeHost[key] && challengeHost[key] != null) ? challengeHost[key] : '',
        compare = this.doCompare(key, ctrl, chal);

      output[key] = {
        ctl: ctrl,
        chl: chal,
        cmp: compare
      };
    }

    for (var key in challengeHost) {
      if (!controlHost.hasOwnProperty(key)) {
        var ctrl = (controlHost[key] && controlHost[key] != null) ? controlHost[key] : '',
          chal = (challengeHost[key] && challengeHost[key] != null) ? challengeHost[key] : '',
          compare = this.doCompare(key, ctrl, chal);

        output[key] = {
          ctl: ctrl,
          chl: chal,
          cmp: compare
        };
      };
    }

    for (var key in controlParams) {
      var ctrl = (controlParams[key] && controlParams[key] != null) ? controlParams[key] : '',
        chal = (challengeParams[key] && challengeParams[key] != null) ? challengeParams[key] :
        '',
        compare = this.doCompare(key, ctrl, chal);

      output[key] = {
        ctl: ctrl,
        chl: chal,
        cmp: compare
      };
    }

    for (var key in challengeParams) {
      if (!controlHost.hasOwnProperty(key)) {
        var ctrl = (controlParams[key] && controlParams[key] != null) ? controlParams[key] : '',
          chal = (challengeParams[key] && challengeParams[key] != null) ? challengeParams[key] :
          '',
          compare = this.doCompare(key, ctrl, chal);

        output[key] = {
          ctl: ctrl,
          chl: chal,
          cmp: compare
        };
      };
    }

    return (output);
  },

  exec: function (controlCalls, challengeCalls) {
    var output = [];

    if ((controlCalls && controlCalls.length) > 0 || (challengeCalls && challengeCalls.length > 0)) {

      for (var i = 0, maxi = controlCalls.length; i < maxi; i++) {
        var control = controlCalls[i],
          challenge = challengeCalls[i];

        var controlAry = control.split('?'),
          challengeAry = challenge.split('?');

        var controlSearch = (controlAry.length === 2) ? controlAry[1] : '',
          challengeSearch = (challengeAry.length === 2) ? challengeAry[1] : '';

        var controlHostInfo = controlAry[0],
          challengeHostInfo = challengeAry[0];

        controlHostInfo = this.getHostInfo(controlHostInfo);
        challengeHostInfo = this.getHostInfo(challengeHostInfo);

        var controlParams = this.getParamInfo(controlSearch),
          challengeParams = this.getParamInfo(challengeSearch);

        output.push(this.doMerge(controlHostInfo, challengeHostInfo, controlParams,
          challengeParams));
      }
    }

    return output;
  }
}

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////

var ctl = [
  'https://www.example.com/path/to/nowhere.html?sample=value&example=another',
  'https://www.example.com/follow/your/gut.html?sample=value&example=another',
  'https://www.example.com/path/to/your/gut.html?i=like&ice=cream'
];

var chl = [
  'https://www.example.com/directory/to/nowhere.html?sample=value&example=another',
  'https://www.example.com/follow/your/instincts.html?sample=value&example=sample',
  'https://www.example.com/path/to/your/gut.html?i=like&peanut=butter'
];

var results = compare.exec(ctl, chl);
console.log(JSON.stringify(results, null, 2));
