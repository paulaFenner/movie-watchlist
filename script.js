fetch('http://www.omdbapi.com/?i=tt3896198&apikey=941f3a17')
  .then((res) => res.json())
  .then((data) => console.log(data));
