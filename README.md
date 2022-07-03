# MWELL MD Development

- Clone the mwell-md from github [mwell-md](git@github.com:MP-mWell/mwell-md.git)
    - `git clone git@github.com:MP-mWell/mwell-md.git -b develop`

- Install dependencies
    - `npm install`

- Create a environment.ts based on environment.example.ts
    - `cp src/environments/environment.example.ts src/environments/environment.ts`

- Configure environment.ts file
```
  cas_url: '',
  cas_ver: '/api/v1',
  mpi_url: '',
  mpi_ver: '/api/v1',
  doctor_url: '',
  doctor_ver: '/api/v1',
  utilities_url: '',
  utilities_ver: '/api/v1',
  forms_url: '',
  forms_ver: '/api/v1',
  schedule_url: '',
  schedule_ver: '/api/v1',
```
- Start the application
    - `npm start`