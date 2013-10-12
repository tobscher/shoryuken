(function() {
Shouryuken = {version: "0.0.1"}

Shouryuken.utils = {
    "firstMatchedProperty": function(obj, regexp) {
        for (var k in obj) {
            if (k.match(regexp)) {
                return k;
            }
        }
    },
    "matchedProperties": function(obj, regexp) {
        var props = [];
        for (var k in obj) {
            if (k.match(regexp)) {
                props.push(k);
            }
        }
        return props;
    },
    "emptyVal": function(val) {
        if (val == undefined || val == null) {
            return true;
        } else if (typeof(val) == "object") {
            var empty = true;
            for (k in val) {
                if (!KnockoutFire.utils.emptyVal(val[k])) {
                    empty = false;
                }
            }
            return empty;
        }
        return false;
    }
}

Shouryuken.observable = function(channel, map) {
  var self = {};

  var childNames = Shouryuken.utils.matchedProperties(map, /^[^\$\.][^\/]+$/);

  childNames.forEach(function(childName, i) {
    self[childName] = Shouryuken.makeObservable(channel, map[childName]);
  });

  return self;
};

Shouryuken.makeObservable = function(channel, map) {
  var self = null;

  var isCollection = Object.prototype.toString.call(map) === '[object Array]';

  if (isCollection) {
    self = ko.observableArray([]).extend({pushableArray: {pusherChannel: channel, map: map}});
    map.forEach(function(item, i) {
      var observable = Shouryuken.observable(channel, item);
      self.push(observable);
    });
  } else {
    self = ko.observable(map).extend({pushable: {pusherChannel: channel, map: map}});
  }

  return self;
};

ko.extenders.pushable = function(self, options) {
  var pusherChannel = options.pusherChannel;
  var map = options.map;

  return self;
}

ko.extenders.pushableArray = function(self, options) {
  var pusherChannel = options.pusherChannel;
  var map = options.map;

  // determine type
  var entityName = "issue"

  pusherChannel.bind(entityName + '.create', function(data) {
    var observable = Shouryuken.observable(options.pusherChannel, data);
    self.push(observable);
  });

  pusherChannel.bind(entityName + '.destroy', function(data) {
    var id = data;
    self.destroy(function(item) {
      return item.id() == id;
    });
  });

  pusherChannel.bind(entityName + '.update', function(data) {
    var match = ko.utils.arrayFirst(self(), function(item) {
      return item.id() == data.id;
    });

    var childNames = Shouryuken.utils.matchedProperties(data, /^[^\$\.][^\/]+$/);

    childNames.forEach(function(childName, i) {
      match[childName](data[childName]);
    });
  });

  return self;
}

})();
