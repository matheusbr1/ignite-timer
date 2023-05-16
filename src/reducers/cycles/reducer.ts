import { ActionTypes } from './actions'
import { produce } from 'immer'

export interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}

export function cyclesReducer(state: CyclesState, action: any) {
  switch (action.type) {
    case ActionTypes.CREATE_NEW_CYCLE:
      return produce(state, (draft) => {
        const { newCycle } = action.payload
        draft.cycles.push(newCycle)
        draft.activeCycleId = newCycle.id
      })

    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED:
      return produce(state, (draft) => {
        const currentCycleIndex = draft.cycles.findIndex(
          (cycle) => cycle.id === draft.activeCycleId,
        )

        if (currentCycleIndex < 0) return state

        draft.cycles[currentCycleIndex].finishedDate = new Date()
        draft.activeCycleId = null
      })

    case ActionTypes.INTERRUPT_CURRENT_CYCLE:
      return produce(state, (draft) => {
        const currentCycleIndex = draft.cycles.findIndex(
          (cycle) => cycle.id === draft.activeCycleId,
        )

        if (currentCycleIndex < 0) return state

        draft.cycles[currentCycleIndex].interruptedDate = new Date()
        draft.activeCycleId = null
      })
    default:
      return state
  }
}
