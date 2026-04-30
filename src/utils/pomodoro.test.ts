import { describe, it, expect } from 'vitest'
import { calcTimerState, shouldDing, nextTickType, durationForType } from './pomodoro'

describe('calcTimerState', () => {
  it('在番茄钟进行中时返回剩余时间和进度', () => {
    const state = calcTimerState(5 * 60 * 1000, 25)
    expect(state.done).toBe(false)
    expect(state.last).toBe('5:00')
    expect(state.left).toBe('20:00')
    expect(state.progress).toBeCloseTo(20)
  })

  it('时间到了时返回 done=true', () => {
    const state = calcTimerState(30 * 60 * 1000, 25)
    expect(state.done).toBe(true)
    expect(state.left).toBe('0:00')
    expect(state.last).toBe('25:00')
    expect(state.progress).toBe(100)
  })

  it('恰好到时返回 done=true', () => {
    const state = calcTimerState(25 * 60 * 1000, 25)
    expect(state.done).toBe(true)
  })

  it('短番茄钟 5 分钟正确计算进度', () => {
    const state = calcTimerState(2.5 * 60 * 1000, 5)
    expect(state.done).toBe(false)
    expect(state.progress).toBeCloseTo(50)
  })
})

describe('shouldDing', () => {
  it('dingCount 为 0 时触发', () => {
    expect(shouldDing(0, 10)).toBe(true)
  })

  it('dingCount 为 dingInterval 倍数时触发', () => {
    expect(shouldDing(10, 10)).toBe(true)
    expect(shouldDing(20, 10)).toBe(true)
  })

  it('非倍数时不触发', () => {
    expect(shouldDing(5, 10)).toBe(false)
    expect(shouldDing(11, 10)).toBe(false)
  })
})

describe('nextTickType', () => {
  it('L 切换到 S', () => {
    expect(nextTickType('L')).toBe('S')
  })

  it('S 切换到 L', () => {
    expect(nextTickType('S')).toBe('L')
  })
})

describe('durationForType', () => {
  it('L 为 25 分钟', () => {
    expect(durationForType('L')).toBe(25)
  })

  it('S 为 5 分钟', () => {
    expect(durationForType('S')).toBe(5)
  })
})
