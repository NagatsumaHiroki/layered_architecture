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

# テストコード厳守事項

## 絶対に守ってください

### テストコードの品質
- テストは必ず実際の機能を検証すること
- 'except(true).toB(true)'のような意味のないアサーションは絶対に書かない
- 各テストケースは具体的な入力と機体の出力を検証すること
- モックは最小限に留め、実際の動作に近い形でテストすること

### テスト実装の原則
- テストが失敗する状態から始めること
- 失敗系の検証: 正常系だけでなく、バリデーションエラー・例外・404 などの異常系を必ず含める
- 空文字、最小/最大長、存在しないIDなど境界条件を明示的にテストする
- 戻り値だけでなく、リポジトリ呼び出し回数・引数・更新有無を確認する
- 「何を」「どの条件で」「どうなるか」を日本語で明記する
- テスト間で状態を共有しない（beforeEach/afterEachで初期化）
- Date や UUID は固定化/注入して再現性を担保する

### 実装前の確認
- 機能の仕様や動作を正しく理解してテストを書くこと
- 不明な点があれば、仮実装ではなくユーザに問い合わせること
