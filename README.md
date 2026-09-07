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


<!-- ============ -->

عند حجز المواعيد والتأكيد يظهر زر 
Start Visit
عند الضغط عليها ونجاح العملية قم بنقل الدكتور الى واجهة خاصة 
باضافة تشخيص و تحليل و وصفة 
وعند الضغط على احد الخيارات تظهر لهم ال post الخاص فيهم 
حيث لدي 
post {{baseUrl}}/diagnoses
body 
            {   
                "visit_id" : 7,
                "diagnosis_code" : "L20",
                "description" : "Atopic Dermatitis",
                "diagnosis_type" : "secondary",
                "notes" : "Apply topical medication as directed."
            }
            ret 
            {
    "success": true,
    "message": "Diagnosis created successfully.",
    "data": {
        "visit_id": 8,
        "diagnosis_code": "La0",
        "description": "Atopic Dermatitis",
        "diagnosis_type": "secondary",
        "notes": "Apply topical medication as directed.",
        "updated_at": "2026-09-07T11:47:24.000000Z",
        "created_at": "2026-09-07T11:47:24.000000Z",
        "id": 18
    }
}
وعند الضغط على 
post {{baseUrl}}/prescriptions
{
               "visit_id" : 2,
                "notes" :" Patient must return after 7 days."
}
ret 

{
    "success": true,
    "message": "Prescription created successfully.",
    "data": {
        "visit_id": 2,
        "status": "pending",
        "notes": "Patient must return after 7 days.",
        "updated_at": "2026-05-31T21:11:04.000000Z",
        "created_at": "2026-05-31T21:11:04.000000Z",
        "id": 4
    }
}
erorr
{
    "message": "This visit already has a prescription.",
    "errors": {
        "visit_id": [
            "This visit already has a prescription."
        ]
    }
}

وبعدها اضافة العناصر في الوصفة 
post {{baseUrl}}/prescription-items
          {
               "prescription_id" : 1,
                "medication_name" : "Amoxicillin",
                "dosage" : "250 mg",
                "quantity_prescribed" : 21,
                "frequency" : "Three times daily",
                "duration" : " 7 days"
          }
          ret 
          {
    "success": true,
    "message": "Prescription item created successfully.",
    "data": {
        "prescription_id": 1,
        "medication_name": "Amoxicillin",
        "dosage": "250 mg",
        "quantity_prescribed": 21,
        "frequency": "Three times daily",
        "duration": "7 days",
        "updated_at": "2026-06-01T06:22:17.000000Z",
        "created_at": "2026-06-01T06:22:17.000000Z",
        "id": 4
    }
}

          طبعا يعود رسالة في حالة الاخطاء مثل 
{
    "message": "Prescription items can only be modified while the prescription is pending.",
    "errors": {
        "prescription_id": [
            "Prescription items can only be modified while the prescription is pending."
        ]
    }
}
قم بعرض رسالة الخطأ اسفل كل input حسب الخطأ

او الضغط على اضافة تحليل 
 post {{baseUrl}}/lab-request-items
 body 
      {     
                "visit_id" : 1,
                "lab_test_id" : 1,
                "requested_at" : "2026-06-02 12:00:00",
                "notes" : "Fasting blood sugar test"
     }
     ret 
     {
    "success": true,
    "message": "Lab request item created successfully.",
    "data": {
        "visit_id": 1,
        "lab_test_id": 1,
        "requested_at": "2026-06-02 12:00:00",
        "notes": "Fasting blood sugar test",
        "updated_at": "2026-06-02T19:44:28.000000Z",
        "created_at": "2026-06-02T19:44:28.000000Z",
        "id": 4
    }
}
error 
{
    "message": "Lab tests can only be requested during an active visit.",
    "errors": {
        "visit_id": [
            "Lab tests can only be requested during an active visit."
        ]
    }
}
وبعد الانهاء يضغط على زر انهاء الزيارة 
PATCH {{baseUrl}}/visits/8/complete
{
    "message": "Visit status cannot be changed.",
    "errors": {
        "status": [
            "Visit status cannot be changed."
        ]
    }
}
حيث سوف تقوم بانشاء صفحة خاصة لعرض الزيارة النشطة  الخاصة بالطبيب 
