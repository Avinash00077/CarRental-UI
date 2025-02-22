export const getUserToken = () => {
    try {
        return localStorage.getItem("authToken") || null;
    } catch (error) {
        console.error("Error retrieving token:", error);
        return null;
    }
};
