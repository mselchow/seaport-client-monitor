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
        const hours = Number(
            getStringBetween(this._data.timeEstimate.estimate, "PT", "H")
        );
        return hours;
    }

    // Number of hours logged to project as decimal
    get hoursLogged() {
        const hoursLogged = Number(
            getStringBetween(this._data.duration, "PT", "H")
        );
        const minsLogged = Number(
            getStringBetween(this._data.duration, "H", "M")
        );

        return hoursLogged + minsLogged / 60;
    }

    // Number of hours remaining to project as decimal
    get hoursRemaining() {
        return (this.totalHours - this.hoursLogged).toFixed(2);
    }

    // Percent of hours logged against total
    get pctHoursUsed() {
        return Math.round((this.hoursLogged / this.totalHours) * 100);
    }
}

export interface ClockifyJSON {
    id: string;
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

/**
 * Helper method to parse Clockify time strings. Returns the string found
 * between "start" and "end."
 */
function getStringBetween(str: string, start: string, end: string) {
    const result = str.match(new RegExp(start + "(.*)" + end));
    return result === null ? 0 : result[1];
}
