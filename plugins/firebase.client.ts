import { initializeApp, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();

    const firebaseConfig = {
        apiKey: config.public.apiKey,
        authDomain: config.public.authDomain,
        projectId: config.public.projectId,
        storageBucket: config.public.storageBucket,
        messagingSenderId: config.public.messagingSenderId,
        appId: config.public.appId,
        measurementId: config.public.measurementId,
    };

    const createFirebaseApp = (config: any) => {
        try {
            return getApp();
        } catch (e) {
            return initializeApp(config);
        }
    }
    const firebaseApp = createFirebaseApp(firebaseConfig);
    const firestoreDB = getFirestore(firebaseApp);

    nuxtApp.vueApp.provide('firestoreDB', firestoreDB);
    nuxtApp.provide('firestoreDB', firestoreDB);
})