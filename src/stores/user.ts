import { createStore } from 'zustand'

export type UserState = {
  uid: string | null
  name: string
}

export type UserActions = {
  update: (newValue: Partial<UserState>) => void
  clear: () => void
}

export type UserStore = UserState & UserActions

export const defaultInitState: UserState = {
  uid: null,
  name: '',
}

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()(set => ({
    ...initState,
    update: newValue => set(newValue),
    clear: () => set(initState),
  }))
}
