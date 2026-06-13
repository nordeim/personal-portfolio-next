#!/usr/bin/env python3
"""Generate Code Review Report 5 PDF using ReportLab."""

import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, HRFlowable, Preformatted
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus.flowables import Flowable

# ──────────────────────────────────────────────
# Color Palette
# ──────────────────────────────────────────────
ACCENT        = colors.HexColor('#258eb1')
TEXT_PRIMARY   = colors.HexColor('#1a1b1c')
TEXT_MUTED     = colors.HexColor('#747c81')
BG_SURFACE    = colors.HexColor('#d6dde1')
BG_PAGE       = colors.HexColor('#f3f4f5')
TABLE_HEADER_COLOR = ACCENT
TABLE_HEADER_TEXT  = colors.white
TABLE_ROW_EVEN     = colors.white
TABLE_ROW_ODD      = BG_SURFACE

# ──────────────────────────────────────────────
# Font Registration
# ──────────────────────────────────────────────
ENGLISH_DIR = '/usr/share/fonts/truetype/english/'
LIBERATION_DIR = '/usr/share/fonts/truetype/liberation/'

# Tinos fonts in english/ are corrupt HTML files; use Liberation Serif as serif substitute
pdfmetrics.registerFont(TTFont('Tinos',         LIBERATION_DIR + 'LiberationSerif-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Tinos-Bold',     LIBERATION_DIR + 'LiberationSerif-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Tinos-Italic',   LIBERATION_DIR + 'LiberationSerif-Italic.ttf'))
pdfmetrics.registerFont(TTFont('Carlito',        ENGLISH_DIR + 'Carlito-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Carlito-Bold',   ENGLISH_DIR + 'Carlito-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Carlito-Italic', ENGLISH_DIR + 'Carlito-Italic.ttf'))

from reportlab.pdfbase.pdfmetrics import registerFontFamily
registerFontFamily('Tinos',   normal='Tinos',   bold='Tinos-Bold',   italic='Tinos-Italic')
registerFontFamily('Carlito', normal='Carlito', bold='Carlito-Bold', italic='Carlito-Italic')

# ──────────────────────────────────────────────
# Styles
# ──────────────────────────────────────────────
PAGE_W, PAGE_H = A4
MARGIN = 20 * mm

style_title = ParagraphStyle(
    'Title', fontName='Carlito-Bold', fontSize=26, leading=32,
    textColor=ACCENT, alignment=TA_LEFT, spaceAfter=4*mm
)
style_subtitle = ParagraphStyle(
    'Subtitle', fontName='Carlito', fontSize=13, leading=18,
    textColor=TEXT_MUTED, alignment=TA_LEFT, spaceAfter=8*mm
)
style_h1 = ParagraphStyle(
    'H1', fontName='Carlito-Bold', fontSize=18, leading=24,
    textColor=ACCENT, spaceBefore=6*mm, spaceAfter=3*mm
)
style_h2 = ParagraphStyle(
    'H2', fontName='Carlito-Bold', fontSize=14, leading=19,
    textColor=TEXT_PRIMARY, spaceBefore=5*mm, spaceAfter=2*mm
)
style_h3 = ParagraphStyle(
    'H3', fontName='Carlito-Bold', fontSize=12, leading=16,
    textColor=TEXT_PRIMARY, spaceBefore=4*mm, spaceAfter=2*mm
)
style_body = ParagraphStyle(
    'Body', fontName='Tinos', fontSize=10, leading=15,
    textColor=TEXT_PRIMARY, alignment=TA_JUSTIFY, spaceAfter=2*mm
)
style_body_muted = ParagraphStyle(
    'BodyMuted', fontName='Tinos', fontSize=10, leading=15,
    textColor=TEXT_MUTED, alignment=TA_JUSTIFY, spaceAfter=2*mm
)
style_bullet = ParagraphStyle(
    'Bullet', fontName='Tinos', fontSize=10, leading=15,
    textColor=TEXT_PRIMARY, leftIndent=8*mm, bulletIndent=3*mm,
    spaceAfter=1.5*mm
)
style_bullet_issue = ParagraphStyle(
    'BulletIssue', fontName='Tinos', fontSize=10, leading=15,
    textColor=TEXT_PRIMARY, leftIndent=8*mm, bulletIndent=3*mm,
    spaceAfter=1.5*mm
)
style_code = ParagraphStyle(
    'Code', fontName='Carlito', fontSize=8.5, leading=12,
    textColor=TEXT_PRIMARY, backColor=BG_SURFACE,
    leftIndent=4*mm, rightIndent=4*mm,
    spaceBefore=2*mm, spaceAfter=2*mm,
    borderPadding=(3*mm, 3*mm, 3*mm, 3*mm),
)
style_table_header = ParagraphStyle(
    'TableHeader', fontName='Carlito-Bold', fontSize=9, leading=13,
    textColor=TABLE_HEADER_TEXT, alignment=TA_CENTER
)
style_table_cell = ParagraphStyle(
    'TableCell', fontName='Tinos', fontSize=9, leading=13,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT
)
style_table_cell_center = ParagraphStyle(
    'TableCellCenter', fontName='Tinos', fontSize=9, leading=13,
    textColor=TEXT_PRIMARY, alignment=TA_CENTER
)
style_severity_crit = ParagraphStyle(
    'SevCrit', fontName='Carlito-Bold', fontSize=9, leading=13,
    textColor=colors.HexColor('#c0392b'), alignment=TA_CENTER
)
style_severity_high = ParagraphStyle(
    'SevHigh', fontName='Carlito-Bold', fontSize=9, leading=13,
    textColor=colors.HexColor('#d35400'), alignment=TA_CENTER
)
style_severity_mod = ParagraphStyle(
    'SevMod', fontName='Carlito-Bold', fontSize=9, leading=13,
    textColor=colors.HexColor('#f39c12'), alignment=TA_CENTER
)
style_severity_low = ParagraphStyle(
    'SevLow', fontName='Carlito-Bold', fontSize=9, leading=13,
    textColor=colors.HexColor('#27ae60'), alignment=TA_CENTER
)
style_footer = ParagraphStyle(
    'Footer', fontName='Carlito-Italic', fontSize=8, leading=10,
    textColor=TEXT_MUTED, alignment=TA_CENTER
)

