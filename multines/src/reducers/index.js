import { combineReducers } from 'redux';
// import { routerReducer } from 'react-router-redux';

import player from './playerReducer';

export default combineReducers({
  player,
});
