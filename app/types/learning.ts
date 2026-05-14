export type UserRole = 'ADMIN' | 'VIEWER'

export type PublishStatus = 'DRAFT' | 'PUBLISHED'

export type AttachmentType = 'IMAGE' | 'SPREADSHEET' | 'FILE' | 'LINK'

export interface Profile {
  id: string
  email: string
  fullName?: string | null
  role: UserRole
  createdAt?: string
  updatedAt?: string
}

export interface ComponentItem {
  id?: string
  detailId?: string
  category?: string | null
  name: string
  quantity: string
  unit: string
  note?: string | null
  sortOrder: number
}

export interface Attachment {
  id?: string
  detailId?: string
  type: AttachmentType
  title: string
  url: string
  filePath?: string | null
  mimeType?: string | null
  sizeBytes?: number | null
  sortOrder: number
  createdAt?: string
}

export interface ModuleDetail {
  id?: string
  moduleId?: string
  slug: string
  title: string
  summary?: string | null
  keywords?: string | null
  sortOrder: number
  components: ComponentItem[]
  attachments: Attachment[]
  createdAt?: string
  updatedAt?: string
}

export interface LearningModule {
  id?: string
  slug: string
  title: string
  description?: string | null
  keywords?: string | null
  status: PublishStatus
  sortOrder: number
  details: ModuleDetail[]
  createdAt?: string
  updatedAt?: string
}

export interface ApiErrorShape {
  message: string
  fieldErrors?: Record<string, string>
}
