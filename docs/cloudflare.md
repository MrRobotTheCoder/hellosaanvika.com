# Cloudflare Tunnel Setup – hellosaanvika.com

This document explains how Cloudflare Tunnel is used in this project,
why HTTP 530 errors can occur, and how to safely add new subdomains.

---

## Architecture Overview

Traffic flow:

Browser  
→ Cloudflare Edge  
→ Cloudflare Tunnel (cloudflared)  
→ ingress-nginx (TLS termination)  
→ Kubernetes Service  
→ Pod

TLS terminates at **ingress-nginx** using a Cloudflare Origin Certificate.

---

## Tunnel Design

- A single Cloudflare Tunnel is used
- Multiple hostnames (prod, dev, future envs) are routed through it
- Host-based routing happens inside Kubernetes ingress

Tunnel ID: 9f662269-8d8d-4b42-88f6-f6d851a9fbd7

---

## Why HTTP 530 Happens

HTTP 530 means **Cloudflare blocked the request before it reached Kubernetes**.

Common causes:
1. DNS does not point to the tunnel
2. Hostname is not registered with the tunnel
3. Hostname points to another hostname instead of the tunnel

Important rule:

> **Every hostname must CNAME directly to `<tunnel-id>.cfargotunnel.com`**

Chained CNAMEs (e.g. dev → hellosaanvika.com) will fail.

---

## Correct DNS Pattern (Required)

For every hostname:

<name>.hellosaanvika.com
→ <tunnel-id>.cfargotunnel.com

Proxy must be **ON** (orange cloud).

---

## Registering a New Subdomain

Example: `xyz.hellosaanvika.com`

### 1. Add DNS record

xyz → <tunnel-id>.cfargotunnel.com

### 2. Register hostname with tunnel

Run from a machine authenticated with Cloudflare:

cloudflared tunnel route dns \
  9f662269-8d8d-4b42-88f6-f6d851a9fbd7 \
  xyz.hellosaanvika.com

## Add Kubernetes ingress rule

Ingress will route based on spec.rules.host.

## cloudflared Configuration

Tunnel routing configuration is stored in: cloudflare/config.yaml
This file is mounted into the cloudflared pod via ConfigMap.

