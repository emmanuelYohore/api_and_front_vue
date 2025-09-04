<template>

  <!-- Formulaire de création -->
  <form @submit.prevent="createUser">
    <div>
      <label for="username">Username:</label>
      <input type="text" id="username" v-model="newUser.username" required placeholder="username" />
    </div>

    <div>
      <label for="email">Email:</label>
      <input type="email" id="email" v-model="newUser.email" required placeholder="exemple@email.com" />
    </div>

    <div>
      <label for="password">Mot de passe:</label>
      <input type="password" id="password" v-model="newUser.password" required placeholder="Mot de passe" />
    </div>

    <button type="submit">Créer un compte</button>
  </form>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'


export default {

  setup() {

    const isLoggedIn = ref(false)
    const currentUser = ref({})
    const authToken = ref('')

    const newUser = ref({
      username: '',
      email: '',
      password: ''
    })

    const createUser = () => {
      if (!newUser.value.username || !newUser.value.email || !newUser.value.password) {
        alert('Veuillez remplir tous les champs')
        return
      }

      axios.post('http://localhost:3000/api/user/register', {
        username: newUser.value.username,
        email: newUser.value.email,
        password: newUser.value.password
      })
        .then(res => {
          console.log('Utilisateur créé:', res.data)

          newUser.value = {
            username: '',
            email: '',
            password: ''
          }

          alert('Utilisateur créé avec succès!')
        })
        .catch(error => {
          console.error('Erreur lors de la création:', error)
          alert('Erreur lors de la création de l\'utilisateur')
        })
    }

    onMounted(() => {

    })

    return {
      newUser,
      createUser
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
