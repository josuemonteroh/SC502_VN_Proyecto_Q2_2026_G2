"use strict";

/* LocalStorage */

const NYVORA_KEYS = {

    initialized: "nyvora_initialized",

    patients: "nyvora_patients",

    metrics: "nyvora_metrics",

    alerts: "nyvora_alerts"

};

/* Lectura */

function nyvoraRead(key, fallback = []) {

    try {

        const value = localStorage.getItem(key);

        if (!value) {

            return fallback;

        }

        return JSON.parse(value);

    }

    catch (error) {

        console.error(
            "Error leyendo localStorage:",
            error
        );

        return fallback;

    }

}

/* Escritura */

function nyvoraWrite(key, data) {

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );

}

/* Eventos */

function nyvoraNotify(type) {

    window.dispatchEvent(

        new CustomEvent(
            "nyvora:data-changed",
            {
                detail: {
                    type
                }
            }
        )

    );

}

/* Utilidades */

function nyvoraNextId(list) {

    return list.reduce((max, item) => {

        return Math.max(
            max,
            Number(item.id) || 0
        );

    }, 0) + 1;

}

function nyvoraNow() {

    const date = new Date();

    const offset = date.getTimezoneOffset();

    return new Date(
        date.getTime() - offset * 60000
    )
        .toISOString()
        .slice(0, 19);

}

function nyvoraDatePart(value) {

    return String(value || "")
        .slice(0, 10);

}

function nyvoraBuildDate(value) {

    const text = String(value || "");

    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {

        const [year, month, day] =
            text
                .split("-")
                .map(Number);

        return new Date(
            year,
            month - 1,
            day
        );

    }

    return new Date(
        text.replace(" ", "T")
    );

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

    return Number(

        (
            weight /
            (height * height)
        ).toFixed(1)

    );

}

/* Pacientes */

function nyvoraGetPatients() {

    const patients = nyvoraRead(
        NYVORA_KEYS.patients,
        []
    );

    return Array.isArray(patients)
        ? patients
        : [];

}

function nyvoraGetPatientById(patientId) {

    return nyvoraGetPatients().find((patient) =>

        Number(patient.id) ===
        Number(patientId)

    );

}

function nyvoraSavePatients(patients) {

    nyvoraWrite(
        NYVORA_KEYS.patients,
        patients
    );

    nyvoraNotify("patients");

}

function nyvoraAddPatient(data) {

    const patients = nyvoraGetPatients();

    const patient = {

        id: nyvoraNextId(patients),

        fullName: String(
            data.fullName || ""
        ).trim(),

        identification: String(
            data.identification || ""
        ).trim(),

        age: data.age
            ? Number(data.age)
            : null,

        phone: String(
            data.phone || ""
        ).trim(),

        heightM: data.heightM
            ? Number(data.heightM)
            : null,

        conditionGeneral: String(
            data.conditionGeneral || ""
        ).trim(),

        observations: String(
            data.observations || ""
        ).trim(),

        status: data.status || "ACTIVO",

        isActive: data.isActive !== false,

        createdAt:
            data.createdAt ||
            nyvoraNow()

    };

    patients.push(patient);

    nyvoraSavePatients(patients);

    return patient;

}

function nyvoraUpdatePatient(patientId, changes) {

    const patients = nyvoraGetPatients();

    const index = patients.findIndex((patient) =>

        Number(patient.id) ===
        Number(patientId)

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

/* Métricas */

function nyvoraGetMetrics(patientId = null) {

    let metrics = nyvoraRead(
        NYVORA_KEYS.metrics,
        []
    );

    if (!Array.isArray(metrics)) {

        metrics = [];

    }

    if (patientId !== null) {

        metrics = metrics.filter((metric) =>

            Number(metric.patientId) ===
            Number(patientId)

        );

    }

    return metrics.sort((a, b) =>

        nyvoraBuildDate(b.measurementDate) -
        nyvoraBuildDate(a.measurementDate)

    );

}

function nyvoraSaveMetrics(metrics) {

    nyvoraWrite(
        NYVORA_KEYS.metrics,
        metrics
    );

    nyvoraNotify("metrics");

}

function nyvoraAddMetric(data) {

    const metrics = nyvoraGetMetrics();

    const metric = {

        id: nyvoraNextId(metrics),

        patientId: Number(data.patientId),

        measurementDate:
            data.measurementDate ||
            nyvoraNow(),

        weightKg: data.weightKg
            ? Number(data.weightKg)
            : null,

        bmi: data.bmi
            ? Number(data.bmi)
            : null,

        bodyFatPercentage: data.bodyFatPercentage
            ? Number(data.bodyFatPercentage)
            : null,

        heartRate: data.heartRate
            ? Number(data.heartRate)
            : null,

        sleepHours: data.sleepHours
            ? Number(data.sleepHours)
            : null,

        steps: data.steps
            ? Number(data.steps)
            : null,

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

    const metrics =
        nyvoraGetMetrics(patientId);

    return metrics.length
        ? metrics[metrics.length - 1]
        : null;

}

/* Alertas */

function nyvoraGetAlerts() {

    const alerts = nyvoraRead(
        NYVORA_KEYS.alerts,
        []
    );

    if (!Array.isArray(alerts)) {

        return [];

    }

    return alerts.sort((a, b) =>

        nyvoraBuildDate(b.createdAt) -
        nyvoraBuildDate(a.createdAt)

    );

}

function nyvoraSaveAlerts(alerts) {

    nyvoraWrite(
        NYVORA_KEYS.alerts,
        alerts
    );

    nyvoraNotify("alerts");

}

function nyvoraAddAlert(data) {

    const alerts = nyvoraGetAlerts();

    const alert = {

        id: nyvoraNextId(alerts),

        patientId: Number(data.patientId),

        type:
            data.type ||
            "Alerta preventiva",

        message:
            data.message ||
            "Se detectó una condición que requiere seguimiento.",

        priority:
            data.priority ||
            "MEDIA",

        status:
            data.status ||
            "ACTIVE",

        createdAt:
            data.createdAt ||
            nyvoraNow(),

        resolvedAt: null

    };

    alerts.push(alert);

    nyvoraSaveAlerts(alerts);

    return alert;

}

function nyvoraUpdateAlert(alertId, changes) {

    const alerts = nyvoraGetAlerts();

    const index = alerts.findIndex((alert) =>

        Number(alert.id) ===
        Number(alertId)

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

/* Datos de demostración */

function nyvoraEnsureDemoData() {

    const initialized =
        localStorage.getItem(
            NYVORA_KEYS.initialized
        );

    if (initialized === "true") {

        return;

    }

    const patients = [

        /* Mantener exactamente los datos actuales */

    ];

    const metrics = [

        /* Mantener exactamente los datos actuales */

    ];

    const alerts = [

        /* Mantener exactamente los datos actuales */

    ];

    nyvoraWrite(
        NYVORA_KEYS.patients,
        patients
    );

    nyvoraWrite(
        NYVORA_KEYS.metrics,
        metrics
    );

    nyvoraWrite(
        NYVORA_KEYS.alerts,
        alerts
    );

    localStorage.setItem(
        NYVORA_KEYS.initialized,
        "true"
    );

}

/* Inicialización */

nyvoraEnsureDemoData();

