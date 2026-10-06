import { describe, it, expect } from 'vitest'

import { lumaEventUrl, lumaLocationLine } from '@/luma/client'

describe('luma client helpers', () => {
  it('builds event URLs from short slugs and keeps full URLs', () => {
    expect(lumaEventUrl('n4dgvloj')).toBe('https://luma.com/n4dgvloj')
    expect(lumaEventUrl('https://example.org/x')).toBe('https://example.org/x')
    expect(lumaEventUrl(null)).toBeUndefined()
  })

  it('formats a location line', () => {
    expect(
      lumaLocationLine({
        api_id: 'evt-1',
        name: 'x',
        start_at: '2026-01-01T00:00:00Z',
        url: 'abc',
        location_type: 'offline',
        geo_address_info: { description: 'The Broadmoor', city_state: 'Colorado Springs, CO' },
      }),
    ).toBe('The Broadmoor, Colorado Springs, CO')
    expect(
      lumaLocationLine({ api_id: 'evt-2', name: 'x', start_at: '', url: 'abc', location_type: 'online' }),
    ).toBe('Online')
  })
})
