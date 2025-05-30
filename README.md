# Client Chat Service

一個以 **Next.js 15 App Router** + **Firebase** + **OpenAI** 打造的輕量級多使用者即時對話服務，支援 WebSocket 雙向通訊與訊息上下文記憶，並整合關鍵字辨識與資料統計。

---

## 📦 技術架構

- **前端框架**：Next.js 15 + TypeScript
- **UI 組件**：MUI v7
- **狀態管理**：Zustand
- **時間格式化**：Day.js
- **即時通訊**：WebSocket (獨立 Node Server)
- **後端服務**：Firebase (Firestore)、OpenAI API
- **伺服器動作**：使用 Server Actions 撰寫安全邏輯

---

## ✨ 核心功能

- ✅ 支援 WebSocket 即時雙向對話
- ✅ 使用 OpenAI 回覆並保留上下文記憶
- ✅ 使用 Firebase 快照同步跨視窗、跨裝置對話
- ✅ 關鍵字自動比對與 mentions 寫入
- ✅ 分類統計每日訊息與提及關鍵字
- ✅ 模擬多使用者 UID 切換（無需登入）
- ✅ 使用 MUI 實作 RWD 視覺化設計
- ✅ 訊息串採用虛擬渲染，提升效能
- ✅ Firestore 結構標準化，適合後續擴充

---

## 🚀 快速啟動

```bash
git clone https://github.com/imrredrum/Client-Chat-Service.git
cd client-chat-service
npm install
```

### 本地開發模式

```bash
npm run dev
```

---

## ⚙️ 環境設定

請根據 `.example.env` 建立本機環境設定：

```bash
cp .example.env .env.local
```

---

## 📁 Firestore 結構一覽

```bash
/users
/messages
/mentions
/latestConversations
/keywordCategories
/dailyStats/{date}
/dailyUserStats/{date}/users/{uid}
```

---

## 📝 備註

- 本專案 **未使用 Docker**
- 所有故意操作（如關鍵字寫入、Firestore 統計）均透過 Server Actions 與 Firebase Admin SDK 處理
- `WebSocket` server 為獨立啟動（非內嵌於 Next.js Server 內）

---

## 📌 授權

MIT License
