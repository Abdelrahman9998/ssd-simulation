const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// تفعيل الـ CORS والـ JSON لكي يستطيع الـ Frontend التواصل مع السيرفر
app.use(cors());
app.use(express.json());

// قاعدة بيانات وهمية مؤقتة (يمكنك لاحقاً ربطها بقاعدة بيانات حقيقية مثل MongoDB أو MySQL)
const requestsDatabase = [
    { id: 'SSD-2026-9812', status: 'قيد المراجعة', description: 'طلب تم استلامه وتحويله لقسم إصدار البطاقات المختص.' },
    { id: 'SSD-2026-5541', status: 'تمت الموافقة', description: 'تم إصدار تصريح مواقف السيارات بنجاح، يمكنك الاستلام.' },
    { id: 'SSD-2026-1029', status: 'قيد المعالجة', description: 'جاري مراجعة الأوراق الثبوتية لبدل فاقد البطاقة.' }
];

// مسار (Endpoint) خاص بالبحث عن حالة المعاملة
app.get('/api/track/:id', (req, res) => {
    const requestId = req.params.id.trim();
    const foundRequest = requestsDatabase.find(item => item.id.toUpperCase() === requestId.toUpperCase());

    if (foundRequest) {
        res.json({ success: true, data: foundRequest });
    } else {
        res.status(404).json({ success: false, message: 'عذراً، لم يتم العثور على معاملة بهذا الرقم. تأكد من صحة الرقم المدخل.' });
    }
});

// مسار إضافي لتجربة إرسال طلب جديد (POST Request) مستقبلاً
app.post('/api/requests', (req, res) => {
    const { name, serviceType, details } = req.body;
    
    // توليد رقم معاملة عشوائي جديد
    const newId = 'SSD-2026-' + Math.floor(1000 + Math.random() * 9000);
    
    const newRequest = {
        id: newId,
        status: 'جديد - قيد المراجعة',
        description: `تم استلام طلبك (${serviceType}) بنجاح وجاري مراجعته.`
    };

    requestsDatabase.push(newRequest);

    res.json({ 
        success: true, 
        message: 'تم تقديم الطلب بنجاح', 
        trackingId: newId,
        data: newRequest 
    });
});

// تشغيل السيرفر على المنفذ 3000
app.listen(PORT, () => {
    console.log(`Backend server is running smoothly at http://localhost:${PORT}`);
});