<template>
  <div v-if="images.length || spreadsheets.length" class="inline-attachments">
    <h4>Lampiran {{ detailName }}</h4>

    <div v-if="images.length" class="image-grid">
      <article v-for="image in images" :key="image.id" class="image-card">
        <img :src="image.url" :alt="image.title" />
        <div>
          <strong>{{ image.title }}</strong>
          <span>{{ image.source === 'file' ? 'Upload gambar' : 'Link gambar' }}</span>
        </div>
        <button type="button" class="delete-attachment" @click="$emit('remove-image', image.id)">
          Hapus
        </button>
      </article>
    </div>

    <ul v-if="spreadsheets.length" class="spreadsheet-list">
      <li v-for="sheet in spreadsheets" :key="sheet.id">
        <a :href="sheet.url" target="_blank" rel="noopener noreferrer">{{ sheet.title }}</a>
        <button type="button" class="delete-attachment" @click="$emit('remove-spreadsheet', sheet.id)">
          Hapus
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    detailName: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      default: () => [],
    },
    spreadsheets: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['remove-image', 'remove-spreadsheet'],
}
</script>
