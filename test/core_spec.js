import {expect} from 'chai'
import {List, Map, fromJS} from 'immutable'
import { setEntries, vote, next } from '../src/core'

describe('application logic', () => {
  describe('setEntries', () => {
    it('adds entries to the current state', () => {
      const state = Map()
      const entries = List.of('A', 'B')
      const nextState = setEntries(state,entries)

      expect(nextState).to.equal(fromJS({
        entries: ['A', 'B']
      }))
    })

    it('converts to immutable', () => {
      const state = Map();
      const entries = ['Trainspotting', '28 Days Later'];
      const nextState = setEntries(state, entries);
      expect(nextState).to.equal(fromJS({
        entries: ['Trainspotting', '28 Days Later']
      }));
    });
  })

  describe('next', () => {
    it("takes the next 2 movies and puts them in the 'vote' map", () => {
      const state = fromJS({
        entries: ['A','B','C']
      })
      const nextState = next(state)

      expect(nextState).to.equal(fromJS({
        vote: {
          pair: ['A','B'],
          round: 1
        },
        entries: ['C']
      }))
    })

    it("puts the winner of vote back in the entries", () => {
      const state = fromJS({
        vote: {
          pair: ['A','B'],
          tally: { 'A': 1, 'B': 2 }
        },
        entries: ['C','D']
      })
      const nextState = next(state)

      expect(nextState).to.equal(fromJS({
        vote: {
          pair: ['C','D'],
          round: 1
        },
        entries: ['B']
      }))
    })

    it("puts both entries back in the entries if they tied", () => {
      const state = fromJS({
        vote: {
          pair: ['A','B'],
          tally: { 'A': 2, 'B': 2 }
        },
        entries: ['C','D']
      })
      const nextState = next(state)

      expect(nextState).to.equal(fromJS({
        vote: {
          pair: ['C','D'],
          round: 1
        },
        entries: ['A', 'B']
      }))
    })

    it("sets a winner when the vote is over", () => {
      const state = fromJS({
        vote: {
          pair: ['A','B'],
          tally: { 'A': 3, 'B': 2 }
        },
        entries: []
      })
      const nextState = next(state)

      expect(nextState).to.equal(fromJS({
        winner: 'A'
      }))
    })
  })

  describe('vote', () => {
    it('creates an entry in tally if it doesnt exist', () => {
      const state = fromJS({
        pair: ['A','B']
      })
      const nextState = vote(state, 'A')

      expect(nextState).to.equal(fromJS({
        pair: ['A','B'],
        tally: { 'A': 1 }
      }))
    })

    it('adds to existing entry in tally', () => {
      const state = fromJS({
        pair: ['A','B'],
        tally: { 'A': 1 }
      })
      const nextState = vote(state, 'A')

      expect(nextState).to.equal(fromJS({
        pair: ['A','B'],
        tally: {'A': 2 }
      }))
    })

    it('doesnt update the tally if the entry is not in the pair', () => {
      const state = fromJS({
        pair: ['A','B']
      })
      const nextState = vote(state, 'C')

      expect(nextState).to.equal(state)
    })
  })
})
