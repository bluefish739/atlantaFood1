
class SessionAuthenticator {
    public setCookie(name: string, value: string, minutesToLive: number) {
        const date = new Date();
        date.setTime(date.getTime() + minutesToLive * 60 * 1000);
        let expires = `expires=${date.toUTCString()}`
        document.cookie = `${name}=${value}; ${expires}; path=/`
    }

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

    public async deleteCookie(name: string) {
        this.setCookie(name, "", 0);
    }

    public async getSessionID() {
        let sessionID: string | null = this.getCookie("sessionID");
        return sessionID;
    }
}

export const sessionAuthenticator = new SessionAuthenticator();