# 🏛️ Enterprise Node.js + Express + TypeScript Base Architecture

بنية تحتية قياسية وموحدة (Production-Ready Boilerplate) لتطبيقات الـ Backend المعتمدة على **Node.js** و **Express.js** باستخدام **TypeScript**، مصممة بنمط **Modular Vertical-Slice Architecture** لضمان فصل المسؤوليات وسهولة التوسع والصيانة.

---

## 1. مبادئ التصميم والمعايير المعمارية (Core Principles)

1. **Feature-Driven / Modular:** كل موديول يمثل Business Domain مستقل يحتوي على (Routes, Controller, Service, Repository, Validation Schema).
2. **Decoupled Business Logic:** يُمنع منعاً باتاً تمرير كائنات `req` أو `res` إلى طبقة الـ `Service` أو `Repository`. الـ Services تتعامل فقط مع Pure Data (DTOs / Interfaces).
3. **Fail-Fast Configuration:** فحص صارم للمتغيرات البيئية (`.env`) وقت الإقلاع عبر **Zod** لضمان عدم تشغيل الخادم بإعدادات ناقصة.
4. **Centralized Error Handling:** لا يتم استخدام `try/catch` عشوائي داخل الكنترولرز؛ يتم تصعيد الأخطاء تلقائياً إلى Global Error Handler موحد.
5. **Type Safety & Runtime Validation:** الاعتماد على **Zod** كمصدر وحيد للحقيقة (Single Source of Truth) للتحقق من صحة المدخلات وتوليد الـ TypeScript Types تلقائياً.
6. **Enterprise Security & Rate Limiting:** تأمين الـ HTTP Headers باستخدام Helmet، وتطبيق Rate Limiting لمنع هجمات Brute Force و DDoS.
7. **Distributed Tracing & Contextual Logging:** تخصيص `Trace ID` فريد لكل Request ومتابعته عبر `AsyncLocalStorage` ودمجه تلقائياً مع Pino Logger.
8. **Automated API Documentation:** توثيق الـ Endpoints تلقائياً وفق معيار OpenAPI (Swagger) بالاعتماد على Zod Schemas.
9. **Health Check & Readiness Probes:** توفير مسارات فحص الجاهزية والاستجابة (`/health`, `/ready`, `/live`) لمتابعة حالة السيرفر والاتصالات الخارجية.

---

## 2. هيكل شجرة المشروع (Project Directory Tree)

```text
├── .env.example
├── .env
├── .gitignore
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── ARCHITECTURE.md
├── src/
│   ├── app.ts                        # تهيئة Express، الميدلويرز، وتجميع الـ Routes
│   ├── server.ts                     # نقطة الانطلاق وإدارة الـ Graceful Shutdown
│   │
│   ├── config/                       # الإعدادات والمتغيرات البيئية
│   │   ├── env.ts                    # Zod Runtime Env Validator
│   │   └── swagger.ts                # إعدادات التوثيق والتصدير لـ Swagger/OpenAPI
│   │
│   ├── db/                           # إدارة الاتصال بقاعدة البيانات
│   │   ├── client.ts                 # Database Client Instance (Prisma/Drizzle/Pool)
│   │   └── migrations/
│   │
│   ├── shared/                       # المكونات المشتركة عبر النظام
│   │   ├── context/                  # AsyncLocalStorage للتتبع (Trace ID)
│   │   │   └── request-context.ts
│   │   ├── errors/                   # شجرة كلاسات الأخطاء المخصصة
│   │   │   ├── app-error.ts
│   │   │   ├── bad-request.error.ts
│   │   │   ├── not-found.error.ts
│   │   │   ├── unauthorized.error.ts
│   │   │   └── forbidden.error.ts
│   │   ├── middlewares/             # Global Middlewares
│   │   │   ├── error-handler.middleware.ts
│   │   │   ├── validate.middleware.ts
│   │   │   ├── authenticate.middleware.ts
│   │   │   ├── request-logger.middleware.ts
│   │   │   ├── rate-limiter.middleware.ts
│   │   │   └── trace-id.middleware.ts
│   │   └── utils/                    # أدوات مساعدة
│   │       ├── logger.ts             # Pino Logger Wrapper
│   │       └── response.util.ts      # تنسيق الـ JSON Response القياسي
│   │
│   └── modules/                      # الموديولات الوظيفية (Feature Modules)
│       ├── health/                   # موديول فحص الجاهزية والخدمة
│       │   ├── health.controller.ts
│       │   └── health.routes.ts
│       └── [module-name]/            # مثال: todos, users, auth
│           ├── [module].schema.ts     # Zod Schemas + Inferred Types
│           ├── [module].repository.ts # استعلامات قاعدة البيانات
│           ├── [module].service.ts    # Business Logic النقي
│           ├── [module].controller.ts # معالجة الـ HTTP Request / Response
│           ├── [module].routes.ts     # تعريف مسارات الـ Endpoints
│           └── [module].test.ts       # اختبارات الوحدة والتكامل
```

---

## 3. المواصفات التفصيلية للمكونات الأساسية

### 3.1 إدارة البيئة (Environment Configuration)
* يتم فحص وتوليد متغيرات البيئة بأسلوب **Fail-Fast** وقت الإقلاع عبر Zod schema.
* يمنع تشغيل السيرفر إذا كان أي متغير مطلوب مفقوداً أو غير مطابق للنقاط المعرفة (`PORT`, `NODE_ENV`, `DATABASE_URL`, `JWT_SECRET`, إلخ).

### 3.2 الأمان والـ Rate Limiting
* **Helmet:** تفعيل حزمة `helmet` لإغلاق الثغرات الأمنية في HTTP Headers.
* **Rate Limiter:** تقييد عدد الطلبات المسموح بها لكل IP خلال نافذة زمنية لمنع الإغراق.

### 3.3 تتبع الطلبات (Tracing & Context)
* استخدام `AsyncLocalStorage` لتخزين الـ `traceId` المصدر لكل Request.
* ربط الـ `traceId` بجميع سجلات الـ Logging عبر Pino لسهولة تتبع أثر الـ Request عبر النظام (Correlation Tracking).

### 3.4 الاستجابة القياسية (Standardized API Response)
جميع ردود الـ API تتبع الهيكل القياسي التالي:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "meta": {
    "traceId": "c7b3a9d2-...",
    "timestamp": "2026-08-18T03:30:00.000Z"
  }
}
```

في حالة الخطأ:
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Validation failed",
    "details": [ ... ]
  },
  "meta": {
    "traceId": "c7b3a9d2-...",
    "timestamp": "2026-08-18T03:30:00.000Z"
  }
}
```

---

## 4. خطة الاختبارات والتشغيل (Testing & Docker)

1. **Vitest / Jest:** اختبارات سريعة بدعم كامل لـ TypeScript لـ `service.test.ts` و `controller.test.ts`.
2. **Docker Compose:** حاوية تحتوي على التطبيق وقاعدة البيانات والـ Cache لضمان بيئة تطوير معزولة ومطابقة للإنتاج.