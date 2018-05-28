## Plugin Development
Because reduxicle depends entirely on plugins, it's designed to be easily extensible. This guide is here to help you develop a plugin for reduxicle, and also to provide recommendations. To keep our plugin enviroment consistent and high quality, we suggest your follow this guide as much as possible, otherwise you may be at risk of being added to our blacklist. There's a few ways to write a plugin. 

- Plugin config class. You should use this if you need global level configuration, or need to apply a middleware. User's specifiy your plugin config in the constructor of your class and pass your configuration object to reduxicle like this:
```
<StoreProvider 
  config={{
    useImmutableJS: true,
    plugins: [
      new YourCoolPlugin(yourCoolConfig)
    ]
  }}
>
```

If you're using typescript, your plugin should implement the `IReduxiclePlugin` interface, which you can import from `@reduxicle/core/internals`. There's several helpers available to you to import from internals. A few notes regarding plugin classes:

- You should name your plugin class with a suffix of `Plugin`
- If you'd like to have users specifiy config specific to your plugin, you should use an object in the first parameter of the constructor. You should also add typescript or flow definitions for the config object users pass to your plugin. This gives them autocomplete and type saftey.
- If you'd like to do configuration based on the global reduxicle config (e.g. useImmutableJS), you can specifiy a public `initialize` method in your plugin. reduxicle will call your `initialize` method with the global reduxicle config before setting up the rest of your plugin.
- You should support immutable.js, since many users depend on it. You can use `getIn` and `setIn` from the reduxicle internals if you need to.
- You should not add `redux-saga` as a middleware. reduxicle already adds `redux-saga` as a middleware.

## General
- You should name your package `reduxicle-${yourPluginName}`. There's no need to have the word "plugin" anywhere in the name, because users can assume all packages beginning with `reduxicle-` are reduxicle plugins.
- If your plugin seems like something many users can benefit from and it's written in typescript, you should consider opening a PR to add the plugin to the main monorepo.