# ──────────────────────────────────────────────
# Helper functions
# ──────────────────────────────────────────────
def p(text, style=style_body):
    return Paragraph(text, style)

def bullet(text, is_issue=False):
    style = style_bullet_issue if is_issue else style_bullet
    return Paragraph(text, style)

def code_block(text):
    """Render a code block with monospace font and gray background."""
    return Paragraph(text, style_code)

def section_divider():
    return HRFlowable(
        width="100%", thickness=0.5, color=BG_SURFACE,
        spaceBefore=3*mm, spaceAfter=3*mm
    )

def make_table(headers, rows, col_widths=None):
    """Build a styled table with accent header."""
    header_row = [Paragraph(h, style_table_header) for h in headers]
    data = [header_row]
    for row in rows:
        data.append([Paragraph(str(c), style_table_cell) for c in row])

    if col_widths is None:
        usable = PAGE_W - 2 * MARGIN
        col_widths = [usable / len(headers)] * len(headers)

    t = Table(data, colWidths=col_widths, repeatRows=1)
    style_cmds = [
        ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER_COLOR),
        ('TEXTCOLOR', (0, 0), (-1, 0), TABLE_HEADER_TEXT),
        ('FONTNAME',  (0, 0), (-1, 0), 'Carlito-Bold'),
        ('FONTSIZE',  (0, 0), (-1, 0), 9),
        ('ALIGN',     (0, 0), (-1, 0), 'CENTER'),
        ('VALIGN',    (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID',      (0, 0), (-1, -1), 0.4, colors.HexColor('#b0b8bc')),
        ('TOPPADDING',    (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING',   (0, 0), (-1, -1), 5),
        ('RIGHTPADDING',  (0, 0), (-1, -1), 5),
    ]
    # Alternate row colors
    for i in range(1, len(data)):
        bg = TABLE_ROW_EVEN if i % 2 == 1 else TABLE_ROW_ODD
        style_cmds.append(('BACKGROUND', (0, i), (-1, i), bg))
    t.setStyle(TableStyle(style_cmds))
    return t

def severity_label(sev):
    """Return a Paragraph styled by severity."""
    mapping = {
        'CRITICAL': style_severity_crit,
        'HIGH': style_severity_high,
        'MODERATE': style_severity_mod,
        'LOW': style_severity_low,
    }
    return Paragraph(sev, mapping.get(sev, style_table_cell_center))


# ──────────────────────────────────────────────
# Page template callbacks
# ──────────────────────────────────────────────
def on_page(canvas, doc):
    """Header / footer on every page."""
    canvas.saveState()
    # Footer
    canvas.setFont('Carlito-Italic', 8)
    canvas.setFillColor(TEXT_MUTED)
    canvas.drawCentredString(PAGE_W / 2, 10 * mm,
                             f"Code Review Report 5  —  The Engineered Soul (v2.0)  —  Page {doc.page}")
    # Top accent line
    canvas.setStrokeColor(ACCENT)
    canvas.setLineWidth(1.5)
    canvas.line(MARGIN, PAGE_H - MARGIN + 4*mm, PAGE_W - MARGIN, PAGE_H - MARGIN + 4*mm)
    canvas.restoreState()


# ──────────────────────────────────────────────
# Build the document
# ──────────────────────────────────────────────
OUTPUT_PATH = '/home/z/my-project/download/Code_Review_Report_5.pdf'
os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

doc = SimpleDocTemplate(
    OUTPUT_PATH,
    pagesize=A4,
    leftMargin=MARGIN, rightMargin=MARGIN,
    topMargin=MARGIN, bottomMargin=MARGIN,
    title='Code Review Report 5',
    author='Code Review Audit',
    subject='The Engineered Soul (v2.0) — Brutalist Portfolio Next.js Codebase Audit',
)

story = []
usable_w = PAGE_W - 2 * MARGIN

# ══════════════════════════════════════════════
# TITLE PAGE
# ══════════════════════════════════════════════
story.append(Spacer(1, 30*mm))
story.append(p('Code Review Report 5', style_title))
story.append(p('The Engineered Soul (v2.0) — Brutalist Portfolio Next.js Codebase Audit', style_subtitle))
story.append(Spacer(1, 8*mm))

# Metadata table
meta_data = [
    ['Project', 'Nicholas Yun Personal Portfolio'],
    ['Repository', 'github.com/nordeim/personal-portfolio-next'],
    ['Stack', 'Next.js 16.2.9 / React 19.2.7 / Tailwind CSS v4.1.17 / TypeScript 5.9.3'],
    ['Previous Audits', 'Code Review Reports 1–4, Remediations 1–4'],
    ['Audit Date', '2026-06-14'],
    ['Baseline', 'TypeScript typecheck: 0 errors | Production build: PASS | npm audit: 0 vulnerabilities'],
]
meta_table_data = []
for label, val in meta_data:
    meta_table_data.append([
        Paragraph(label, ParagraphStyle('MetaLabel', fontName='Carlito-Bold', fontSize=9.5, leading=14, textColor=TEXT_PRIMARY)),
        Paragraph(val, ParagraphStyle('MetaVal', fontName='Tinos', fontSize=9.5, leading=14, textColor=TEXT_PRIMARY)),
    ])

meta_col_widths = [35*mm, usable_w - 35*mm]
meta_t = Table(meta_table_data, colWidths=meta_col_widths)
meta_t.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('LEFTPADDING', (0, 0), (-1, -1), 4),
    ('RIGHTPADDING', (0, 0), (-1, -1), 4),
    ('LINEBELOW', (0, 0), (-1, -2), 0.3, BG_SURFACE),
    ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#eef0f2')),
]))
story.append(meta_t)
story.append(PageBreak())

