"use strict";

/*
    Esto simulala base de datos mientras
    todavía no se conecta PHP + MySQL.

    Después se reemplazan estas funciones por fetch()
    hacia el backend
*/

const NYVORA_KEYS = {
    initialized: "nyvora_initialized",
    patients: "nyvora_patients",
    metrics: "nyvora_metrics",
    alerts: "nyvora_alerts"
};


function nyvoraRead(key, fallback = []) {
    try {
        const value = localStorage.getItem(key);

        if (!value) {
            return fallback;
        }

        return JSON.parse(value);
    } catch (error) {
        console.error("Error leyendo localStorage:", error);
        return fallback;
    }
}


function nyvoraWrite(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}


function nyvoraNotify(type) {
    window.dispatchEvent(
        new CustomEvent("nyvora:data-changed", {
            detail: { type }
        })
    );
}


function nyvoraNextId(list) {
    return list.reduce((max, item) => {
        return Math.max(max, Number(item.id) || 0);
    }, 0) + 1;
}


function nyvoraNow() {
    const date = new Date();
    const offset = date.getTimezoneOffset();

    return new Date(date.getTime() - offset * 60000)
        .toISOString()
        .slice(0, 19);
}


function nyvoraDatePart(value) {
    return String(value || "").slice(0, 10);
}


function nyvoraBuildDate(value) {
    const text = String(value || "");

    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
        const [year, month, day] = text.split("-").map(Number);

        return new Date(year, month - 1, day);
    }

    return new Date(text.replace(" ", "T"));
}


