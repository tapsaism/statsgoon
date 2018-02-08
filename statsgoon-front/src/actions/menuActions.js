const SWITCH_SELECTED_CONTENT = 'SWITCH_SELECTED_CONTENT'

export function updateSelectedContent(content) {
  return(dispatch) => {
    dispatch(switchSelectedContent(content))
  }
}

export function switchSelectedContent(content) {
  return {
    type: SWITCH_SELECTED_CONTENT,
    selectedContent: content
  }
}
