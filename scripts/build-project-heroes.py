#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Regenerate src/public/img/projects/heroes/*.svg in the Nightwire palette.

    ./scripts/build-project-heroes.py

Reads the live project registry from the API, so titles, taglines and tech
stacks always match what the site actually serves. Standard library only.

One template, one curated block per project: changing the design system means
changing this file, not fifteen SVGs by hand.

Enforces .nightwire/DESIGN.md:
  - background is #000000, never navy, never a gradient
  - no border-radius: sharp edges only
  - colour is semantic, never decorative:
        blue  #6699ff  UI chrome (panel header, labels)
        green #7aed7a  data values (the metrics row)
        cyan  #66ddff  metadata (tech chips, the URL)

METRICS below only ever carry figures that appear verbatim in a project's own
approved text, or that were verified against a live source. Where a project has
no real figure, the row is omitted -- never padded with an invented one.
"""
import html as H
import json
import os
import sys
import urllib.request

API = os.environ.get("PROJECTS_API", "https://cativo.dev/api/projects?per_page=100")

METRICS = {
  "clarify":                [("analysis tiers", "3")],
  "claude-session-manager": [("runtime deps", "0"), ("platforms", "2")],
  "claude-setup":           [("setup", "5 min"), ("plugins", "5")],
  "claude-style":           [("behaviour ported", "~60%")],
  "ghost-blog":             [],
  "kovia":                  [("tests", "356"), ("regression bugs", "2")],
  "lumira":                 [("npm releases", "55"), ("runtime deps", "0")],
  "myths-and-legends-api":  [],
  "nightwire":              [("git tags", "20"), ("version", "2.0.1")],
  "nova-id":                [("frontends", "3"), ("access rules", "15")],
  "pokemon-route":          [("stops", "12"), ("weight", "196KB"), ("deps", "0"), ("ci checks", "33")],
  "portfolio":              [("coverage", ">80%")],
  "portfolio-api":          [("releases", "54"), ("line coverage", "96.9%")],
  "space-server":           [("containers", "42"), ("subdomains", "21"), ("hosts", "1")],
  "wired-dots":             [],
}

KANJI = {
  "clarify": "契約解析", "claude-session-manager": "記録管理", "claude-setup": "環境構築",
  "claude-style": "様式移植", "ghost-blog": "個人日誌", "kovia": "里親制度",
  "lumira": "状態表示", "myths-and-legends-api": "民話目録", "nightwire": "設計体系",
  "nova-id": "認証基盤", "pokemon-route": "経路記録", "portfolio": "作品目録",
  "portfolio-api": "接続基盤", "space-server": "自主運用", "wired-dots": "環境設定",
 }

# Segunda linea: rasgos reales, en minusculas, separados por punto medio.
SUBLINE = {
  "clarify": "upload · queued job · AI analysis · realtime dashboard",
  "claude-session-manager": "TUI and CLI · zero runtime dependencies · CI-tested",
  "claude-setup": "one curl pipe · plugins, MCP servers, rules, skills",
  "claude-style": "prompts and rules · honest about what RLHF cannot port",
  "ghost-blog": "custom Handlebars theme · series support · self-hosted",
  "kovia": "row-level multi-tenancy · rule-based applicant scoring",
  "lumira": "calibrated against real captured payloads",
  "myths-and-legends-api": "Salvadoran folklore · cited sources · JWT auth",
  "nightwire": "pure black surfaces · no decorative colour · agent-readable",
  "nova-id": "Ory stack · Oathkeeper the only public bridge",
  "pokemon-route": "twelve games · no version played twice · no build step",
  "portfolio": "Nuxt 4 · Markdown blog · strict TypeScript · full CI/CD",
  "portfolio-api": "JWT and API-key auth · tiered per-endpoint rate limiting",
  "space-server": "Traefik edge · mail · observability · alerting",
  "wired-dots": "one script on a fresh Arch install · hardware-agnostic",
}

# Sin titulares sobrescritos: shortDescription es la unica fuente.
HEADLINE = {}


VOID, VOID_WARM = "#000000", "#0a0a0a"
LINE, LINE_FAINT = "rgba(255,255,255,0.12)", "rgba(255,255,255,0.06)"
BLUE, GREEN, CYAN = "#6699ff", "#7aed7a", "#66ddff"
TEXT, TEXT_DIM, TEXT_MUTE = "#ffffff", "#aaaaaa", "#5a5a5a"

W, HH, HDR, PAD = 1200, 480, 46, 56
# Dos escapes, porque los contextos son distintos. `e` vale para el texto de
# un nodo, donde solo < y & son especiales. `a` es para valores de atributo:
# ahi unas comillas cerrarian el atributo antes de tiempo y el resto del texto
# se parsearia como marcado. Estos SVG se sirven desde cativo.dev y, abiertos
# por su URL directa, se renderizan como documento en ese origen.
e = lambda s: H.escape(str(s), quote=False)
a = lambda s: H.escape(str(s), quote=True)


def wrap(text, limit, lines=2):
    """Corta en palabras. El mono de respaldo mide ~0.6em por caracter."""
    out, cur = [], ""
    for word in text.split():
        if cur and len(cur) + 1 + len(word) > limit:
            out.append(cur); cur = word
            if len(out) == lines: break
        else:
            cur = (cur + " " + word).strip()
    if cur and len(out) < lines: out.append(cur)
    return out


def hero(s):
    y = 176
    title = '  <g transform="translate(%d,%d) scale(0.82,1)">\n    <text class="title" x="0" y="0" font-size="%d" fill="%s">%s</text>\n  </g>' % (
        PAD, y, 76 if len(s["title"]) <= 18 else 62, TEXT, e(s["title"]))

    head = "\n".join(
        '  <text class="mono" x="%d" y="%d" font-size="22" fill="%s">%s</text>' % (PAD, 228 + i * 30, TEXT_DIM, e(l))
        for i, l in enumerate(wrap(s["headline"], 74)))
    sub_y = 228 + len(wrap(s["headline"], 74)) * 30 + 6
    sub = '  <text class="mono" x="%d" y="%d" font-size="14" fill="%s">%s</text>' % (PAD, sub_y, TEXT_MUTE, e(s["subline"]))

    # Rotulo en azul (cromo), valor en verde (dato). Sin cifras reales, sin fila.
    body = ""
    if s["metrics"]:
        mx, cells = PAD, []
        for label, value in s["metrics"]:
            cells.append(
                '  <text class="stamp" x="%d" y="330" font-size="12" fill="%s" letter-spacing="1.6">%s</text>\n'
                '  <text class="mono" x="%d" y="360" font-size="25" fill="%s">%s</text>'
                % (mx, BLUE, e(label.upper()), mx, GREEN, e(value)))
            mx += max(len(label) * 8, len(str(value)) * 16) + 58
        body = ('  <rect x="%d" y="292" width="%d" height="1" fill="%s"/>\n' % (PAD, W - PAD * 2, LINE_FAINT)) + "\n".join(cells)

    cx, chips = PAD, []
    for t in s["chips"]:
        w = 22 + len(t) * 8
        chips.append(
            '  <rect x="%d" y="404" width="%d" height="30" fill="none" stroke="%s"/>\n'
            '  <text class="mono" x="%d" y="424" font-size="12" fill="%s" text-anchor="middle">%s</text>'
            % (cx, w, LINE, cx + w // 2, CYAN, e(t)))
        cx += w + 8
    chips = "\n".join(chips)

    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" width="%d" height="%d" role="img" aria-label="%s">
  <style>
    .mono  { font-family: 'JetBrains Mono','Cascadia Mono',Consolas,'Courier New',monospace; }
    .stamp { font-family: 'Saira Extra Condensed',Impact,'Arial Narrow',sans-serif; }
    .title { font-family: 'Noto Serif Display','Times New Roman',serif; }
    .kanji { font-family: 'Shippori Mincho B1',YuMincho,serif; }
  </style>

  <rect width="%d" height="%d" fill="%s"/>
  <rect width="%d" height="%d" fill="%s"/>
  <rect y="%d" width="%d" height="1" fill="%s"/>
  <text class="stamp" x="%d" y="30" font-size="15" fill="%s" letter-spacing="2.2">%s</text>
  <text class="kanji" x="%d" y="30" font-size="15" fill="%s" text-anchor="end">%s</text>

%s

%s
%s

%s

%s

  <text class="mono" x="%d" y="424" font-size="12" fill="%s" text-anchor="end">%s</text>
</svg>
''' % (W, HH, W, HH, a(s["alt"]),
       W, HH, VOID, W, HDR, VOID_WARM, HDR, W, LINE,
       PAD, BLUE, e(s["label"]), W - PAD, TEXT_MUTE, e(s["kanji"]),
       title, head, sub, body, chips,
       W - PAD, CYAN, e(s["url"]))


def build(projects):
    out = []
    for p in projects:
        pid = (p.get("heroImage") or "").rsplit("/", 1)[-1].replace(".svg", "") or p["title"]
        url = p.get("liveUrl") or p.get("repoUrl") or ""
        url = url.replace("https://", "").replace("http://", "").rstrip("/")
        out.append({
            "id": pid,
            "label": "CASE-%04d · %s" % (int(p["id"]), p["title"].upper()),
            "title": p["title"],
            "kanji": KANJI.get(pid, ""),
            "headline": HEADLINE.get(pid) or p.get("shortDescription") or p.get("description", ""),
            "subline": SUBLINE.get(pid, ""),
            "metrics": METRICS.get(pid, []),
            "chips": (p.get("techStack") or [])[:5],
            "url": url,
            "alt": "%s — %s" % (p["title"], (p.get("shortDescription") or "").rstrip(".")),
        })
    return out


def fetch():
    with urllib.request.urlopen(API, timeout=20) as r:
        return json.load(r)["data"]


if __name__ == "__main__":
    here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dest = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
        here, "src", "public", "img", "projects", "heroes")
    specs = build(fetch())

    for s in sorted(specs, key=lambda x: x["id"]):
        p = os.path.join(dest, s["id"] + ".svg")
        open(p, "w", encoding="utf-8").write(hero(s))
        print("  %-26s %5d B  %s" % (s["id"], os.path.getsize(p),
              "%d metricas" % len(s["metrics"]) if s["metrics"] else "sin metricas"))
