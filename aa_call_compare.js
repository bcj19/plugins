var compareObj = 'compare'
window[compareObj] = {
  getHostInfo: function (payload) {
    var hostInfo = payload || '';

    hostInfo = hostInfo.split('/');

    return ({
      full: payload,
      protocol: hostInfo[0],
      host: hostInfo[2],
      rsid: hostInfo[5],
      version: hostInfo[7]
    });
  },

  getParamInfo: function (payload) {
    var params = payload || '';

    params = payload.split('&');

    var output = {};
    for (var i = 0, maxi = params.length; i < maxi; i++) {
      var tmp = params[i].split('=');
      output[tmp[0]] = decodeURIComponent(tmp[1]);
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
        chal = (challengeParams[key] && challengeParams[key] != null) ? challengeParams[key] : '',
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
          chal = (challengeParams[key] && challengeParams[key] != null) ? challengeParams[key] : '',
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

      output.push(this.doMerge(controlHostInfo, challengeHostInfo, controlParams, challengeParams));
    }

    return output;
  }
}

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////

var ctl = [
  'https://sci.intuit.com/b/ss/intuitcareersprod/1/JS-2.3.0/s61019462536819?AQB=1&ndh=1&pf=1&t=4%2F4%2F2018%2015%3A18%3A38%205%20300&fid=0B8EA3C9D5B93A8A-3F48C081A92C3D2A&ce=UTF-8&ns=intuitinc&pageName=hr%7Cmktg%7Ccareers%3Ataleo%7Ccandidateacquisition%2Fupload-resume&g=https%3A%2F%2Fintuit.taleo.net%2Fcareersection%2Fcareersection%2Fcandidateacquisition%2Fflow.jsf&r=https%3A%2F%2Fintuit.taleo.net%2Fcareersection%2F2%2Fjobapply.ftl%3Fjob%3D326044%26src%3Dcws-10013%26_ga%3D2.92356885.960409806.1525379012-633530453.1522943452%26lang%3Den&cc=USD&ch=hr%7Cmktg&server=intuit.taleo.net&events=event3&c1=D%3Dv1&v1=hr%7Cmktg%7Ccareers%3Ataleo&c2=D%3DpageName&c3=D%3DpageName&c9=hr%7Cmktg%7Ccareers%3Ataleo%7Ccandidateacquisition%2Fupload-resume&v17=D%3Dr&v26=CWS-10013&c27=D%3Dg&v27=D%3Dg&c36=2.3.0%7C2018-04-27%7Cdtm_satelliteLib-2273fbe872f5b415a53813247c5becc21b42ad28_stage&c42=hr%7Cmktg%7Ccareers%7Ccareersection%2Fcareersection%2Fcandidateacquisition%2Fflow.jsf&c49=D%3DpageName&v59=950732&v60=en-us&c64=D%3Dv64&v64=hr&c67=D%3Dv67&v67=Friday%7C2018-05-04%7C15%3A18%7CUTC-05&v80=%2B1&s=1680x1050&c=24&j=1.6&v=N&k=Y&bw=1480&bh=803&AQE=1',
  'https://sci.intuit.com/b/ss/intuitcareersprod/1/JS-2.3.0/s61019462536819?AQB=1&ndh=1&pf=1&t=4%2F4%2F2018%2015%3A18%3A38%205%20300&fid=0B8EA3C9D5B93A8A-3F48C081A92C3D2A&ce=UTF-8&ns=intuitinc&pageName=hr%7Cmktg%7Ccareers%3Ataleo%7Ccandidateacquisition%2Fupload-resume&g=https%3A%2F%2Fintuit.taleo.net%2Fcareersection%2Fcareersection%2Fcandidateacquisition%2Fflow.jsf&r=https%3A%2F%2Fintuit.taleo.net%2Fcareersection%2F2%2Fjobapply.ftl%3Fjob%3D326044%26src%3Dcws-10013%26_ga%3D2.92356885.960409806.1525379012-633530453.1522943452%26lang%3Den&cc=USD&ch=hr%7Cmktg&server=intuit.taleo.net&events=event3&c1=D%3Dv1&v1=hr%7Cmktg%7Ccareers%3Ataleo&c2=D%3DpageName&c3=D%3DpageName&c9=hr%7Cmktg%7Ccareers%3Ataleo%7Ccandidateacquisition%2Fupload-resume&v17=D%3Dr&v26=CWS-10013&c27=D%3Dg&v27=D%3Dg&c36=2.3.0%7C2018-04-27%7Cdtm_satelliteLib-2273fbe872f5b415a53813247c5becc21b42ad28_stage&c42=hr%7Cmktg%7Ccareers%7Ccareersection%2Fcareersection%2Fcandidateacquisition%2Fflow.jsf&c49=D%3DpageName&v59=950732&c60=D%3Dv60&v60=en-us&c64=D%3Dv64&v64=hr&c67=D%3Dv67&v67=Friday%7C2018-05-04%7C15%3A18%7CUTC-05&v80=%2B1&s=1680x1050&c=24&j=1.6&v=N&k=Y&bw=1480&bh=803&AQE=1'
];

