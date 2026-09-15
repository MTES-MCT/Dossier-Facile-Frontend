import { describe, expect, it } from 'vitest'
import { useAnalysisStateMachine } from '../analysis/useAnalysisStateMachine'

describe('useAnalysisStateMachine', () => {
  it('initializes in IDLE state by default', () => {
    const fsm = useAnalysisStateMachine()
    expect(fsm.currentState.value).toBe('IDLE')
    expect(fsm.isUploading.value).toBe(false)
    expect(fsm.isAnalyzing.value).toBe(false)
    expect(fsm.isOvertime.value).toBe(false)
    expect(fsm.analysisInProgress.value).toBe(false)
    expect(fsm.isSuccess.value).toBe(false)
    expect(fsm.hasFailed.value).toBe(false)
    expect(fsm.isBusy.value).toBe(false)
    expect(fsm.nextDisabled.value).toBe(false)
  })

  it('transitions to UPLOADING on startUpload', () => {
    const fsm = useAnalysisStateMachine()
    fsm.startUpload()

    expect(fsm.currentState.value).toBe('UPLOADING')
    expect(fsm.isUploading.value).toBe(true)
    expect(fsm.isBusy.value).toBe(true)
    expect(fsm.nextDisabled.value).toBe(true)
    expect(fsm.analysisInProgress.value).toBe(true)
  })

  it('transitions to ANALYZING on startAnalysis', () => {
    const fsm = useAnalysisStateMachine()
    fsm.startAnalysis()

    expect(fsm.currentState.value).toBe('ANALYZING')
    expect(fsm.isAnalyzing.value).toBe(true)
    expect(fsm.analysisInProgress.value).toBe(true)
    expect(fsm.isBusy.value).toBe(true)
    expect(fsm.nextDisabled.value).toBe(true)
    expect(fsm.isOvertime.value).toBe(false)
  })

  it('transitions from ANALYZING to OVERTIME, freeing the user from isBusy', () => {
    const fsm = useAnalysisStateMachine()
    fsm.startAnalysis()
    fsm.triggerOvertime()

    expect(fsm.currentState.value).toBe('OVERTIME')
    expect(fsm.isOvertime.value).toBe(true)
    expect(fsm.analysisInProgress.value).toBe(true)
    expect(fsm.isBusy.value).toBe(false)
    expect(fsm.nextDisabled.value).toBe(false)
  })

  it('does not transition to OVERTIME if not currently in ANALYZING', () => {
    const fsm = useAnalysisStateMachine()
    fsm.triggerOvertime()
    expect(fsm.currentState.value).toBe('IDLE')

    fsm.startUpload()
    fsm.triggerOvertime()
    expect(fsm.currentState.value).toBe('UPLOADING')
  })

  it('transitions to SUCCESS on analysisSuccess', () => {
    const fsm = useAnalysisStateMachine()
    fsm.startAnalysis()
    fsm.analysisSuccess()

    expect(fsm.currentState.value).toBe('SUCCESS')
    expect(fsm.isSuccess.value).toBe(true)
    expect(fsm.analysisInProgress.value).toBe(false)
    expect(fsm.isBusy.value).toBe(false)
  })

  it('transitions to FAILED on analysisFailed', () => {
    const fsm = useAnalysisStateMachine()
    fsm.startAnalysis()
    fsm.analysisFailed()

    expect(fsm.currentState.value).toBe('FAILED')
    expect(fsm.hasFailed.value).toBe(true)
    expect(fsm.analysisInProgress.value).toBe(false)
    expect(fsm.isBusy.value).toBe(false)
  })

  it('resets back to IDLE on reset', () => {
    const fsm = useAnalysisStateMachine()
    fsm.startAnalysis()
    fsm.reset()

    expect(fsm.currentState.value).toBe('IDLE')
    expect(fsm.analysisInProgress.value).toBe(false)
    expect(fsm.isBusy.value).toBe(false)
  })
})
