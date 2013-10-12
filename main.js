var data = {
  items: [
    {id: 1, content: "Foo"},
    {id: 2, content: "Bar"}
  ],
  foo: "Foo",
  bar: "Bar"
};

var viewModel = Shouryuken.observable(channel, data);

ko.applyBindings(viewModel, document.getElementById("viewModel"));
