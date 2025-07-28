import { LoginResponse } from "../kinds";

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
        for (let element of cArray) {
            element = element.trim();
            if (element.indexOf(name + "=") == 0) {
                return element.substring(name.length + 1);
            }
        }
        return "";
    }

    public async deleteCookie(name: string) {
        this.setCookie(name, "", 0);
    }

    public getSessionID() {
        const sessionID: string | null = this.getCookie("sessionID");
        return sessionID;
    }
    
    public async getUserID() {
        const userID: string | null = this.getCookie("userID");
        return userID;
    }

    public async getUserType() {
        const userType: string | null = this.getCookie("userType");
        return userType;
    }

    public saveLoginSession(loginResponse: LoginResponse) {
        this.setCookie("sessionID", loginResponse.sessionID!, 60);
        this.setCookie("userID", loginResponse.userID!, 60);
        this.setCookie("userType", loginResponse.userType!, 60);
    }
}

export const sessionAuthenticator = new SessionAuthenticator();