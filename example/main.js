var data = {
  items: ko.observableArray([
    {id: ko.observable(1), content: ko.observable("Foo")},
    {id: ko.observable(2), content: ko.observable("Bar")}
  ]),
  foo: ko.observable("Foo"),
  bar: ko.observable("Bar")
};

ko.applyBindings(data, document.getElementById("viewModel"));

var viewModel = Shoryuken.observe(channel);
