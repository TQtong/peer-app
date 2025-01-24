import { ref } from 'vue'
function useReducer(reducer:any, initialState:any) {
  const state = ref(initialState)

  const action = {} as any

  function dispatch({ type, payLoad }) {
    action.type = type
    action.payLoad = payLoad
    reducer(state, action)
  }
  return [state, dispatch]
}

export default useReducer
