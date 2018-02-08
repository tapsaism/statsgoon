const initialState =
  {
    selectedContent: 'solver'
  }

const menu = (state = initialState, action) => {
  switch (action.type) {
    case 'SWITCH_SELECTED_CONTENT':
      return {
          ...state,
          selectedContent: action.selectedContent
      }
    default:
      return state
  }
}

export default menu
