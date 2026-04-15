---
title: "Self-Hosting Email: 30 Commits of Pain and a Working Mail Server"
created_at: 2026-03-26T00:59:00Z
updated_at: 2026-03-26T00:59:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "I decided to self-host my own email server because I wanted control over my infrastructure. 30+ commits later, after fighting STARTTLS, dollar sign escaping, and CSP headers that broke my webmail, it actually works."
tags: ["docker", "email", "self-hosting", "traefik", "roundcube"]
---

I decided to self-host my own email server. You know, for sovereignty. Digital independence. Taking back control of my infrastructure. All that noble-sounding stuff you tell yourself right before you spend three days debugging why Roundcube can't talk to Postfix over a Docker network.

Let me tell you how that went.

## Why I Did This to Myself

I wanted to own my email. Not rent it from Google, not trust it to some provider who might change their terms or scan my messages or shut down next year. My server, my rules, my mail. The kind of decision that sounds empowering until you actually have to implement SPF, DKIM, DMARC, TLS, and the entire Postfix/Dovecot configuration stack that makes email work.

Here's what I needed:
- **Functional email** with standard IMAP/SMTP — send and receive like a normal person
- **A webmail client** accessible from any browser — because I'm not SSHing into my server to read email
- **Automatic SSL** with Let's Encrypt — because it's 2026 and plaintext email auth is embarrassing
- **SPF, DKIM, DMARC** — so my emails actually land in inboxes instead of spam folders
- **Maintainable** — something I can manage without it becoming a part-time job

Simple list. Thirty-plus commits to get there. Let me walk you through the highlights.

## The Stack

| Component | What It Does |
|-----------|-------------|
| docker-mailserver | SMTP/IMAP with OpenDKIM + SpamAssassin |
| Roundcube | Webmail — the actual UI you interact with |
| Traefik | Reverse proxy with automatic SSL |

Three containers. Sounds manageable. It was not.

## The 30-Commit Journey

This was not a clean implementation. This was war. Commit by commit, error by error, Stack Overflow tab by Stack Overflow tab. Here's what actually happened.

### Commit 4: The Architecture Decision That Saved My Sanity

The first real decision: how to handle TLS between the containers. I was going back and forth — should docker-mailserver use Let's Encrypt certs? Should I share Traefik's certs? Should everything be TLS everywhere?

Then I stopped and thought about it. The traffic between containers is on a Docker internal network. It's private. It never touches the internet. Why the fuck am I trying to get Let's Encrypt certificates for container-to-container communication?

The solution: let docker-mailserver generate self-signed certs for internal communication, and let Traefik handle the public-facing SSL for the webmail. Internal traffic is internal. Public traffic gets real certificates. Clean separation. This one decision saved me from an entire category of problems that would have eaten another ten commits.

### Commits 5-8: The STARTTLS Saga

This is where things got ugly. Roundcube needed to connect to docker-mailserver for IMAP and SMTP. Simple, right? Just point it at the hostname, give it the port, done.

Except Roundcube insisted on using TLS for the connection. And the mail server was using self-signed certs for internal traffic. So Roundcube would try to connect, see the self-signed cert, and refuse. Connection failed. No email.

I tried every combination of environment variables. I tried mounting custom config files. I tried disabling TLS verification. Nothing stuck — because here's the thing about Roundcube's Docker image: it has an entrypoint script that generates the configuration files at startup. Whatever config you mount gets overwritten before the application even starts. You're fighting the entrypoint, and the entrypoint always wins.

The fix was disgusting and brilliant: a custom entrypoint script that writes the configuration *before* the original entrypoint runs. Inject your config, then hand off to the default entrypoint. Beat it to the punch.

Four commits to figure that out. Four commits of "why isn't this working" and "I swear I set that variable" and "oh, the entrypoint overwrites everything." The kind of debugging where the problem isn't your code — it's your assumption about when your code runs.

### Commits 18-21: SMTP Authentication, or: Why Can't I Send Email?

Roundcube could receive email. It could display email. It could do everything except send email, which is, you know, the other half of what email does.

The error was authentication-related. Roundcube was connecting to the SMTP server but failing to authenticate. The mail server was rejecting the connection because — and this took me three commits to figure out — the SMTP authentication wasn't configured properly on the Roundcube side. It needed explicit settings:

```php
$config['smtp_user'] = '%u';
$config['smtp_pass'] = '%p';
$config['smtp_auth_type'] = 'PLAIN';
$config['smtp_use_tls'] = true;
$config['smtp_tls_wrapper'] = false;
```

The `%u` and `%p` are Roundcube placeholders — they get replaced with the currently logged-in user's credentials. Without these, Roundcube was trying to connect to SMTP anonymously, and the mail server was saying "who the fuck are you?" Which is exactly the correct response to an unauthenticated SMTP connection, but not what I wanted to hear at 11pm.

