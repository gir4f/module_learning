<template>
  <div class="app">
    <AppHeader />

    <main>
      <!-- ALUR KERJA -->
      <section v-if="slug === 'alur-kerja'" class="group">
        <h2>Alur Kerja</h2>
        <img src="@/assets/images/Alurkerja.png" alt="Alur Kerja" />
      </section>

      <!-- DEVICE SPEED -->
      <section v-if="slug === 'device-speed'" class="group">
        <h2>Device Speed</h2>
        <!-- Speed Uni -->
        <div class="item">
          <h3>Speed Uni</h3>
          <img src="@/assets/images/Device Speed Uni.jpg" alt="Speed Uni" />
        </div>

        <!-- Speed Forklift -->
        <div class="item">
          <h3>Speed Forklift</h3>
          <!-- tambah gambar jika ada -->
        </div>
      </section>

      <!-- DEVICE FATIGUE -->
      <section v-if="slug === 'device-fatigue'" class="group">
        <h2>Device Fatigue</h2>
        <div class="item">
          <h3>Fatigue Merah Putih (FMP)</h3>
          <!-- tambah gambar jika ada -->
           <h4>Kelengkapan Part — FMP</h4>
          <table>
            <thead><tr><th>Komponen</th><th>Jumlah</th><th>Satuan</th><th>Subtitusi</th></tr></thead>
            <tbody>
              <tr><td colspan="4" class="group-pcb">PCB</td></tr>
              <tr><td colspan="4" class="group-label">PCB GT-FW11C</td></tr>
              <tr><td>GT-FW11C</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td colspan="4" class="group-top">Top</td></tr>
              <tr><td>IC Lgt 8f328p SMD</td><td>1</td><td>Pcs</td><td>Atmega, Attiny, Wch.</td></tr>
              <tr><td>IC Uln2003a-64 SMD</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>IC Ams1117 3v3</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>IC Lm 2596 5v Dip</td><td>1</td><td>Pcs</td><td>IC Lm 2596 5v SMD</td></tr>
              <tr><td>Resistor SMD 5%/10k Ω</td><td>3</td><td>Pcs</td><td>Bisa Pakai Yang 2k2 S/D 12k</td></tr>
              <tr><td>Kapasitor SMD 100nf/50v/10%</td><td>3</td><td>Pcs</td><td></td></tr>
              <tr><td>Dioda SS14</td><td>4</td><td>Pcs</td><td>RS1MF, SS34</td></tr>
              <tr><td>Induktor 100uh</td><td>1</td><td>Pcs</td><td>Cd74r, Cy75</td></tr>
              <tr><td>Kapasitor Elco 35v/100uF</td><td>1</td><td>Pcs</td><td>≥ 35v/100uF</td></tr>
              <tr><td>Kapasitor Elco 16v/470uF</td><td>1</td><td>Pcs</td><td>≥ 6.3v/100uF</td></tr>
              <tr><td>Relay Song Chuan 5v 5pdt</td><td>2</td><td>Pcs</td><td></td></tr>
              <tr><td colspan="4" class="group-bot">Bot</td></tr>
              <tr><td>Fuse 33v 1.1a 1812 Original</td><td>1</td><td>Pcs</td><td>Fuse 33v 1.85a 2920</td></tr>
              <tr><td>Dioda SS14</td><td>2</td><td>Pcs</td><td>RS1MF, SS34</td></tr>
              <tr><td>Led 5mm Bulat Merah</td><td>6</td><td>Pcs</td><td></td></tr>
              <tr><td>Dip Switch 4pin</td><td>1</td><td>Pcs</td><td></td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- AUTO FIRE SUPPRESSION -->
      <section v-if="slug === 'auto-fire'" class="group">
        <h2>Auto Fire Suppression</h2>
        <div class="item">
          <h3>Auto Fire Suppression PCB AFS & PCB Fatigue</h3>
          <!-- tambah gambar jika ada -->
        </div>
      </section>

      <!-- IDLETIMER -->
      <section v-if="slug === 'idletimer'" class="group">
        <h2>Idletimer / Turbotimer</h2>
        <div class="item">
          <h3>Idletimer / Turbotimer Heavy Equipment & Dozer</h3>
          <!-- tambah gambar jika ada -->
        </div>

        <!-- Idletimer Lite -->
        <div class="item">
          <h3>Idletimer Lite GT-ITH04A</h3>
          <!-- tambah gambar jika ada -->
        </div>
      </section>

       <!-- ISCS -->
      <section v-if="slug === 'iscs'" class="group">
        <h2>ISCS Incline Shutdown Control System</h2>
        <div class="item">
          <h3>ISCS GT-IID06A</h3>
          <h4>Kelengkapan Part</h4>
          <table>
            <thead><tr><th>Komponen</th><th>Jumlah</th><th>Satuan</th><th>Keterangan</th></tr></thead>
            <tbody>
              <tr><td colspan="4" class="group-pcb">PCB</td></tr>
              <tr><td colspan="4" class="group-label">PCB GT-IIS06A</td></tr>
              <tr><td>PCB GT-IIS06A</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td colspan="4" class="group-top">Top</td></tr>
              <tr><td>IC Atmega 328pb</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>IC Uln2003a-G4 SMD</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>IC Sp232</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>Resistor SMD 5%/1k Ω 1206</td><td>3</td><td>Pcs</td><td>Bisa Pakai Yang 2k2 S/D 12k</td></tr>
              <tr><td>Resistor SMD 5%/10k Ω 1206</td><td>3</td><td>Pcs</td><td></td></tr>
              <tr><td>Kapasitor SMD 100n 1206 SMD</td><td>6</td><td>Pcs</td><td></td></tr>
              <tr><td>Induktor Xmr8040 100uh/1a SMD</td><td>1</td><td>Pcs</td><td>Induktor 220uh Cdrh104</td></tr>
              <tr><td>Dioda RS1MF</td><td>14</td><td>Pcs</td><td>SS14, SS34</td></tr>
              <tr><td>Dioda Bat54s</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>Dioda Bat54c</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>Transistor 9013</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>Buzzer 5v</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>Trimpot 103</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>IC Lm2596 5v SMD</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>Kapasitor Elco 35v/100uF</td><td>1</td><td>Pcs</td><td>≥ 35v/100uF</td></tr>
              <tr><td>Kapasitor Elco 6v3/470uF</td><td>1</td><td>Pcs</td><td>≥ 6.3v/100uF</td></tr>
              <tr><td colspan="4" class="group-bot">Bot</td></tr>
              <tr><td>Dioda SS14</td><td>6</td><td>Pcs</td><td>RS1MF</td></tr>
              <tr><td>Fuse 33v 1.1a 1812 Original</td><td>1</td><td>Pcs</td><td>Fuse 33v 1.85a 2920 Original</td></tr>
              <tr><td>Header Male 1x40p 19mm Hijau</td><td>16</td><td>Pcs</td><td>Warna Bebas</td></tr>
              <tr><td>Lcd 16x2</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>Spacer Tabung M3x6mm</td><td>4</td><td>Pcs</td><td></td></tr>
              <tr><td>Baut M3x12mm</td><td>4</td><td>Pcs</td><td>M3x10</td></tr>
              <tr><td>Mur M3</td><td>4</td><td>Pcs</td><td></td></tr>
              <tr><td>Relay Rectangular 5 vdc</td><td>2</td><td>Pcs</td><td>Relay Start-like 5 vdc</td></tr>
              <tr><td>Relay Start-like 5 vdc</td><td>2</td><td>Pcs</td><td></td></tr>
              <tr><td>Relay Rectangular 12 vdc</td><td>2</td><td>Pcs</td><td>Relay Start-like 12 vdc</td></tr>
              <tr><td>Relay Start-like 12 vdc</td><td>2</td><td>Pcs</td><td></td></tr>
              <tr><td>Resistor 5%/2w/39 Ω SMD</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>IC L7812cv</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>Kapasitor Elco 35v/22uF</td><td>1</td><td>Pcs</td><td></td></tr>
            </tbody>
          </table>
        </div>
        <div class="item">
          <h3>Kabel Body</h3>
          <table>
            <thead>
              <tr><th>Komponen</th><th>Jumlah</th><th>Satuan</th><th>Keterangan</th></tr>
            </thead>
            <tbody>
              <tr><td>Kabel Bintik AV 0.85mm Merah</td><td>1</td><td>Pcs</td><td>1x44 Cm</td></tr>
              <tr><td>Kabel Bintik AV 0.85mm Hitam</td><td>1</td><td>Pcs</td><td>1x44 Cm</td></tr>
              <tr><td>Kabel Bintik AV 0.85mm Putih</td><td>1</td><td>Pcs</td><td>1x40 Cm</td></tr>
              <tr><td>Kabel Bintik AV 0.85mm Hijau</td><td>1</td><td>Pcs</td><td>1x40 Cm</td></tr>
              <tr><td>Kabel Bintik AV 0.85mm Kuning</td><td>1</td><td>Pcs</td><td>1x40 Cm</td></tr>
              <tr><td>Kabel Bintik AV 0.85mm Orange</td><td>1</td><td>Pcs</td><td>1x40 Cm</td></tr>
              <tr><td>Kabel Bintik AV 0.85mm Coklat</td><td>1</td><td>Pcs</td><td>1x40 Cm</td></tr>
              <tr><td>Kabel Bintik AV 0.85mm Biru</td><td>1</td><td>Pcs</td><td>1x40 Cm</td></tr>
              <tr><td>Selongsong 8x9</td><td>1</td><td>Pcs</td><td>1x28 Cm</td></tr>
              <tr><td>Kabel Bakar 14mm</td><td>1</td><td>Pcs</td><td>1x5 Cm</td></tr>
              <tr><td>Socket Deutsch Dt04-12p Male</td><td>1</td><td>Pcs</td><td>Tidak ada keterangan</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- PIDS -->
      <section v-if="slug === 'pids'" class="group">
        <h2>PIDS</h2>
        <div class="item">
          <h3>PIDS No. KA (GT-NT03PAP)</h3>
          <h4>Kelengkapan Part — PIDS Indoor No. Ka</h4>
          <table>
            <thead><tr><th>Komponen</th><th>Jumlah</th><th>Satuan</th><th>Keterangan</th></tr></thead>
            <tbody>
              <tr><td colspan="4" class="group-pcb">PCB</td></tr>
              <tr><td colspan="4" class="group-label">PCB Gt-NT03PAP1</td></tr>
              <tr><td>PCB Gt-NT03PAP1</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td colspan="4" class="group-top">Top</td></tr>
              <tr><td>IC Lgt 8f328p SMD</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>IC Max485 Dip</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>IC Ams1117 5v</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>Dioda In4007</td><td>2</td><td>Pcs</td><td></td></tr>
              <tr><td>Resistor 5%/0.25w/1k Ω</td><td>4</td><td>Pcs</td><td></td></tr>
              <tr><td>Resistor 5%/0.25w/120 Ω</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>Resistor 1%/0.25w/10k Ω</td><td>4</td><td>Pcs</td><td></td></tr>
              <tr><td>Resistor 5%/0.25w/4k7 Ω</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>Kapasitor SMD 100nf/50v/10%</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>Kapasitor Elco 50v/10uF</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td colspan="4" class="group-bot">Bot</td></tr>
              <tr><td>Transistor 9013</td><td>2</td><td>Pcs</td><td></td></tr>
              <tr><td>Conscrew Mf301 2 Pin Hitam</td><td>1</td><td>Pcs</td><td>Gunakan Rel Untuk Hubungkan Terminal</td></tr>
              <tr><td>Conscrew Mf301 3 Pin Hitam</td><td>1</td><td>Pcs</td><td>Gunakan Rel Untuk Hubungkan Terminal</td></tr>
              <tr><td>7-Segment 1 Digit 1.5" Ca</td><td>2</td><td>Pcs</td><td></td></tr>
            </tbody>
          </table>
        </div>

        <!-- PIDS Display Temperatur -->
        <div class="item">
          <h3>PIDS Display Temperatur</h3>
          <h4>Kelengkapan Part — PIDS Indoor Temperatur</h4>
          <table>
            <thead><tr><th>Komponen</th><th>Jumlah</th><th>Satuan</th><th>Keterangan</th></tr></thead>
            <tbody>
              <tr><td colspan="4" class="group-pcb">PCB</td></tr>
              <tr><td colspan="4" class="group-label">PCB Gt-NT03PAP1</td></tr>
              <tr><td>PCB Gt-NT03PAP1</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td colspan="4" class="group-top">Top</td></tr>
              <tr><td>IC Lgt 8f328p SMD</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>IC Max485 Dip</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>IC Ams1117 5v</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>Dioda In4007</td><td>2</td><td>Pcs</td><td></td></tr>
              <tr><td>Resistor 5%/0.25w/1k Ω</td><td>5</td><td>Pcs</td><td></td></tr>
              <tr><td>Resistor 5%/0.25w/120 Ω</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>Resistor 1%/0.25w/10k Ω</td><td>4</td><td>Pcs</td><td></td></tr>
              <tr><td>Resistor 5%/0.25w/4k7 Ω</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>Kapasitor SMD 100nf/50v/10%</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>Kapasitor Elco 50v/10uF</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td colspan="4" class="group-bot">Bot</td></tr>
              <tr><td>Transistor 9013</td><td>3</td><td>Pcs</td><td></td></tr>
              <tr><td>Conscrew Mf301 2 Pin Hitam</td><td>1</td><td>Pcs</td><td>Gunakan Rel Untuk Hubungkan Terminal</td></tr>
              <tr><td>Conscrew Mf301 3 Pin Hitam</td><td>2</td><td>Pcs</td><td>Gunakan Rel Untuk Hubungkan Terminal</td></tr>
              <tr><td>7-Segment 1 Digit 1.5" Ca</td><td>3</td><td>Pcs</td><td></td></tr>
            </tbody>
          </table>
        </div>

        <!-- PIDS Controller Outdoor -->
        <div class="item">
          <h3>PIDS Controller Outdoor (GT-PAP02P2)</h3>
          <h4>Kelengkapan Part — PIDS Outdoor P10</h4>
          <table>
            <thead><tr><th>Komponen</th><th>Jumlah</th><th>Satuan</th><th>Keterangan</th></tr></thead>
            <tbody>
              <tr><td colspan="4" class="group-pcb">PCB</td></tr>
              <tr><td colspan="4" class="group-label">PCB GT-PAP02P2</td></tr>
              <tr><td>PCB GT-PAP02P2</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td colspan="4" class="group-top">Top</td></tr>
              <tr><td>IC Lgt 8f328p SMD</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>IC Max485 Dip</td><td>1</td><td>Pcs</td><td>SMD Juga Bisa</td></tr>
              <tr><td>R 1206 10k</td><td>4</td><td>Pcs</td><td></td></tr>
              <tr><td>Resistor 5%/0.25w/120 Ω</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>Kapasitor SMD 100nf/50v/10%</td><td>2</td><td>Pcs</td><td></td></tr>
              <tr><td>Socket Idc Ampenol 2x8 PCB Lurus</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>Conscrew Mf301 2 Pin Hitam</td><td>2</td><td>Pcs</td><td>Warna Bebas</td></tr>
              <tr><td>Kapasitor Elco 16v/470uF</td><td>1</td><td>Pcs</td><td>≥ 6.3v/100uF</td></tr>
              <tr><td colspan="4" class="group-bot">Bot</td></tr>
              <tr><td>Resistor 5%/0.25w/4k~12k Ω</td><td>1</td><td>Pcs</td><td>Pull Down Custom — 2k2 + 2k2, 3k3+3k3</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- LIMITER -->
      <section v-if="slug === 'limiter'" class="group">
        <h2>Limiter Cut Controller</h2>
        <div class="item">
          <h3>Limiter Cut Controller</h3>
          <!-- tambah gambar jika ada -->
        </div>
      </section>

      <!-- GYROSCOPE -->
      <section v-if="slug === 'gyroscope'" class="group">
        <h2>Gyroscope</h2>
        <div class="item">
          <h3>Gyroscope Tanpa Line Driver</h3>
          <img src="@/assets/images/GT-GY2 & GT-GY03A.jpg" alt="Gyroscope" />
          <h3>Gyroscope Ada Line Driver</h3>
          <!-- tambah gambar jika ada -->
        </div>
      </section>

      <!-- IMU -->
      <section v-if="slug === 'imu'" class="group">
        <h2>IMU</h2>
        <div class="item">
          <h3>IMU GT-IMU01A</h3>
          <!-- tambah gambar jika ada -->
        </div>
      </section>

      <!-- LINE DRIVER -->
      <section v-if="slug === 'line-driver'" class="group">
        <h2>Line Driver RS232</h2>
        <div class="item">
          <!-- tambah gambar jika ada -->
        </div>
      </section>

      <!-- ALARM -->
      <section v-if="slug === 'alarm'" class="group">
        <h2>Alarm</h2>
        <div class="item">
          <h3>Alarm Bulat Kecil & Besar</h3>
          <!-- tambah gambar jika ada -->
        </div>
      </section>

      <!-- KABEL BODY -->
      <section v-if="slug === 'kabel-body'" class="group">
        <h2>Kabel Body</h2>

        <!-- Kabel Body Speed -->
        <div class="item">
          <h3>Kabel Body Speed</h3>
          <!-- tambah gambar jika ada -->
        </div>

        <!-- Kabel Body Safety Module -->
        <div class="item">
          <h3>Kabel Body Safety Module</h3>
          <h4>Kelengkapan Part — Kabel Body Safety Module</h4>
          <table>
            <thead><tr><th>Komponen</th><th>Jumlah</th><th>Satuan</th><th>Keterangan</th></tr></thead>
            <tbody>
              <tr><td colspan="4" class="group-top">Kabel</td></tr>
              <tr><td>Kabel Bintik 0.85mm Merah</td><td>3</td><td>Pcs</td><td>2x40 & 1x80 cm</td></tr>
              <tr><td>Kabel Bintik 0.85mm Kuning</td><td>1</td><td>Pcs</td><td>1x80 cm</td></tr>
              <tr><td>Kabel Bintik 0.85mm Hijau</td><td>1</td><td>Pcs</td><td>1x40 cm</td></tr>
              <tr><td>Kabel Bintik 0.85mm Biru</td><td>1</td><td>Pcs</td><td>1x40 cm</td></tr>
              <tr><td>Kabel Bintik 0.85mm Putih</td><td>1</td><td>Pcs</td><td>1x40 cm</td></tr>
              <tr><td>Kabel Bintik 0.85mm Orange</td><td>1</td><td>Pcs</td><td>1x40 cm</td></tr>
              <tr><td>Kabel Bintik 0.85mm Hitam</td><td>3</td><td>Pcs</td><td>2x40 & 1x80 cm</td></tr>
              <tr><td>Selongsong 10x11</td><td>1</td><td>Pcs</td><td>1x15 cm</td></tr>
              <tr><td>Selongsong 6x7</td><td>3</td><td>Pcs</td><td>1x10 & 2x20 cm</td></tr>
              <tr><td>Selongsong 5x6</td><td>2</td><td>Pcs</td><td>2x20 cm</td></tr>
              <tr><td>Kabel Bakar D14mm</td><td>2</td><td>Pcs</td><td>1x5 & 1x3 cm</td></tr>
              <tr><td>Kabel Bakar D8mm</td><td>1</td><td>Pcs</td><td>1x5 cm</td></tr>
              <tr><td>Ties 3.6x100</td><td>5</td><td>Pcs</td><td></td></tr>
              <tr><td>Skun Female mini</td><td>5</td><td>Pcs</td><td></td></tr>
              <tr><td>Socket 2 Pin Male</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>Socket 3 Pin Male</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>Skun Female Besar</td><td>2</td><td>Pcs</td><td></td></tr>
              <tr><td>Socket 2 Pin T Male</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>SOCKET DEUTSCH DT06-12S Female</td><td>1</td><td>Pcs</td><td></td></tr>
            </tbody>
          </table>
        </div>

        <!-- Kabel Body Speed Tracker Logger -->
        <div class="item">
          <h3>Kabel Speed Tracker Logger</h3>
          <!-- tambah gambar jika ada -->
        </div>

        <!-- Kabel Body Speed Limiter Fuso -->
        <div class="item">
          <h3>Kabel Body Speed Limiter Fuso</h3>
          <!-- tambah gambar jika ada -->
        </div>

        <!-- Kabel Body Speed Display Eksternal -->
        <div class="item">
          <h3>Kabel Body Speed Display Eksternal</h3>
          <!-- tambah gambar jika ada -->
        </div>

        <!-- Kabel Body Speed Voice -->
        <div class="item">
          <h3>Kabel Body Speed Voice</h3>
          <h4>Kelengkapan Part — Kabel Body Speed Voice</h4>
          <table>
            <thead><tr><th>Komponen</th><th>Jumlah</th><th>Satuan</th><th>Keterangan</th></tr></thead>
            <tbody>
              <tr><td colspan="4" class="group-top">Kabel</td></tr>
              <tr><td>Kabel AWG 22 Merah</td><td>1</td><td>Pcs</td><td>1x60 cm</td></tr>
              <tr><td>Kabel Bintik AV 0.85mm Hitam</td><td>2</td><td>Pcs</td><td>1x60 & 1x10 cm</td></tr>
              <tr><td>Kabel AWG 22 Putih</td><td>1</td><td>Pcs</td><td>1x60 cm</td></tr>
              <tr><td>Kabel AWG 22 Hijau</td><td>1</td><td>Pcs</td><td>1x60 cm</td></tr>
              <tr><td>Kabel AWG 22 Biru</td><td>1</td><td>Pcs</td><td>1x60 cm</td></tr>
              <tr><td>Kabel AWG 22 Orange</td><td>1</td><td>Pcs</td><td>1x60 cm</td></tr>
              <tr><td>Kabel AWG 22 Kuning</td><td>1</td><td>Pcs</td><td>1x60 cm</td></tr>
              <tr><td>Kabel AWG 22 Pink</td><td>1</td><td>Pcs</td><td>1x60 cm</td></tr>
              <tr><td>Selongsong 6x7</td><td>1</td><td>Pcs</td><td>1x48 cm</td></tr>
              <tr><td>Socket Deutsch DT 12pin Male</td><td>1</td><td>Pcs</td><td></td></tr>
              <tr><td>Heat Shrinkable 14mm Hitam</td><td>1</td><td>Pcs</td><td>1x5cm</td></tr>
              <tr><td>Kabel Ties</td><td>1</td><td>Pcs</td><td></td></tr>
            </tbody>
          </table>
        </div>

        <!-- Kabel Body Fatigue Alarm Gitronik -->
        <div class="item">
          <h3>Kabel Body Fatigue Alarm Gitronik</h3>
          <!-- tambah gambar jika ada -->
        </div>

        <!-- Kabel Body Fatigue Alarm Merah Putih -->
        <div class="item">
          <h3>Kabel Body Fatigue Alarm Merah Putih</h3>
          <!-- tambah gambar jika ada -->
        </div>

        <!-- Kabel Body Idletimer HE & Dozer -->
        <div class="item">
          <h3>Kabel Body Idletimer HE & Dozer</h3>
          <!-- tambah gambar jika ada -->
        </div>

        <!-- Kabel Body ISCS -->
        <div class="item">
          <h3>Kabel Body ISCS</h3>
          <!-- tambah gambar jika ada -->
          
          <!-- Tabel Kabel ISCS -->
          <table>
            <thead>
              <tr>
                <th>Komponen</th>
                <th>Jumlah</th>
                <th>Satuan</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Kabel Bintik AV 0.85mm Merah</td><td>1</td><td>Pcs</td><td>1x44 Cm</td></tr>
              <tr><td>Kabel Bintik AV 0.85mm Hitam</td><td>1</td><td>Pcs</td><td>1x44 Cm</td></tr>
              <tr><td>Kabel Bintik AV 0.85mm Putih</td><td>1</td><td>Pcs</td><td>1x40 Cm</td></tr>
              <tr><td>Kabel Bintik AV 0.85mm Hijau</td><td>1</td><td>Pcs</td><td>1x40 Cm</td></tr>
              <tr><td>Kabel Bintik AV 0.85mm Kuning</td><td>1</td><td>Pcs</td><td>1x40 Cm</td></tr>
              <tr><td>Kabel Bintik AV 0.85mm Orange</td><td>1</td><td>Pcs</td><td>1x40 Cm</td></tr>
              <tr><td>Kabel Bintik AV 0.85mm Coklat</td><td>1</td><td>Pcs</td><td>1x40 Cm</td></tr>
              <tr><td>Kabel Bintik AV 0.85mm Biru</td><td>1</td><td>Pcs</td><td>1x40 Cm</td></tr>
              <tr><td>Selongsong 8x9</td><td>1</td><td>Pcs</td><td>1x28 Cm</td></tr>
              <tr><td>Kabel Bakar 14mm</td><td>1</td><td>Pcs</td><td>1x5 Cm</td></tr>
              <tr><td>Socket Deutsch Dt04-12p Male</td><td>1</td><td>Pcs</td><td>Tidak ada keterangan</td></tr>
            </tbody>
          </table>
        </div>

      </section>

    </main>
    <div class="back-actions">
      <button type="button" @click="$router.push('/')">← Kembali</button>
    </div>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import { getModuleTitle } from '@/data/modules'

