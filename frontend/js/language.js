/* NYVORA LANGUAGE SYSTEM*/

/* Idioma Actual
   Define el idioma inicial del sistema.
*/

let currentLanguage = "es";


/* Traducciones
   Almacena todos los textos de la plataforma.
*/

const translations = {

    es:{

        /* Panel Izquierdo */

        platform_title:"Plataforma Inteligente<br>de Seguimiento Nutricional",

        platform_description:"Gestiona pacientes, registra métricas biométricas y administra el seguimiento nutricional desde una única plataforma.",

        feature_1:"Seguimiento integral de pacientes",

        feature_2:"Registro de métricas nutricionales",

        feature_3:"Historial clínico organizado",

        feature_4:"Información protegida y segura",


        /* Login */

        login_title:"Bienvenido",

        login_subtitle:"Inicie sesión para acceder a la plataforma Nyvora.",

        email_label:"Correo electrónico",

        email_placeholder:"Ingrese su correo electrónico",

        password_label:"Contraseña",

        password_placeholder:"Ingrese su contraseña",

        remember_me:"Mantener mi sesión iniciada",

        forgot_password:"¿Olvidó su contraseña?",

        login_button:"Iniciar Sesión",

        need_access:"¿Necesita acceso?",

        request_access:"Solicitar acceso",

        version:"Versión 1.0.0",

        footer:"© 2026 Nyvora | Universidad Fidélitas"

    },


    en:{

        /* Left Panel */

        platform_title:"Intelligent Nutrition<br>Monitoring Platform",

        platform_description:"Manage patients, record biometric metrics and monitor nutritional progress from a single platform.",

        feature_1:"Comprehensive patient monitoring",

        feature_2:"Nutritional metrics tracking",

        feature_3:"Organized clinical history",

        feature_4:"Protected and secure information",


        /* Login */

        login_title:"Welcome",

        login_subtitle:"Sign in to access the Nyvora platform.",

        email_label:"Email",

        email_placeholder:"Enter your email",

        password_label:"Password",

        password_placeholder:"Enter your password",

        remember_me:"Keep me signed in",

        forgot_password:"Forgot your password?",

        login_button:"Sign In",

        need_access:"Need access?",

        request_access:"Request access",

        version:"Version 1.0.0",

        footer:"© 2026 Nyvora | Fidélitas University"

    }

};


/* Cambiar Idioma
   Actualiza todos los textos y placeholders de la página.
*/

function changeLanguage(language){

    currentLanguage = language;

    document.querySelectorAll("[data-lang]").forEach(element=>{

        const key = element.dataset.lang;

        if(translations[language] && translations[language][key]){

            const value = translations[language][key];

            if(value.includes("<br>")){

                element.innerHTML = value;

            }else{

                element.textContent = value;

            }

        }

    });

    document.querySelectorAll("[data-placeholder]").forEach(element=>{

        const key = element.dataset.placeholder;

        if(translations[language] && translations[language][key]){

            element.placeholder = translations[language][key];

        }

    });

}


/* Guardar Idioma
   Conserva la preferencia del usuario.
*/

function setLanguage(language){

    currentLanguage = language;

    localStorage.setItem("nyvora-language",language);

    const selector = document.getElementById("language-select");

    if(selector){

        selector.value = language;

    }

    changeLanguage(language);

}


/* Cargar Idioma
   Recupera el idioma almacenado al abrir la página.
*/

document.addEventListener("DOMContentLoaded",()=>{

    const savedLanguage = localStorage.getItem("nyvora-language") || "es";

    const selector = document.getElementById("language-select");

    if(selector){

        selector.value = savedLanguage;

    }

    changeLanguage(savedLanguage);

});