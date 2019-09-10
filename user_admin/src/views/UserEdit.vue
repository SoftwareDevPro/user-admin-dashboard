<template>
    <div class='container wrapper' id="app">
      <div class="header text-left">
        Editing {{ user }}
      </div>
      <br>
      <form class="form-group wrapper" method="POST" v-bind:action="editUrl">
          <input class="box form-control" type="text" name="name" placeholder="name"  v-bind:value="user" required/>
          <input class="box form-control" type="text" name="pass" placeholder="password"  v-bind:value="pass" required/>    
          <input class="box form-control" type="email" name="email" placeholder="email" v-bind:value="email" required/>
          <br>
          <button style="width: 10%;" type="submit" class="btn btn-primary">Submit</button>
          <router-link class="text-left" to="/users">View all users</router-link>
      </form>
    </div>
</template>

<script>
const axios = require('axios');

export default {
  name: 'UserEdit',
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
  mounted () {
    axios.get("http://localhost:3000/users/"  + this.$route.params.id).then(r => {
      this.userid = r.data.userid;
      this.user = r.data.name; 
      this.email = r.data.email; 
      this.pass = r.data.pass;
      this.editUrl = "http://localhost:3000/users/edit/" + this.$route.params.id;
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
        grid-template-columns: auto;
        grid-template-rows: auto auto auto auto auto;
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
