// Use dynamic imports for ESM and node REPL compatibility, not necessary otherwise.
const axios = (await import("axios")).default;
// const FormData = (await import("form-data")).default;
// const process = (await import("process")).default;
// const tar = (await import("tar")).default;

// Make sure to provide your actual API key here.
const SINDRI_API_KEY = "";

// Use v1 of the Sindri API.
axios.defaults.baseURL = "https://sindri.app/api/v1";
// Authorize all future requests with an `Authorization` header.
axios.defaults.headers.common["Authorization"] = `Bearer ${SINDRI_API_KEY}`;
// Expect 2xx responses for all requests.
axios.defaults.validateStatus = (status) => status >= 200 && status < 300;

export async function getProof(client_add, doc_add, med_details, use_once, freq, med_hash, detail_hash, hashed_msg, pub_x, pub_y, sign){
    const proofInput = `doc_address = "${doc_add}"\nclient_address = "${client_add}"\nuse_once = ${use_once}\nfreq = ${freq}\nmed_details = [${med_details}]\nmed_hash = "${med_hash}"\ndetail_hash = "${detail_hash}"\nhashed_message = [${hashed_msg}]\npub_key_x_solver = [${pub_x}]\npub_key_y_solver = [${pub_y}]\nsignature_solver = [${sign}]`;
    const proveResponse = await axios.post(`/circuit/be99db83-f685-413c-bc99-8ad9fdbde6f9/prove`, {
        proof_input: proofInput,
    });
    const proofId = proveResponse.data.proof_id;
    console.log("Proof ID:", proofId);
    let startTime = Date.now();
    let proofDetailResponse;
    while (true) {
        proofDetailResponse = await axios.get(`/proof/${proofId}/detail`);
        const { status } = proofDetailResponse.data;
        const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
        if (status === "Ready") {
            console.log(`Polling succeeded after ${elapsedSeconds} seconds.`);
            break;
        } else if (status === "Failed") {
            throw new Error(
            `Polling failed after ${elapsedSeconds} seconds: ${proofDetailResponse.data.error}.`,
            );
        } else if (Date.now() - startTime > 30 * 60 * 1000) {
            throw new Error("Timed out after 30 minutes.");
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    console.log(proofDetailResponse.data.public, "public")
    return proofDetailResponse.data.proof["proof"]
}

export function padHash(hash){
    let newHash = "0x";
    for(let i=0; i<64-hash.length; i++){
        newHash+="0"
    }
    return newHash+hash
}