The `smtp_tls_wrapper` = false part matters too. TLS wrapper means the connection starts encrypted from the first byte (implicit TLS, port 465). STARTTLS means the connection starts plaintext and upgrades to encrypted mid-conversation (explicit TLS, port 587). I was using port 587 with STARTTLS, but `smtp_tls_wrapper` defaults to true in some configurations, which made Roundcube try to speak TLS to a port that was expecting plaintext first. The connection would just hang. No error. No timeout for thirty seconds. Just... nothing. The worst kind of failure — the silent kind.

### Commits 22-24: The Dollar Sign Problem

This one made me feel stupid. Which, honestly, is a recurring theme in this post.

I had some configuration in my `docker-compose.yml` that included dollar signs. In shell and in Docker Compose, `$` is a variable reference. So `$config` in a YAML value doesn't mean the literal string `$config` — it means "look up the environment variable called `config`" which doesn't exist, so it becomes an empty string. Your carefully crafted PHP configuration just... vanishes.

```yaml
# What I wrote:
ROUNDCUBE_CONFIG: "$config['smtp_user'] = '%u';"

# What Docker Compose saw:
ROUNDCUBE_CONFIG: "['smtp_user'] = '%u';"

# What I needed to write:
ROUNDCUBE_CONFIG: "$$config['smtp_user'] = '%u';"
```

`$$` escapes to a literal `$` in Docker Compose. Two characters. Three commits to figure out why my configuration was silently being mangled. I was reading logs, checking Roundcube internals, questioning my understanding of PHP — and the problem was that Docker Compose was eating my dollar signs before the config ever reached the container.

The lesson: if your configuration works when you write it directly into the container but breaks when you pass it through `docker-compose.yml`, check for dollar signs. Always check for dollar signs.

### Commits 28-29: CSP Strikes Back

Everything was working. Email sending, receiving, webmail loading, SSL green, authentication passing. I was ready to call it done. Then I clicked the "compose" button in Roundcube and the rich text editor didn't load.

The browser console was full of Content Security Policy violations. My Traefik security headers middleware — the same one I'd proudly added during the server hardening — was blocking inline scripts and frames that Roundcube's editor needed to function. The `frameDeny` header was killing the compose window. The CSP was blocking the JavaScript that powered the editor.

The fix was a separate middleware for the mail subdomain. No `frameDeny`. A relaxed CSP that allows what Roundcube needs. Security headers are great until they break your own applications, and the correct response isn't to remove them everywhere — it's to configure them per-service.

Two more commits. Two more hours. But now the editor works, the security headers are still enforced on everything else, and the mail-specific middleware only applies to the Roundcube route.

## What I Actually Learned

1. **Don't expose unnecessary ports** — Only 25, 465, 587, and 993 need to be reachable. Everything else is internal.

2. **Use persistent volumes** — `mail-data`, `mail-state`, and `mail-logs` must survive container recreation. Lose these and you lose your DKIM keys, your mailboxes, everything.

3. **Docker internal networks are internal** — Roundcube and the mail server need to be on the same Docker network. And that internal traffic doesn't need Let's Encrypt. Stop overcomplicating it.

4. **Roundcube's entrypoint overwrites your config** — Write your configuration before the default entrypoint runs, or it won't exist when the application starts.

5. **Escape dollar signs in docker-compose** — Use `$$` for a literal `$`. This will bite you, guaranteed. It's not a matter of if.

6. **ClamAV is a RAM hog** — If you have less than 4GB, consider disabling the antivirus. It pulls virus definitions into memory and will eat over a gigabyte. On a small server, that's not a tradeoff — it's a denial of service against yourself.

7. **CSP will break your webmail** — Security headers are per-service, not global. A policy that works for a static portfolio will absolutely destroy a webmail client that needs inline scripts and iframes.

## Where It Stands

The server is in production. It works. I can send and receive email from my own domain, through my own server, on my own terms. SPF passes. DKIM passes. DMARC passes. Spam filtering is active. Sieve filters are configurable from the webmail. SSL is automatic.

Thirty-plus commits. Three days. More debugging sessions than I want to admit. But it works, and it's mine, and nobody can take it away or change the terms of service on me.

Was it worth it? Ask me again in six months when something breaks at 2am and I have to debug Postfix logs by myself. But right now, sitting here with a working mail server that I built from scratch? Yeah. It was worth it.

Self-hosting email is absolutely doable. It's also absolutely going to make you question your life choices at least three times during the process. Both of those things can be true.

---

*If you're thinking about self-hosting email, start with the docker-mailserver docs. They're good. Better than most of what you'll find on Stack Overflow. And for the love of everything, escape your dollar signs.*