export default {
  components: {
    AppHeader,
  },
  computed: {
    slug() {
      return this.$route.params.slug
    },
    title() {
      return getModuleTitle(this.slug)
    }
  }
}
</script>

<style>
body { margin: 0; font-family: sans-serif; background: #f0f2f5; }
main { padding: 24px; display: flex; flex-direction: column; gap: 24px; }
.group { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.group > h2 { margin: 0 0 20px; font-size: 1rem; color: #1565c0; border-bottom: 2px solid #1565c0; padding-bottom: 8px; }
.item { margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #eee; }
.item:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
.item h3 { margin: 0 0 12px; font-size: 0.95rem; color: #333; }
.item img { max-width: 100%; border-radius: 6px; display: block; margin-bottom: 8px; }
table { width: 100%; border-collapse: collapse; font-size: 0.85rem; margin-top: 12px; }
th { background: #e3f2fd; text-align: left; padding: 8px 12px; }
td { padding: 8px 12px; border-bottom: 1px solid #eee; }
.back-actions {
  display: flex;
  justify-content: flex-end;
  padding: 0 24px 28px;
}
.back-actions button {
  border: none;
  border-radius: 8px;
  background: #10b7c5;
  color: white;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 12px 18px;
  box-shadow: 0 6px 16px rgba(16, 183, 197, 0.28);
}
</style>
