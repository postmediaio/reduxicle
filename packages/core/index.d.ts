import React from 'react';

declare namespace Reduxicle {
  export interface IStoreProviderProps {
    useImmutableJS?: boolean;
  }
  
  export class StoreProvider extends React.PureComponent<IStoreProviderProps> {}
  export const withSaga: (saga: Function) => (component: React.ComponentClass) => React.ComponentClass;
  export const withReducer: (reducer: Function) => (component: React.ComponentClass) => React.ComponentClass;
  export const withKey: (key: string) => (component: React.ComponentClass) => React.ComponentClass;
}

export = Reduxicle;
