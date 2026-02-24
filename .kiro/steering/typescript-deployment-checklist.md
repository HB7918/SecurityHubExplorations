---
inclusion: auto
---

# TypeScript Deployment Checklist

This document contains critical checks to prevent TypeScript build failures during AWS Amplify deployments.

## Common TypeScript Errors to Avoid

### 1. Unused Imports (TS6133)
**Error:** `'ComponentName' is declared but its value is never read`

**Prevention:**
- Always remove unused imports after refactoring
- Run `npm run build` locally before pushing
- Use IDE features to auto-remove unused imports

**Recent Examples:**
- `CurrentSecurityHub` imported but not used in App.tsx
- `KeyValuePairs`, `Icon`, `SeverityBadge`, `CommentsPanel` unused in FindingDetails.tsx
- `TextFilter` unused in FindingsList.tsx

### 2. Unused Variables (TS6133)
**Error:** `'variableName' is declared but its value is never read`

**Prevention:**
- Remove unused constants and variables
- Comment out code instead of leaving unused declarations

**Recent Examples:**
- `RES` constant declared but never used in Dashboard.tsx
- `ap10`, `ap11` attack path nodes unused in mockData.ts
- `filterText`, `setFilterText` state variables unused in FindingsList.tsx

### 3. Undefined Types (TS2304)
**Error:** `Cannot find name 'TypeName'`

**Prevention:**
- Import all required types from type files
- Use string types instead of undefined custom types when appropriate
- Check type definitions exist before using them

**Recent Examples:**
- `Status` and `Severity` types not imported in FindingsList.tsx (changed to string)

## Pre-Push Checklist

Before pushing code to any branch, always:

1. ✅ Run `npm run build` locally
2. ✅ Check for TypeScript errors in the output
3. ✅ Fix all TS6133 (unused) errors
4. ✅ Fix all TS2304 (undefined type) errors
5. ✅ Verify no new unused imports were added
6. ✅ Test the application locally with `npm run dev`

## Quick Fix Commands

```bash
# Build and check for errors
npm run build

# If build fails, check the error messages for:
# - TS6133: Remove unused imports/variables
# - TS2304: Add missing type imports or change to string types
```

## Deployment Process

1. Make changes locally
2. Run `npm run build` to verify no TypeScript errors
3. Commit changes: `git commit -m "Description"`
4. Push to branch: `git push origin <branch-name>`
5. Monitor AWS Amplify deployment logs
6. If deployment fails, check build logs for TypeScript errors

## AWS Amplify Build Command

The deployment runs: `tsc && vite build`

This means:
- TypeScript compiler (`tsc`) runs first and will fail on any TS errors
- Vite build only runs if TypeScript compilation succeeds
- All TypeScript errors must be fixed for successful deployment

## Best Practices

1. **Always test builds locally** before pushing
2. **Remove unused code immediately** after refactoring
3. **Use TypeScript strict mode** to catch errors early
4. **Enable IDE TypeScript checking** for real-time feedback
5. **Review git diff** before committing to spot unused imports
6. **Run diagnostics** using `getDiagnostics` tool when available

## Emergency Fix Process

If deployment fails:

1. Check the Amplify build logs for the specific error
2. Identify the file and line number
3. Fix the error locally
4. Run `npm run build` to verify
5. Commit and push the fix immediately
6. Monitor the new deployment

## Notes

- TypeScript errors block deployment completely
- Even one unused import will fail the entire build
- Local builds must pass before pushing to remote
- The exploration branch and main branch both require clean builds
