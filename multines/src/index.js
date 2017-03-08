import React from 'react';
import { render } from 'react-dom'
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import reducers from './reducers/'

import Routes from './routes';

render(
  <Provider store={createStore(reducers)}>
  	<Routes history={browserHistory} />
  </Provider>,
  document.getElementById('root')
)