# ══════════════════════════════════════════════
# EXECUTIVE SUMMARY
# ══════════════════════════════════════════════
story.append(p('Executive Summary', style_h1))
story.append(section_divider())

story.append(p(
    'This report presents findings of a comprehensive critical code review and audit across '
    '8 domains: Architecture, TypeScript Strictness, Design System Fidelity, Component Quality, '
    'Security, Performance, Accessibility, and Technical Debt. The codebase is in solid shape '
    'after four remediation phases. No critical issues were found. However, 16 findings ranging '
    'from High to Low severity were identified, with the most significant being the pervasive '
    'use of inline styles instead of Tailwind CSS utility classes (108 occurrences across 25 files).'
))

story.append(Spacer(1, 4*mm))
story.append(p('Findings Summary by Severity', style_h2))

sev_rows = [
    [severity_label('CRITICAL'), Paragraph('0', style_table_cell_center), Paragraph('—', style_table_cell)],
    [severity_label('HIGH'),     Paragraph('1', style_table_cell_center),
     Paragraph('Pervasive inline styles instead of Tailwind CSS utilities — 108 instances across 25 active files', style_table_cell)],
    [severity_label('MODERATE'), Paragraph('8', style_table_cell_center),
     Paragraph('Accessibility gaps including mobile menu focus trap and "View Work" link not wired to routing, '
               'ContactSection re-render issue, raw img tag instead of Next.js Image, static components as '
               'Client Components, rate limiter edge cases, dead analytics schema, AccessibilityProvider '
               'redundancy, missing UI states', style_table_cell)],
    [severity_label('LOW'),      Paragraph('7', style_table_cell_center),
     Paragraph('Non-grid spacing values, unnecessary "use client" on not-found.tsx, hash routing URL vs '
               'state mismatch, Terminal key={index}, rate-limiter setInterval never cleared, console.log '
               'placeholders, minor typing gaps', style_table_cell)],
]

sev_col_w = [25*mm, 15*mm, usable_w - 40*mm]
sev_table = Table(sev_rows, colWidths=sev_col_w)
sev_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), TABLE_ROW_EVEN),
    ('BACKGROUND', (0, 1), (-1, 1), TABLE_ROW_ODD),
    ('BACKGROUND', (0, 2), (-1, 2), TABLE_ROW_EVEN),
    ('BACKGROUND', (0, 3), (-1, 3), TABLE_ROW_ODD),
    ('GRID', (0, 0), (-1, -1), 0.4, colors.HexColor('#b0b8bc')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('LEFTPADDING', (0, 0), (-1, -1), 5),
    ('RIGHTPADDING', (0, 0), (-1, -1), 5),
]))
story.append(sev_table)
story.append(PageBreak())

# ══════════════════════════════════════════════
# DOMAIN 1
# ══════════════════════════════════════════════
story.append(p('Domain 1: Architecture &amp; Pattern Integrity', style_h1))
story.append(p('8 checks', style_body_muted))
story.append(section_divider())

domain1 = [
    ('1.1', 'PASS', 'PortfolioApp orchestrator with ErrorBoundary + Suspense per section'),
    ('1.2', 'PASS', 'useRouteHash VALID_SECTIONS matches section IDs'),
    ('1.3', 'LOW',  'getHashFromWindow() only called on mount; hashchange listener validates state but URL can show invalid hash'),
    ('1.4', 'PASS', 'page.tsx correctly uses "use client" + ssr: false'),
    ('1.5', 'PASS', 'layout.tsx Server Component with ThemeScript, metadata, fonts'),
    ('1.6', 'PASS', 'error.tsx and not-found.tsx implemented correctly'),
    ('1.7', 'PASS', 'PortfolioApp.tsx correctly in src/app/'),
    ('1.8', 'LOW',  'not-found.tsx has "use client" but uses no hooks or browser APIs — should be Server Component'),
]
d1_rows = []
for cid, sev, desc in domain1:
    d1_rows.append([Paragraph(cid, style_table_cell_center), severity_label(sev), Paragraph(desc, style_table_cell)])

