# LoL Info 🎮

Riot Games API kullanarak League of Legends ve TFT oyuncu profil bilgilerini görüntüleyen fullstack web uygulaması.

## Özellikler

- 🔍 Riot ID ile oyuncu arama (GameName#TagLine)
- 🏆 LoL Ranked bilgileri (Solo/Duo + Flex)
- ⚔️ Şampiyon Mastery (Top 7)
- 📜 Maç Geçmişi (Son 20 maç)
- 🎯 TFT Ranked + Maç Geçmişi
- 🌍 Tüm bölgeler desteklenir (TR, EUW, NA...)
- ⚡ 10 dakikalık DB cache ile hızlı yanıt
- 🎨 Dark theme, LoL temalı premium tasarım

## Tech Stack

| Katman | Teknoloji |
|--------|-----------|
| Frontend | React + Vite + TypeScript |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Deploy | Render |

## Kurulum

### Gereksinimler
- Node.js 18+
- PostgreSQL
- Riot API Key ([developer.riotgames.com](https://developer.riotgames.com/))

### 1. Repo'yu klonla
```bash
git clone https://github.com/USERNAME/lol-info.git
cd lol-info
```

### 2. Environment Variables
```bash
cp .env.example server/.env
```
`server/.env` dosyasını düzenle:
```
RIOT_API_KEY=your_api_key
DATABASE_URL=postgresql://user:pass@localhost:5432/lolinfo
PORT=3001
CLIENT_URL=http://localhost:5173
```

### 3. Backend
```bash
cd server
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### 4. Frontend
```bash
cd client
npm install
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışacaktır.

## Deploy (Render)

1. GitHub'a push'la
2. [Render Dashboard](https://dashboard.render.com/) → New → Blueprint
3. Repo'yu bağla
4. `RIOT_API_KEY` environment variable'ını ekle
5. Deploy!

## API Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/player/:region/:gameName/:tagLine` | Oyuncu profili (LoL) |
| GET | `/api/player/:region/:gameName/:tagLine/matches` | Maç geçmişi (LoL) |
| GET | `/api/player/:region/:gameName/:tagLine/tft` | TFT profili + maçlar |

## Lisans

MIT
