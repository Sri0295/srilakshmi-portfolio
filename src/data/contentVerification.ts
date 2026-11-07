/**
 * CONTENT VERIFICATION REGISTRY
 * ------------------------------
 * Every résumé-reported number lives here with a verification status.
 * Metrics with status 'unverified' are NOT rendered anywhere on the site —
 * they appear only in CONTENT_AUDIT.md. To publish a metric:
 *
 *   1. Re-derive it from the project's actual results (test split, logs,
 *      notebook output, dashboard screenshots).
 *   2. Fill in `methodology` (dataset, split, evaluation conditions).
 *   3. Flip `status` to 'verified'. The UI will then show it with a
 *      count-up animation and an explanation of the methodology.
 */

export type VerificationStatus = 'verified' | 'unverified'

export interface MetricClaim {
  id: string
  /** Short label used in UI (only when verified) */
  label: string
  /** Raw value for count-up animation */
  value: number
  /** Formatted display string, e.g. '92%', '20,000+' */
  display: string
  /** What the number measures */
  context: string
  /** Which résumé(s) claim it */
  source: 'résumé v1' | 'résumé v2' | 'both résumés'
  status: VerificationStatus
  /** Owner fills this in when verifying — required before publication */
  methodology?: string
  /** What the owner needs to check to verify it */
  verifyBy: string
}

export const metrics: Record<string, MetricClaim> = {
  codePlatformSamples: {
    id: 'codePlatformSamples',
    label: 'Labelled Python code samples',
    value: 20000,
    display: '20,000',
    context: 'curated to train and validate the bug-prediction model',
    source: 'résumé v2',
    status: 'unverified',
    verifyBy:
      'Confirm the dataset in the NEW_SRI repository (or wherever it is stored): row count, labelling process, and train/validation split.',
  },
  codePlatformAccuracy: {
    id: 'codePlatformAccuracy',
    label: 'Bug-prediction accuracy',
    value: 92,
    display: '92%',
    context: 'XGBoost model across 100 bug categories',
    source: 'résumé v2',
    status: 'unverified',
    verifyBy:
      'Re-run evaluation and record: test split ratio, random seed, and whether accuracy is micro/macro averaged across the 100 classes.',
  },
  codePlatformF1: {
    id: 'codePlatformF1',
    label: 'Bug-prediction F1-score',
    value: 92,
    display: '92%',
    context: 'XGBoost model across 100 bug categories',
    source: 'résumé v2',
    status: 'unverified',
    verifyBy:
      'Record the F1 averaging method (macro / micro / weighted) and per-class behaviour before publishing.',
  },
  codePlatformCategories: {
    id: 'codePlatformCategories',
    label: 'Bug categories predicted',
    value: 100,
    display: '100',
    context: 'distinct bug classes in the prediction model',
    source: 'résumé v2',
    status: 'unverified',
    verifyBy: 'Count the distinct classes in the model’s label set.',
  },
  drAccuracy: {
    id: 'drAccuracy',
    label: 'DR classification accuracy',
    value: 96,
    display: '96%',
    context: 'CNN across five diabetic-retinopathy severity stages',
    source: 'résumé v2',
    status: 'unverified',
    verifyBy:
      'Confirm the test split, image dataset (e.g. APTOS / EyePACS), and whether 96% is overall accuracy or another measure.',
  },
  haarAccuracy: {
    id: 'haarAccuracy',
    label: 'Face-detection accuracy',
    value: 90,
    display: '90%',
    context: 'tuned Haar Cascade detector on annotated grayscale datasets',
    source: 'résumé v2',
    status: 'unverified',
    verifyBy:
      'Clarify how accuracy was computed (precision/recall/IoU threshold) and on which annotated dataset.',
  },
  salesRecords: {
    id: 'salesRecords',
    label: 'Sales records cleaned & analysed',
    value: 10000,
    display: '10,000+',
    context: 'cleaned and validated with Python (Pandas, NumPy)',
    source: 'résumé v2',
    status: 'unverified',
    verifyBy: 'Confirm the row count in the source dataset in the Sales-Data-Analysis repository.',
  },
  salesProfitCorrelation: {
    id: 'salesProfitCorrelation',
    label: 'Sales–Profit correlation',
    value: 0.83,
    display: 'r = 0.83',
    context: 'strong relationship uncovered during exploratory analysis',
    source: 'résumé v2',
    status: 'unverified',
    verifyBy: 'Re-compute Pearson r on the cleaned dataset and record the method.',
  },
  laptopSalesShare: {
    id: 'laptopSalesShare',
    label: 'Laptops’ share of sales',
    value: 22,
    display: '22%',
    context: 'identified as a key contributing category',
    source: 'résumé v2',
    status: 'unverified',
    verifyBy: 'Confirm against the Power BI dashboard measure.',
  },
  westRegionShare: {
    id: 'westRegionShare',
    label: 'West region’s share of sales',
    value: 28,
    display: '28%',
    context: 'identified as the strongest region',
    source: 'résumé v2',
    status: 'unverified',
    verifyBy: 'Confirm against the Power BI dashboard measure.',
  },
}

export type MetricId = keyof typeof metrics
export type MetricClaimMap = typeof metrics

export const isPublished = (m: MetricClaim) => m.status === 'verified'

/** True while any metric is still pending owner verification. */
export const hasPendingMetrics = Object.values(metrics).some((m) => m.status === 'unverified')
