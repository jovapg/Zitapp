# 📅 Zitapp — Agenda de citas para negocios (Frontend)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)

Plataforma web para que los clientes **encuentren negocios y agenden citas en línea**, y para que los negocios gestionen su disponibilidad, servicios y agenda. Incluye un **panel administrativo** con reportes y estadísticas.

🔗 **Backend (API REST en Spring Boot):** [ZITAPP-API](https://github.com/jovapg/ZITAPP-API)

> 📸 *Agrega aquí capturas: página principal, mapa de negocios, agenda y dashboard.*

---

## ✨ Funcionalidades

**Para clientes**
- Búsqueda de negocios por categoría y ubicación en **mapa interactivo**
- Agendamiento de citas según la disponibilidad del negocio
- Consulta y gestión de sus citas
- **Notificaciones en tiempo real** (WebSockets / STOMP)

**Para negocios**
- Configuración del perfil, servicios y horarios disponibles
- Gestión de citas recibidas

**Panel administrativo**
- Gestión de usuarios, negocios, servicios y citas
- Reportes con **gráficos** y exportación a **PDF, Excel y CSV**

**General**
- Enrutamiento protegido por **roles** (cliente, negocio, administrador)
- Formularios validados con React Hook Form
- Diseño responsive

## 🛠️ Tecnologías

React · Vite · React Router · Tailwind CSS · Bootstrap · Axios · Chart.js · Leaflet · STOMP (WebSockets) · jsPDF · ExcelJS · React Hook Form

## 🚀 Instalación local

```bash
npm install
npm run dev
```

La app espera la API corriendo en `http://localhost:8081` (ver [ZITAPP-API](https://github.com/jovapg/ZITAPP-API)).

---

👤 Desarrollado por **Jovany Posada** · [GitHub](https://github.com/jovapg)
