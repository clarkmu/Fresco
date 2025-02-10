## Application usage

### Updating from parent

one time: git remote add upstream https://github.com/clarkmu/Fresco.git

git fetch upstream
git merge upstream/main
deal with any merge issues

### Database Schema

/prisma/schema.prisma

### Connection string

Deployments -> Fresco -> Environment


## Setup

### Building image

Run these commands on your machine:

docker build -t fresco-frontend .

docker tag fresco-frontend openshift.route/fresco-frontend
docker push openshift.route/fresco-frontend

### OpenShift create deployement

create a PostgreSQL pod to connect to

add env -
    POSTGRES_PRISMA_URL
    POSTGRES_URL_NON_POOLING
    PUBLIC_URL

once created, run "npx prisma migrate" from the pod terminal and install Prisma.
Then manually run:
"node setup-database.js"
"node initialize.js"

Everything should be running.

### Dockerfile changes explanation

convert user:group nextjs:nodejs to 1001:0

create and grant access to /.npm for Prisma cache