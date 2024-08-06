import { format, parse as parseDate } from "date-fns";
import { parse as parseTime } from "tinyduration";

/**
 * Wrapper for Clockify project data. Centralizes parsing of JSON data
 * that comes from Clockify.
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

    // Name of the client/project with start month/year
    get nameWithDate() {
        const name = this.name;

        if (this.type === "Block Hours") {
            const fullName = this.fullName;
            const rawDate = fullName.match(/\d{1,2}-\d{4}/g);

            if (rawDate) {
                const formattedDate = format(
                    parseDate(rawDate[0], "MM-yyyy", new Date()),
                    "MMM ''yy"
                );

                return `${name} (${formattedDate})`;
            }
        }
        return name;
    }

    // Full name of the project (used to parse additional information)
    get fullName() {
        return this._data.name;
    }

    // Type of project (MS, Block, Project)
    get type() {
        return this._data.customFields[0].value;
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

    // Total hours on the project
    // NOTE: a little wonky for MS as this is the cumulative amount
    get totalHours() {
        const hours = parseTime(this._data.timeEstimate.estimate).hours ?? 0;
        return hours;
    }

    // Number of hours logged to project as decimal
    get hoursLogged() {
        const hoursLogged = parseTime(this._data.duration).hours ?? 0;
        const minsLogged = parseTime(this._data.duration).minutes ?? 0;

        return hoursLogged + minsLogged / 60;
    }

    // Number of hours remaining to project as decimal
    get hoursRemaining() {
        return (this.totalHours - this.hoursLogged).toFixed(2);
    }

    // Percent of hours logged against total
    get pctHoursUsed() {
        if (this.totalHours == 0) {
            return 0;
        } else {
            return Math.round((this.hoursLogged / this.totalHours) * 100);
        }
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
    customFields: [
        {
            value: string;
        }
    ];
}
