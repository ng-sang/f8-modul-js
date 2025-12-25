const base_url1="https://youtube-music.f8team.dev/api"
//explore/videos


async function testapi() {
    const response =await fetch(`${base_url1}/moods/energize`)
    const data =await response.json()
    console.log(data);
    
}

async function testapivideo() {
    const response =await fetch(`${base_url1}/moods/`)
    const data =await response.json()
      console.log(data); 
    // data.map((data)=>{console.log(data);
    // })
}
testapi();
testapivideo()
