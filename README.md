<div align="center">
  <img width="40%" src="https://github.com/user-attachments/assets/1bafc92c-9190-42aa-8f26-f2cb64301911" alt="logo"/>
</div>

Discover a vibrant, ever-evolving movie database that invites you to explore an extensive collection of films—whether they're timeless classics, currently screening hits, or highly anticipated future releases. Dive deep into each movie’s details, and curate your own personal watchlist to effortlessly track and organize your cinematic journey.

## 🛠️ Tech Stack

<div align="center">
  <h3>Backend Powerhouse</h3>
  <img src="https://go-skill-icons.vercel.app/api/icons?i=py,fastapi,postgres,redis,prometheus,grafana&theme=light" />

  <h3>Frontend Magic</h3>
  <img src="https://go-skill-icons.vercel.app/api/icons?i=vite,react,tailwind&theme=light" />

  <h3>DevOps Arsenal</h3>
  <img src="https://go-skill-icons.vercel.app/api/icons?i=docker,k8s,helm&theme=light" />

</div>

## 🏗️ Architecture

![architecture](https://github.com/user-attachments/assets/6df6de09-2d09-4d17-bb16-6dcb23b6a2e6)

## 🌟 Key Features

### 💡 Movie Discovery

- Browse extensive movie collections
- Search functionality with real-time results
- Genre-based filtering
- Detailed movie information with recommendations
- Integration with The MovieDB API

### 🅯 User Experience

- Secure token-based authentication
- Personal watchlist management
- Favorite movies feature
- Track watched/unwatched movies
- Progress tracking for your movie journey

### 🧑‍🔧 Technical Excellence

- Redis caching layer for optimal performance
- Prometheus metrics integration
- Custom middleware for logging and monitoring
- Fully containerized architecture
- Production-grade Kubernetes deployment

## 🧱 Application Structure

The application is divided into three main services:

### 🅯 User Service

- Handles authentication and user management
- Token-based security implementation

### 🎦 Content Service

- Movie data management
- Integration with The MovieDB API
- Redis-backed caching layer
- Search and filtering capabilities
- Favorites management

### 🔂 Watchlist Service

- Personal watchlist management
- Progress tracking

Application also contains custom middlewares for Request/response logging and Prometheus Metric collection.

## ⚙️ Kubernetes Infrastructure

The infrastructure is organized into three namespaces:

### 📕 App Namespace (app)

- Backend application deployment
- PostgreSQL database
- Associated ConfigMaps and Secrets
- Persistent volume configurations
- Service definitions

### ⚡️ Cache Namespace (cache)

- Redis deployment
- Cache-specific configurations
- Associated services

### 📊 Monitoring Namespace (monitoring)

- Prometheus deployment
- Grafana setup
- Monitoring configurations

### Key Infrastructure Components

- Nginx Ingress Controller for traffic routing
- Helm charts for service management
- Persistent volumes for data storage
- Service mesh for inter-service communication

## Demo 👀

[![](https://github.com/user-attachments/assets/1bc2c08b-d67e-4ff5-93b3-82bf52c7498e)](https://ja3-projects.s3.ap-south-1.amazonaws.com/watcher.mp4)

## 🚀 Getting Started

### 🔴 Prerequisites

- [Docker](https://docs.docker.com/get-started/get-docker/)
- [Minikube](https://minikube.sigs.k8s.io/docs/start/)
- [Kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)
- [Helm](https://helm.sh/docs/intro/install/)
- [Node.js](https://nodejs.org/en/download)
- [TheMovieDB Credentials](https://developer.themoviedb.org/docs/getting-started)

### 🚧 Local Development Setup

1. Clone the project repository to your local machine.
2. Backend
   - Start docker and bootup minikube: `minikube start --cni=calico`
   - Enable ingress service on minikube: `minikube addons enable ingress`
   - Deploy with helm: `helm install watcher src/k8s`
   - Access the services by running: `kubectl port-forward -n ingress-nginx services/ingress-nginx-controller 8080:80`
3. Frontend
   - Navigate to the frontend folder.
   - Install libraries: `npm install`.
   - Run the frontend app: `npm run dev`

### 🗝️ Key Endpoints

- Frontend App: http://localhost:5173/
- API docs: http://127.0.0.1:8080/docs/
- Raw Metrics: http://127.0.0.1:8080/metrics/
- Prometheus: http://127.0.0.1:8080/prometheus/
- Grafana: http://127.0.0.1:8080/grafana/

### 📝 Notes

- Once you retrieve TheMovieDB API credentials, please update the `secrets.yaml` file located under `src/k8s/templates/app` and add the access token for the `MOVIE_DB_ACCESS_TOKEN` variable.

- The grafana login credentials are:

  - **username:** admin
  - **password:** 1234

  Please update the credentials in `secrets.yaml` the file, which is located under `src/k8s/templates/monitoring` If you want to change it and set it to something else.

- Use http://watcher-prometheus/prometheus as the Prometheus URL. When you add Prometheus as a data source in Grafana (please refer to the demo video 🙂).

---

Built with ❤️ for learning Kubernetes and modern DevOps practices.