d1_col_w = [14*mm, 22*mm, usable_w - 36*mm]
d1_table = Table([[Paragraph('ID', style_table_header), Paragraph('Status', style_table_header), Paragraph('Finding', style_table_header)]] + d1_rows,
                  colWidths=d1_col_w, repeatRows=1)
d1_style = [
    ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER_COLOR),
    ('TEXTCOLOR', (0, 0), (-1, 0), TABLE_HEADER_TEXT),
    ('GRID', (0, 0), (-1, -1), 0.4, colors.HexColor('#b0b8bc')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('LEFTPADDING', (0, 0), (-1, -1), 5),
    ('RIGHTPADDING', (0, 0), (-1, -1), 5),
]
for i in range(1, len(d1_rows)+1):
    bg = TABLE_ROW_EVEN if i % 2 == 1 else TABLE_ROW_ODD
    d1_style.append(('BACKGROUND', (0, i), (-1, i), bg))
d1_table.setStyle(TableStyle(d1_style))
story.append(d1_table)
story.append(PageBreak())

# ══════════════════════════════════════════════
# DOMAIN 2
# ══════════════════════════════════════════════
story.append(p('Domain 2: TypeScript Strictness &amp; Type Safety', style_h1))
story.append(p('7 checks', style_body_muted))
story.append(section_divider())

domain2 = [
    ('2.1', 'PASS', 'typecheck zero errors'),
    ('2.2', 'PASS', 'No "any" types'),
    ('2.3', 'PASS', 'Array index accesses use ?. or ??'),
    ('2.4', 'PASS', 'Project type consolidated'),
    ('2.5', 'PASS', 'FallbackProps.error typed as unknown'),
    ('2.6', 'LOW',  'Several callbacks rely on implicit inference (ContactSection handleChange, Terminal executeCommand)'),
    ('2.7', 'PASS', 'No @ts-ignore or @ts-expect-error'),
]
d2_rows = [[Paragraph(cid, style_table_cell_center), severity_label(sev), Paragraph(desc, style_table_cell)]
           for cid, sev, desc in domain2]
d2_table = Table(
    [[Paragraph('ID', style_table_header), Paragraph('Status', style_table_header), Paragraph('Finding', style_table_header)]] + d2_rows,
    colWidths=d1_col_w, repeatRows=1
)
d2_style = list(d1_style)  # copy base style
for i in range(1, len(d2_rows)+1):
    bg = TABLE_ROW_EVEN if i % 2 == 1 else TABLE_ROW_ODD
    d2_style.append(('BACKGROUND', (0, i), (-1, i), bg))
d2_table.setStyle(TableStyle(d2_style))
story.append(d2_table)

# ══════════════════════════════════════════════
# DOMAIN 3
# ══════════════════════════════════════════════
story.append(Spacer(1, 6*mm))
story.append(p('Domain 3: Design System Fidelity', style_h1))
story.append(p('9 checks', style_body_muted))
story.append(section_divider())

domain3 = [
    ('3.1', 'PASS', 'All var() references resolve to @theme tokens'),
    ('3.2', 'PASS', 'No border-radius violations'),
    ('3.3', 'PASS', 'Typography hierarchy correct'),
    ('3.4', 'LOW',  'Non-grid spacing: Navigation dot gap="8px", Terminal input gap="8px" instead of var(--spacing-quarter)'),
    ('3.5', 'PASS', 'Day/Night theme all colors have both variants'),
    ('3.6', 'PASS', 'FOUC prevention'),
    ('3.7', 'PASS', 'data-theme targets html consistently'),
    ('3.8', 'PASS', 'No forbidden fonts'),
    ('3.9', 'PASS', 'Scrollbar border-radius: 0'),
]
d3_rows = [[Paragraph(cid, style_table_cell_center), severity_label(sev), Paragraph(desc, style_table_cell)]
           for cid, sev, desc in domain3]
d3_table = Table(
    [[Paragraph('ID', style_table_header), Paragraph('Status', style_table_header), Paragraph('Finding', style_table_header)]] + d3_rows,
    colWidths=d1_col_w, repeatRows=1
)
d3_style = [
    ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER_COLOR),
    ('TEXTCOLOR', (0, 0), (-1, 0), TABLE_HEADER_TEXT),
    ('GRID', (0, 0), (-1, -1), 0.4, colors.HexColor('#b0b8bc')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('LEFTPADDING', (0, 0), (-1, -1), 5),
    ('RIGHTPADDING', (0, 0), (-1, -1), 5),
]
for i in range(1, len(d3_rows)+1):
    bg = TABLE_ROW_EVEN if i % 2 == 1 else TABLE_ROW_ODD
    d3_style.append(('BACKGROUND', (0, i), (-1, i), bg))
d3_table.setStyle(TableStyle(d3_style))
story.append(d3_table)
story.append(PageBreak())

