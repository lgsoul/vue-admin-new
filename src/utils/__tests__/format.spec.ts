import { describe, expect, it } from 'vitest'
import { formatDate, formatDateTime } from '../format'

describe('formatDateTime', () => {
  it('空值统一返回占位符', () => {
    expect(formatDateTime(null)).toBe('-')
    expect(formatDateTime(undefined)).toBe('-')
    expect(formatDateTime('')).toBe('-')
  })

  it('按默认模板格式化', () => {
    expect(formatDateTime('2026-10-16T10:30:00')).toBe('2026-10-16 10:30:00')
  })

  it('非法时间返回占位符', () => {
    expect(formatDateTime('not-a-date')).toBe('-')
  })
})

describe('formatDate', () => {
  it('只保留日期部分', () => {
    expect(formatDate('2026-10-16T10:30:00')).toBe('2026-10-16')
  })

  it('空值返回占位符', () => {
    expect(formatDate(null)).toBe('-')
  })
})
