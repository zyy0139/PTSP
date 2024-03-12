<script setup>
  import "@/assets/js/_lib"
</script>

<template>
  <head>
    <meta charset="UTF-8">
    <title>该页面不存在</title>
    <link rel="shortcut icon" href="../../public/favicon.ico">
    <link rel="stylesheet" type="text/css" href="../assets/css/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="../assets/css/all.css" />
  </head>
  <div id="pb_position"></div>
  <div class="container">
    <div class="notfind_wrapper">
      <img class="notfind" src="../assets/404.png" alt="">
      <span class="">很抱歉，您访问的页面去月球了~~</span>
      <a href="http://localhost:8000/login">返回首页</a>
    </div>
  </div>
</template>

<style scoped>
.notfind_wrapper{position: relative;}
.notfind{ margin: 150px auto 0 auto; display: block;}
.notfind_wrapper span{
  position: absolute;
  top: 36%;
  left: 42%;
  color: #999999;
  font-size: 18px;
}
.notfind_wrapper a{
  position: absolute;
  top: 43%;
  left: 47%;
  border: 2px solid #94BFF3;
  color: #94BFF3;
  border-radius: 15px;
  padding: 2px 14px;
  font-size: 15px;
}
</style>