function nyvoraFormatDate(value) {
    if (!value) {
        return "Sin fecha";
    }

    const date = nyvoraBuildDate(value);

    if (Number.isNaN(date.getTime())) {
        return "Sin fecha";
    }

    return date.toLocaleDateString("es-CR", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


function nyvoraFormatDateTime(value) {
    if (!value) {
        return "Sin fecha";
    }

    const date = nyvoraBuildDate(value);

    if (Number.isNaN(date.getTime())) {
        return "Sin fecha";
    }

    return date.toLocaleString("es-CR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}


function nyvoraEscapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function nyvoraCalculateBMI(weightKg, heightM) {
    const weight = Number(weightKg);
    const height = Number(heightM);

    if (!weight || !height || height <= 0) {
        return null;
    }

    return Number((weight / (height * height)).toFixed(1));
}







function nyvoraGetPatients() {
    const patients = nyvoraRead(NYVORA_KEYS.patients, []);

    return Array.isArray(patients) ? patients : [];
}


function nyvoraGetPatientById(patientId) {
    return nyvoraGetPatients().find(
        patient => Number(patient.id) === Number(patientId)
    );
}


function nyvoraSavePatients(patients) {
    nyvoraWrite(NYVORA_KEYS.patients, patients);
    nyvoraNotify("patients");
}


function nyvoraAddPatient(data) {
    const patients = nyvoraGetPatients();

    const patient = {
        id: nyvoraNextId(patients),

        fullName: String(data.fullName || "").trim(),
        identification: String(data.identification || "").trim(),

        age: data.age ? Number(data.age) : null,
        phone: String(data.phone || "").trim(),

        heightM: data.heightM ? Number(data.heightM) : null,

        conditionGeneral: String(data.conditionGeneral || "").trim(),
        observations: String(data.observations || "").trim(),

        status: data.status || "ACTIVO",
        isActive: data.isActive !== false,

        createdAt: data.createdAt || nyvoraNow()
    };

    patients.push(patient);

    nyvoraSavePatients(patients);

    return patient;
}


function nyvoraUpdatePatient(patientId, changes) {
    const patients = nyvoraGetPatients();

    const index = patients.findIndex(
        patient => Number(patient.id) === Number(patientId)
    );

    if (index === -1) {
        return null;
    }

    patients[index] = {
        ...patients[index],
        ...changes
    };

    nyvoraSavePatients(patients);

    return patients[index];
}









function nyvoraGetMetrics(patientId = null) {
    let metrics = nyvoraRead(NYVORA_KEYS.metrics, []);

    if (!Array.isArray(metrics)) {
        metrics = [];
    }

    if (patientId !== null) {
        metrics = metrics.filter(
            metric => Number(metric.patientId) === Number(patientId)
        );
    }

    return metrics.sort((a, b) => {
        return nyvoraBuildDate(b.measurementDate) - nyvoraBuildDate(a.measurementDate);
    });
}


function nyvoraSaveMetrics(metrics) {
    nyvoraWrite(NYVORA_KEYS.metrics, metrics);
    nyvoraNotify("metrics");
}


function nyvoraAddMetric(data) {
    const metrics = nyvoraGetMetrics();

    const metric = {
        id: nyvoraNextId(metrics),

        patientId: Number(data.patientId),
        measurementDate: data.measurementDate || nyvoraNow(),

        weightKg: data.weightKg ? Number(data.weightKg) : null,
        bmi: data.bmi ? Number(data.bmi) : null,
        bodyFatPercentage: data.bodyFatPercentage
            ? Number(data.bodyFatPercentage)
            : null,

        heartRate: data.heartRate ? Number(data.heartRate) : null,
        sleepHours: data.sleepHours ? Number(data.sleepHours) : null,
        steps: data.steps ? Number(data.steps) : null,

        createdAt: nyvoraNow()
    };

    metrics.push(metric);

    nyvoraSaveMetrics(metrics);

    return metric;
}


function nyvoraGetLatestMetric(patientId) {
    return nyvoraGetMetrics(patientId)[0] || null;
}


function nyvoraGetInitialMetric(patientId) {
    const metrics = nyvoraGetMetrics(patientId);

    return metrics.length ? metrics[metrics.length - 1] : null;
}








function nyvoraGetAlerts() {
    const alerts = nyvoraRead(NYVORA_KEYS.alerts, []);

    if (!Array.isArray(alerts)) {
        return [];
    }

    return alerts.sort((a, b) => {
        return nyvoraBuildDate(b.createdAt) - nyvoraBuildDate(a.createdAt);
    });
}


function nyvoraSaveAlerts(alerts) {
    nyvoraWrite(NYVORA_KEYS.alerts, alerts);
    nyvoraNotify("alerts");
}


function nyvoraAddAlert(data) {
    const alerts = nyvoraGetAlerts();

    const alert = {
        id: nyvoraNextId(alerts),

        patientId: Number(data.patientId),

        type: data.type || "Alerta preventiva",
        message: data.message || "Se detectó una condición que requiere seguimiento.",

        priority: data.priority || "MEDIA",
        status: data.status || "ACTIVE",

        createdAt: data.createdAt || nyvoraNow(),
        resolvedAt: null
    };

    alerts.push(alert);

    nyvoraSaveAlerts(alerts);

    return alert;
}


function nyvoraUpdateAlert(alertId, changes) {
    const alerts = nyvoraGetAlerts();

    const index = alerts.findIndex(
        alert => Number(alert.id) === Number(alertId)
    );

    if (index === -1) {
        return null;
    }

    alerts[index] = {
        ...alerts[index],
        ...changes
    };

    nyvoraSaveAlerts(alerts);

    return alerts[index];
}








function nyvoraEnsureDemoData() {
    const initialized = localStorage.getItem(NYVORA_KEYS.initialized);

    if (initialized === "true") {
        return;
    }

    const patients = [
        {
            id: 1,
            fullName: "María Rodríguez Vargas",
            identification: "1-1234-5678",
            age: 35,
            phone: "8888-1111",
            heightM: 1.65,
            conditionGeneral: "Sobrepeso moderado",
            observations: "Paciente en seguimiento preventivo.",
            status: "ACTIVO",
            isActive: true,
            createdAt: "2026-06-01T08:00:00"
        },
        {
            id: 2,
            fullName: "Carlos Hernández Mora",
            identification: "2-2345-6789",
            age: 42,
            phone: "8888-2222",
            heightM: 1.78,
            conditionGeneral: "Sobrepeso y baja actividad física",
            observations: "Se recomienda mejorar caminatas diarias.",
            status: "SEGUIMIENTO",
            isActive: true,
            createdAt: "2026-06-01T08:10:00"
        }
    ];

    const metrics = [
        {
            id: 1,
            patientId: 1,
            measurementDate: "2026-06-01T08:00:00",
            weightKg: 82.5,
            bmi: 30.3,
            bodyFatPercentage: 34.2,
            heartRate: 76,
            sleepHours: 6.5,
            steps: 4200,
            createdAt: "2026-06-01T08:00:00"
        },
        {
            id: 2,
            patientId: 1,
            measurementDate: "2026-06-08T08:00:00",
            weightKg: 81.8,
            bmi: 30.0,
            bodyFatPercentage: 33.8,
            heartRate: 74,
            sleepHours: 7,
            steps: 5600,
            createdAt: "2026-06-08T08:00:00"
        },
        {
            id: 3,
            patientId: 1,
            measurementDate: "2026-06-15T08:00:00",
            weightKg: 81.2,
            bmi: 29.8,
            bodyFatPercentage: 33.4,
            heartRate: 72,
            sleepHours: 7.5,
            steps: 6800,
            createdAt: "2026-06-15T08:00:00"
        },
        {
            id: 4,
            patientId: 2,
            measurementDate: "2026-06-01T08:00:00",
            weightKg: 96.4,
            bmi: 30.4,
            bodyFatPercentage: 36.5,
            heartRate: 88,
            sleepHours: 5.5,
            steps: 2500,
            createdAt: "2026-06-01T08:00:00"
        },
        {
            id: 5,
            patientId: 2,
            measurementDate: "2026-06-08T08:00:00",
            weightKg: 97.1,
            bmi: 30.6,
            bodyFatPercentage: 36.9,
            heartRate: 90,
            sleepHours: 5,
            steps: 2200,
            createdAt: "2026-06-08T08:00:00"
        },
        {
            id: 6,
            patientId: 2,
            measurementDate: "2026-06-15T08:00:00",
            weightKg: 97.8,
            bmi: 30.9,
            bodyFatPercentage: 37.2,
            heartRate: 92,
            sleepHours: 5.25,
            steps: 1800,
            createdAt: "2026-06-15T08:00:00"
        }
    ];

    const alerts = [
        {
            id: 1,
            patientId: 2,
            type: "Aumento de peso",
            message: "El paciente presenta un aumento constante de peso durante las últimas semanas.",
            priority: "ALTA",
            status: "ACTIVE",
            createdAt: "2026-06-15T09:00:00",
            resolvedAt: null
        },
        {
            id: 2,
            patientId: 2,
            type: "Baja actividad física",
            message: "El promedio de pasos diarios se encuentra por debajo del objetivo recomendado.",
            priority: "MEDIA",
            status: "ACTIVE",
            createdAt: "2026-06-15T09:10:00",
            resolvedAt: null
        },
        {
            id: 3,
            patientId: 1,
            type: "Mejora de actividad",
            message: "La paciente aumentó progresivamente su cantidad de pasos diarios.",
            priority: "BAJA",
            status: "RESOLVED",
            createdAt: "2026-06-15T09:20:00",
            resolvedAt: "2026-06-15T10:00:00"
        }
    ];

    nyvoraWrite(NYVORA_KEYS.patients, patients);
    nyvoraWrite(NYVORA_KEYS.metrics, metrics);
    nyvoraWrite(NYVORA_KEYS.alerts, alerts);

    localStorage.setItem(NYVORA_KEYS.initialized, "true");
}


nyvoraEnsureDemoData();