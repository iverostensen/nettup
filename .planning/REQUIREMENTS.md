# Requirements: Nettup v1.2 Smart Priskalkulator

**Defined:** 2026-03-06
**Core Value:** En potensiell kunde som lander pa siden skal umiddelbart forsta at Nettup leverer moderne nettsider raskt — og at kvaliteten beviser det.

## v1.2 Requirements

Requirements for the smart additive price calculator. Each maps to roadmap phases.

### Prismotor

- [x] **PRIS-01**: Pricing config file (TS) defines base prices, add-ons, and monthly costs per service
- [ ] **PRIS-02**: Additive calculation engine computes total from base + selected add-ons
- [ ] **PRIS-03**: Result displays a min-max range estimate with "estimat" disclaimer
- [ ] **PRIS-04**: Launch discount (40%) applied to calculated one-time prices

### Wizard

- [ ] **WIZARD-01**: Category-based flow: Goal → Size → Features → Integrations → Design → Result
- [ ] **WIZARD-02**: User can navigate back to any previous step without losing selections
- [ ] **WIZARD-03**: Progress indicator shows current step and total steps
- [ ] **WIZARD-04**: Multi-select for features/integrations, single-select for size/design

### Resultat

- [ ] **RES-01**: Line-item breakdown showing each selected add-on with price contribution
- [ ] **RES-02**: CTA links to /kontakt with service type pre-filled
- [ ] **RES-03**: Launch discount shown as crossed-out original + discounted price

### Plassering

- [ ] **PAGE-01**: Dedicated /priskalkulator page with full calculator
- [ ] **PAGE-02**: Calculator also embedded as section on /tjenester
- [ ] **PAGE-03**: Old PrisKalkulatorIsland replaced by new calculator component

## Future Requirements

### v1.3 Candidates

- **RES-FUTURE-01**: Monthly cost breakdown (additive per feature/integration)
- **RES-FUTURE-02**: Descriptions per option explaining what each feature means
- **UX-FUTURE-01**: Running total updating in real-time as user selects options
- **LEAD-FUTURE-01**: PDF/email summary of estimate for lead capture
- **UX-FUTURE-02**: Preset packages (Enkel/Standard/Premium) as quick-select that pre-fills calculator

## Out of Scope

| Feature | Reason |
|---------|--------|
| Free-text requirements input | Creates analysis paralysis, produces garbage data |
| Exact fixed quotes | Creates binding expectations; always use ranges |
| Competitor price comparison | Legally risky, hard to maintain |
| Hourly rate display | Invites hour negotiation, not value-based pricing |
| Complex conditional branching | Makes config unmaintainable; keep flat additive model |
| Account/save progress | Calculator takes <2 min, no persistence needed |
| Internal admin UI | Config file IS the internal tool for now |
| Animated price counter | Gimmicky; Norwegian SMBs prefer substance over flash |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| PRIS-01 | Phase 13 | Complete |
| PRIS-02 | Phase 13 | Pending |
| PRIS-03 | Phase 15 | Pending |
| PRIS-04 | Phase 13 | Pending |
| WIZARD-01 | Phase 14 | Pending |
| WIZARD-02 | Phase 14 | Pending |
| WIZARD-03 | Phase 14 | Pending |
| WIZARD-04 | Phase 14 | Pending |
| RES-01 | Phase 15 | Pending |
| RES-02 | Phase 15 | Pending |
| RES-03 | Phase 15 | Pending |
| PAGE-01 | Phase 16 | Pending |
| PAGE-02 | Phase 16 | Pending |
| PAGE-03 | Phase 16 | Pending |

**Coverage:**
- v1.2 requirements: 14 total
- Mapped to phases: 14
- Unmapped: 0

---
*Requirements defined: 2026-03-06*
*Last updated: 2026-03-06 after roadmap creation*
