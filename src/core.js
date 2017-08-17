import {List, Map} from 'immutable'

export const INITIAL_STATE = Map()

export function setEntries(state, entries) {
  return state.set('entries', List(entries))
}

export function next(state) {
  const entries = state.get('entries').concat(getWinners(state.get('vote')))
  const round = state.getIn(['vote', 'round']) || 0
  if (entries.size == 1) {
    return state.remove('entries').remove('vote').set('winner', entries.first())
  }
  return state.merge({
    vote: Map({
      pair: entries.take(2),
      round: round + 1
    }),
    entries: entries.skip(2)
  })
}

export function vote(state, movie) {
  const pair = state.get('pair')
  if(pair && pair.includes(movie))
    return state.updateIn(['tally', movie], (votes = 0) => votes + 1 )
  else
    return state
}

function getWinners(vote) {
  if(!vote) return []
  const [a, b] = vote.get('pair')
  const aVotes = vote.getIn(['tally', a], 0)
  const bVotes = vote.getIn(['tally', b], 0)
  if (aVotes > bVotes) return [a]
  if (bVotes > aVotes) return [b]
  else return [a, b]
}
