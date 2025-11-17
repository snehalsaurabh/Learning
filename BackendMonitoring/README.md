# Backend Monitoring Playground

A simple Express service that shows how Prometheus, Grafana, and Loki work together. We're monitoring three routes: `/`, `/heavy-computation`, and `/metrics`.

## What We're Building

We're using four tools to monitor our backend:

- **Prometheus** - Collects metrics (response time, CPU, memory) every 5 seconds
- **Grafana** - Shows dashboards for both metrics and logs
- **Loki** - Stores our application logs
- **Promtail** - Automatically sends container logs to Loki

### Why Use Both Prometheus and Loki?

- **Prometheus** answers: "How many requests per second? What's the response time?"
- **Loki** answers: "What error was logged? Why did it fail?"
- **Together in Grafana**, we can see a latency spike in Prometheus and click through to the exact error log in Loki.

---

## Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

This installs: `express`, `response-time`, `prom-client`, `winston`, `winston-loki`

### Step 2: Start Everything

All configuration files are ready. We just need one command:

```bash
docker compose up -d
```

Wait 10-15 seconds for all services to start.

### Step 3: Access Our Services

Once running, we can visit:

- **Our App**: `http://localhost:3000`
- **Prometheus**: `http://localhost:9090` (see metrics)
- **Grafana**: `http://localhost:4000` (login: `admin/admin` on first run)
- **Loki**: Query through Grafana → Explore menu (no standalone UI)

### Step 4: Stop Everything

When we're done:

```bash
docker compose down
```

To also remove saved data (dashboards, logs):

```bash
docker compose down -v
```

---

## What Each Tool Does

### Prometheus

- Scrapes our `/metrics` endpoint every 5 seconds
- Stores numerical data: request counts, response times, CPU usage, memory
- Perfect for alerts and trend analysis

### Grafana

- Makes pretty charts and dashboards
- Reads from both Prometheus (metrics) and Loki (logs)
- Pre-configured to connect to both when it starts

### Loki

- Stores our logs
- Fast because it indexes by labels instead of searching log text
- Keeps logs for 7 days by default

### Promtail

- Watches our Docker containers
- Automatically sends container logs to Loki
- Only forwards logs from containers we label (our backend service)

---

## Configuration Files for Self Hosting

We have 5 config files. Here's what each does:

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

## What We're Monitoring

1. **Response times** - All Express routes are tracked with a histogram
2. **Errors** - Heavy computation failures are logged to Loki
3. **Process stats** - CPU and memory usage from `prom-client`

### Our Code

- `index.js` - Main Express server with `/metrics` endpoint
- `heavyComputation.js` - Simulates variable latency and random errors
- Uses `prom-client` to collect metrics
- Uses `winston-loki` to ship logs to Loki

---

## Running Without Docker (Optional)

If we want to run the app directly on our machine instead of in Docker:

1. Install dependencies:
```bash
npm install
```

2. Set the Loki host:
```bash
export LOKI_HOST=http://localhost:3100
```

3. Start the app:
```bash
node index.js
```

Then we'd need to run Prometheus, Loki, and Grafana separately using Docker or local installs. Using Docker Compose is much easier for this project.

---

## Next Steps

1. Create dashboards in Grafana showing metrics and logs together
2. Set up alerts in Prometheus or Grafana
3. Test error tracking - call `/heavy-computation` multiple times until it errors, then watch the logs appear in Loki

This is a simple backend monitoring mini-project for learning the observability stack.
