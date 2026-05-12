# Windows Development Notes

Use `npm.cmd` and `npx.cmd` in PowerShell. The plain `npm`/`npx` shims can hit execution policy or spawn permission issues on this machine.

## Common Commands

```powershell
npm.cmd run dev -- --host 127.0.0.1 --port 3000
npx.cmd nuxi typecheck
npm.cmd test
npx.cmd nuxi build
```

## Stale Nuxt Lock

If Nuxt reports that another build is already running, remove only the Nuxt lock after stopping the listed PID:

```powershell
Stop-Process -Id <PID> -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath .nuxt\nuxt.lock -ErrorAction SilentlyContinue
```

## `spawn EPERM` During Build

This is usually a Windows process/sandbox issue, not an app code issue. Stop stale Node processes, clear the Nuxt lock, then run the build again:

```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath .nuxt\nuxt.lock -ErrorAction SilentlyContinue
npx.cmd nuxi build
```
