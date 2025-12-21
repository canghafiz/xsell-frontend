![Next.js Project Setup](https://i.imgur.com/HIqpVmj.jpeg&w=1920&q=75)

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lingkungan lokal Anda.

---

### 1. Clone Repository

```bash
git clone https://github.com/canghafiz/xsell-frontend
cd your-project-folder
```

### 2. Install Dependencies

```bash
npm install
# atau
yarn install
# atau
pnpm install
# atau
bun install
```

### 3. Konfigurasi Environment Variables

```bash
Pastikan buat file .env dan lihat contoh lengkapnya di .env.example
```

### 4. Wajib migration backend (golang) agar data awal ada
```bash
migrate -database "postgres://username:pw@tcp(localhost:port)/db_name" -path db/migrations up
```

```bash
Pastikan buat file .env dan lihat contoh lengkapnya di .env.example
```

### 5. Jalankan Server

```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
# atau
bun dev
```