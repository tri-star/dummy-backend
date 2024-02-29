import { type User } from './user'

export function canFetch(self: User, target: User) {
  return self.id === target.id
}

export function canDelete(self: User, target: User) {
  return self.id === target.id
}
