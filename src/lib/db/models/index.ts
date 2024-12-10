import { Model } from 'mongoose'
import type { Business } from './business'
import { BusinessModel } from './business'
import type { Talent, TalentStatus } from './talent'
import { TalentModel } from './talent'
import type { User } from './user'
import UserModel from './user'

export { TalentModel }
export { BusinessModel }
export { default as UserModel } from './user'

export type {
  Business,
  Talent,
  TalentStatus,
  User,
}

export type ModelWithStatics<T, S = {}> = Model<T> & S 