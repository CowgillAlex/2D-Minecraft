import Utils from "./utils.js";
class Networking {
    static fetchJson(url) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch data from ${url}. Status: ${response.status} (${response.statusText})`);
                }
                return response.json();
            })
            .then(data => {
                Utils.log("log", `Successfully retrieved data from ${url}:`, data);
            })
            .catch(error => {
                Utils.log("error", `An error occurred while fetching data from ${url}:`, error.message);
            });
    }
}

export default Networking