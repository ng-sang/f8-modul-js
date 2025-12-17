const base_url1="https://youtube-music.f8team.dev/api"

async function testapi() {
    const response =await fetch(`${base_url1}/albums/details/nhc-acoustic-album-16-15  `)
    const data =await response.json()
    console.log(data);
    
}

testapi() 