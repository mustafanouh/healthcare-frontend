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



الان سوف نعدل المطنق الخاص بتسجيل موعد لطبيب  بحيث يكون اكثر دقة حيث في البداية 
سوف يختار المريض 
وبعدها يختار  المنشئة حيث 
get {{baseUrl}}/facilities
ret 
{
    "success": true,
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": 5,
                "parent_id": 1,
                "name": "Al-Nour Archived Clinic",
                "facility_type": "clinic",
                "phone_number": "+966112000005",
                "address": "Riyadh, Al-Nour District",
                "is_active": 0,
                "created_at": "2026-09-04T18:28:48.000000Z",
                "updated_at": "2026-09-04T18:28:48.000000Z",
                "parent": {
                    "id": 1,
                    "parent_id": null,
                    "name": "Al-Nour Teaching Hospital",
                    "facility_type": "hospital",
                    "phone_number": "+966112000001",
                    "address": "Riyadh, Al-Nour District",
                    "is_active": 1,
                    "created_at": "2026-09-04T18:28:48.000000Z",
                    "updated_at": "2026-09-04T18:28:48.000000Z"
                },
                "childrens": []
            },
            {
                "id": 4,
                "parent_id": 1,
                "name": "Al-Nour Diagnostic Laboratory",
                "facility_type": "laboratory",
                "phone_number": "+966112000004",
                "address": "Riyadh, Al-Nour District",
                "is_active": 1,
                "created_at": "2026-09-04T18:28:48.000000Z",
                "updated_at": "2026-09-04T18:28:48.000000Z",
                "parent": {
                    "id": 1,
                    "parent_id": null,
                    "name": "Al-Nour Teaching Hospital",
                    "facility_type": "hospital",
                    "phone_number": "+966112000001",
                    "address": "Riyadh, Al-Nour District",
                    "is_active": 1,
                    "created_at": "2026-09-04T18:28:48.000000Z",
                    "updated_at": "2026-09-04T18:28:48.000000Z"
                },
                "childrens": []
            },
            {
                "id": 3,
                "parent_id": 1,
                "name": "Al-Nour Community Pharmacy",
                "facility_type": "pharmacy",
                "phone_number": "+966112000003",
                "address": "Riyadh, Al-Nour District",
                "is_active": 1,
                "created_at": "2026-09-04T18:28:48.000000Z",
                "updated_at": "2026-09-04T18:28:48.000000Z",
                "parent": {
                    "id": 1,
                    "parent_id": null,
                    "name": "Al-Nour Teaching Hospital",
                    "facility_type": "hospital",
                    "phone_number": "+966112000001",
                    "address": "Riyadh, Al-Nour District",
                    "is_active": 1,
                    "created_at": "2026-09-04T18:28:48.000000Z",
                    "updated_at": "2026-09-04T18:28:48.000000Z"
                },
                "childrens": []
            },
            {
                "id": 2,
                "parent_id": 1,
                "name": "Al-Nour Family Clinic",
                "facility_type": "clinic",
                "phone_number": "+966112000002",
                "address": "Riyadh, Al-Nour District",
                "is_active": 1,
                "created_at": "2026-09-04T18:28:48.000000Z",
                "updated_at": "2026-09-04T18:28:48.000000Z",
                "parent": {
                    "id": 1,
                    "parent_id": null,
                    "name": "Al-Nour Teaching Hospital",
                    "facility_type": "hospital",
                    "phone_number": "+966112000001",
                    "address": "Riyadh, Al-Nour District",
                    "is_active": 1,
                    "created_at": "2026-09-04T18:28:48.000000Z",
                    "updated_at": "2026-09-04T18:28:48.000000Z"
                },
                "childrens": []
            },
            {
                "id": 1,
                "parent_id": null,
                "name": "Al-Nour Teaching Hospital",
                "facility_type": "hospital",
                "phone_number": "+966112000001",
                "address": "Riyadh, Al-Nour District",
                "is_active": 1,
                "created_at": "2026-09-04T18:28:48.000000Z",
                "updated_at": "2026-09-04T18:28:48.000000Z",
                "parent": null,
                "childrens": [
                    {
                        "id": 2,
                        "parent_id": 1,
                        "name": "Al-Nour Family Clinic",
                        "facility_type": "clinic",
                        "phone_number": "+966112000002",
                        "address": "Riyadh, Al-Nour District",
                        "is_active": 1,
                        "created_at": "2026-09-04T18:28:48.000000Z",
                        "updated_at": "2026-09-04T18:28:48.000000Z"
                    },
                    {
                        "id": 3,
                        "parent_id": 1,
                        "name": "Al-Nour Community Pharmacy",
                        "facility_type": "pharmacy",
                        "phone_number": "+966112000003",
                        "address": "Riyadh, Al-Nour District",
                        "is_active": 1,
                        "created_at": "2026-09-04T18:28:48.000000Z",
                        "updated_at": "2026-09-04T18:28:48.000000Z"
                    },
                    {
                        "id": 4,
                        "parent_id": 1,
                        "name": "Al-Nour Diagnostic Laboratory",
                        "facility_type": "laboratory",
                        "phone_number": "+966112000004",
                        "address": "Riyadh, Al-Nour District",
                        "is_active": 1,
                        "created_at": "2026-09-04T18:28:48.000000Z",
                        "updated_at": "2026-09-04T18:28:48.000000Z"
                    },
                    {
                        "id": 5,
                        "parent_id": 1,
                        "name": "Al-Nour Archived Clinic",
                        "facility_type": "clinic",
                        "phone_number": "+966112000005",
                        "address": "Riyadh, Al-Nour District",
                        "is_active": 0,
                        "created_at": "2026-09-04T18:28:48.000000Z",
                        "updated_at": "2026-09-04T18:28:48.000000Z"
                    }
                ]
            }
        ],
        "first_page_url": "http://127.0.0.1:8000/api/facilities?page=1",
        "from": 1,
        "last_page": 1,
        "last_page_url": "http://127.0.0.1:8000/api/facilities?page=1",
        "links": [
            {
                "url": null,
                "label": "&laquo; Previous",
                "page": null,
                "active": false
            },
            {
                "url": "http://127.0.0.1:8000/api/facilities?page=1",
                "label": "1",
                "page": 1,
                "active": true
            },
            {
                "url": null,
                "label": "Next &raquo;",
                "page": null,
                "active": false
            }
        ],
        "next_page_url": null,
        "path": "http://127.0.0.1:8000/api/facilities",
        "per_page": 10,
        "prev_page_url": null,
        "to": 5,
        "total": 5
    }
}
حيث سوف نعرض له في ال input فقط المنشئة من نوع 
   "facility_type": "hospital"
   وبعدها سوف نعرض الاقسام  ضمن المنشئة في ال input الخاص  بال الاقسام
   get {{baseUrl}}/facilities/1/departments
   ret 
   {
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "General Medicine",
            "description": "General outpatient assessment and follow-up.",
            "is_active": 1,
            "created_at": "2026-09-04T18:28:48.000000Z",
            "updated_at": "2026-09-04T18:28:48.000000Z"
        },
        {
            "id": 2,
            "name": "Cardiology",
            "description": "Cardiovascular assessment and treatment.",
            "is_active": 1,
            "created_at": "2026-09-04T18:28:48.000000Z",
            "updated_at": "2026-09-04T18:28:48.000000Z"
        },
        {
            "id": 3,
            "name": "Pediatrics",
            "description": "Child health assessment and treatment.",
            "is_active": 1,
            "created_at": "2026-09-04T18:28:48.000000Z",
            "updated_at": "2026-09-04T18:28:48.000000Z"
        },
        {
            "id": 5,
            "name": "Retired Department",
            "description": "Reference record retained for historical configuration.",
            "is_active": 0,
            "created_at": "2026-09-04T18:28:48.000000Z",
            "updated_at": "2026-09-04T18:28:48.000000Z"
        }
    ]
}
وبعدها سوف نعرض
