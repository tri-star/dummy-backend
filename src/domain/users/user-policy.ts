import { type User } from './user'

export function canFetch(self: User | undefined, target: User) {
  return self?.id === target.id
}

export function canUpdate(self: User | undefined, target: User) {
  return self?.id === target.id
}

export function canDelete(self: User | undefined, target: User) {
  return self?.id === target.id
}
