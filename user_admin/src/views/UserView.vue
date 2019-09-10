
<template>
  <div class="container" id="app">

    <div class="wrapper">
      <div class="header">Id</div>
      <div class="header">Username</div>
      <div class="header">Password</div>
      <div class="header">Email</div>
      <div class="header">Edit</div>
      <div class="box">{{ userid }}</div>
      <div class="box">{{ user }}</div>
      <div class="box">{{ pass }}</div>
      <div class="box">{{ email }}</div>
      <div class="box"><a v-bind:href="editUrl">Edit User</a></div>
    </div>

    <table>
      <br>
      <tr>
        <td>
          <router-link style="margin: 20px; font-size: 25px" to="/users">View all users</router-link>
        </td>
      </tr>
      <br>
      <tr>
        <td>
          <router-link style="margin: 20px; font-size: 25px" to="/users/create">Create new user</router-link>
        </td>
      </tr>
    </table>
    <router-view></router-view>

  </div>
</template>

<script>

const axios = require('axios');

export default {
  name: 'UserView',
  props: {
     // 
  },
  data () {
    return {
      id: this.$route.params.id,
      info: null,
      userid: null,
      user: null,
      email: null,
      pass: null,
      editUrl: null
    }
  },  
  created: function() {
      //get_data();
  },
  mounted () {
    axios.get("http://localhost:3000/users/"  + this.$route.params.id).then(r => {
      this.userid = r.data.userid;
      this.user = r.data.name; 
      this.email = r.data.email; 
      this.pass = r.data.pass;
      this.editUrl = "/users/" + this.$route.params.id + "/edit"; 
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
        grid-template-columns: 1fr  1fr  1fr  1fr  1fr ;
        grid-template-rows: auto;
        grid-gap: 10px;
        background-color: #fff;
        color: #444;
        grid-template-areas: 
          "header header header header header"
          "box box box box box"
          "footer";
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

    .footer {
        background-color: #fff;
        padding: 20px;
        font-size: 150%;
        grid-column-start: 1;
        grid-column-end: 1;
    }


</style>
