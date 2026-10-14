/**
 * Moves the keyboard focus to an element and brings a block into view. Used after closing a
 * modal to land the user on the dashboard block the modal pointed to: the focus on the title
 * makes screen readers announce the block, the scroll on the whole block shows it entirely
 * (badge and card edges included) for sighted users.
 */
export function focusAndScrollTo(
  focusTarget: HTMLElement | null | undefined,
  scrollTarget: HTMLElement | null | undefined = focusTarget
) {
  if (!focusTarget) return
  const reducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  focusTarget.focus({ preventScroll: true })
  ;(scrollTarget ?? focusTarget).scrollIntoView({
    behavior: reducedMotion ? 'auto' : 'smooth',
    block: 'start'
  })
}
