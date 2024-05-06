class RetrievalAPI {
    fetchSingleClaimCheck(claim) {
        return {
            LABEL: "True",
            EXCERPT: claim,
            EXPLANATION: "This reason was determined false because fuck you",
            SOURCES: [
                "cnn.com", "bbc.com"
            ]
        }
    }
}

export const retrievalAPI = new RetrievalAPI()