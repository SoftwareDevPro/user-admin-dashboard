
<template>
  <div class='wrapper' id="app">
    
      <div class="header">Id</div>
      <div class="header">User</div>
      <div class="header">Password</div>
      <div class="header">Email</div>
      <div class="header">Profile</div> 
      <div class="header">Destroy</div>

    <template v-for="user in users">
        <div>{{user.id}}</div>
        <div>{{ user.name }}</div>
        <div>{{ user.pass }}</div>
        <div>{{ user.email }}</div>        
        <div v-html="user.link"></div>
        <div v-html="user.destroy"></div>
    </template>

    <router-link class="btn btn-success" to="/users/create">Create new user</router-link>
    <router-view></router-view>

  </div>

</template>

<script>

const axios = require('axios');

export default {
  name: 'Users',
  data() {
    return {
      users: []
    }
  },
  props: {
    //
  },
  created: function() {
    //
  },
  mounted () {
    axios.get("http://localhost:3000/users").then(r => {

      for(let idx = 0; idx < r.data.length; idx++) {
        this.users.push({
          id: r.data[idx].userid,
          name: r.data[idx].name,
          pass: r.data[idx].pass,
          email: r.data[idx].email,
          link: "<a href='/users/" + r.data[idx].userid + "'>View Profile</a>",
          destroy: "<form action='http://localhost:3000/users/delete/" + r.data[idx].userid + "' method='post'>" + 
              "<button style='background-color: white; border: none' type='submit'>" +
              "<i class='fa fa-times-circle'></i>" +
              "</button" + 
              "</form>"
        });
      }
    });
  }  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  body {
    margin: 40px;
  }

.wrapper {
  display: grid;
  grid-template-columns: auto auto auto auto auto auto;
  grid-gap: 10px;
  background-color: #fff;
  color: #444;
}

.header {
  background-color: #444;
  color: #fff;
  border-radius: 5px;
  padding: 20px;
  font-size: 150%;
}

.box {
  background-color: #fff;
  border: 2px solid black;
  border-radius: 5px;
  padding: 20px;
  font-size: 150%;
}

</style>
