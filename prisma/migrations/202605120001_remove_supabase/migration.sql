-- AlterTable
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "passwordHash" TEXT;

-- AlterTable
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'Attachment'
      AND column_name = 'storagePath'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'Attachment'
      AND column_name = 'filePath'
  ) THEN
    ALTER TABLE "Attachment" RENAME COLUMN "storagePath" TO "filePath";
  END IF;
END $$;
