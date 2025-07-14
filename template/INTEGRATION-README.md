# دليل التكامل مع IdentityServer

## نظرة عامة

تم تكامل نظام تسجيل الدخول مع Duende IdentityServer باستخدام Authorization Code Flow مع PKCE للحماية الأمنية.

## المتطلبات

### 1. تشغيل الخوادم

```bash
# 1. تشغيل IdentityServer (Port: 5001)
cd tibbiplus-backend-repo/Tibbiplus-Backend/TibbiplusI.dentityServerService
dotnet run

# 2. تشغيل CV Internal API (Port: 7002)
cd tibbiplus-backend-repo/Tibbiplus-Backend/Tibbiplus.CV.InternalAPI
dotnet run

# 3. تشغيل Angular (Port: 4200)
cd tibbiplus-front-end-repo/template
npm install
ng serve
```

### 2. بيانات تسجيل الدخول الافتراضية

```
اسم المستخدم: admin
كلمة المرور: Admin@0489
```

## تدفق العمل

### 1. تسجيل الدخول
1. المستخدم يفتح `http://localhost:4200`
2. يضغط على "تسجيل الدخول"
3. يتم توجيهه إلى `https://localhost:5001/connect/authorize`
4. يدخل بياناته في صفحة IdentityServer
5. يتم إرجاعه إلى `http://localhost:4200/signin-callback`
6. يتم استبدال authorization code بـ access token
7. يتم حفظ الـ token وتوجيه المستخدم إلى لوحة التحكم

### 2. استخدام الـ Token
- جميع الطلبات للـ APIs تُرسل مع Bearer token تلقائياً
- يتم تجديد الـ token تلقائياً عند انتهاء صلاحيته
- عند فشل تجديد الـ token، يتم تسجيل الخروج تلقائياً

### 3. تسجيل الخروج
1. المستخدم يضغط على "تسجيل الخروج"
2. يتم إرساله إلى `https://localhost:5001/connect/endsession`
3. يتم إرجاعه إلى `http://localhost:4200/signout-callback`
4. يتم مسح جميع البيانات المحلية

## الملفات المهمة

### AuthService
- `src/app/shared/services/auth.service.ts` - خدمة المصادقة الرئيسية

### Components
- `src/app/auth/login/login.component.ts` - صفحة تسجيل الدخول
- `src/app/auth/signin-callback/signin-callback.component.ts` - معالجة callback تسجيل الدخول
- `src/app/auth/signout-callback/signout-callback.component.ts` - معالجة callback تسجيل الخروج

### Interceptor
- `src/app/shared/interceptors/auth.interceptor.ts` - إضافة الـ token للطلبات

### Guard
- `src/app/shared/guard/admin.guard.ts` - حماية الصفحات

## إعدادات IdentityServer

تم إضافة client جديد في `Config.cs`:

```csharp
new Client
{
    ClientId = "tibbiplus.cv.angular",
    ClientName = "Tibbiplus CV Angular SPA",
    
    AllowedGrantTypes = GrantTypes.Code,
    RequireClientSecret = false,
    
    RedirectUris = { "http://localhost:4200/signin-callback" },
    PostLogoutRedirectUris = { "http://localhost:4200/signout-callback" },
    AllowedCorsOrigins = { "http://localhost:4200" },
    
    AllowOfflineAccess = true,
    AllowedScopes = { "openid", "profile", "id", "role", "fullName", "userType", "tibbiplus.cv.external", "tibbiplus.cv.internal" },
    
    RequirePkce = true,
    RequireConsent = false
}
```

## الميزات الأمنية

### 1. PKCE (Proof Key for Code Exchange)
- حماية من هجمات CSRF
- استخدام code_verifier و code_challenge

### 2. State Parameter
- التحقق من صحة الطلب
- منع هجمات CSRF

### 3. Secure Token Storage
- حفظ الـ tokens في localStorage
- تشفير البيانات الحساسة

### 4. Automatic Token Refresh
- تجديد تلقائي للـ tokens
- معالجة أخطاء 401

### 5. Token Validation
- التحقق من صحة الـ token
- التحقق من تاريخ انتهاء الصلاحية

## استكشاف الأخطاء

### 1. خطأ "unauthorized_client" أو "Unknown client"
```
خطأ: unauthorized_client - Unknown client or client not enabled
الحل: 
1. تشغيل PowerShell script: .\reset-identityserver.ps1
2. أو تشغيل: dotnet run -- /seed
3. أو تشغيل SQL script: add-angular-client.sql
```

### 2. خطأ في الاتصال بـ IdentityServer
```
خطأ: لا يمكن الاتصال بـ IdentityServer
الحل: تأكد من تشغيل IdentityServer على المنفذ 5001
```

### 3. خطأ في الـ Callback
```
خطأ: Invalid state parameter
الحل: تأكد من أن الـ state محفوظ بشكل صحيح
```

### 4. خطأ في الـ Token Exchange
```
خطأ: Invalid authorization code
الحل: تأكد من صحة الـ code_verifier
```

### 5. خطأ في الـ CORS
```
خطأ: CORS policy violation
الحل: تأكد من إضافة localhost:4200 في AllowedCorsOrigins
```

### 6. خطأ في قاعدة البيانات
```
خطأ: Database connection failed
الحل: 
1. تأكد من تشغيل SQL Server
2. تأكد من صحة connection string
3. تشغيل migrations: dotnet ef database update
```

## التطوير المستقبلي

### 1. إضافة Silent Renew
- تجديد الـ token في الخلفية
- تجربة مستخدم أفضل

### 2. إضافة Multi-factor Authentication
- المصادقة متعددة العوامل
- أمان إضافي

### 3. إضافة Role-based UI
- إخفاء/إظهار عناصر الواجهة حسب الصلاحيات
- تجربة مستخدم مخصصة

### 4. إضافة Session Management
- إدارة الجلسات
- تسجيل الخروج من جميع الأجهزة

## الدعم

للمساعدة أو الإبلاغ عن مشاكل، يرجى التواصل مع فريق التطوير. 