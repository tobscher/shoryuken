(function() {
Shoryuken = {version: "0.0.1"}

Shoryuken.utils = {
    "matchedProperties": function(obj, regexp) {
        var props = [];
        for (var k in obj) {
            if (k.match(regexp)) {
                props.push(k);
            }
        }
        return props;
    }
}

Shoryuken.observe = function(channelOrConnection) {
  channelOrConnection.bind('metaCreate', function(data) {
    var model = data.model;
    // Use inflection framework
    var collection = model + "s";

    $('[data-collection="' + collection + '"]').each(function(index, element) {
      var context = ko.dataFor(element);

      content[collection].push(ko.mapping.fromJS(data.data));
    });
  });

  channelOrConnection.bind('metaDestroy', function(data) {
    var model = data.model;
    // Use inflection framework
    var collection = model + "s";

    $('[data-collection="' + collection + '"]').each(function(index, element) {
      var context = ko.dataFor(element);

      context[collection].destroy(function(item) {
        return item.id() == data.data;
      });
    });
  });

  channelOrConnection.bind('metaUpdate', function(data) {
    var model = data.model;

    $('[data-model="' + model + '"]').each(function(index, element) {
      var context = ko.dataFor(element);

      if (context.id() != data.data.id) return;

      var childNames = Shoryuken.utils.matchedProperties(data.data, /^[^\$\.][^\/]+$/);

      childNames.forEach(function(childName, i) {
        context[childName](data.data[childName]);
      });
    });
  });
};
})();
