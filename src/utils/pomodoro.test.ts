import { describe, it, expect } from 'vitest'
import { calcTimerState, shouldDing, nextTickType, durationForType } from './pomodoro'

describe('calcTimerState', () => {
  it('returns elapsed time and progress when timer is running', () => {
    const state = calcTimerState(5 * 60 * 1000, 25)
    expect(state.done).toBe(false)
    expect(state.last).toBe('5:00')
    expect(state.left).toBe('20:00')
    expect(state.progress).toBeCloseTo(20)
  })

  it('returns done=true when time is up', () => {
    const state = calcTimerState(30 * 60 * 1000, 25)
    expect(state.done).toBe(true)
    expect(state.left).toBe('0:00')
    expect(state.last).toBe('25:00')
    expect(state.progress).toBe(100)
  })

  it('returns done=true when exactly at duration', () => {
    const state = calcTimerState(25 * 60 * 1000, 25)
    expect(state.done).toBe(true)
  })

  it('correctly calculates progress for 5-minute short timer', () => {
    const state = calcTimerState(2.5 * 60 * 1000, 5)
    expect(state.done).toBe(false)
    expect(state.progress).toBeCloseTo(50)
  })
})

describe('shouldDing', () => {
  it('triggers when dingCount is 0', () => {
    expect(shouldDing(0, 10)).toBe(true)
  })

  it('triggers when dingCount is a multiple of dingInterval', () => {
    expect(shouldDing(10, 10)).toBe(true)
    expect(shouldDing(20, 10)).toBe(true)
  })

  it('does not trigger when not a multiple', () => {
    expect(shouldDing(5, 10)).toBe(false)
    expect(shouldDing(11, 10)).toBe(false)
  })
})

describe('nextTickType', () => {
  it('switches L to S', () => {
    expect(nextTickType('L')).toBe('S')
  })

  it('switches S to L', () => {
    expect(nextTickType('S')).toBe('L')
  })
})

describe('durationForType', () => {
  it('L is 25 minutes', () => {
    expect(durationForType('L')).toBe(25)
  })

  it('S is 5 minutes', () => {
    expect(durationForType('S')).toBe(5)
  })
})
