# 🏥 Healthcare System — Frontend

مشروع React لإدارة المجمع الطبي المتكامل.

## 🚀 تشغيل المشروع

```bash
# 1. تثبيت الحزم
npm install

# 2. تشغيل بيئة التطوير
npm run dev

# 3. فتح المتصفح على
# http://localhost:5173
```

## 🔧 متغيرات البيئة

قم بإنشاء ملف `.env` في جذر المشروع:

```env
VITE_API_URL=https://app-b4a68046-cc76-405f-b0be-527f1eae5608.cleverapps.io/api
```

## 👥 الأدوار والصفحات

| الدور | الـ Dashboard |
|-------|--------------|
| admin | /admin/dashboard |
| doctor | /doctor/dashboard |
| patient | /patient/dashboard |
| pharmacist | /pharmacist/dashboard |
| lab_staff | /lab/dashboard |

## 📦 التقنيات المستخدمة

- **React 18** + **Vite**
- **React Router v6** — File-based routing with lazy loading
- **Zustand** — Global state (auth, theme, language)
- **React Query v5** — Server state + cache
- **Axios** — HTTP + Bearer token interceptors
- **Formik + Yup** — Forms + validation
- **i18next** — Arabic (RTL) / English (LTR)
- **Tailwind CSS** — Utility-first styling + Dark Mode

## 🏗️ هيكلية المجلدات

```
src/
├── app/          # Router, Providers, App root
├── core/         # API, i18n, shared hooks
├── store/        # Zustand stores
├── types/        # Role constants
├── features/     # Feature-based modules (per role/entity)
└── shared/       # UI components, guards, layouts, utils
```
