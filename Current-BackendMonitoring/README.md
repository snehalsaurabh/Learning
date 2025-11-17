# Backend Monitoring Playground

This project is a tiny Express service instrumented with Prometheus metrics and Loki logs so we can learn how Prometheus, Grafana, and Loki fit together. The code lives in `index.js` and `heavyComputation.js`, exposing three routes: `/`, `/heavy-computation`, and `/metrics`.

- `prom-client` collects process stats plus a response-time histogram (`req_response_time_histogram`).
- `winston-loki` ships app logs (for example, when `/heavy-computation` fails).
- `heavyComputation.js` simulates variable latency and error spikes so we can see metrics and logs moving in real time.

The sections below walk through setup, how each tool is used here, and a simple Docker Compose recipe—including Promtail—for self-hosting everything.

---

## What Each Tool Does (and Why We Use It)

- **Prometheus** – Scrapes the `/metrics` endpoint every few seconds, stores numerical time-series data (latency, CPU, memory). Ideal for alerts, SLOs, trend lines.
- **Grafana** – Friendly dashboard layer; reads from Prometheus (metrics) and Loki (logs) so we can visualize and correlate everything.
- **Loki** – Stores logs. Optimized for indexed labels (like `app=loki-backend-monitoring`) rather than log content scanning, making it cheap and fast.
- **Promtail** – Lightweight agent that tails local log files/stdout and pushes them to Loki. Loki never pulls; Promtail is the shipper.

**Prometheus vs. Loki in utility**

- Prometheus answers “How many requests per second? What is p95 latency?” by scraping metrics we expose.
- Loki answers “Why did that request fail? What error message was logged?” by storing structured logs.
- Together in Grafana we can jump from a latency spike (Prometheus panel) to the exact error logs (Loki panel).

**Main use cases in this repo**

1. Monitor latency of all Express routes via the custom histogram.
2. Track heavy computation failures (random errors) via Loki logs.
3. Expose `/metrics` so Prometheus and Grafana panels refresh live.
4. Practice with real tooling before instrumenting a production service.

Outside this project, the same stack fits any containerized backend (microservices, cron jobs, workers) where we need unified observability without paying for SaaS.

---

## Prerequisites

- Docker + Docker Compose
- Node.js 18+
- `npm install`
  ```bash
  npm install express response-time prom-client winston winston-loki
  ```
- Environment variable `LOKI_HOST` pointing at our Loki endpoint (e.g., `http://localhost:3100` when running locally).

If we prefer running the app directly on our machine, start it with:
```bash
node index.js
```

For the rest of this guide we lean on Docker Compose so `docker compose up` and `docker compose down` control the entire monitoring stack.

---

## Quick Start: `docker compose up`

All config files already live in the repo so the only command we need is:
```bash
docker compose up -d
```

### What each config file does

1. `prometheus-config.yml`
   ```yaml
   global:
     scrape_interval: 5s

   scrape_configs:
     - job_name: 'prometheus-backend-monitoring'
       static_configs:
         - targets: ['10.158.13.213:3000']
   ```
   Update the target to match wherever the Express container exposes port `3000` (`backend:3000` inside Docker, `localhost:3000` from our host).

2. `loki-config.yml`
   ```yaml
   auth_enabled: false
   server:
     http_listen_port: 3100
   common:
     path: /loki
     replication_factor: 1
   schema_config:
     configs:
       - from: 2020-10-15
         store: boltdb-shipper
         object_store: filesystem
         schema: v11
   storage_config:
     boltdb_shipper:
       active_index_directory: /loki/index
       cache_location: /loki/cache
     filesystem:
       directory: /loki/chunks
   limits_config:
     retention_period: 168h
   ```
   This is the lightweight single-node Loki preset that persists data under the `loki-data` volume.

3. `promtail-config.yml`
   ```yaml
   server:
     http_listen_port: 9080
   positions:
     filename: /tmp/positions.yaml
   clients:
     - url: http://loki:3100/loki/api/v1/push
   scrape_configs:
     - job_name: container-logs
       docker_sd_configs:
         - host: unix:///var/run/docker.sock
       relabel_configs:
         - source_labels: ['__meta_docker_container_label_promtail']
           regex: true
           action: keep
         - source_labels: ['__meta_docker_container_label_app']
           target_label: app
         - source_labels: ['__meta_docker_container_name']
           target_label: container
   ```
   Promtail only forwards containers that expose the label `promtail=true`, which we add to the backend service so only our app logs reach Loki.

