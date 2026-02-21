# pro-insekta

indítás windows-on:

-backend:
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd backend
python manage.py makemigrations
python manage.py migrate
python manage.py runserver

-frontend:
cd frontend
npm install
npm run dev

Mappastruktúra:
src/
  api/
    core/
      api.ts
      config.ts
    activity.ts
    note.ts
    customer.ts
    location.ts
    service.ts
    contract.ts
    job.ts
    owner.ts
    contactMessage.ts

  components/
    common/
      Button.tsx
      Input.tsx
      Select.tsx
      TextArea.tsx
      FileUpload.tsx
      Modal.tsx
      Table.tsx
      Loader.tsx
      Error.tsx
    Breadcrumb.tsx

  layout/
    Layout.tsx
    Sidebar.tsx
    Topbar.tsx

  features/
    activities/
      ActivitiesPage.tsx
      ActivityForm.tsx
      useActivities.ts
    notes/
      NotesPage.tsx
      NoteForm.tsx
      useNotes.ts
    customers/
      CustomersPage.tsx
      CustomerForm.tsx
      useCustomers.ts
    locations/
      LocationsPage.tsx
      LocationForm.tsx
      useLocations.ts
    services/
      ServicesPage.tsx
      ServiceForm.tsx
      useServices.ts
    contracts/
      ContractsPage.tsx
      ContractForm.tsx
      useContracts.ts
    jobs/
      JobsPage.tsx
      JobForm.tsx
      useJobs.ts
    owner/
      OwnerPage.tsx
      OwnerForm.tsx
      useOwner.ts
    contactMessages/
      ContactMessagesPage.tsx
      useContactMessages.ts

  pages/
    Dashboard.tsx
    LandingPage.tsx

  types/
    activity.ts
    note.ts
    customer.ts
    location.ts
    service.ts
    contract.ts
    job.ts
    owner.ts
    contactMessage.ts

  router/
    AppRouter.tsx

  App.tsx
  main.tsx


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