var chl = [
  'https://sci.intuit.com/b/ss/intuitcareersdev/1/JS-2.3.0/s61019462536819?AQB=1&pf=1&t=4%2F4%2F2018%2015%3A18%3A38%205%20300&fid=0B8EA3C9D5B93A8A-3F48C081A92C3D2A&ns=intuitinc&pageName=hr%7Cmktg%7Ccareers%3Ataleo%7Ccandidateacquisition%2Fupload-resume&g=https%3A%2F%2Fintuit.taleo.net%2Fcareersection%2Fcareersection%2Fcandidateacquisition%2Fflow.jsf&r=https%3A%2F%2Fintuit.taleo.net%2Fcareersection%2F2%2Fjobapply.ftl%3Fjob%3D326044%26src%3Dcws-10013%26_ga%3D2.92356885.960409806.1525379012-633530453.1522943452%26lang%3Den&cc=USD&ch=hr%7Cmktg&server=intuit.taleo.net&events=event3&c1=D%3Dv1&v1=hr%7Cmktg%7Ccareers%3Ataleo&c2=D%3DpageName&c3=D%3DpageName&c9=hr%7Cmktg%7Ccareers%3Ataleo%7Ccandidateacquisition%2Fupload-resume&v17=D%3Dr&v26=CWS-10013&c27=D%3Dg&v27=D%3Dg&c36=2.3.0%7C2018-04-27%7Cdtm_satelliteLib-2273fbe872f5b415a53813247c5becc21b42ad28_stage&c42=hr%7Cmktg%7Ccareers%7Ccareersection%2Fcareersection%2Fcandidateacquisition%2Fflow.jsf&c49=D%3DpageName&v59=950732&c60=D%3Dv60&v60=en-us&c64=D%3Dv64&v64=hr&c67=D%3Dv67&v67=Friday%7C2018-05-04%7C15%3A18%7CUTC-05&v80=%2B1&s=1680x1050&c=24&j=1.6&v=N&k=Y&bw=1480&bh=803&AQE=1',
  'https://sci.intuit.com/b/ss/intuitcareersdev/1/JS-2.3.0/s61019462536819?AQB=1&ndh=1&pf=1&t=4%2F4%2F2018%2015%3A18%3A38%205%20300&fid=0B8EA3C9D5B93A8A-3F48C081A92C3D2A&ce=UTF-8&ns=intuitinc&pageName=hr%7Cmktg%7Ccareers%3Ataleo%7Ccandidateacquisition%2Fupload-resume&g=https%3A%2F%2Fintuit.taleo.net%2Fcareersection%2Fcareersection%2Fcandidateacquisition%2Fflow.jsf&r=https%3A%2F%2Fintuit.taleo.net%2Fcareersection%2F2%2Fjobapply.ftl%3Fjob%3D326044%26src%3Dcws-10013%26_ga%3D2.92356885.960409806.1525379012-633530453.1522943452%26lang%3Den&cc=USD&ch=hr%7Cmktg&server=intuit.taleo.net&events=event3&c1=D%3Dv1&v1=hr%7Cmktg%7Ccareers%3Ataleo&c2=D%3DpageName&c3=D%3DpageName&c9=hr%7Cmktg%7Ccareers%3Ataleo%7Ccandidateacquisition%2Fupload-resume&v17=D%3Dr&v26=CWS-10013&c27=D%3Dg&v27=D%3Dg&c36=2.3.0%7C2018-04-27%7Cdtm_satelliteLib-2273fbe872f5b415a53813247c5becc21b42ad28_stage&c42=hr%7Cmktg%7Ccareers%7Ccareersection%2Fcareersection%2Fcandidateacquisition%2Fflow.jsf&c49=D%3DpageName&v59=950732&c60=D%3Dv60&v60=en-us&c64=D%3Dv64&v64=hr&c67=D%3Dv67&v67=Friday%7C2018-05-04%7C15%3A18%7CUTC-05&v80=%2B1&s=1680x1050&c=24&j=1.6&v=N&k=Y&bw=1480&bh=803&AQE=1'
];

var results = compare.exec(ctl, chl);
console.log(JSON.stringify(results, null, 2));
