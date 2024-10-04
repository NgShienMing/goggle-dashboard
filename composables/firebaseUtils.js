import { 
    doc,
    query,
    where,
    getDoc,
    getDocs,
    collection,
    updateDoc,
} from 'firebase/firestore';

class FirebaseDataBackend{
    constructor(db){
        this.db = db;
    }

    getAllDocData = async (name) => {
        const collectionRef = collection(this.db, name);
        const response = await getDocs(collectionRef);
        const result = response.docs;
        return result.map(doc => {
            const { id } = doc;
            const index = result.indexOf(doc) + 1;
            const data = doc.data();
            delete data.password;
            return { id, index, ...data };
        })
    }

    getDocData = async (name, conditions) => {
        let queryParams = [];
        for (const condition of conditions) {
            if (condition.type == 'where') {
                queryParams.push(where(condition.key, condition.operator, condition.value))
            }
        }
        let q = query(collection(this.db, name), ...queryParams);
        const querySnapshot = await getDocs(q);
        const result = querySnapshot.docs;
        return result.map(doc => {
            const { id } = doc;
            const data = doc.data();
            return { id, ...data }
        })
    }

    getDocDataById = async (name, id) => {
        const docRef = doc(this.db, name, id);
        const querySnapshot = await getDoc(docRef);
        const result = querySnapshot.data();
        return result
    }

    setDocDataById = async (name, id, data) => {
        const docRef = doc(this.db, name, id);
        await updateDoc(docRef, data)
    }
}

export function firebaseDataBackend() {
    const nuxtApp = useNuxtApp()
    const firestore = new FirebaseDataBackend(nuxtApp.$firestoreDB)
    
    return firestore
}