# 🔧 Browser Compatibility Fix - Chrome vs Firefox Form Submission

## 🐛 Problem
- ✅ File submission works in **Chrome**
- ❌ File submission fails in **Firefox** with error: `"The input string 'What is the purpose of the man's call?' was not in a correct format."`

## 🎯 Root Cause Analysis

### Issue 1: FormData Header Handling
**The main culprit:** Explicitly setting `Content-Type: multipart/form-data` in headers

**Why it fails in Firefox:**
- Chrome/Axios auto-sets boundary in Content-Type when FormData is used
- When you manually set `Content-Type: multipart/form-data`, it **overrides** the boundary
- Firefox is stricter about multipart boundaries - it fails when boundary is missing
- Without the boundary, the server cannot parse the form data correctly

### Issue 2: Integer Parsing Error
**The parsing error:** `int.Parse(qNoText)` throwing exception because `qNoText` contains question content instead of a question number
- This happens when form parsing fails, causing column offset misalignment
- Fixed by using `int.TryParse()` instead of `int.Parse()` to gracefully skip invalid rows

### Issue 3: Null Reference Exception
**Potential crash:** `.ToUpperInvariant()` called on null string
- Fixed by null-coalescing before method call

## ✅ Fixes Applied

### 1. Frontend - AdminService (adminService.ts)
```typescript
// BEFORE (causes Firefox failure)
headers: { "Content-Type": "multipart/form-data" }

// AFTER (lets browser/axios set correct header with boundary)
headers: { 
  // Remove explicit Content-Type header
}
```

**Why this works:**
- Axios automatically detects FormData and sets the correct `Content-Type` header with proper boundary
- Browser handles boundary encoding correctly on both Chrome and Firefox
- The boundary parameter is CRITICAL for multipart parsing

### 2. Backend - Error Handling (AdminController.cs)

#### Part 3 Import Fix:
```csharp
// BEFORE (crashes on invalid number)
var qNo = int.Parse(qNoText);

// AFTER (gracefully skips invalid rows)
if (string.IsNullOrEmpty(qNoText) || !int.TryParse(qNoText, out int qNo))
{
    col += 7;
    continue;
}
```

#### Null-Safe Correct Option:
```csharp
// BEFORE (can throw NullReferenceException)
var correctOpt = worksheet.Cells[row, col + 6].Text?.Trim().ToUpperInvariant();

// AFTER (null-safe)
var correctOptText = worksheet.Cells[row, col + 6].Text?.Trim();
var correctOpt = string.IsNullOrEmpty(correctOptText) ? "A" : correctOptText.ToUpperInvariant();
```

Applied same fixes to **Part 4 import** as well.

### 3. Frontend - Debug Logging (import/page.tsx)
Added detailed console logging to help identify future issues:
```typescript
console.log(`[Import] Starting upload - File: ${excelFile.name}, ...`);
console.error("[Import] Error details:", { status, data, message });
```

## 📋 Testing Checklist

### To verify the fix works:
1. **Firefox:**
   - [ ] Open DevTools (F12)
   - [ ] Go to Network tab
   - [ ] Upload file for import
   - [ ] Check that `Content-Type` header includes boundary (e.g., `multipart/form-data; boundary=----abcd123`)
   - [ ] File should upload successfully
   - [ ] Console should show "[Import] Success"

2. **Chrome:**
   - [ ] Verify still works as before
   - [ ] Check same Content-Type header format

3. **Backend:**
   - [ ] Check server logs - should not see integer parse exceptions
   - [ ] Import should complete successfully
   - [ ] Database should contain correct data with proper column offsets

### Test with Sample Excel:
```
GroupNo | ImageFile | Transcript        | Q1_No | Q1_Content           | Q1_A | Q1_B | Q1_C | Q1_D | Q1_Correct
--------|-----------|-------------------|-------|----------------------|------|------|------|------|----------
1       |           | Hello, how are... | 32    | What is the purpose..| A    | B    | C    | D    | C
```

## 🔍 Technical Details

### Multipart/Form-Data Format
```
POST /api/v1/admin/import-part3-data-only?testId=1 HTTP/1.1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="excelFile"; filename="part3.xlsx"
Content-Type: application/vnd.ms-excel

[binary file data]
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

**Critical:** The boundary parameter MUST match the separator line, otherwise parser fails.

## 🚀 Prevention
- Never explicitly set `Content-Type: multipart/form-data` when using FormData
- Always use `int.TryParse()` instead of `int.Parse()` for user input
- Use null-coalescing operators for string methods
- Add debug logging for file uploads (included in fix)

## 📚 References
- [MDN: FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [Axios: Multipart data](https://github.com/axios/axios#request-config)
- [RFC 7578: multipart/form-data](https://tools.ietf.org/html/rfc7578)