# ══════════════════════════════════════════════
# DOMAIN 4
# ══════════════════════════════════════════════
story.append(p('Domain 4: Component Quality &amp; React Best Practices', style_h1))
story.append(p('9 checks', style_body_muted))
story.append(section_divider())

domain4 = [
    ('4.1', 'MODERATE', 'BlogSection has only "Coming Soon" with no loading/error state; Terminal has no empty state after "clear"; Footer wrapped in Suspense only'),
    ('4.2', 'MODERATE', 'AccessibilityProvider provides context but no component consumes useAccessibility(). Three components use standalone useReducedMotion() hook directly'),
    ('4.3', 'LOW',      'rate-limit.ts has setInterval never cleared'),
    ('4.4', 'LOW',      'Terminal.tsx uses key={index} for output lines'),
    ('4.5', 'MODERATE', 'ContactSection handleChange depends on "errors" in dependency array causing re-renders'),
    ('4.6', 'PASS',     'useReducedMotion respected in all animation components'),
    ('4.7', 'PASS',     'Components use --color- prefix convention'),
    ('4.8', 'PASS',     'ARIA attributes on interactive widgets'),
    ('4.9', 'HIGH',     '108 inline style={{}} occurrences across 25 active files vs only 7 className uses. Tailwind CSS v4 is a dependency but almost entirely bypassed.'),
]
d4_rows = [[Paragraph(cid, style_table_cell_center), severity_label(sev), Paragraph(desc, style_table_cell)]
           for cid, sev, desc in domain4]
d4_table = Table(
    [[Paragraph('ID', style_table_header), Paragraph('Status', style_table_header), Paragraph('Finding', style_table_header)]] + d4_rows,
    colWidths=d1_col_w, repeatRows=1
)
d4_style = [
    ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER_COLOR),
    ('TEXTCOLOR', (0, 0), (-1, 0), TABLE_HEADER_TEXT),
    ('GRID', (0, 0), (-1, -1), 0.4, colors.HexColor('#b0b8bc')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('LEFTPADDING', (0, 0), (-1, -1), 5),
    ('RIGHTPADDING', (0, 0), (-1, -1), 5),
]
for i in range(1, len(d4_rows)+1):
    bg = TABLE_ROW_EVEN if i % 2 == 1 else TABLE_ROW_ODD
    d4_style.append(('BACKGROUND', (0, i), (-1, i), bg))
d4_table.setStyle(TableStyle(d4_style))
story.append(d4_table)

# ══════════════════════════════════════════════
# DOMAIN 5
# ══════════════════════════════════════════════
story.append(Spacer(1, 6*mm))
story.append(p('Domain 5: Security &amp; API Hardening', style_h1))
story.append(p('8 checks', style_body_muted))
story.append(section_divider())

domain5 = [
    ('5.1', 'PASS',     'Contact API input validation'),
    ('5.2', 'MODERATE', 'Rate limiter cleanup threshold hardcoded to 60s; algorithm is token bucket not sliding window; getClientIp falls back to "127.0.0.1" sharing bucket'),
    ('5.3', 'PASS',     'No hardcoded credentials'),
    ('5.4', 'PASS',     'CORS configuration appropriate'),
    ('5.5', 'PASS',     'dangerouslySetInnerHTML uses are safe (JSON-LD + ThemeScript)'),
    ('5.6', 'PASS',     'Environment variable handling'),
    ('5.7', 'PASS',     'Database queries parameterized'),
    ('5.8', 'PASS',     'Error responses don\'t leak internals'),
]
d5_rows = [[Paragraph(cid, style_table_cell_center), severity_label(sev), Paragraph(desc, style_table_cell)]
           for cid, sev, desc in domain5]
d5_table = Table(
    [[Paragraph('ID', style_table_header), Paragraph('Status', style_table_header), Paragraph('Finding', style_table_header)]] + d5_rows,
    colWidths=d1_col_w, repeatRows=1
)
d5_style = list(d4_style[:8])  # base styles only
for i in range(1, len(d5_rows)+1):
    bg = TABLE_ROW_EVEN if i % 2 == 1 else TABLE_ROW_ODD
    d5_style.append(('BACKGROUND', (0, i), (-1, i), bg))
d5_table.setStyle(TableStyle(d5_style))
story.append(d5_table)
story.append(PageBreak())

# ══════════════════════════════════════════════
# DOMAIN 6
# ══════════════════════════════════════════════
story.append(p('Domain 6: Performance &amp; Bundle Analysis', style_h1))
story.append(p('8 checks', style_body_muted))
story.append(section_divider())

domain6 = [
    ('6.1', 'PASS',     'Build succeeds'),
    ('6.2', 'PASS',     'Dynamic imports for heavy components'),
    ('6.3', 'MODERATE', 'ProjectCard uses raw &lt;img&gt; tag instead of Next.js Image component'),
    ('6.4', 'PASS',     'Font loading strategy'),
    ('6.5', 'MODERATE', 'BlogSection and Footer are Client Components unnecessarily'),
    ('6.6', 'PASS',     'No redundant CSS'),
    ('6.7', 'LOW',      'HeroKinetic uses JS-driven animation where CSS @keyframes would suffice'),
    ('6.8', 'PASS',     'Error boundary wrapping is correct'),
]
d6_rows = [[Paragraph(cid, style_table_cell_center), severity_label(sev), Paragraph(desc, style_table_cell)]
           for cid, sev, desc in domain6]
