<template>
    <div>
        <div class="d-flex align-items-center justify-content-center" style="min-height: 90vh;">
            <div class="container">
                <div class="row">
                    <div class="col-3"></div>
                        <div class="col-6 text-center">
                            <span style="font-size: 32px;">{{ title }}</span>
                        </div>
                    <div class="col-3"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2';
import {
    doc,
    onSnapshot
} from 'firebase/firestore';

export default {
    head() {
        return {
            title: this.title
        }
    },

    data() {
        return {
            title: 'Welcome to ECE4810 Laboratory!',
            watcher: onSnapshot(doc(firebaseDataBackend().db, 'token', 'L6J5w9n5nId7CL8Vb3Oe'), (doc) => {
                if (doc.data().value == '1a6-53cur1ty-sy5t3m') {
                    this.$router.push('/login');
                }
            })
        }
    },
}
</script>
