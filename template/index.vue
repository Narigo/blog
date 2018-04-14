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
  <h1>Random thoughts</h1>
  <nav class="main">
    <ul>
      <li><a href="./">Main</a></li>
      <li><a href="./imprint.html">Imprint</a></li>
    </ul>
  </nav>
</header>
<section class="intro">
  <h2>Hi there!</h2>
  <p>Here are some random thoughts and things I've done and written about. I'll try to do one post each month and practice my writing.<br/>
  <span class="author">Joern</span></p>
</section>
<section class="index">
  <ol class="articles">
    <li v-for="post in posts.sort((a, b) => a.createdAt < b.createdAt)" class="article">
      <div class="date">{{ datefmt(post.createdAt) }}</div>
      <div class="title"><a :href="link(post)">{{ post.title }}</a></div>
    </li>
  </ol>
</section>
<footer>
  &copy; 2018 Jörn Bernhardt
</footer>
</body>
</html>
