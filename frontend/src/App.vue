<template>

  <div v-if="!isLoggedIn">
    <!-- Formulaire de création -->
    <form @submit.prevent="createUser">
      <h2>Créer un compte</h2>
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

    <!-- Formulaire de connexion -->
    <form @submit.prevent="loginUser" style="margin-top: 40px;">
      <h2>Connexion</h2>
      <div>
        <label for="loginEmail">Email:</label>
        <input type="email" id="loginEmail" v-model="loginData.email" required placeholder="exemple@email.com" />
      </div>
      <div>
        <label for="loginPassword">Mot de passe:</label>
        <input type="password" id="loginPassword" v-model="loginData.password" required placeholder="Mot de passe" />
      </div>
      <button type="submit">Se connecter</button>
    </form>
  </div>

  <div v-else>
    <h2>Bienvenue, {{ currentUser.username || currentUser.email }}</h2>
    <p>Email : {{ currentUser.email }}</p>
    <button @click="logout">Se déconnecter</button>

    <!-- Formulaire de création de post -->
    <form @submit.prevent="createPost" style="margin-top: 40px;">
      <h2>Créer un post</h2>
      <div>
        <label for="postTitle">Titre :</label>
        <input type="text" id="postTitle" v-model="newPost.title" required placeholder="Titre du post" />
      </div>
      <div>
        <label for="postContent">Contenu :</label>
        <textarea id="postContent" v-model="newPost.content" required placeholder="Contenu du post"></textarea>
      </div>
      <button type="submit">Publier</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  setup() {
    const isLoggedIn = ref(false)
    const currentUser = ref({})
    const authToken = ref('')

    // Formulaire d'inscription
    const newUser = ref({
      username: '',
      email: '',
      password: ''
    })

    // Formulaire de connexion
    const loginData = ref({
      email: '',
      password: ''
    })

    // Créer un utilisateur
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
        .then(() => {
          newUser.value = { username: '', email: '', password: '' }
          alert('Utilisateur créé avec succès!')
        })
        .catch(() => {
          alert('Erreur lors de la création de l\'utilisateur')
        })
    }

    // Connexion utilisateur
    const loginUser = () => {
      if (!loginData.value.email || !loginData.value.password) {
        alert('Veuillez remplir tous les champs')
        return
      }
      axios.post('http://localhost:3000/api/user/login', {
        email: loginData.value.email,
        password: loginData.value.password
      })
        .then(res => {
          const token = res.data.token
          authToken.value = token
          localStorage.setItem('token', token)
          // Décoder le token pour récupérer les infos utilisateur (simple version)
          const payload = JSON.parse(atob(token.split('.')[1]))
          currentUser.value = {
            email: payload.email,
            userId: payload.userId
          }
          isLoggedIn.value = true
          loginData.value = { email: '', password: '' }
        })
        .catch(() => {
          alert('Email ou mot de passe incorrect')
        })
    }

    // Déconnexion
    const logout = () => {
      authToken.value = ''
      currentUser.value = {}
      isLoggedIn.value = false
      localStorage.removeItem('token')
    }

    // Vérifier si déjà connecté (persistance)
    onMounted(() => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          // Vérifier expiration
          if (payload.exp * 1000 > Date.now()) {
            authToken.value = token
            currentUser.value = {
              email: payload.email,
              userId: payload.userId
            }
            isLoggedIn.value = true
          } else {
            localStorage.removeItem('token')
          }
        } catch (e) {
          localStorage.removeItem('token')
        }
      }
    })

    // Création de post
    const newPost = ref({
      title: '',
      content: ''
    })

    const createPost = () => {
      if (!newPost.value.title || !newPost.value.content) {
        alert('Veuillez remplir tous les champs du post')
        return
      }
      const token = authToken.value || localStorage.getItem('token')
      axios.post('http://localhost:3000/api/post', {
        user: currentUser.value.userId,
        title: newPost.value.title,
        content: newPost.value.content
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(() => {
          alert('Post créé avec succès !')
          newPost.value = { title: '', content: '' }
        })
        .catch(() => {
          alert('Erreur lors de la création du post')
        })
    }

    return {
      newUser,
      createUser,
      loginData,
      loginUser,
      isLoggedIn,
      currentUser,
      logout,
      newPost,
      createPost
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
