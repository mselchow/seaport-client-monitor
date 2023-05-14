const fetchClockifyData = async ({ queryKey }) => {
    //const animal = queryKey[1];
    //if (!animal) return [];

    const clockifyKey = "***REMOVED***";
    const clockifyWorkspaceId = "***REMOVED***";
    const excludedClients = "***REMOVED***"; // ***REMOVED***

    const apiURL =
        "https://api.clockify.me/api/v1/workspaces/" +
        clockifyWorkspaceId +
        "/projects?hydrated=true&archived=false&clients=" +
        excludedClients +
        "&contains-client=false";

    const apiHeaders = { "X-Api-Key": clockifyKey };

    const apiRes = await fetch(apiURL, { headers: apiHeaders });

    if (!apiRes.ok) {
        throw new Error(`Clockify fetch not ok`);
    }

    return apiRes.json();
};

export default fetchClockifyData;
