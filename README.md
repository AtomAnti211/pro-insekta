# pro-insekta

indítás windows-on:

-backend:
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd backend
python manage.py migrate
python manage.py runserver

-frontend:
cd frontend
npm install
npm run dev


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

### Admin végpontok (JWT szükséges lesz) 
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

## Fejlesztés 

A projekt Django REST Frameworkre épül, Python 3.10+ ajánlott.

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