d6_table = Table(
    [[Paragraph('ID', style_table_header), Paragraph('Status', style_table_header), Paragraph('Finding', style_table_header)]] + d6_rows,
    colWidths=d1_col_w, repeatRows=1
)
d6_style = [
    ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER_COLOR),
    ('TEXTCOLOR', (0, 0), (-1, 0), TABLE_HEADER_TEXT),
    ('GRID', (0, 0), (-1, -1), 0.4, colors.HexColor('#b0b8bc')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('LEFTPADDING', (0, 0), (-1, -1), 5),
    ('RIGHTPADDING', (0, 0), (-1, -1), 5),
]
for i in range(1, len(d6_rows)+1):
    bg = TABLE_ROW_EVEN if i % 2 == 1 else TABLE_ROW_ODD
    d6_style.append(('BACKGROUND', (0, i), (-1, i), bg))
d6_table.setStyle(TableStyle(d6_style))
story.append(d6_table)

# ══════════════════════════════════════════════
# DOMAIN 7
# ══════════════════════════════════════════════
story.append(Spacer(1, 6*mm))
story.append(p('Domain 7: Accessibility — WCAG AAA Target', style_h1))
story.append(p('8 checks', style_body_muted))
story.append(section_divider())

domain7 = [
    ('7.1', 'PASS',     'Semantic HTML heading hierarchy'),
    ('7.2', 'PASS',     'Color contrast ratios in both themes'),
    ('7.3', 'MODERATE', '"View Work" link bypasses hash routing system; Navigation doesn\'t highlight "Projects" as active'),
    ('7.4', 'PASS',     'prefers-reduced-motion respected'),
    ('7.5', 'PASS',     'ARIA attributes on custom widgets'),
    ('7.6', 'PASS',     'Focus management on hash route changes'),
    ('7.7', 'MODERATE', 'Mobile menu uses role="dialog" + aria-modal="true" but does not trap focus'),
    ('7.8', 'PASS',     'Form accessibility'),
]
d7_rows = [[Paragraph(cid, style_table_cell_center), severity_label(sev), Paragraph(desc, style_table_cell)]
           for cid, sev, desc in domain7]
d7_table = Table(
    [[Paragraph('ID', style_table_header), Paragraph('Status', style_table_header), Paragraph('Finding', style_table_header)]] + d7_rows,
    colWidths=d1_col_w, repeatRows=1
)
d7_style = list(d6_style[:8])
for i in range(1, len(d7_rows)+1):
    bg = TABLE_ROW_EVEN if i % 2 == 1 else TABLE_ROW_ODD
    d7_style.append(('BACKGROUND', (0, i), (-1, i), bg))
d7_table.setStyle(TableStyle(d7_style))
story.append(d7_table)

# ══════════════════════════════════════════════
# DOMAIN 8
# ══════════════════════════════════════════════
story.append(Spacer(1, 6*mm))
story.append(p('Domain 8: Technical Debt &amp; Dead Code Audit', style_h1))
story.append(p('9 checks', style_body_muted))
story.append(section_divider())

domain8 = [
    ('8.1', 'MODERATE', '15 archived components, 5 archived lib files, 2 archived hooks with unresolved CSS variables'),
    ('8.2', 'LOW',      '3 console.log/error/warn instances'),
    ('8.3', 'LOW',      '1 TODO in contact route'),
    ('8.4', 'PASS',     'No unused imports'),
    ('8.5', 'PASS',     'No hardcoded credentials'),
    ('8.6', 'MODERATE', 'Analytics table schema exists but nothing writes to it'),
    ('8.7', 'LOW',      'Missing portrait assets referenced by archived data.ts'),
    ('8.8', 'PASS',     'npm audit: 0 vulnerabilities'),
    ('8.9', 'MODERATE', 'AccessibilityProvider vs useReducedMotion redundancy (same as 4.2)'),
]
d8_rows = [[Paragraph(cid, style_table_cell_center), severity_label(sev), Paragraph(desc, style_table_cell)]
           for cid, sev, desc in domain8]
d8_table = Table(
    [[Paragraph('ID', style_table_header), Paragraph('Status', style_table_header), Paragraph('Finding', style_table_header)]] + d8_rows,
    colWidths=d1_col_w, repeatRows=1
)
d8_style = [
    ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER_COLOR),
    ('TEXTCOLOR', (0, 0), (-1, 0), TABLE_HEADER_TEXT),
    ('GRID', (0, 0), (-1, -1), 0.4, colors.HexColor('#b0b8bc')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('LEFTPADDING', (0, 0), (-1, -1), 5),
    ('RIGHTPADDING', (0, 0), (-1, -1), 5),
]
for i in range(1, len(d8_rows)+1):
    bg = TABLE_ROW_EVEN if i % 2 == 1 else TABLE_ROW_ODD
    d8_style.append(('BACKGROUND', (0, i), (-1, i), bg))
d8_table.setStyle(TableStyle(d8_style))
story.append(d8_table)
story.append(PageBreak())

# ══════════════════════════════════════════════
# CONSOLIDATED REMEDIATION PLAN
# ══════════════════════════════════════════════
story.append(p('Consolidated Remediation Plan', style_h1))
story.append(p('Prioritized by impact and effort', style_body_muted))
story.append(section_divider())