4. `grafana-datasource.yml`
   ```yaml
   apiVersion: 1
   datasources:
     - name: Prometheus
       type: prometheus
       url: http://prom-server:9090
       isDefault: true
     - name: Loki
       type: loki
       url: http://loki:3100
   ```
   Grafana boots with both data sources pre-wired, so we can create dashboards immediately without manual setup.

5. `docker-compose.yml`
   ```yaml
   version: "3.8"

   services:
     backend:
       image: node:18-alpine
       working_dir: /app
       command: sh -c "npm install && node index.js"
       volumes:
         - ./:/app
       environment:
         - LOKI_HOST=http://loki:3100
       ports:
         - "3000:3000"
       labels:
         promtail: "true"
         app: loki-backend-monitoring
       depends_on:
         - loki

     prom-server:
       image: prom/prometheus
       ports:
         - "9090:9090"
       volumes:
         - ./prometheus-config.yml:/etc/prometheus/prometheus.yml:ro

     loki:
       image: grafana/loki:2.9.0
       ports:
         - "3100:3100"
       volumes:
         - ./loki-config.yml:/etc/loki/config.yml:ro
         - loki-data:/loki

     grafana:
       image: grafana/grafana-oss
       ports:
         - "4000:3000"
       volumes:
         - grafana-data:/var/lib/grafana
         - ./grafana-datasource.yml:/etc/grafana/provisioning/datasources/datasource.yml:ro
       depends_on:
         - prom-server
         - loki

     promtail:
       image: grafana/promtail:2.9.0
       volumes:
         - ./promtail-config.yml:/etc/promtail/promtail-config.yml:ro
         - /var/run/docker.sock:/var/run/docker.sock
       depends_on:
         - loki

   volumes:
     loki-data:
     grafana-data:
   ```
   - The backend is the Express code from this repo. It sets `LOKI_HOST=http://loki:3100` so Winston ships structured logs directly to Loki, while Promtail captures container stdout/stderr for anything else.
   - Grafana exposes `http://localhost:4000` so it never clashes with the Express app on `http://localhost:3000`.

### Managing the stack

- Start everything: `docker compose up -d`
- Stop and clean up containers (volumes persist): `docker compose down`
- Stop and remove volumes too: `docker compose down -v`

Available URLs once the stack is running:

- App: `http://localhost:3000`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:4000` (login `admin/admin` on first run)
- Loki: query via Grafana → Explore (no standalone UI)

---

## Manual single-container setup (optional reference)

### 1. Prometheus Server

1. Create `prometheus.yml`:
   ```yaml
   global:
     scrape_interval: 4s

   scrape_configs:
     - job_name: backend-monitor
       static_configs:
         - targets: ["host.docker.internal:3000"] # replace with our Node.js host:port
   ```
2. Start Prometheus:
   ```bash
   docker run -d --name=prom-server \
     -p 9090:9090 \
     -v $(pwd)/prometheus-config.yml:/etc/prometheus/prometheus.yml \
     prom/prometheus
   ```
3. Visit `http://localhost:9090` and check the `req_response_time_histogram` metric.

### 2. Grafana

```bash
docker run -d --name=grafana \
  -p 3000:3000 \
  grafana/grafana-oss
```

1. Login at `http://localhost:3000` (default admin/admin).
2. Add Prometheus as a data source (`http://prom-server:9090` if using Docker network, or `http://localhost:9090` otherwise).
3. Optionally add Loki (after the next step) to the same Grafana instance so dashboards combine logs and metrics.

### 3. Loki Server

```bash
docker run -d --name=loki \
  -p 3100:3100 \
  -v $(pwd)/loki-config.yml:/etc/loki/config.yml \
  grafana/loki:2.9.0 -config.file=/etc/loki/config.yml
```

Set `LOKI_HOST=http://localhost:3100` before starting `node index.js`. Logs sent through Winston immediately appear in Grafana → Explore → Loki, and Promtail can also forward container logs using `promtail-config.yml`.

## Next Steps

1. Build Grafana dashboards combining Prometheus panels (latency, error rate) and Loki log panels.
2. Experiment with alerts (Prometheus alerting rules or Grafana Alerting).
3. Simulate failures by calling `/heavy-computation` until it throws; watch the log entry appear in Loki and the metrics spike.

This is a simple backend monitoring and deployement mini-project.
