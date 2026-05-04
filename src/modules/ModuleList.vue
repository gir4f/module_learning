<template>
  <div class="app">
    <AppHeader />

    <main class="home-page">
      <section class="home-grid" aria-label="Safety device introduction">
        <div class="grid-cell truck-cell">
          <img src="@/assets/images/Fototruk.png" alt="Truk Gitronik" />
        </div>
        <div class="grid-cell message-cell">
          <h1>Safety device for your vehicle</h1>
        </div>
        <div class="grid-cell blue-cell"></div>
      </section>
    </main>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'

export default {
  components: {
    AppHeader,
  },
}
</script>

<style>
body { margin: 0; font-family: sans-serif; background: #f0f2f5; }
.home-page {
  min-height: calc(100vh - 96px);
  display: flex;
  align-items: flex-end;
  padding: 0;
  box-sizing: border-box;
}
.home-grid {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: minmax(180px, 28vh) minmax(110px, 18vh);
}
.grid-cell {
  min-width: 0;
  min-height: 0;
}
.truck-cell {
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  overflow: hidden;
}
.truck-cell img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: left center;
  display: block;
}
.message-cell {
  background: white;
}
.message-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
}
.message-cell h1 {
  margin: 0;
  color: #1d4f80;
  font-size: clamp(1.7rem, 4vw, 4rem);
  font-weight: 700;
  line-height: 1.15;
}
.blue-cell {
  grid-column: 1 / -1;
  background: #1d4f80;
}
@media (max-width: 760px) {
  .home-grid {
    grid-template-columns: 1fr;
    grid-template-rows: 220px auto 130px;
  }

  .blue-cell {
    grid-column: auto;
  }
}
</style>
