const random = Math.random

export const randomChoice = <T>(items: readonly T[]): T => {
  if (!items.length) {
    throw new Error("No es pot seleccionar un element aleatori d'un array buit")
  }
  const index = Math.floor(random() * items.length)
  return items[index]
}

export const randomInt = (min: number, max: number): number => {
  const lower = Math.ceil(min)
  const upper = Math.floor(max)
  return Math.floor(random() * (upper - lower + 1)) + lower
}

export const randomFloat = (min: number, max: number, decimals = 2): number => {
  const value = random() * (max - min) + min
  return Number(value.toFixed(decimals))
}

export const randomBoolean = () => random() < 0.5

export const randomDateTimeLocal = (minDaysAhead = 0, maxDaysAhead = 30): string => {
  const now = new Date()
  const daysToAdd = randomInt(minDaysAhead, maxDaysAhead)
  const hours = randomInt(12, 22)
  const minutes = randomChoice([0, 15, 30, 45])

  const target = new Date(now)
  target.setDate(now.getDate() + daysToAdd)
  target.setHours(hours, minutes, 0, 0)

  const year = target.getFullYear()
  const month = String(target.getMonth() + 1).padStart(2, '0')
  const day = String(target.getDate()).padStart(2, '0')
  const hour = String(target.getHours()).padStart(2, '0')
  const minute = String(target.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hour}:${minute}`
}

export const randomPhoneNumber = (): string => {
  const prefix = randomChoice(['6', '7'])
  let number = prefix
  for (let index = 0; index < 8; index += 1) {
    number += randomInt(0, 9).toString()
  }
  return number
}

export const randomPassword = (length = 10): string => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$&'
  let password = ''
  for (let index = 0; index < length; index += 1) {
    password += alphabet.charAt(Math.floor(random() * alphabet.length))
  }
  return password
}

export const slugify = (value: string): string => {
  return value
    .normalize('NFD')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}
