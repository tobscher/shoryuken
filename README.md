# shoryuken [![Build Status](https://travis-ci.org/Tobscher/shoryuken.png?branch=master)](https://travis-ci.org/Tobscher/shoryuken)

JavaScript library to integrate Pusher with Knockout

## Example

### HTML

```html
<div id="viewModel">
  <ul data-bind="foreach: items" data-collection="items">
    <li data-bind="text: content" data-model="item"></li>
  </ul>
</div>
```

### JavaScript

```javascript
// Initialize pusher
var pusher = new Pusher('your-pusher-key-here');
var channel = pusher.subscribe('test_channel');

// Set up view model
// This data could as well come from your backend
var data = {
  items: ko.observableArray([
    {id: ko.observable(1), content: ko.observable("Foo")},
    {id: ko.observable(2), content: ko.observable("Bar")}
  ]),
  foo: ko.observable("Foo"),
  bar: ko.observable("Bar")
};

// Apply bindings
ko.applyBindings(data, $("#viewModel"));

// observe pusher channel for meta events
// e.g. metaCreate, metaUpdate, metaDestroy
Shoryuken.observe(channel);
```

### Meta events

When you trigger meta events from your server side make sure it is pushed
as follows:

#### metaCreate

Event name: `metaCreate`
Event data:
```javascript
{
  event: "metaCreate",
  data: {
    id: 1,
    name: "Foo",
    description: "Bar"
  },
  model: "model-name"
}
```

#### metaUpdate

Event name: `metaUpdate`
Event data:
```javascript
{
  event: "metaUpdate",
  data: {
    id: 1,
    name: "Baz",
    description: "Qux"
  },
  model: "model-name"
}
```

#### metaDestroy

Event name: `metaDestroy`
Event data:
```javascript
{
  event: "metaDestroy",
  data: 1,
  model: "model-name"
}
```
