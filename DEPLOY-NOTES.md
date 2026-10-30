# Deploy notes — Phase 30 build on fyrus.io (30 Oct 2026)

- Source: local release candidate `rc-local-30.14` (+ client-IP fix for Docker proxies), project `Documents/Codex/fyrus-city-phase18-cinematic`.
- Not included on purpose: the P57 character avatars (`assets/characters/p57*`, licence review 30.7 still open), the DEV avatar demo panel and the bench harness (dev only), `*.blend` sources.
- Old live site (v52, commit 7095221) is backed up in `Documents/old-fyrus-backup-2026-10-30` and stays in git history (branch `main` before this merge).
- Data: same `/data/fyrus.json` volume. Rehearsed: the v52 server's data opened by this build keeps every user, phone number, balance, email login, studio, home, plot and the v52-only `brain` / `pay` records; a hash-chained `ledger.jsonl` starts with a genesis entry.
- Live-only features of v52 not in this build: Help & feedback desk, browser Brain answers, FYC payment shop (was switched off), growth analytics. Their stored data is kept untouched in the file.
- Rollback: Coolify -> app -> Rollback, or put commit 7095221 back on `main`.
