import {
    differenceInCalendarMonths,
    format,
    parse as parseDate,
    startOfMonth,
} from "date-fns";
import { parse as parseTime } from "tinyduration";

import { formatHoursCompact } from "@/lib/utils";

const MS_AGREEMENT_MONTHS = 12;
const MS_STOP_BILLING_MULTIPLE = 3;
const MS_ROLLOVER_WARNING_MULTIPLE = 2.5;
const MS_LOW_BALANCE_RATIO = 0.25;
const BUDGET_WARNING_PCT = 75;
const BUDGET_CRITICAL_PCT = 90;

export type EngagementHealthLevel = "healthy" | "watch" | "critical";

export type EngagementHealthCode =
    | "HEALTHY"
    | "MS_LOW_BALANCE"
    | "MS_HIGH_ROLLOVER"
    | "MS_STOP_BILLING"
    | "MS_OVERDRAWN"
    | "BUDGET_LOW"
    | "BUDGET_CRITICAL"
    | "BUDGET_DEPLETED"
    | "BUDGET_OVER";

export interface EngagementHealth {
    level: EngagementHealthLevel;
    code: EngagementHealthCode;
    label: string;
    reason: string;
    rank: number;
}

/**
 * Wrapper for Clockify project data. Centralizes parsing of JSON data
 * that comes from Clockify and normalizes the monitoring semantics
 * used throughout the app.
 */
export default class ClockifyProject {
    private _data: ClockifyJSON;

    constructor(data: ClockifyJSON) {
        this._data = data;
    }

    // Name of the client
    get name() {
        return this._data.client.name;
    }

    // Full name of the project (used to parse additional information)
    get fullName() {
        return this._data.name;
    }

    // Agreement/project start month encoded in the Clockify project name.
    get startDate() {
        const rawDate = this.fullName.match(/\d{1,2}-\d{4}/g)?.[0];

        if (!rawDate) {
            return null;
        }

        return parseDate(rawDate, "MM-yyyy", new Date());
    }

    get startDateLabel() {
        return this.startDate ? format(this.startDate, "MMM yyyy") : null;
    }

    // Backwards-compatible display name used by charts.
    get nameWithDate() {
        return this.startDateLabel
            ? `${this.name} (${format(this.startDate as Date, "MM-yyyy")})`
            : this.name;
    }

    // Type of project (MS, Block, Project)
    get type() {
        return this._data.customFields[0]?.value ?? "Project";
    }

    get typeLabel() {
        if (this.type === "Managed Services") {
            return "Managed Services";
        }
        if (this.type === "Block Hours") {
            return "Block Hours";
        }
        return "Project";
    }

    get typeShortLabel() {
        if (this.type === "Managed Services") {
            return "MS";
        }
        if (this.type === "Block Hours") {
            return "Block";
        }
        return "Project";
    }

    get engagementMeta() {
        return this.startDateLabel
            ? `${this.typeShortLabel} · Started ${this.startDateLabel}`
            : this.typeShortLabel;
    }

    // Unique ID of project
    get uid() {
        return this._data.id;
    }

    // Clockify client ID
    get clientId() {
        return this._data.clientId;
    }

    // If hours include non-billable time
    get includesNonBillable() {
        return this._data.timeEstimate.includeNonBillable;
    }

    private durationToHours(duration: string) {
        const parsed = parseTime(duration);
        const days = parsed.days ?? 0;
        const hours = parsed.hours ?? 0;
        const minutes = parsed.minutes ?? 0;

        return days * 24 + hours + minutes / 60;
    }

    // Current accrued/project budget in Clockify.
    // For MS this is expected to be the cumulative entitlement through
    // the current service month, not the full future contract value.
    get totalHours() {
        return this.durationToHours(this._data.timeEstimate.estimate);
    }

    // Number of hours logged to project as decimal
    get hoursLogged() {
        return this.durationToHours(this._data.duration);
    }

    get hoursRemainingValue() {
        return this.totalHours - this.hoursLogged;
    }

    // Number of hours remaining to project as decimal string.
    // Kept for existing chart/table consumers.
    get hoursRemaining() {
        return this.hoursRemainingValue.toFixed(2);
    }

    get balanceLabel() {
        if (this.hoursRemainingValue < 0) {
            return `${formatHoursCompact(this.hoursRemainingValue)} over`;
        }

        const duration = formatHoursCompact(this.hoursRemainingValue);

        return this.type === "Managed Services"
            ? `${duration} available`
            : `${duration} remaining`;
    }

    // Percent of hours logged against the currently accrued/project total.
    get pctHoursUsed() {
        if (this.totalHours <= 0) {
            return 0;
        }

        return Math.round((this.hoursLogged / this.totalHours) * 100);
    }

