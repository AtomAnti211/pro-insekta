# 🐞 PRO-INSECTA – Kártevőirtó Admin Rendszer

A PRO-INSECTA egy Django + React alapú adminisztrációs rendszer, amely
ügyfelek, helyszínek, szolgáltatások, szerződések, tevékenységek és PDF-ek kezelésére készült.

A projekt Windows környezetre optimalizált, és tartalmaz egy teljesen automatizált indító fájlt.

---

## 🚀 Funkciók

- Ügyfélkezelés
- Helyszínek térképes koordináta-választással
- Szolgáltatások és tevékenységek adminisztrációja
- Szerződés generálás (PDF)
- Esedékes szerződések listázása
- Munkalapok feltöltése (PDF)
- Kapcsolatfelvételi üzenetek kezelése (Contact Messages)
- Automatikus Note generálás ContactMessage alapján
- Modern, reszponzív admin felület (React + Vite)
- Django REST API backend

---

## 📦 Szükséges szoftverek

- **Python 3.12**
- **Node.js + npm**
- **Git**
- Ajánlott: Google Chrome

---

## 📥 Telepítés

### 1. Projekt klónozása

```bash
git clone https://github.com/AtomAnti211/pro-insekta
cd pro-insekta
```

---

## ⚡ Ajánlott indítás – `start_project.bat`

A projekt tartalmaz egy automatizált indító fájlt:

```
start_project.bat
```

Ez a script automatikusan:

- létrehozza a virtuális környezetet (ha nincs)
- telepíti a Python csomagokat
- telepíti a Playwright-ot (ha szükséges)
- lefuttatja a migrációkat
- telepíti a frontend csomagokat (ha szükséges)
- külön ablakban elindítja a backend-et
- külön ablakban elindítja a frontend-et
- automatikusan megnyitja a böngészőt

### Indítás:

```bash
start_project.bat
```

### Elérhető szolgáltatások:

- Backend: http://localhost:8000  
- Frontend: http://localhost:5173  

---

## 🐳 Docker alapú indítás

A PRO‑INSECTA rendszer teljes egészében futtatható Dockerben, így nincs szükség
Pythonra, Node.js‑re vagy bármilyen helyi környezeti beállításra.  
Csak a **Docker Desktop** szükséges.

---

## 📥 1. Docker telepítése

Töltsd le és telepítsd a Docker Desktopot:

https://www.docker.com/products/docker-desktop/

Telepítés után indítsd el a Docker Desktopot, majd ellenőrizd:

```bash
docker --version
docker-compose --version
```

---

## 📦 2. Konténerek buildelése és indítása

A projekt gyökérkönyvtárában futtasd:

```bash
docker-compose up --build
```

Ez automatikusan:

- felépíti a **backend** (Python 3.12 + Django + Playwright) konténert  
- felépíti a **frontend** (Node + Vite) konténert  
- elindítja mindkettőt  
- létrehozza a szükséges volume‑okat  
- lefuttatja a migrációkat  

---

## 🌐 3. Elérhető szolgáltatások

- Backend: **http://localhost:8000**  
- Frontend: **http://localhost:5173**

A rendszer teljesen működőképes, nincs szükség semmilyen helyi Python/Node telepítésre.

---

## ▶️ 4. Automatikus indítás Windows alatt

Használhatod a mellékelt indító fájlt:

```
start_docker.bat
```

Ez:

- ellenőrzi, hogy a Docker fut‑e  
- buildeli a konténereket  
- elindítja a rendszert  
- automatikusan megnyitja a frontendet böngészőben  

---

## 🛑 5. Leállítás

A konténerek leállítása:

```bash
docker-compose down
```

---

## 🔄 6. Újraindítás (gyors)

```bash
docker-compose up -d
```

---

## ✔ Összegzés

A Dockeres indítás:

- platformfüggetlen  
- nem igényel Python 3.12‑t vagy Node‑ot  
- vizsgán is garantáltan működik  
- éles környezetben is stabil  
- egyszerűen újraindítható és hordozható  

A rendszer így bárhol futtatható, ahol Docker elérhető.

---

## 🛠 Manuális indítás (opcionális)

### 1. Backend telepítése

```bash
py -3.12 -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
```

### Playwright telepítése (csak egyszer szükséges)

```bash
playwright install chromium
```

### Django migrációk és indítás

```bash
cd backend
py manage.py makemigrations
py manage.py migrate
py manage.py runserver
```

Backend URL:  
http://localhost:8000/

---

### 2. Frontend telepítése

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:  
http://localhost:5173/

---

## 🔑 Admin felhasználó létrehozása

