# 💇 Salon Appointment Booking System
## Microservices Architecture — Complete Documentation

> **Interview-Ready Project** | Spring Boot · Keycloak · RabbitMQ · WebSocket · React · Docker · Razorpay

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture Overview](#architecture-overview)
3. [Tech Stack](#tech-stack)
4. [Microservices Breakdown](#microservices-breakdown)
5. [Authentication Flow — Keycloak + JWT](#authentication-flow--keycloak--jwt)
6. [API Gateway & CORS](#api-gateway--cors)
7. [Feign Client — Sync Communication](#feign-client--sync-communication)
8. [RabbitMQ — Async Communication](#rabbitmq--async-communication)
9. [Booking + Payment Lifecycle](#booking--payment-lifecycle)
10. [WebSocket Real-Time Notifications](#websocket-real-time-notifications)
11. [Email / Notification Flow](#email--notification-flow)
12. [Complete API Reference](#complete-api-reference)
13. [Database Design](#database-design)
14. [Local Setup Guide (Step by Step)](#local-setup-guide-step-by-step)
15. [Environment Variables](#environment-variables)
16. [Interview Talking Points](#interview-talking-points)

---

## Project Overview

A **production-grade full-stack Salon Appointment Booking system** built with **Microservices Architecture**. Users can browse salons, pick services, book time slots, and pay via Razorpay/Stripe — all in real time.

```
Key Features:
✅ User registration + login via Keycloak (OAuth2 / OIDC)
✅ Salon & service management for salon owners
✅ Real-time slot conflict detection
✅ Razorpay + Stripe payment gateway
✅ Asynchronous booking confirmation via RabbitMQ
✅ Real-time WebSocket push notifications (STOMP)
✅ Role-based access: CUSTOMER vs SALON_OWNER
✅ Centralized JWT auth via API Gateway
✅ Database-per-service isolation
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     REACT FRONTEND (Port 3000)                  │
│          Redux · TailwindCSS · MUI · Formik · STOMP.js          │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP REST + WebSocket (WS)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│               API GATEWAY — Spring Cloud Gateway (Port 5000)    │
│  • JWT validation via Keycloak JWK (stateless, no DB call)      │
│  • CORS config (central — services have NO @CrossOrigin)        │
│  • Load balancing via Eureka (lb://SERVICE-NAME)                │
│  • Routes all /auth/**, /api/** to correct microservice         │
└──────┬─────────┬──────────┬──────────┬──────────┬──────────────┘
       │         │          │          │          │
       ▼         ▼          ▼          ▼          ▼
  ┌─────────┐ ┌───────┐ ┌────────┐ ┌───────┐ ┌─────────┐
  │  User   │ │ Salon │ │Category│ │Service│ │ Booking │
  │  :8081  │ │ :8082 │ │  :8083 │ │Offr.  │ │  :8085  │
  │user_db  │ │salon_db│ │cat_db │ │:8084  │ │book_db  │
  └────┬────┘ └───────┘ └────────┘ │svc_db │ └────┬────┘
       │                            └───────┘      │
       ▼                                           ▼
  ┌─────────┐                              ┌──────────────┐
  │Keycloak │                              │   Payment    │
  │  :8080  │◄─── Admin REST API ──────── │    :8086     │
  │  (IdP)  │     (RestTemplate)           │  payment_db  │
  └─────────┘                              └──────┬───────┘
                                                  │
                                    ┌─────────────┼──────────────┐
                                    ▼             ▼              ▼
                               Razorpay        Stripe      RabbitMQ
                                (India)     (International)  :5672
                                                        ┌────┴─────┐
                                                   booking-    notif-
                                                    queue       queue
                                                        │         │
                                                        ▼         ▼
                                                   Booking    Notification
                                                   Service     Service
                                                  (CONFIRM)    :8087
                                                              notif_db
                                                                  │
                                                                  ▼
                                                         WebSocket STOMP
                                                       /notification/user/{id}
                                                       /notification/salon/{id}
                                                                  │
                                                                  ▼
                                                       React Frontend
                                                     (Toast notification)
```

**Eureka Server (Port 8070)** — Service registry. Every microservice registers here. Gateway uses `lb://` prefix for load-balanced routing.

---

## Tech Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Spring Boot** | 3.x | Core microservice framework |
| **Spring Cloud Gateway** | Latest | API gateway, JWT auth, CORS, routing |
| **Netflix Eureka** | Latest | Service registry & discovery |
| **OpenFeign** | Latest | Sync inter-service HTTP calls (declarative) |
| **Keycloak** | 26.x | Identity provider — OAuth2 / OIDC / RBAC |
| **Spring AMQP + RabbitMQ** | Latest | Async event-driven messaging |
| **Spring WebSocket + STOMP** | Latest | Real-time push notifications |
| **MySQL** | 8.x | Relational DB (one per service) |
| **Razorpay SDK** | Latest | Indian payment gateway |
| **Stripe SDK** | Latest | International payment gateway |
| **RestTemplate** | Spring | HTTP client for Keycloak admin API calls |
| **Lombok** | Latest | Boilerplate reduction |

### Frontend

| Technology | Purpose |
|---|---|
| **React** | UI library |
| **Redux** | Global state management |
| **TailwindCSS** | Utility-first styling |
| **Material-UI (MUI)** | Pre-built UI components |
| **Formik** | Form handling & validation |
| **STOMP.js** | WebSocket client for real-time notifications |

### DevOps

| Technology | Purpose |
|---|---|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |

---

## Microservices Breakdown

| Service | Port | DB | Responsibility |
|---|---|---|---|
| `eureka-server` | **8070** | — | Service registry. All services register here. |
| `gateway-server` | **5000** | — | Single entry point. JWT auth, CORS, routing, load balancing. |
| `user-service` | **8081** | `user_db` | Signup, login, token refresh. Keycloak integration via RestTemplate. |
| `salon` | **8082** | `salon_db` | Salon CRUD, city search, owner management. |
| `category` | **8083** | `category_db` | Service categories (haircut, facial, spa, etc.) |
| `service-offering` | **8084** | `service_db` | Individual services — name, price, duration. |
| `booking` | **8085** | `booking_db` | Booking creation, slot conflict check, status lifecycle. |
| `payment` | **8086** | `payment_db` | Razorpay + Stripe payment link creation and verification. |
| `notifications` | **8087** | `notif_db` | RabbitMQ consumer → saves notification → WebSocket push. |
| `review` | **8088** | `review_db` | Ratings and reviews for salons. |

---

## Authentication Flow — Keycloak + JWT

### What is Keycloak?
Keycloak is an open-source Identity Provider (IdP). It manages users, passwords, roles, and tokens. We don't build JWT logic manually — Keycloak handles it using OAuth2/OIDC standard.

### Signup Flow

```
User fills signup form (name, email, password, role: CUSTOMER/SALON_OWNER)
                            │
                            ▼
              POST /auth/signup  →  User Service (port 8081)
                            │
                            ▼
              AuthServiceImpl.register()
                            │
                 ┌──────────▼──────────┐
                 │  KeycloakUserService │  (uses RestTemplate — form-urlencoded)
                 │                     │
                 │  Step 1: Get admin   │
                 │  token from Keycloak │──► POST /realms/master/protocol/
                 │                     │        openid-connect/token
                 │                     │    grant_type=client_credentials
                 │  Step 2: Create user │──► POST /admin/realms/master/users
                 │  in Keycloak         │    {username, email, password}
                 │                     │
                 │  Step 3: Get the     │──► GET /admin/realms/master/users
                 │  new user's KC ID   │       ?username=xxx
                 │                     │
                 │  Step 4: Assign role │──► POST /admin/realms/master/users/
                 │  CUSTOMER or        │        {id}/role-mappings/clients/{id}
                 │  SALON_OWNER        │
                 └──────────┬──────────┘
                            │
                            ▼
              Save user in local MySQL (user_db)
                            │
                            ▼
              Get JWT for new user:
              POST /token  grant_type=password
                            │
                            ▼
              Return: { jwt, refresh_token } → Frontend
```

### Login Flow

```
User enters email + password
              │
              ▼
POST /auth/login → User Service
              │
              ▼
KeycloakUserService.getToken(email, password, "password")
              │
              ▼  (RestTemplate — form-urlencoded POST)
Keycloak Token Endpoint:
POST /realms/master/protocol/openid-connect/token
Body: client_id, client_secret, grant_type=password, username, password
              │
              ▼
Keycloak returns: { access_token, refresh_token, expires_in }
              │
              ▼
User Service returns AuthResponse to Frontend
```

### Token Refresh Flow

```
GET /auth/access-token/refresh-token/{refreshToken}
              │
              ▼
POST /token  grant_type=refresh_token, refresh_token=xxx
              │
              ▼
New access_token returned
```

### How Every API Request Is Secured

```
Frontend sends:  Authorization: Bearer <access_token>
                             │
                             ▼
              API Gateway (port 5000)
              Validates JWT using Keycloak's public key:
              jwk-set-uri: /realms/master/protocol/openid-connect/certs
              (No call to Keycloak per request — public key is cached!)
                             │
              ┌──── Valid ───┤
              │              │
              ▼              ▼
     Route to service    Reject 401
              │
              ▼
Service receives request WITH Authorization header
Service calls: UserFeignClient.getUserFromToken(jwt)
  → GET /api/users/profile  (User Service)
  → User Service calls: /realms/master/protocol/openid-connect/userinfo
  → Returns: { username, email, roles }
              │
              ▼
Service uses user details for business logic
```

**Why RestTemplate for Keycloak and NOT Feign?**

Keycloak token endpoints require `Content-Type: application/x-www-form-urlencoded`. OpenFeign's default encoder sends JSON. RestTemplate allows explicit control of content-type headers, which is required here.

```java
// RestTemplate — Keycloak call pattern
HttpHeaders headers = new HttpHeaders();
headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
body.add("client_id",     CLIENT_ID);
body.add("client_secret", CLIENT_SECRET);
body.add("grant_type",    "password");
body.add("username",      username);
body.add("password",      password);

HttpEntity<MultiValueMap<String, String>> req = new HttpEntity<>(body, headers);
ResponseEntity<TokenResponse> response =
    restTemplate.exchange(TOKEN_URL, HttpMethod.POST, req, TokenResponse.class);
```

---

## API Gateway & CORS

### Gateway Role

The API Gateway (port 5000) is the **single entry point** for all frontend requests. It does 3 things:

1. **JWT Validation** — verifies token signature using Keycloak's JWK set (stateless, no DB call)
2. **Routing** — maps URL paths to microservices using Eureka service names
3. **CORS** — one central config; individual services have zero CORS annotation

### Route Table

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: USER
          uri: lb://USER
          predicates:
            - Path=/auth/**, /api/users/**

        - id: SALON
          uri: lb://SALON
          predicates:
            - Path=/api/salons/**

        - id: CATEGORY
          uri: lb://CATEGORY
          predicates:
            - Path=/api/categories/**

        - id: SERVICE_OFFERING
          uri: lb://SERVICE-OFFERING
          predicates:
            - Path=/api/service-offering/**

        - id: BOOKING
          uri: lb://BOOKING
          predicates:
            - Path=/api/bookings/**

        - id: PAYMENT
          uri: lb://PAYMENT
          predicates:
            - Path=/api/payments/**

        - id: NOTIFICATION
          uri: lb://NOTIFICATION
          predicates:
            - Path=/api/notifications/**

        - id: REVIEW
          uri: lb://REVIEW
          predicates:
            - Path=/api/reviews/**
```

### JWT Validation Config

```yaml
spring:
  security:
    oauth2:
      resource-server:
        jwt:
          jwk-set-uri: http://localhost:8080/realms/master/protocol/openid-connect/certs
```

Gateway fetches Keycloak's RSA **public key once** and caches it. Every JWT is verified **locally** — no round-trip to Keycloak per request. Key performance advantage.

### CORS Configuration

```yaml
spring:
  cloud:
    gateway:
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOrigins:
              - "http://localhost:3000"
              - "https://salon-booking-three.vercel.app"
            allowedMethods: [GET, POST, PUT, DELETE, PATCH, OPTIONS]
            allowedHeaders: ["*"]
            allowCredentials: true
```

`DedupeResponseHeader=Access-Control-Allow-Credentials Access-Control-Allow-Origin` filter prevents duplicate CORS headers that break browser preflight.

### Eureka — Service Discovery

```
Every service registers at startup:
  eureka.client.serviceUrl.defaultZone=http://localhost:8070/eureka/

Gateway uses: uri: lb://BOOKING
  → Asks Eureka: "Where is BOOKING running?"
  → Eureka returns: 192.168.1.x:8085
  → Gateway routes request there

Heartbeat every 30 seconds.
If a service stops → removed from registry after timeout.
```

---

## Feign Client — Sync Communication

**OpenFeign** = Declarative HTTP client. You write just an interface — Spring generates the implementation automatically.

```java
// Booking Service calling User Service
@FeignClient(name = "USER", url = "${USER_SERVICE_URL:}")
public interface UserFeignClient {

    @GetMapping("/api/users/profile")
    ResponseEntity<UserDTO> getUserFromToken(
        @RequestHeader("Authorization") String jwt);

    @GetMapping("/api/users/{userId}")
    ResponseEntity<UserDTO> getUserById(@PathVariable Long userId);
}

// Usage in BookingServiceImpl:
UserDTO user = userFeignClient.getUserFromToken(jwt).getBody();
```

No URL hardcoding. `lb://USER` means Eureka finds the User Service automatically, even if its IP changes.

### Feign Client Dependency Map

```
┌──────────────────────────────────────────────────────────┐
│                    FEIGN CLIENT CALLS                    │
├──────────────────┬───────────────────────────────────────┤
│  Service         │  Calls via Feign                      │
├──────────────────┼───────────────────────────────────────┤
│  Booking         │  UserFeign, SalonFeign,               │
│                  │  ServiceOfferingFeign, PaymentFeign   │
├──────────────────┼───────────────────────────────────────┤
│  Payment         │  UserFeign                            │
├──────────────────┼───────────────────────────────────────┤
│  Category        │  UserFeign, SalonFeign                │
├──────────────────┼───────────────────────────────────────┤
│  ServiceOffering │  SalonFeign, CategoryFeign            │
├──────────────────┼───────────────────────────────────────┤
│  Notification    │  BookingFeign                         │
├──────────────────┼───────────────────────────────────────┤
│  Review          │  UserFeign, SalonFeign                │
├──────────────────┼───────────────────────────────────────┤
│  Salon           │  UserFeign                            │
└──────────────────┴───────────────────────────────────────┘

When to use Feign (Sync):
✅ Immediate response needed
✅ Request cannot proceed without the data
Example: Booking needs user details before saving

When NOT to use Feign (use RabbitMQ instead):
❌ Side effects (notifications, confirmations)
❌ Failure in downstream shouldn't fail current request
```

---

## RabbitMQ — Async Communication

### Why RabbitMQ?

After payment is done, we need to:
1. Mark booking as `CONFIRMED`
2. Save a notification record
3. Push WebSocket notification to user & salon owner

Doing all 3 synchronously via Feign would mean: if Notification Service is down → payment API fails. With RabbitMQ, Payment Service **fires-and-forgets** — other services react independently in the background.

### Queue Configuration (Payment Service)

```java
@Configuration
public class RabbitMQConfig {

    @Bean
    public Queue bookingQueue() {
        return new Queue("booking-queue");
    }

    @Bean
    public Queue notificationQueue() {
        return new Queue("notification-queue");
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
        // Handles Java Object ↔ JSON automatically
    }

    @Bean
    public RabbitTemplate rabbitTemplate(
            ConnectionFactory cf,
            Jackson2JsonMessageConverter converter) {
        RabbitTemplate rt = new RabbitTemplate(cf);
        rt.setMessageConverter(converter);
        return rt;
    }
}
```

### Event Flow After Successful Payment

```
Razorpay confirms payment: status = "captured"
                │
                ▼
Payment Service — PaymentServiceImpl.proceedPayment()
                │
        ┌───────┴────────┐
        │                │
        ▼                ▼
BookingEventProducer  NotificationEventProducer
        │                │
        ▼                ▼
rabbitTemplate          rabbitTemplate
.convertAndSend(        .convertAndSend(
  "booking-queue",        "notification-queue",
  paymentOrder)           notificationDTO)
        │                │
   [ASYNC]           [ASYNC]
        │                │
        ▼                ▼
BookingEvent         NotificationEvent
Consumer             Consumer
@RabbitListener      @RabbitListener
("booking-queue")    ("notification-queue")
        │                │
        ▼                ▼
bookingService       notificationService
.bookingSuccess()    .createNotification()
        │                │
        ▼                ▼
Booking status       Save to notif_db
PENDING→CONFIRMED         │
                          ▼
                RealTimeCommunicationService
                .sendNotification(dto)
                          │
                 ┌────────┴────────┐
                 ▼                 ▼
       SimpMessagingTemplate  SimpMessagingTemplate
       .convertAndSend(       .convertAndSend(
         "/notification/       "/notification/
          user/{userId}",       salon/{salonId}",
          dto)                  dto)
                 │                 │
                 ▼                 ▼
          Customer sees        Salon owner sees
          "Booking Confirmed"  "New booking!"
          toast notification   toast notification
```

### Sync vs Async Summary

| Communication | Technology | When | Example |
|---|---|---|---|
| **Synchronous** | OpenFeign | Need immediate response | Get user details, get salon info |
| **Asynchronous** | RabbitMQ | Side effects, decoupled | Booking confirmed, send notification |

---

## Booking + Payment Lifecycle

### Complete Flow (Step by Step)

```
STEP 1:
User selects: Salon + Services + Date + Time slot

STEP 2:
POST /api/bookings?salonId=5&paymentMethod=RAZORPAY
Authorization: Bearer <jwt>
Body: {
  serviceIds: [1, 3, 7],
  startTime: "2025-06-15T10:00:00"
}

STEP 3:
Booking Service — BookingServiceImpl.createBooking()
  │
  ├── UserFeignClient.getUserFromToken(jwt)
  │     → Get user details (id, name, email)
  │
  ├── SalonFeignClient.getSalonById(salonId)
  │     → Get salon (openTime, closeTime, name)
  │
  └── ServiceOfferingFeignClient.getServicesByIds(serviceIds)
        → Get each service (name, price, durationMinutes)

STEP 4: SLOT CONFLICT CHECK
  isWithinSalonHours = startTime >= salon.openTime
                    && endTime   <= salon.closeTime

  endTime = startTime + sum(all service durations in minutes)

  For every existing booking in that salon on that date:
    overlap = (newStart < existingEnd) AND (newEnd > existingStart)
    if overlap → throw Exception("Slot not available")

STEP 5: CALCULATE TOTALS
  totalPrice = sum of all service prices
  endTime    = startTime + total duration

STEP 6:
Save Booking entity:
  status    = PENDING
  customerId = user.id
  salonId   = salon.id
  serviceIds = [1,3,7]
  startTime, endTime, totalPrice

STEP 7:
PaymentFeignClient.createPaymentLink(bookingDTO, "RAZORPAY")

STEP 8:
Payment Service — PaymentServiceImpl.createPaymentLink()
  Creates Razorpay PaymentLink:
  {
    amount: totalPrice * 100,  ← Razorpay takes paise
    currency: "INR",
    description: "Salon Booking #bookingId",
    callback_url: "http://localhost:3000/payment-success/{orderId}",
    callback_method: "get"
  }
  Returns: { short_url: "https://rzp.io/l/abc123" }

STEP 9:
Booking Service returns PaymentLinkResponse to Frontend
Frontend redirects user to Razorpay payment page

STEP 10:
User completes payment on Razorpay
Razorpay redirects to: localhost:3000/payment-success/{orderId}
  with params: ?razorpay_payment_id=xxx&razorpay_payment_link_id=yyy

STEP 11:
Frontend calls:
PATCH /api/payments/proceed?paymentId=xxx&paymentLinkId=yyy

STEP 12:
Payment Service verifies via Razorpay SDK:
  paymentLinkPayment.get(paymentLinkId)
  → status == "captured"  → SUCCESS
  → else                  → FAILED

STEP 13 (if SUCCESS):
Publish to RabbitMQ:
  booking-queue      → BookingEventConsumer → status CONFIRMED
  notification-queue → NotificationEventConsumer → WebSocket push
```

### Booking Status Lifecycle

```
  [Create Booking]
        │
        ▼
    PENDING ─── Payment failed ──► FAILED
        │
        │ Payment success (RabbitMQ event)
        ▼
  CONFIRMED ─── User/Salon cancels ──► CANCELLED
```

---

## WebSocket Real-Time Notifications

### How WebSocket Works in This Project

```
Server Side (Notification Service):

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/notification");
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}

// Push notification to user
@Component
public class RealTimeCommunicationService {
    private final SimpMessagingTemplate messagingTemplate;

    public void sendNotification(NotificationDTO notification) {
        // Push to customer
        messagingTemplate.convertAndSend(
            "/notification/user/" + notification.getUserId(),
            notification);

        // Push to salon owner simultaneously
        messagingTemplate.convertAndSend(
            "/notification/salon/" + notification.getSalonId(),
            notification);
    }
}
```

```
Client Side (React — STOMP.js):

const client = new Client({
  brokerURL: 'ws://localhost:5000/ws',
});

client.onConnect = () => {
  // Subscribe to personal notification channel
  client.subscribe(
    `/notification/user/${currentUserId}`,
    (message) => {
      const notification = JSON.parse(message.body);
      showToast(notification.message);  // Real-time toast!
    }
  );
};

client.activate();
```

**Full notification flow:**
Payment captured → RabbitMQ `notification-queue` → Notification Service consumer → save to DB → `SimpMessagingTemplate.convertAndSend()` → STOMP topic → React browser gets toast instantly.

---

## Email / Notification Flow

```
Notification Types:
  - BOOKING_CONFIRMED  → Customer + Salon Owner
  - BOOKING_CANCELLED  → Customer + Salon Owner
  - PAYMENT_SUCCESS    → Customer

Flow:
Payment Service
  │
  ▼  (via RabbitMQ notification-queue)
Notification Service Consumer
  │
  ├── Save Notification to notification_db
  │   {userId, salonId, bookingId, type, description, isRead=false}
  │
  └── RealTimeCommunicationService.sendNotification()
        │
        ├── WebSocket → /notification/user/{userId}   (Customer)
        └── WebSocket → /notification/salon/{salonId} (Salon Owner)

Frontend:
  - Shows toast popup instantly
  - Notification bell count increments
  - GET /api/notifications → fetch all notifications
  - PUT /api/notifications/{id}/read → mark as read
```

---

## Complete API Reference

### 🔐 Auth Endpoints (User Service — Port 8081)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/signup` | None | Register new user (creates in Keycloak + local DB) |
| `POST` | `/auth/login` | None | Login → returns JWT + refresh token |
| `GET` | `/auth/access-token/refresh-token/{refreshToken}` | None | Get new access token using refresh token |

**POST /auth/signup — Request Body:**
```json
{
  "fullName": "Rahul Sharma",
  "email": "rahul@gmail.com",
  "password": "secret123",
  "phone": "9876543210",
  "role": "CUSTOMER"
}
```
**Response:**
```json
{
  "message": "User created successfully.",
  "jwt": "eyJhbGciOiJSUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1..."
}
```

---

### 👤 User Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/users/profile` | JWT | Get profile from JWT token |
| `GET` | `/api/users/{userId}` | JWT | Get user by ID |

---

### 💇 Salon Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/salons` | JWT (SALON_OWNER) | Create new salon |
| `PUT` | `/api/salons/{salonId}` | JWT (SALON_OWNER) | Update salon details |
| `GET` | `/api/salons` | None | Get all salons |
| `GET` | `/api/salons/{salonId}` | None | Get salon by ID |
| `GET` | `/api/salons/search?city=Lucknow` | None | Search salons by city |
| `GET` | `/api/salons/owner` | JWT (SALON_OWNER) | Get salon owned by logged-in user |

**POST /api/salons — Request Body:**
```json
{
  "name": "Style Hub Salon",
  "city": "Lucknow",
  "address": "Hazratganj, Lucknow",
  "openTime": "09:00:00",
  "closeTime": "20:00:00",
  "description": "Premium unisex salon"
}
```

---

### 🗂️ Category Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/categories` | None | Get all categories |
| `GET` | `/api/categories/salon/{id}` | JWT | Get categories for a salon |
| `GET` | `/api/categories/{id}` | None | Get category by ID |
| `DELETE` | `/api/categories/{id}` | JWT (SALON_OWNER) | Delete category |
| `POST` | `/api/categories/salon-owner` | JWT (SALON_OWNER) | Create category for salon |

---

### ✂️ Service Offering Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/service-offering/salon/{salonId}` | None | Get all services for a salon (optional `?categoryId=`) |
| `GET` | `/api/service-offering/{serviceId}` | None | Get service by ID |
| `GET` | `/api/service-offering/list/{ids}` | None | Get multiple services by IDs (comma-separated) |
| `POST` | `/api/service-offering/salon-owner` | JWT (SALON_OWNER) | Create a new service |
| `PUT` | `/api/service-offering/salon-owner/{serviceId}` | JWT (SALON_OWNER) | Update a service |

**POST /api/service-offering/salon-owner — Request Body:**
```json
{
  "name": "Haircut & Styling",
  "description": "Professional cut with blow dry",
  "price": 499.00,
  "durationMinutes": 45,
  "categoryId": 2
}
```

---

### 📅 Booking Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/bookings?salonId=X&paymentMethod=RAZORPAY` | JWT | Create booking + get payment link |
| `GET` | `/api/bookings/customer` | JWT | Get all bookings for customer |
| `GET` | `/api/bookings/salon` | JWT (SALON_OWNER) | Get all bookings for salon |
| `GET` | `/api/bookings/report` | JWT (SALON_OWNER) | Get salon revenue report |
| `GET` | `/api/bookings/slots/salon/{salonId}/date/{date}` | JWT | Get booked slots for a date |
| `GET` | `/api/bookings/{bookingId}` | JWT | Get booking by ID |
| `PUT` | `/api/bookings/{bookingId}/status?status=CANCELLED` | JWT | Update booking status |

**POST /api/bookings — Request Body:**
```json
{
  "serviceIds": [1, 3],
  "startTime": "2025-06-20T10:00:00"
}
```
**Response: PaymentLinkResponse**
```json
{
  "paymentLinkId": "plink_AbCdEfGh",
  "paymentLinkUrl": "https://rzp.io/l/abc123",
  "amount": 998.00,
  "currency": "INR",
  "bookingId": 42
}
```

**GET /api/bookings/report — Response:**
```json
{
  "totalEarnings": 45000.00,
  "totalBookings": 120,
  "cancelledBookings": 8,
  "totalRefund": 3200.00
}
```

---

### 💳 Payment Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/payments/create?paymentMethod=RAZORPAY` | JWT | Create Razorpay payment link |
| `GET` | `/api/payments/{paymentOrderId}` | JWT | Get payment order by ID |
| `PATCH` | `/api/payments/proceed?paymentId=xxx&paymentLinkId=yyy` | JWT | Verify & process payment callback |

**PATCH /api/payments/proceed — Response:**
```json
true
```
(Returns `true` if payment verified successfully)

---

### 🔔 Notification Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/notifications` | JWT | Get all notifications for user |
| `PUT` | `/api/notifications/{id}/read` | JWT | Mark notification as read |
| `DELETE` | `/api/notifications/{id}` | JWT | Delete notification |

---

### ⭐ Review Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/reviews/salon/{salonId}` | JWT | Submit a review |
| `GET` | `/api/reviews/salon/{salonId}` | None | Get reviews for a salon |

---

## Database Design

Each service has its own isolated MySQL database — **Database-per-Service pattern**.

```
user_db (User Service)
├── users
│   ├── id (PK)
│   ├── email (UNIQUE)
│   ├── full_name
│   ├── phone
│   ├── role (CUSTOMER / SALON_OWNER)
│   └── created_at

salon_db (Salon Service)
├── salons
│   ├── id (PK)
│   ├── owner_id (FK → user.id — stored, not joined!)
│   ├── name
│   ├── city
│   ├── address
│   ├── open_time
│   └── close_time

category_db (Category Service)
├── categories
│   ├── id (PK)
│   ├── salon_id (FK → salon.id — stored, not joined!)
│   ├── name
│   └── description

service_db (Service Offering Service)
├── service_offerings
│   ├── id (PK)
│   ├── salon_id
│   ├── category_id
│   ├── name
│   ├── price (DECIMAL)
│   └── duration_minutes (INT)

booking_db (Booking Service)
├── bookings
│   ├── id (PK)
│   ├── customer_id
│   ├── salon_id
│   ├── service_ids (stored as JSON / comma-separated)
│   ├── start_time
│   ├── end_time
│   ├── total_price
│   └── status (PENDING / CONFIRMED / CANCELLED)

payment_db (Payment Service)
├── payment_orders
│   ├── id (PK)
│   ├── user_id
│   ├── booking_id
│   ├── salon_id
│   ├── amount
│   ├── payment_method (RAZORPAY / STRIPE)
│   ├── payment_link_id
│   └── status (PENDING / SUCCESS / FAILED)

notification_db (Notification Service)
├── notifications
│   ├── id (PK)
│   ├── user_id
│   ├── salon_id
│   ├── booking_id
│   ├── type (BOOKING_CONFIRMED / CANCELLED / etc.)
│   ├── description
│   └── is_read (BOOLEAN)
```

**Important:** No service directly queries another service's database. Data sharing happens only via REST (Feign) or events (RabbitMQ). This is the core of microservices data isolation.

---

## Local Setup Guide (Step by Step)

### Prerequisites

```
✅ Java 17+
✅ Maven 3.8+
✅ Node.js 18+
✅ Docker Desktop (for Keycloak + RabbitMQ)
✅ MySQL 8.x (local or Docker)
✅ IntelliJ IDEA (recommended for backend)
✅ VS Code (recommended for frontend)
```

### Step 1 — Start Keycloak via Docker

```bash
docker run -p 8080:8080 \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:26.1.0 start-dev
```

### Step 2 — Configure Keycloak (Important!)

Open `http://localhost:8080` → Login with admin/admin

```
a. Create a new Realm (or use "master")
b. Create a Client:
   - Client ID: salon-booking-client
   - Enable: Client Authentication = ON
   - Copy the generated Client Secret (from Credentials tab)

c. Create Client Roles:
   - CUSTOMER
   - SALON_OWNER

d. Create an admin user:
   - Username: admin@gmail.com
   - Password: admin (turn OFF "Temporary" option!)
   - Assign role: realm-admin

e. Increase Token Lifespan:
   - Realm Settings → Tokens
   - Access Token Lifespan: 30 minutes
```

### Step 3 — Update user-service Config

Edit `user-service/src/main/resources/application.yml`:

```yaml
keycloak:
  client-id: salon-booking-client
  client-secret: <paste-your-client-secret-here>
  admin-username: admin@gmail.com
  admin-password: admin
  base-url: http://localhost:8080
```

### Step 4 — Start RabbitMQ via Docker

```bash
docker run -d --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:3-management
```

RabbitMQ Management UI: `http://localhost:15672` (guest/guest)

### Step 5 — Create MySQL Databases

```sql
CREATE DATABASE user_db;
CREATE DATABASE salon_db;
CREATE DATABASE category_db;
CREATE DATABASE service_db;
CREATE DATABASE booking_db;
CREATE DATABASE payment_db;
CREATE DATABASE notification_db;
CREATE DATABASE review_db;
```

### Step 6 — Add Razorpay Keys

Edit `payment/src/main/resources/application.yml`:

```yaml
razorpay:
  api:
    key: <your-razorpay-key-id>
    secret: <your-razorpay-secret>
```

Get keys from: https://dashboard.razorpay.com/app/keys (Test mode)

### Step 7 — Start All Backend Services

Open separate terminals for each:

```bash
# Terminal 1 — Eureka Server (start this FIRST)
cd eurekaserver && mvn spring-boot:run

# Terminal 2
cd user-service && mvn spring-boot:run

# Terminal 3
cd salon && mvn spring-boot:run

# Terminal 4
cd category && mvn spring-boot:run

# Terminal 5
cd service-offering && mvn spring-boot:run

# Terminal 6
cd booking && mvn spring-boot:run

# Terminal 7
cd payment && mvn spring-boot:run

# Terminal 8
cd notifications && mvn spring-boot:run

# Terminal 9
cd review && mvn spring-boot:run

# Terminal 10 — Gateway (start AFTER all services are up)
cd gateway-server && mvn spring-boot:run
```

### Step 8 — Start Frontend

```bash
cd frontend
npm install
npm start
```

Frontend: `http://localhost:3000`

### Docker Compose (Alternative — All-in-One)

```bash
cd docker-compose
docker-compose up -d
```

### Verify Everything is Running

| Service | URL | Expected |
|---|---|---|
| Eureka Dashboard | http://localhost:8070 | All services listed |
| Keycloak Admin | http://localhost:8080 | Admin console |
| RabbitMQ Management | http://localhost:15672 | Queue dashboard |
| API Gateway | http://localhost:5000 | Routing active |
| Frontend | http://localhost:3000 | App loads |

---

## Environment Variables

### user-service/application.yml

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/user_db
    username: root
    password: yourpassword

keycloak:
  client-id: salon-booking-client
  client-secret: <keycloak-client-secret>
  admin-username: admin@gmail.com
  admin-password: admin
  base-url: http://localhost:8080

server:
  port: 8081

eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8070/eureka/
```

### payment/application.yml

```yaml
razorpay:
  api:
    key: rzp_test_xxxxxxxxxx
    secret: xxxxxxxxxxxxxxxxxx

stripe:
  api:
    key: sk_test_xxxxxxxxxx

server:
  port: 8086
```

### gateway-server/application.yml

```yaml
spring:
  security:
    oauth2:
      resource-server:
        jwt:
          jwk-set-uri: http://localhost:8080/realms/master/protocol/openid-connect/certs
server:
  port: 5000
```

---

## Interview Talking Points

### Q: Why Microservices over Monolith?

Each service (Booking, Payment, Notification) can be **deployed, scaled, and maintained independently**. If Notification Service crashes, bookings still work. With a monolith, one failure = everything fails. Also, different services can be scaled differently — Payment Service might need more instances than Category Service.

---

### Q: How do services communicate?

**Two patterns used:**

**Synchronous (Feign):** When we need an immediate response — e.g. Booking Service needs user details before creating a booking. Uses Eureka for service discovery — no hardcoded URLs.

**Asynchronous (RabbitMQ):** When we don't need an immediate response — e.g. after payment success, we publish to queues. Booking and Notification services react independently. System stays responsive even if one service is slow.

---

### Q: Why Keycloak instead of custom JWT?

Keycloak provides battle-tested OAuth2/OIDC implementation with RBAC, token refresh, user management, admin API, and session management out of the box. Building this custom would take months and likely introduce security vulnerabilities. Keycloak also provides a JWK endpoint so Gateway can validate tokens locally without DB calls.

---

### Q: How does Gateway validate tokens without calling User Service for every request?

Gateway uses Keycloak's JWK (JSON Web Key) endpoint to fetch the RSA **public key** once and **caches it**. Every JWT is verified locally using RSA signature — zero network call per request. This is stateless validation — a key performance and scalability advantage.

---

### Q: RestTemplate vs OpenFeign — when to use which?

**RestTemplate** is used for Keycloak Admin API calls because Keycloak's token endpoint requires `Content-Type: application/x-www-form-urlencoded` (form data). OpenFeign's default encoder sends JSON, which would fail. RestTemplate gives full control over content-type and body encoding.

**OpenFeign** is used for all inter-microservice calls because it's declarative (just an interface), auto-discovers services via Eureka (no hardcoded URLs), and requires zero boilerplate HTTP code.

---

### Q: How is slot conflict handled?

`isTimeSlotAvailable()` in BookingServiceImpl fetches all existing bookings for the salon, then uses **interval overlap formula**:

```
overlap exists if: (newStart < existingEnd) AND (newEnd > existingStart)
```

This handles all edge cases: same start, same end, contained within, overlapping left/right. Also validates that the slot falls within salon's open/close hours.

---

### Q: How does RabbitMQ decouple Payment from Notification?

Payment Service publishes to `notification-queue` using `RabbitTemplate.convertAndSend()` — a fire-and-forget call. It doesn't wait for Notification Service to respond. If Notification Service is down, messages queue up in RabbitMQ and are delivered when it comes back up. Payment API responds to user immediately regardless.

---

### Q: How does WebSocket real-time notification work?

1. Notification Service has a STOMP WebSocket server at `/ws`
2. After RabbitMQ delivers event, `SimpMessagingTemplate.convertAndSend("/notification/user/{id}", dto)` pushes to topic
3. React frontend subscribes to this topic using STOMP.js at startup
4. Browser receives notification instantly — no polling needed

Both customer AND salon owner get notifications simultaneously from the same payment event.

---

### Q: What is Database-per-Service and why?

Each microservice has its **own MySQL database**. Services never directly query another service's DB. Data sharing happens only via REST (Feign) or events (RabbitMQ). Benefits: independent schema changes, independent deployments, no single point of failure. The tradeoff is no cross-service JOIN queries — you join data in application code using Feign calls.

---

### Q: How is SalonReport generated?

No separate analytics service or complex SQL aggregation query needed. `getSalonReport()` uses **Java Streams** on Booking data:

```java
Double totalEarnings = bookings.stream()
    .mapToDouble(Booking::getTotalPrice).sum();

Long cancelledCount = bookings.stream()
    .filter(b -> b.getStatus() == CANCELLED).count();

Double totalRefund = bookings.stream()
    .filter(b -> b.getStatus() == CANCELLED)
    .mapToDouble(Booking::getTotalPrice).sum();
```

Clean, readable, and sufficient for this scale.

---

## Project Structure

```
backend/
├── eurekaserver/           ← Service registry (port 8070)
│   └── src/main/java/
│       └── EurekaServerApplication.java
│
├── gateway-server/         ← API Gateway (port 5000)
│   └── src/main/resources/
│       └── application.yml  (JWT config, routes, CORS)
│
├── user-service/           ← Auth + Keycloak (port 8081)
│   └── src/main/java/
│       ├── controller/AuthController.java
│       ├── service/KeycloakUserService.java
│       └── repository/UserRepository.java
│
├── salon/                  ← Salon management (port 8082)
├── category/               ← Categories (port 8083)
├── service-offering/       ← Services/pricing (port 8084)
├── booking/                ← Booking + slots (port 8085)
│   └── src/main/java/
│       └── service/BookingServiceImpl.java  (conflict check logic)
│
├── payment/                ← Razorpay + Stripe (port 8086)
│   └── src/main/java/
│       ├── config/RabbitMQConfig.java
│       └── producer/BookingEventProducer.java
│
├── notifications/          ← WebSocket + RabbitMQ consumer (port 8087)
│   └── src/main/java/
│       ├── consumer/NotificationEventConsumer.java
│       └── service/RealTimeCommunicationService.java
│
├── review/                 ← Reviews (port 8088)
└── docker-compose/         ← Docker Compose config

frontend/
└── src/
    ├── components/         ← Reusable React components
    ├── redux/              ← Store + slices (auth, salon, booking)
    └── pages/              ← Route-level pages
```

---

*Built with Spring Boot, Keycloak, RabbitMQ, WebSocket, React, and Razorpay.*
*Architecture designed for scalability, resilience, and independent deployability.*
