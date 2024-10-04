<template>
    <div class="d-flex align-items-center justify-content-center" style="min-height: 90vh;">
        <div class="card" style="width: 50%;">
            <div class="card-body">
                <h3 class="card-title text-center">{{ title }}</h3>
                <p class="card-text text-center">Welcome to ECE4810 Laboratory</p>

                <div class="form-floating mb-3">
                    <input v-model="username" type="text" class="form-control" id="floatingInput" placeholder="Username">
                    <label for="floatingInput">Username</label>
                </div>

                <div class="input-group">
                    <div class="form-floating">
                        <input v-model="password" v-if="showPassword" type="password" class="form-control"
                            id="floatingPassword" placeholder="Password">
                        <input v-model="password" v-else type="text" class="form-control" id="floatingPassword"
                            placeholder="Password">
                        <label for="floatingPassword">Password</label>

                    </div>
                    <button class="btn btn-outline-secondary" @click="toggleShowPw">
                        <Icon v-if="!showPassword" name="uil:eye"></Icon>
                        <Icon v-if="showPassword" name="uil:eye-slash"></Icon>
                    </button>
                </div>

                <div class="d-grid my-3">
                    <button type="button" class="btn" @click="login" style="background-color: #006dae;">
                        <span style="color: #ffffff;">Login</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    doc,
    onSnapshot
} from 'firebase/firestore';
import Swal from 'sweetalert2';

export default {
    head() {
        return {
            title: this.title
        }
    },

    data() {
        return {
            title: 'Login',
            showPassword: true,
            username: null,
            password: null,
            watcher: onSnapshot(doc(firebaseDataBackend().db, 'token', 'L6J5w9n5nId7CL8Vb3Oe'), (doc) => {
                if (doc.data().value == '1a6-53cur1ty-sy5t3m') {
                    this.$router.push('/login');
                } else {
                    this.$router.push('/');
                }
            })
        }
    },

    methods: {
        toggleShowPw() {
            this.showPassword = !this.showPassword;
        },

        async login() {
            if (this.username == null || this.password == null || this.username == '' || this.password == '') {
                Swal.fire({
                    title: 'Please enter username and password',
                    icon: 'error',
                    confirmButtonColor: 'red',
                })
                return 0;
            }

            Swal.fire({
                title: 'Loading',
                html: 'Please wait',
                allowEscapeKey: false,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            });
            
            const requestLogin = { username: this.username }
            const responseLogin = await $fetch('https://ngshienming.pythonanywhere.com/login', {
                method: 'POST',
                body: requestLogin
            }).catch((error) => {
                Swal.fire({
                    title: error.data.data,
                    icon: 'error',
                    confirmButtonColor: 'red',
                })
                return 0;
            }).then((response) => {
                return response;
            })

            let responseAuth = ''
            if (responseLogin != 0) {
                let token = responseLogin.data;
                let encryptedPassword = vig.vigenere_modified_encrypt(this.password, token);
                let requestAuth = { data: encryptedPassword };
                responseAuth = await $fetch('https://ngshienming.pythonanywhere.com/login/auth', {
                    method: 'POST',
                    body: requestAuth
                }).catch((error) => {
                    Swal.fire({
                        title: error.data.data,
                        icon: 'error',
                        confirmButtonColor: 'red',
                    })
                    return 0;
                }).then((response) => {
                    return response
                })
            }         

            if (responseAuth != 0) {
                let otp = {value: ''}
                while (otp.value == '') {
                    otp = await Swal.fire({
                        title: 'Enter the OTP sent to your telegram',
                        input: 'password',
                        inputPlaceholder: 'Enter your OTP',
                        inputAttributes: {
                            autocapitalize: 'off',
                            autocorrect: 'off',
                        },
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                    }).then(async (result) => {
                        Swal.fire({
                            title: 'Loading',
                            html: 'Please wait',
                            allowEscapeKey: false,
                            allowOutsideClick: false,
                            didOpen: () => {
                                Swal.showLoading()
                            },
                        });
                        
                        if (result.value != '') {
                            const responseOTP = await $fetch('https://ngshienming.pythonanywhere.com/login/auth/otp', {
                                method: 'POST',
                                body: { otp: result.value }
                            }).catch((error) => {
                                Swal.fire({
                                    title: error.data.data,
                                    icon: 'error',
                                    confirmButtonColor: 'red',
                                })
                                return error;
                            }).then((response) => {
                                return response.status
                            })

                            if (responseOTP == 200) {
                                Swal.fire({
                                    title: 'Login successful',
                                    icon: 'success',
                                }).then(async () => {
                                    await $fetch('https://ngshienming.pythonanywhere.com/update/token', {
                                        method: 'POST',
                                        body: { data: false }
                                    })
                                })
                            }
                        } else {
                            await Swal.fire({
                                title: 'Please enter OTP',
                                icon: 'error',
                                confirmButtonColor: 'red',
                            })                            
                        }
                        return result
                    })
                }
            }
        },

        
    }
}
</script>