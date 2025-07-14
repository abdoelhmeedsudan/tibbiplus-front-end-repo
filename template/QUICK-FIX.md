# حل سريع لمشكلة "unauthorized_client"

## المشكلة
```
unauthorized_client
Unknown client or client not enabled
```

## الحل السريع

### الطريقة 1: استخدام PowerShell Script (الأسرع)
```powershell
# في مجلد TibbiplusI.dentityServerService
.\reset-identityserver.ps1
```

### الطريقة 2: تشغيل Seeding يدوياً
```bash
# في مجلد TibbiplusI.dentityServerService
dotnet run -- /seed
```

### الطريقة 3: تشغيل SQL Script
```sql
-- في SQL Server Management Studio
-- تشغيل ملف: add-angular-client.sql
```

## خطوات التشغيل الكاملة

1. **إيقاف IdentityServer** (إذا كان يعمل)
2. **تشغيل PowerShell script** أو **dotnet run -- /seed**
3. **انتظار اكتمال الـ seeding**
4. **تشغيل IdentityServer** مرة أخرى: `dotnet run`
5. **اختبار تسجيل الدخول** من Angular

## التحقق من الحل

1. افتح: `https://localhost:5001/.well-known/openid_configuration`
2. يجب أن ترى قائمة بالـ clients
3. تأكد من وجود `tibbiplus.cv.angular` في القائمة

## إذا لم يعمل الحل

1. **تحقق من قاعدة البيانات**:
   ```sql
   SELECT * FROM Clients WHERE ClientId = 'tibbiplus.cv.angular'
   ```

2. **تحقق من الـ logs** في console

3. **أعد تشغيل SQL Server** إذا لزم الأمر

4. **تحقق من connection string** في `appsettings.json` 