# 💇 Salon Appointment Booking System — Microservices Architecture

A **production-grade full-stack application** for booking salon appointments, built with a microservices architecture using Spring Boot, Keycloak, RabbitMQ, WebSocket, React, and Docker.

> 🚀 **Interview-ready project** demonstrating enterprise-level design patterns: service discovery, event-driven architecture, centralized auth, real-time notifications, and distributed data management.

---

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Microservices Breakdown](#microservices-breakdown)
- [Key Design Concepts](#key-design-concepts)
- [Authentication Flow — Keycloak + JWT](#authentication-flow--keycloak--jwt)
- [Event-Driven Flow — RabbitMQ](#event-driven-flow--rabbitmq)
- [Booking + Payment Lifecycle](#booking--payment-lifecycle)
- [Inter-Service Communication — Feign Clients](#inter-service-communication--feign-clients)
- [WebSocket Real-Time Notifications](#websocket-real-time-notifications)
- [Database Design — Polyglot Persistence](#database-design--polyglot-persistence)
- [API Reference](#api-reference)
- [Local Setup Guide](#local-setup-guide)
- [Environment Variables](#environment-variables)
- [What I Learned — Interview Talking Points](#what-i-learned--interview-talking-points)

---

## Architecture Overview

```
                        ┌─────────────────┐
                        │  React Frontend │
                        │    Port: 3000   │
                        └────────┬────────┘
                                 │ HTTP / WebSocket
                        ┌────────▼────────┐
                        │   API Gateway   │  ← JWT validation via Keycloak JWK
                        │   Port: 5000    │  ← Spring Cloud Gateway + CORS
                        │   (Eureka LB)   │
                        └────────┬────────┘
                                 │ lb:// routing
          ┌──────────────────────┼──────────────────────┐
          │           ┌──────────┼──────────┐           │
          ▼           ▼          ▼          ▼           ▼
    User Service  Salon Svc  Category   Svc Offering  Booking Svc
     Port 8081    Port 8082  Port 8083   Port 8084    Port 8085
          │                                                │
          │                              ┌────────────────┘
          ▼                              ▼
    Keycloak (8080)           Payment Service (8086)
    [External IdP]                       │
                                    ┌────┴────┐
                                    ▼         ▼
                             Razorpay/Stripe  RabbitMQ
                                         ┌───┴────┐
                                    booking-queue  notification-queue
                                         │              │
                                         ▼              ▼
                                   Booking Svc    Notification Svc (8087)
                                   [CONFIRMED]         │
                                                       ▼
                                                  WebSocket STOMP
                                                  → React Frontend
```

**Each microservice has its own MySQL database** — true data isolation following the database-per-service pattern.

---

## Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| **Spring Boot 3.x** | Microservice framework |
| **Spring Cloud Gateway** | API gateway with JWT auth |
| **Netflix Eureka** | Service registry and discovery |
| **OpenFeign** | Declarative HTTP client for inter-service calls |
| **Keycloak 26.x** | Identity provider — OAuth2 / OIDC |
| **Spring AMQP + RabbitMQ** | Asynchronous event-driven messaging |
| **WebSocket + STOMP** | Real-time push notifications |
| **MySQL** | Relational database (one per service) |
| **Razorpay SDK** | Indian payment gateway |
| **Stripe SDK** | International payment gateway |
| **Lombok** | Boilerplate reduction |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React** | UI library |
| **Redux** | Global state management |
| **TailwindCSS** | Utility-first styling |
| **Material-UI (MUI)** | Component library |
| **Formik** | Form handling and validation |

### DevOps
| Technology | Purpose |
|-----------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |

---

## Microservices Breakdown

| Service | Port | Responsibility | DB |
|---------|------|---------------|-----|
| `eureka-server` | 8070 | Service registry | — |
| `gateway-server` | 5000 | Routing, JWT validation, CORS | — |
| `user-service` | 8081 | Auth (signup/login), user profiles, Keycloak integration | `user_db` |
| `salon` | 8082 | Salon CRUD, city search, owner management | `salon_db` |
| `category` | 8083 | Service categories (haircut, facial, etc.) | `category_db` |
| `service-offering` | 8084 | Individual services with price + duration | `service_db` |
| `booking` | 8085 | Booking lifecycle, slot conflict check | `booking_db` |
| `payment` | 8086 | Payment links (Razorpay/Stripe), order tracking | `payment_db` |
| `notifications` | 8087 | Notification storage + WebSocket push | `notification_db` |
| `review` | 8088 | Reviews and ratings | `review_db` |

---

## Key Design Concepts

### 1. Database Per Service Pattern
Each microservice owns its own MySQL schema. Services never share a database directly — they communicate only via REST (Feign) or events (RabbitMQ). This ensures loose coupling and independent deployability.

### 2. API Gateway as Single Entry Point
All frontend requests hit the Gateway on port 5000. The Gateway:
- Validates JWT tokens using Keycloak's JWK endpoint (`/realms/master/protocol/openid-connect/certs`)
- Routes requests to the correct service using **Eureka load balancing** (`lb://SERVICE-NAME`)
- Handles CORS centrally (no individual service needs CORS config)

### 3. Event-Driven Architecture (Async Communication)
Payment completion triggers two asynchronous events via RabbitMQ instead of synchronous REST calls. This prevents tight coupling between Payment, Booking, and Notification services.

### 4. RBAC — Role-Based Access Control
Users are assigned either `CUSTOMER` or `SALON_OWNER` roles in Keycloak at signup. These roles are embedded in the JWT and checked at both the Gateway and service levels.

### 5. RestTemplate vs Feign Clients
- **Keycloak integration** uses `RestTemplate` (low-level HTTP) because Keycloak has a specific form-encoded OAuth2 protocol that Feign's default JSON encoder doesn't handle well.
- **Inter-service calls** (User ↔ Booking ↔ Payment etc.) use **OpenFeign** — declarative, interface-based, auto-registered via Eureka.

---

## Authentication Flow — Keycloak + JWT

### Signup Flow
```
Frontend → POST /auth/signup (email, password, role, phone)
    ↓
AuthServiceImpl
    ↓
KeycloakUserService (uses RestTemplate)
    ├── 1. Get admin access token  → POST /realms/master/protocol/openid-connect/token
    ├── 2. Create user in Keycloak → POST /admin/realms/master/users
    ├── 3. Fetch Keycloak user ID  → GET  /admin/realms/master/users?username=xxx
    └── 4. Assign role (CUSTOMER / SALON_OWNER) → POST /admin/realms/master/users/{id}/role-mappings
    ↓
Save user to local MySQL (UserRepository)
    ↓
Get JWT for new user → grant_type=password
    ↓
Return: { jwt, refresh_token, message }
```

### Login Flow
```
Frontend → POST /auth/login (email, password)
    ↓
KeycloakUserService.getAdminAccessToken(username, password, "password", null)
    ↓
Keycloak → access_token + refresh_token
    ↓
Return AuthResponse to frontend
```

### Token Refresh
```
GET /auth/access-token/refresh-token/{refreshToken}
    ↓
grant_type=refresh_token → new access_token
```

### How every subsequent request is secured
```
Frontend sends: Authorization: Bearer <jwt>
    ↓
API Gateway validates JWT using jwk-set-uri (Keycloak public keys)
    ↓
If valid → route to service with Authorization header
    ↓
Service calls UserFeignClient.getUserFromToken(jwt)
    → /realms/master/protocol/openid-connect/userinfo
    → Returns username, email, roles
```

---

## Event-Driven Flow — RabbitMQ

### Why RabbitMQ here?
When a user pays, we need to:
1. Mark the booking as `CONFIRMED`
2. Save a notification record
3. Push a real-time notification to the user's browser

Doing all three synchronously would couple Payment → Booking → Notification. If Notification Service is down, payment would fail. With RabbitMQ, Payment Service just fires-and-forgets — other services react independently.

### Queue Configuration (Payment Service)
```java
@Bean public Queue bookingQueue()      { return new Queue("booking-queue"); }
@Bean public Queue notificationQueue() { return new Queue("notification-queue"); }

// Jackson2JsonMessageConverter handles Java object ↔ JSON serialization automatically
@Bean
public RabbitTemplate rabbitTemplate(ConnectionFactory cf, Jackson2JsonMessageConverter converter) {
    RabbitTemplate rt = new RabbitTemplate(cf);
    rt.setMessageConverter(converter);
    return rt;
}
```

### Event Flow After Successful Payment
```
Payment verified as "captured" (Razorpay status)
    ↓
BookingEventProducer.sentBookingUpdateEvent(paymentOrder)
    → rabbitTemplate.convertAndSend("booking-queue", paymentOrder)
    ↓
[ASYNC] BookingEventConsumer @RabbitListener("booking-queue")
    → bookingService.bookingSucess(paymentOrder)
    → Booking status → CONFIRMED in MySQL

NotificationEventProducer.sentNotificationEvent(bookingId, userId, salonId)
    → rabbitTemplate.convertAndSend("notification-queue", notificationDTO)
    ↓
[ASYNC] NotificationEventConsumer @RabbitListener("notification-queue")
    → notificationService.createNotification(notification)
    → Saved to notification DB
    → RealTimeCommunicationService.sendNotification(notificationDTO)
    → SimpMessagingTemplate.convertAndSend("/notification/user/{userId}", dto)
    → WebSocket pushes to React frontend instantly
```

---

## Booking + Payment Lifecycle

```
1. User selects salon + services + time slot
   ↓
2. POST /api/bookings?salonId=X&paymentMethod=RAZORPAY
   Body: { serviceIds: [...], startTime: "2025-01-25T10:00:00" }
   ↓
3. Booking Service:
   ├── Feign: UserFeignClient  → validate JWT, get user details
   ├── Feign: SalonFeignClient → get salon hours
   └── Feign: ServiceOfferingFeignClient → get prices + durations
   ↓
4. Slot conflict check:
   ├── Is time within salon open hours?
   ├── Does it overlap any existing booking?
   └── If conflict → throw Exception("slot not available")
   ↓
5. Calculate:
   ├── totalPrice  = sum of all service prices
   └── endTime     = startTime + sum of all service durations (minutes)
   ↓
6. Save Booking with status = PENDING
   ↓
7. Feign: PaymentFeignClient.createPaymentLink(bookingDTO, paymentMethod)
   ↓
8. Payment Service creates Razorpay PaymentLink
   → Returns short_url to frontend
   ↓
9. User redirected to Razorpay payment page
   ↓
10. After payment → callback_url: localhost:3000/payment-success/{orderId}
    ↓
11. Frontend calls: PATCH /api/payments/proceed?paymentId=xxx&paymentLinkId=yyy
    ↓
12. Payment Service verifies via Razorpay SDK → status = "captured"
    ↓
13. Publish to RabbitMQ:
    ├── booking-queue   → Booking status: PENDING → CONFIRMED
    └── notification-queue → WebSocket push to user + salon owner
```

---

## Inter-Service Communication — Feign Clients

OpenFeign creates HTTP clients from interface definitions. Service discovery via Eureka means no hardcoded URLs.

```java
// Example: Booking Service calling User Service
@FeignClient(name = "USER", url = "${USER_SERVICE_URL:}")
public interface UserFeignClient {
    @GetMapping("/api/users/profile")
    ResponseEntity<UserDTO> getUserFromToken(@RequestHeader("Authorization") String jwt);

    @GetMapping("/api/users/{userId}")
    ResponseEntity<UserDTO> getUserById(@PathVariable Long userId);
}
```

### Feign Client Map
| Service | Calls |
|---------|-------|
| Booking | UserFeign, SalonFeign, ServiceOfferingFeign, PaymentFeign |
| Payment | UserFeign |
| Category | UserFeign, SalonFeign |
| ServiceOffering | SalonFeign, CategoryFeign |
| Notification | BookingFeign |
| Review | UserFeign, SalonFeign |

---

## WebSocket Real-Time Notifications

```java
// Notification Service — RealTimeCommunicationService.java
@Component
public class RealTimeCommunicationService {
    private final SimpMessagingTemplate simpMessagingTemplate;

    public void sendNotification(NotificationDTO notification) {
        // Push to customer
        simpMessagingTemplate.convertAndSend(
            "/notification/user/" + notification.getUserId(), notification);

        // Push to salon owner simultaneously
        simpMessagingTemplate.convertAndSend(
            "/notification/salon/" + notification.getSalonId(), notification);
    }
}
```

**React Frontend** subscribes to `/notification/user/{currentUserId}` via STOMP over WebSocket. When a booking is confirmed, both the customer and salon owner receive instant toast notifications without polling.

---

## Database Design — Polyglot Persistence

| Service | Key Entities |
|---------|-------------|
| user-service | `User` (id, email, role, fullName, phone, createdAt) |
| salon | `Salon` (id, ownerId, name, city, openTime, closeTime) |
| category | `Category` (id, salonId, name, description) |
| service-offering | `ServiceOffering` (id, salonId, categoryId, name, price, duration) |
| booking | `Booking` (id, customerId, salonId, serviceIds, startTime, endTime, totalPrice, status) |
| payment | `PaymentOrder` (id, userId, bookingId, salonId, amount, paymentMethod, paymentLinkId, status) |
| notifications | `Notification` (id, userId, salonId, bookingId, description, type, isRead) |

**Booking status lifecycle:** `PENDING` → `CONFIRMED` (after payment) → `CANCELLED` (if cancelled)

**PaymentOrder status:** `PENDING` → `SUCCESS` / `FAILED`

---

## API Reference

### Auth Endpoints (User Service)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/login` | Login with email + password |
| GET | `/auth/access-token/refresh-token/{token}` | Refresh access token |

### User Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get profile from JWT |
| GET | `/api/users/{userId}` | Get user by ID |

### Salon Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/salons` | Create salon |
| PUT | `/api/salons/{id}` | Update salon |
| GET | `/api/salons` | Get all salons |
| GET | `/api/salons/{id}` | Get salon by ID |
| GET | `/api/salons/search?city=X` | Search by city |
| GET | `/api/salons/owner` | Get owner's salon |

### Booking Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking + payment link |
| GET | `/api/bookings/customer` | Customer's bookings |
| GET | `/api/bookings/salon` | Salon's bookings |
| GET | `/api/bookings/report` | Salon revenue report |
| GET | `/api/bookings/slots/salon/{id}/date/{date}` | Booked slots by date |
| PUT | `/api/bookings/{id}/status` | Update booking status |

### Payment Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/create` | Create payment link |
| GET | `/api/payments/{orderId}` | Get payment order |
| PATCH | `/api/payments/proceed` | Process payment callback |

---

## Local Setup Guide

### Prerequisites
- Java 17+
- Node.js 18+
- Docker Desktop
- Maven
- MySQL 8.x

### Step 1 — Start Keycloak via Docker
```bash
docker run -p 8080:8080 \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:26.1.0 start-dev
```

### Step 2 — Configure Keycloak
1. Open `http://localhost:8080` → Admin Console
2. Create a new **client** → set Client ID: `salon-booking-client`
3. Enable **Client Authentication** → copy the **Client Secret**
4. Create **client roles**: `CUSTOMER` and `SALON_OWNER`
5. Create an admin user → assign `realm-admin` role
6. Update `user-service/src/main/resources/application.yml` with your `CLIENT_ID`, `CLIENT_SECRET`
7. Increase **Access Token Lifespan** under Realm Settings → Tokens (e.g. 30 minutes)

### Step 3 — Start Eureka Server
```bash
cd eurekaserver && mvn spring-boot:run
```

### Step 4 — Start All Microservices
```bash
# Start each in a separate terminal
cd user-service    && mvn spring-boot:run
cd salon           && mvn spring-boot:run
cd category        && mvn spring-boot:run
cd service-offering && mvn spring-boot:run
cd booking         && mvn spring-boot:run
cd payment         && mvn spring-boot:run
cd notifications   && mvn spring-boot:run
cd review          && mvn spring-boot:run
cd gateway-server  && mvn spring-boot:run
```

### Step 5 — Start Frontend
```bash
cd frontend
npm install
npm start
```
Frontend runs at `http://localhost:3000`

### Docker Compose (Optional)
```bash
cd docker-compose
docker-compose up -d
```

---

## Environment Variables

### user-service `application.yml`
```yaml
keycloak:
  client-id: salon-booking-client
  client-secret: <your-keycloak-client-secret>
  admin-username: admin@gmail.com
  admin-password: admin
  base-url: http://localhost:8080
```

### payment `application.yml`
```yaml
razorpay:
  api:
    key: <your-razorpay-key-id>
    secret: <your-razorpay-secret>
stripe:
  api:
    key: <your-stripe-secret-key>
```

---

## What I Learned — Interview Talking Points

### Microservices Design Decisions

**Q: Why microservices over monolith?**
Each service (Booking, Payment, Notification) can be deployed, scaled, and maintained independently. If the Notification Service goes down, bookings still work. With a monolith, a single failure could take everything down.

**Q: How do services communicate?**
Two patterns are used:
- **Synchronous (Feign)**: When we need an immediate response — e.g. Booking Service needs user details to create a booking. Uses Eureka for service discovery so no hardcoded URLs.
- **Asynchronous (RabbitMQ)**: When we don't need an immediate response — e.g. after payment success, we publish to queues. Booking Service and Notification Service react independently. This makes the system resilient.

**Q: Why Keycloak instead of building custom JWT?**
Keycloak provides battle-tested OAuth2/OIDC implementation with RBAC, token refresh, user management, and admin APIs out of the box. Building this custom would take months and introduce security vulnerabilities.

**Q: How does the Gateway validate tokens without calling User Service for every request?**
The Gateway uses Keycloak's JWK (JSON Web Key) endpoint to fetch Keycloak's public key and verifies the JWT signature locally. No network call needed per request — this is stateless validation. The config is:
```yaml
spring.security.oauth2.resource-server.jwt.jwk-set-uri: 
  http://localhost:8080/realms/master/protocol/openid-connect/certs
```

**Q: What is RestTemplate used for vs Feign?**
RestTemplate is used specifically for Keycloak communication because Keycloak's OAuth2 token endpoint uses `application/x-www-form-urlencoded` (form data), not JSON. OpenFeign's default encoder sends JSON. RestTemplate gives full control over headers and body encoding for this specific case.

**Q: How does WebSocket work here?**
The Notification Service uses Spring WebSocket with STOMP protocol. After RabbitMQ delivers an event, `SimpMessagingTemplate.convertAndSend()` pushes to topic `/notification/user/{id}`. The React frontend subscribes to this topic using the STOMP.js library. This enables true real-time push without polling.

**Q: How is slot conflict handled?**
The `isTimeSlotAvailable()` method in BookingServiceImpl fetches all existing bookings for the salon, then checks if any existing booking's time range overlaps with the requested slot using interval overlap logic:
```
overlap = (newStart < existingEnd) AND (newEnd > existingStart)
```
Also validates that the slot falls within the salon's open/close hours.

**Q: How is the SalonReport generated?**
The `getSalonReport()` method aggregates directly from the Booking table using Java streams — total earnings (sum of totalPrice), total bookings (count), cancelled bookings (filter by status), and total refunds (sum of cancelled prices). No separate analytics service needed for this scale.

---

## Project Structure

```
backend (microservices)/
├── eurekaserver/          ← Service registry (port 8070)
├── gateway-server/        ← API Gateway (port 5000)
├── user-service/          ← Auth + Keycloak (port 8081)
├── salon/                 ← Salon management (port 8082)
├── category/              ← Service categories (port 8083)
├── service-offering/      ← Pricing + services (port 8084)
├── booking/               ← Booking + slots (port 8085)
├── payment/               ← Razorpay + Stripe (port 8086)
├── notifications/         ← RabbitMQ consumer + WebSocket (port 8087)
├── review/                ← Ratings (port 8088)
└── docker-compose/        ← Docker Compose config

frontend/
├── src/
│   ├── components/        ← React components
│   ├── redux/             ← Redux store + slices
│   └── pages/             ← Route-level pages
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "feat: add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

This project is for educational purposes. Feel free to use it as a reference for your own microservices projects.

---

*Built with ❤️ using Spring Boot, Keycloak, RabbitMQ, and React.*

---

## RestTemplate vs OpenFeign — Detailed Comparison

### Why Two Different HTTP Clients?

This project uses **both** HTTP clients deliberately — each for a specific reason.

| Aspect | RestTemplate | OpenFeign |
|--------|-------------|-----------|
| Style | Imperative — you write the HTTP call manually | Declarative — just define an interface |
| Content-Type | Full control (form-urlencoded, JSON, multipart) | Defaults to JSON |
| Service discovery | Manual URL construction | Auto via Eureka (`lb://SERVICE-NAME`) |
| Used for | Keycloak Admin REST API calls | All inter-microservice calls |
| Why chosen | Keycloak token endpoint requires `application/x-www-form-urlencoded` — Feign's JSON encoder can't do this | Clean, readable, no boilerplate, auto load-balanced |

### RestTemplate — Keycloak Integration (Actual Code Pattern)
```java
// Form-encoded POST to Keycloak token endpoint
HttpHeaders headers = new HttpHeaders();
headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
body.add("client_id",     CLIENT_ID);
body.add("client_secret", CLIENT_SECRET);
body.add("grant_type",    "password");
body.add("username",      username);
body.add("password",      password);

HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
ResponseEntity<TokenResponse> response = restTemplate.exchange(TOKEN_URL, HttpMethod.POST, request, TokenResponse.class);
```

### OpenFeign — Inter-Service (Actual Code Pattern)
```java
@FeignClient(name = "USER")   // "USER" = Eureka service name
public interface UserFeignClient {
    @GetMapping("/api/users/profile")
    ResponseEntity<UserDTO> getUserFromToken(@RequestHeader("Authorization") String jwt);

    @GetMapping("/api/users/{userId}")
    ResponseEntity<UserDTO> getUserById(@PathVariable Long userId);
}
// That's it. No implementation needed. Spring generates it.
```

---

## Eureka + Gateway — Service Discovery Deep Dive

### How it Works
1. Every microservice has this in `application.yml`:
   ```yaml
   eureka:
     client:
       serviceUrl:
         defaultZone: http://localhost:8070/eureka/
   ```
2. On startup, each service **registers** itself with its name (e.g. `USER`, `BOOKING`) and IP:port
3. Gateway also registers and **fetches the registry** from Eureka
4. `lb://BOOKING` in gateway routes = "ask Eureka for BOOKING's address, then load-balance"
5. Eureka expects **heartbeats every 30s** — if a service goes silent, it's removed from registry

### Gateway Route Table (from actual `application.yml`)
```yaml
routes:
  - id: USER        uri: lb://USER        predicates: Path=/auth/**,/api/users/**
  - id: SALON       uri: lb://SALON       predicates: Path=/api/salons/**
  - id: CATEGORY    uri: lb://CATEGORY    predicates: Path=/api/categories/**
  - id: BOOKING     uri: lb://BOOKING     predicates: Path=/api/bookings/**
  - id: PAYMENT     uri: lb://PAYMENT     predicates: Path=/api/payments/**
  - id: NOTIFICATION uri: lb://NOTIFICATION predicates: Path=/api/notifications/**
  - id: REVIEW      uri: lb://REVIEW      predicates: Path=/api/reviews/**
```

### JWT Validation at Gateway (Stateless — No Extra Call Needed)
```yaml
spring:
  security:
    oauth2:
      resource-server:
        jwt:
          jwk-set-uri: http://localhost:8080/realms/master/protocol/openid-connect/certs
```
Gateway fetches Keycloak's **public key** once and caches it. Every JWT is verified locally using RSA signature — no round-trip to Keycloak per request. This is a key performance optimization.

---

## Good Engineering Concepts Used

### 1. Separation of Concerns
Each service owns a single domain boundary. Booking Service doesn't know how payment links are created — it just calls PaymentFeignClient and gets a URL back. This makes each service independently testable and deployable.

### 2. Async Over Sync for Side Effects
The booking confirmation and notification are **side effects** of payment — they don't need to happen synchronously. By pushing them to RabbitMQ queues, the payment API responds to the user immediately, and the other services process in the background. System feels faster, and failures in Notification Service don't affect payment.

### 3. Single Entry Point — API Gateway
All auth, routing, CORS, and load balancing happen at one place. Individual microservices don't need `@CrossOrigin` annotations or JWT parsing — they trust that the Gateway has already done it.

### 4. DTO Pattern
Every service exposes DTOs (Data Transfer Objects), never raw entity objects. This prevents leaking internal DB structure to consumers. Example: `BookingDTO` has `salonName` (fetched via Feign) but the `Booking` entity only has `salonId`.

### 5. Slot Conflict Check Algorithm
```
overlap exists if: newStart < existingEnd AND newEnd > existingStart
```
This classic interval overlap formula handles all edge cases — same start, same end, contained within, overlapping left, overlapping right. Additionally validates against salon open/close hours.

### 6. Dual Payment Gateway Support
Payment Service supports both **Razorpay** (India-first, UPI/cards) and **Stripe** (international cards) via the same `paymentMethod` query param. The strategy pattern allows adding more gateways without touching booking or notification logic.

### 7. Centralized CORS
CORS is configured once in Gateway:
```yaml
global-cors:
  cors-configurations:
    '[/**]':
      allowedOrigins: ["http://localhost:3000", "https://salon-booking-three.vercel.app"]
      allowedMethods: [GET, POST, PUT, DELETE, OPTIONS]
      allowedHeaders: ["*"]
      allowCredentials: true
```
`DedupeResponseHeader=Access-Control-Allow-Credentials Access-Control-Allow-Origin` filter prevents duplicate CORS headers that would otherwise break browser preflight checks.

### 8. Salon Report — Stream-Based Aggregation
```java
// No SQL aggregation query needed — computed in Java streams
Double totalEarnings = bookings.stream().mapToDouble(Booking::getTotalPrice).sum();
Long   cancelled     = bookings.stream().filter(b -> b.getStatus() == CANCELLED).count();
Double totalRefund   = cancelledBookings.stream().mapToDouble(Booking::getTotalPrice).sum();
```

---

## Salon Report Feature

`GET /api/bookings/report` returns:

| Field | How Calculated |
|-------|---------------|
| `totalEarnings` | Sum of `totalPrice` for all bookings |
| `totalBookings` | Count of all bookings |
| `cancelledBookings` | Count where `status = CANCELLED` |
| `totalRefund` | Sum of `totalPrice` for cancelled bookings |

This gives salon owners a dashboard overview of their business metrics.

---

## Deployment Notes

### Docker Compose Services
The `docker-compose/` folder orchestrates:
- All Spring Boot microservices
- MySQL (one container shared, or separate per service)
- RabbitMQ with management console
- Keycloak

### Deployed URLs (from actual Gateway config)
- Frontend prod: `https://salon-booking-three.vercel.app`
- Payment callback: `http://localhost:3000/payment-success/{orderId}`

---

*This README was generated from actual source code analysis. All code snippets are from the real implementation.*
