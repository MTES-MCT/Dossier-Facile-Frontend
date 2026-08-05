import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { sanitizeHtml, vSafeHtml } from '../SanitizeService'

describe('SanitizeService', () => {
  describe('sanitizeHtml', () => {
    it('returns an empty string when given null, undefined, or empty string', () => {
      expect(sanitizeHtml(null)).toBe('')
      expect(sanitizeHtml(undefined)).toBe('')
      expect(sanitizeHtml('')).toBe('')
    })

    it('preserves allowed HTML tags and attributes', () => {
      const html = '<p class="text">Hello <strong>world</strong> <a href="https://example.com" target="_blank" rel="noopener">link</a></p>'
      const clean = sanitizeHtml(html)
      expect(clean).toContain('class="text"')
      expect(clean).toContain('<strong>world</strong>')
      expect(clean).toContain('href="https://example.com"')
    })

    it('strips dangerous <script> tags and inline event handlers', () => {
      const dirty = '<p>Test <script>alert("xss")</script><img src="x" onerror="alert(1)" /></p>'
      const clean = sanitizeHtml(dirty)
      expect(clean).not.toContain('<script>')
      expect(clean).not.toContain('onerror')
      expect(clean).not.toContain('alert')
      expect(clean).toBe('<p>Test </p>')
    })

    it('strips javascript: URLs from href attributes', () => {
      const dirty = '<a href="javascript:alert(1)">Click me</a>'
      const clean = sanitizeHtml(dirty)
      expect(clean).not.toContain('javascript:')
      expect(clean).toBe('<a>Click me</a>')
    })
  })

  describe('vSafeHtml directive', () => {
    it('sanitizes content mounted with v-safe-html directive', () => {
      const Component = {
        template: '<div v-safe-html="content"></div>',
        directives: { safeHtml: vSafeHtml },
        props: ['content']
      }

      const wrapper = mount(Component, {
        props: {
          content: '<b>Safe</b><script>alert(1)</script>'
        }
      })

      expect(wrapper.html()).toContain('<b>Safe</b>')
      expect(wrapper.html()).not.toContain('<script>')
    })
  })
})
