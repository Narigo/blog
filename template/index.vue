<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Blog</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
<header>
  <h1>Blog</h1>
  <nav class="main">
    <a href="./">Main</a>
  </nav>
</header>
<ol class="articles">
  <li v-for="post in posts.sort((a, b) => a.createdAt < b.createdAt)" class="article">
    <div class="date">{{ datefmt(post.createdAt) }}</div>
    <div class="title"><a :href="link(post)">{{ post.title }}</a></div>
  </li>
</ol>
<footer>
  &copy; 2018 Jörn Bernhardt
</footer>
</body>
</html>
