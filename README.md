# ⚠️ Deprecated ⚠️
This package is deprecated in favour of (redux-injectors)[https://github.com/react-boilerplate/redux-injectors]. Please use that instead.

# reduxicle
Reduxicle is a collection of factories and HOCs to add a layer of abstraction on top of redux. It uses redux under the hood but injects props into your components so you write less code.

## Getting Started
- Install the reduxicle core: `yarn add @reduxicle/core`
- Install all the plugins you would like to use: `yarn add @reduxicle/dialog @reduxicle/select-item ...`
- Replace your redux `Provider` with `@reduxicle/core`'s `StoreProvider`. `StoreProvider` will create the store for you, so there's no need to pass in your own store. reduxicle currently does not support adding reducers other than by using `withReducer`, so you may need to port your existing reducers to use `withReducer`.

## List of plugins
- [`@reduxicle/dialog`](#@reduxicle/dialog)
- [`@reduxicle/react-router`](#@reduxicle/react-router)

### @reduxicle/dialog
**Summary**: Open and close a dialog  
**Import**: `import { withDialog } from '@reduxicle/dialog'`  
**Usage**: `withDialog({ name: 'addProduct' })`  
**Injections**: 
- `open{name}Dialog`
- `close{name}Dialog`
- `{name}DialogIsOpen`

### @reduxicle/react-router
**Summary**: Integrates react-router with reduxicle
**Import**: `import { ReactRouterPlugin } from '@reduxicle/react-router'`  
**Usage**: 
```js
const config = {
  plugins: [
    new ReactRouterPlugin()
  ]
}
<StoreProvider config={config}>
  ...
</StoreProvider>
```  
**Injections**: none
