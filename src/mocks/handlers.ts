import { http, HttpResponse } from 'msw'

const MOCK_TOKEN = 'mock-token-admin'

interface MockUser {
  id: string
  username: string
  nickname: string
  email: string
  status: number
  createdAt: string
}

const users: MockUser[] = Array.from({ length: 57 }, (_, index) => ({
  id: String(index + 1),
  username: `user${String(index + 1).padStart(3, '0')}`,
  nickname: `用户 ${index + 1}`,
  email: `user${index + 1}@example.com`,
  status: index % 7 === 0 ? 0 : 1,
  createdAt: new Date(Date.now() - index * 86_400_000).toISOString(),
}))

function ok<T>(data: T) {
  return HttpResponse.json({ code: 0, message: 'ok', data })
}

function fail(code: number, message: string) {
  return HttpResponse.json({ code, message, data: null })
}

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { username?: string; password?: string }
    if (body.username === 'admin' && body.password === '123456') {
      return ok({ token: MOCK_TOKEN, expiresIn: 7200 })
    }
    return fail(40001, '用户名或密码错误')
  }),

  http.post('/api/auth/logout', () => ok(null)),

  http.get('/api/auth/profile', () =>
    ok({
      id: '1',
      username: 'admin',
      nickname: '超级管理员',
      avatar: '',
      roles: ['admin'],
      permissions: ['user:read', 'user:create', 'user:update', 'user:delete'],
    }),
  ),

  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const keyword = url.searchParams.get('keyword')?.trim() ?? ''
    const status = url.searchParams.get('status')

    let filtered = users
    if (keyword) {
      filtered = filtered.filter(
        (item) => item.username.includes(keyword) || item.nickname.includes(keyword),
      )
    }
    if (status !== null && status !== '') {
      filtered = filtered.filter((item) => item.status === Number(status))
    }

    const start = (page - 1) * pageSize
    return ok({
      list: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
    })
  }),

  http.post('/api/users', async ({ request }) => {
    const body = (await request.json()) as Partial<MockUser>
    const created: MockUser = {
      id: String(users.length + 1),
      username: body.username ?? '',
      nickname: body.nickname ?? '',
      email: body.email ?? '',
      status: body.status ?? 1,
      createdAt: new Date().toISOString(),
    }
    users.unshift(created)
    return ok(created)
  }),

  http.put('/api/users/:id', async ({ params, request }) => {
    const body = (await request.json()) as Partial<MockUser>
    const target = users.find((item) => item.id === String(params.id))
    if (!target) return fail(40401, '用户不存在')

    Object.assign(target, body)
    return ok(target)
  }),

  http.delete('/api/users/:id', ({ params }) => {
    const index = users.findIndex((item) => item.id === String(params.id))
    if (index !== -1) users.splice(index, 1)
    return ok(null)
  }),
]
