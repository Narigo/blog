<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>{{ article.title }}</title>
  <link rel="stylesheet" href="../../../../styles.css" />
</head>
<body>
<header>
  <nav class="main">
    <a href="../../../../">Main</a>
  </nav>
</header>
<article>
  <h2>{{ article.title }}</h2>
  <div class="data">
    {{ datefmt(article.createdAt) }}
    <span v-if="article.createdAt !== article.lastEditedOn" class="last-edited-on">last edit on {{ datefmt(article.lastEditedOn) }}</span>
  </div>
  <div class="article" v-html="article.content"></div>
</article>
<footer>
  ~
</footer>
</body>
</html>
