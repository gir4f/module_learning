import type { Prisma } from '@prisma/client'
import type { RequestProfile } from './auth'

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE'
export type AuditEntityType = 'MODULE' | 'MODULE_DETAIL' | 'COMPONENT_ITEM' | 'ATTACHMENT'

export interface RecordAuditEntryParams {
  tx: Prisma.TransactionClient
  actor: { id: string; email: string; fullName?: string | null }
  action: AuditAction
  entityType: AuditEntityType
  entityId: string
  entityLabel: string
  payloadBefore?: unknown
  payloadAfter?: unknown
}

/**
 * Truncates an entity label to a maximum of 200 characters.
 * Inputs of 200 characters or fewer are returned unchanged.
 */
export function truncateLabel(label: string): string {
  return label.slice(0, 200)
}

/**
 * Serializes a payload value into a JSON-safe representation.
 * - Date instances → ISO 8601 strings
 * - Prisma Decimal instances → numbers
 * - Buffer instances → null
 * - undefined, function, symbol → null
 * - Circular references → "[Circular]" marker
 * - If serialized JSON exceeds 64KB, returns { _truncated: true, originalBytes: <size> }
 */
export function serializePayload(value: unknown): unknown {
  if (value === undefined || value === null) return null

  const seen = new WeakSet<object>()

  function transform(val: unknown): unknown {
    // Handle null/undefined
    if (val === null || val === undefined) return null

    // Handle functions and symbols
    if (typeof val === 'function' || typeof val === 'symbol') return null

    // Handle primitives (string, number, boolean, bigint)
    if (typeof val !== 'object') {
      if (typeof val === 'bigint') return Number(val)
      return val
    }

    // Handle Date
    if (val instanceof Date) return val.toISOString()

    // Handle Buffer
    if (Buffer.isBuffer(val)) return null

    // Handle Decimal (Prisma Decimal has a toNumber method)
    if (val !== null && typeof val === 'object' && 'toNumber' in val && typeof (val as any).toNumber === 'function' && (val.constructor?.name === 'Decimal' || val.constructor?.name === 'Prisma.Decimal')) {
      return (val as any).toNumber()
    }

    // Circular reference detection
    if (seen.has(val)) return '[Circular]'
    seen.add(val)

    // Handle arrays
    if (Array.isArray(val)) {
      return val.map(item => transform(item))
    }

    // Handle plain objects
    const result: Record<string, unknown> = {}
    for (const key of Object.keys(val as object)) {
      const propVal = (val as any)[key]
      result[key] = transform(propVal)
    }
    return result
  }

  const transformed = transform(value)

  // Check 64KB size limit (byte-based)
  const serialized = JSON.stringify(transformed)
  const byteSize = new TextEncoder().encode(serialized).length
  if (byteSize > 65_536) {
    return { _truncated: true, originalBytes: byteSize }
  }

  return transformed
}

/**
 * Records a single audit log entry within the provided transaction.
 */
export async function recordAuditEntry(params: RecordAuditEntryParams): Promise<void> {
  const { tx, actor, action, entityType, entityId, entityLabel, payloadBefore, payloadAfter } = params

  // Validate required params
  if (!tx) throw new Error('recordAuditEntry: missing required parameter "tx"')
  if (!actor) throw new Error('recordAuditEntry: missing required parameter "actor"')
  if (!action) throw new Error('recordAuditEntry: missing required parameter "action"')
  if (!entityType) throw new Error('recordAuditEntry: missing required parameter "entityType"')
  if (!entityId || !entityId.trim()) throw new Error('recordAuditEntry: "entityId" must be a non-empty string')
  if (!entityLabel || !entityLabel.trim()) throw new Error('recordAuditEntry: "entityLabel" must be a non-empty string')

  const truncatedLabel = truncateLabel(entityLabel)
  const serializedBefore = payloadBefore !== undefined ? serializePayload(payloadBefore) : null
  const serializedAfter = payloadAfter !== undefined ? serializePayload(payloadAfter) : null

  try {
    await (tx as any).auditLog.create({
      data: {
        action,
        entityType,
        entityId: entityId.trim(),
        entityLabel: truncatedLabel,
        actorId: actor.id,
        actorEmail: actor.email,
        actorName: actor.fullName || null,
        payloadBefore: serializedBefore as any,
        payloadAfter: serializedAfter as any,
      },
    })
  } catch (error: any) {
    const enrichedError = new Error(`recordAuditEntry failed: ${error.message}`)
    ;(enrichedError as any).action = action
    ;(enrichedError as any).entityType = entityType
    ;(enrichedError as any).entityId = entityId
    throw enrichedError
  }
}
