# 🐞 PRO-INSECTA – Rovarirtó Admin Rendszer

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

---

## 📁 Projektstruktúra

```
pro-insekta/
│
├── backend/        # Django backend
├── frontend/       # React + Vite frontend
├── venv/           # Python virtuális környezet
├── requirements.txt
└── start_project.bat
```

---

## ✔ A rendszer készen áll a használatra

A `start_project.bat` futtatása után a teljes rendszer automatikusan elindul,
és a böngészőben megnyílik a frontend felület.

---

## 📜 Licenc

Ez a projekt oktatási célra készült.


### Publikus végpontok 
- `GET /activities/` 
- `POST /activities/` 
- `GET /activities/<id>/` 
- `PUT /activities/<id>/` 
- `DELETE /activities/<id>/`
- `GET /notes/` 
- `POST /notes/` 
- `GET /notes/<id>/` 
- `PUT /notes/<id>/` 
- `DELETE /notes/<id>/` 

### Admin végpontok
- `GET /owner/` 
- `PUT /owner/` 
- `GET /customers/` 
- `POST /customers/` 
- `GET /customers/<id>/` 
- `PUT /customers/<id>/` 
- `DELETE /customers/<id>/` 
- `GET /locations/` 
- `POST /locations/` 
- `GET /locations/<id>/` 
- `PUT /locations/<id>/` 
- `DELETE /locations/<id>/` 
- `GET /services/` 
- `POST /services/` 
- `GET /services/<id>/` 
- `PUT /services/<id>/` 
- `DELETE /services/<id>/` 
- `GET /contracts/` 
- `POST /contracts/` 
- `GET /contracts/<id>/` 
- `PUT /contracts/<id>/` 
- `DELETE /contracts/<id>/` 
- `GET /jobs/` 
- `POST /jobs/` 
- `GET /jobs/<id>/` 
- `PUT /jobs/<id>/` 
- `DELETE /jobs/<id>/` 


                   ┌────────────────┐
                   │     Owner      │
                   │  (a cég adatai)│
                   └───────┬────────┘
                           │
                           │ 1 db van összesen
                           ▼

┌────────────────┐       ┌────────────────┐
│   Customer     │ 1---∞ │    Location    │
│ (ügyfél)       │       │ (helyszín)     │
└────────────────┘       └────────────────┘
                               │
                               │ 1 helyszínhez több szerződés
                               ▼

                       ┌────────────────┐
                       │    Contract    │
                       │ (szerződés)    │
                       └───────┬────────┘
                               │
                               │ minden szerződés egy szolgáltatásra szól
                               ▼

                       ┌────────────────┐
                       │    Service     │
                       │ (szolgáltatás) │
                       └────────────────┘


   ┌────────────────┐
   │     Job        │
   │ (elvégzett munka)
   └───────┬────────┘
           │
           │ minden munka egy helyszínhez és egy szolgáltatáshoz tartozik
           ▼
      (Location + Service)


   ┌────────────────┐
   │    Activity    │
   │ (tevékenység)  │
   └───────┬────────┘
           │
           │ több Note hivatkozhat rá
           ▼

   ┌────────────────┐
   │      Note      │
   │ (bejegyzés,    │
   │  feladat)      │
   └────────────────┘
