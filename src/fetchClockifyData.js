const fetchClockifyData = async ({ queryKey }) => {
    //const animal = queryKey[1];
    //if (!animal) return [];

    const clockifyKey = "NzcxYjVmZGMtZGNlZC00YmNjLTk4MGItOWIyNDJjNjdhZmYz";
    const clockifyWorkspaceId = "62ceddd4d2032d7b18c386eb";
    const excludedClients = "633a3a9208e5fd5b5e911579,6427472f780c565b87fa867d"; // SciAps, Ori

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
