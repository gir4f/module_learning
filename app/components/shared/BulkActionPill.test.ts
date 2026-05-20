import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { fc } from 'fast-check'
import BulkActionPill, { type BulkAction, type BulkActionPillProps } from './BulkActionPill.vue'

describe('BulkActionPill', () => {
  describe('Unit Tests', () => {
    it('renders with default props', () => {
      const wrapper = mount(BulkActionPill, {
        props: {
          selectedCount: 5,
          actions: [],
          onCancel: vi.fn(),
        },
      })

      expect(wrapper.find('.fixed').exists()).toBe(true)
      expect(wrapper.text()).toContain('5 dipilih')
    })

    it('renders custom count label when provided', () => {
      const wrapper = mount(BulkActionPill, {
        props: {
          selectedCount: 3,
          actions: [],
          onCancel: vi.fn(),
          countLabel: 'Menghapus 1/3...',
        },
      })

      expect(wrapper.text()).toContain('Menghapus 1/3...')
      expect(wrapper.text()).not.toContain('3 dipilih')
    })

    it('renders one button per action', () => {
      const actions: BulkAction[] = [
        {
          key: 'publish',
          label: 'Publikasi',
          icon: 'pi pi-globe',
          severity: 'primary',
          handler: vi.fn(),
        },
        {
          key: 'delete',
          label: 'Hapus',
          icon: 'pi pi-trash',
          severity: 'danger',
          handler: vi.fn(),
        },
      ]

      const wrapper = mount(BulkActionPill, {
        props: {
          selectedCount: 2,
          actions,
          onCancel: vi.fn(),
        },
      })

      const buttons = wrapper.findAll('button')
      // N action buttons + 1 cancel button
      expect(buttons).toHaveLength(3)
    })

    it('calls action handler when action button is clicked', async () => {
      const handler = vi.fn()
      const actions: BulkAction[] = [
        {
          key: 'delete',
          label: 'Hapus',
          icon: 'pi pi-trash',
          severity: 'danger',
          handler,
        },
      ]

      const wrapper = mount(BulkActionPill, {
        props: {
          selectedCount: 1,
          actions,
          onCancel: vi.fn(),
        },
      })

      const actionButton = wrapper.findAll('button')[0]
      await actionButton.trigger('click')

      expect(handler).toHaveBeenCalledOnce()
    })

    it('calls onCancel when cancel button is clicked', async () => {
      const onCancel = vi.fn()
      const wrapper = mount(BulkActionPill, {
        props: {
          selectedCount: 1,
          actions: [],
          onCancel,
        },
      })

      const cancelButton = wrapper.findAll('button')[0]
      await cancelButton.trigger('click')

      expect(onCancel).toHaveBeenCalledOnce()
    })

    it('disables all buttons when busy is true', () => {
      const actions: BulkAction[] = [
        {
          key: 'delete',
          label: 'Hapus',
          icon: 'pi pi-trash',
          severity: 'danger',
          handler: vi.fn(),
        },
      ]

      const wrapper = mount(BulkActionPill, {
        props: {
          selectedCount: 1,
          actions,
          busy: true,
          onCancel: vi.fn(),
        },
      })

      const buttons = wrapper.findAll('button')
      buttons.forEach((button) => {
        expect(button.attributes('disabled')).toBeDefined()
      })
    })

    it('enables all buttons when busy is false', () => {
      const actions: BulkAction[] = [
        {
          key: 'delete',
          label: 'Hapus',
          icon: 'pi pi-trash',
          severity: 'danger',
          handler: vi.fn(),
        },
      ]

      const wrapper = mount(BulkActionPill, {
        props: {
          selectedCount: 1,
          actions,
          busy: false,
          onCancel: vi.fn(),
        },
      })

      const buttons = wrapper.findAll('button')
      buttons.forEach((button) => {
        expect(button.attributes('disabled')).toBeUndefined()
      })
    })

    it('applies positionStyle to root element', () => {
      const positionStyle = {
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
      }

      const wrapper = mount(BulkActionPill, {
        props: {
          selectedCount: 1,
          actions: [],
          onCancel: vi.fn(),
          positionStyle,
        },
      })

      const root = wrapper.find('.fixed')
      expect(root.attributes('style')).toContain('bottom: 20px')
      expect(root.attributes('style')).toContain('left: 50%')
      expect(root.attributes('style')).toContain('transform: translateX(-50%)')
    })

    it('applies correct severity classes to action buttons', () => {
      const actions: BulkAction[] = [
        {
          key: 'publish',
          label: 'Publikasi',
          icon: 'pi pi-globe',
          severity: 'primary',
          handler: vi.fn(),
        },
        {
          key: 'draft',
          label: 'Draf',
          icon: 'pi pi-file-edit',
          severity: 'secondary',
          handler: vi.fn(),
        },
        {
          key: 'delete',
          label: 'Hapus',
          icon: 'pi pi-trash',
          severity: 'danger',
          handler: vi.fn(),
        },
      ]

      const wrapper = mount(BulkActionPill, {
        props: {
          selectedCount: 3,
          actions,
          onCancel: vi.fn(),
        },
      })

      const buttons = wrapper.findAll('button')
      expect(buttons[0].classes()).toContain('bg-brand-teal')
      expect(buttons[1].classes()).toContain('border-slate-300')
      expect(buttons[2].classes()).toContain('border-red-200')
    })

    it('renders action icons correctly', () => {
      const actions: BulkAction[] = [
        {
          key: 'delete',
          label: 'Hapus',
          icon: 'pi pi-trash',
          severity: 'danger',
          handler: vi.fn(),
        },
      ]

      const wrapper = mount(BulkActionPill, {
        props: {
          selectedCount: 1,
          actions,
          onCancel: vi.fn(),
        },
      })

      const icon = wrapper.find('.pi-trash')
      expect(icon.exists()).toBe(true)
    })

    it('renders cancel button with correct icon', () => {
      const wrapper = mount(BulkActionPill, {
        props: {
          selectedCount: 1,
          actions: [],
          onCancel: vi.fn(),
        },
      })

      const cancelIcon = wrapper.find('.pi-times')
      expect(cancelIcon.exists()).toBe(true)
    })

    it('hides action labels on small screens', () => {
      const actions: BulkAction[] = [
        {
          key: 'delete',
          label: 'Hapus',
          icon: 'pi pi-trash',
          severity: 'danger',
          handler: vi.fn(),
        },
      ]

      const wrapper = mount(BulkActionPill, {
        props: {
          selectedCount: 1,
          actions,
          onCancel: vi.fn(),
        },
      })

      const label = wrapper.find('button span')
      expect(label.classes()).toContain('hidden')
      expect(label.classes()).toContain('min-[28rem]:inline')
    })
  })

  describe('Property-Based Tests', () => {
    /**
     * **Property 1: BulkActionPill renders correct count label**
     *
     * For any positive integer `selectedCount` and any optional `countLabel` override,
     * the rendered BulkActionPill SHALL display either the `countLabel` string or
     * `"{selectedCount} dipilih"` in the count element.
     *
     * **Validates: Requirements 1.1, 1.5**
     */
    it('Property 1: renders correct count label for any selectedCount and countLabel', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10000 }),
          fc.option(fc.string({ minLength: 1, maxLength: 100 })),
          (selectedCount, countLabel) => {
            const wrapper = mount(BulkActionPill, {
              props: {
                selectedCount,
                actions: [],
                onCancel: vi.fn(),
                countLabel,
              },
            })

            const expectedLabel = countLabel ?? `${selectedCount} dipilih`
            expect(wrapper.text()).toContain(expectedLabel)
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * **Property 2: BulkActionPill renders exactly N action buttons, all disabled when busy**
     *
     * For any non-empty `actions` array of length N and any boolean `busy` value,
     * the rendered BulkActionPill SHALL contain exactly N action buttons, and when
     * `busy` is true all N buttons plus the cancel button SHALL have the `disabled` attribute.
     *
     * **Validates: Requirements 1.2, 1.3, 1.4**
     */
    it('Property 2: renders exactly N action buttons with correct disabled state', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }).chain((n) =>
            fc.tuple(
              fc.constant(n),
              fc.array(
                fc.record({
                  key: fc.string({ minLength: 1, maxLength: 20 }),
                  label: fc.string({ minLength: 1, maxLength: 50 }),
                  icon: fc.string({ minLength: 1, maxLength: 30 }),
                  severity: fc.option(fc.constantFrom('primary', 'secondary', 'danger')),
                  handler: fc.constant(vi.fn()),
                }),
                { minLength: n, maxLength: n }
              )
            )
          ),
          fc.boolean(),
          (tuple, busy) => {
            const [expectedCount, actions] = tuple

            const wrapper = mount(BulkActionPill, {
              props: {
                selectedCount: 1,
                actions: actions as BulkAction[],
                busy,
                onCancel: vi.fn(),
              },
            })

            const buttons = wrapper.findAll('button')
            // N action buttons + 1 cancel button
            expect(buttons).toHaveLength(expectedCount + 1)

            if (busy) {
              buttons.forEach((button) => {
                expect(button.attributes('disabled')).toBeDefined()
              })
            } else {
              buttons.forEach((button) => {
                expect(button.attributes('disabled')).toBeUndefined()
              })
            }
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * **Property 3: BulkActionPill applies positionStyle to root element**
     *
     * For any valid CSSProperties object passed as `positionStyle`, the root element
     * of BulkActionPill SHALL have those CSS properties applied in its inline style.
     *
     * **Validates: Requirements 1.9**
     */
    it('Property 3: applies positionStyle to root element for any valid CSS properties', () => {
      fc.assert(
        fc.property(
          fc.record({
            bottom: fc.option(fc.string({ minLength: 1, maxLength: 20 })),
            left: fc.option(fc.string({ minLength: 1, maxLength: 20 })),
            right: fc.option(fc.string({ minLength: 1, maxLength: 20 })),
            top: fc.option(fc.string({ minLength: 1, maxLength: 20 })),
            transform: fc.option(fc.string({ minLength: 1, maxLength: 50 })),
            zIndex: fc.option(fc.integer({ min: 0, max: 9999 })),
          }),
          (positionStyle) => {
            // Filter out undefined values to create a valid CSSProperties object
            const cleanStyle = Object.fromEntries(
              Object.entries(positionStyle).filter(([, v]) => v !== null)
            )

            const wrapper = mount(BulkActionPill, {
              props: {
                selectedCount: 1,
                actions: [],
                onCancel: vi.fn(),
                positionStyle: cleanStyle as any,
              },
            })

            const root = wrapper.find('.fixed')
            const styleAttr = root.attributes('style') || ''

            // Verify that all provided style properties are present in the rendered style
            Object.entries(cleanStyle).forEach(([key, value]) => {
              if (value !== null && value !== undefined) {
                expect(styleAttr).toContain(String(value))
              }
            })
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})
