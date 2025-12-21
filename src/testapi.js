const base_url1="https://youtube-music.f8team.dev/api"
//explore/videos

//videos/details/ 
// async function testapi() {
//     const response =await fetch(`${base_url1}/lines`)
//     const data =await response.json()
//     console.log(data);
    
// }


async function testapivideo() {
    const response =await fetch(`${base_url1}/lines/l-h-i-3/songs`)
    const data =await response.json()
    console.log(data);
    
}
 testapivideo()
// testapi();