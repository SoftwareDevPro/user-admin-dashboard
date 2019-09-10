<template>
  <div class='container' id="app">
    <form class="form-group wrapper" method="POST" action="http://localhost:3000/users/create">
        <input class="form-control" type="text" name="name" placeholder="name" required/>
        <input class="form-control" type="text" name="pass" placeholder="password"  required/>    
        <input class="form-control" type="email" name="email" placeholder="email"  required/>
        <button style="width: 10%;" type="submit" class="btn btn-primary">Submit</button>
        <router-link to="/users">View all users</router-link>
    </form>
  </div>
</template>

<script>

export default {
  name: 'UserCreate',
  props: {
      //
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
        grid-template-rows: auto auto auto auto auto;
        grid-template-columns: auto;
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
