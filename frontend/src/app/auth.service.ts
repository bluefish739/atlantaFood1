import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import {
    Auth, getAuth, onAuthStateChanged, User, signOut,
    createUserWithEmailAndPassword, signInWithEmailAndPassword
} from "firebase/auth";


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth?: Auth;
    private uid: string | null = null;
    private token: string | null = null;

    constructor(private http: HttpClient) {
        // Your web app's Firebase configuration
        // For Firebase JS SDK v7.20.0 and later, measurementId is optional
        const firebaseConfig = {
            apiKey: "AIzaSyDXZFYhu4MQrlhHsk8uGuakHKwulxmk3TU",
            authDomain: "lab-projx.firebaseapp.com",
            projectId: "lab-projx",
            storageBucket: "lab-projx.firebasestorage.app",
            messagingSenderId: "37791437540",
            appId: "1:37791437540:web:e8d7c74d0b43bc459e92f1",
            measurementId: "G-E8N2GQS3H5"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        // Initialize Firebase Authentication and get a reference to the service
        this.auth = getAuth(app);

        onAuthStateChanged(this.auth, (user) => { this.onAuthStateChanged(user); });
    }

    private async onAuthStateChanged(user: User | null) {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            this.uid = user.uid;
            this.token = await user.getIdToken();
            console.log('onAuthStateChanged: signed in', user);
        } else {
            console.log('onAuthStateChanged: signed out');
            this.uid = null;
            this.token = null;
        }
    }

    public getUid() {
        return this.uid;
    }

    public getToken() {
        return this.token;
    }

    public async signUp(email: string, password: string) {
        if (!this.auth) {
            return false;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            // Signed up 
            const user = userCredential.user;
            this.uid = user.uid;
            this.token = await user.getIdToken();
            console.log('signUp: signed in', user);
            return true;
        } catch (error: any) {
            console.log('signInWithEmailAndPassword failed', error);
            const errorCode = error.code;
            const errorMessage = error.message;
            return false;
        }
    }

    public async signIn(email: string, password: string) {
        if (!this.auth) {
            return false;
        }
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            // Signed in 
            const user = userCredential.user;
            this.uid = user.uid;
            this.token = await user.getIdToken();
            console.log('signIn: signed in', user);
            return true;
        } catch (error: any) {
            console.log('signInWithEmailAndPassword failed', error);
            const errorCode = error.code;
            const errorMessage = error.message;
            return false;
        }
    }

    public async signOut() {
        if (!this.auth) {
            return false;
        }
        await signOut(this.auth);
        return true;
    }
}
