<template>
  <Tag :value="status" :severity="status === 'PUBLISHED' ? 'success' : 'warning'" />
</template>

<script setup lang="ts">
import type { PublishStatus } from '~/types/learning'

defineProps<{
  status: PublishStatus
}>()
</script>