remed_headers = ['Priority', 'ID', 'Title', 'Effort', 'Impact']
remed_data = [
    ['P1',  '4.9',   'Migrate inline styles to Tailwind CSS utilities', 'Large', 'High'],
    ['P2',  '7.3',   'Wire "View Work" link to hash router', 'Small', 'High'],
    ['P3',  '7.7',   'Add focus trap to mobile menu dialog', 'Small', 'High'],
    ['P4',  '4.5',   'Fix ContactSection re-render issue', 'Small', 'Medium'],
    ['P5',  '6.3',   'Replace raw img with Next.js Image', 'Small', 'Medium'],
    ['P6',  '5.2',   'Fix rate limiter edge cases', 'Small', 'Medium'],
    ['P7',  '4.2/8.9', 'Consolidate AccessibilityProvider + useReducedMotion', 'Medium', 'Medium'],
    ['P8',  '8.6',   'Remove or implement analytics schema', 'Small', 'Low'],
    ['P9',  '6.5',   'Convert static Client Components to Server Components', 'Small', 'Low'],
    ['P10', '4.1',   'Add missing UI states', 'Small', 'Low'],
    ['P11', '1.3',   'Sync URL hash on invalid navigation', 'Small', 'Low'],
    ['P12', '1.8',   'Remove "use client" from not-found.tsx', 'Trivial', 'Low'],
    ['P13', '3.4',   'Replace hardcoded 8px with grid variables', 'Trivial', 'Low'],
]

remed_col_w = [16*mm, 14*mm, usable_w - 52*mm, 16*mm, 14*mm]  # adjusted to fit

# Build with Paragraph cells for text wrapping
remed_table_data = [[Paragraph(h, style_table_header) for h in remed_headers]]
for row in remed_data:
    remed_table_data.append([
        Paragraph(row[0], style_table_cell_center),
        Paragraph(row[1], style_table_cell_center),
        Paragraph(row[2], style_table_cell),
        Paragraph(row[3], style_table_cell_center),
        Paragraph(row[4], style_table_cell_center),
    ])

remed_table = Table(remed_table_data, colWidths=remed_col_w, repeatRows=1)
remed_style_cmds = [
    ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER_COLOR),
    ('TEXTCOLOR', (0, 0), (-1, 0), TABLE_HEADER_TEXT),
    ('GRID', (0, 0), (-1, -1), 0.4, colors.HexColor('#b0b8bc')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('LEFTPADDING', (0, 0), (-1, -1), 5),
    ('RIGHTPADDING', (0, 0), (-1, -1), 5),
]
for i in range(1, len(remed_table_data)):
    bg = TABLE_ROW_EVEN if i % 2 == 1 else TABLE_ROW_ODD
    remed_style_cmds.append(('BACKGROUND', (0, i), (-1, i), bg))
remed_table.setStyle(TableStyle(remed_style_cmds))
story.append(remed_table)
story.append(PageBreak())

# ══════════════════════════════════════════════
# KEY RECOMMENDATIONS WITH CODE EXAMPLES
# ══════════════════════════════════════════════
story.append(p('Key Recommendations with Code Examples', style_h1))
story.append(section_divider())

# Rec 4.9
story.append(p('Rec 4.9: Migrate Inline Styles to Tailwind (Phased)', style_h2))
story.append(p(
    '<b>Phase 1:</b> Define Tailwind theme extensions. The @theme block already defines CSS custom properties. '
    'Tailwind v4 maps @theme vars to utility classes automatically.'
))
story.append(p(
    '<b>Phase 2:</b> Create reusable component classes in globals.css using @apply:'
))
code_4_9 = (
    '@layer components {<br/>'
    '&nbsp;&nbsp;.brutal-card {<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;@apply border-2 border-border bg-surface shadow-brutal-sm p-grid;<br/>'
    '&nbsp;&nbsp;}<br/>'
    '&nbsp;&nbsp;.brutal-btn {<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;@apply font-mono text-xs uppercase tracking-wider<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;px-half py-quarter border-2 border-border<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rounded-none cursor-pointer transition-fast;<br/>'
    '&nbsp;&nbsp;}<br/>'
    '}'
)
story.append(code_block(code_4_9))
story.append(p(
    '<b>Phase 3:</b> Migrate components incrementally from simple (Footer, BlogSection) to complex (ContactSection, Navigation).'
))
story.append(p('<b>Phase 4:</b> Remove inline style objects from data objects.'))
story.append(Spacer(1, 4*mm))

# Rec 7.3
story.append(p('Rec 7.3: Wire "View Work" Link', style_h2))
story.append(p('Pass onNavigate prop to HeroKinetic:'))
code_7_3 = (
    'interface HeroKineticProps {<br/>'
    '&nbsp;&nbsp;readonly onNavigate: (section: string) =&gt; void;<br/>'
    '}<br/>'
    '// In the link:<br/>'
    'onClick={(e) =&gt; { e.preventDefault(); onNavigate("#projects"); }}'
)
story.append(code_block(code_7_3))
story.append(Spacer(1, 4*mm))