    get pctHoursRemaining() {
        if (this.totalHours <= 0) {
            return 0;
        }

        return Math.max(
            0,
            Math.round((this.hoursRemainingValue / this.totalHours) * 100)
        );
    }

    // MS agreements renew annually. Capping at 12 keeps a previous agreement
    // that overlaps briefly with its renewal from artificially shrinking the
    // inferred monthly allotment.
    get accruedMonths() {
        if (this.type !== "Managed Services" || !this.startDate) {
            return null;
        }

        const elapsed =
            differenceInCalendarMonths(
                startOfMonth(new Date()),
                startOfMonth(this.startDate)
            ) + 1;

        return Math.max(1, Math.min(MS_AGREEMENT_MONTHS, elapsed));
    }

    // Clockify stores MS estimates cumulatively as each monthly entitlement
    // accrues. Infer the monthly allotment from the current cumulative estimate.
    get monthlyAllotment() {
        if (
            this.type !== "Managed Services" ||
            !this.accruedMonths ||
            this.totalHours <= 0
        ) {
            return null;
        }

        return this.totalHours / this.accruedMonths;
    }

    get rolloverMultiple() {
        if (!this.monthlyAllotment || this.monthlyAllotment <= 0) {
            return null;
        }

        return this.hoursRemainingValue / this.monthlyAllotment;
    }

    get health(): EngagementHealth {
        if (this.type === "Managed Services") {
            return this.managedServicesHealth;
        }

        return this.budgetHealth;
    }

    private get managedServicesHealth(): EngagementHealth {
        if (this.hoursRemainingValue < 0) {
            return {
                level: "critical",
                code: "MS_OVERDRAWN",
                label: "Overdrawn",
                reason: `${formatHoursCompact(
                    this.hoursRemainingValue
                )} beyond accrued hours`,
                rank: 4,
            };
        }

        if (this.rolloverMultiple !== null) {
            if (this.rolloverMultiple >= MS_STOP_BILLING_MULTIPLE) {
                return {
                    level: "critical",
                    code: "MS_STOP_BILLING",
                    label: "Stop billing",
                    reason: `${this.rolloverMultiple.toFixed(
                        1
                    )}× monthly allocation banked`,
                    rank: 5,
                };
            }

            if (this.rolloverMultiple >= MS_ROLLOVER_WARNING_MULTIPLE) {
                return {
                    level: "watch",
                    code: "MS_HIGH_ROLLOVER",
                    label: "Watch",
                    reason: `${this.rolloverMultiple.toFixed(
                        1
                    )}× monthly allocation banked`,
                    rank: 3,
                };
            }

            if (this.rolloverMultiple <= MS_LOW_BALANCE_RATIO) {
                return {
                    level: "watch",
                    code: "MS_LOW_BALANCE",
                    label: "Watch",
                    reason: `${Math.max(
                        0,
                        Math.round(this.rolloverMultiple * 100)
                    )}% of one monthly allocation available`,
                    rank: 2,
                };
            }
        }

        return {
            level: "healthy",
            code: "HEALTHY",
            label: "Healthy",
            reason:
                this.rolloverMultiple !== null
                    ? `${this.rolloverMultiple.toFixed(
                          1
                      )}× monthly allocation available`
                    : `${this.pctHoursUsed}% of accrued hours used`,
            rank: 0,
        };
    }

    private get budgetHealth(): EngagementHealth {
        if (this.hoursRemainingValue < 0) {
            return {
                level: "critical",
                code: "BUDGET_OVER",
                label: "Over budget",
                reason: `${formatHoursCompact(
                    this.hoursRemainingValue
                )} beyond budget`,
                rank: 5,
            };
        }

        if (this.hoursRemainingValue === 0) {
            return {
                level: "critical",
                code: "BUDGET_DEPLETED",
                label: "Depleted",
                reason: "No budgeted hours remaining",
                rank: 5,
            };
        }

        if (this.pctHoursUsed >= BUDGET_CRITICAL_PCT) {
            return {
                level: "critical",
                code: "BUDGET_CRITICAL",
                label: "Critical",
                reason: `${this.pctHoursUsed}% of budget used`,
                rank: 4,
            };
        }

        if (this.pctHoursUsed >= BUDGET_WARNING_PCT) {
            return {
                level: "watch",
                code: "BUDGET_LOW",
                label: "Watch",
                reason: `${this.pctHoursUsed}% of budget used`,
                rank: 2,
            };
        }

        return {
            level: "healthy",
            code: "HEALTHY",
            label: "Healthy",
            reason: `${this.pctHoursUsed}% of budget used`,
            rank: 0,
        };
    }
}

export interface ClockifyJSON {
    id: string;
    name: string;
    clientId: string;
    client: {
        name: string;
    };
    duration: string;
    timeEstimate: {
        estimate: string;
        includeNonBillable: boolean;
    };
    customFields: Array<{
        value: string;
    }>;
}
