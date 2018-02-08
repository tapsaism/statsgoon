import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import amplify from 'aws-amplify';
import aws_exports from './aws-exports';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import reducer from './reducers/index'
import Statsgoon from './components/statsgoonMain/StatsgoonMainContainer';

amplify.configure(aws_exports)

const store = createStore(reducer,applyMiddleware(thunk))

ReactDOM.render(
  <Provider store={store}>
    <Statsgoon />
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
