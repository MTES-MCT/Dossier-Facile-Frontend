import { computed, ref } from 'vue'

export type AnalysisStepState =
  | 'IDLE'
  | 'UPLOADING'
  | 'ANALYZING'
  | 'OVERTIME'
  | 'SUCCESS'
  | 'FAILED'

export function useAnalysisStateMachine(initialState: AnalysisStepState = 'IDLE') {
  const currentState = ref<AnalysisStepState>(initialState)

  // Derived computed states
  const isUploading = computed(() => currentState.value === 'UPLOADING')
  const isAnalyzing = computed(() => currentState.value === 'ANALYZING')
  const isOvertime = computed(() => currentState.value === 'OVERTIME')
  const analysisInProgress = computed(
    () =>
      currentState.value === 'UPLOADING' ||
      currentState.value === 'ANALYZING' ||
      currentState.value === 'OVERTIME'
  )
  const isSuccess = computed(() => currentState.value === 'SUCCESS')
  const hasFailed = computed(() => currentState.value === 'FAILED')

  // Busy & navigation button status
  const isBusy = computed(() => isUploading.value || isAnalyzing.value)
  const nextDisabled = computed(() => isBusy.value)

  // Transitions
  function startUpload() {
    currentState.value = 'UPLOADING'
  }

  function startAnalysis() {
    currentState.value = 'ANALYZING'
  }

  function triggerOvertime() {
    if (currentState.value === 'ANALYZING') {
      currentState.value = 'OVERTIME'
    }
  }

  function analysisSuccess() {
    currentState.value = 'SUCCESS'
  }

  function analysisFailed() {
    currentState.value = 'FAILED'
  }

  function reset() {
    currentState.value = 'IDLE'
  }

  return {
    currentState,
    isUploading,
    isAnalyzing,
    isOvertime,
    analysisInProgress,
    isSuccess,
    hasFailed,
    isBusy,
    nextDisabled,
    startUpload,
    startAnalysis,
    triggerOvertime,
    analysisSuccess,
    analysisFailed,
    reset
  }
}
