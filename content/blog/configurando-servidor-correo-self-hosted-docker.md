---
title: "Configurando un Servidor de Correo Self-Hosted con Docker"
created_at: 2026-03-26T00:59:00Z
updated_at: 2026-03-26T00:59:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "El proceso completo de configuración de un servidor de email auto-hosteado usando docker-mailserver, Roundcube y Traefik, incluyendo los 30+ commits de prueba y error."
tags: ["docker", "email", "self-hosting", "traefik", "roundcube"]
---

Recientemente tomé la decisión de recuperar el control sobre mi infraestructura digital. Uno de los servicios más críticos —y a la vez más intimidantes— de implementar es un servidor de correo electrónico.

Este artículo documenta el proceso **real y completo** de configuración de un servidor de email auto-hosteado usando Docker, Traefik como reverse proxy, y Roundcube como webmail.

## El Desafío

Auto-hostear email tiene fama de ser complicado. Entre SPF, DKIM, DMARC, TLS, y la configuración de Postfix/Dovecot, hay muchas piezas que pueden salir mal.

Mi objetivo era claro:
- **Correo funcional** con IMAP/SMTP estándar
- **Webmail moderno** accesible desde cualquier navegador
- **SSL automático** con Let's Encrypt
- **Seguro** con SPF, DKIM y DMARC configurados
- **Mantenible** — que pueda gestionarlo sin dolor

## La Solución

| Componente | Función |
|------------|---------|
| docker-mailserver | SMTP/IMAP con OpenDKIM + SpamAssassin |
| Roundcube | Webmail moderno y familiar |
| Traefik | Reverse proxy con SSL automático |

## El Viaje: 30+ Commits hasta la Configuración Final

Esta no fue una implementación lineal. Fueron **más de 30 commits** de prueba y error.

### Commit 4: Self-Signed para Interno, Traefik para Público

**Solución clave**: Dejamos que docker-mailserver genere certificados self-signed para la comunicación interna, y Traefik maneja el SSL público para el webmail. Esta fue una decisión arquitectónica importante: **el tráfico entre contenedores es interno y privado**, no necesita Let's Encrypt.

### Commits 5-8: La Saga de Roundcube TLS

Roundcube intentaba conectarse al mail server con TLS, pero como era una red Docker interna, fallaba. Después de múltiples intentos con variables de entorno y archivos de configuración montados, llegamos a la solución: un entrypoint personalizado que escribe la configuración ANTES de que el entrypoint original se ejecute.

### Commits 18-21: Autenticación SMTP

El problema era que Roundcube no podía enviar correos porque la autenticación SMTP no estaba configurada correctamente. La solución fue configurar explícitamente:

```php
$config['smtp_user'] = '%u';
$config['smtp_pass'] = '%p';
$config['smtp_auth_type'] = 'PLAIN';
$config['smtp_use_tls'] = true;
$config['smtp_tls_wrapper'] = false;
```

### Commits 22-24: Escape de Signos de Dólar

En docker-compose.yml, los signos `$` se interpretaban como variables de entorno de shell. La solución: escapar con `$$`.

### Commits 28-29: CSP y Headers de Seguridad

El Content Security Policy (CSP) de Traefik bloqueaba funcionalidades de Roundcube. Creamos un middleware específico para mail sin `frameDeny` y relajamos CSP para Roundcube.

## Lecciones Aprendidas

1. **No expongas puertos innecesarios** — Solo 25, 465, 587, y 993 son esenciales
2. **Usa volúmenes persistentes** — `mail-data`, `mail-state`, y `mail-logs` deben sobrevivir a recreaciones
3. **Red interna de Docker** — Roundcube y mail server deben estar en la misma red Docker
4. **El entrypoint de Roundcube sobrescribe configuración** — Escribir configuración ANTES del entrypoint original
5. **Escapar signos de dólar en docker-compose** — Usar `$$` en lugar de `$`
6. **ClamAV consume mucha RAM** — Si tienes menos de 4GB, considera deshabilitarlo
7. **CSP puede bloquear webmail** — Relajar políticas específicamente para el middleware del mail

## Estado Actual

El servidor está en producción y funcionando correctamente:

- ✅ Envío y recepción de correos
- ✅ Webmail accesible vía HTTPS
- ✅ SSL automático con Let's Encrypt para tráfico público
- ✅ Filtrado de spam activo
- ✅ Filtros Sieve configurables desde webmail
- ✅ Autenticación SMTP con STARTTLS
- ✅ SPF, DKIM, DMARC: PASS

Auto-hostear email es más accesible de lo que parece, pero requiere paciencia. El resultado final es un servidor de correo seguro, funcional y bajo tu control total.
