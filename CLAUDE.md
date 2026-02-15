# CLAUDE.md

このファイルは、このリポジトリでコード作業を行う際の Claude Code（claude.ai/code）向けガイドです。

## コマンド

```bash
npm run dev      # 開発サーバーを起動（Express: port 3000）
npm test         # Jest テストスイートを実行
npm run generate # 対話型 CLI で各レイヤーの新規ファイルをひな形生成
```

## アーキテクチャ

このプロジェクトは、4層構成の **Clean Architecture** に従った TypeScript + Express アプリケーションです。

```
Domain (innermost) → Application → Adapter → Infrastructure (outermost)
```

**依存ルール:** 依存は内側に向かってのみ持ちます。外側のレイヤーは内側に依存できますが、その逆は不可です。

### レイヤー構成

| レイヤー | パス | 役割 |
|-------|------|---------|
| Domain | `src/domain/entities/` | 中核となるビジネスエンティティとリポジトリインターフェース |
| Application | `src/application/usecases/` | リクエスト/レスポンス DTO を使うユースケース |
| Adapter | `src/adapter/` | コントローラ、リポジトリ実装（Prisma） |
| Infrastructure | `src/infrastructure/web/` | Express の設定、ルーティング、DI コンテナ |

### 主要ファイル

- **DI コンテナ**: `src/infrastructure/web/app.ts` - 依存関係を組み立てる
- **ドメインエンティティ**: `src/domain/entities/book.ts` - 貸出/返却の業務ロジックを持つ Book
- **リポジトリインターフェース**: `src/domain/entities/repositories/bookRepositoryInterface.ts`
- **リポジトリ実装**: `src/adapter/repositories/prismaBookRepository.ts`

### API エンドポイント

- `POST /books` - 書籍を追加
- `GET /books/:id` - ID で書籍を取得

## データベース

- **ORM**: Prisma + SQLite（`prisma/dev.db`）
- **生成クライアント**: `src/generated/prisma/`

## テスト

テストは Jest（ts-jest）を使用します。以下はモック済みリポジトリを使った実行例です。
```bash
npm test                           # すべてのテストを実行
npx jest path/to/test.test.ts     # 単一のテストファイルを実行
```
