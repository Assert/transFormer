### transFormer.js
This is a light lightweight JavaScript two way binding framework. It lets you bind JSON-objects directly to your HTML-markup. Convention over configuration is the key to this framework and the JSON will be bound to HTML-elements with matching IDs. 

You can also make JSON-objects directly from your form-elements. Make objects that contain data, arrays and other objects just the way you want them without any code required. All you might need are some declarative attributes in your form-elements.

```
var json = {
    name: "Bob Doe",
    country: "Norway",
    age : "31"
};
transFormer.bind(json);
```
The bind function will look for HTML-elements with matching IDs. Like the one below:
```
    <h2 id="name"></h2>
    <div id="country"></div>
    <div id="age"></div>
```

Get your copy of transFormer.js from GitHub or Nuget.
