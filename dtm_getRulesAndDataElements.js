var items = {
  dataElement: _satellite.dataElements, // { {{id}}: {}, {{id}}: {} }
  pageLoad: _satellite.pageLoadRules, // [ { name: '', event: '', trigger: [] }, { name: '' } ]
  eventBased: _satellite.rules, // [ { name: '', event: '', scope: {}, trigger: [] }, { name: '' } ]
  directCall: _satellite.directCallRules // [ { name: '' }, { name: '' } ]
}

var output = [];
for (key in items) {
  if (key === 'dataElement') {
    for(ele in items[key]) {
      output.push({
        type: key,
        name: ele,
        event: null,
        trigger: null
      });      
    }
  } else {
    for (var i = 0, maxi = items[key].length; i < maxi; i++) {
      output.push({
        type: key,
        name: items[key][i].name,
        event: items[key][i].event,
        trigger: items[key][i].trigger
      });
    }
  }
}

console.table(output);
