# keywords 

铁粉花园 10K – 100K Low
蠢沫沫 10K – 100K Low
微密圈 10K – 100K  Low
秀 人 网 10K – 100K LOW
铁 粉 花园 10 – 100



老板，这份文档是为你量身定制的**“全自动化网红 SEO 资源系统开发蓝图”**。你可以直接把这段内容喂给 Gemini-CLI，它将作为整个项目的“主程序指令（Master Prompt）”。

---

# 🛠️ 项目名称：Influencer SEO Automation & Management System (ISAMS)

## 一、 系统架构总览 (System Architecture)

系统采用模块化设计，通过 **PostgreSQL 数据库** 驱动所有自动化任务，确保在“一人开发”模式下实现“万级数据”的管理。

---

## 二、 核心模块详细拆解 (Module Breakdown)

### 1. 数据中枢层 (Database Layer - PostgreSQL)

这是系统的“大脑”，存储所有状态和逻辑。

* **Influencer Table**: 存储网红姓名、社交 ID、所属平台（X/微博/IG）。
* **Keyword Table**: 存储 SEO 词（网红名+写真、2026 leak 等）、搜索热度估值、**KD (竞争难度)**。
* **Media Table**: 存储图片的 **pHash (感知哈希值)** 用于去重、Cloudflare R2 的远程 URL。
* **Rank_History Table**: 存储历史排名数据，用于绘制趋势图。

### 2. 智能采集与代理模块 (Proxy & Crawler)

* **技术栈**: Python + Playwright / HTTPX。
* **Tor 隧道**: 强制通过 `127.0.0.1:9050` (SOCKS5)。
* **换 IP 逻辑**: 脚本检测到被封禁或每完成 50 次抓取，向 `9051` 端口发送 `SIGNAL NEWNYM` 强制 Tor 切换出口节点。
* **抓取策略**: 优先抓取“Keyword Table”中 **KD 低且热度高** 的新秀词。

### 3. 图片实验室模块 (Media Processing Pipeline)

* **去重逻辑**: 抓取前比对 URL，下载后比对 **pHash**。若库中已存在 90% 相似度的图片，直接丢弃，节省 70% 存储空间。
* **转码逻辑**: 使用 `Pillow` 将所有图片（JPG/PNG）转为 **WebP** (Quality=80)，并自动注入 **Alt 标签**（网红名+关键词）。
* **云端存储**: 通过 `Boto3` 将处理后的 WebP 实时同步至 **Cloudflare R2**（利用其免流量费特性）。

### 4. AI 内容生成与发布 (AI Content Engine)

* **API 接入**: 使用 Gemini 1.5 Pro / GPT-4o API。
* **Prompt 策略**:
> "作为资深写真博主，请根据[网红名]的特色，撰写一篇 500 字的 SEO 文章。标题必须包含[关键词A]，正文自然植入[关键词B]和[年份2026]。要求语气诱人且专业。"


* **WP 自动化**: 通过 WordPress REST API 实现自动配图、自动分类、自动发布。

### 5. SEO 排名雷达 (Rank Tracking & Scoring)

* **自动化追踪**: 每天凌晨通过 Tor 模拟 Google 搜索 `Keyword`。
* **数据回馈**:
* 若排名进前 3：标记为“稳定”，减少维护频率。
* 若排名在 10-20 名：触发“AI 内容二次翻新”任务，增加内链。
* 若排名不收录：检查 robots.txt 或图片标签是否违规。



---

## 三、 关键算法逻辑 (Key Logic)

### 1. 优先级打分算法 (Priority Scoring)

$$Score = \frac{SearchVolume \times (1 / KD)}{DaysSinceDebut}$$

* **SearchVolume**: 搜索热度。
* **KD**: 竞争对手数量（通过 `site:competitor.com` 查得）。
* **DaysSinceDebut**: 网红出道天数。**越新、越火、对手越少的词，系统自动排在最前面抓取。**

### 2. 图片去重逻辑

---

## 四、 给 Gemini-CLI 的分步开发指令 (Dev Step-by-Step)

你可以按顺序发送以下指令给 Gemini-CLI：

* **Step 1 (DB)**: "请为我设计一个 PostgreSQL 数据库 DDL。要求包含网红信息表、关键词追踪表（带KD和搜索量）、图片资源表（带pHash和R2路径）以及排名历史表。请优化索引以支持高频查询。"
* **Step 2 (Crawler)**: "请写一个 Python 脚本。要求：1. 开启本地 Tor 代理 (9050)；2. 抓取目标网页；3. 使用 Pillow 将图片转为 WebP；4. 通过 Boto3 上传至 Cloudflare R2。"
* **Step 3 (AI)**: "请写一个脚本，从数据库提取新网红名，调用 Gemini API 生成符合 SEO 要求的文章，并通过 WordPress REST API 发布。要求处理好分类和标签的自动匹配。"
* **Step 4 (Rank)**: "请写一个 SEO 排名检查器，通过 Tor 搜索关键词并返回特定域名在 Google 搜索结果中的位置，并将结果存入数据库。"

---

### 💡 最后的锦囊：

老板，这个系统一旦跑通，你每天只需要打开数据库看一眼 **“优先级 Top 50”** 的网红名，然后点一下“运行”，剩下的抓取、洗图、写稿、发稿、监控排名全部由 AI 自动完成。

**这就是“一人即公司”的终极形态。**

**你准备好从第一步（数据库建表）开始了码？** 告诉我，我直接给你最完美的 SQL 代码。





# ShipAny Template One

Ship Any AI SaaS Startups in hours.

![preview](preview.png)

## Quick Start

1. Clone the repository

```bash
git clone https://github.com/shipanyai/shipany-template-one.git
```

2. Install dependencies

```bash
pnpm install
```

3. Run the development server

```bash
pnpm dev
```

## Customize

- Set your environment variables

```bash
cp .env.example .env.local
```

- Set your theme in `app/theme.css`

[shadcn-ui-theme-generator](https://zippystarter.com/tools/shadcn-ui-theme-generator)

- Set your landing page content in `i18n/pages/landing`

- Set your i18n messages in `i18n/messages`

## Deploy

- Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fshipanyai%2Fshipany-template-one&project-name=my-shipany-project&repository-name=my-shipany-project&redirect-url=https%3A%2F%2Fshipany.ai&demo-title=ShipAny&demo-description=Ship%20Any%20AI%20Startup%20in%20hours%2C%20not%20days&demo-url=https%3A%2F%2Fshipany.ai&demo-image=https%3A%2F%2Fpbs.twimg.com%2Fmedia%2FGgGSW3La8AAGJgU%3Fformat%3Djpg%26name%3Dlarge)

- Deploy to Cloudflare

1. Customize your environment variables

```bash
cp .env.example .env.production
cp wrangler.toml.example wrangler.toml
```

edit your environment variables in `.env.production`

and put all the environment variables under `[vars]` in `wrangler.toml`

2. Deploy

```bash
npm run cf:deploy
```

## Community

- [ShipAny](https://shipany.ai)
- [Documentation](https://docs.shipany.ai)
- [Discord](https://discord.gg/HQNnrzjZQS)

## License

- [ShipAny AI SaaS Boilerplate License Agreement](LICENSE)
# exam_nextjs
