
class SessionAuthenticator {
    public getCookie(name: string) {
        const cDecoded = decodeURIComponent(document.cookie);
        const cArray = cDecoded.split(";");
        let result: string | null = null;
        cArray.forEach((element: string) => {
            if (element.indexOf(name) == 0) {
                result = element.substring(name.length + 1);
                return;
            }
        });
        if (result !== null) result = result as string;
        return result;
    }

    public async getSessionID() {
        let sessionID: string | null = this.getCookie("sessionID");
        return sessionID;
    }
}

export const sessionAuthenticator = new SessionAuthenticator();