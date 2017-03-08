const initialState = {
	player: {},
};

function playerReducer(state = initialState, action) {
  switch (action.type) {

    case 'UPDATE_PLAYER':
      return { ...action.user };

    default:
      return state;
  }
}

export default playerReducer;
