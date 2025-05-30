
class SessionAuthenticator {
    public getCookie(name: string) {
        const cDecoded = decodeURIComponent(document.cookie);
        const cArray = cDecoded.split(";");
        let result = null;
        cArray.forEach((element: string) => {
            if (element.indexOf(name) == 0) {
                result = element.substring(name.length + 1);
                return;
            }
        });
        return result;
    }

    public async isSessionVerified() {
        let sessionID: string | null = this.getCookie("sessionID");
        if (sessionID === null) {
            return false;
        }
        return true;
    }
}

export const sessionAuthenticator = new SessionAuthenticator();