# Rec 7.7
story.append(p('Rec 7.7: Focus Trap for Mobile Menu', style_h2))
story.append(p('Add keydown handler in Navigation useEffect:'))
code_7_7 = (
    'const handleTabTrap = (e: KeyboardEvent) =&gt; {<br/>'
    '&nbsp;&nbsp;if (e.key !== "Tab") return;<br/>'
    '&nbsp;&nbsp;if (e.shiftKey &amp;&amp; document.activeElement === first) {<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;e.preventDefault(); last.focus();<br/>'
    '&nbsp;&nbsp;} else if (!e.shiftKey &amp;&amp; document.activeElement === last) {<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;e.preventDefault(); first.focus();<br/>'
    '&nbsp;&nbsp;}<br/>'
    '};'
)
story.append(code_block(code_7_7))
story.append(Spacer(1, 4*mm))

# Rec 4.5
story.append(p('Rec 4.5: Fix ContactSection Re-render', style_h2))
story.append(p('Use functional update to remove "errors" dependency:'))
code_4_5 = (
    'const handleChange = useCallback(<br/>'
    '&nbsp;&nbsp;(field) =&gt; (e) =&gt; {<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;setFormData((prev) =&gt; ({ ...prev, [field]: e.target.value }));<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;setErrors((prev) =&gt; prev[field]<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;? { ...prev, [field]: undefined }<br/>'
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: prev);<br/>'
    '&nbsp;&nbsp;},<br/>'
    '&nbsp;&nbsp;[],&nbsp;&nbsp;// No more "errors" dependency<br/>'
    ');'
)
story.append(code_block(code_4_5))
story.append(Spacer(1, 4*mm))

# Rec 5.2
story.append(p('Rec 5.2: Fix Rate Limiter', style_h2))
story.append(bullet('Use dynamic maxWindowMs for cleanup threshold'))
story.append(bullet('Rename from "sliding window" to "token bucket"'))
story.append(bullet('Log warning when no client IP detected instead of falling back to shared bucket'))
story.append(Spacer(1, 4*mm))

# Rec 8.6
story.append(p('Rec 8.6: Analytics Schema', style_h2))
story.append(bullet('<b>Option A:</b> Remove dead schema.'))
story.append(bullet('<b>Option B:</b> Implement middleware page view tracking.'))
story.append(PageBreak())

# ══════════════════════════════════════════════
# APPENDIX A
# ══════════════════════════════════════════════
story.append(p('Appendix A: Inline Style Census', style_h1))
story.append(p('Top files by inline style count', style_body_muted))
story.append(section_divider())

census_data = [
    ('ProjectCard.tsx',      '11'),
    ('ContactSection.tsx',   '8'),
    ('Navigation.tsx',       '8'),
    ('Timeline.tsx',         '8'),
    ('HeroKinetic.tsx',      '6'),
    ('Terminal.tsx',         '6'),
    ('SkillsSection.tsx',    '6'),
    ('BentoGrid.tsx',        '5'),
    ('not-found.tsx',        '5'),
    ('page.tsx',             '5'),
    ('ProjectsSection.tsx',  '4'),
    ('ErrorBoundary.tsx',    '4'),
    ('Footer.tsx',           '4'),
    ('error.tsx',            '4'),
    ('BlogSection.tsx',      '3'),
    ('PortfolioApp.tsx',     '3'),
    ('SectionBlock.tsx',     '2'),
    ('Others',               '1 each'),
]

census_col_w = [usable_w * 0.6, usable_w * 0.4]
census_table_data = [
    [Paragraph('File', style_table_header), Paragraph('Inline Style Count', style_table_header)]
]
for fname, count in census_data:
    census_table_data.append([
        Paragraph(fname, ParagraphStyle('MonoCell', fontName='Carlito', fontSize=9, leading=13, textColor=TEXT_PRIMARY)),
        Paragraph(count, style_table_cell_center),
    ])

# Total row
census_table_data.append([
    Paragraph('<b>Total: 108 inline style instances across 25 active files</b>',
              ParagraphStyle('TotalCell', fontName='Carlito-Bold', fontSize=9, leading=13, textColor=ACCENT)),
    Paragraph('', style_table_cell_center),
])

census_table = Table(census_table_data, colWidths=census_col_w, repeatRows=1)
census_style_cmds = [
    ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER_COLOR),
    ('TEXTCOLOR', (0, 0), (-1, 0), TABLE_HEADER_TEXT),
    ('GRID', (0, 0), (-1, -1), 0.4, colors.HexColor('#b0b8bc')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('LEFTPADDING', (0, 0), (-1, -1), 5),
    ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    # Total row
    ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#e8f0f5')),
    ('SPAN', (0, -1), (-1, -1)),
    ('LINEABOVE', (0, -1), (-1, -1), 1.2, ACCENT),
]
for i in range(1, len(census_table_data) - 1):
    bg = TABLE_ROW_EVEN if i % 2 == 1 else TABLE_ROW_ODD
    census_style_cmds.append(('BACKGROUND', (0, i), (-1, i), bg))
census_table.setStyle(TableStyle(census_style_cmds))
story.append(census_table)

# ══════════════════════════════════════════════
# BUILD PDF
# ══════════════════════════════════════════════
doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
print(f'PDF generated successfully: {OUTPUT_PATH}')
