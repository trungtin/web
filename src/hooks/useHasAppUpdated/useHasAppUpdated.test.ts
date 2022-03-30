import { renderHook } from '@testing-library/react-hooks'
import { act } from '@testing-library/react-hooks'
import axios from 'axios'

import { useHasAppUpdated } from './useHasAppUpdated'
import { APP_UPDATE_CHECK_INTERVAL } from './useHasAppUpdated'

jest.mock('axios')
const mockAxios = axios as jest.Mocked<typeof axios>

global.window = Object.create(window)
const url = 'http://dummy.com'
Object.defineProperty(window, 'location', {
  value: {
    hostname: url
  },
  writable: true
})

describe('appUpdated', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    mockAxios.get.mockReset()
    jest.clearAllTimers()
  })
  afterAll(() => {
    jest.useRealTimers()
  })

  it('is false when nothing is changed', async () => {
    mockAxios.get.mockImplementation(url => {
      return Promise.resolve({ data: {} })
    })
    let { result, waitFor } = renderHook(() => useHasAppUpdated())

    expect(result.current).toBeFalsy()
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(() => waitFor(() => expect(mockAxios.get).toHaveBeenCalledTimes(2)))

    jest.advanceTimersByTime(APP_UPDATE_CHECK_INTERVAL)

    await waitFor(() => expect(mockAxios.get).toHaveBeenCalledTimes(3))
    expect(result.current).toBeFalsy()
  })

  it('is true when env is changed', async () => {
    mockAxios.get.mockImplementation(url => {
      if (url.includes('env.json')) {
        return Promise.resolve({ data: { changing: Date.now() } })
      }
      return Promise.resolve({ data: {} })
    })
    let { result, waitForNextUpdate, waitFor } = renderHook(() => useHasAppUpdated())
    expect(result.current).toBeFalsy()
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(() => waitFor(() => expect(mockAxios.get).toHaveBeenCalledTimes(2)))

    jest.advanceTimersByTime(APP_UPDATE_CHECK_INTERVAL)
    await waitForNextUpdate()
    expect(result.current).toBeTruthy()
  })
  it('is true when manifest is changed', async () => {
    mockAxios.get.mockImplementation(url => {
      if (url.includes('asset-manifest.json')) {
        return Promise.resolve({ data: { changing: Date.now() } })
      }
      return Promise.resolve({ data: {} })
    })
    let { result, waitForNextUpdate, waitFor } = renderHook(() => useHasAppUpdated())
    expect(result.current).toBeFalsy()
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(() => waitFor(() => expect(mockAxios.get).toHaveBeenCalledTimes(2)))

    jest.advanceTimersByTime(APP_UPDATE_CHECK_INTERVAL)
    await waitForNextUpdate()
    expect(result.current).toBeTruthy()
  })
})
