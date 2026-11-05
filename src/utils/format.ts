import dayjs from 'dayjs'

/** 格式化日期时间，空值统一显示为 '-' */
export function formatDateTime(
  value?: string | number | Date | null,
  pattern = 'YYYY-MM-DD HH:mm:ss',
): string {
  if (value === undefined || value === null || value === '') return '-'
  const parsed = dayjs(value)
  return parsed.isValid() ? parsed.format(pattern) : '-'
}

/** 格式化日期（不含时间） */
export function formatDate(value?: string | number | Date | null): string {
  return formatDateTime(value, 'YYYY-MM-DD')
}