```bash
cd backend
py manage.py createsuperuser
```

---

## 📋 Modulok

- Notes
- Activities
- Customers
- Locations (térképes koordináta választás)
- Services
- Contracts
- Due-Contract (PDF generálás)
- Jobs (PDF feltöltés)
- Owner
- Contact Messages (kapcsolatfelvételi űrlap, automatikus Note generálás)

---

## 📁 Projektstruktúra

```
pro-insekta/
│
├── backend/
│   ├── config/              # Django projekt beállítások
│   ├── insecta/             # Fő alkalmazás
│   │   ├── models.py        # Modellek
│   │   ├── views/           # API végpontok
│   │   ├── migrations/      # Adatbázis változások
│   │   ├── static/          # Statikus fájlok
│   │   ├── templates/       # HTML sablonok (PDF)
│   │   ├── tests/           # Automatizált tesztek
│   │   ├── serializers.py   # Serializer-ek
│   │   ├── signals.py       # Automatikus folyamatok (pl. ContactMessage → Note)
│   │   └── urls.py
│   │
│   └── media/               # Feltöltött képek, PDF-ek
│
└── frontend/
    ├── public/              # Nyilvános statikus fájlok
    └── src/
        ├── App.tsx          # Fő komponens, routing
        ├── api/             # Backend API hívások
        ├── components/      # UI elemek
        ├── features/        # Modulok (customers, jobs, notes, stb.)
        ├── pages/           # Oldalak
        ├── layout/          # Oldalstruktúra
        ├── styles/          # Globális CSS
        └── types/           # TypeScript típusok

---
## 📡 Backend API végpontok (Django REST)

Az alábbi végpontok a `backend/insecta/urls.py` fájlban találhatók.

---

### 🔓 Publikus végpontok

| URL                     | Metódus           | Leírás                                       |
|-------------------------|-------------------|----------------------------------------------|
| `/activities/`          | GET, POST         | Aktivitások listázása / létrehozása          |
| `/activities/<id>/`     | GET, PUT, DELETE  | Aktivitás részletei                          |
| `/notes/`               | GET, POST         | Jegyzetek listázása / létrehozása            |
| `/notes/<id>/`          | GET, PUT, DELETE  | Jegyzet részletei                            |
| `/contact/`             | POST              | Kapcsolatfelvételi üzenet küldése            |

---

### 👤 Tulajdonos (Owner)

| URL         | Metódus  | Leírás                      |
|-------------|----------|-----------------------------|
| `/owner/`   | GET, PUT | Tulajdonosi adatok lekérése |

---

### 👥 Ügyfelek (Customers)

| URL                     | Metódus           | Leírás                                       |
|-------------------------|-------------------|----------------------------------------------|
| `/customers/`           | GET, POST         | Ügyfelek listázása / létrehozása             |
| `/customers/<id>/`      | GET, PUT, DELETE  | Ügyfél részletei                             |

---

### 📍 Helyszínek (Locations)

| URL                     | Metódus           | Leírás                                       |
|-------------------------|-------------------|----------------------------------------------|
| `/locations/`           | GET, POST         | Helyszínek listázása / létrehozása           |
| `/locations/<id>/`      | GET, PUT, DELETE  | Helyszín részletei                           |

---

### 🛠 Szolgáltatások (Services)

| URL                     | Metódus           | Leírás                                       |
|-------------------------|-------------------|----------------------------------------------|
| `/services/`            | GET, POST         | Szolgáltatások listázása / létrehozása       |
| `/services/<id>/`       | GET, PUT, DELETE  | Szolgáltatás részletei                       |

---

### 📄 Szerződések (Contracts)

| URL                           | Metódus          | Leírás                              |
|-------------------------------|------------------|-------------------------------------|
| `/contracts/`                 | GET, POST        | Szerződések listázása / létrehozása |
| `/contracts/<id>/`            | GET, PUT, DELETE | Szerződés részletei                 |
| `/contracts/due-full/`        | GET              | Esedékes szerződések teljes listája |
| `/contracts/workorder-pdf/`   | POST             | Munkalap PDF generálása             |

---

### 🧹 Munkák (Jobs)

| URL                     | Metódus           | Leírás                                       |
|-------------------------|-------------------|----------------------------------------------|
| `/jobs/`                | GET, POST         | Munkák listázása / létrehozása               |
| `/jobs/<id>/`           | GET, PUT, DELETE  | Munka részletei                              |

---

## 🧭 Frontend útvonalak (React Router)

Az alábbi útvonalak a `frontend/src/App.tsx` fájlban találhatók.

---

### 🔓 Publikus oldalak

| Útvonal             | Komponens              | Leírás                      |
|---------------------|------------------------|-----------------------------|
| `/`                 | `LandingPage`          | Nyitóoldal                  |
| `/activities/:id`   | `ActivityDetailPage`   | Aktivitás részletező        |
| `/login`            | `Login`                | Bejelentkezés               |

---

### 🔐 Admin felület (védett útvonalak)

Minden admin oldal `ProtectedRoute` alatt fut, csak bejelentkezett felhasználó érheti el.

| Útvonal                   | Komponens                | Leírás                         |
|---------------------------|--------------------------|--------------------------------|
| `/admin/dashboard`        | `Dashboard`              | Admin főoldal                  |
| `/admin/notes`            | `NotesAdminPage`         | Jegyzetek kezelése             |
| `/admin/activities`       | `ActivitiesAdminPage`    | Aktivitások kezelése           |
| `/admin/owner`            | `OwnerAdminPage`         | Tulajdonosi adatok             |
| `/admin/services`         | `ServicesAdminPage`      | Szolgáltatások                 |
| `/admin/customers`        | `CustomersAdminPage`     | Ügyfelek                       |
| `/admin/locations`        | `LocationsAdminPage`     | Helyszínek                     |
| `/admin/contracts`        | `ContractsAdminPage`     | Szerződések                    |
| `/admin/jobs`             | `JobsAdminPage`          | Munkák                         |
| `/admin/due-contracts`    | `DueContracts`           | Esedékes szerződések           |

---

## 🤖 Automatikus Note generálás (ContactMessage → Note)

A rendszer minden beérkező kapcsolatfelvételi üzenetből (`/contact/`) automatikusan létrehoz egy Note bejegyzést:

- név  
- email  
- telefon  
- üzenet  
- kapcsolódó Activity  
- időbélyeg  

Ez a funkció a `signals.py` fájlban valósul meg.

---

## 🧩 Rendszerarchitektúra – UML‑szerű modell diagram

A PRO‑INSECTA adatmodellje modulokra bontva, kapcsolatokkal:

──────────────────────────────────────────────────────────────

                   ┌──────────────────────────┐
                   │          Owner           │
                   │   (a cég adatai, 1 db)   │
                   └──────────────┬───────────┘
                                  │
                                  ▼

┌──────────────────────────┐       ┌──────────────────────────┐
│        Customer          │ 1 ─∞  │         Location         │
│ (ügyfél, kapcsolattartó) │       │ (helyszín,cím,koordináta)│
└──────────────────────────┘       └──────────────┬───────────┘
                                                  │
                                                  │ 1 helyszínhez több szerződés
                                                  ▼

                                         ┌──────────────────────────┐
                                         │         Contract         │
                                         │ (szerződés, PDF, dátumok)│
                                         └──────────────┬───────────┘
                                                        │
                                                        │ minden szerződés egy szolgáltatásra szól
                                                        ▼

                                         ┌──────────────────────────┐
                                         │         Service          │
                                         │   (szolgáltatás típusa)  │
                                         └──────────────────────────┘


──────────────────────────────────────────────────────────────

   ┌──────────────────────────┐
   │           Job            │
   │ (elvégzett munka, PDF)   │
   └──────────────┬───────────┘
                  │
                  │ minden munka egy helyszínhez és egy szolgáltatáshoz tartozik
                  ▼
            (Location + Service)


──────────────────────────────────────────────────────────────

   ┌──────────────────────────┐
   │         Activity         │
   │       (tevékenység)      │
   └──────────────┬───────────┘
                  │
                  │ több Note hivatkozhat rá
                  ▼

   ┌──────────────────────────┐
   │           Note           │
   │ (bejegyzés, feladat)     │
   └──────────────────────────┘


──────────────────────────────────────────────────────────────

   ┌──────────────────────────┐
   │     ContactMessage       │
   │(kapcsolatfelvételi űrlap)│
   └──────────────┬───────────┘
                  │
                  │ minden ContactMessage → automatikus Note generálás
                  ▼

   ┌──────────────────────────┐
   │           Note           │
   │ (automatikusan létrejön) │
   └──────────────────────────┘

──────────────────────────────────────────────────────────────

---

## ✔ A rendszer készen áll a használatra

A `start_project.bat` futtatása után a teljes rendszer automatikusan elindul,
és a böngészőben megnyílik a frontend felület.

---

## 📜 Licenc

A projekt vizsgamunkaként készült, azonban a forráskód és a dokumentáció szerzői jogvédelem alatt áll.  
A felhasználás kizárólag a szerző engedélyével történhet.