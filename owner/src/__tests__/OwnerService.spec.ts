import { expect, it, describe, vi } from 'vitest'
import axios from 'axios'
import OwnerService from '@/components/account/OwnerService'
import type { NamesForm } from 'df-shared-next/src/models/NamesForm'

vi.mock('axios')

describe('OwnerService', () => {
  it('should call POST /api/owner/names with NamesForm object without email', async () => {
    const postSpy = vi.spyOn(axios, 'post').mockResolvedValue({ data: {} })

    const namesForm: NamesForm = {
      firstName: 'Jean',
      lastName: 'Dupont'
    }

    await OwnerService.saveNames(namesForm)

    expect(postSpy).toHaveBeenCalledWith(
      expect.stringContaining('owner/names'),
      {
        firstName: 'Jean',
        lastName: 'Dupont'
      }
    )
    expect(postSpy.mock.calls[0][1]).not.toHaveProperty('email')
  })
})
