# Personal Homepage Content Expansion Design

## Objective

Expand the bilingual personal homepage for recommendation-algorithm and machine-learning recruiting while preserving a concise editorial presentation. The page should contain more evidence than a resume, but remain scannable and must not disclose confidential company information.

## Audience And Positioning

- Primary audience: algorithm recruiters and hiring managers.
- Secondary audience: researchers and potential collaborators.
- Default language: English, with a complete Chinese mirror.
- Primary positioning: recommendation algorithms and machine learning; research provides evidence of technical depth.

## Information Architecture

The page order is:

1. Hero with name, positioning, education status, contact links, and the supplied half-body portrait.
2. Distinctions, split into Competition Awards and Personal Honors.
3. Selected Work, presented as five single-column project entries.
4. Experience.
5. Education.
6. Contact.

The navigation follows the same order: Awards, Work, Experience, Education, Contact. On desktop, the two distinctions groups share one compact row. On mobile, they stack vertically.

## Distinctions

### Competition Awards

Only the three strongest national awards are shown:

- National Grand Prize, ICBC Cup Financial Technology Innovation Competition.
- National First Prize, iCAN AI Challenge.
- National Third Prize, National College Student Information Security Contest, Team Lead.

### Personal Honors

Personal distinctions are kept separate from competition results:

- National Scholarship.
- Top Ten Student and Mazu Guang Scholarship.
- Model Outstanding Student Cadre.
- Outstanding Graduate.

## Selected Work

Every project uses its complete public name and a single-column editorial layout. Entries contain approximately 100-150 English words, with an equivalent amount of information in Chinese. The first two research entries receive slightly more visual emphasis, but all five retain enough context to explain the problem, method, personal contribution, and verified result or project boundary.

### 1. Large-scale Content Recommendation Ranking Optimization

- Affiliation: approved public employer name, Recommendation Algorithm Intern, 2026.
- Describe the general challenge as balancing candidate supply and personalized ranking quality in a large-scale content recommendation system.
- Cover privacy-safe sample construction, a DNN-based ranking model, candidate expansion, personalized reranking, ablation design, online validation, and launch ownership.
- Add a short engineering paragraph about propagating an eligibility feature through offline preparation, online serving, and vector retrieval, with layer-by-layer observability and debugging.
- Do not name the product, business surface, anchor type, internal feature, service, platform, table, topic, slot, repository, colleague, or exact experiment configuration.
- Do not publish internal business KPIs. General outcomes such as controlled validation, successful launch, and no material adverse effect on core metrics are allowed.

### 2. ToolScaler: Scalable Generative Tool Calling via Structure-Aware Semantic Tokenization

- State EMNLP 2025 Findings and second authorship.
- Explain structure-aware semantic codes, scalable representation of approximately 47k tools, constrained decoding, and unseen-tool generalization.
- Limit personal contribution to ToolBench document processing, query-tool and trajectory data construction, training support, retrieval/calling experiments, and result analysis.
- Preserve the boundary between team methodology and individual contribution.

### 3. FGAD: Feedback-Guided Anomalous Diffusion Suppression for Graph Anomaly Detection

- State first authorship and current manuscript status without implying acceptance.
- Explain anomaly-score feedback, learned edge diffusion, edge-wise structural consistency, and partitioned mini-batch training.
- Use rounded public research results: best performance on 7 of 8 datasets and approximately 92% AUC on Inj Flickr.
- Do not describe the work as a deployed production service or claim universal state of the art.

### 4. ZDC: Intelligent Anti-Money Laundering Detection Platform

- State the ICBC Cup National Grand Prize.
- State the verified role: model training and method innovation.
- Describe graph autoencoding, anomaly feedback, attribute/structure reconstruction, contrastive learning, attention-based enhancement, tuning, and explainability.
- Do not use conflicting report metrics, simulated front-end values, deployment claims, bank production data, or unsupported throughput and financial-impact claims.

### 5. Graph Anomaly Detection for Microservice Root-Cause Localization

- State the ICES research-internship context.
- Describe graph anomaly-detection baseline research, the DONE-style dual-branch model, edge-feature-aware aggregation, and migration to DGL with Lightning/Hydra configuration.
- Present the work as a research and engineering prototype, not a completed or deployed root-cause localization system.
- Do not publish unverified performance gains or data-scale claims.

## Experience

The experience timeline contains the approved public employer and generic internship title, followed by the Institute of Automation, Chinese Academy of Sciences and Harbin Institute of Technology research internships. The industry entry must not name a product or specific business.

## Portrait

Replace the current portrait with the supplied 1421 x 2132 half-body JPEG. Store only a web-facing copy in the repository, remove extended download metadata, and keep the original source untouched. Update intrinsic dimensions and verify desktop and mobile cropping.

## Quantitative Content

- Public academic and dataset facts may be rounded to approximately two significant digits where precision is not essential.
- Exact award levels and author positions remain exact.
- Internal company metrics and experiment allocations are omitted rather than merely rounded.
- Report-only or conflicting competition metrics are omitted.

## Bilingual Copy

The English and Chinese pages carry equivalent facts, ordering, links, and disclosure boundaries. Translation should sound natural in each language rather than mirror sentence structure mechanically.

## Compliance Controls

Automated checks will scan all public text for:

- prohibited product and business identifiers;
- known internal feature, service, platform, table, topic, slot, and project-specific phrases;
- exact historical company KPI values and experiment allocation details;
- phone, social-account, political-affiliation, and PDF-resume leakage.

The approved employer name and generic internship title are permitted. The compliance test must distinguish these public identity facts from prohibited internal details.

## Responsive Design

- Preserve the existing editorial visual system and color palette.
- Use single-column project entries at all breakpoints.
- Keep section numbering stable after inserting Awards before Work.
- Use explicit responsive constraints so the new portrait, long project titles, and award names cannot create horizontal overflow.
- On mobile, stack Competition Awards above Personal Honors and keep a visible hint of the next section in the first viewport.

## Verification

Before deployment:

1. Run the site contract and JavaScript syntax check.
2. Run an exact public-tree search for prohibited company-internal phrases and historical sensitive values.
3. Verify English, Chinese, and 404 pages locally.
4. Inspect desktop and 390 px mobile screenshots for both languages.
5. Confirm the portrait loads, is correctly cropped, and introduces no horizontal overflow.
6. Confirm the Git diff contains only homepage, asset, test, and approved design changes.

After deployment:

1. Confirm the remote branch points to the new commit.
2. Verify the production English, Chinese, image, and 404 URLs in a real browser.
3. Recheck visible production text for prohibited internal information.
