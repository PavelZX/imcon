import { RT_EVENT } from '../redux/constants/api_types'
import Actions                     from '../redux/actions/session'

export default store => next => action => {
  const rtEvent = action[RT_EVENT]
  if (typeof rtEvent === 'undefined') {
    return next(action)
  }

  let {talkId, event, payload} = rtEvent

  if (!talkId) {
    throw new Error('No talk!')
  }
  if (!event) {
    throw new Error('No event!')
  }
  if (!payload) {
    throw new Error('No payload!')
  }

  function actionWith(params) {
    const finalAction = Object.assign({}, action, params)
    delete finalAction[RT_EVENT]
    return finalAction
  }

  let foundTalk = Actions.findTalk(talkId)
  foundTalk.push(event, payload)
    .receive('ok', (msg) => {
      next(actionWith({type: action.type + '_SUCCESS'}))
    })

  return next(actionWith({}))
}
