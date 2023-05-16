import { ReactElement, createContext, useState, useReducer } from 'react'
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'
import {
  createNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface CyclesContextData {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  markCurrentCycleAsFinished: () => void
  amountSecondsPassed: number
  changeSecondsPassed: (secondsPassed: number) => void
  interruptCurrentCycle: () => void
  createNewCycle: (data: CreateCycleData) => void
}

export const CyclesContext = createContext({} as CyclesContextData)

interface CyclesContextProviderProps {
  children: ReactElement
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    activeCycleId: null,
    cycles: [],
  })

  const { activeCycleId, cycles } = cyclesState

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const markCurrentCycleAsFinished = () => {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  const changeSecondsPassed = (secondsPassed: number) => {
    setAmountSecondsPassed(secondsPassed)
  }

  const createNewCycle = (data: CreateCycleData) => {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      minutesAmount: data.minutesAmount,
      task: data.task,
      startDate: new Date(),
    }

    dispatch(createNewCycleAction(newCycle))
    setAmountSecondsPassed(0)
  }

  const interruptCurrentCycle = () => {
    dispatch(interruptCurrentCycleAction)
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        changeSecondsPassed,
        interruptCurrentCycle,
        createNewCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
